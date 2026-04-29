import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const COLORS = {
  bg: 0x02050c,
  rockOuter: 0x241e29,
  rockCut: 0x5d4f5a,
  rockWarm: 0xa48778,
  shadow: 0x020309,
  steel: 0x3b465a,
  darkSteel: 0x101827,
  blackMetal: 0x050812,
  glass: 0x071a2b,
  cyan: 0x59f1ff,
  amber: 0xe6a93a,
  orange: 0xff9f2f,
  green: 0x74d99a,
  violet: 0x9d7cff,
  white: 0xf6f8ff
};

const container = document.getElementById('office-canvas');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.6;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.bg);
scene.fog = new THREE.Fog(COLORS.bg, 28, 92);

const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 160);
camera.position.set(0, 8.2, 31.5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enableRotate = false;
controls.enableZoom = true;
controls.enablePan = false;
controls.minDistance = 11;
controls.maxDistance = 72;
controls.zoomSpeed = 0.82;
controls.target.set(0, 3.8, -3.8);


const CAMERA_PRESETS = {
  full: { label: 'FULL', position: [0.4, 10.4, 50.0], target: [0.2, 2.45, -12.8], fov: 49 },
  wide: { label: 'WIDE', position: [0.4, 11.6, 58.0], target: [0.2, 3.0, -13.2], fov: 51 },
  detail: { label: 'DETAIL', position: [0.4, 5.6, 29.0], target: [0.2, 1.2, -10.8], fov: 38 },
  ceiling: { label: 'CEILING', position: [0.4, 12.4, 41.0], target: [0.4, 5.2, -12.8], fov: 42 }
};

let activeCameraPreset = 'full';
function applyCameraPreset(name) {
  const preset = CAMERA_PRESETS[name] || CAMERA_PRESETS.full;
  activeCameraPreset = name;
  camera.position.set(...preset.position);
  controls.target.set(...preset.target);
  camera.fov = preset.fov;
  camera.updateProjectionMatrix();
  controls.update();
  document.querySelectorAll('[data-camera-preset]').forEach((button) => {
    button.classList.toggle('active', button.dataset.cameraPreset === name);
  });
  const zoomLabel = document.getElementById('zoom-readout');
  if (zoomLabel) zoomLabel.textContent = `${preset.label} · ${Math.round(camera.position.distanceTo(controls.target) * 10) / 10}m`;
}

function nudgeCameraZoom(delta) {
  const direction = new THREE.Vector3().subVectors(camera.position, controls.target).normalize();
  const distance = THREE.MathUtils.clamp(camera.position.distanceTo(controls.target) + delta, controls.minDistance, controls.maxDistance);
  camera.position.copy(controls.target).addScaledVector(direction, distance);
  controls.update();
  activeCameraPreset = 'custom';
  document.querySelectorAll('[data-camera-preset]').forEach((button) => button.classList.remove('active'));
  const zoomLabel = document.getElementById('zoom-readout');
  if (zoomLabel) zoomLabel.textContent = `CUSTOM · ${Math.round(distance * 10) / 10}m`;
}

const root = new THREE.Group();
root.name = 'concept-c clean asteroid cutaway environment root';
scene.add(root);

const clock = new THREE.Clock();
const animated = [];

function mat(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.6,
    metalness: options.metalness ?? 0.08,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
    side: options.side ?? THREE.FrontSide,
    flatShading: options.flatShading ?? false
  });
}

const MATS = {
  rockOuter: mat(COLORS.rockOuter, { roughness: 1, flatShading: true, side: THREE.DoubleSide }),
  rockCut: mat(COLORS.rockCut, { roughness: 0.94, flatShading: true, side: THREE.DoubleSide }),
  rockWarm: mat(COLORS.rockWarm, { roughness: 0.92, flatShading: true }),
  shadow: mat(COLORS.shadow, { roughness: 1 }),
  steel: mat(COLORS.steel, { roughness: 0.38, metalness: 0.72 }),
  darkSteel: mat(COLORS.darkSteel, { roughness: 0.54, metalness: 0.48 }),
  blackMetal: mat(COLORS.blackMetal, { roughness: 0.72, metalness: 0.3 }),
  glass: mat(COLORS.glass, { roughness: 0.14, metalness: 0.18, emissive: 0x0d4264, emissiveIntensity: 0.2, transparent: true, opacity: 0.38 }),
  cyan: mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.72, transparent: true, opacity: 0.5, roughness: 0.08 }),
  cyanDim: mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.32, transparent: true, opacity: 0.22, roughness: 0.12 }),
  amber: mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.48, transparent: true, opacity: 0.42, roughness: 0.14 }),
  orange: mat(COLORS.orange, { emissive: COLORS.orange, emissiveIntensity: 0.38, transparent: true, opacity: 0.3, roughness: 0.18 }),
  green: mat(COLORS.green, { emissive: COLORS.green, emissiveIntensity: 0.34, transparent: true, opacity: 0.26 }),
  violet: mat(COLORS.violet, { emissive: COLORS.violet, emissiveIntensity: 0.34, transparent: true, opacity: 0.25 }),
  rockHifi: new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.96,
    metalness: 0.02,
    flatShading: true,
    side: THREE.DoubleSide
  }),
  rockDenseHifi: new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.98,
    metalness: 0.02,
    flatShading: false,
    side: THREE.DoubleSide
  })
};

function box(name, size, position, material, parent = root) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

function cylinder(name, radiusTop, radiusBottom, height, segments, position, material, parent = root) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
  mesh.name = name;
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

function torus(name, radius, tube, radialSegments, tubularSegments, position, material, parent = root) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments), material);
  mesh.name = name;
  mesh.position.set(...position);
  parent.add(mesh);
  return mesh;
}

function hifiNoise(seed) {
  const s = Math.sin(seed * 127.1) * 43758.5453123;
  return s - Math.floor(s);
}

function hifiColor(x, y, z, warmBias = 0) {
  const vertical = THREE.MathUtils.clamp((y + 1.4) / 8.1, 0, 1);
  const depthCool = THREE.MathUtils.clamp((4.9 - z) / 6.2, 0, 1);
  const macroNoise = hifiNoise(x * 0.78 + y * 1.16 + z * 0.38);
  const microNoise = hifiNoise(x * 8.2 - y * 6.3 + z * 2.7);
  const strata = Math.sin((x * 0.42 + y * 1.28 + z * 0.36) * 2.4) * 0.5 + 0.5;
  const exposedWarmth = THREE.MathUtils.clamp((z - 3.9) / 1.8, 0, 1) * (0.08 + strata * 0.14) + Math.max(warmBias, 0) * 0.32;
  const coolRecess = depthCool * (0.12 + macroNoise * 0.16) + Math.max(-warmBias, 0) * 0.18;
  const dustLift = THREE.MathUtils.clamp((vertical - 0.28) * 1.2, 0, 1) * (0.08 + macroNoise * 0.1);
  const shade = 0.34
    + vertical * 0.16
    + macroNoise * 0.2
    + microNoise * 0.1
    + strata * 0.12
    - coolRecess
    + warmBias * 0.14;
  const color = new THREE.Color(COLORS.rockCut);
  const cool = new THREE.Color(COLORS.rockOuter);
  const warm = new THREE.Color(COLORS.rockWarm);
  color.lerp(cool, THREE.MathUtils.clamp(0.9 - shade + coolRecess * 0.62, 0, 1));
  color.lerp(warm, THREE.MathUtils.clamp((shade - 0.52) * 0.92 + exposedWarmth, 0, 0.92));
  color.lerp(new THREE.Color(0xc2a691), dustLift);
  color.multiplyScalar(0.92 + macroNoise * 0.14 - depthCool * 0.06);
  return color;
}

function hifiPrism(name, points, { z = 4.15, depth = 3.8, parent = root, warmBias = 0, roughness = 0.18 } = {}) {
  const vertices = [];
  const colors = [];
  const push = (x, y, zz, colorSeed = 0) => {
    vertices.push(x, y, zz);
    const c = hifiColor(x + colorSeed, y, zz, warmBias);
    colors.push(c.r, c.g, c.b);
  };

  const cx = points.reduce((sum, p) => sum + p[0], 0) / points.length;
  const cy = points.reduce((sum, p) => sum + p[1], 0) / points.length;
  const front = points.map(([x, y], index) => [x, y, z + (hifiNoise(index + x * 0.31) - 0.5) * roughness]);
  const back = points.map(([x, y], index) => [x * 0.965 + cx * 0.035, y * 0.965 + cy * 0.035, z - depth + (hifiNoise(index + y * 0.27) - 0.5) * roughness * 1.8]);
  const centerZ = z + 0.08;
  const backCenterZ = z - depth - 0.08;

  for (let i = 0; i < points.length; i += 1) {
    const a = front[i];
    const b = front[(i + 1) % points.length];
    push(cx, cy, centerZ, i);
    push(...a, i + 1);
    push(...b, i + 2);
  }
  for (let i = 0; i < points.length; i += 1) {
    const a = back[i];
    const b = back[(i + 1) % points.length];
    push(cx, cy, backCenterZ, i + 3);
    push(...b, i + 4);
    push(...a, i + 5);
  }
  for (let i = 0; i < points.length; i += 1) {
    const f1 = front[i];
    const f2 = front[(i + 1) % points.length];
    const b1 = back[i];
    const b2 = back[(i + 1) % points.length];
    push(...f1, i + 6); push(...b1, i + 7); push(...f2, i + 8);
    push(...f2, i + 9); push(...b1, i + 10); push(...b2, i + 11);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, MATS.rockHifi);
  mesh.name = name;
  parent.add(mesh);
  return mesh;
}

function resampleHifiContour(points, segmentLength = 0.42) {
  const samples = [];
  for (let i = 0; i < points.length; i += 1) {
    const [ax, ay] = points[i];
    const [bx, by] = points[(i + 1) % points.length];
    const length = Math.hypot(bx - ax, by - ay);
    const steps = Math.max(1, Math.ceil(length / segmentLength));
    for (let step = 0; step < steps; step += 1) {
      const t = step / steps;
      samples.push([
        THREE.MathUtils.lerp(ax, bx, t),
        THREE.MathUtils.lerp(ay, by, t)
      ]);
    }
  }
  return samples;
}

function pointInPolygon(x, y, points) {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i, i += 1) {
    const [xi, yi] = points[i];
    const [xj, yj] = points[j];
    const intersects = ((yi > y) !== (yj > y))
      && (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 0.00001) + xi);
    if (intersects) inside = !inside;
  }
  return inside;
}

function smoothstep(edge0, edge1, value) {
  const t = THREE.MathUtils.clamp((value - edge0) / ((edge1 - edge0) || 0.00001), 0, 1);
  return t * t * (3 - 2 * t);
}

function ellipseMask(x, y, {
  x: cx,
  y: cy,
  rx = 1,
  ry = 1,
  angle = 0,
  softness = 0.28
}) {
  const rad = THREE.MathUtils.degToRad(angle);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = x - cx;
  const dy = y - cy;
  const localX = dx * cos + dy * sin;
  const localY = -dx * sin + dy * cos;
  const distance = Math.sqrt((localX / rx) ** 2 + (localY / ry) ** 2);
  return 1 - smoothstep(1 - softness, 1, distance);
}

function capsuleMaskSample(x, y, {
  ax,
  ay,
  bx,
  by,
  width = 1,
  softness = 0.3
}) {
  const abx = bx - ax;
  const aby = by - ay;
  const lengthSq = abx * abx + aby * aby || 1;
  const t = THREE.MathUtils.clamp((((x - ax) * abx) + ((y - ay) * aby)) / lengthSq, 0, 1);
  const px = ax + abx * t;
  const py = ay + aby * t;
  const distance = Math.hypot(x - px, y - py);
  const mask = 1 - smoothstep(width * (1 - softness), width, distance);
  return { mask, t, distance, px, py };
}

function sampleAsteroidMacroGeology(x, y, features = []) {
  return features.reduce((acc, feature) => {
    if (!feature) return acc;

    if (feature.type === 'mass') {
      const mask = ellipseMask(x, y, feature);
      if (!mask) return acc;
      const terrace = feature.terraces
        ? (Math.sin((x * (feature.freqX ?? 0.48)) + (y * (feature.freqY ?? 1.02)) + (feature.phase ?? 0)) * 0.5 + 0.5)
        : 0;
      acc.height += mask * ((feature.height ?? 0) + terrace * (feature.terraceHeight ?? 0));
      acc.warm += mask * (feature.warm ?? 0);
      acc.cool += mask * (feature.cool ?? 0);
      acc.dust += mask * (feature.dust ?? 0);
      acc.shadow += mask * (feature.shadow ?? 0);
      return acc;
    }

    if (feature.type === 'basin') {
      const inner = ellipseMask(x, y, feature);
      if (!inner) return acc;
      const rimOuter = ellipseMask(x, y, {
        ...feature,
        rx: (feature.rx ?? 1) * (feature.rimScale ?? 1.22),
        ry: (feature.ry ?? 1) * (feature.rimScale ?? 1.22),
        softness: Math.min(0.5, (feature.softness ?? 0.28) + 0.08)
      });
      const rim = Math.max(0, rimOuter - inner * 0.84);
      acc.height -= inner * (feature.depth ?? 0);
      acc.height += rim * (feature.rim ?? 0);
      acc.warm += rim * (feature.warm ?? 0);
      acc.cool += inner * (feature.cool ?? 0);
      acc.dust += rim * (feature.dust ?? 0);
      acc.shadow += inner * (feature.shadow ?? 0);
      return acc;
    }

    if (feature.type === 'band') {
      const band = capsuleMaskSample(x, y, feature);
      if (!band.mask) return acc;
      const ridgeTaper = feature.taper ? Math.max(0, 1 - Math.abs(band.t - 0.5) * 2 * feature.taper) : 1;
      const terrace = feature.terraces
        ? (Math.sin((band.t * (feature.terraces ?? 4) * Math.PI * 2) + (feature.phase ?? 0)) * 0.5 + 0.5)
        : 0;
      const cross = 1 - THREE.MathUtils.clamp(band.distance / (feature.width || 1), 0, 1);
      acc.height += band.mask * (feature.height ?? 0) * ridgeTaper;
      acc.height += band.mask * cross * (feature.terraceHeight ?? 0) * terrace;
      acc.warm += band.mask * (feature.warm ?? 0);
      acc.cool += band.mask * (feature.cool ?? 0);
      acc.dust += band.mask * (feature.dust ?? 0);
      acc.shadow += band.mask * (feature.shadow ?? 0);
      return acc;
    }

    if (feature.type === 'fault') {
      const band = capsuleMaskSample(x, y, feature);
      if (!band.mask) return acc;
      const inner = 1 - smoothstep((feature.width ?? 0.28) * 0.22, feature.width ?? 0.28, band.distance);
      const shoulder = Math.max(0, band.mask - inner * 0.82);
      acc.height -= inner * (feature.depth ?? 0);
      acc.height += shoulder * (feature.rim ?? 0);
      acc.cool += inner * (feature.cool ?? 0.08);
      acc.warm += shoulder * (feature.warm ?? 0.04);
      acc.shadow += inner * (feature.shadow ?? 0.16);
      return acc;
    }

    return acc;
  }, { height: 0, warm: 0, cool: 0, dust: 0, shadow: 0 });
}

function applyAsteroidValueZones(color, x, y, zones = []) {
  const dustTone = new THREE.Color(0xc4ae99);
  const darkTone = new THREE.Color(0x130f15);
  const warmTone = new THREE.Color(COLORS.rockWarm);
  const coolTone = new THREE.Color(COLORS.rockOuter);

  zones.forEach((zone) => {
    if (!zone) return;
    const mask = ellipseMask(x, y, zone);
    if (!mask) return;
    if (zone.warm) color.lerp(warmTone, THREE.MathUtils.clamp(zone.warm * mask, 0, 0.88));
    if (zone.cool) color.lerp(coolTone, THREE.MathUtils.clamp(zone.cool * mask, 0, 0.88));
    if (zone.dust) color.lerp(dustTone, THREE.MathUtils.clamp(zone.dust * mask, 0, 0.92));
    if (zone.shadow) color.lerp(darkTone, THREE.MathUtils.clamp(zone.shadow * mask, 0, 0.92));
  });
}

function buildHifiFractureRibbon(name, path, {
  z = 5.05,
  depth = 0.12,
  widthStart = 0.12,
  widthEnd = 0.05,
  warmBias = -0.18,
  parent = root,
  opacity = 1
} = {}) {
  const vertices = [];
  const colors = [];
  const push = (x, y, zz, biasSeed, localWarmBias = warmBias) => {
    vertices.push(x, y, zz);
    const c = hifiColor(x + biasSeed * 0.1, y, zz, localWarmBias);
    colors.push(c.r * opacity, c.g * opacity, c.b * opacity);
  };

  for (let i = 0; i < path.length - 1; i += 1) {
    const [ax, ay] = path[i];
    const [bx, by] = path[i + 1];
    const dx = bx - ax;
    const dy = by - ay;
    const length = Math.hypot(dx, dy) || 1;
    const nx = -dy / length;
    const ny = dx / length;
    const t0 = i / (path.length - 1);
    const t1 = (i + 1) / (path.length - 1);
    const w0 = THREE.MathUtils.lerp(widthStart, widthEnd, t0);
    const w1 = THREE.MathUtils.lerp(widthStart, widthEnd, t1);
    const z0 = z - t0 * depth + (hifiNoise(ax * 2.7 + ay * 4.1 + i) - 0.5) * 0.08;
    const z1 = z - t1 * depth + (hifiNoise(bx * 2.7 + by * 4.1 + i + 9) - 0.5) * 0.08;

    const aLeft = [ax + nx * w0, ay + ny * w0, z0];
    const aRight = [ax - nx * w0, ay - ny * w0, z0 - 0.04];
    const bLeft = [bx + nx * w1, by + ny * w1, z1];
    const bRight = [bx - nx * w1, by - ny * w1, z1 - 0.04];

    push(...aLeft, i + 0.2); push(...aRight, i + 0.4); push(...bLeft, i + 0.6);
    push(...bLeft, i + 0.8); push(...aRight, i + 1.0); push(...bRight, i + 1.2);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, MATS.rockHifi);
  mesh.name = name;
  parent.add(mesh);
  return mesh;
}

function buildHifiRockPanel(name, points, {
  z = 4.4,
  depth = 4.8,
  grid = 0.34,
  rimInset = 0.08,
  backShrink = 0.12,
  relief = 0.28,
  mediumRelief = 0.18,
  microRelief = 0.05,
  strataRelief = 0.06,
  radialRelief = 0.08,
  frontWarp = 0.04,
  warmBias = 0,
  geology = [],
  valueZones = [],
  parent = root
} = {}) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const colors = [];
  const denseBase = new THREE.Color(COLORS.rockCut);
  const denseCool = new THREE.Color(COLORS.rockOuter);
  const denseWarm = new THREE.Color(COLORS.rockWarm);
  const denseDust = new THREE.Color(0xc4ad97);
  const denseDark = new THREE.Color(0x100d13);
  const center = points.reduce((acc, [x, y]) => {
    acc.x += x;
    acc.y += y;
    return acc;
  }, { x: 0, y: 0 });
  center.x /= points.length;
  center.y /= points.length;
  const maxRadius = points.reduce((max, [x, y]) => Math.max(max, Math.hypot(x - center.x, y - center.y)), 0.001);

  const push = (x, y, zz, localWarmBias = warmBias, seed = 0, geologySample) => {
    vertices.push(x, y, zz);
    const sampledGeology = geologySample || sampleAsteroidMacroGeology(x, y, geology);
    const c = hifiColor(x + seed * 0.14, y, zz, localWarmBias + sampledGeology.warm * 0.18 - sampledGeology.cool * 0.08);
    c.lerp(denseBase, 0.24);
    c.lerp(denseCool, 0.08);
    if (sampledGeology.warm > 0) c.lerp(denseWarm, THREE.MathUtils.clamp(sampledGeology.warm * 0.52, 0, 0.88));
    if (sampledGeology.cool > 0) c.lerp(denseCool, THREE.MathUtils.clamp(sampledGeology.cool * 0.62, 0, 0.88));
    if (sampledGeology.dust > 0) c.lerp(denseDust, THREE.MathUtils.clamp(sampledGeology.dust * 0.68, 0, 0.92));
    if (sampledGeology.shadow > 0) c.lerp(denseDark, THREE.MathUtils.clamp(sampledGeology.shadow * 0.72, 0, 0.94));
    applyAsteroidValueZones(c, x, y, valueZones);
    colors.push(c.r, c.g, c.b);
  };

  const frontSurface = (x, y, seed) => {
    const geologySample = sampleAsteroidMacroGeology(x, y, geology);
    const radial = Math.hypot(x - center.x, y - center.y) / maxRadius;
    const innerWarpMask = 1 - smoothstep(0.76, 1.02, radial);
    const warpX = (hifiNoise(x * 1.72 - y * 1.08 + seed * 0.41) - 0.5) * relief * frontWarp * innerWarpMask
      + Math.sin(y * 0.82 + seed * 0.08) * geologySample.height * 0.22 * innerWarpMask;
    const warpY = (hifiNoise(x * 0.94 + y * 1.86 - seed * 0.33) - 0.5) * relief * frontWarp * 0.72 * innerWarpMask
      + Math.cos(x * 0.58 - seed * 0.06) * geologySample.height * 0.14 * innerWarpMask;
    const sampleX = x + warpX;
    const sampleY = y + warpY;
    const macro = (hifiNoise(sampleX * 1.9 + sampleY * 1.6 + seed * 0.33) - 0.5) * relief * 0.5;
    const medium = (hifiNoise(sampleX * 4.4 - sampleY * 3.1 + seed * 0.77) - 0.5) * relief * mediumRelief;
    const micro = (hifiNoise(sampleX * 10.8 + sampleY * 9.4 + seed * 1.21) - 0.5) * relief * microRelief;
    const strata = Math.sin((sampleX * 0.46 + sampleY * 1.18 + seed * 0.12) * 2.7) * relief * strataRelief;
    return {
      x: sampleX,
      y: sampleY,
      z: z + macro + medium + micro + strata + radial * relief * radialRelief + geologySample.height,
      geologySample
    };
  };

  const bounds = points.reduce((acc, [x, y]) => ({
    minX: Math.min(acc.minX, x),
    maxX: Math.max(acc.maxX, x),
    minY: Math.min(acc.minY, y),
    maxY: Math.max(acc.maxY, y)
  }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });

  for (let x = bounds.minX; x < bounds.maxX; x += grid) {
    for (let y = bounds.minY; y < bounds.maxY; y += grid) {
      const x1 = Math.min(x + grid, bounds.maxX);
      const y1 = Math.min(y + grid, bounds.maxY);
      const triA = [[x, y], [x1, y], [x1, y1]];
      const triB = [[x, y], [x1, y1], [x, y1]];
      const triACenter = [(x + x1 + x1) / 3, (y + y + y1) / 3];
      const triBCenter = [(x + x1 + x) / 3, (y + y1 + y1) / 3];

      if (pointInPolygon(triACenter[0], triACenter[1], points)) {
        triA.forEach(([vx, vy], index) => {
          const surface = frontSurface(vx, vy, index);
          push(surface.x, surface.y, surface.z, warmBias, index + x + y, surface.geologySample);
        });
      }
      if (pointInPolygon(triBCenter[0], triBCenter[1], points)) {
        triB.forEach(([vx, vy], index) => {
          const surface = frontSurface(vx, vy, index + 5);
          push(surface.x, surface.y, surface.z, warmBias, index + x1 + y1, surface.geologySample);
        });
      }
    }
  }

  const outline = resampleHifiContour(points, Math.max(0.16, grid * 0.66));
  const depthLayers = Math.max(10, Math.round(depth * 2.6));
  const rimLayers = Math.max(3, Math.round(rimInset * 24));
  const layerPoints = [];

  for (let layer = 0; layer <= depthLayers; layer += 1) {
    const t = layer / depthLayers;
    const shrink = backShrink * t;
    layerPoints[layer] = outline.map(([x, y], index) => {
      const dx = x - center.x;
      const dy = y - center.y;
      const length = Math.hypot(dx, dy) || 1;
      const noise = (hifiNoise(index * 0.19 + t * 4.7 + x * 0.03 + y * 0.05) - 0.5);
      const chipNoise = (hifiNoise(index * 0.73 + x * 0.18 - y * 0.22 + t * 8.4) - 0.5);
      const strataDrop = Math.sin((x * 0.34 + y * 0.98 + t * 6.6) * 2.1) * Math.max(0.012, strataRelief * 0.48);
      const radialJitter = noise * (0.03 + t * 0.16) + chipNoise * (0.015 + t * 0.04);
      const geologySample = sampleAsteroidMacroGeology(x, y, geology);
      return {
        x: THREE.MathUtils.lerp(x, center.x, shrink) + (dx / length) * radialJitter,
        y: THREE.MathUtils.lerp(y, center.y, shrink * 0.82) + (dy / length) * radialJitter * 0.88,
        z: z - depth * t + noise * relief * (0.12 + t * 0.36) + chipNoise * relief * 0.05 + strataDrop + geologySample.height * (1 - t * 0.58),
        geologySample
      };
    });
  }

  for (let layer = 0; layer < depthLayers; layer += 1) {
    const current = layerPoints[layer];
    const next = layerPoints[layer + 1];
    for (let i = 0; i < current.length; i += 1) {
      const a = current[i];
      const b = current[(i + 1) % current.length];
      const c = next[i];
      const d = next[(i + 1) % current.length];
      push(a.x, a.y, a.z, warmBias - layer * 0.01, i, a.geologySample); push(c.x, c.y, c.z, warmBias - 0.04, i + 1, c.geologySample); push(b.x, b.y, b.z, warmBias + 0.02, i + 2, b.geologySample);
      push(b.x, b.y, b.z, warmBias + 0.02, i + 3, b.geologySample); push(c.x, c.y, c.z, warmBias - 0.04, i + 4, c.geologySample); push(d.x, d.y, d.z, warmBias - 0.06, i + 5, d.geologySample);
    }
  }

  const backLayer = layerPoints[depthLayers];
  const backCenterZ = z - depth - relief * 0.4;
  for (let i = 0; i < backLayer.length; i += 1) {
    const a = backLayer[i];
    const b = backLayer[(i + 1) % backLayer.length];
    push(center.x, center.y, backCenterZ, warmBias - 0.08, i + 8);
    push(b.x, b.y, b.z - 0.06, warmBias - 0.1, i + 9, b.geologySample);
    push(a.x, a.y, a.z - 0.06, warmBias - 0.08, i + 10, a.geologySample);
  }

  for (let layer = 0; layer < rimLayers; layer += 1) {
    const t0 = layer / rimLayers;
    const t1 = (layer + 1) / rimLayers;
    for (let i = 0; i < outline.length; i += 1) {
      const [ax, ay] = outline[i];
      const [bx, by] = outline[(i + 1) % outline.length];
      const a0x = THREE.MathUtils.lerp(ax, center.x, rimInset * t0);
      const a0y = THREE.MathUtils.lerp(ay, center.y, rimInset * t0);
      const b0x = THREE.MathUtils.lerp(bx, center.x, rimInset * t0);
      const b0y = THREE.MathUtils.lerp(by, center.y, rimInset * t0);
      const a1x = THREE.MathUtils.lerp(ax, center.x, rimInset * t1);
      const a1y = THREE.MathUtils.lerp(ay, center.y, rimInset * t1);
      const b1x = THREE.MathUtils.lerp(bx, center.x, rimInset * t1);
      const b1y = THREE.MathUtils.lerp(by, center.y, rimInset * t1);
      const surface0 = frontSurface(a0x, a0y, i + layer);
      const surface1 = frontSurface(a1x, a1y, i + layer + 3);
      const z0 = surface0.z + 0.05 - layer * 0.04;
      const z1 = surface1.z + 0.02 - layer * 0.04;
      push(surface0.x, surface0.y, z0, warmBias + 0.16, i, surface0.geologySample); push(surface1.x, surface1.y, z1, warmBias + 0.2, i + 1, surface1.geologySample); push(b0x, b0y, z0, warmBias + 0.18, i + 2, surface0.geologySample);
      push(b0x, b0y, z0, warmBias + 0.18, i + 3, surface0.geologySample); push(surface1.x, surface1.y, z1, warmBias + 0.2, i + 4, surface1.geologySample); push(b1x, b1y, z1, warmBias + 0.16, i + 5, surface1.geologySample);
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, MATS.rockDenseHifi);
  mesh.name = name;
  parent.add(mesh);
  return mesh;
}

