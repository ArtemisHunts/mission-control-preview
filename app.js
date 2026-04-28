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
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.28;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.bg);
scene.fog = new THREE.Fog(COLORS.bg, 20, 64);

const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 120);
camera.position.set(0, 6.6, 23.5);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;
controls.target.set(0, 2.65, -2.8);

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
  const shade = 0.44 + vertical * 0.24 + hifiNoise(x * 13.7 + y * 7.3 + z * 3.1) * 0.36 - depthCool * 0.12 + warmBias;
  const color = new THREE.Color(COLORS.rockCut);
  const cool = new THREE.Color(COLORS.rockOuter);
  const warm = new THREE.Color(COLORS.rockWarm);
  color.lerp(cool, THREE.MathUtils.clamp(0.94 - shade + depthCool * 0.44, 0, 1));
  color.lerp(warm, THREE.MathUtils.clamp((shade - 0.68) * 1.08, 0, 0.82));
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
    if (Math.abs(x) < 13.5 && y > -0.4 && y < 7.4) continue;
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
  shell.name = 'concept-c hifi procedural asteroid shell mesh v1';
  root.add(shell);

  hifiPrism('hifi single-body left oppressive asteroid mantle', [
    [-14.8, 3.2], [-13.9, 5.25], [-10.9, 6.95], [-8.7, 6.22], [-7.0, 7.32], [-4.65, 6.24], [-2.7, 6.72],
    [-0.78, 5.2], [-1.86, 4.12], [-4.2, 4.58], [-6.8, 4.04], [-9.9, 4.42], [-10.6, 3.3], [-9.86, 2.18],
    [-10.8, 0.72], [-12.7, 0.22], [-14.28, 1.28]
  ], { z: 4.55, depth: 5.8, parent: shell, warmBias: 0.03, roughness: 0.34 });

  hifiPrism('hifi right recessed broken asteroid mantle', [
    [1.55, 5.55], [3.25, 5.08], [5.22, 5.92], [8.75, 5.12], [10.9, 5.72], [11.62, 4.65], [12.96, 3.78],
    [13.55, 2.7], [12.85, 1.64], [10.55, 0.62], [9.28, 1.22], [10.14, 2.48], [9.4, 3.04], [6.42, 4.74], [3.62, 4.04], [1.52, 4.44]
  ], { z: 4.28, depth: 4.4, parent: shell, warmBias: -0.03, roughness: 0.3 });

  hifiPrism('hifi sagging lower left asteroid shelf with real thickness', [
    [-10.9, 0.82], [-8.7, 1.14], [-6.52, 0.48], [-4.72, 1.02], [-2.72, 0.2], [-1.35, 0.46],
    [-2.12, -0.58], [-4.7, -1.28], [-7.34, -0.68], [-10.05, -1.08]
  ], { z: 4.5, depth: 5.2, parent: shell, warmBias: 0.02, roughness: 0.28 });

  hifiPrism('hifi broken lower right asteroid shelf pulled backward', [
    [1.7, 0.16], [4.18, 0.78], [7.34, 0.2], [9.62, 0.5], [8.12, -0.3], [5.75, -0.92], [3.18, -0.46], [1.0, -0.82]
  ], { z: 4.1, depth: 3.6, parent: shell, warmBias: -0.02, roughness: 0.22 });

  const fracturePlates = [
    ['hifi warm cut plane above production bay', [[-8.2, 4.3], [-6.4, 4.95], [-4.9, 4.55], [-6.72, 3.92]], 4.92, 0.5],
    ['hifi exposed central roof bite cut plane', [[-1.48, 4.92], [-0.58, 5.38], [0.72, 4.36], [-0.72, 4.05]], 5.02, 0.6],
    ['hifi lower left broken cut strata face', [[-8.8, 0.68], [-6.2, 0.36], [-5.0, -0.72], [-8.0, -0.52]], 4.96, 0.55],
    ['hifi right recessed side cut face', [[9.42, 3.88], [11.24, 3.58], [10.02, 1.2], [9.2, 2.14]], 4.72, 0.45]
  ];
  fracturePlates.forEach(([name, pts, z, depth], index) => hifiPrism(name, pts, { z, depth, parent: shell, warmBias: 0.18, roughness: 0.12 + index * 0.02 }));

  const tunnel = hifiPrism('hifi dark bored service tunnel bevel in left mantle', [
    [-10.95, 3.1], [-10.55, 3.42], [-10.04, 3.18], [-9.92, 2.7], [-10.22, 2.32], [-10.78, 2.42], [-11.08, 2.72]
  ], { z: 5.08, depth: 0.32, parent: shell, warmBias: -0.4, roughness: 0.05 });
  tunnel.material = MATS.shadow;

  const mineralEdges = [
    [-9.4, 5.8, 2.8, -22], [-5.7, 5.42, 3.6, 12], [-7.8, 0.25, 3.2, -8], [5.6, 4.92, 3.4, 8], [5.4, -0.28, 3.8, -12]
  ];
  mineralEdges.forEach(([x, y, length, angle], index) => {
    const seam = box(`hifi selective chipped mineral rim ${index}`, [length, 0.035, 0.045], [x, y, 5.15], MATS.rockWarm, shell);
    seam.rotation.z = THREE.MathUtils.degToRad(angle);
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
    hifiPrism(`hifi ${name}`, pts, { z, depth, parent: detail, warmBias, roughness: 0.08 + index * 0.02 });
  });

  const crackMat = mat(0x09070a, { roughness: 1, transparent: true, opacity: 0.8 });
  const dustMat = mat(0xb89682, { roughness: 0.98, transparent: true, opacity: 0.28 });
  const craterData = [
    [-11.88, 4.82, 0.22, 1.5, 0.8], [-8.96, 5.64, 0.14, 1.4, 0.72], [-6.32, 4.94, 0.18, 1.2, 0.78],
    [2.74, 5.18, 0.14, 1.3, 0.76], [8.48, 4.72, 0.2, 1.45, 0.82], [10.82, 2.22, 0.16, 1.1, 0.85],
    [-8.62, 0.18, 0.18, 1.5, 0.76], [-5.02, -0.18, 0.14, 1.25, 0.72], [5.46, 0.08, 0.16, 1.35, 0.74]
  ];
  craterData.forEach(([x, y, radius, sx, sy], index) => {
    const crater = new THREE.Mesh(new THREE.CircleGeometry(radius, 12), crackMat);
    crater.name = `hifi asteroid crater pocket ${index}`;
    crater.position.set(x, y, 5.12);
    crater.scale.set(sx, sy, 1);
    detail.add(crater);

    const dust = new THREE.Mesh(new THREE.CircleGeometry(radius * 1.38, 12), dustMat);
    dust.name = `hifi asteroid crater dust halo ${index}`;
    dust.position.set(x + radius * 0.22, y - radius * 0.12, 5.1);
    dust.scale.set(sx * 1.02, sy * 0.94, 1);
    detail.add(dust);
  });

  const fractureBands = [
    ['upper left jagged fracture network', -8.48, 5.04, 4.18, -18, MATS.shadow],
    ['upper center warm mineral fracture network', -0.42, 4.58, 2.24, 14, MATS.rockWarm],
    ['left wall vertical strata tear', -11.02, 2.42, 2.02, 78, MATS.shadow],
    ['right wall vertical strata tear', 10.88, 2.6, 1.86, -74, MATS.shadow],
    ['lower sill broken seam run', -0.82, 0.14, 9.8, 2, MATS.rockWarm]
  ];
  fractureBands.forEach(([name, x, y, length, angle, material], index) => {
    const seam = box(`hifi ${name}`, [length, 0.05, 0.05], [x, y, 5.16 - index * 0.02], material, detail);
    seam.rotation.z = THREE.MathUtils.degToRad(angle);
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

function buildHifiCommandShaft() {
  const shaft = new THREE.Group();
  shaft.name = 'concept-c hifi command shaft carved geometry v1';
  root.add(shaft);

  const rings = [
    { r: 3.15, y: 0.94, z: 0.04, mat: MATS.blackMetal },
    { r: 2.62, y: 0.64, z: -0.08, mat: MATS.shadow },
    { r: 2.05, y: 0.34, z: -0.22, mat: MATS.shadow },
    { r: 1.42, y: 0.02, z: -0.38, mat: MATS.shadow }
  ];
  rings.forEach(({ r, y, z, mat }, index) => {
    const wall = cylinder(`hifi faceted descending command shaft wall ${index}`, r, r * 0.86, 0.36, 14, [0, y, z], mat, shaft);
    wall.rotation.y = index * 0.08;
  });
  const lowerGlow = cylinder('hifi deep cyan glow fading at bottom of command bore', 1.0, 1.35, 0.03, 28, [0, -0.18, -0.42], MATS.cyanDim, shaft);
  lowerGlow.rotation.x = Math.PI / 2;
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

function buildCommandPit() {
  cylinder('concept-c raised upper deck lip around sunken command well', 3.7, 3.85, 0.16, 56, [0, 0.98, 0.02], MATS.steel);
  cylinder('concept-c vertical dark wall of sunken command well', 3.02, 3.18, 0.62, 56, [0, 0.72, 0.02], MATS.blackMetal);
  cylinder('concept-c lower recessed command pit floor clearly below deck', 2.08, 2.22, 0.12, 56, [0, 0.43, 0.02], MATS.shadow);
  cylinder('concept-c deepest black command shaft visible below holo table', 1.48, 1.78, 0.44, 48, [0, 0.23, 0.02], MATS.shadow);
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
  cylinder('concept-c lower pit cyan glow at true bottom', 1.58, 1.72, 0.035, 48, [0, 0.52, 0.02], MATS.cyanDim);
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

  [1.42, 1.78, 2.14, 2.54].forEach((radius, index) => {
    const lower = torus(`concept-c descending lower wall ring visible inside pit ${index}`, radius, 0.02, 8, 64, [0, 0.42 + index * 0.14, 0.02], index < 2 ? MATS.cyanDim : MATS.shadow);
    lower.rotation.x = Math.PI / 2;
  });
  [-1.45, -0.72, 0, 0.72, 1.45].forEach((x, index) => {
    box(`concept-c tiny lower level pit light ${index}`, [0.18, 0.025, 0.025], [x, 0.48 + (index % 2) * 0.12, -1.72], index % 2 ? MATS.amber : MATS.cyanDim);
  });

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

function updateReadout() {
  document.getElementById('focus-title').textContent = 'Concept C Asteroid Cutaway';
  document.getElementById('focus-body').textContent = 'A clean rebuild: asteroid shell first, carved production facility second. Previous room code is archived in git history.';
}

function buildScene() {
  addLights();
  buildStarfield();
  buildHifiAsteroidShell();
  buildHifiSecondaryAsteroidBreakup();
  buildProductionCavity();
  buildHeroProductionBay();
  buildHifiCommandShaft();
  buildCommandPit();
  buildScaleAndAtmosphere();
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

buildScene();
animate();
