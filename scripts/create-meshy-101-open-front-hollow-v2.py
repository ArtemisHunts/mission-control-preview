#!/usr/bin/env python3
import json
import math
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
SOURCE_GLB = ROOT / 'assets' / 'meshy' / 'api' / '101-open-front-hollow-asteroid-baseline-v2.meshy.glb'
OUT_BLEND = ROOT / 'assets' / 'blender' / 'meshy-101-open-front-hollow-v2.blend'
OUT_GLB = ROOT / 'assets' / 'blender' / 'meshy-101-open-front-hollow-runtime-v2.glb'
OUT_RENDER = ROOT / 'docs' / 'visual-reviews' / '2026-05-19-meshy-101-open-front-hollow-v2.png'
OUT_REPORT = ROOT / 'docs' / 'visual-reviews' / '2026-05-19-meshy-101-open-front-hollow-v2.md'
OUT_METRICS = ROOT / 'docs' / 'visual-reviews' / '2026-05-19-meshy-101-open-front-hollow-v2.json'

TARGET_WIDTH = 17.0
SOURCE_ROTATION_Z = math.radians(26.0)
DECIMATE_RATIO = 0.20


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()


def make_mat(name, color, metallic=0.02, roughness=0.9, emission=None, strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = roughness
    if emission:
        bsdf.inputs['Emission Color'].default_value = emission
        bsdf.inputs['Emission Strength'].default_value = strength
    return mat


def bounds(obj):
    pts = [obj.matrix_world @ Vector(corner) for corner in obj.bound_box]
    mn = Vector((min(p.x for p in pts), min(p.y for p in pts), min(p.z for p in pts)))
    mx = Vector((max(p.x for p in pts), max(p.y for p in pts), max(p.z for p in pts)))
    return mn, mx, mx - mn


def stats(obj):
    obj.data.update(calc_edges=True)
    obj.data.calc_loop_triangles()
    mn, mx, size = bounds(obj)
    return {
        'vertices': len(obj.data.vertices),
        'edges': len(obj.data.edges),
        'polygons': len(obj.data.polygons),
        'triangles': len(obj.data.loop_triangles),
        'materials': len(obj.data.materials),
        'bounds': [round(size.x, 4), round(size.y, 4), round(size.z, 4)],
        'min': [round(mn.x, 4), round(mn.y, 4), round(mn.z, 4)],
        'max': [round(mx.x, 4), round(mx.y, 4), round(mx.z, 4)],
    }


def import_source():
    before = set(bpy.context.scene.objects)
    bpy.ops.import_scene.gltf(filepath=str(SOURCE_GLB))
    meshes = [obj for obj in bpy.context.scene.objects if obj not in before and obj.type == 'MESH']
    if not meshes:
        raise RuntimeError('No mesh imported')
    bpy.ops.object.select_all(action='DESELECT')
    for mesh in meshes:
        mesh.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.join()
    obj = bpy.context.object
    obj.name = 'meshy_101_open_front_hollow_v2_runtime'
    obj.data.name = 'meshy_101_open_front_hollow_v2_mesh'
    return obj


def normalize(obj):
    obj.rotation_euler[2] = SOURCE_ROTATION_Z
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)

    _, _, size = bounds(obj)
    factor = TARGET_WIDTH / max(size.x, 0.0001)
    obj.scale = (factor, factor, factor)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    mn, mx, _ = bounds(obj)
    offset = Vector(((mn.x + mx.x) * 0.5, (mn.y + mx.y) * 0.5, mn.z))
    for vertex in obj.data.vertices:
        vertex.co -= offset
    obj.location = (0, 0, 0)
    obj.data.update()


