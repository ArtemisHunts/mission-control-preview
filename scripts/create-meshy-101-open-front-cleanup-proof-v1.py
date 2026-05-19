#!/usr/bin/env python3
import json
import math
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
SOURCE_GLB = ROOT / 'assets' / 'meshy' / 'api' / '101-open-front-hollow-asteroid-baseline-v2.meshy.glb'
OUT_BLEND = ROOT / 'assets' / 'blender' / 'meshy-101-open-front-cleanup-proof-v1.blend'
OUT_GLB = ROOT / 'assets' / 'blender' / 'meshy-101-open-front-clean-runtime-v1.glb'
OUT_RENDER = ROOT / 'docs' / 'visual-reviews' / '2026-05-19-meshy-101-open-front-cleanup-proof-v1.png'
OUT_REPORT = ROOT / 'docs' / 'visual-reviews' / '2026-05-19-meshy-101-open-front-cleanup-proof-v1.md'
OUT_METRICS = ROOT / 'docs' / 'visual-reviews' / '2026-05-19-meshy-101-open-front-cleanup-proof-v1.json'

TARGET_WIDTH = 17.0
SOURCE_ROTATION_Z = math.radians(26.0)
DECIMATE_RATIO = 0.22


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for block in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.lights, bpy.data.cameras):
        for item in list(block):
            if item.users == 0:
                block.remove(item)


def make_collection(name):
    collection = bpy.data.collections.new(name)
    bpy.context.scene.collection.children.link(collection)
    return collection


def link_to_collection(obj, collection):
    for current in list(obj.users_collection):
        current.objects.unlink(obj)
    collection.objects.link(obj)


def import_source():
    before = {obj.name for obj in bpy.context.scene.objects}
    bpy.ops.import_scene.gltf(filepath=str(SOURCE_GLB))
    imported = [obj for obj in bpy.context.scene.objects if obj.name not in before]
    meshes = [obj for obj in imported if obj.type == 'MESH']
    if not meshes:
        raise RuntimeError('No mesh objects imported from source GLB')

    bpy.ops.object.select_all(action='DESELECT')
    for obj in meshes:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.join()
    source = bpy.context.object
    source.name = 'meshy_101_open_front_v2_raw_source'
    source.data.name = 'meshy_101_open_front_v2_raw_source_mesh'
    return source


def bounds_for_objects(objects):
    coords = []
    for obj in objects:
        if obj.type != 'MESH':
            continue
        coords.extend(obj.matrix_world @ Vector(corner) for corner in obj.bound_box)
    if not coords:
        raise RuntimeError('No bounds available')
    mn = Vector((min(v.x for v in coords), min(v.y for v in coords), min(v.z for v in coords)))
    mx = Vector((max(v.x for v in coords), max(v.y for v in coords), max(v.z for v in coords)))
    return mn, mx, mx - mn


def mesh_stats(obj):
    obj.data.update(calc_edges=True)
    obj.data.calc_loop_triangles()
    mn, mx, size = bounds_for_objects([obj])
    return {
        'name': obj.name,
        'vertices': len(obj.data.vertices),
        'edges': len(obj.data.edges),
        'polygons': len(obj.data.polygons),
        'triangles': len(obj.data.loop_triangles),
        'materials': len(obj.data.materials),
        'bounds': [round(size.x, 4), round(size.y, 4), round(size.z, 4)],
        'min': [round(mn.x, 4), round(mn.y, 4), round(mn.z, 4)],
        'max': [round(mx.x, 4), round(mx.y, 4), round(mx.z, 4)],
    }


def normalize_mesh_object(obj):
    obj.rotation_euler[2] = SOURCE_ROTATION_Z
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)

    mn, mx, size = bounds_for_objects([obj])
    scale = TARGET_WIDTH / max(size.x, 0.0001)
    obj.scale = (scale, scale, scale)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    mn, mx, size = bounds_for_objects([obj])
    offset = Vector(((mn.x + mx.x) * 0.5, (mn.y + mx.y) * 0.5, mn.z))
    for vertex in obj.data.vertices:
        vertex.co -= offset
    obj.location = (0.0, 0.0, 0.0)
    obj.data.update()