function buildHifiCraterCluster(name, x, y, {
  z = 5.04,
  radius = 0.2,
  scaleX = 1.3,
  scaleY = 0.78,
  angle = 0,
  warmBias = 0.06,
  parent = root
} = {}) {
  const craterGroup = new THREE.Group();
  craterGroup.name = name;
  craterGroup.position.set(x, y, z);
  craterGroup.rotation.z = THREE.MathUtils.degToRad(angle);
  parent.add(craterGroup);

  const pit = new THREE.Mesh(new THREE.CircleGeometry(radius, 16), mat(0x050408, { roughness: 1, transparent: true, opacity: 0.76 }));
  pit.scale.set(scaleX, scaleY, 1);
  craterGroup.add(pit);

  const dust = new THREE.Mesh(new THREE.CircleGeometry(radius * 1.46, 16), mat(0xb6947f, { roughness: 0.98, transparent: true, opacity: 0.22 }));
  dust.position.set(radius * 0.2, -radius * 0.08, -0.012);
  dust.scale.set(scaleX * 1.04, scaleY * 0.98, 1);
  craterGroup.add(dust);

  const chipCount = 6;
  for (let i = 0; i < chipCount; i += 1) {
    const t = i / chipCount;
    const theta = t * Math.PI * 2 + hifiNoise(x * 1.4 + y * 0.9 + i) * 0.4;
    const chipRadius = radius * (0.8 + (i % 3) * 0.1);
    const chipX = Math.cos(theta) * chipRadius * scaleX;
    const chipY = Math.sin(theta) * chipRadius * scaleY;
    hifiShard(`${name} rim chip ${i}`, chipX, chipY, {
      z: 0.05 + (i % 2) * 0.03,
      width: radius * (1.08 + (i % 2) * 0.18),
      height: radius * (0.52 + (i % 3) * 0.08),
      depth: radius * 1.9,
      skew: 0.04 + (i % 2) * 0.05,
      warmBias: warmBias + (i % 2) * 0.04,
      angle: THREE.MathUtils.radToDeg(theta) + 16,
      roughness: 0.05,
      parent: craterGroup
    });
  }

  return craterGroup;
}

function hifiShard(name, x, y, {
  z = 4.7,
  width = 0.9,
  height = 0.34,
  depth = 0.64,
  skew = 0.16,
  warmBias = 0.08,
  angle = 0,
  roughness = 0.12,
  parent = root,
  material
} = {}) {
  const mesh = hifiPrism(name, [
    [x - width * 0.56, y - height * 0.46],
    [x - width * 0.16, y + height * 0.58],
    [x + width * 0.48 + skew, y + height * 0.16],
    [x + width * 0.34, y - height * 0.54]
  ], { z, depth, parent, warmBias, roughness });
  mesh.rotation.z = THREE.MathUtils.degToRad(angle);
  if (material) mesh.material = material;
  return mesh;
}

function polyMesh(name, points, material, z, parent = root) {
  const shape = new THREE.Shape();
  points.forEach(([x, y], index) => (index ? shape.lineTo(x, y) : shape.moveTo(x, y)));
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 2.2,
    bevelEnabled: true,
    bevelThickness: 0.16,
    bevelSize: 0.08,
    bevelSegments: 1
  });
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material);
  mesh.name = name;
  mesh.position.z = z - 1.15;
  parent.add(mesh);
  return mesh;
}

function addLights() {
  scene.add(new THREE.AmbientLight(0x8ea9d8, 0.24));
  scene.add(new THREE.HemisphereLight(0xbdd9ff, 0x120c0b, 0.72));
  const key = new THREE.DirectionalLight(0xeaf3ff, 2.4);
  key.position.set(7.2, 10.5, 12.0);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x6aa7ff, 1.6);
  rim.position.set(-9.0, 5.0, -13.0);
  scene.add(rim);
  const warm = new THREE.PointLight(COLORS.orange, 7.8, 18.0);
  warm.position.set(0, 2.8, 2.4);
  scene.add(warm);
  const core = new THREE.PointLight(COLORS.cyan, 12.5, 14.0);
  core.position.set(0, 2.2, -1.8);
  scene.add(core);
  const starRimLeft = new THREE.PointLight(0x6fb7ff, 3.2, 18.0);
  starRimLeft.position.set(-11.2, 5.0, -7.0);
  scene.add(starRimLeft);
  const starRimRight = new THREE.PointLight(0x6fb7ff, 3.2, 18.0);
  starRimRight.position.set(11.2, 5.0, -7.0);
  scene.add(starRimRight);
  const topRim = new THREE.PointLight(0xffbc72, 2.6, 16.0);
  topRim.position.set(0, 5.7, 4.4);
  scene.add(topRim);
  const asteroidCutWarm = new THREE.PointLight(0xffb26d, 2.1, 11.0);
  asteroidCutWarm.position.set(-5.6, 4.48, 5.55);
  scene.add(asteroidCutWarm);
  const asteroidCutWarmRight = new THREE.PointLight(0xffa060, 1.7, 10.5);
  asteroidCutWarmRight.position.set(6.6, 3.84, 5.2);
  scene.add(asteroidCutWarmRight);
  const asteroidRecessCool = new THREE.PointLight(0x78baff, 2.2, 14.0);
  asteroidRecessCool.position.set(-10.8, 2.6, 2.4);
  scene.add(asteroidRecessCool);
  const asteroidUndersideCool = new THREE.PointLight(0x5f8fff, 1.8, 12.0);
  asteroidUndersideCool.position.set(6.8, -0.18, 2.1);
  scene.add(asteroidUndersideCool);
}