def add_cutter(name, location, scale, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(location=location, scale=scale)
    cutter = bpy.context.object
    cutter.name = name
    if bevel:
        bevel_mod = cutter.modifiers.new(name='softened cutter corners', type='BEVEL')
        bevel_mod.width = bevel
        bevel_mod.segments = 10
        bpy.ops.object.modifier_apply(modifier=bevel_mod.name)
    return cutter


def boolean_difference(target, cutter):
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = target
    target.select_set(True)
    mod = target.modifiers.new(name=f'carve {cutter.name}', type='BOOLEAN')
    mod.operation = 'DIFFERENCE'
    mod.object = cutter
    mod.solver = 'EXACT'
    bpy.ops.object.modifier_apply(modifier=mod.name)
    cutter.hide_viewport = True
    cutter.hide_render = True


def carve_more_interior(obj):
    # Front is negative Y in the proof camera. These cutters remove mass from the open face
    # and then widen the usable cavity while deliberately leaving a visible rock rim.
    cutters = [
        add_cutter('v2 main open-front interior volume cutter', (0.0, -3.15, 4.65), (5.95, 5.15, 3.55), 0.95),
        add_cutter('v2 lower prop floor clearance cutter', (0.0, -2.75, 1.72), (5.30, 4.45, 0.82), 0.45),
        add_cutter('v2 upper ceiling clearance cutter', (0.0, -2.60, 8.05), (4.75, 3.80, 1.25), 0.55),
        add_cutter('v2 left side wall thinning cutter', (-5.15, -2.45, 4.75), (1.10, 3.80, 2.65), 0.40),
        add_cutter('v2 right side wall thinning cutter', (5.15, -2.45, 4.75), (1.10, 3.80, 2.65), 0.40),
    ]
    for cutter in cutters:
        boolean_difference(obj, cutter)


def cleanup_mesh(obj):
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)

    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.remove_doubles(threshold=0.018)
    bpy.ops.mesh.delete_loose()
    bpy.ops.object.mode_set(mode='OBJECT')

    decimate = obj.modifiers.new('runtime_decimate_ratio_0_20', 'DECIMATE')
    decimate.ratio = DECIMATE_RATIO
    decimate.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier=decimate.name)

    for poly in obj.data.polygons:
        poly.use_smooth = True
    obj.data.materials.clear()
    obj.data.materials.append(make_mat('meshy 101 hollow v2 dark basalt', (0.15, 0.14, 0.125, 1.0)))
    obj.data.update()


def block(name, location, scale, mat):
    bpy.ops.mesh.primitive_cube_add(location=location, scale=scale)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    return obj


def proof_helpers():
    deck = make_mat('v2 proof deck metal', (0.35, 0.34, 0.31, 1.0), 0.16, 0.62)
    cyan = make_mat('v2 proof cyan holo', (0.05, 0.38, 0.58, 1.0), 0.0, 0.34, (0.20, 0.90, 1.0, 1.0), 1.4)
    amber = make_mat('v2 proof amber work lights', (0.75, 0.50, 0.18, 1.0), 0.0, 0.45, (1.0, 0.55, 0.13, 1.0), 0.9)
    block('v2 wider main prop floor proxy', (0.0, -1.02, 0.78), (5.95, 1.55, 0.07), deck)
    block('v2 wide upper operations deck proxy', (0.0, -0.38, 2.26), (5.35, 1.34, 0.075), deck)
    block('v2 central holo table proxy', (0.0, -1.28, 1.08), (0.86, 0.36, 0.08), cyan)
    for x in (-4.2, -2.1, 2.1, 4.2):
        block('v2 wider bay prop clearance marker', (x, -1.78, 1.36), (0.18, 0.05, 0.05), amber)


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()


def setup_render(obj):
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.eevee.taa_render_samples = 64
    scene.render.image_settings.file_format = 'PNG'
    scene.render.resolution_x = 1800
    scene.render.resolution_y = 1080
    scene.view_settings.view_transform = 'Filmic'
    scene.view_settings.look = 'Medium High Contrast'
    scene.world = bpy.data.worlds.new('v2 proof dark world')
    scene.world.color = (0.006, 0.008, 0.012)
    bpy.ops.object.light_add(type='AREA', location=(-2.0, -8.5, 8.5))
    key = bpy.context.object
    key.name = 'v2 broad cool key'
    key.data.energy = 820
    key.data.size = 6.0
    bpy.ops.object.light_add(type='AREA', location=(5.0, -5.2, 5.4))
    rim = bpy.context.object
    rim.name = 'v2 cyan rim'
    rim.data.energy = 310
    rim.data.size = 4.0
    rim.data.color = (0.38, 0.82, 1.0)
    bpy.ops.object.camera_add(location=(0.0, -19.0, 5.2))
    cam = bpy.context.object
    cam.name = 'v2 hollow frontal proof camera'
    cam.data.type = 'ORTHO'
    cam.data.ortho_scale = 12.4
    look_at(cam, (0.0, -0.45, 3.15))
    scene.camera = cam
    obj.rotation_euler[2] = math.radians(-3.0)