def cleanup_runtime_mesh(obj):
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)

    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.remove_doubles(threshold=0.015)
    bpy.ops.mesh.delete_loose()
    bpy.ops.object.mode_set(mode='OBJECT')

    decimate = obj.modifiers.new('runtime_decimate_ratio_0_22', 'DECIMATE')
    decimate.ratio = DECIMATE_RATIO
    decimate.use_collapse_triangulate = True
    bpy.ops.object.modifier_apply(modifier=decimate.name)

    for polygon in obj.data.polygons:
        polygon.use_smooth = True
    obj.data.update()


def make_material(name, color, metallic=0.04, roughness=0.88, emission=None, emission_strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = roughness
    if emission is not None:
        bsdf.inputs['Emission Color'].default_value = emission
        bsdf.inputs['Emission Strength'].default_value = emission_strength
    return mat


def assign_runtime_material(obj):
    rock = make_material('meshy 101 cleaned dark basalt', (0.155, 0.142, 0.128, 1.0), 0.02, 0.93)
    obj.data.materials.clear()
    obj.data.materials.append(rock)


def make_block(name, location, rotation, scale, material, collection):
    bpy.ops.mesh.primitive_cube_add(location=location, rotation=rotation, scale=scale)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(material)
    link_to_collection(obj, collection)
    return obj


def add_proof_helpers(collection):
    deck_mat = make_material('proof helper warm deck metal', (0.36, 0.34, 0.30, 1.0), 0.18, 0.62)
    cyan = make_material('proof helper cyan glow', (0.08, 0.40, 0.62, 1.0), 0.0, 0.34, (0.18, 0.9, 1.0, 1.0), 1.3)
    amber = make_material('proof helper amber work light', (0.70, 0.48, 0.18, 1.0), 0.0, 0.45, (1.0, 0.55, 0.16, 1.0), 0.8)

    make_block('proof interior deck scale proxy', (0.0, -0.42, 2.1), (0.0, 0.0, 0.0), (4.6, 1.25, 0.08), deck_mat, collection)
    make_block('proof lower floor proxy', (0.0, -1.05, 0.75), (0.0, 0.0, 0.0), (5.2, 1.45, 0.07), deck_mat, collection)
    make_block('proof central holo table scale proxy', (0.0, -1.25, 1.05), (0.0, 0.0, 0.0), (0.78, 0.34, 0.08), cyan, collection)
    for x in (-3.0, -1.5, 1.5, 3.0):
        make_block('proof bay light', (x, -1.7, 1.28), (0.0, 0.0, 0.0), (0.14, 0.05, 0.05), amber, collection)


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()


def setup_render_scene(runtime_obj):
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.eevee.taa_render_samples = 64
    scene.render.image_settings.file_format = 'PNG'
    scene.render.resolution_x = 1800
    scene.render.resolution_y = 1080
    scene.view_settings.view_transform = 'Filmic'
    scene.view_settings.look = 'Medium High Contrast'
    scene.world = bpy.data.worlds.new('cleanup proof dark world')
    scene.world.color = (0.006, 0.008, 0.012)

    bpy.ops.object.light_add(type='AREA', location=(-4.5, -7.5, 8.0))
    key = bpy.context.object
    key.name = 'cleanup proof broad cool key'
    key.data.energy = 780
    key.data.size = 6.0

    bpy.ops.object.light_add(type='AREA', location=(4.6, -3.2, 3.8))
    rim = bpy.context.object
    rim.name = 'cleanup proof cyan rim'
    rim.data.energy = 260
    rim.data.size = 4.0
    rim.data.color = (0.38, 0.82, 1.0)

    bpy.ops.object.camera_add(location=(11.2, -15.6, 7.1))
    cam = bpy.context.object
    cam.name = 'cleanup proof hero camera'
    cam.data.lens = 48
    look_at(cam, (0.0, -0.45, 2.45))
    scene.camera = cam

    runtime_obj.rotation_euler[2] = math.radians(-3.0)


def export_runtime(obj):
    bpy.ops.object.select_all(action='DESELECT')
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    bpy.ops.export_scene.gltf(
        filepath=str(OUT_GLB),
        export_format='GLB',
        use_selection=True,
        export_apply=True,
        export_materials='EXPORT',
    )


def write_report(raw_stats, runtime_stats):
    metrics = {
        'source': str(SOURCE_GLB.relative_to(ROOT)),
        'sourceSizeBytes': SOURCE_GLB.stat().st_size,
        'runtimeGlb': str(OUT_GLB.relative_to(ROOT)),
        'runtimeSizeBytes': OUT_GLB.stat().st_size,
        'blend': str(OUT_BLEND.relative_to(ROOT)),
        'render': str(OUT_RENDER.relative_to(ROOT)),
        'decimateRatio': DECIMATE_RATIO,
        'targetWidth': TARGET_WIDTH,
        'rawStats': raw_stats,
        'runtimeStats': runtime_stats,
        'triangleReduction': round(1.0 - (runtime_stats['triangles'] / raw_stats['triangles']), 4),
        'sizeReduction': round(1.0 - (OUT_GLB.stat().st_size / SOURCE_GLB.stat().st_size), 4),
    }
    OUT_METRICS.write_text(json.dumps(metrics, indent=2) + '\n')

    report = f'''# Meshy 101 Open-Front Cleanup Proof - 2026-05-19

## Input

- Source GLB: {metrics['source']}
- Source size: {metrics['sourceSizeBytes']:,} bytes
- Raw imported mesh: {raw_stats['vertices']:,} vertices / {raw_stats['triangles']:,} triangles / bounds {raw_stats['bounds']}

## Cleanup Pass

- Blender source saved: {metrics['blend']}
- Runtime GLB exported: {metrics['runtimeGlb']}
- Runtime size: {metrics['runtimeSizeBytes']:,} bytes
- Runtime mesh: {runtime_stats['vertices']:,} vertices / {runtime_stats['triangles']:,} triangles / bounds {runtime_stats['bounds']}
- Decimation ratio: {DECIMATE_RATIO}
- Triangle reduction: {metrics['triangleReduction'] * 100:.1f}%
- Size reduction before glTF-Transform optimization: {metrics['sizeReduction'] * 100:.1f}%

## Proof Render

- Render: {metrics['render']}
- The render includes simple deck/holo-table scale proxies so the open-front cavity can be judged as a facility host, not just a standalone rock.
- The runtime export selects only the cleaned asteroid mesh and material, not the proof helper blocks.

## Verdict

meshy-101-open-front-v2 passed the first cleanup/export gate as a Blender-editable source and normalized runtime GLB candidate. It is usable for the next in-browser/in-scene proof, but still needs browser load verification and final visual acceptance before facility population is unblocked.

## Verification

- Blender 5.1.1 imported the raw Meshy GLB.
- Blender cleanup generated the source .blend, runtime .glb, PNG proof render, and metrics JSON.
- Follow-up gate still required: glTF inspection/optimization and Mission Control runtime load proof.
'''
    OUT_REPORT.write_text(report)
    print(json.dumps(metrics, indent=2))


def main():
    clear_scene()
    source_collection = make_collection('raw source reference')
    runtime_collection = make_collection('runtime cleaned candidate')
    proof_collection = make_collection('proof helpers not exported')

    source = import_source()
    link_to_collection(source, source_collection)
    raw_stats = mesh_stats(source)

    runtime = source.copy()
    runtime.data = source.data.copy()
    runtime.name = 'meshy_101_open_front_clean_runtime_v1'
    runtime.data.name = 'meshy_101_open_front_clean_runtime_v1_mesh'
    bpy.context.scene.collection.objects.link(runtime)
    link_to_collection(runtime, runtime_collection)
    source.hide_viewport = True
    source.hide_render = True

    normalize_mesh_object(runtime)
    cleanup_runtime_mesh(runtime)
    assign_runtime_material(runtime)
    runtime_stats = mesh_stats(runtime)

    add_proof_helpers(proof_collection)
    setup_render_scene(runtime)

    OUT_BLEND.parent.mkdir(parents=True, exist_ok=True)
    OUT_GLB.parent.mkdir(parents=True, exist_ok=True)
    OUT_RENDER.parent.mkdir(parents=True, exist_ok=True)
    OUT_REPORT.parent.mkdir(parents=True, exist_ok=True)

    export_runtime(runtime)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT_BLEND))
    bpy.context.scene.render.filepath = str(OUT_RENDER)
    bpy.ops.render.render(write_still=True)
    write_report(raw_stats, runtime_stats)


if __name__ == '__main__':
    main()