function buildStarfield() {
  const vertices = [];
  const sizes = [];
  for (let i = 0; i < 640; i += 1) {
    const a = Math.sin(i * 12.9898) * 43758.5453;
    const b = Math.sin(i * 78.233) * 24634.6345;
    const c = Math.sin(i * 37.719) * 96321.123;
    const rx = a - Math.floor(a);
    const ry = b - Math.floor(b);
    const rz = c - Math.floor(c);
    const x = (rx - 0.5) * 58;
    const y = -3.8 + ry * 17.5;
    const z = -28 - rz * 26;
    // Keep the central asteroid cavity cleaner; leave the four corners dense and legible.
    if (Math.abs(x) < 14.5 && y > -0.6 && y < 10.2) continue;
    vertices.push(x, y, z);
    sizes.push(0.04 + rz * 0.08);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const stars = new THREE.Points(geo, new THREE.PointsMaterial({ color: 0xdff5ff, size: 0.08, transparent: true, opacity: 0.95, sizeAttenuation: true }));
  stars.name = 'concept-c explicit open starfield corners';
  scene.add(stars);

  // Bright foreground corner stars make the approved concept's open-space corners unmissable.
  const cornerStars = [
    [-12.8, 6.15, 0.035], [-11.4, 5.55, 0.024], [-13.4, 4.72, 0.02], [-9.8, 6.55, 0.018],
    [12.8, 6.15, 0.035], [11.4, 5.55, 0.024], [13.4, 4.72, 0.02], [9.8, 6.55, 0.018],
    [-13.1, -0.15, 0.026], [-11.7, 0.42, 0.018], [13.1, -0.15, 0.026], [11.7, 0.42, 0.018]
  ];
  cornerStars.forEach(([x, y, r], index) => {
    const star = cylinder(`concept-c explicit bright open-corner star ${index}`, r, r, 0.012, 12, [x, y, 4.7], mat(0xeaf8ff, { emissive: 0xbdeaff, emissiveIntensity: 1.2 }));
    star.rotation.x = Math.PI / 2;
  });

  const moon = cylinder('concept-c distant blue moon in open corner', 0.72, 0.72, 0.04, 36, [12.6, 5.6, -34.0], mat(0x8cbcff, { emissive: 0x174d88, emissiveIntensity: 0.18, roughness: 0.7 }));
  moon.rotation.x = Math.PI / 2;
}

function addRockSurfaceDetail(parent) {
  const craterMat = mat(0x08070b, { roughness: 1, transparent: true, opacity: 0.68 });
  const mineralMat = mat(0xb0937d, { emissive: 0x2a1610, emissiveIntensity: 0.08, transparent: true, opacity: 0.42 });
  const craterData = [
    [-8.8, 6.0, 0.22], [-5.2, 5.52, 0.14], [3.3, 6.08, 0.18], [8.8, 5.72, 0.2],
    [-12.0, 3.42, 0.16], [-11.4, 1.52, 0.12], [11.9, 3.6, 0.16], [11.25, 1.42, 0.12],
    [-6.2, 0.2, 0.11], [5.7, 0.08, 0.12]
  ];
  craterData.forEach(([x, y, r], index) => {
    const crater = new THREE.Mesh(new THREE.CircleGeometry(r, 10), craterMat);
    crater.name = `concept-c asteroid crater ${index}`;
    crater.position.set(x, y, 4.16);
    parent.add(crater);
  });

  const seams = [
    ['upper long broken mineral seam', -5.7, 5.52, 6.0, -4], ['upper right broken mineral seam', 5.2, 5.65, 5.2, 5],
    ['left vertical strata seam', -11.65, 3.0, 3.7, 82], ['right vertical strata seam', 11.65, 3.0, 3.7, -82],
    ['lower sill strata seam', -1.2, 0.38, 9.4, 1]
  ];
  seams.forEach(([name, x, y, length, angle]) => {
    const seam = box(`concept-c ${name}`, [length, 0.035, 0.035], [x, y, 4.2], mineralMat, parent);
    seam.rotation.z = THREE.MathUtils.degToRad(angle);
  });
}

function buildHifiAsteroidShell() {
  const shell = new THREE.Group();
  shell.name = 'concept-c hifi procedural asteroid shell mesh v3 fracture hierarchy';
  root.add(shell);

  buildHifiRockPanel('hifi dense left oppressive asteroid mantle', [
    [-14.8, 3.2], [-13.9, 5.25], [-10.9, 6.95], [-8.7, 6.22], [-7.0, 7.32], [-4.65, 6.24], [-2.7, 6.72],
    [-0.78, 5.2], [-1.86, 4.12], [-4.2, 4.58], [-6.8, 4.04], [-9.9, 4.42], [-10.6, 3.3], [-9.86, 2.18],
    [-10.8, 0.72], [-12.7, 0.22], [-14.28, 1.28]
  ], { z: 4.58, depth: 6.1, parent: shell, warmBias: 0.02, grid: 0.22, rimInset: 0.11, backShrink: 0.15, relief: 0.46 });

  buildHifiRockPanel('hifi dense right recessed broken asteroid mantle', [
    [1.55, 5.55], [3.25, 5.08], [5.22, 5.92], [8.75, 5.12], [10.9, 5.72], [11.62, 4.65], [12.96, 3.78],
    [13.55, 2.7], [12.85, 1.64], [10.55, 0.62], [9.28, 1.22], [10.14, 2.48], [9.4, 3.04], [6.42, 4.74], [3.62, 4.04], [1.52, 4.44]
  ], { z: 4.34, depth: 4.9, parent: shell, warmBias: -0.02, grid: 0.24, rimInset: 0.1, backShrink: 0.13, relief: 0.4 });

  buildHifiRockPanel('hifi dense sagging lower left asteroid shelf with real thickness', [
    [-10.9, 0.82], [-8.7, 1.14], [-6.52, 0.48], [-4.72, 1.02], [-2.72, 0.2], [-1.35, 0.46],
    [-2.12, -0.58], [-4.7, -1.28], [-7.34, -0.68], [-10.05, -1.08]
  ], { z: 4.56, depth: 5.5, parent: shell, warmBias: 0.03, grid: 0.24, rimInset: 0.09, backShrink: 0.14, relief: 0.38 });

  buildHifiRockPanel('hifi dense broken lower right asteroid shelf pulled backward', [
    [1.7, 0.16], [4.18, 0.78], [7.34, 0.2], [9.62, 0.5], [8.12, -0.3], [5.75, -0.92], [3.18, -0.46], [1.0, -0.82]
  ], { z: 4.16, depth: 4.0, parent: shell, warmBias: -0.01, grid: 0.24, rimInset: 0.08, backShrink: 0.11, relief: 0.34 });

  buildHifiRockPanel('hifi dense upper left crown breakout bridge', [
    [-12.9, 5.74], [-11.42, 6.52], [-9.54, 6.22], [-10.64, 5.12], [-12.32, 5.08]
  ], { z: 4.92, depth: 2.5, parent: shell, warmBias: 0.1, grid: 0.24, rimInset: 0.12, backShrink: 0.18, relief: 0.24 });

  buildHifiRockPanel('hifi dense right outer cheek shell buttress', [
    [9.22, 4.42], [11.24, 4.04], [12.38, 2.8], [10.34, 2.02], [8.96, 2.74]
  ], { z: 4.62, depth: 2.7, parent: shell, warmBias: 0.02, grid: 0.24, rimInset: 0.11, backShrink: 0.17, relief: 0.22 });

  const fracturePlates = [
    ['hifi warm cut plane above production bay', [[-8.2, 4.3], [-6.4, 4.95], [-4.9, 4.55], [-6.72, 3.92]], 4.92, 0.5],
    ['hifi exposed central roof bite cut plane', [[-1.48, 4.92], [-0.58, 5.38], [0.72, 4.36], [-0.72, 4.05]], 5.02, 0.6],
    ['hifi lower left broken cut strata face', [[-8.8, 0.68], [-6.2, 0.36], [-5.0, -0.72], [-8.0, -0.52]], 4.96, 0.55],
    ['hifi right recessed side cut face', [[9.42, 3.88], [11.24, 3.58], [10.02, 1.2], [9.2, 2.14]], 4.72, 0.45]
  ];
  fracturePlates.forEach(([name, pts, plateZ, depth], index) => buildHifiRockPanel(name, pts, {
    z: plateZ,
    depth,
    parent: shell,
    warmBias: 0.18,
    grid: 0.14,
    rimInset: 0.16,
    backShrink: 0.22,
    relief: 0.14 + index * 0.02
  }));

  const cutRimShelves = [
    ['hifi top left carved rim shelf', [[-8.84, 4.9], [-7.64, 5.22], [-5.92, 5.06], [-5.34, 4.62], [-6.48, 4.28], [-8.12, 4.34]], 5.18, 0.74, 0.22],
    ['hifi central roof bevel shelf', [[-2.72, 5.04], [-1.36, 5.34], [0.32, 5.06], [0.92, 4.56], [-0.28, 4.2], [-1.96, 4.34]], 5.22, 0.82, 0.24],
    ['hifi right roof bite bevel shelf', [[4.24, 4.96], [5.9, 5.24], [7.62, 4.94], [8.08, 4.44], [6.72, 4.08], [4.98, 4.3]], 5.04, 0.74, 0.18],
    ['hifi left vertical cut rim shelf', [[-10.9, 3.64], [-10.1, 4.02], [-9.48, 3.76], [-9.56, 2.8], [-10.04, 2.28], [-10.78, 2.56]], 5.08, 0.7, 0.14],
    ['hifi right vertical cut rim shelf', [[9.12, 3.6], [10.26, 3.8], [10.58, 3.18], [10.1, 2.08], [9.34, 1.62], [8.98, 2.58]], 4.92, 0.68, 0.14],
    ['hifi lower left sill bevel shelf', [[-8.94, 0.88], [-6.8, 0.7], [-4.62, 0.34], [-3.58, 0.04], [-4.42, -0.28], [-6.92, -0.14], [-8.62, 0.18]], 5.02, 0.78, 0.18],
    ['hifi lower right sill bevel shelf', [[2.04, 0.42], [4.02, 0.56], [6.52, 0.3], [7.62, 0.02], [6.84, -0.28], [4.18, -0.22], [2.46, -0.04]], 4.78, 0.7, 0.12]
  ];
  cutRimShelves.forEach(([name, pts, shelfZ, depth, warmBias]) => buildHifiRockPanel(name, pts, {
    z: shelfZ,
    depth,
    parent: shell,
    warmBias,
    grid: 0.12,
    rimInset: 0.18,
    backShrink: 0.2,
    relief: 0.2
  }));

  const strataShelves = [
    ['hifi top left exposed strata ledge', [[-8.42, 4.66], [-7.16, 4.88], [-5.88, 4.74], [-6.34, 4.38], [-7.72, 4.22]], 4.78, 0.92, -0.02],
    ['hifi central exposed strata ledge', [[-2.24, 4.84], [-0.9, 5.0], [0.34, 4.72], [-0.16, 4.36], [-1.62, 4.28]], 4.82, 0.96, 0.02],
    ['hifi right roof exposed strata ledge', [[4.72, 4.76], [6.12, 4.94], [7.14, 4.68], [6.62, 4.3], [5.06, 4.16]], 4.72, 0.88, -0.04],
    ['hifi lower left layered sill strata', [[-8.36, 0.6], [-6.26, 0.44], [-4.92, 0.1], [-5.92, -0.14], [-7.98, 0.04]], 4.62, 0.98, 0.02],
    ['hifi lower right layered sill strata', [[2.52, 0.24], [4.28, 0.34], [6.32, 0.14], [5.72, -0.08], [3.36, -0.02]], 4.46, 0.88, -0.06]
  ];
  strataShelves.forEach(([name, pts, shelfZ, depth, warmBias]) => buildHifiRockPanel(name, pts, {
    z: shelfZ,
    depth,
    parent: shell,
    warmBias,
    grid: 0.11,
    rimInset: 0.08,
    backShrink: 0.16,
    relief: 0.16
  }));

  const recessShadowShelves = [
    ['hifi top left shadow recess shelf', [[-8.04, 4.48], [-6.7, 4.62], [-5.82, 4.46], [-6.48, 4.06], [-7.78, 3.96]], 4.38, 1.18],
    ['hifi central roof shadow recess shelf', [[-1.88, 4.58], [-0.66, 4.74], [0.2, 4.46], [-0.36, 4.08], [-1.62, 4.02]], 4.42, 1.26],
    ['hifi right roof shadow recess shelf', [[4.96, 4.5], [6.22, 4.7], [6.88, 4.4], [6.18, 4.02], [5.12, 3.94]], 4.28, 1.08],
    ['hifi lower left sill shadow recess shelf', [[-8.0, 0.28], [-6.02, 0.2], [-5.14, -0.08], [-6.08, -0.34], [-7.86, -0.18]], 4.14, 1.12],
    ['hifi lower right sill shadow recess shelf', [[2.88, 0.02], [4.48, 0.08], [5.92, -0.06], [5.28, -0.26], [3.42, -0.2]], 3.98, 1.02]
  ];
  recessShadowShelves.forEach(([name, pts, shelfZ, depth]) => buildHifiRockPanel(name, pts, {
    z: shelfZ,
    depth,
    parent: shell,
    warmBias: -0.14,
    grid: 0.1,
    rimInset: 0.06,
    backShrink: 0.18,
    relief: 0.12
  }));

  const fractureRibbons = [
    ['hifi upper left dense fracture hierarchy', [[-12.8, 5.88], [-11.12, 5.46], [-9.54, 5.72], [-8.18, 5.04], [-6.44, 4.84]], 0.15, 0.06, 5.24, -0.12],
    ['hifi upper left secondary strata crack', [[-10.94, 4.76], [-9.88, 4.34], [-8.36, 4.46], [-7.18, 4.08]], 0.09, 0.04, 5.18, -0.16],
    ['hifi upper center roof bite crack ladder', [[-2.2, 4.86], [-1.38, 4.42], [-0.42, 4.62], [0.48, 4.24]], 0.11, 0.05, 5.18, -0.08],
    ['hifi right outer cheek fracture hierarchy', [[9.32, 4.2], [10.22, 3.84], [10.82, 3.12], [10.12, 2.26], [9.44, 1.66]], 0.12, 0.05, 4.9, -0.12],
    ['hifi lower sill primary broken seam', [[-9.3, 0.52], [-7.62, 0.18], [-5.92, -0.06], [-3.84, -0.14], [-1.52, -0.02], [1.26, -0.08], [4.08, -0.18], [7.24, 0.02]], 0.12, 0.04, 5.14, 0.06],
    ['hifi top crown tertiary crack fan', [[-7.24, 6.24], [-6.1, 5.92], [-4.88, 5.78], [-3.6, 5.32], [-2.58, 5.4]], 0.08, 0.03, 5.38, -0.04],
    ['hifi central rim offset crack run', [[-3.14, 4.58], [-2.18, 4.22], [-0.9, 4.26], [0.38, 3.98], [1.4, 4.08]], 0.08, 0.03, 5.06, -0.12],
    ['hifi right crown split ladder', [[3.88, 5.18], [4.92, 4.88], [6.18, 4.98], [7.22, 4.56]], 0.09, 0.04, 5.08, -0.06],
    ['hifi left wall underbite crack stack', [[-11.02, 3.52], [-10.66, 2.9], [-10.24, 2.28], [-9.88, 1.76]], 0.08, 0.03, 4.94, -0.16],
    ['hifi right wall underbite crack stack', [[10.24, 3.42], [10.38, 2.84], [10.08, 2.2], [9.72, 1.62]], 0.08, 0.03, 4.82, -0.16]
  ];
  fractureRibbons.forEach(([name, path, widthStart, widthEnd, fractureZ, warm]) => {
    buildHifiFractureRibbon(name, path, {
      z: fractureZ,
      depth: 0.18,
      widthStart,
      widthEnd,
      warmBias: warm,
      parent: shell
    });
  });

  const tunnel = hifiPrism('hifi dark bored service tunnel bevel in left mantle', [
    [-10.95, 3.1], [-10.55, 3.42], [-10.04, 3.18], [-9.92, 2.7], [-10.22, 2.32], [-10.78, 2.42], [-11.08, 2.72]
  ], { z: 5.08, depth: 0.32, parent: shell, warmBias: -0.4, roughness: 0.05 });
  tunnel.material = MATS.shadow;

  const mineralRibbons = [
    ['hifi selective chipped mineral rim 0', [[-10.42, 5.92], [-9.86, 5.72], [-9.08, 5.78], [-8.34, 5.48]], 0.06, 0.028, 5.28, 0.12],
    ['hifi selective chipped mineral rim 1', [[-6.52, 5.3], [-5.68, 5.46], [-4.82, 5.26], [-3.98, 5.38]], 0.07, 0.03, 5.22, 0.16],
    ['hifi selective chipped mineral rim 2', [[-8.8, 0.36], [-7.76, 0.2], [-6.74, 0.12], [-5.8, -0.02]], 0.07, 0.03, 5.14, 0.14],
    ['hifi selective chipped mineral rim 3', [[4.82, 4.88], [5.68, 5.02], [6.56, 4.84], [7.38, 4.96]], 0.07, 0.03, 5.08, 0.1],
    ['hifi selective chipped mineral rim 4', [[4.24, -0.06], [5.2, -0.12], [6.24, -0.04], [7.1, -0.14]], 0.07, 0.03, 4.92, 0.08]
  ];
  mineralRibbons.forEach(([name, path, widthStart, widthEnd, ribbonZ, warmBias]) => {
    buildHifiFractureRibbon(name, path, {
      z: ribbonZ,
      depth: 0.08,
      widthStart,
      widthEnd,
      warmBias,
      parent: shell,
      opacity: 1
    });
  });

  [
    ['hifi crater cluster top left outer crust', -11.62, 4.84, 5.18, 0.19, 1.42, 0.82, -18, 0.06],
    ['hifi crater cluster upper center crust', -4.12, 5.7, 5.26, 0.16, 1.28, 0.78, 8, 0.08],
    ['hifi crater cluster right crown crust', 7.26, 5.02, 5.08, 0.18, 1.34, 0.8, -14, 0.04],
    ['hifi crater cluster left lower sill crust', -7.22, 0.22, 5.0, 0.17, 1.38, 0.74, -8, 0.1],
    ['hifi crater cluster right lower sill crust', 5.18, 0.08, 4.78, 0.16, 1.3, 0.76, 10, 0.02]
  ].forEach(([name, x, y, craterZ, radius, scaleX, scaleY, angle, warmBias]) => {
    buildHifiCraterCluster(name, x, y, { z: craterZ, radius, scaleX, scaleY, angle, warmBias, parent: shell });
  });

  const dustPatches = [
    [-10.34, 5.52, 0.42, 1.7, 0.92, -18],
    [-5.18, 5.18, 0.34, 1.6, 0.86, 10],
    [5.88, 4.78, 0.36, 1.58, 0.82, -8],
    [-7.22, 0.04, 0.32, 1.74, 0.76, -6],
    [4.84, -0.08, 0.28, 1.62, 0.78, 12]
  ];
  dustPatches.forEach(([x, y, radius, sx, sy, angle], index) => {
    const dust = new THREE.Mesh(new THREE.CircleGeometry(radius, 18), mat(0xc19b84, { roughness: 1, transparent: true, opacity: 0.14 }));
    dust.name = `hifi asteroid dust patch ${index}`;
    dust.position.set(x, y, 5.1 - index * 0.04);
    dust.scale.set(sx, sy, 1);
    dust.rotation.z = THREE.MathUtils.degToRad(angle);
    shell.add(dust);
  });
}

function buildHifiSecondaryAsteroidBreakup() {
  const detail = new THREE.Group();
  detail.name = 'concept-c hifi secondary asteroid breakup v2';
  root.add(detail);

  const chipData = [
    ['upper left chipped crown cluster A', -12.35, 5.62, 4.92, 1.18, 0.42, 0.84, -22, 0.14],
    ['upper left chipped crown cluster B', -10.58, 5.12, 4.86, 0.98, 0.34, 0.74, 18, 0.08],
    ['upper production overhang chip cluster', -7.15, 4.28, 5.06, 1.12, 0.38, 0.82, -10, 0.18],
    ['center roof bite fracture chip', -1.24, 4.82, 5.08, 0.92, 0.28, 0.58, -32, 0.16],
    ['right roof chipped face cluster', 5.28, 5.04, 4.8, 1.04, 0.32, 0.68, 14, 0.11],
    ['right outer cheek chip cluster', 10.92, 3.24, 4.66, 0.86, 0.3, 0.62, -24, 0.06],
    ['left vertical wall chipped pocket', -10.98, 2.02, 4.88, 0.88, 0.28, 0.78, 78, 0.02],
    ['left lower shelf front chip A', -8.22, 0.44, 4.96, 1.02, 0.36, 0.84, -8, 0.2],
    ['left lower shelf front chip B', -5.76, -0.22, 4.88, 0.84, 0.3, 0.72, 11, 0.12],
    ['lower center fractured sill break', -2.18, 0.22, 4.76, 0.72, 0.22, 0.58, -12, 0.09],
    ['right lower sill chipped face A', 4.98, 0.26, 4.52, 0.94, 0.28, 0.62, -6, 0.1],
    ['right lower sill chipped face B', 7.62, -0.18, 4.42, 0.76, 0.24, 0.48, 12, 0.06]
  ];
  chipData.forEach(([name, x, y, z, width, height, depth, angle, warmBias], index) => {
    hifiShard(`hifi ${name}`, x, y, {
      z,
      width,
      height,
      depth,
      angle,
      warmBias,
      roughness: 0.08 + (index % 3) * 0.03,
      parent: detail,
      skew: index % 2 ? 0.1 : 0.2
    });
  });

  const fracturePlanes = [
    ['left production fracture plane', [[-8.72, 3.76], [-7.34, 4.14], [-6.26, 3.68], [-7.64, 3.34]], 4.98, 0.38, 0.2],
    ['upper roof triangular cut plane', [[-2.18, 4.34], [-1.34, 4.72], [-0.54, 4.06], [-1.62, 3.82]], 5.02, 0.34, 0.22],
    ['right cheek secondary cut plane', [[9.48, 2.78], [10.48, 3.16], [9.94, 1.92], [9.18, 2.12]], 4.68, 0.32, 0.14],
    ['lower left shattered cut face', [[-6.98, 0.02], [-5.42, -0.18], [-4.88, -0.94], [-6.7, -0.82]], 4.9, 0.42, 0.24]
  ];
  fracturePlanes.forEach(([name, pts, z, depth, warmBias], index) => {
    buildHifiRockPanel(`hifi ${name}`, pts, {
      z,
      depth,
      parent: detail,
      warmBias,
      grid: 0.12,
      rimInset: 0.12,
      backShrink: 0.2,
      relief: 0.12 + index * 0.02
    });
  });

  const craterData = [
    [-11.88, 4.82, 0.22, 1.5, 0.8], [-8.96, 5.64, 0.14, 1.4, 0.72], [-6.32, 4.94, 0.18, 1.2, 0.78],
    [2.74, 5.18, 0.14, 1.3, 0.76], [8.48, 4.72, 0.2, 1.45, 0.82], [10.82, 2.22, 0.16, 1.1, 0.85],
    [-8.62, 0.18, 0.18, 1.5, 0.76], [-5.02, -0.18, 0.14, 1.25, 0.72], [5.46, 0.08, 0.16, 1.35, 0.74]
  ];
  craterData.forEach(([x, y, radius, sx, sy], index) => {
    buildHifiCraterCluster(`hifi asteroid crater pocket ${index}`, x, y, {
      z: 5.12,
      radius,
      scaleX: sx,
      scaleY: sy,
      angle: (index % 2 ? -18 : 14) + index * 3,
      warmBias: 0.04 + (index % 3) * 0.02,
      parent: detail
    });
  });

  const fractureBands = [
    ['upper left jagged fracture network', [[-10.12, 5.18], [-9.16, 4.96], [-8.18, 5.08], [-7.08, 4.72], [-6.02, 4.82]], 0.08, 0.04, 5.22, -0.18],
    ['upper center warm mineral fracture network', [[-1.4, 4.82], [-0.7, 4.56], [0.14, 4.72], [0.9, 4.44]], 0.08, 0.04, 5.18, 0.02],
    ['left wall vertical strata tear', [[-11.1, 2.96], [-10.74, 2.46], [-10.5, 1.86], [-10.14, 1.28]], 0.08, 0.03, 5.0, -0.22],
    ['right wall vertical strata tear', [[10.82, 3.08], [10.64, 2.48], [10.28, 1.86], [9.92, 1.34]], 0.08, 0.03, 4.84, -0.22],
    ['lower sill broken seam run', [[-5.1, 0.18], [-2.84, 0.08], [-0.64, 0.02], [1.62, 0.02], [4.14, -0.06]], 0.08, 0.03, 5.04, 0.06]
  ];
  fractureBands.forEach(([name, path, widthStart, widthEnd, z, warmBias]) => {
    buildHifiFractureRibbon(`hifi ${name}`, path, {
      z,
      depth: 0.16,
      widthStart,
      widthEnd,
      warmBias,
      parent: detail,
      opacity: 0.94
    });
  });

  const rubblePockets = [
    [-8.98, 0.86, -14], [-8.56, 0.76, 12], [-7.98, 0.7, -6], [-5.86, 0.08, 8],
    [4.54, 0.34, -8], [5.12, 0.22, 14], [6.02, 0.08, -12]
  ];
  rubblePockets.forEach(([x, y, angle], index) => {
    const rock = box(`hifi rubble pocket shard ${index}`, [0.34 + (index % 3) * 0.08, 0.18, 0.32], [x, y, 4.78 - (index % 2) * 0.08], index % 2 ? MATS.rockCut : MATS.rockWarm, detail);
    rock.rotation.z = THREE.MathUtils.degToRad(angle);
  });

  const undersideOcclusion = [
    ['left lower shelf underside occlusion wedge', [8.2, 0.24, 1.22], [-6.0, -0.32, 3.72], -6],
    ['left wall excavated underbite occlusion', [1.28, 1.8, 0.82], [-10.78, 1.88, 3.64], 10],
    ['right lower shelf underside occlusion wedge', [5.4, 0.2, 0.92], [5.82, -0.18, 3.38], -4],
    ['upper production overhang shadow slab', [5.2, 0.18, 0.82], [-6.92, 3.82, 3.5], -8]
  ];
  undersideOcclusion.forEach(([name, size, position, angle]) => {
    const shadow = box(`hifi ${name}`, size, position, MATS.shadow, detail);
    shadow.rotation.z = THREE.MathUtils.degToRad(angle);
  });

  const rimAccents = [
    [-8.05, 4.22, 2.42, -16, MATS.rockWarm],
    [-1.12, 4.52, 1.16, 22, MATS.rockWarm],
    [9.92, 2.56, 1.2, -62, MATS.rockWarm],
    [-6.02, -0.12, 2.1, 8, MATS.rockWarm],
    [5.62, 0.08, 2.26, -8, MATS.cyanDim]
  ];
  rimAccents.forEach(([x, y, length, angle, material], index) => {
    const rim = box(`hifi chipped rim accent ${index}`, [length, 0.04, 0.045], [x, y, 5.2], material, detail);
    rim.rotation.z = THREE.MathUtils.degToRad(angle);
  });
}


function buildUltraHighResolutionAsteroidCeiling() {
  const ultra = new THREE.Group();
  ultra.name = 'concept-c AST-05 ultra high resolution taller asteroid ceiling volume';
  root.add(ultra);

  const panels = [
    ['ultra tall left vertical asteroid wall continuous to ceiling', [
      [-15.25, 1.12], [-14.74, 3.46], [-15.1, 5.72], [-13.98, 8.08], [-11.72, 9.68], [-9.22, 9.18], [-7.96, 7.98],
      [-8.74, 6.74], [-10.52, 6.08], [-10.06, 4.82], [-11.18, 3.46], [-10.42, 2.16], [-11.72, 0.78], [-13.62, 0.42]
    ], 5.82, 8.8, 0.085, 0.72, 0.04],
    ['ultra high overhead asteroid ceiling crown with lifted cavern mass', [
      [-11.52, 6.42], [-9.64, 8.72], [-6.58, 10.14], [-3.12, 9.48], [-0.48, 10.46], [2.54, 9.64], [5.88, 10.02], [9.34, 8.76], [11.34, 6.62],
      [9.42, 5.66], [6.72, 5.94], [3.86, 5.28], [1.38, 5.74], [-1.08, 5.16], [-3.84, 5.84], [-6.74, 5.36], [-8.98, 5.92]
    ], 5.94, 9.4, 0.082, 0.86, 0.08],
    ['ultra tall right asteroid wall stepped back into starfield', [
      [8.02, 7.64], [9.94, 8.94], [12.26, 8.28], [13.92, 6.48], [14.68, 4.28], [13.72, 2.32], [14.12, 1.18], [12.56, 0.54],
      [10.76, 0.92], [9.72, 2.06], [10.52, 3.18], [9.86, 4.62], [8.42, 5.22]
    ], 5.58, 7.8, 0.088, 0.68, -0.02],
    ['ultra foreground lower asteroid belly mass with dense chipped sill', [
      [-11.34, 0.88], [-8.88, 1.24], [-6.48, 0.58], [-4.38, 1.08], [-1.86, 0.34], [0.86, 0.58], [3.58, 0.08], [6.98, 0.48], [9.74, 0.18],
      [8.3, -0.74], [4.82, -1.18], [1.34, -0.76], [-2.62, -1.42], [-6.72, -0.88], [-9.96, -1.2]
    ], 5.62, 6.6, 0.092, 0.56, 0.05],
    ['ultra rear ceiling shadow slab creating asteroid thickness', [
      [-8.86, 7.28], [-6.16, 8.54], [-2.4, 8.08], [0.92, 8.74], [4.48, 8.2], [7.2, 8.64], [9.42, 7.2], [8.34, 6.38],
      [5.52, 6.66], [2.18, 6.08], [-1.42, 6.54], [-4.98, 6.02], [-7.62, 6.42]
    ], 3.62, 6.9, 0.105, 0.44, -0.18]
  ];

  panels.forEach(([name, pts, z, depth, grid, relief, warmBias]) => {
    buildHifiRockPanel(name, pts, {
      z,
      depth,
      parent: ultra,
      warmBias,
      grid,
      rimInset: 0.2,
      backShrink: 0.18,
      relief
    });
  });

  const ceilingFractures = [
    [[-12.92, 7.86], [-11.12, 7.14], [-9.32, 7.82], [-7.28, 7.12], [-5.44, 7.54], [-3.28, 6.86]],
    [[-6.44, 9.12], [-4.72, 8.28], [-2.76, 8.62], [-1.16, 7.84], [0.72, 8.18], [2.34, 7.36]],
    [[2.12, 9.14], [4.38, 8.44], [6.22, 8.86], [8.18, 7.84], [10.04, 7.98], [11.96, 6.92]],
    [[-13.42, 5.86], [-12.14, 5.02], [-10.72, 4.48], [-9.78, 3.34], [-10.42, 2.24]],
    [[12.96, 6.08], [11.74, 5.06], [10.82, 3.96], [11.26, 2.86], [10.24, 1.76]],
    [[-9.84, 0.76], [-7.42, 0.38], [-5.16, 0.08], [-2.36, 0.22], [0.62, 0.02], [3.76, -0.16], [7.42, 0.12]],
    [[-1.8, 9.72], [-0.64, 8.94], [0.12, 8.04], [1.28, 7.28], [2.18, 6.36]],
    [[-8.62, 8.72], [-7.72, 7.94], [-6.84, 7.1], [-5.9, 6.22]],
    [[5.74, 9.02], [6.52, 8.2], [7.34, 7.42], [8.08, 6.56]],
    [[-14.12, 3.96], [-13.02, 3.3], [-12.22, 2.56], [-11.82, 1.58]],
    [[13.62, 4.02], [12.74, 3.26], [12.06, 2.34], [11.46, 1.3]],
    [[-6.96, -0.38], [-4.44, -0.54], [-1.68, -0.34], [1.44, -0.48], [4.66, -0.42], [7.22, -0.66]]
  ];

  ceilingFractures.forEach((path, index) => {
    buildHifiFractureRibbon(`ultra asteroid ceiling primary fracture network ${index}`, path, {
      z: 6.08 - (index % 4) * 0.12,
      depth: 0.32 + (index % 3) * 0.08,
      widthStart: 0.16 - (index % 3) * 0.02,
      widthEnd: 0.035,
      warmBias: index % 3 === 0 ? -0.24 : 0.04,
      parent: ultra,
      opacity: 0.96
    });

    for (let branch = 1; branch < path.length - 1; branch += 2) {
      const [x, y] = path[branch];
      const dir = branch % 4 === 1 ? -1 : 1;
      const branchPath = [
        [x, y],
        [x + dir * (0.42 + branch * 0.08), y + 0.42 + (index % 2) * 0.18],
        [x + dir * (0.78 + branch * 0.08), y + 0.9 + (index % 3) * 0.14]
      ];
      buildHifiFractureRibbon(`ultra asteroid ceiling hairline branch ${index}-${branch}`, branchPath, {
        z: 6.16 - (index % 5) * 0.1,
        depth: 0.16,
        widthStart: 0.045,
        widthEnd: 0.014,
        warmBias: -0.18,
        parent: ultra,
        opacity: 0.72
      });
    }
  });

  const craterSeeds = [
    [-11.8, 7.52, 0.3, 1.7, 0.82, -18], [-8.4, 8.18, 0.22, 1.45, 0.72, 12], [-4.62, 8.72, 0.26, 1.55, 0.74, -8],
    [-0.64, 9.08, 0.2, 1.42, 0.7, 20], [3.52, 8.66, 0.24, 1.5, 0.76, -14], [7.34, 8.08, 0.28, 1.58, 0.78, 9],
    [10.72, 6.68, 0.22, 1.34, 0.8, -24], [-13.04, 4.82, 0.2, 1.28, 0.82, 18], [12.46, 4.4, 0.18, 1.22, 0.76, -12],
    [-8.72, 0.18, 0.22, 1.52, 0.66, -6], [-4.3, -0.36, 0.18, 1.32, 0.62, 10], [5.9, -0.3, 0.2, 1.42, 0.64, -16]
  ];
  craterSeeds.forEach(([x, y, radius, scaleX, scaleY, angle], index) => {
    buildHifiCraterCluster(`ultra asteroid high resolution crater and ejecta field ${index}`, x, y, {
      z: 6.18 - (index % 4) * 0.12,
      radius,
      scaleX,
      scaleY,
      angle,
      warmBias: index % 2 ? 0.08 : -0.02,
      parent: ultra
    });
  });


  const macroStrata = [
    ['ultra ceiling broad ochre strata shelf left', [[-13.3, 7.04], [-10.6, 6.66], [-7.6, 6.9], [-4.84, 6.42], [-2.42, 6.72]], 0.28, 0.11, 6.28, 0.22],
    ['ultra ceiling broad cold shadow strata center', [[-5.82, 8.42], [-2.94, 7.86], [0.4, 8.14], [3.3, 7.62], [6.14, 7.88]], 0.24, 0.09, 6.18, -0.26],
    ['ultra right wall diagonal compression strata', [[7.7, 7.1], [9.12, 6.22], [10.38, 5.12], [11.5, 3.78], [12.46, 2.5]], 0.22, 0.08, 5.92, 0.1],
    ['ultra left wall diagonal compression strata', [[-13.48, 6.34], [-12.34, 5.24], [-11.46, 4.0], [-11.86, 2.76], [-10.92, 1.54]], 0.22, 0.08, 6.02, -0.1],
    ['ultra lower sill exposed mined sediment layer', [[-10.42, 0.42], [-7.36, 0.12], [-4.28, -0.1], [-1.02, 0.04], [2.48, -0.12], [5.74, -0.28], [8.42, -0.1]], 0.24, 0.08, 6.02, 0.18]
  ];
  macroStrata.forEach(([name, path, widthStart, widthEnd, z, warmBias]) => {
    buildHifiFractureRibbon(name, path, {
      z,
      depth: 0.38,
      widthStart,
      widthEnd,
      warmBias,
      parent: ultra,
      opacity: 0.9
    });
  });

  const basinMat = mat(0x06050a, { roughness: 1, transparent: true, opacity: 0.52 });
  const basinRimMat = mat(0xb3917d, { roughness: 0.96, transparent: true, opacity: 0.36, emissive: 0x24110a, emissiveIntensity: 0.08 });
  const macroBasins = [
    ['upper-left ancient impact basin', -10.92, 7.28, 6.34, 0.72, 1.8, 0.74, -18],
    ['upper-center worn impact scar', -1.2, 8.72, 6.28, 0.62, 1.55, 0.68, 12],
    ['upper-right ancient impact basin', 7.74, 7.64, 6.18, 0.66, 1.64, 0.72, 18],
    ['right-wall dark crater scar', 11.42, 4.72, 5.94, 0.52, 1.22, 0.86, -24],
    ['left-wall dark crater scar', -12.74, 4.66, 6.04, 0.5, 1.18, 0.84, 22],
    ['lower-sill broad scraped crater', -6.94, 0.06, 6.02, 0.48, 1.76, 0.5, -6],
    ['lower-right scraped crater', 5.84, -0.22, 5.88, 0.42, 1.52, 0.48, 8]
  ];
  macroBasins.forEach(([name, x, y, z, radius, sx, sy, angle], index) => {
    const basin = new THREE.Mesh(new THREE.CircleGeometry(radius, 48), basinMat);
    basin.name = `ultra asteroid macro dark basin ${name}`;
    basin.position.set(x, y, z + 0.01);
    basin.scale.set(sx, sy, 1);
    basin.rotation.z = THREE.MathUtils.degToRad(angle);
    ultra.add(basin);
    const rim = new THREE.Mesh(new THREE.RingGeometry(radius * 0.82, radius * 1.08, 64), basinRimMat);
    rim.name = `ultra asteroid macro broken raised rim ${name}`;
    rim.position.set(x, y, z + 0.035);
    rim.scale.set(sx, sy, 1);
    rim.rotation.z = THREE.MathUtils.degToRad(angle + (index % 2 ? 8 : -6));
    ultra.add(rim);
  });

  for (let i = 0; i < 72; i += 1) {
    const band = i / 72;
    const side = i % 3;
    const xBase = side === 0 ? THREE.MathUtils.lerp(-12.8, -4.0, hifiNoise(i * 0.37)) : side === 1 ? THREE.MathUtils.lerp(3.6, 12.4, hifiNoise(i * 0.41)) : THREE.MathUtils.lerp(-8.8, 8.8, hifiNoise(i * 0.43));
    const yBase = side === 2 ? THREE.MathUtils.lerp(-0.82, 0.72, hifiNoise(i * 0.71)) : THREE.MathUtils.lerp(4.62, 9.32, hifiNoise(i * 0.67));
    hifiShard(`ultra asteroid micro chip raised silhouette ${i}`, xBase, yBase, {
      z: 6.24 - (i % 5) * 0.08,
      width: 0.22 + hifiNoise(i * 1.7) * 0.34,
      height: 0.08 + hifiNoise(i * 1.9) * 0.16,
      depth: 0.26 + hifiNoise(i * 2.1) * 0.52,
      skew: 0.04 + hifiNoise(i * 2.3) * 0.12,
      warmBias: i % 4 === 0 ? 0.14 : -0.04,
      angle: -38 + hifiNoise(i * 2.9) * 76,
      roughness: 0.035,
      parent: ultra
    });
  }

  const occlusionPockets = [
    ['ultra deep left ceiling occlusion pocket', [-5.4, 0.16, 0.08], [-9.42, 6.22, 5.88], -12],
    ['ultra central roof undercut occlusion shelf', [6.4, 0.18, 0.08], [-0.46, 5.76, 5.82], 4],
    ['ultra right ceiling occlusion pocket', [4.9, 0.16, 0.08], [7.92, 5.62, 5.72], 12],
    ['ultra lower belly contact darkness across chipped sill', [12.6, 0.12, 0.08], [-0.62, -0.72, 5.54], -2]
  ];
  occlusionPockets.forEach(([name, size, position, angle]) => {
    const shadow = box(name, size, position, MATS.shadow, ultra);
    shadow.rotation.z = THREE.MathUtils.degToRad(angle);
  });

  const ceilingKey = new THREE.PointLight(0xffb06b, 2.8, 18.0);
  ceilingKey.name = 'ultra asteroid ceiling warm grazing light for tall rock relief';
  ceilingKey.position.set(-2.8, 8.4, 7.4);
  root.add(ceilingKey);
  const coolCavity = new THREE.PointLight(0x6aa7ff, 2.2, 21.0);
  coolCavity.name = 'ultra asteroid cool recess light revealing high resolution surface';
  coolCavity.position.set(8.4, 7.2, 1.6);
  root.add(coolCavity);
}

function buildAsteroidMacroGeologyPass() {
  const macro = new THREE.Group();
  macro.name = 'concept-c AST-06 macro geology overlay pass';
  root.add(macro);

  const ledges = [
    {
      name: 'AST-06 left crown weathered sediment buttress',
      pts: [[-14.34, 6.12], [-12.78, 7.56], [-9.62, 7.76], [-8.36, 6.92], [-9.88, 5.92], [-13.26, 5.68]],
      z: 6.08,
      depth: 2.4,
      warmBias: 0.1,
      geology: [
        { type: 'band', ax: -13.94, ay: 6.84, bx: -9.32, by: 6.92, width: 0.88, height: 0.12, terraces: 4, terraceHeight: 0.08, dust: 0.18, warm: 0.12 },
        { type: 'basin', x: -11.88, y: 6.96, rx: 1.14, ry: 0.52, angle: -14, depth: 0.12, rim: 0.05, shadow: 0.18, dust: 0.1 },
        { type: 'fault', ax: -12.44, ay: 7.28, bx: -10.46, by: 6.02, width: 0.24, depth: 0.06, rim: 0.02, shadow: 0.14, warm: 0.05 }
      ],
      valueZones: [
        { x: -11.22, y: 6.74, rx: 2.52, ry: 0.78, angle: -6, dust: 0.22, warm: 0.14 }
      ]
    },
    {
      name: 'AST-06 central roof broken geology terrace',
      pts: [[-5.86, 6.56], [-3.42, 7.68], [-0.86, 7.44], [2.02, 7.9], [4.62, 7.28], [6.74, 6.18], [4.18, 5.58], [1.08, 5.76], [-2.22, 5.52], [-4.84, 5.74]],
      z: 6.02,
      depth: 2.72,
      warmBias: 0.08,
      geology: [
        { type: 'band', ax: -5.02, ay: 6.66, bx: 5.48, by: 6.76, width: 0.96, height: 0.14, terraces: 5, terraceHeight: 0.1, dust: 0.18, warm: 0.1 },
        { type: 'basin', x: -1.42, y: 7.02, rx: 1.48, ry: 0.62, angle: 4, depth: 0.14, rim: 0.06, shadow: 0.18, cool: 0.08, dust: 0.08 },
        { type: 'fault', ax: -0.88, ay: 7.46, bx: 1.96, by: 5.9, width: 0.26, depth: 0.08, rim: 0.03, shadow: 0.16, warm: 0.04 }
      ],
      valueZones: [
        { x: -2.44, y: 6.84, rx: 2.64, ry: 0.84, angle: -4, dust: 0.18, warm: 0.12 },
        { x: 2.72, y: 6.68, rx: 2.4, ry: 0.82, angle: 6, dust: 0.16, warm: 0.08 }
      ]
    },
    {
      name: 'AST-06 right wall compression buttress',
      pts: [[8.56, 6.18], [10.92, 6.78], [12.56, 5.86], [12.08, 3.82], [10.84, 2.22], [9.34, 2.62], [9.82, 4.74]],
      z: 5.52,
      depth: 3.0,
      warmBias: 0.02,
      geology: [
        { type: 'band', ax: 9.04, ay: 5.82, bx: 11.72, by: 2.52, width: 0.82, height: 0.13, terraces: 4, terraceHeight: 0.06, dust: 0.1, warm: 0.06 },
        { type: 'basin', x: 11.26, y: 4.54, rx: 0.92, ry: 1.18, angle: -18, depth: 0.1, rim: 0.04, shadow: 0.16, cool: 0.1 },
        { type: 'fault', ax: 11.92, ay: 5.74, bx: 10.16, by: 2.06, width: 0.22, depth: 0.07, rim: 0.02, shadow: 0.14, warm: 0.03 }
      ],
      valueZones: [
        { x: 10.18, y: 5.74, rx: 1.86, ry: 0.92, angle: -10, dust: 0.14, warm: 0.08 },
        { x: 11.72, y: 3.56, rx: 1.04, ry: 1.52, angle: -8, cool: 0.16, shadow: 0.14 }
      ]
    },
    {
      name: 'AST-06 excavated lower sill sediment bench',
      pts: [[-10.74, 0.86], [-7.52, 0.96], [-4.42, 0.42], [-1.14, 0.34], [1.82, 0.22], [4.92, 0.14], [7.82, 0.24], [6.86, -0.5], [2.88, -0.74], [-1.06, -0.62], [-4.96, -0.7], [-8.84, -0.4]],
      z: 5.28,
      depth: 2.52,
      warmBias: 0.12,
      geology: [
        { type: 'band', ax: -10.22, ay: 0.42, bx: 7.26, by: -0.02, width: 0.72, height: 0.12, terraces: 7, terraceHeight: 0.1, dust: 0.22, warm: 0.12 },
        { type: 'basin', x: -6.52, y: 0.04, rx: 1.82, ry: 0.44, angle: -6, depth: 0.12, rim: 0.04, shadow: 0.18, dust: 0.12 },
        { type: 'basin', x: 5.34, y: -0.18, rx: 1.54, ry: 0.4, angle: 6, depth: 0.1, rim: 0.04, shadow: 0.16, dust: 0.1 },
        { type: 'fault', ax: -7.62, ay: 0.66, bx: -3.54, by: -0.72, width: 0.22, depth: 0.07, rim: 0.02, shadow: 0.14, warm: 0.04 }
      ],
      valueZones: [
        { x: -1.42, y: -0.04, rx: 8.04, ry: 0.76, angle: -2, dust: 0.22, warm: 0.1 }
      ]
    }
  ];

  ledges.forEach(({ name, pts, z, depth, warmBias, geology, valueZones }) => {
    buildHifiRockPanel(name, pts, {
      z,
      depth,
      parent: macro,
      warmBias,
      grid: 0.096,
      rimInset: 0.18,
      backShrink: 0.2,
      relief: 0.24,
      mediumRelief: 0.05,
      microRelief: 0.008,
      strataRelief: 0.12,
      frontWarp: 0.16,
      geology,
      valueZones
    });
  });

  const excavationBands = [
    ['AST-06 broad left crown fracture shelf', [[-13.42, 6.42], [-11.92, 6.2], [-10.12, 6.38], [-8.76, 6.08]], 0.14, 0.06, 6.36, 0.12],
    ['AST-06 broad central roof sediment seam', [[-4.76, 6.3], [-2.18, 6.18], [0.96, 6.24], [4.18, 6.02]], 0.16, 0.07, 6.24, 0.14],
    ['AST-06 broad right wall compression seam', [[9.34, 5.62], [10.26, 4.74], [10.98, 3.66], [10.52, 2.42]], 0.12, 0.05, 5.94, 0.04],
    ['AST-06 broad lower sill mined sediment seam', [[-9.92, 0.2], [-5.82, -0.06], [-1.02, -0.14], [3.74, -0.18], [7.06, -0.12]], 0.14, 0.06, 5.52, 0.18]
  ];
  excavationBands.forEach(([name, path, widthStart, widthEnd, z, warmBias]) => {
    buildHifiFractureRibbon(name, path, {
      z,
      depth: 0.24,
      widthStart,
      widthEnd,
      warmBias,
      parent: macro,
      opacity: 0.92
    });
  });

  const macroWarm = new THREE.PointLight(0xffbe78, 2.3, 19.0);
  macroWarm.name = 'AST-06 warm geology terrace grazer';
  macroWarm.position.set(-4.2, 7.2, 7.8);
  root.add(macroWarm);
  const macroCool = new THREE.PointLight(0x77acff, 1.9, 20.0);
  macroCool.name = 'AST-06 cool geology recess separator';
  macroCool.position.set(9.8, 5.4, 2.8);
  root.add(macroCool);
}

function buildHifiCommandShaft() {
  const shaft = new THREE.Group();
  shaft.name = 'concept-c hifi command shaft carved geometry v2';
  root.add(shaft);

  const shaftBandMat = mat(0x131a28, { roughness: 0.5, metalness: 0.34 });
  const shaftBraceMat = mat(0x1f2938, { roughness: 0.44, metalness: 0.4 });
  const shaftHazeMat = mat(0x102341, {
    roughness: 0.1,
    transparent: true,
    opacity: 0.16,
    emissive: 0x1d5e8d,
    emissiveIntensity: 0.18
  });
  const deepGlowMat = mat(COLORS.cyan, {
    roughness: 0.08,
    transparent: true,
    opacity: 0.14,
    emissive: COLORS.cyan,
    emissiveIntensity: 0.42
  });

  const rings = [
    { r: 3.18, y: 0.96, z: 0.06, h: 0.32, rot: 0.02, mat: MATS.blackMetal },
    { r: 2.84, y: 0.72, z: -0.06, h: 0.28, rot: 0.06, mat: shaftBandMat },
    { r: 2.46, y: 0.46, z: -0.22, h: 0.3, rot: 0.1, mat: MATS.shadow },
    { r: 2.04, y: 0.16, z: -0.44, h: 0.34, rot: 0.14, mat: MATS.shadow },
    { r: 1.62, y: -0.16, z: -0.74, h: 0.38, rot: 0.18, mat: MATS.shadow },
    { r: 1.2, y: -0.5, z: -1.08, h: 0.42, rot: 0.22, mat: MATS.shadow }
  ];
  rings.forEach(({ r, y, z, h, rot, mat }, index) => {
    const wall = cylinder(`hifi faceted descending command shaft wall ${index}`, r, r * 0.84, h, 16, [0, y, z], mat, shaft);
    wall.rotation.y = rot;
  });

  [
    { radius: 2.12, y: 0.18, z: -0.36, mat: MATS.cyanDim },
    { radius: 1.78, y: -0.08, z: -0.62, mat: MATS.shadow },
    { radius: 1.46, y: -0.34, z: -0.9, mat: MATS.shadow },
    { radius: 1.12, y: -0.6, z: -1.2, mat: MATS.cyanDim }
  ].forEach(({ radius, y, z, mat }, index) => {
    const band = torus(`hifi lower maintenance ring inside command shaft ${index}`, radius, 0.028, 8, 52, [0, y, z], mat, shaft);
    band.rotation.x = Math.PI / 2;
  });

  const leftWall = box('hifi left inner shaft wall tapering into darkness', [0.22, 1.96, 0.92], [-1.66, 0.02, -0.62], MATS.shadow, shaft);
  leftWall.rotation.z = THREE.MathUtils.degToRad(18);
  const rightWall = box('hifi right inner shaft wall tapering into darkness', [0.22, 1.96, 0.92], [1.66, 0.02, -0.62], MATS.shadow, shaft);
  rightWall.rotation.z = THREE.MathUtils.degToRad(-18);
  const rearWall = box('hifi deep rear command shaft wall', [3.2, 2.3, 0.12], [0, -0.04, -1.74], MATS.shadow, shaft);
  const rearWallMid = box('hifi mid rear command shaft wall step', [2.54, 1.46, 0.08], [0, 0.16, -1.28], MATS.blackMetal, shaft);
  const rearWallLow = box('hifi lower rear command shaft wall step', [1.88, 0.94, 0.08], [0, -0.32, -2.12], MATS.blackMetal, shaft);
  rearWall.rotation.x = THREE.MathUtils.degToRad(-2);
  rearWallMid.rotation.x = THREE.MathUtils.degToRad(-4);
  rearWallLow.rotation.x = THREE.MathUtils.degToRad(-6);

  const bridges = [
    { name: 'upper bridge span crossing command shaft', size: [1.46, 0.06, 0.22], pos: [-0.48, 0.1, -0.46], yaw: 34 },
    { name: 'mid bridge span crossing command shaft', size: [1.34, 0.06, 0.22], pos: [0.58, -0.12, -0.78], yaw: -28 },
    { name: 'deep bridge span fading into rear shaft', size: [1.2, 0.05, 0.18], pos: [0.04, -0.38, -1.08], yaw: 8 }
  ];
  bridges.forEach(({ name, size, pos, yaw }, index) => {
    const bridge = box(`hifi ${name}`, size, pos, shaftBraceMat, shaft);
    bridge.rotation.y = THREE.MathUtils.degToRad(yaw);
    const rail = box(`hifi ${name} edge light ${index}`, [size[0] * 0.82, 0.018, 0.028], [pos[0], pos[1] + 0.05, pos[2] + 0.02], index === 1 ? MATS.amber : MATS.cyanDim, shaft);
    rail.rotation.y = bridge.rotation.y;
  });

  [
    [-0.98, -0.06, -0.86, 0.24],
    [1.08, -0.28, -1.18, 0.2],
    [0.18, -0.48, -1.48, 0.16]
  ].forEach(([x, y, z, h], index) => {
    cylinder(`hifi tiny maintenance lift silhouette ${index}`, 0.05, 0.06, h, 8, [x, y, z], MATS.blackMetal, shaft);
    box(`hifi tiny maintenance light ${index}`, [0.1, 0.018, 0.02], [x, y + h * 0.32, z + 0.03], index === 1 ? MATS.amber : MATS.cyanDim, shaft);
  });

  [
    [-1.18, 0.16, -1.26, MATS.cyanDim],
    [1.16, -0.08, -1.56, MATS.amber],
    [0, -0.36, -1.9, MATS.cyanDim]
  ].forEach(([x, y, z, material], index) => {
    box(`hifi descending shaft depth light ${index}`, [0.08, 0.3, 0.03], [x, y, z], material, shaft);
  });

  const hazeColumn = cylinder('hifi atmospheric glow column descending through command shaft', 0.28, 0.48, 1.62, 16, [0, -0.22, -0.94], shaftHazeMat, shaft);
  hazeColumn.rotation.z = THREE.MathUtils.degToRad(4);
  const deepGlow = cylinder('hifi deepest cyan glow fading far below command core', 0.62, 0.96, 0.03, 24, [0, -0.72, -1.46], deepGlowMat, shaft);
  deepGlow.rotation.x = Math.PI / 2;
  const lowerGlow = cylinder('hifi deep cyan glow fading at bottom of command bore', 0.92, 1.28, 0.03, 28, [0, -0.28, -0.78], MATS.cyanDim, shaft);
  lowerGlow.rotation.x = Math.PI / 2;
}

function buildHifiCarvedIntegrationKit() {
  const kit = new THREE.Group();
  kit.name = 'concept-c hifi carved integration kit v3';
  root.add(kit);

  const cableMat = mat(0x171b26, { roughness: 0.86, metalness: 0.18 });
  const dustMat = mat(0xa68472, { roughness: 0.98, transparent: true, opacity: 0.34 });

  const addBoltRun = (name, start, end, count, material = MATS.rockWarm, size = [0.08, 0.045, 0.045]) => {
    for (let i = 0; i < count; i += 1) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const bolt = box(`${name} bolt ${i}`, size, [
        THREE.MathUtils.lerp(start[0], end[0], t),
        THREE.MathUtils.lerp(start[1], end[1], t),
        THREE.MathUtils.lerp(start[2], end[2], t)
      ], material, kit);
      bolt.rotation.z = THREE.MathUtils.degToRad((i % 2 ? -8 : 8));
    }
  };

  const addApertureFrame = ({
    name,
    x,
    y,
    z,
    width,
    height,
    material = MATS.darkSteel,
    accent = MATS.amber,
    braceColor = MATS.steel,
    braceReach = 0.92,
    braceDrop = 0.74,
    accentInset = 0.14,
    backDepth = 0.48
  }) => {
    box(`${name} top lintel`, [width, 0.12, 0.14], [x, y + height * 0.5, z], material, kit);
    box(`${name} bottom sill`, [width, 0.12, 0.12], [x, y - height * 0.5, z], material, kit);
    box(`${name} left jamb`, [0.14, height, 0.14], [x - width * 0.5, y, z], material, kit);
    box(`${name} right jamb`, [0.14, height, 0.14], [x + width * 0.5, y, z], material, kit);
    box(`${name} top accent`, [width - accentInset * 2, 0.03, 0.04], [x, y + height * 0.5 + 0.08, z + 0.02], accent, kit);
    box(`${name} bottom accent`, [width - accentInset * 2.4, 0.024, 0.035], [x, y - height * 0.5 - 0.08, z + 0.01], accent, kit);

    const leftBrace = box(`${name} left retaining brace driven into rock`, [0.16, braceDrop, braceReach], [x - width * 0.5 - 0.34, y + height * 0.26, z - backDepth], braceColor, kit);
    leftBrace.rotation.z = THREE.MathUtils.degToRad(-16);
    const rightBrace = box(`${name} right retaining brace driven into rock`, [0.16, braceDrop, braceReach], [x + width * 0.5 + 0.34, y + height * 0.26, z - backDepth], braceColor, kit);
    rightBrace.rotation.z = THREE.MathUtils.degToRad(16);
    const leftKnee = box(`${name} left knee brace buried in cut wall`, [0.64, 0.12, 0.14], [x - width * 0.5 - 0.32, y - height * 0.14, z - 0.12], braceColor, kit);
    leftKnee.rotation.z = THREE.MathUtils.degToRad(-22);
    const rightKnee = box(`${name} right knee brace buried in cut wall`, [0.64, 0.12, 0.14], [x + width * 0.5 + 0.32, y - height * 0.14, z - 0.12], braceColor, kit);
    rightKnee.rotation.z = THREE.MathUtils.degToRad(22);

    addBoltRun(`${name} top`, [x - width * 0.44, y + height * 0.5, z + 0.04], [x + width * 0.44, y + height * 0.5, z + 0.04], 7);
    addBoltRun(`${name} left`, [x - width * 0.5, y + height * 0.34, z + 0.04], [x - width * 0.5, y - height * 0.34, z + 0.04], 4);
    addBoltRun(`${name} right`, [x + width * 0.5, y + height * 0.34, z + 0.04], [x + width * 0.5, y - height * 0.34, z + 0.04], 4);
    addBoltRun(`${name} sill`, [x - width * 0.36, y - height * 0.5, z + 0.03], [x + width * 0.36, y - height * 0.5, z + 0.03], 5, MATS.steel, [0.06, 0.04, 0.04]);
  };

  const addConduit = ({ name, x, y, z, length, yaw = 0, pitch = 0, accent = MATS.cyanDim, clamps = 3 }) => {
    const conduit = box(`${name} conduit trunk`, [0.09, 0.09, length], [x, y, z], cableMat, kit);
    conduit.rotation.y = THREE.MathUtils.degToRad(yaw);
    conduit.rotation.x = THREE.MathUtils.degToRad(pitch);
    box(`${name} emissive service stripe`, [0.03, 0.024, length * 0.78], [x, y + 0.05, z + 0.01], accent, kit).rotation.y = conduit.rotation.y;
    const yawRad = THREE.MathUtils.degToRad(yaw);
    for (let i = 0; i < clamps; i += 1) {
      const t = clamps === 1 ? 0.5 : i / (clamps - 1);
      const offset = (t - 0.5) * length * 0.76;
      const clamp = box(`${name} clamp ${i}`, [0.18, 0.05, 0.06], [x + Math.sin(yawRad) * offset, y - 0.04, z + Math.cos(yawRad) * offset], MATS.steel, kit);
      clamp.rotation.y = conduit.rotation.y;
    }
  };

  const aoStrips = [
    ['hero bay floor contact ao strip', [4.8, 0.05, 0.08], [-6.72, 0.92, 1.72]],
    ['left fabrication deck underside ao strip', [5.3, 0.06, 0.1], [-6.35, 0.45, -1.02]],
    ['right deploy deck underside ao strip', [5.3, 0.06, 0.1], [6.35, 0.45, -1.02]],
    ['left observatory deck underside ao strip', [5.2, 0.06, 0.1], [-6.55, 0.45, -5.92]],
    ['right review deck underside ao strip', [5.2, 0.06, 0.1], [6.55, 0.45, -5.92]],
    ['rear hangar aperture upper ao strip', [12.1, 0.08, 0.08], [0, 3.98, -9.72]],
    ['rear hangar aperture lower ao strip', [11.8, 0.06, 0.08], [0, 1.76, -9.7]],
    ['command well floor-ring contact ao strip', [5.8, 0.05, 0.08], [0, 0.88, 2.26]]
  ];
  aoStrips.forEach(([name, size, position]) => box(`hifi ${name}`, size, position, MATS.shadow, kit));

  addApertureFrame({
    name: 'hifi hero fabrication mouth collar',
    x: -6.72,
    y: 2.02,
    z: -0.64,
    width: 4.9,
    height: 2.28,
    accent: MATS.amber,
    braceColor: MATS.steel,
    braceReach: 0.88,
    braceDrop: 0.92,
    backDepth: 0.56
  });

  addApertureFrame({
    name: 'hifi right deploy bay collar',
    x: 6.35,
    y: 1.98,
    z: -2.46,
    width: 4.76,
    height: 2.14,
    accent: MATS.green,
    braceColor: MATS.steel,
    braceReach: 0.84,
    braceDrop: 0.78,
    backDepth: 0.44
  });

  addApertureFrame({
    name: 'hifi rear hangar pressure collar',
    x: 0,
    y: 2.84,
    z: -9.76,
    width: 12.86,
    height: 2.34,
    accent: MATS.cyanDim,
    braceColor: MATS.darkSteel,
    braceReach: 0.74,
    braceDrop: 1.04,
    accentInset: 0.28,
    backDepth: 0.3
  });

  const retainingRibs = [
    ['hifi left fabrication upper retaining rib A', [0.16, 1.78, 0.2], [-9.12, 2.54, -0.96], -8],
    ['hifi left fabrication upper retaining rib B', [0.16, 1.52, 0.18], [-4.34, 2.36, -1.04], 10],
    ['hifi right deploy retaining rib A', [0.16, 1.54, 0.2], [4.18, 2.16, -2.44], -10],
    ['hifi right deploy retaining rib B', [0.16, 1.72, 0.18], [8.56, 2.24, -2.26], 8],
    ['hifi rear hangar left pressure rib', [0.18, 1.84, 0.2], [-5.9, 2.84, -9.52], -4],
    ['hifi rear hangar right pressure rib', [0.18, 1.84, 0.2], [5.9, 2.84, -9.52], 4]
  ];
  retainingRibs.forEach(([name, size, position, angle]) => {
    const rib = box(name, size, position, MATS.steel, kit);
    rib.rotation.z = THREE.MathUtils.degToRad(angle);
  });

  addConduit({ name: 'hifi hero bay left rock feed', x: -8.94, y: 2.18, z: -2.08, length: 2.5, yaw: 18, accent: MATS.amber, clamps: 4 });
  addConduit({ name: 'hifi hero bay right coolant feed', x: -4.72, y: 2.1, z: -1.96, length: 2.1, yaw: -18, accent: MATS.cyanDim, clamps: 3 });
  addConduit({ name: 'hifi right bay utility trunk', x: 8.52, y: 2.08, z: -2.02, length: 2.36, yaw: -14, accent: MATS.green, clamps: 4 });
  addConduit({ name: 'hifi underfloor command conduit left', x: -2.2, y: 0.74, z: -1.48, length: 2.6, yaw: 66, accent: MATS.amber, clamps: 3 });
  addConduit({ name: 'hifi underfloor command conduit right', x: 2.2, y: 0.74, z: -1.48, length: 2.6, yaw: -66, accent: MATS.cyanDim, clamps: 3 });
  addConduit({ name: 'hifi rear hangar service conduit', x: 0, y: 3.46, z: -9.34, length: 6.6, yaw: 90, accent: MATS.cyanDim, clamps: 5 });

  const debrisClusters = [
    { name: 'hifi left fabrication dust spill', x: -8.62, z: 1.46, pieces: 5, color: MATS.rockWarm },
    { name: 'hifi hero bay center debris ridge', x: -6.12, z: 1.86, pieces: 4, color: MATS.rockCut },
    { name: 'hifi right deploy debris pocket', x: 7.58, z: 0.84, pieces: 4, color: MATS.rockWarm },
    { name: 'hifi command floor rubble sweep', x: 3.45, z: -0.66, pieces: 3, color: MATS.rockCut }
  ];
  debrisClusters.forEach(({ name, x, z, pieces, color }, clusterIndex) => {
    for (let i = 0; i < pieces; i += 1) {
      const shard = box(`${name} shard ${i}`, [0.22 + (i % 2) * 0.08, 0.08 + (i % 3) * 0.02, 0.18 + (i % 2) * 0.06], [x + i * 0.24 - 0.36, 0.1, z + (i % 3) * 0.14 - 0.18], color, kit);
      shard.rotation.z = THREE.MathUtils.degToRad((clusterIndex % 2 ? -18 : 18) + i * 7);
    }
    const dust = cylinder(`${name} dust halo`, 0.42 + pieces * 0.04, 0.42 + pieces * 0.04, 0.018, 18, [x, 0.03, z], dustMat, kit);
  });

  const commandBrackets = [
    [-2.88, 0.98, 1.18, -34], [-1.52, 0.88, 2.06, -12], [1.52, 0.88, 2.06, 12], [2.88, 0.98, 1.18, 34]
  ];
  commandBrackets.forEach(([x, y, z, angle], index) => {
    const bracket = box(`hifi command collar retaining bracket ${index}`, [0.62, 0.1, 0.14], [x, y, z], MATS.steel, kit);
    bracket.rotation.y = THREE.MathUtils.degToRad(angle);
  });
}

