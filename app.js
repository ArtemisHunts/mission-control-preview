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
  violet: mat(COLORS.violet, { emissive: COLORS.violet, emissiveIntensity: 0.34, transparent: true, opacity: 0.25 })
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

function buildAsteroidCutawayShell() {
  const shell = new THREE.Group();
  shell.name = 'concept-c dedicated faceted asteroid shell asset kit';
  root.add(shell);

  // Foreground silhouette: four separate jagged masses, leaving all corners visibly open to stars.
  polyMesh('concept-c jagged upper asteroid shell crown', [
    [-10.7, 5.05], [-9.0, 6.34], [-6.9, 5.88], [-4.5, 6.72], [-1.8, 6.06], [1.0, 6.64],
    [4.3, 5.96], [6.8, 6.42], [9.6, 5.62], [11.0, 5.05], [9.5, 4.64], [7.2, 4.86],
    [4.8, 4.42], [2.0, 4.74], [-0.5, 4.36], [-3.2, 4.78], [-5.7, 4.42], [-8.3, 4.86]
  ], MATS.rockOuter, 4.05, shell);
  polyMesh('concept-c left asteroid wall with broken bite silhouette', [
    [-13.5, 4.65], [-10.75, 4.3], [-10.05, 3.18], [-10.65, 2.38], [-9.82, 1.22], [-10.82, 0.34],
    [-12.2, 0.66], [-13.82, 1.52], [-14.1, 2.92]
  ], MATS.rockOuter, 4.05, shell);
  polyMesh('concept-c right asteroid wall with broken bite silhouette', [
    [13.5, 4.65], [10.75, 4.3], [10.05, 3.18], [10.65, 2.38], [9.82, 1.22], [10.82, 0.34],
    [12.2, 0.66], [13.82, 1.52], [14.1, 2.92]
  ], MATS.rockOuter, 4.05, shell);
  polyMesh('concept-c broken lower asteroid sill leaves star corners', [
    [-8.8, 0.45], [-6.7, 0.7], [-4.1, 0.32], [-1.4, 0.64], [1.7, 0.28], [4.7, 0.66], [7.8, 0.38], [9.4, 0.52],
    [8.2, -0.12], [4.0, -0.48], [-0.3, -0.2], [-4.6, -0.54], [-8.3, -0.05]
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
    ['left rear asteroid thickness volume', -11.15, 2.75, -2.8, 0.85, 4.4, 6.8],
    ['right rear asteroid thickness volume', 11.15, 2.75, -2.8, 0.85, 4.4, 6.8],
    ['upper rear asteroid thickness volume', 0, 5.18, -3.0, 16.8, 0.72, 6.2]
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
  bay.position.set(-6.55, 0, -0.15);
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
  box('hero bay pipe disappearing into rock left', [0.08, 0.08, 2.4], [-2.42, 2.32, -2.05], MATS.amber, bay).rotation.y = THREE.MathUtils.degToRad(18);
  box('hero bay pipe disappearing into rock right', [0.08, 0.08, 2.0], [2.28, 2.18, -2.02], MATS.cyanDim, bay).rotation.y = THREE.MathUtils.degToRad(-18);
}

function buildAsymmetricRockBites() {
  const asym = new THREE.Group();
  asym.name = 'concept-c asymmetric asteroid bites and embedded seams';
  root.add(asym);
  const chunks = [
    ['left heavy upper bite breaks symmetry', -8.8, 4.98, 2.85, 3.1, 0.62, 2.2, -12],
    ['left lower protruding cut mass', -9.3, 1.0, 2.95, 1.4, 0.5, 1.3, 8],
    ['right rear recessed cave cheek', 9.15, 3.7, -1.95, 1.2, 2.2, 3.1, -6],
    ['right lower broken sill notch', 6.2, 0.42, 3.15, 2.4, 0.28, 1.2, -4]
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

function buildCommandPit() {
  cylinder('concept-c raised upper deck lip around sunken command well', 3.7, 3.85, 0.16, 56, [0, 0.98, 0.02], MATS.steel);
  cylinder('concept-c vertical dark wall of sunken command well', 3.02, 3.18, 0.62, 56, [0, 0.72, 0.02], MATS.blackMetal);
  cylinder('concept-c lower recessed command pit floor clearly below deck', 2.08, 2.22, 0.12, 56, [0, 0.43, 0.02], MATS.shadow);
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
  const holo = cylinder('concept-c blue holographic asteroid ops globe', 0.9, 0.9, 0.02, 48, [0, 1.72, 0.02], MATS.cyan);
  holo.rotation.x = Math.PI / 2;
  const halo = torus('concept-c projected orbital halo around holo globe', 1.18, 0.022, 8, 64, [0, 1.72, 0.02], MATS.cyan);
  halo.rotation.x = Math.PI / 2;
  halo.rotation.z = 0.42;
  animated.push({ mesh: halo, spin: 0.18 });

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
  buildAsteroidCutawayShell();
  buildProductionCavity();
  buildHeroProductionBay();
  buildAsymmetricRockBites();
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