def export_runtime(obj):
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.export_scene.gltf(
        filepath=str(OUT_GLB),
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_materials='EXPORT',
    )


def write_report(raw, carved):
    metrics = {
        'source': str(SOURCE_GLB.relative_to(ROOT)),
        'sourceSizeBytes': SOURCE_GLB.stat().st_size,
        'runtimeGlb': str(OUT_GLB.relative_to(ROOT)),
        'runtimeSizeBytes': OUT_GLB.stat().st_size,
        'blend': str(OUT_BLEND.relative_to(ROOT)),
        'render': str(OUT_RENDER.relative_to(ROOT)),
        'decimateRatio': DECIMATE_RATIO,
        'targetWidth': TARGET_WIDTH,
        'rawStats': raw,
        'runtimeStats': carved,
        'triangleReduction': round(1.0 - (carved['triangles'] / raw['triangles']), 4),
        'sizeReduction': round(1.0 - (OUT_GLB.stat().st_size / SOURCE_GLB.stat().st_size), 4),
    }
    OUT_METRICS.write_text(json.dumps(metrics, indent=2) + '\n')
    OUT_REPORT.write_text(f'''# Meshy 101 Open-Front Hollow V2 - 2026-05-19

## Direction

Michael liked the Meshy-101 surface read but asked for more usable interior space and thinner walls overall. This pass keeps the v1 candidate intact and creates a separate carved v2 artifact.

## Output

- Blender source: {metrics['blend']}
- Runtime GLB: {metrics['runtimeGlb']}
- Optimized runtime GLB: assets/blender/meshy-101-open-front-hollow-runtime-v2.optimized.glb
- Proof render: {metrics['render']}
- Browser proof: docs/visual-reviews/2026-05-19-meshy-101-hollow-v2-browser-proof.png
- Metrics JSON: {OUT_METRICS.relative_to(ROOT)}

## Metrics

- Source: {raw['vertices']:,} vertices / {raw['triangles']:,} triangles / {SOURCE_GLB.stat().st_size:,} bytes
- V2 runtime: {carved['vertices']:,} vertices / {carved['triangles']:,} triangles / {OUT_GLB.stat().st_size:,} bytes
- Runtime bounds: {carved['bounds']}
- Triangle reduction vs source: {metrics['triangleReduction'] * 100:.1f}%
- Size reduction vs source: {metrics['sizeReduction'] * 100:.1f}%

## Carve Notes

- Expanded the open-front interior volume with broad rounded boolean cuts.
- Added floor, ceiling, and side-wall clearance cuts to create more prop-usable volume.
- Kept a visible rim and rear mass so the asteroid still reads as a shell, not just loose scenery.

## Verification

- Blender 5.1.1 generates the carved source, runtime GLB, proof render, and metrics JSON.
- Run glTF Transform optimization after generation: assets/blender/meshy-101-open-front-hollow-runtime-v2.optimized.glb.
- Validate the optimized runtime GLB before wiring it as active preview.

## Status

V2 is the new visual candidate for thinner walls and larger interior space. It is intended to be wired as the active local preview asset after optimized GLB validation, but still needs human visual acceptance before it becomes the final accepted baseline.
''')
    print(json.dumps(metrics, indent=2))


def main():
    clear_scene()
    obj = import_source()
    raw = stats(obj)
    normalize(obj)
    carve_more_interior(obj)
    cleanup_mesh(obj)
    carved = stats(obj)
    setup_render(obj)
    proof_helpers()
    OUT_BLEND.parent.mkdir(parents=True, exist_ok=True)
    OUT_GLB.parent.mkdir(parents=True, exist_ok=True)
    OUT_RENDER.parent.mkdir(parents=True, exist_ok=True)
    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)
    export_runtime(obj)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT_BLEND))
    bpy.context.scene.render.filepath = str(OUT_RENDER)
    bpy.ops.render.render(write_still=True)
    write_report(raw, carved)


if __name__ == '__main__':
    main()