function buildAsteroidCutawayShell() {
  const shell = new THREE.Group();
  shell.name = 'concept-c dedicated faceted asteroid shell asset kit';
  root.add(shell);

  // Foreground silhouette: four separate jagged masses, leaving all corners visibly open to stars.
  polyMesh('concept-c massive left-biased broken upper asteroid crown', [
    [-12.15, 5.0], [-10.6, 6.86], [-8.85, 6.22], [-7.18, 7.28], [-4.92, 6.14], [-2.88, 6.72],
    [-0.75, 5.42], [-1.82, 4.24], [-4.3, 4.72], [-7.4, 4.18], [-10.45, 4.64]
  ], MATS.rockOuter, 4.05, shell);
  polyMesh('concept-c smaller right broken upper asteroid crown island', [
    [1.42, 5.64], [3.25, 5.16], [5.35, 5.98], [8.9, 5.22], [10.95, 5.76], [11.55, 4.78], [9.05, 4.34],
    [6.3, 4.82], [3.65, 4.12], [1.62, 4.5]
  ], MATS.rockOuter, 4.05, shell);
  polyMesh('concept-c left asteroid wall with broken bite silhouette', [
    [-14.2, 4.95], [-11.05, 4.62], [-10.25, 3.42], [-11.25, 2.78], [-10.08, 1.46], [-11.22, 0.18],
    [-12.92, 0.38], [-14.35, 1.24], [-14.82, 2.86]
  ], MATS.rockOuter, 4.05, shell);
  polyMesh('concept-c right asteroid wall with broken bite silhouette', [
    [13.05, 4.22], [10.55, 4.0], [9.52, 3.05], [10.22, 2.52], [9.42, 1.18], [10.35, 0.58],
    [11.36, 0.86], [13.18, 1.7], [13.58, 2.78]
  ], MATS.rockOuter, 4.05, shell);
  polyMesh('concept-c heavy sagging left lower asteroid sill island', [
    [-10.75, 0.78], [-8.62, 1.08], [-6.55, 0.48], [-4.7, 0.94], [-2.8, 0.22], [-1.35, 0.44],
    [-2.1, -0.42], [-4.7, -1.16], [-7.22, -0.62], [-9.86, -0.98]
  ], MATS.rockOuter, 4.22, shell);
  polyMesh('concept-c lighter fractured right lower asteroid sill island', [
    [1.78, 0.18], [4.35, 0.74], [7.42, 0.24], [9.55, 0.48], [8.22, -0.22], [5.94, -0.84], [3.24, -0.42], [1.08, -0.72]
  ], MATS.rockOuter, 4.22, shell);

  // Inner carved cut faces and thick side walls make the shell feel physical, not a matte.
  const cutFaces = [
    ['upper left angled cut face', -6.6, 4.62, 2.7, 4.4, 0.22, 1.7, -6], ['upper mid cut face', 0, 4.54, 2.65, 5.8, 0.2, 1.75, 2],
    ['upper right angled cut face', 6.4, 4.62, 2.7, 4.4, 0.22, 1.7, 6], ['left inner vertical excavation face', -10.25, 2.48, 1.55, 0.42, 3.25, 1.9, -5],
    ['right inner vertical excavation face', 10.25, 2.48, 1.55, 0.42, 3.25, 1.9, 5], ['lower front cut shelf face', 0, 0.64, 3.05, 16.8, 0.18, 1.5, 0]
  ];
  cutFaces.forEach(([name, x, y, z, sx, sy, sz, rot]) => {
    const face = box(`concept-c ${name}`, [sx, sy, sz], [x, y, z], MATS.rockCut, shell);
    face.rotation.z = THREE.MathUtils.degToRad(rot);
  });

  const retaining = [
    ['left bay embedded retaining spar', -9.78, 2.64, 1.9, 0.08, 2.9, 0.08, COLORS.cyan],
    ['right bay embedded retaining spar', 9.78, 2.64, 1.9, 0.08, 2.9, 0.08, COLORS.cyan],
    ['lower amber industrial collar bolted into rock', 0, 0.92, 4.0, 13.0, 0.055, 0.08, COLORS.amber]
  ];
  retaining.forEach(([name, x, y, z, sx, sy, sz, color]) => box(`concept-c ${name}`, [sx, sy, sz], [x, y, z], color === COLORS.cyan ? MATS.cyanDim : MATS.amber, shell));

  const thicknessBlocks = [
    ['left rear asteroid thickness volume', -11.55, 2.72, -2.8, 1.2, 4.9, 7.2],
    ['right rear asteroid thickness volume', 11.05, 2.55, -2.8, 0.66, 3.8, 6.0],
    ['upper left rear asteroid thickness volume', -6.1, 5.34, -3.0, 10.4, 1.02, 6.7],
    ['upper right rear asteroid thickness volume', 6.35, 4.98, -3.25, 5.4, 0.52, 5.2],
    ['left sagging underside asteroid belly mass', -6.9, -0.08, -2.15, 5.6, 0.74, 5.5]
  ];
  thicknessBlocks.forEach(([name, x, y, z, sx, sy, sz]) => box(`concept-c ${name}`, [sx, sy, sz], [x, y, z], MATS.rockOuter, shell));
  addRockSurfaceDetail(shell);
}

