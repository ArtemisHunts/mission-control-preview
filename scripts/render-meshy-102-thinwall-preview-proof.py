#!/usr/bin/env python3
import json
import math
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
SOURCE_GLB = ROOT / 'assets' / 'meshy' / 'api' / '102-thinwall-open-front-hollow-asteroid-v3.meshy.glb'
OUT_BLEND = ROOT / 'assets' / 'blender' / 'meshy-102-thinwall-preview-inspection.blend'
OUT_RENDER = ROOT / 'docs' / 'visual-reviews' / '2026-05-20-meshy-102-thinwall-preview-proof.png'
OUT_METRICS = ROOT / 'docs' / 'visual-reviews' / '2026-05-20-meshy-102-thinwall-preview-proof.json'


def clear_scene():
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()
    for block in (bpy.data.meshes, bpy.data.materials, bpy.data.images, bpy.data.lights, bpy.data.cameras):
        for item in list(block):
            if item.users == 0:
                block.remove(item)


def import_source():
    before = {obj.name for obj in bpy.context.scene.objects}
    bpy.ops.import_scene.gltf(filepath=str(SOURCE_GLB))
    meshes = [obj for obj in bpy.context.scene.objects if obj.name not in before and obj.type == 'MESH']
    if not meshes:
        raise RuntimeError(f'No mesh objects imported from {SOURCE_GLB}')
    return meshes


def bounds_for_objects(objects):
    coords = []
    for obj in objects:
        if obj.type == 'MESH':
            coords.extend(obj.matrix_world @ Vector(corner) for corner in obj.bound_box)
    mn = Vector((min(v.x for v in coords), min(v.y for v in coords), min(v.z for v in coords)))
    mx = Vector((max(v.x for v in coords), max(v.y for v in coords), max(v.z for v in coords)))
    return mn, mx, mx - mn


def normalize_for_inspection(meshes):
    mn, mx, size = bounds_for_objects(meshes)
    scale = 16.0 / max(size.x, size.y, 0.001)
    center = Vector(((mn.x + mx.x) * 0.5, (mn.y + mx.y) * 0.5, mn.z))
    for obj in meshes:
        obj.location -= center
        obj.scale = (obj.scale.x * scale, obj.scale.y * scale, obj.scale.z * scale)
        obj.rotation_euler[2] += math.radians(18)
    bpy.context.view_layer.update()


def collect_stats(meshes):
    vertices = polygons = triangles = materials = 0
    for obj in meshes:
        obj.data.update(calc_edges=True)
        obj.data.calc_loop_triangles()
        vertices += len(obj.data.vertices)
        polygons += len(obj.data.polygons)
        triangles += len(obj.data.loop_triangles)
        materials += len(obj.data.materials)
    mn, mx, size = bounds_for_objects(meshes)
    return {
        'source': str(SOURCE_GLB.relative_to(ROOT)),
        'sourceSizeBytes': SOURCE_GLB.stat().st_size,
        'meshObjects': len(meshes),
        'vertices': vertices,
        'polygons': polygons,
        'triangles': triangles,
        'materials': materials,
        'bounds': [round(size.x, 4), round(size.y, 4), round(size.z, 4)],
        'min': [round(mn.x, 4), round(mn.y, 4), round(mn.z, 4)],
        'max': [round(mx.x, 4), round(mx.y, 4), round(mx.z, 4)],
    }


def make_material(name, color, emission=None, strength=0.0):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = color
    bsdf.inputs['Roughness'].default_value = 0.72
    if emission:
        bsdf.inputs['Emission Color'].default_value = emission
        bsdf.inputs['Emission Strength'].default_value = strength
    return mat


def make_block(name, location, scale, mat):
    bpy.ops.mesh.primitive_cube_add(location=location, scale=scale)
    obj = bpy.context.object
    obj.name = name
    obj.data.materials.append(mat)
    return obj


def add_scale_context():
    deck = make_material('inspection warm deck proxy', (0.34, 0.33, 0.30, 1.0))
    cyan = make_material('inspection cyan table proxy', (0.05, 0.35, 0.50, 1.0), (0.12, 0.85, 1.0, 1.0), 1.2)
    make_block('inspection lower facility deck proxy', (0.0, -1.55, 0.75), (4.4, 0.42, 0.06), deck)
    make_block('inspection upper facility deck proxy', (0.0, -0.95, 2.15), (3.4, 0.34, 0.05), deck)
    make_block('inspection command table scale proxy', (0.0, -1.72, 1.05), (0.52, 0.18, 0.06), cyan)


def look_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat('-Z', 'Y').to_euler()


def setup_scene():
    scene = bpy.context.scene
    scene.render.engine = 'BLENDER_EEVEE'
    scene.eevee.taa_render_samples = 64
    scene.render.image_settings.file_format = 'PNG'
    scene.render.resolution_x = 1800
    scene.render.resolution_y = 1080
    scene.view_settings.view_transform = 'Filmic'
    scene.view_settings.look = 'Medium High Contrast'
    scene.world = bpy.data.worlds.new('meshy 102 proof dark world')
    scene.world.color = (0.01, 0.012, 0.017)

    bpy.ops.object.light_add(type='AREA', location=(-5.5, -8.5, 8.0))
    key = bpy.context.object
    key.name = 'meshy 102 broad cool key'
    key.data.energy = 900
    key.data.size = 7.0

    bpy.ops.object.light_add(type='AREA', location=(4.6, -3.2, 4.0))
    rim = bpy.context.object
    rim.name = 'meshy 102 cyan rim'
    rim.data.energy = 310
    rim.data.size = 4.5
    rim.data.color = (0.38, 0.82, 1.0)

    bpy.ops.object.camera_add(location=(10.8, -15.2, 7.2))
    cam = bpy.context.object
    cam.name = 'meshy 102 inspection camera'
    cam.data.lens = 46
    look_at(cam, (0.0, -0.7, 2.6))
    scene.camera = cam


def main():
    if not SOURCE_GLB.exists():
        raise FileNotFoundError(SOURCE_GLB)
    clear_scene()
    meshes = import_source()
    raw_stats = collect_stats(meshes)
    normalize_for_inspection(meshes)
    setup_scene()
    inspection_stats = collect_stats(meshes)
    OUT_RENDER.parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(OUT_BLEND))
    scene = bpy.context.scene
    scene.render.filepath = str(OUT_RENDER)
    bpy.ops.render.render(write_still=True)
    metrics = {
        'source': str(SOURCE_GLB.relative_to(ROOT)),
        'blend': str(OUT_BLEND.relative_to(ROOT)),
        'render': str(OUT_RENDER.relative_to(ROOT)),
        'rawStats': raw_stats,
        'inspectionStats': inspection_stats,
    }
    OUT_METRICS.write_text(json.dumps(metrics, indent=2) + '\n')
    print(json.dumps(metrics, indent=2))


if __name__ == '__main__':
    main()