function buildProductionCavity() {
  const floor = box('concept-c excavated production floor dark metal plate', [18.5, 0.16, 12.0], [0, 0.02, -2.6], MATS.darkSteel);
  floor.rotation.x = 0;
  box('concept-c rear cavern shadow behind facility', [19.5, 4.2, 0.18], [0, 2.55, -10.2], MATS.shadow);
  box('concept-c rear hangar glass aperture inside asteroid', [12.6, 2.15, 0.08], [0, 2.85, -10.0], MATS.glass);
  box('concept-c rear hangar cyan exterior horizon through glass', [11.6, 0.07, 0.05], [0, 3.2, -9.86], MATS.cyan);
  box('concept-c rear hangar lower amber runway datum', [8.8, 0.055, 0.05], [0, 1.86, -9.82], MATS.amber);

  const deck = (name, x, z, accentMat) => {
    box(`concept-c ${name} terraced deck slab`, [5.2, 0.16, 3.2], [x, 0.54, z], MATS.steel);
    box(`concept-c ${name} carved rock backing wall`, [5.8, 2.1, 0.28], [x, 1.88, z - 1.5], MATS.rockCut);
    box(`concept-c ${name} black work bay void`, [4.6, 1.24, 0.14], [x, 1.85, z - 1.32], MATS.shadow);
    box(`concept-c ${name} luminous bay header`, [3.8, 0.05, 0.06], [x, 2.75, z - 1.12], accentMat);
    box(`concept-c ${name} console island`, [2.3, 0.38, 0.84], [x, 0.92, z + 0.22], MATS.darkSteel);
    box(`concept-c ${name} glass display wall`, [1.65, 0.62, 0.05], [x, 1.32, z - 0.26], MATS.glass);
  };
  deck('left fabrication', -6.35, -1.15, MATS.amber);
  deck('right deploy', 6.35, -1.15, MATS.green);
  deck('left observatory', -6.55, -6.05, MATS.violet);
  deck('right review', 6.55, -6.05, MATS.cyanDim);

  const industrialKit = [
    ['left fabrication overhead gantry beam', -6.35, 2.95, -1.15, 4.2, 0.12, 0.12, MATS.steel, 0],
    ['left fabrication suspended tool head', -6.95, 2.25, -0.35, 0.28, 0.72, 0.28, MATS.blackMetal, 0],
    ['right deploy cradle rail A', 5.65, 1.08, -0.22, 0.12, 0.14, 2.6, MATS.green, 0],
    ['right deploy cradle rail B', 7.05, 1.08, -0.22, 0.12, 0.14, 2.6, MATS.green, 0],
    ['left observatory signal mast embedded in rock', -8.7, 2.25, -6.4, 0.14, 2.1, 0.14, MATS.violet, 0],
    ['right review containment amber pipe', 8.55, 2.1, -6.3, 0.12, 1.8, 0.12, MATS.amber, 0]
  ];
  industrialKit.forEach(([name, x, y, z, sx, sy, sz, material, yaw]) => {
    const part = box(`concept-c embedded production kit ${name}`, [sx, sy, sz], [x, y, z], material);
    part.rotation.y = THREE.MathUtils.degToRad(yaw);
  });
  box('concept-c fabrication half-built drone hull silhouette', [1.35, 0.38, 0.62], [-6.25, 1.12, 0.28], MATS.blackMetal);
  box('concept-c fabrication bright assembly spine through hull', [1.1, 0.05, 0.06], [-6.25, 1.38, 0.62], MATS.amber);
  box('concept-c fabrication conveyor belt with cargo teeth', [3.3, 0.12, 0.42], [-6.25, 0.98, 1.28], MATS.blackMetal);
  [-7.34, -6.42, -5.5].forEach((x, index) => {
    box(`concept-c amber cargo crate on fabrication conveyor ${index}`, [0.42, 0.32, 0.36], [x, 1.22, 1.3], MATS.orange);
  });
  const armBase = box('concept-c fabrication robotic arm shoulder anchored to rock', [0.22, 0.9, 0.22], [-8.05, 1.72, -0.15], MATS.steel);
  armBase.rotation.z = THREE.MathUtils.degToRad(-12);
  const armFore = box('concept-c fabrication robotic arm forearm over hull', [1.2, 0.12, 0.12], [-7.52, 2.14, 0.24], MATS.amber);
  armFore.rotation.z = THREE.MathUtils.degToRad(-18);
  box('concept-c fabrication welding nozzle bright tip', [0.16, 0.16, 0.16], [-6.9, 1.92, 0.44], MATS.cyan);

  box('concept-c deploy cargo pod in carved cradle', [1.12, 0.62, 0.82], [6.36, 1.28, 0.22], MATS.darkSteel);
  box('concept-c deploy pod ready green status stripe', [0.9, 0.05, 0.06], [6.36, 1.62, 0.66], MATS.green);
  box('concept-c deploy launch conveyor dark channel', [3.5, 0.12, 0.5], [6.34, 0.98, 1.4], MATS.blackMetal);
  box('concept-c refinery tank left embedded in right rock bay', [0.52, 1.15, 0.52], [8.1, 1.52, -0.62], MATS.steel);
  box('concept-c refinery tank right embedded in right rock bay', [0.52, 1.15, 0.52], [8.82, 1.52, -0.62], MATS.steel);
  box('concept-c refinery cyan pressure line into asteroid wall', [0.08, 0.08, 2.4], [8.45, 2.2, -1.46], MATS.cyanDim);
  box('concept-c drilled support left bites into asteroid strata', [0.16, 2.4, 0.16], [-9.62, 1.72, -1.1], MATS.steel);
  box('concept-c drilled support right bites into asteroid strata', [0.16, 2.4, 0.16], [9.62, 1.72, -1.1], MATS.steel);

  const catwalks = [
    ['front command bridge', 0, 1.0, 8.8, 0.18, 0.42, 0], ['rear service bridge', 0, -5.1, 10.6, 0.14, 0.34, 0],
    ['left diagonal access', -3.55, -2.4, 5.9, 0.12, 0.28, -28], ['right diagonal access', 3.55, -2.4, 5.9, 0.12, 0.28, 28]
  ];
  catwalks.forEach(([name, x, z, sx, sy, sz, yaw]) => {
    const walk = box(`concept-c ${name}`, [sx, sy, sz], [x, 0.74, z], MATS.steel);
    walk.rotation.y = THREE.MathUtils.degToRad(yaw);
    const strip = box(`concept-c ${name} edge light`, [sx * 0.82, 0.03, 0.035], [x, 0.88, z + 0.03], name.includes('front') ? MATS.amber : MATS.cyanDim);
    strip.rotation.y = walk.rotation.y;
  });
}

function buildHeroProductionBay() {
  const bay = new THREE.Group();
  bay.name = 'concept-c left hero fabrication bay unmistakable production read';
  bay.position.set(-6.72, -0.02, -0.05);
  bay.scale.set(1.22, 1.14, 1.12);
  root.add(bay);

  box('hero bay carved alcove shadow behind machinery', [4.9, 2.35, 0.22], [0, 2.05, -1.9], MATS.shadow, bay);
  box('hero bay rough rock upper bite around crane', [5.3, 0.34, 0.72], [0, 3.32, -1.72], MATS.rockCut, bay).rotation.z = THREE.MathUtils.degToRad(-3);
  box('hero bay left drilled wall anchor', [0.18, 2.4, 0.18], [-2.3, 1.82, -1.32], MATS.steel, bay);
  box('hero bay right drilled wall anchor', [0.18, 2.0, 0.18], [2.15, 1.64, -1.32], MATS.steel, bay);

  const craneRail = box('hero bay overhead crane rail across fabrication mouth', [4.5, 0.14, 0.16], [0, 2.92, -0.6], MATS.steel, bay);
  craneRail.rotation.z = THREE.MathUtils.degToRad(-2);
  box('hero bay orange crane trolley', [0.48, 0.34, 0.28], [-0.95, 2.72, -0.48], MATS.orange, bay);
  box('hero bay hanging crane cable', [0.055, 0.78, 0.055], [-0.95, 2.24, -0.48], MATS.blackMetal, bay);
  box('hero bay suspended engine module being assembled', [0.82, 0.46, 0.62], [-0.95, 1.72, -0.36], MATS.darkSteel, bay);
  box('hero bay engine cyan core glow', [0.46, 0.07, 0.08], [-0.95, 1.78, -0.01], MATS.cyan, bay);
  box('hero bay large ship-frame keel on build bed', [2.35, 0.1, 0.12], [0.15, 1.45, 0.78], MATS.steel, bay);
  const ribA = box('hero bay left angled ship-frame rib', [0.12, 0.82, 0.12], [-0.86, 1.7, 0.78], MATS.amber, bay);
  ribA.rotation.z = THREE.MathUtils.degToRad(-24);
  const ribB = box('hero bay right angled ship-frame rib', [0.12, 0.82, 0.12], [1.08, 1.7, 0.78], MATS.amber, bay);
  ribB.rotation.z = THREE.MathUtils.degToRad(24);
  box('hero bay bright rectangular build platform under ship frame', [2.7, 0.05, 0.72], [0.15, 1.18, 0.78], MATS.orange, bay);

  const belt = box('hero bay wide conveyor belt exiting rock cut', [4.35, 0.18, 0.62], [0, 0.96, 1.1], MATS.blackMetal, bay);
  belt.rotation.y = THREE.MathUtils.degToRad(-2);
  box('hero bay amber conveyor centerline', [3.7, 0.035, 0.05], [0, 1.08, 1.42], MATS.amber, bay);
  [-1.6, -0.55, 0.55, 1.55].forEach((x, index) => {
    box(`hero bay cargo block on conveyor ${index}`, [0.5, 0.34, 0.42], [x, 1.26, 1.1], index % 2 ? MATS.steel : MATS.orange, bay);
  });

  const armShoulder = box('hero bay large robotic arm shoulder', [0.34, 0.82, 0.34], [1.82, 1.7, -0.1], MATS.steel, bay);
  armShoulder.rotation.z = THREE.MathUtils.degToRad(8);
  const upperArm = box('hero bay large robotic arm upper link', [1.15, 0.14, 0.14], [1.28, 2.03, 0.15], MATS.amber, bay);
  upperArm.rotation.z = THREE.MathUtils.degToRad(22);
  const lowerArm = box('hero bay large robotic arm welding link', [0.95, 0.12, 0.12], [0.62, 1.84, 0.38], MATS.steel, bay);
  lowerArm.rotation.z = THREE.MathUtils.degToRad(-18);
  box('hero bay welding spark at workpiece', [0.18, 0.18, 0.18], [0.12, 1.68, 0.52], MATS.cyan, bay);

  box('hero bay warm foundry glow pit under conveyor', [3.9, 0.05, 0.72], [0, 0.74, 1.1], MATS.orange, bay);
  const productionKey = new THREE.PointLight(COLORS.orange, 5.2, 6.8);
  productionKey.name = 'concept-c hero production bay local warm light';
  productionKey.position.set(-6.7, 1.7, 1.0);
  root.add(productionKey);
  box('hero bay pipe disappearing into rock left', [0.08, 0.08, 2.4], [-2.42, 2.32, -2.05], MATS.amber, bay).rotation.y = THREE.MathUtils.degToRad(18);
  box('hero bay pipe disappearing into rock right', [0.08, 0.08, 2.0], [2.28, 2.18, -2.02], MATS.cyanDim, bay).rotation.y = THREE.MathUtils.degToRad(-18);
}

function buildAsymmetricRockBites() {
  const asym = new THREE.Group();
  asym.name = 'concept-c asymmetric asteroid bites and embedded seams';
  root.add(asym);
  const chunks = [
    ['left heavy upper bite breaks symmetry', -9.15, 5.18, 2.85, 4.2, 0.78, 2.5, -15],
    ['left lower protruding cut mass', -9.95, 0.76, 2.95, 2.3, 0.74, 1.55, 10],
    ['left hanging belly shard below production bay', -7.1, -0.02, 3.08, 3.4, 0.54, 1.36, -7],
    ['right rear recessed cave cheek', 9.15, 3.7, -1.95, 0.95, 2.0, 2.7, -6],
    ['right lower broken sill notch', 6.2, 0.42, 3.15, 1.5, 0.22, 1.0, -4],
    ['small right chipped roof remnant keeps asymmetry honest', 7.7, 4.86, 2.92, 1.2, 0.24, 1.0, 8]
  ];
  chunks.forEach(([name, x, y, z, sx, sy, sz, rot], index) => {
    const chunk = box(`concept-c ${name}`, [sx, sy, sz], [x, y, z], index % 2 ? MATS.rockCut : MATS.rockOuter, asym);
    chunk.rotation.z = THREE.MathUtils.degToRad(rot);
  });
  ['left', 'right'].forEach((side, index) => {
    const x = side === 'left' ? -9.95 : 9.95;
    const seam = box(`concept-c ${side} bright rock-to-metal contact seam`, [0.055, 2.4, 0.055], [x, 2.4, 2.85], index ? MATS.cyanDim : MATS.amber, asym);
    seam.rotation.z = THREE.MathUtils.degToRad(side === 'left' ? -5 : 5);
  });
}

function buildRockSwallowedFacilityDetails() {
  const detail = new THREE.Group();
  detail.name = 'concept-c rock swallowed facility detail pass';
  root.add(detail);

  const cutChunks = [
    ['upper-left overhang fractured tooth A', -8.0, 4.74, 3.5, 1.7, 0.34, 0.94, -20],
    ['upper-left overhang fractured tooth B', -5.35, 4.52, 3.45, 1.9, 0.28, 0.82, 14],
    ['upper-left deep hanging rock fang over production', -6.35, 3.96, 3.58, 0.72, 0.92, 0.7, -8],
    ['upper-right thinner broken tooth', 5.95, 4.48, 3.45, 0.96, 0.18, 0.62, -10],
    ['left lower rock swallowing fabrication floor', -9.2, 0.62, 2.62, 2.8, 0.58, 1.35, 7],
    ['left lower broken ballast hanging below floor', -6.1, -0.26, 2.88, 2.4, 0.48, 1.2, -12],
    ['right rear rock alcove wrapping deploy tank', 8.72, 1.88, -0.88, 1.08, 1.62, 1.0, -8]
  ];
  cutChunks.forEach(([name, x, y, z, sx, sy, sz, rot], index) => {
    const chunk = box(`concept-c ${name}`, [sx, sy, sz], [x, y, z], index % 2 ? MATS.rockWarm : MATS.rockCut, detail);
    chunk.rotation.z = THREE.MathUtils.degToRad(rot);
  });

  const tunnel = cylinder('concept-c dark service tunnel bored into left asteroid wall', 0.72, 0.72, 0.18, 24, [-10.08, 2.72, 1.84], MATS.shadow, detail);
  tunnel.rotation.x = Math.PI / 2;
  const tunnelRim = torus('concept-c amber service tunnel rim bolted to rock', 0.78, 0.035, 8, 36, [-10.08, 2.72, 1.94], MATS.amber, detail);
  tunnelRim.rotation.x = Math.PI / 2;
  const rightTunnel = cylinder('concept-c dark utility tunnel bored into right asteroid wall', 0.54, 0.54, 0.18, 20, [10.12, 2.15, 1.76], MATS.shadow, detail);
  rightTunnel.rotation.x = Math.PI / 2;
  const rightRim = torus('concept-c cyan utility tunnel rim bolted to rock', 0.6, 0.028, 8, 32, [10.12, 2.15, 1.86], MATS.cyanDim, detail);
  rightRim.rotation.x = Math.PI / 2;

  const contactShadows = [
    ['fabrication bay upper contact shadow under rock bite', -7.05, 3.02, -1.64, 6.7],
    ['heavy left underside occlusion where asteroid swallows deck', -7.65, 0.78, 2.18, 4.8],
    ['deploy bay upper contact shadow under rock bite', 6.45, 2.98, -1.64, 3.8],
    ['rear hangar rock contact shadow', -0.8, 4.0, -9.78, 10.2]
  ];
  contactShadows.forEach(([name, x, y, z, length]) => box(`concept-c ${name}`, [length, 0.08, 0.06], [x, y, z], MATS.shadow, detail));

  const bayScaleCrew = [
    [-8.25, 1.1, 1.95], [-7.55, 1.12, 1.82], [-5.02, 1.08, 1.72], [5.15, 1.06, 1.82], [7.92, 1.08, 1.72]
  ];
  bayScaleCrew.forEach(([x, y, z], index) => {
    cylinder(`concept-c tiny worker scale marker around production ${index}`, 0.035, 0.05, 0.24, 7, [x, y, z], MATS.blackMetal, detail);
    box(`concept-c tiny worker visor around production ${index}`, [0.07, 0.018, 0.018], [x, y + 0.14, z + 0.035], index % 2 ? MATS.amber : MATS.cyan, detail);
  });
}

function buildBrutalMassDepthPass() {
  const brutal = new THREE.Group();
  brutal.name = 'concept-c brutal mass and carved depth pass';
  root.add(brutal);

  const verticalIntrusions = [
    ['left-center collapsed roof spine interrupts horizontal shell', -2.7, 3.62, 3.38, 0.82, 2.34, 1.05, -9, MATS.rockOuter],
    ['left-center lighter cut face on roof spine', -2.25, 3.28, 3.78, 0.42, 1.85, 0.5, 7, MATS.rockCut],
    ['right-center diagonal roof tongue destroys clam shell rhythm', 2.25, 3.05, 3.24, 0.92, 2.65, 1.1, 18, MATS.rockOuter],
    ['black undercut behind right-center roof tongue', 2.72, 2.36, 3.42, 0.62, 1.72, 0.24, 18, MATS.shadow],
    ['lower-left jagged rock thrust upward through deck line', -4.8, 0.62, 3.36, 1.55, 1.18, 1.08, 12, MATS.rockOuter],
    ['lower-center broken black void separating sill islands', -0.35, 0.42, 3.42, 2.05, 1.05, 0.92, -4, MATS.shadow],
    ['right-side recessed thin cap pushed back into darkness', 7.85, 3.42, 1.12, 1.2, 1.3, 0.48, 4, MATS.shadow]
  ];
  verticalIntrusions.forEach(([name, x, y, z, sx, sy, sz, rot, material]) => {
    const chunk = box(`concept-c ${name}`, [sx, sy, sz], [x, y, z], material, brutal);
    chunk.rotation.z = THREE.MathUtils.degToRad(rot);
  });

  const swallowedArchitecture = [
    ['rock bite covering left fabrication roof edge', -6.3, 2.72, 0.32, 2.3, 0.34, 0.52, -6, MATS.rockCut],
    ['black occlusion behind swallowed left fabrication roof', -6.45, 2.5, 0.08, 2.7, 0.12, 0.1, 0, MATS.shadow],
    ['rock clamp interrupting central rear bridge', -1.9, 1.28, -4.84, 0.58, 1.25, 0.34, 6, MATS.rockOuter],
    ['buried right bay side column behind rock', 7.54, 1.62, 0.52, 0.48, 1.64, 0.52, -5, MATS.rockCut]
  ];
  swallowedArchitecture.forEach(([name, x, y, z, sx, sy, sz, rot, material]) => {
    const chunk = box(`concept-c ${name}`, [sx, sy, sz], [x, y, z], material, brutal);
    chunk.rotation.z = THREE.MathUtils.degToRad(rot);
  });

  polyMesh('concept-c final upper center missing bite void breaks roof continuity', [
    [-1.02, 5.46], [0.22, 5.08], [1.3, 4.42], [0.62, 3.94], [-0.82, 4.16], [-1.45, 4.82]
  ], MATS.shadow, 4.86, brutal);
  polyMesh('concept-c final upper right chipped star bite', [
    [6.7, 5.88], [8.75, 5.42], [9.72, 5.62], [9.02, 4.7], [7.28, 4.9]
  ], MATS.shadow, 4.88, brutal);
  box('concept-c bright cut rim left edge of final roof bite', [0.82, 0.055, 0.045], [-0.98, 4.86, 4.98], MATS.rockWarm, brutal).rotation.z = THREE.MathUtils.degToRad(-26);
  box('concept-c bright cut rim right edge of final roof bite', [0.92, 0.055, 0.045], [0.78, 4.42, 4.98], MATS.rockWarm, brutal).rotation.z = THREE.MathUtils.degToRad(22);

  box('concept-c deep rear cavern void behind central command shaft', [6.0, 2.6, 0.12], [0.25, 1.58, -3.92], MATS.shadow, brutal);
  box('concept-c black vertical shaft face visible behind command core', [2.9, 1.55, 0.08], [0.15, 0.86, -1.96], MATS.shadow, brutal);
  box('concept-c narrow cyan depth lights descending rear shaft A', [0.08, 0.45, 0.035], [-1.9, 1.1, -3.78], MATS.cyanDim, brutal);
  box('concept-c narrow amber depth lights descending rear shaft B', [0.08, 0.62, 0.035], [1.65, 0.82, -3.76], MATS.amber, brutal);
  box('concept-c heavy foreground black chasm under broken lower sill', [7.8, 0.62, 0.3], [-2.4, -0.18, 3.82], MATS.shadow, brutal);
  box('concept-c diagonal black chasm slice cutting flat lower deck line', [4.2, 0.42, 0.22], [1.0, 0.42, 3.12], MATS.shadow, brutal).rotation.z = THREE.MathUtils.degToRad(-8);
}


function buildSculptedRockPlane(name, points, {
  z = 6.3,
  grid = 0.12,
  relief = 0.22,
  warmBias = 0.02,
  parent = root,
  coolBias = 0.12
} = {}) {
  const geometry = new THREE.BufferGeometry();
  const vertices = [];
  const colors = [];
  const center = points.reduce((acc, [x, y]) => {
    acc.x += x;
    acc.y += y;
    return acc;
  }, { x: 0, y: 0 });
  center.x /= points.length;
  center.y /= points.length;
  const bounds = points.reduce((acc, [x, y]) => ({
    minX: Math.min(acc.minX, x),
    maxX: Math.max(acc.maxX, x),
    minY: Math.min(acc.minY, y),
    maxY: Math.max(acc.maxY, y)
  }), { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity });

  const push = (x, y, zz, seed = 0) => {
    vertices.push(x, y, zz);
    const strata = Math.sin((x * 0.24 + y * 0.82 + seed * 0.04) * 2.1) * 0.5 + 0.5;
    const altitude = THREE.MathUtils.clamp((y + 1.2) / 11.4, 0, 1);
    const c = hifiColor(x * 0.42 + seed * 0.05, y * 0.76, zz, warmBias + strata * 0.1);
    c.lerp(new THREE.Color(0x171522), coolBias * (1 - strata));
    c.lerp(new THREE.Color(0xb99a82), THREE.MathUtils.clamp(strata * 0.28 + altitude * 0.12 + warmBias, 0, 0.46));
    c.multiplyScalar(0.86 + altitude * 0.18);
    colors.push(c.r, c.g, c.b);
  };

  const sculptZ = (x, y, seed) => {
    const broadFold = Math.sin(x * 0.42 + y * 0.18 + seed * 0.03) * relief * 0.46;
    const shelfTilt = Math.sin(y * 0.7 - x * 0.12) * relief * 0.26;
    const wornUndulation = Math.sin((x + y) * 1.08 + seed * 0.08) * relief * 0.14;
    const rareChip = (hifiNoise(x * 1.1 - y * 0.8 + seed * 0.17) - 0.5) * relief * 0.08;
    return z + broadFold + shelfTilt + wornUndulation + rareChip;
  };

  for (let x = bounds.minX; x < bounds.maxX; x += grid) {
    for (let y = bounds.minY; y < bounds.maxY; y += grid) {
      const x1 = Math.min(x + grid, bounds.maxX);
      const y1 = Math.min(y + grid, bounds.maxY);
      const triA = [[x, y], [x1, y], [x1, y1]];
      const triB = [[x, y], [x1, y1], [x, y1]];
      const aCenter = [(x + x1 + x1) / 3, (y + y + y1) / 3];
      const bCenter = [(x + x1 + x) / 3, (y + y1 + y1) / 3];
      if (pointInPolygon(aCenter[0], aCenter[1], points)) {
        triA.forEach(([vx, vy], index) => push(vx, vy, sculptZ(vx, vy, index + x), index + x + y));
      }
      if (pointInPolygon(bCenter[0], bCenter[1], points)) {
        triB.forEach(([vx, vy], index) => push(vx, vy, sculptZ(vx, vy, index + y), index + x1 + y1));
      }
    }
  }

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
  geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, MATS.rockDenseHifi);
  mesh.name = name;
  parent.add(mesh);
  return mesh;
}

function buildHifi06AuthoredAsteroidGeology() {
  const geo = new THREE.Group();
  geo.name = 'concept-c HIFI-06 authored macro geology asteroid pass';
  root.add(geo);

  const sculptedPlanes = [
    ['hifi06 broad worn left ceiling lithic plane', [[-13.65, 7.0], [-11.7, 8.84], [-8.46, 9.26], [-5.18, 8.46], [-3.12, 6.92], [-5.96, 6.04], [-9.22, 6.3], [-12.0, 5.86]], 6.74, 0.105, 0.2, 0.08, 0.08],
    ['hifi06 central high sediment roof plate', [[-5.84, 8.82], [-2.52, 10.02], [1.22, 9.74], [4.74, 9.18], [7.32, 7.46], [6.04, 6.14], [2.24, 6.62], [-1.3, 6.16], [-4.58, 6.86]], 6.9, 0.1, 0.18, 0.02, 0.1],
    ['hifi06 right sloping fault wall face', [[7.0, 7.8], [9.34, 8.46], [12.22, 7.52], [13.78, 5.42], [13.06, 3.18], [11.5, 1.4], [10.18, 2.48], [10.62, 4.34], [8.92, 5.9]], 6.52, 0.105, 0.2, -0.04, 0.18],
    ['hifi06 left vertical shear wall face', [[-14.02, 6.18], [-12.7, 7.72], [-11.18, 6.28], [-10.72, 4.44], [-11.48, 2.8], [-10.84, 1.34], [-12.16, 0.6], [-13.78, 1.52], [-14.52, 3.82]], 6.56, 0.11, 0.22, -0.02, 0.2],
    ['hifi06 lower exposed crust shelf smoother geological shelf', [[-10.64, 0.54], [-7.54, 0.9], [-4.32, 0.24], [-1.14, 0.48], [2.64, -0.02], [6.08, 0.16], [8.72, -0.18], [7.72, -0.9], [3.98, -1.06], [-0.18, -0.62], [-4.28, -1.18], [-8.42, -0.72]], 6.34, 0.105, 0.16, 0.12, 0.08],
    ['hifi06 rear cold cavern plane separating roof depth', [[-7.82, 7.36], [-4.88, 8.02], [-1.32, 7.62], [1.88, 8.0], [5.38, 7.42], [7.28, 6.62], [5.04, 6.08], [1.42, 6.34], [-2.08, 6.02], [-5.9, 6.24]], 4.18, 0.13, 0.1, -0.22, 0.36]
  ];
  sculptedPlanes.forEach(([name, pts, z, grid, relief, warmBias, coolBias]) => {
    buildSculptedRockPlane(name, pts, { z, grid, relief, warmBias, coolBias, parent: geo });
  });

  const darkCanyonMat = mat(0x030208, { roughness: 1, transparent: true, opacity: 0.72 });
  const shadowCanyons = [
    ['hifi06 central roof canyon negative shape', [[-3.4, 8.34], [-1.12, 8.86], [1.46, 8.48], [3.38, 7.7], [2.62, 6.96], [-0.2, 7.24], [-2.64, 6.86]], 7.05],
    ['hifi06 right fault ravine dark core', [[9.18, 7.08], [10.52, 6.44], [11.94, 5.28], [12.18, 3.62], [11.2, 2.68], [10.62, 4.18], [9.62, 5.48]], 6.68],
    ['hifi06 left shear ravine dark core', [[-12.64, 6.82], [-11.78, 5.92], [-11.34, 4.66], [-11.94, 3.46], [-11.36, 2.32], [-12.42, 2.82], [-13.12, 4.4]], 6.72],
    ['hifi06 lower belly chipped shadow separation', [[-8.96, 0.3], [-5.38, -0.16], [-1.72, 0.08], [2.34, -0.22], [6.52, -0.08], [7.98, -0.5], [4.68, -0.74], [0.36, -0.56], [-4.42, -0.88], [-8.22, -0.54]], 6.44]
  ];
  shadowCanyons.forEach(([name, pts, z]) => {
    const mesh = hifiPrism(name, pts, { z, depth: 0.18, parent: geo, warmBias: -0.5, roughness: 0.03 });
    mesh.material = darkCanyonMat;
  });

  const strataSets = [
    [[-12.8, 7.48], [-9.82, 7.02], [-6.84, 7.28], [-4.22, 6.76], [-1.76, 7.08], [1.24, 6.76], [4.66, 6.98], [7.78, 6.38]],
    [[-12.2, 6.66], [-9.14, 6.16], [-6.14, 6.34], [-3.34, 5.92], [-0.42, 6.18], [2.88, 5.88], [6.2, 6.14], [8.9, 5.54]],
    [[-11.78, 5.86], [-9.38, 5.32], [-6.92, 5.58], [-4.18, 5.18], [-1.4, 5.36], [1.86, 5.08], [5.24, 5.34], [8.04, 4.86]],
    [[-10.42, 0.52], [-7.18, 0.2], [-3.82, -0.06], [-0.26, 0.04], [3.14, -0.14], [6.84, -0.3], [9.08, -0.06]],
    [[-9.86, -0.1], [-6.42, -0.36], [-2.72, -0.54], [1.22, -0.38], [5.1, -0.56], [8.06, -0.5]]
  ];
  strataSets.forEach((path, index) => {
    buildHifiFractureRibbon(`hifi06 readable sediment strata band ${index}`, path, {
      z: 7.02 - index * 0.12,
      depth: 0.24,
      widthStart: index < 3 ? 0.18 : 0.14,
      widthEnd: 0.08,
      warmBias: index % 2 ? 0.18 : -0.08,
      parent: geo,
      opacity: 0.98
    });
  });

  const veinPaths = [
    [[-10.8, 8.02], [-9.92, 7.38], [-8.7, 7.66], [-7.66, 7.02]],
    [[-4.62, 8.74], [-3.2, 8.12], [-2.18, 8.32], [-0.94, 7.7], [0.24, 7.92]],
    [[4.94, 8.34], [6.08, 7.76], [7.3, 7.92], [8.54, 7.14]],
    [[10.32, 6.22], [11.18, 5.54], [11.02, 4.62], [11.68, 3.84]],
    [[-12.5, 5.52], [-12.08, 4.62], [-12.42, 3.72], [-11.78, 2.82]]
  ];
  veinPaths.forEach((path, index) => {
    buildHifiFractureRibbon(`hifi06 selective mineral vein ${index}`, path, {
      z: 7.16 - (index % 3) * 0.1,
      depth: 0.12,
      widthStart: 0.052,
      widthEnd: 0.018,
      warmBias: 0.28,
      parent: geo,
      opacity: 0.86
    });
  });

  const basinMat = mat(0x050409, { roughness: 1, transparent: true, opacity: 0.6 });
  const lipMat = mat(0xc1a087, { roughness: 0.96, transparent: true, opacity: 0.42, emissive: 0x2a1408, emissiveIntensity: 0.08 });
  const basins = [
    [-9.96, 7.72, 7.08, 0.74, 2.05, 0.72, -14],
    [-2.08, 8.64, 7.16, 0.58, 1.56, 0.68, 10],
    [6.82, 7.92, 6.98, 0.68, 1.8, 0.74, 18],
    [11.38, 4.86, 6.82, 0.54, 1.24, 0.92, -24],
    [-12.48, 4.66, 6.82, 0.52, 1.24, 0.88, 24],
    [-6.94, 0.16, 6.6, 0.48, 1.9, 0.48, -6],
    [4.92, -0.22, 6.48, 0.42, 1.62, 0.48, 9]
  ];
  basins.forEach(([x, y, z, r, sx, sy, angle], index) => {
    const basin = new THREE.Mesh(new THREE.CircleGeometry(r, 72), basinMat);
    basin.name = `hifi06 broad non-uniform impact depression ${index}`;
    basin.position.set(x, y, z);
    basin.scale.set(sx, sy, 1);
    basin.rotation.z = THREE.MathUtils.degToRad(angle);
    geo.add(basin);
    const rim = new THREE.Mesh(new THREE.RingGeometry(r * 0.86, r * 1.12, 96), lipMat);
    rim.name = `hifi06 asymmetric raised impact rim ${index}`;
    rim.position.set(x, y, z + 0.035);
    rim.scale.set(sx, sy, 1);
    rim.rotation.z = THREE.MathUtils.degToRad(angle + (index % 2 ? 7 : -9));
    geo.add(rim);
  });

  for (let i = 0; i < 44; i += 1) {
    const leftSide = i % 2 === 0;
    const x = leftSide ? THREE.MathUtils.lerp(-12.6, -4.4, hifiNoise(i * 0.37)) : THREE.MathUtils.lerp(4.2, 12.2, hifiNoise(i * 0.43));
    const y = THREE.MathUtils.lerp(4.8, 8.9, hifiNoise(i * 0.57));
    hifiShard(`hifi06 chunky broken rock nodule not flat shard ${i}`, x, y, {
      z: 7.1 - (i % 6) * 0.08,
      width: 0.28 + hifiNoise(i * 1.5) * 0.44,
      height: 0.16 + hifiNoise(i * 1.7) * 0.2,
      depth: 0.46 + hifiNoise(i * 1.9) * 0.72,
      skew: 0.08 + hifiNoise(i * 2.1) * 0.16,
      warmBias: i % 3 === 0 ? 0.16 : -0.04,
      angle: -32 + hifiNoise(i * 2.7) * 64,
      roughness: 0.05,
      parent: geo
    });
  }

  const macroWarm = new THREE.PointLight(0xffb06d, 2.4, 16.0);
  macroWarm.name = 'hifi06 grazing warm light revealing sediment planes';
  macroWarm.position.set(-7.2, 7.7, 8.4);
  root.add(macroWarm);
  const macroCool = new THREE.PointLight(0x7cb6ff, 2.6, 20.0);
  macroCool.name = 'hifi06 cool light separating shadow canyons from noisy shell';
  macroCool.position.set(7.8, 7.2, 4.0);
  root.add(macroCool);
}

function buildCommandPit() {
  cylinder('concept-c raised upper deck lip around sunken command well', 3.7, 3.85, 0.16, 56, [0, 0.98, 0.02], MATS.steel);
  cylinder('concept-c vertical dark wall of sunken command well', 3.02, 3.18, 0.62, 56, [0, 0.72, 0.02], MATS.blackMetal);
  cylinder('concept-c lower recessed command pit floor clearly below deck', 2.08, 2.22, 0.12, 56, [0, 0.43, 0.02], MATS.shadow);
  cylinder('concept-c inner tapered command throat dropping below pit floor', 1.74, 2.02, 0.36, 48, [0, 0.15, 0.02], MATS.blackMetal);
  cylinder('concept-c deepest black command shaft visible below holo table', 1.3, 1.72, 0.96, 48, [0, -0.08, 0.02], MATS.shadow);
  const stepRing = torus('concept-c inner step shadow ring proving pit depth', 2.62, 0.045, 8, 72, [0, 0.78, 0.02], MATS.shadow);
  stepRing.rotation.x = Math.PI / 2;
  const amberRing = torus('concept-c amber operations walkway trim', 3.34, 0.035, 10, 80, [0, 1.1, 0.02], MATS.amber);
  amberRing.rotation.x = Math.PI / 2;
  const cyanRing = torus('concept-c cyan tactical pit rim', 2.48, 0.026, 10, 80, [0, 0.88, 0.02], MATS.cyan);
  cyanRing.rotation.x = Math.PI / 2;
  cylinder('concept-c central hologram plinth rising from lower pit', 0.72, 0.9, 0.42, 28, [0, 0.78, 0.02], MATS.blackMetal);
  const rampA = box('concept-c left stair bridge descending into command pit', [1.8, 0.09, 0.34], [-2.45, 0.92, 0.02], MATS.steel);
  rampA.rotation.y = THREE.MathUtils.degToRad(-22);
  const rampB = box('concept-c right stair bridge descending into command pit', [1.8, 0.09, 0.34], [2.45, 0.92, 0.02], MATS.steel);
  rampB.rotation.y = THREE.MathUtils.degToRad(22);
  box('concept-c front command pit safety rail', [3.8, 0.08, 0.08], [0, 1.28, 2.65], MATS.amber);
  box('concept-c rear command pit safety rail', [3.8, 0.08, 0.08], [0, 1.28, -2.6], MATS.cyanDim);
  [-2.2, -1.1, 1.1, 2.2].forEach((x, index) => {
    box(`concept-c visible pit rail post front ${index}`, [0.07, 0.46, 0.07], [x, 1.05, 2.65], MATS.steel);
    box(`concept-c visible pit rail post rear ${index}`, [0.07, 0.4, 0.07], [x, 1.02, -2.6], MATS.steel);
  });
  box('concept-c black occlusion slot inside pit front wall', [4.2, 0.1, 0.08], [0, 0.62, 2.18], MATS.shadow);
  box('concept-c black occlusion slot inside pit rear wall', [4.0, 0.1, 0.08], [0, 0.62, -2.1], MATS.shadow);
  cylinder('concept-c lower pit cyan glow at true bottom', 1.08, 1.34, 0.035, 48, [0, -0.36, 0.02], MATS.cyanDim);
  const shaftBeam = cylinder('concept-c faint command shaft light column', 0.2, 0.34, 1.36, 18, [0, 0.12, 0.02], mat(0x11355a, { transparent: true, opacity: 0.12, emissive: 0x2b8dd8, emissiveIntensity: 0.2, roughness: 0.08 }));
  shaftBeam.rotation.z = THREE.MathUtils.degToRad(2);
  box('concept-c heavy foreground lip occluding lower pit floor', [5.2, 0.18, 0.42], [0, 1.18, 3.02], MATS.blackMetal);
  box('concept-c amber highlight on foreground pit lip', [4.4, 0.035, 0.045], [0, 1.32, 2.82], MATS.amber);
  const stairTreads = [-0.52, -0.2, 0.12, 0.44].forEach((offset, index) => {
    const treadL = box(`concept-c left visible stair tread down into pit ${index}`, [0.62, 0.035, 0.18], [-2.74 + index * 0.22, 0.98 - index * 0.1, 0.62 + offset], MATS.steel);
    treadL.rotation.y = THREE.MathUtils.degToRad(-22);
    const treadR = box(`concept-c right visible stair tread down into pit ${index}`, [0.62, 0.035, 0.18], [2.74 - index * 0.22, 0.98 - index * 0.1, 0.62 + offset], MATS.steel);
    treadR.rotation.y = THREE.MathUtils.degToRad(22);
  });
  const holo = cylinder('concept-c blue holographic asteroid ops globe', 0.9, 0.9, 0.02, 48, [0, 1.72, 0.02], MATS.cyan);
  holo.rotation.x = Math.PI / 2;
  const halo = torus('concept-c projected orbital halo around holo globe', 1.18, 0.022, 8, 64, [0, 1.72, 0.02], MATS.cyan);
  halo.rotation.x = Math.PI / 2;
  halo.rotation.z = 0.42;
  animated.push({ mesh: halo, spin: 0.18 });

  [[-3.15, 2.55], [-2.55, 2.8], [2.9, 2.5], [3.4, -2.05]].forEach(([x, z], index) => {
    cylinder(`concept-c tiny crew scale marker near sunken pit ${index}`, 0.045, 0.06, 0.32, 7, [x, 1.22, z], MATS.blackMetal);
    box(`concept-c tiny crew visor cue near pit ${index}`, [0.09, 0.025, 0.02], [x, 1.42, z + 0.04], index % 2 ? MATS.amber : MATS.cyan);
  });

  [
    { radius: 2.42, y: 0.46, mat: MATS.shadow },
    { radius: 2.08, y: 0.28, mat: MATS.shadow },
    { radius: 1.72, y: 0.08, mat: MATS.cyanDim },
    { radius: 1.38, y: -0.12, mat: MATS.shadow },
    { radius: 1.04, y: -0.3, mat: MATS.cyanDim }
  ].forEach(({ radius, y, mat }, index) => {
    const lower = torus(`concept-c descending lower wall ring visible inside pit ${index}`, radius, 0.024, 8, 64, [0, y, 0.02], mat);
    lower.rotation.x = Math.PI / 2;
  });
  [-1.45, -0.72, 0, 0.72, 1.45].forEach((x, index) => {
    box(`concept-c tiny lower level pit light ${index}`, [0.18, 0.025, 0.025], [x, 0.18 - (index % 2) * 0.14, -1.72 - index * 0.08], index % 2 ? MATS.amber : MATS.cyanDim);
  });

  const lowerBridgeA = box('concept-c lower maintenance bridge crossing command throat', [1.18, 0.05, 0.16], [-0.44, -0.04, -0.42], MATS.darkSteel);
  lowerBridgeA.rotation.y = THREE.MathUtils.degToRad(28);
  const lowerBridgeB = box('concept-c deeper maintenance bridge crossing command throat', [0.96, 0.05, 0.14], [0.48, -0.24, -0.74], MATS.darkSteel);
  lowerBridgeB.rotation.y = THREE.MathUtils.degToRad(-22);
  box('concept-c lower maintenance bridge cyan rail', [0.84, 0.018, 0.024], [-0.44, 0.0, -0.4], MATS.cyanDim).rotation.y = lowerBridgeA.rotation.y;
  box('concept-c deeper maintenance bridge amber rail', [0.66, 0.018, 0.024], [0.48, -0.2, -0.72], MATS.amber).rotation.y = lowerBridgeB.rotation.y;

  const stations = [
    [-2.45, 1.24, -34, MATS.cyan], [-1.12, 2.16, -14, MATS.amber], [1.12, 2.16, 14, MATS.cyan], [2.45, 1.24, 34, MATS.amber],
    [-2.55, -1.04, 32, MATS.amber], [-1.0, -1.9, 12, MATS.cyan], [1.0, -1.9, -12, MATS.amber], [2.55, -1.04, -32, MATS.cyan]
  ];
  stations.forEach(([x, z, yaw, accent], index) => {
    const group = new THREE.Group();
    group.name = `concept-c readable operator station ${index}`;
    group.position.set(x, 1.03, z);
    group.rotation.y = THREE.MathUtils.degToRad(yaw);
    root.add(group);
    box('station console block', [0.62, 0.24, 0.28], [0, 0.08, 0.18], MATS.darkSteel, group);
    box('station lit screen', [0.42, 0.22, 0.035], [0, 0.26, 0.34], MATS.glass, group);
    box('station scanline', [0.3, 0.025, 0.035], [0, 0.34, 0.37], accent, group);
    cylinder('operator torso', 0.09, 0.12, 0.38, 8, [0, 0.22, -0.18], MATS.blackMetal, group);
    cylinder('operator helmet visor cue', 0.13, 0.13, 0.08, 10, [0, 0.48, -0.18], accent, group);
    animated.push({ mesh: group, bob: 0.015, baseY: group.position.y, phase: index });
  });
}

function buildScaleAndAtmosphere() {
  box('concept-c foreground soft excavation shadow', [16.0, 0.05, 0.06], [0, 0.48, 3.85], MATS.shadow);
  box('concept-c left exterior blue rim from open space', [0.05, 3.6, 0.05], [-10.72, 2.65, 2.8], MATS.cyanDim);
  box('concept-c right exterior blue rim from open space', [0.05, 3.6, 0.05], [10.72, 2.65, 2.8], MATS.cyanDim);
  box('concept-c top broken cut warm practical line', [8.4, 0.04, 0.05], [0, 4.5, 3.55], MATS.amber);
}

function addReferenceLights() {
  scene.add(new THREE.AmbientLight(0x55657d, 0.24));
  scene.add(new THREE.HemisphereLight(0x9ab4da, 0x0a0708, 0.6));

  const ceilingFill = new THREE.DirectionalLight(0xd4e6ff, 1.34);
  ceilingFill.position.set(-8.0, 13.6, 10.0);
  scene.add(ceilingFill);

  const rearLift = new THREE.DirectionalLight(0x7f9fc7, 0.94);
  rearLift.position.set(0.0, 6.2, -23.0);
  scene.add(rearLift);

  const frontLift = new THREE.DirectionalLight(0x89a7cf, 0.42);
  frontLift.position.set(0.0, 2.4, 16.0);
  scene.add(frontLift);

  const pitGlow = new THREE.PointLight(COLORS.cyan, 30.0, 46.0);
  pitGlow.position.set(0, -2.8, -10.8);
  scene.add(pitGlow);

  const leftBayGlow = new THREE.PointLight(0x72eeff, 18.0, 28.0);
  leftBayGlow.position.set(-10.8, 4.6, -12.8);
  scene.add(leftBayGlow);

  const warmCore = new THREE.PointLight(0xffa660, 19.0, 30.0);
  warmCore.position.set(1.0, 5.0, -12.0);
  scene.add(warmCore);

  const rightSpaceFlood = new THREE.PointLight(0xd9e8ff, 28.0, 44.0);
  rightSpaceFlood.position.set(17.2, 5.8, -20.4);
  scene.add(rightSpaceFlood);

  const rightSpaceRim = new THREE.DirectionalLight(0xb8d4ff, 2.2);
  rightSpaceRim.position.set(22.0, 7.8, -20.0);
  scene.add(rightSpaceRim);

  const topAmber = new THREE.PointLight(0xffc084, 6.0, 26.0);
  topAmber.position.set(0.4, 9.6, -8.2);
  scene.add(topAmber);
}

function buildReferenceStarfield() {
  const vertices = [];
  for (let i = 0; i < 2200; i += 1) {
    const rx = hifiNoise(i * 17.31 + 1.2);
    const ry = hifiNoise(i * 9.17 + 5.4);
    const rz = hifiNoise(i * 13.73 + 9.2);
    vertices.push(
      (rx - 0.5) * 108,
      -20 + ry * 48,
      -36 - rz * 74
    );
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  const stars = new THREE.Points(geo, new THREE.PointsMaterial({
    color: 0xe8f6ff,
    size: 0.12,
    transparent: true,
    opacity: 0.96,
    sizeAttenuation: true
  }));
  stars.name = 'concept-c HIFI-07 dense starfield around asteroid cavern';
  scene.add(stars);

  const heroStars = [
    [20.2, 10.6, -48.0, 0.16], [16.1, 6.4, -42.0, 0.11], [14.8, -2.8, -40.0, 0.09],
    [-19.6, 8.0, -46.0, 0.12], [-15.8, -4.2, -42.0, 0.09], [0.2, 12.6, -54.0, 0.09],
    [6.0, 9.4, -46.0, 0.09], [-7.2, 9.8, -45.0, 0.08]
  ];
  heroStars.forEach(([x, y, z, r], index) => {
    const star = cylinder(`concept-c hifi07 hero star ${index}`, r, r, 0.02, 16, [x, y, z], mat(0xf7fbff, { emissive: 0xcde6ff, emissiveIntensity: 1.4 }));
    star.rotation.x = Math.PI / 2;
  });

  const outsideRock = new THREE.Group();
  outsideRock.name = 'concept-c hifi07 distant exterior asteroid outside right hangar';
  scene.add(outsideRock);
  buildHifiRockPanel('hifi07 distant outside asteroid slab', [
    [14.8, 3.0], [17.8, 5.8], [20.8, 6.2], [23.0, 4.0], [22.2, 0.6], [18.4, -1.8], [15.6, -0.8]
  ], {
    z: -28.6,
    depth: 5.2,
    grid: 0.18,
    rimInset: 0.12,
    backShrink: 0.14,
    relief: 0.28,
    mediumRelief: 0.1,
    microRelief: 0.02,
    frontWarp: 0.1,
    warmBias: -0.1,
    parent: outsideRock,
    valueZones: [
      { x: 18.8, y: 2.4, rx: 5.4, ry: 2.8, shadow: 0.28, cool: 0.16 },
      { x: 20.2, y: 4.8, rx: 3.0, ry: 1.6, dust: 0.18 }
    ]
  });
  buildHifiRockPanel('hifi07 distant left exterior asteroid shoulder', [
    [-21.6, 4.0], [-18.8, 6.2], [-15.4, 5.6], [-15.0, 2.2], [-16.6, -0.4], [-19.8, -1.0], [-22.0, 1.0]
  ], {
    z: -29.2,
    depth: 4.8,
    grid: 0.18,
    rimInset: 0.12,
    backShrink: 0.14,
    relief: 0.26,
    mediumRelief: 0.08,
    microRelief: 0.02,
    frontWarp: 0.1,
    warmBias: -0.12,
    parent: outsideRock,
    valueZones: [
      { x: -18.4, y: 2.2, rx: 4.6, ry: 3.0, shadow: 0.26, cool: 0.14 },
      { x: -16.8, y: 5.0, rx: 2.0, ry: 1.2, dust: 0.16 }
    ]
  });
}

function buildReferenceApertureShell() {
  const shell = new THREE.Group();
  shell.name = 'concept-c HIFI-07 reference-matched asteroid cavern shell';
  root.add(shell);

  const foregroundShadow = mat(0x010104, { roughness: 1, side: THREE.DoubleSide });

  const rockPasses = [
    {
      name: 'hifi07 massive foreground top aperture arch',
      pts: [[-20.0, 13.8], [-19.0, 17.0], [-17.0, 20.2], [-13.4, 22.8], [-8.4, 24.2], [-2.8, 24.0], [2.8, 24.0], [8.4, 23.2], [13.6, 21.2], [17.2, 18.0], [19.2, 14.8], [20.0, 12.4], [15.8, 15.2], [10.8, 15.8], [5.4, 16.0], [0.0, 16.2], [-5.4, 16.0], [-10.8, 15.6], [-15.6, 14.8], [-19.0, 13.8]],
      z: -2.2,
      depth: 8.0,
      warmBias: -0.12,
      relief: 0.58,
      geology: [
        { type: 'band', ax: -17.0, ay: 10.4, bx: 17.0, by: 9.6, width: 2.0, height: 0.24, terraces: 14, terraceHeight: 0.12, dust: 0.08, shadow: 0.14 },
        { type: 'fault', ax: -12.2, ay: 13.6, bx: -8.0, by: 8.0, width: 0.5, depth: 0.2, rim: 0.08, shadow: 0.18 },
        { type: 'fault', ax: 8.6, ay: 13.0, bx: 14.0, by: 8.4, width: 0.52, depth: 0.18, rim: 0.08, shadow: 0.18 },
        { type: 'basin', x: 0.8, y: 11.6, rx: 2.8, ry: 1.2, angle: -6, depth: 0.12, rim: 0.04, shadow: 0.12 }
      ],
      valueZones: [
        { x: 0.2, y: 10.4, rx: 19.2, ry: 5.0, shadow: 0.4, cool: 0.18 },
        { x: -5.8, y: 14.0, rx: 5.0, ry: 2.0, dust: 0.16 },
        { x: 10.6, y: 12.6, rx: 5.6, ry: 2.0, cool: 0.14 }
      ]
    },
    {
      name: 'hifi07 massive left foreground cavern wall',
      pts: [[-20.0, -10.6], [-19.4, -3.4], [-18.8, 3.6], [-17.0, 8.6], [-14.2, 10.0], [-12.8, 6.4], [-12.2, 0.8], [-12.2, -6.0], [-14.0, -11.8], [-17.4, -14.2]],
      z: -0.8,
      depth: 8.2,
      warmBias: -0.14,
      relief: 0.5,
      geology: [
        { type: 'band', ax: -17.8, ay: 6.8, bx: -13.6, by: -8.2, width: 1.2, height: 0.2, terraces: 8, terraceHeight: 0.08, shadow: 0.12 },
        { type: 'basin', x: -15.6, y: 1.0, rx: 1.4, ry: 2.4, angle: 16, depth: 0.12, rim: 0.04, shadow: 0.16 }
      ],
      valueZones: [
        { x: -15.4, y: -0.2, rx: 4.0, ry: 8.0, shadow: 0.44, cool: 0.18 },
        { x: -14.2, y: 6.2, rx: 2.0, ry: 1.4, dust: 0.14 }
      ]
    },
    {
      name: 'hifi07 massive lower sill aperture shelf',
      pts: [[-19.0, -13.8], [-14.8, -12.0], [-8.6, -10.8], [-1.0, -10.2], [6.4, -10.6], [12.8, -11.8], [17.8, -13.6], [19.0, -16.4], [16.2, -19.2], [9.0, -20.8], [0.4, -21.2], [-8.2, -20.2], [-14.8, -18.6], [-18.8, -16.6]],
      z: -0.4,
      depth: 8.0,
      warmBias: -0.1,
      relief: 0.48,
      geology: [
        { type: 'band', ax: -15.6, ay: -8.0, bx: 15.2, by: -8.2, width: 1.1, height: 0.18, terraces: 10, terraceHeight: 0.08, dust: 0.16, warm: 0.04 },
        { type: 'fault', ax: -7.8, ay: -6.6, bx: -0.8, by: -12.8, width: 0.38, depth: 0.12, rim: 0.04, shadow: 0.16 },
        { type: 'fault', ax: 5.2, ay: -6.6, bx: 11.8, by: -13.0, width: 0.38, depth: 0.12, rim: 0.04, shadow: 0.16 }
      ],
      valueZones: [
        { x: 0.2, y: -9.8, rx: 16.2, ry: 3.6, shadow: 0.42 },
        { x: -8.4, y: -7.2, rx: 4.0, ry: 1.4, dust: 0.18 },
        { x: 9.2, y: -7.4, rx: 4.4, ry: 1.4, dust: 0.14 }
      ]
    },
    {
      name: 'hifi07 right outer cavern cheek leaving hangar break',
      pts: [[12.4, 9.0], [15.8, 10.2], [19.2, 8.8], [20.0, 4.0], [19.0, -2.8], [16.4, -9.6], [13.8, -12.2], [12.6, -7.0], [12.2, 1.0], [12.0, 6.0]],
      z: -0.8,
      depth: 8.0,
      warmBias: -0.08,
      relief: 0.48,
      geology: [
        { type: 'band', ax: 13.0, ay: 7.0, bx: 16.4, by: -7.2, width: 1.1, height: 0.18, terraces: 8, terraceHeight: 0.08, shadow: 0.12 },
        { type: 'basin', x: 15.6, y: 1.6, rx: 1.4, ry: 2.4, angle: -18, depth: 0.1, rim: 0.04, shadow: 0.16 }
      ],
      valueZones: [
        { x: 15.0, y: 0.8, rx: 3.8, ry: 7.4, shadow: 0.38, cool: 0.16 },
        { x: 13.2, y: 6.8, rx: 1.8, ry: 1.4, dust: 0.12 }
      ]
    },
    {
      name: 'hifi07 rear cavern roof mass above city',
      pts: [[-10.8, 17.8], [-7.8, 19.2], [-3.2, 20.0], [2.4, 19.8], [7.0, 19.2], [10.2, 18.0], [8.0, 17.2], [3.8, 16.8], [-0.2, 16.6], [-4.6, 16.8], [-8.2, 17.0]],
      z: -13.2,
      depth: 4.0,
      warmBias: -0.06,
      relief: 0.4,
      mediumRelief: 0.09,
      microRelief: 0.01,
      geology: [
        { type: 'band', ax: -12.4, ay: 12.6, bx: 11.2, by: 11.8, width: 1.1, height: 0.12, terraces: 9, terraceHeight: 0.06, shadow: 0.08 },
        { type: 'basin', x: -0.2, y: 12.4, rx: 2.4, ry: 1.0, angle: 0, depth: 0.08, rim: 0.02, shadow: 0.1 }
      ],
      valueZones: [
        { x: 0.0, y: 11.0, rx: 13.0, ry: 3.2, shadow: 0.14, cool: 0.1 }
      ]
    },
    {
      name: 'hifi07 rear left cyan chamber shoulder',
      pts: [[-14.2, 5.2], [-11.0, 6.2], [-8.8, 4.6], [-8.6, 1.2], [-9.8, -0.6], [-12.8, -0.2], [-14.4, 2.2]],
      z: -7.2,
      depth: 5.4,
      warmBias: -0.08,
      relief: 0.34,
      mediumRelief: 0.07,
      microRelief: 0.01,
      valueZones: [
        { x: -11.8, y: 2.8, rx: 3.6, ry: 3.2, shadow: 0.18, cool: 0.14 }
      ]
    },
    {
      name: 'hifi07 right hangar roof lip to space',
      pts: [[8.0, 7.2], [10.8, 7.6], [14.4, 7.8], [16.2, 6.4], [14.6, 4.8], [11.4, 4.8], [8.8, 5.4]],
      z: -6.8,
      depth: 5.4,
      warmBias: -0.04,
      relief: 0.28,
      mediumRelief: 0.06,
      microRelief: 0.01,
      valueZones: [
        { x: 12.8, y: 6.2, rx: 4.8, ry: 1.4, shadow: 0.16, cool: 0.16 }
      ]
    }
  ];

  rockPasses.forEach(({ name, pts, z, depth, warmBias, relief, mediumRelief = 0.1, microRelief = 0.014, geology = [], valueZones = [] }) => {
    buildHifiRockPanel(name, pts, {
      z,
      depth,
      grid: 0.12,
      rimInset: 0.16,
      backShrink: 0.18,
      relief,
      mediumRelief,
      microRelief,
      strataRelief: 0.1,
      radialRelief: 0.04,
      frontWarp: 0.14,
      warmBias,
      geology,
      valueZones,
      parent: shell
    });
  });

  polyMesh('hifi07 pure shadow top aperture mask', [
    [-20.0, 17.2], [-16.4, 19.8], [-10.2, 21.6], [-0.8, 22.0], [8.4, 21.4], [15.8, 19.8], [20.0, 17.6], [20.0, 24.0], [-20.0, 24.0]
  ], foregroundShadow, 10.6, shell);
  polyMesh('hifi07 pure shadow bottom aperture mask', [
    [-20.0, -15.4], [-15.6, -17.8], [-8.4, -19.8], [0.8, -20.6], [8.8, -19.6], [15.6, -17.8], [20.0, -15.2], [20.0, -24.0], [-20.0, -24.0]
  ], foregroundShadow, 10.8, shell);
  polyMesh('hifi07 pure shadow left aperture mask', [
    [-20.0, -16.4], [-18.0, -11.0], [-16.2, -2.4], [-15.6, 8.0], [-17.6, 15.8], [-20.0, 18.2]
  ], foregroundShadow, 10.4, shell);
  polyMesh('hifi07 pure shadow right aperture mask', [
    [20.0, -16.0], [17.8, -10.8], [15.8, -2.0], [16.0, 9.6], [18.2, 16.2], [20.0, 18.4]
  ], foregroundShadow, 10.4, shell);

  const rearVoid = box('hifi07 rear cavern black depth wall', [18.4, 9.8, 0.24], [0.4, 4.6, -24.0], MATS.shadow, shell);
  rearVoid.rotation.x = THREE.MathUtils.degToRad(-3);
  const leftVoid = box('hifi07 left cavern black depth pocket', [6.8, 8.0, 0.18], [-11.8, 4.2, -21.0], MATS.shadow, shell);
  leftVoid.rotation.z = THREE.MathUtils.degToRad(6);

  const rightOpeningGlow = box('hifi07 giant right hangar opening to space', [10.8, 10.8, 0.08], [14.6, 4.8, -22.6], mat(0xbcd6ff, {
    emissive: 0xa9c8ff,
    emissiveIntensity: 1.9,
    transparent: true,
    opacity: 0.88,
    roughness: 0.08
  }), shell);
  rightOpeningGlow.rotation.z = THREE.MathUtils.degToRad(-4);
  const leftOpeningGlow = box('hifi07 cyan side bay glow window', [4.8, 6.4, 0.08], [-11.6, 4.0, -19.4], mat(0x7de7ff, {
    emissive: 0x69dbff,
    emissiveIntensity: 1.04,
    transparent: true,
    opacity: 0.28,
    roughness: 0.08
  }), shell);
  leftOpeningGlow.rotation.z = THREE.MathUtils.degToRad(4);

  const openingFrame = new THREE.Group();
  openingFrame.name = 'concept-c hifi07 right hangar frame';
  shell.add(openingFrame);
  box('hifi07 right hangar top frame', [9.8, 0.34, 0.44], [14.4, 10.0, -21.4], MATS.darkSteel, openingFrame);
  box('hifi07 right hangar bottom frame', [9.2, 0.28, 0.38], [14.5, -0.6, -21.1], MATS.darkSteel, openingFrame);
  box('hifi07 right hangar left jamb', [0.34, 9.8, 0.38], [9.4, 4.6, -21.1], MATS.darkSteel, openingFrame);
  box('hifi07 right hangar right jamb', [0.34, 9.2, 0.38], [19.2, 4.8, -21.1], MATS.darkSteel, openingFrame);
  box('hifi07 right hangar icy header glow', [8.6, 0.08, 0.08], [14.4, 10.4, -20.8], MATS.cyan, openingFrame);
}

function buildReferenceFacilityMassing() {
  const facility = new THREE.Group();
  facility.name = 'concept-c HIFI-07 embedded industrial city';
  root.add(facility);

  const addLightRun = (name, start, end, count, material, yJitter = 0, zJitter = 0) => {
    for (let i = 0; i < count; i += 1) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      box(`${name} ${i}`, [0.14, 0.04, 0.04], [
        THREE.MathUtils.lerp(start[0], end[0], t),
        THREE.MathUtils.lerp(start[1], end[1], t) + Math.sin(i * 0.9) * yJitter,
        THREE.MathUtils.lerp(start[2], end[2], t) + Math.cos(i * 0.8) * zJitter
      ], material, facility);
    }
  };

  const addBridge = (name, x, y, z, length, yaw, accent = MATS.amber) => {
    const deck = box(`${name} deck`, [length, 0.12, 0.46], [x, y, z], MATS.steel, facility);
    deck.rotation.y = THREE.MathUtils.degToRad(yaw);
    const railL = box(`${name} rail L`, [length * 0.9, 0.03, 0.04], [x, y + 0.12, z + 0.22], accent, facility);
    const railR = box(`${name} rail R`, [length * 0.9, 0.03, 0.04], [x, y + 0.12, z - 0.22], accent, facility);
    railL.rotation.y = deck.rotation.y;
    railR.rotation.y = deck.rotation.y;
  };

  box('hifi07 central ring megadeck', [25.0, 0.66, 16.8], [0.2, 1.0, -10.8], MATS.steel, facility);
  box('hifi07 central ring rear dark bite', [16.8, 0.18, 8.6], [0.0, 1.68, -14.4], MATS.shadow, facility);
  box('hifi07 upper rear city shelf', [16.8, 0.24, 3.4], [0.2, 6.8, -15.8], MATS.blackMetal, facility);

  const pitOuter = cylinder('hifi07 central circular deck around blue pit', 8.8, 9.1, 0.62, 96, [0.0, 1.16, -10.8], MATS.darkSteel, facility);
  const pitVoid = cylinder('hifi07 central circular pit mouth', 6.1, 6.4, 0.76, 88, [0.0, 0.82, -10.8], MATS.shadow, facility);
  const pitRingA = cylinder('hifi07 pit ring level A', 5.5, 5.9, 0.36, 80, [0.0, 0.06, -10.8], MATS.blackMetal, facility);
  const pitRingB = cylinder('hifi07 pit ring level B', 4.7, 5.0, 0.3, 76, [0.0, -0.86, -10.8], MATS.blackMetal, facility);
  const pitRingC = cylinder('hifi07 pit ring level C', 3.8, 4.2, 0.28, 72, [0.0, -1.78, -10.8], MATS.blackMetal, facility);
  const pitRingD = cylinder('hifi07 pit ring level D', 2.9, 3.2, 0.24, 68, [0.0, -2.7, -10.8], MATS.shadow, facility);
  const pitRimGlow = torus('hifi07 pit outer cyan rim', 6.34, 0.08, 12, 112, [0.0, 1.06, -10.8], MATS.cyan, facility);
  pitRimGlow.rotation.x = Math.PI / 2;
  const pitMidGlow = torus('hifi07 pit mid amber rim', 5.12, 0.07, 12, 104, [0.0, 0.1, -10.8], MATS.amber, facility);
  pitMidGlow.rotation.x = Math.PI / 2;
  const pitDeepGlow = torus('hifi07 pit deep cyan rim', 4.08, 0.06, 12, 96, [0.0, -1.0, -10.8], MATS.cyanDim, facility);
  pitDeepGlow.rotation.x = Math.PI / 2;
  const pitLowerGlow = torus('hifi07 pit lower cyan rim', 3.06, 0.05, 12, 84, [0.0, -2.0, -10.8], MATS.cyanDim, facility);
  pitLowerGlow.rotation.x = Math.PI / 2;
  const pitCore = cylinder('hifi07 blue pit core', 1.2, 2.1, 3.8, 44, [0.0, -3.6, -10.8], mat(0x0f2744, {
    emissive: 0x59f1ff,
    emissiveIntensity: 1.26,
    transparent: true,
    opacity: 0.46,
    roughness: 0.12
  }), facility);
  pitCore.rotation.z = THREE.MathUtils.degToRad(2);
  const pitGlow = cylinder('hifi07 pit floor glow', 2.2, 2.9, 0.05, 56, [0.0, -5.2, -10.8], MATS.cyan, facility);
  pitGlow.rotation.x = Math.PI / 2;
  [pitOuter, pitVoid, pitRingA, pitRingB, pitRingC, pitRingD].forEach((mesh) => { mesh.rotation.y = 0.04; });
  for (let i = 0; i < 8; i += 1) {
    const angle = (Math.PI * 2 * i) / 8 + 0.18;
    box(`hifi07 pit vertical brace ${i}`, [0.16, 3.2, 0.16], [Math.cos(angle) * 5.4, -0.82, -10.8 + Math.sin(angle) * 5.4], MATS.blackMetal, facility);
  }

  const pitTerraces = [
    { radius: 7.0, y: 0.4, count: 18, width: 2.0, depth: 1.0, height: 0.56, material: MATS.darkSteel, accent: MATS.amber },
    { radius: 5.8, y: -0.52, count: 16, width: 1.7, depth: 0.9, height: 0.48, material: MATS.blackMetal, accent: MATS.cyanDim },
    { radius: 4.6, y: -1.5, count: 14, width: 1.4, depth: 0.8, height: 0.42, material: MATS.blackMetal, accent: MATS.cyanDim }
  ];
  pitTerraces.forEach(({ radius, y, count, width, depth, height, material, accent }, tier) => {
    for (let i = 0; i < count; i += 1) {
      const angle = (Math.PI * 2 * i) / count + tier * 0.08;
      const x = Math.cos(angle) * radius;
      const z = -10.8 + Math.sin(angle) * radius;
      const wall = box(`hifi07 pit terrace ${tier} wall ${i}`, [width, height, depth], [x, y, z], material, facility);
      wall.rotation.y = -angle;
      if (i % 2 === tier % 2) {
        const light = box(`hifi07 pit terrace ${tier} light ${i}`, [width * 0.72, 0.05, 0.05], [x, y + height * 0.34, z + Math.sin(angle) * 0.12], accent, facility);
        light.rotation.y = wall.rotation.y;
      }
    }
  });

  [
    { x: -6.4, z: -8.4, yaw: -28, accent: MATS.amber, y: 1.42, length: 6.4 },
    { x: 6.4, z: -8.6, yaw: 28, accent: MATS.cyanDim, y: 1.42, length: 6.4 },
    { x: -2.8, z: -13.6, yaw: -10, accent: MATS.amber, y: 1.24, length: 5.6 },
    { x: 2.8, z: -13.8, yaw: 10, accent: MATS.cyanDim, y: 1.24, length: 5.6 },
    { x: -1.0, z: -9.8, yaw: 78, accent: MATS.amber, y: -0.2, length: 5.0 },
    { x: 1.0, z: -10.8, yaw: -78, accent: MATS.cyanDim, y: -1.0, length: 4.4 }
  ].forEach(({ x, z, yaw, accent, y, length }, index) => addBridge(`hifi07 pit bridge ${index}`, x, y, z, length, yaw, accent));

  const leftBay = new THREE.Group();
  leftBay.name = 'concept-c hifi07 cyan left bay';
  facility.add(leftBay);
  box('hifi07 left bay lower platform', [8.8, 0.34, 5.8], [-9.4, 1.3, -11.2], MATS.darkSteel, leftBay);
  box('hifi07 left bay mid terrace', [8.0, 0.3, 5.2], [-10.0, 2.6, -12.2], MATS.steel, leftBay);
  box('hifi07 left bay upper terrace', [6.8, 0.28, 4.8], [-10.8, 3.9, -13.3], MATS.darkSteel, leftBay);
  box('hifi07 left bay rear excavation wall', [3.8, 5.2, 0.24], [-12.8, 3.8, -15.4], MATS.shadow, leftBay);
  box('hifi07 left bay glowing chamber wall', [7.4, 4.4, 0.08], [-10.8, 4.0, -14.4], MATS.glass, leftBay);
  box('hifi07 left bay cyan header', [6.8, 0.12, 0.08], [-10.6, 6.0, -13.94], MATS.cyan, leftBay);
  box('hifi07 left bay lower cyan datum', [7.2, 0.06, 0.06], [-9.4, 1.56, -8.8], MATS.cyanDim, leftBay);
  box('hifi07 left bay broad cyan wash panel', [7.8, 1.6, 0.08], [-10.4, 3.2, -12.8], mat(0x123449, {
    emissive: COLORS.cyan,
    emissiveIntensity: 0.48,
    transparent: true,
    opacity: 0.24,
    roughness: 0.08
  }), leftBay);
  for (let i = 0; i < 7; i += 1) {
    const deck = box(`hifi07 left bay inset deck ${i}`, [2.2 + (i % 2) * 0.7, 0.16, 1.2], [-11.2 + i * 0.7, 1.4 + (i % 3) * 0.58, -10.4 - (i % 4) * 0.84], i % 2 ? MATS.darkSteel : MATS.blackMetal, leftBay);
    deck.rotation.y = THREE.MathUtils.degToRad(i % 2 ? -8 : 6);
  }

  const warmCore = new THREE.Group();
  warmCore.name = 'concept-c hifi07 warm amber industrial core';
  facility.add(warmCore);
  box('hifi07 warm core rear tower', [5.0, 5.6, 2.6], [1.0, 3.4, -13.2], MATS.darkSteel, warmCore);
  box('hifi07 warm core lower foundry block', [7.4, 2.1, 3.0], [0.4, 1.8, -11.4], MATS.blackMetal, warmCore);
  box('hifi07 warm core amber vent strip', [5.8, 0.08, 0.08], [1.0, 4.8, -11.84], MATS.amber, warmCore);
  box('hifi07 warm core lower vent strip', [6.0, 0.08, 0.08], [0.2, 2.4, -10.04], MATS.orange, warmCore);
  box('hifi07 warm core broad furnace glow', [6.4, 1.4, 0.08], [0.8, 3.5, -10.8], mat(0x4a2515, {
    emissive: COLORS.orange,
    emissiveIntensity: 0.42,
    transparent: true,
    opacity: 0.24,
    roughness: 0.1
  }), warmCore);
  box('hifi07 warm core left service tower', [0.42, 3.8, 0.42], [-1.9, 2.5, -10.9], MATS.steel, warmCore);
  box('hifi07 warm core right service tower', [0.42, 4.2, 0.42], [2.9, 2.7, -11.4], MATS.steel, warmCore);
  addBridge('hifi07 overhead crane span', -0.2, 5.2, -9.7, 11.4, 0, MATS.amber);
  box('hifi07 overhead crane trolley', [0.62, 0.46, 0.34], [1.2, 4.86, -9.34], MATS.orange, facility);
  box('hifi07 overhead crane cable', [0.08, 1.8, 0.08], [1.2, 3.9, -9.34], MATS.blackMetal, facility);
  box('hifi07 hanging workpod', [0.74, 0.42, 0.5], [1.2, 2.8, -9.1], MATS.darkSteel, facility);

  const rightHangar = new THREE.Group();
  rightHangar.name = 'concept-c hifi07 right hangar deck';
  facility.add(rightHangar);
  box('hifi07 right hangar upper apron', [8.6, 0.28, 6.4], [11.2, 3.0, -13.8], MATS.steel, rightHangar);
  box('hifi07 right hangar lower apron', [9.6, 0.26, 5.0], [11.6, 1.4, -11.2], MATS.darkSteel, rightHangar);
  box('hifi07 right hangar black runway trench', [6.2, 0.08, 3.2], [12.4, 1.52, -12.4], MATS.shadow, rightHangar);
  box('hifi07 right hangar cool runway stripe A', [5.8, 0.04, 0.06], [12.4, 1.66, -11.6], MATS.cyanDim, rightHangar);
  box('hifi07 right hangar cool runway stripe B', [5.8, 0.04, 0.06], [12.4, 1.66, -13.2], MATS.cyanDim, rightHangar);
  box('hifi07 right hangar cold space splash', [7.8, 2.2, 0.08], [13.4, 3.8, -15.8], mat(0x17314b, {
    emissive: 0xbcd6ff,
    emissiveIntensity: 0.42,
    transparent: true,
    opacity: 0.18,
    roughness: 0.08
  }), rightHangar);
  box('hifi07 right hangar warm service block', [1.6, 1.4, 1.2], [13.6, 1.7, -8.7], MATS.darkSteel, rightHangar);
  box('hifi07 right hangar amber service strip', [1.2, 0.06, 0.06], [13.6, 2.18, -8.04], MATS.amber, rightHangar);
  for (let i = 0; i < 4; i += 1) {
    const cargo = box(`hifi07 right hangar cargo sled ${i}`, [0.8, 0.32, 0.56], [9.3 + i * 1.2, 1.34, -10.9 + (i % 2) * 1.1], i % 2 ? MATS.steel : MATS.blackMetal, rightHangar);
    cargo.rotation.y = THREE.MathUtils.degToRad(-8 + i * 4);
  }

  addBridge('hifi07 left gantry bridge', -6.0, 3.0, -8.6, 5.2, -12, MATS.cyanDim);
  addBridge('hifi07 right gantry bridge', 6.2, 3.0, -8.8, 5.8, 12, MATS.amber);
  addBridge('hifi07 high cross-cavern bridge', 0.4, 5.2, -12.2, 8.8, 0, MATS.amber);
  addBridge('hifi07 upper rear traverse', -0.8, 6.4, -14.0, 10.6, 0, MATS.cyanDim);

  addLightRun('hifi07 pit perimeter lights front', [-6.8, 1.32, -4.4], [6.8, 1.32, -4.4], 24, MATS.amber);
  addLightRun('hifi07 pit perimeter lights rear', [-6.4, 1.28, -13.4], [6.4, 1.28, -13.4], 22, MATS.cyanDim);
  addLightRun('hifi07 left bay tiny practicals', [-12.8, 2.2, -12.8], [-6.4, 4.8, -9.0], 22, MATS.cyanDim, 0.04, 0.08);
  addLightRun('hifi07 warm core tiny practicals', [-2.0, 2.2, -12.4], [3.6, 4.8, -9.6], 20, MATS.amber, 0.03, 0.04);
  addLightRun('hifi07 hangar tiny practicals', [8.0, 2.2, -14.0], [14.8, 4.8, -10.8], 22, MATS.cyanDim, 0.02, 0.05);
  addLightRun('hifi07 rear skyline practicals', [-7.0, 5.6, -14.8], [7.8, 6.8, -13.8], 28, MATS.amber, 0.02, 0.04);

  const skylineMasses = [
    [-6.0, 2.2, -14.2, 1.8, 3.6, 1.2, MATS.darkSteel],
    [-2.2, 2.6, -14.8, 2.0, 4.8, 1.4, MATS.blackMetal],
    [1.8, 2.4, -14.6, 1.8, 4.0, 1.3, MATS.darkSteel],
    [5.6, 2.2, -14.0, 1.6, 3.2, 1.1, MATS.blackMetal]
  ];
  skylineMasses.forEach(([x, y, z, w, h, d, material], index) => {
    box(`hifi07 skyline mass ${index}`, [w, h, d], [x, y + h * 0.5, z], material, facility);
    box(`hifi07 skyline cap light ${index}`, [w * 0.7, 0.06, 0.05], [x, y + h, z + d * 0.32], index % 2 ? MATS.amber : MATS.cyanDim, facility);
  });

  for (let i = 0; i < 18; i += 1) {
    const x = -12.0 + (i % 6) * 1.16;
    const y = 1.1 + Math.floor(i / 6) * 0.98;
    const z = -9.4 - (i % 3) * 1.5;
    cylinder(`hifi07 tiny worker scale cue ${i}`, 0.04, 0.05, 0.24, 8, [x, y, z], MATS.blackMetal, facility);
    box(`hifi07 tiny worker visor cue ${i}`, [0.08, 0.02, 0.02], [x, y + 0.16, z + 0.03], i % 2 ? MATS.amber : MATS.cyan, facility);
  }

  const pitHaze = cylinder('hifi07 pit atmospheric haze column', 2.0, 3.0, 5.0, 32, [0.0, -1.0, -9.2], mat(0x102847, {
    emissive: 0x2d8fd0,
    emissiveIntensity: 0.28,
    transparent: true,
    opacity: 0.18,
    roughness: 0.08
  }), facility);
  pitHaze.rotation.z = THREE.MathUtils.degToRad(2);

  const leftFog = box('hifi07 left bay atmospheric fog', [6.8, 2.4, 1.8], [-10.4, 2.6, -12.2], mat(0x224c63, {
    emissive: 0x58dfff,
    emissiveIntensity: 0.16,
    transparent: true,
    opacity: 0.14,
    roughness: 0.1
  }), facility);
  const warmFog = box('hifi07 warm core industrial haze', [6.0, 2.4, 2.0], [0.8, 2.8, -11.2], mat(0x48281a, {
    emissive: 0xffa660,
    emissiveIntensity: 0.16,
    transparent: true,
    opacity: 0.12,
    roughness: 0.1
  }), facility);
  const hangarFog = box('hifi07 right hangar cold haze', [7.0, 2.0, 1.8], [13.0, 3.2, -14.8], mat(0x1b3552, {
    emissive: 0xbcd6ff,
    emissiveIntensity: 0.14,
    transparent: true,
    opacity: 0.12,
    roughness: 0.1
  }), facility);
  leftFog.rotation.y = THREE.MathUtils.degToRad(8);
  warmFog.rotation.y = THREE.MathUtils.degToRad(-6);
  hangarFog.rotation.y = THREE.MathUtils.degToRad(-10);
}


function buildHifi09ReferenceCompositionBoost() {
  const boost = new THREE.Group();
  boost.name = 'concept-c HIFI-09 reference composition boost';
  root.add(boost);

  const ovalShadowMat = mat(0x010104, { roughness: 1, transparent: true, opacity: 0.96, side: THREE.DoubleSide });
  const ovalRockMat = new THREE.MeshStandardMaterial({
    vertexColors: true,
    roughness: 0.98,
    metalness: 0.0,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.92
  });
  const rimWarmMat = mat(0xb48c6f, { roughness: 0.9, emissive: 0x231006, emissiveIntensity: 0.18, transparent: true, opacity: 0.42, side: THREE.DoubleSide });
  const rimCoolMat = mat(0x7fb7ff, { roughness: 0.3, emissive: 0x6aa7ff, emissiveIntensity: 0.55, transparent: true, opacity: 0.28, side: THREE.DoubleSide });

  const addOvalRing = (name, inner, outer, scale, z, material, rotation = 0) => {
    const ring = new THREE.Mesh(new THREE.RingGeometry(inner, outer, 220, 10), material);
    ring.name = name;
    ring.position.set(0, 2.8, z);
    ring.scale.set(scale[0], scale[1], 1);
    ring.rotation.z = THREE.MathUtils.degToRad(rotation);
    boost.add(ring);
    return ring;
  };

  addOvalRing('hifi09 continuous dark oval asteroid aperture silhouette', 0.62, 1.08, [22.8, 17.0], 12.2, ovalShadowMat, -2);
  addOvalRing('hifi09 inner warm chipped oval rim highlight', 0.625, 0.655, [22.1, 16.2], 12.32, rimWarmMat, -2);
  addOvalRing('hifi09 cold exterior rim kissing right opening', 0.63, 0.66, [22.6, 16.8], 12.38, rimCoolMat, -2);

  const rimBlocks = [
    ['top-left thick continuous rock rim', [-15.2, 12.6, 11.8], [7.4, 2.4, 0.5], -12],
    ['top-center sagging asteroid roof rim', [-4.2, 13.4, 11.9], [9.6, 2.2, 0.5], 2],
    ['top-right thick continuous rock rim', [10.8, 12.8, 11.8], [8.2, 2.2, 0.5], 12],
    ['left vertical continuous rock rim', [-17.4, 2.0, 11.7], [2.4, 13.0, 0.5], 5],
    ['right vertical continuous rock rim', [17.2, 1.8, 11.7], [2.4, 12.0, 0.5], -5],
    ['lower-left heavy asteroid lip', [-10.2, -8.4, 11.9], [10.8, 2.5, 0.5], 9],
    ['lower-right heavy asteroid lip', [8.6, -8.6, 11.9], [12.0, 2.5, 0.5], -8]
  ];
  rimBlocks.forEach(([name, pos, size, angle], index) => {
    const block = hifiShard(`hifi09 ${name}`, pos[0], pos[1], {
      z: pos[2],
      width: size[0],
      height: size[1],
      depth: 0.9,
      angle,
      warmBias: index % 2 ? -0.1 : 0.04,
      roughness: 0.05,
      parent: boost,
      material: MATS.shadow
    });
    block.scale.z = 0.7;
  });

  // Make the right-side hangar/window read as the giant cold opening in the reference.
  const windowMat = mat(0xcfe4ff, { emissive: 0xb6d2ff, emissiveIntensity: 2.8, transparent: true, opacity: 0.82, roughness: 0.05, side: THREE.DoubleSide });
  const windowCore = box('hifi09 huge right space window cold exterior core', [8.6, 7.8, 0.08], [14.6, 4.4, -17.4], windowMat, boost);
  windowCore.rotation.z = THREE.MathUtils.degToRad(-4);
  const windowHaze = box('hifi09 right space window bloom haze', [11.2, 10.0, 0.08], [14.4, 4.7, -17.8], mat(0x9fc7ff, { emissive: 0x9fc7ff, emissiveIntensity: 1.0, transparent: true, opacity: 0.18, roughness: 0.08, side: THREE.DoubleSide }), boost);
  windowHaze.rotation.z = THREE.MathUtils.degToRad(-4);
  ['top','bottom'].forEach((part, i) => {
    const y = i ? -0.05 : 8.95;
    const frame = box(`hifi09 right window massive ${part} structural frame`, [9.8, 0.42, 0.58], [14.5, y, -16.9], MATS.darkSteel, boost);
    frame.rotation.z = THREE.MathUtils.degToRad(-4);
    box(`hifi09 right window ${part} cyan edge`, [8.8, 0.07, 0.08], [14.5, y + (i ? 0.28 : -0.28), -16.5], MATS.cyan, boost).rotation.z = frame.rotation.z;
  });
  ['left','right'].forEach((part, i) => {
    const x = i ? 19.0 : 10.0;
    const frame = box(`hifi09 right window massive ${part} jamb`, [0.42, 8.4, 0.58], [x, 4.4, -16.9], MATS.darkSteel, boost);
    frame.rotation.z = THREE.MathUtils.degToRad(-4);
  });
  for (let i = 0; i < 34; i += 1) {
    const x = 11.0 + hifiNoise(i * 1.7) * 7.0;
    const y = 0.8 + hifiNoise(i * 2.1) * 6.9;
    const star = cylinder(`hifi09 visible star through right hangar ${i}`, 0.035 + hifiNoise(i * 2.4) * 0.045, 0.035, 0.012, 10, [x, y, -16.25], mat(0xf6fbff, { emissive: 0xdff2ff, emissiveIntensity: 1.5, roughness: 0.2 }), boost);
    star.rotation.x = Math.PI / 2;
  }
  const ship = new THREE.Group();
  ship.name = 'hifi09 tiny ship silhouette in right exterior opening';
  ship.position.set(14.6, 3.6, -16.08);
  ship.rotation.y = THREE.MathUtils.degToRad(-8);
  boost.add(ship);
  box('ship dark hull', [1.5, 0.18, 0.24], [0, 0, 0], MATS.blackMetal, ship);
  box('ship cyan cockpit', [0.28, 0.12, 0.08], [0.56, 0.08, 0.08], MATS.cyanDim, ship);
  box('ship amber engine', [0.18, 0.1, 0.08], [-0.78, 0, 0.08], MATS.amber, ship);

  // Reassert the central industrial chasm as a deep blue focal point.
  const pitGroup = new THREE.Group();
  pitGroup.name = 'hifi09 dominant blue multi-ring central chasm';
  pitGroup.position.set(0, -0.45, -6.2);
  boost.add(pitGroup);
  const pitScales = [8.2, 7.0, 5.9, 4.8, 3.8, 2.8];
  pitScales.forEach((radius, tier) => {
    const y = 1.0 - tier * 0.72;
    const ring = torus(`hifi09 dominant chasm ring ${tier}`, radius, 0.075, 14, 128, [0, y, 0], tier % 2 ? MATS.cyanDim : MATS.amber, pitGroup);
    ring.rotation.x = Math.PI / 2;
    const wall = cylinder(`hifi09 dark circular chasm wall ${tier}`, radius * 0.98, radius * 0.88, 0.32, 96, [0, y - 0.22, 0], tier < 2 ? MATS.blackMetal : MATS.shadow, pitGroup);
    wall.rotation.y = tier * 0.04;
  });
  const coreBeam = cylinder('hifi09 tall blue chasm beam', 1.35, 2.45, 6.8, 64, [0, -2.35, 0], mat(0x0c304d, { emissive: COLORS.cyan, emissiveIntensity: 1.5, transparent: true, opacity: 0.42, roughness: 0.08 }), pitGroup);
  coreBeam.rotation.z = THREE.MathUtils.degToRad(2);
  const chasmGlow = cylinder('hifi09 bright bottom chasm glow disk', 3.2, 4.2, 0.05, 96, [0, -5.65, 0], MATS.cyan, pitGroup);
  chasmGlow.rotation.x = Math.PI / 2;
  for (let i = 0; i < 16; i += 1) {
    const a = (Math.PI * 2 * i) / 16;
    const x = Math.cos(a) * 7.2;
    const z = Math.sin(a) * 7.2;
    const brace = box(`hifi09 chasm vertical mega brace ${i}`, [0.12, 4.2, 0.12], [x, -0.9, z], MATS.blackMetal, pitGroup);
    brace.rotation.y = -a;
    if (i % 2 === 0) box(`hifi09 chasm brace light ${i}`, [0.42, 0.05, 0.05], [x, 0.8, z], MATS.cyanDim, pitGroup).rotation.y = -a;
  }

  // Add visible city density at thumbnail scale: stacked terraces, gantries, and light grids.
  const city = new THREE.Group();
  city.name = 'hifi09 dense embedded industrial city overlay';
  boost.add(city);
  const zones = [
    { prefix: 'left cyan refinery', x0: -12.5, x1: -4.4, z0: -11.5, z1: -5.8, color: MATS.cyanDim, base: MATS.darkSteel },
    { prefix: 'warm central foundry', x0: -3.8, x1: 5.2, z0: -12.2, z1: -5.2, color: MATS.amber, base: MATS.blackMetal },
    { prefix: 'right hangar city', x0: 6.0, x1: 15.2, z0: -12.4, z1: -5.6, color: MATS.cyanDim, base: MATS.darkSteel },
    { prefix: 'rear skyline', x0: -8.8, x1: 8.8, z0: -15.6, z1: -12.6, color: MATS.amber, base: MATS.blackMetal }
  ];
  zones.forEach((zone, zoneIndex) => {
    for (let i = 0; i < 34; i += 1) {
      const tx = hifiNoise(zoneIndex * 31 + i * 1.1);
      const tz = hifiNoise(zoneIndex * 47 + i * 1.3);
      const x = THREE.MathUtils.lerp(zone.x0, zone.x1, tx);
      const z = THREE.MathUtils.lerp(zone.z0, zone.z1, tz);
      const h = 0.38 + hifiNoise(zoneIndex * 59 + i * 1.7) * 1.6;
      const w = 0.32 + hifiNoise(zoneIndex * 61 + i * 1.9) * 0.72;
      const d = 0.28 + hifiNoise(zoneIndex * 67 + i * 2.1) * 0.8;
      const y = 0.82 + Math.floor(i % 5) * 0.34 + h * 0.5;
      const block = box(`hifi09 ${zone.prefix} city module ${i}`, [w, h, d], [x, y, z], zone.base, city);
      block.rotation.y = THREE.MathUtils.degToRad(-12 + hifiNoise(i * 2.9) * 24);
      if (i % 2 === 0) {
        const light = box(`hifi09 ${zone.prefix} module light ${i}`, [w * 0.78, 0.035, 0.035], [x, y + h * 0.35, z + d * 0.5], zone.color, city);
        light.rotation.y = block.rotation.y;
      }
    }
  });
  const gantries = [
    [-10.4, 5.0, -9.2, 8.2, -8, MATS.cyanDim],
    [-2.2, 5.5, -10.0, 9.0, 8, MATS.amber],
    [7.8, 5.2, -9.8, 8.4, -14, MATS.cyanDim],
    [1.0, 6.9, -13.6, 14.8, 0, MATS.amber]
  ];
  gantries.forEach(([x, y, z, length, yaw, accent], index) => {
    const deck = box(`hifi09 high industrial gantry ${index}`, [length, 0.12, 0.34], [x, y, z], MATS.steel, city);
    deck.rotation.y = THREE.MathUtils.degToRad(yaw);
    const rail = box(`hifi09 high industrial gantry light ${index}`, [length * 0.88, 0.04, 0.04], [x, y + 0.12, z + 0.2], accent, city);
    rail.rotation.y = deck.rotation.y;
  });

  const exteriorCold = new THREE.PointLight(0xcfe5ff, 22.0, 42.0);
  exteriorCold.name = 'hifi09 huge right window cold light';
  exteriorCold.position.set(15.8, 5.4, -12.0);
  scene.add(exteriorCold);
  const chasmLight = new THREE.PointLight(COLORS.cyan, 36.0, 36.0);
  chasmLight.name = 'hifi09 dominant central chasm blue light';
  chasmLight.position.set(0, -2.6, -6.0);
  scene.add(chasmLight);
  const cityWarm = new THREE.PointLight(0xffaa62, 18.0, 28.0);
  cityWarm.name = 'hifi09 warm city density light';
  cityWarm.position.set(0.8, 4.2, -8.8);
  scene.add(cityWarm);
}


function buildHifi10JaggedRimScaleLightPass() {
  const pass = new THREE.Group();
  pass.name = 'concept-c HIFI-10 jagged asteroid rim, scale lights, and atmosphere pass';
  root.add(pass);

  const deepRockMat = mat(0x050408, { roughness: 1, metalness: 0, side: THREE.DoubleSide });
  const cutRockMat = mat(0x8f6d60, { roughness: 0.96, emissive: 0x190d06, emissiveIntensity: 0.16, side: THREE.DoubleSide });
  const coldHazeMat = mat(0x98c8ff, { emissive: 0x86bfff, emissiveIntensity: 0.9, transparent: true, opacity: 0.16, roughness: 0.06, side: THREE.DoubleSide });
  const amberHazeMat = mat(0xff9a4b, { emissive: 0xff8a34, emissiveIntensity: 0.58, transparent: true, opacity: 0.13, roughness: 0.08, side: THREE.DoubleSide });

  // Break the too-clean HIFI-09 oval. These are intentional silhouette bites, not random filler.
  const jaggedBites = [
    ['upper left inward asteroid bite', -13.8, 11.2, 4.9, 2.1, -18],
    ['upper center torn roof bite', -5.2, 12.0, 5.8, 2.4, 7],
    ['upper right hanging broken crown', 7.2, 11.7, 5.6, 2.2, 14],
    ['right window irregular cheek intrusion', 15.5, 6.9, 2.6, 4.8, -8],
    ['right lower asteroid tooth', 14.6, -4.4, 3.2, 3.0, 18],
    ['lower center broken asteroid sill', -1.2, -7.6, 6.8, 2.0, -4],
    ['lower left torn sill mass', -10.4, -7.0, 5.2, 2.2, 10],
    ['left vertical ragged wall tooth', -15.2, 4.4, 2.6, 5.2, 5]
  ];
  jaggedBites.forEach(([name, x, y, width, height, angle], index) => {
    const bite = hifiShard(`hifi10 ${name}`, x, y, {
      z: 12.55 + (index % 3) * 0.04,
      width,
      height,
      depth: 1.05,
      angle,
      warmBias: -0.18,
      roughness: 0.16,
      material: deepRockMat,
      parent: pass
    });
    bite.scale.z = 0.66;
    const edge = hifiShard(`hifi10 exposed cut highlight ${name}`, x * 0.985, y * 0.985, {
      z: 12.62 + (index % 2) * 0.03,
      width: width * 0.72,
      height: 0.16,
      depth: 0.18,
      angle: angle + (index % 2 ? 7 : -7),
      warmBias: 0.12,
      roughness: 0.04,
      material: cutRockMat,
      parent: pass
    });
    edge.scale.z = 0.35;
  });

  // Add small silhouette chips along the aperture so it stops reading like a perfect RingGeometry portal.
  for (let i = 0; i < 54; i += 1) {
    const a = (Math.PI * 2 * i) / 54 + hifiNoise(i * 4.1) * 0.08;
    const rx = 14.7 + hifiNoise(i * 7.3) * 2.4;
    const ry = 10.6 + hifiNoise(i * 9.7) * 1.4;
    const x = Math.cos(a) * rx;
    const y = 2.4 + Math.sin(a) * ry;
    // Leave the middle of the right space window open; chips frame it but do not close it.
    if (x > 10.2 && y > 0.2 && y < 8.8) continue;
    const chip = hifiShard(`hifi10 irregular aperture chip ${i}`, x, y, {
      z: 12.72,
      width: 0.38 + hifiNoise(i * 1.9) * 0.96,
      height: 0.16 + hifiNoise(i * 2.3) * 0.52,
      depth: 0.32,
      angle: THREE.MathUtils.radToDeg(a) + 90 + hifiNoise(i * 2.9) * 42,
      warmBias: -0.12,
      roughness: 0.08,
      material: i % 5 === 0 ? cutRockMat : deepRockMat,
      parent: pass
    });
    chip.scale.z = 0.4;
  }

  // Make the reference's right-side opening feel like space, not a flat blue rectangle.
  const rightWindowBloom = box('hifi10 overexposed right-space bloom plane', [12.6, 10.8, 0.06], [14.9, 4.4, -15.95], coldHazeMat, pass);
  rightWindowBloom.rotation.z = THREE.MathUtils.degToRad(-5);
  const farAsteroid = new THREE.Group();
  farAsteroid.name = 'hifi10 far exterior asteroid silhouettes visible through right window';
  pass.add(farAsteroid);
  [
    [18.4, 6.0, 2.9, 1.1, -12], [12.3, 8.0, 2.1, 0.7, 18], [17.2, 1.0, 2.4, 0.8, 8], [10.8, 2.1, 1.5, 0.55, -18]
  ].forEach(([x, y, w, h, angle], i) => {
    const rock = hifiShard(`hifi10 distant exterior asteroid chunk ${i}`, x, y, {
      z: -15.75,
      width: w,
      height: h,
      depth: 0.22,
      angle,
      warmBias: -0.24,
      roughness: 0.1,
      material: mat(0x111927, { roughness: 1, emissive: 0x081222, emissiveIntensity: 0.22, side: THREE.DoubleSide }),
      parent: farAsteroid
    });
    rock.scale.z = 0.2;
  });

  // Multiply tiny readable scale markers: windows, gantries, deck ticks, and maintenance beacons.
  const scale = new THREE.Group();
  scale.name = 'hifi10 industrial city tiny scale light matrix';
  pass.add(scale);
  const lightRuns = [
    { name: 'left cyan vertical habitat grid', x0: -12.6, x1: -5.2, y0: 1.9, y1: 6.4, z: -8.9, count: 86, mat: MATS.cyanDim },
    { name: 'central amber refinery grid', x0: -4.4, x1: 4.8, y0: 1.5, y1: 6.0, z: -8.2, count: 96, mat: MATS.amber },
    { name: 'right hangar cold deck grid', x0: 6.4, x1: 16.2, y0: 1.4, y1: 5.8, z: -8.8, count: 96, mat: MATS.cyanDim },
    { name: 'rear skyline amber pinlights', x0: -9.4, x1: 9.2, y0: 5.2, y1: 8.0, z: -13.0, count: 110, mat: MATS.amber }
  ];
  lightRuns.forEach((run, runIndex) => {
    for (let i = 0; i < run.count; i += 1) {
      const row = Math.floor(i / 14);
      const col = i % 14;
      const x = THREE.MathUtils.lerp(run.x0, run.x1, (col + hifiNoise(i * 1.13 + runIndex)) / 14);
      const y = THREE.MathUtils.lerp(run.y0, run.y1, (row + hifiNoise(i * 1.41 + runIndex)) / Math.ceil(run.count / 14));
      const z = run.z - hifiNoise(i * 1.73 + runIndex) * 3.4;
      const tick = box(`hifi10 ${run.name} ${i}`, [0.08, 0.025, 0.025], [x, y, z], run.mat, scale);
      tick.rotation.y = THREE.MathUtils.degToRad(-12 + hifiNoise(i * 2.17) * 24);
    }
  });

  // Deepen the central pit: lower visible rings plus haze column. The old pit read was too shallow.
  const deepPit = new THREE.Group();
  deepPit.name = 'hifi10 lower visible shaft rings and blue atmosphere';
  deepPit.position.set(0, -1.45, -6.2);
  pass.add(deepPit);
  [6.0, 5.1, 4.2, 3.35, 2.55, 1.85].forEach((radius, tier) => {
    const y = -0.55 - tier * 0.62;
    const ring = torus(`hifi10 lower shaft ring ${tier}`, radius, 0.055, 10, 112, [0, y, 0], tier % 2 ? MATS.cyanDim : MATS.blackMetal, deepPit);
    ring.rotation.x = Math.PI / 2;
    if (tier % 2 === 0) {
      const glow = torus(`hifi10 lower shaft cyan edge ${tier}`, radius * 0.96, 0.03, 8, 96, [0, y + 0.02, 0], MATS.cyanDim, deepPit);
      glow.rotation.x = Math.PI / 2;
    }
  });
  const pitMist = cylinder('hifi10 broad blue excavated shaft mist', 3.8, 5.8, 7.8, 48, [0, -2.5, 0], mat(0x0b2c50, {
    emissive: 0x4ddcff,
    emissiveIntensity: 0.48,
    transparent: true,
    opacity: 0.18,
    roughness: 0.08
  }), deepPit);
  pitMist.rotation.z = THREE.MathUtils.degToRad(-2);

  // Add atmosphere planes between foreground rock and city so dark areas keep readable depth.
  const cyanAtmos = box('hifi10 cyan left cavern atmosphere sheet', [9.8, 5.8, 0.08], [-8.9, 4.0, -7.0], coldHazeMat, pass);
  cyanAtmos.rotation.y = THREE.MathUtils.degToRad(8);
  cyanAtmos.rotation.z = THREE.MathUtils.degToRad(4);
  const amberAtmos = box('hifi10 amber industrial core atmosphere sheet', [10.4, 5.4, 0.08], [0.6, 3.5, -6.6], amberHazeMat, pass);
  amberAtmos.rotation.y = THREE.MathUtils.degToRad(-6);
  const rearAtmos = box('hifi10 rear blue-white cavern depth haze', [18.0, 7.2, 0.08], [2.0, 5.1, -13.8], mat(0x77b8ff, { emissive: 0x77b8ff, emissiveIntensity: 0.52, transparent: true, opacity: 0.10, roughness: 0.08, side: THREE.DoubleSide }), pass);
  rearAtmos.rotation.z = THREE.MathUtils.degToRad(-2);

  const rimKey = new THREE.PointLight(0xffb37a, 14.0, 30.0);
  rimKey.name = 'hifi10 warm broken cut-face readability light';
  rimKey.position.set(-7.0, 10.4, 5.2);
  scene.add(rimKey);
  const windowKey = new THREE.PointLight(0xd8ebff, 34.0, 48.0);
  windowKey.name = 'hifi10 right window exterior blast light';
  windowKey.position.set(17.5, 5.6, -12.4);
  scene.add(windowKey);
  const pitKey = new THREE.PointLight(0x55ddff, 42.0, 40.0);
  pitKey.name = 'hifi10 excavated blue shaft volume light';
  pitKey.position.set(0, -3.2, -5.8);
  scene.add(pitKey);
}

function updateReadout() {
  document.getElementById('focus-title').textContent = 'Concept C Asteroid Cavern';
  document.getElementById('focus-body').textContent = 'HIFI-10: jagged broken asteroid rim, brighter right-space opening, deeper blue shaft, denser city scale lights, and stronger cyan/amber atmosphere.';
}

function buildScene() {
  addReferenceLights();
  buildReferenceStarfield();
  buildReferenceApertureShell();
  buildReferenceFacilityMassing();
  buildHifi09ReferenceCompositionBoost();
  buildHifi10JaggedRimScaleLightPass();
  updateReadout();
}

function animate() {
  requestAnimationFrame(animate);
  const t = clock.elapsedTime;
  animated.forEach((item) => {
    if (item.spin) item.mesh.rotation.z += item.spin * 0.016;
    if (item.bob) item.mesh.position.y = item.baseY + Math.sin(t * 1.4 + item.phase) * item.bob;
  });
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


document.querySelectorAll('[data-camera-preset]').forEach((button) => {
  button.addEventListener('click', () => applyCameraPreset(button.dataset.cameraPreset));
});
const zoomInButton = document.getElementById('zoom-in-btn');
const zoomOutButton = document.getElementById('zoom-out-btn');
if (zoomInButton) zoomInButton.addEventListener('click', () => nudgeCameraZoom(-3.2));
if (zoomOutButton) zoomOutButton.addEventListener('click', () => nudgeCameraZoom(3.2));
window.addEventListener('keydown', (event) => {
  if (event.key === '+' || event.key === '=') nudgeCameraZoom(-2.4);
  if (event.key === '-' || event.key === '_') nudgeCameraZoom(2.4);
  if (event.key === '0') applyCameraPreset('full');
  if (event.key.toLowerCase() === 'c') applyCameraPreset('ceiling');
});

buildScene();
applyCameraPreset('full');
animate();
