import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const COLORS = {
  bg: 0x07101d,
  floor: 0x111a2d,
  wall: 0x172238,
  wallDark: 0x0c1220,
  panel: 0x1a233a,
  metal: 0x2c3448,
  gunmetal: 0x151b28,
  blackMetal: 0x070a12,
  brushedSteel: 0x667085,
  creamPanel: 0xd8d0bd,
  rock: 0x1b1720,
  cyan: 0x59f1ff,
  gold: 0xe6a93a,
  amber: 0xff9f2f,
  green: 0x74d99a,
  coral: 0xff6f61,
  violet: 0x9d7cff,
  white: 0xf6f8ff
};

const ROOMS = {
  overview: {
    title: 'Asteroid Base Overview',
    body: 'A full spatial read of Mission Control: assembly shaft, fabrication line, production bays, visible operators, and deploy traffic.',
    camera: [0, 12.6, 38.6],
    target: [0, 1.35, -2.35],
    accent: COLORS.cyan
  },
  command: {
    title: 'Command Process Core',
    body: 'The compact command core lives here. Artemis and Navigator route missions without overpowering the production floor.',
    camera: [3.7, 3.2, 4.2],
    target: [0, 0.95, 0.35],
    accent: COLORS.cyan,
    pos: [0, 0, 0.55],
    label: 'COMMAND'
  },
  build: {
    title: 'Build Floor',
    body: 'Forge works here: UI fabrication, interaction passes, scene construction, and the hands-on production lane.',
    camera: [0, 10.8, 34.2],
    target: [-8.4, 1.35, 2.35],
    accent: COLORS.gold,
    pos: [-8.4, 0, 2.35],
    label: 'BUILD'
  },
  review: {
    title: 'Review Chamber',
    body: 'Sentinel owns this room. Coral containment rings mark QA, safety checks, regressions, and work that needs a sharper eye.',
    camera: [0, 10.8, 34.2],
    target: [8.4, 1.35, 2.35],
    accent: COLORS.coral,
    pos: [8.4, 0, 2.35],
    label: 'REVIEW'
  },
  deploy: {
    title: 'Deploy Dock',
    body: 'Quartermaster stages releases here. Green-lit launch rails show what is ready to ship, publish, or route into production.',
    camera: [0, 10.8, 34.2],
    target: [8.4, 1.35, -6.05],
    accent: COLORS.green,
    pos: [8.4, 0, -6.05],
    label: 'DEPLOY'
  },
  observatory: {
    title: 'Observatory',
    body: 'Prospector watches the signal room: research, memory, requirements, references, and the weird clues hiding in the noise.',
    camera: [0, 10.8, 34.2],
    target: [-8.4, 1.35, -6.05],
    accent: COLORS.violet,
    pos: [-8.4, 0, -6.05],
    label: 'OBSERVATORY'
  }
};

const AGENTS = [
  { name: 'Artemis', role: 'orchestration', room: 'command', color: COLORS.cyan, offset: [-0.95, 0.04] },
  { name: 'Navigator', role: 'strategy', room: 'command', color: COLORS.white, offset: [0.95, 0.04] },
  { name: 'Forge', role: 'frontend build', room: 'build', color: COLORS.gold, offset: [-0.62, -0.12] },
  { name: 'Sentinel', role: 'QA review', room: 'review', color: COLORS.coral, offset: [0, 0.45] },
  { name: 'Quartermaster', role: 'deploy ops', room: 'deploy', color: COLORS.green, offset: [-0.62, 0.38] },
  { name: 'Prospector', role: 'research', room: 'observatory', color: COLORS.violet, offset: [0.42, 0.38] }
];

const state = {
  mode: 'overview',
  tick: 0,
  metrics: { agents: AGENTS.length, missions: 12, active: 4, review: 3 },
  feed: [
    ['Artemis', 'mapped the office into navigable workspaces.'],
    ['Forge', 'installed room platforms and agent stations.'],
    ['Sentinel', 'brought the review chamber online.'],
    ['Quartermaster', 'wired deploy lanes into the dock.']
  ]
};

const container = document.getElementById('office-canvas');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.0));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.42;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.bg);
scene.fog = new THREE.Fog(COLORS.bg, 18, 96);

const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 125);
camera.position.set(...ROOMS.overview.camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = false;
controls.autoRotateSpeed = 0;
controls.minDistance = 6.2;
controls.maxDistance = 23;
controls.minPolarAngle = 0.68;
controls.maxPolarAngle = 1.34;
controls.target.set(...ROOMS.overview.target);

const root = new THREE.Group();
scene.add(root);

const clock = new THREE.Clock();
const operators = [];
const roomMeshes = [];
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const clickTarget = new THREE.Vector3();
const navKeys = new Set();
const facilityFocus = new THREE.Vector3(...ROOMS.overview.target);
const facilityTarget = new THREE.Vector3(...ROOMS.overview.target);
const cameraOffsets = {
  overview: new THREE.Vector3(0, 12.4, 38.2),
  command: new THREE.Vector3(0, 6.8, 17.6),
  build: new THREE.Vector3(0, 8.8, 25.8),
  review: new THREE.Vector3(0, 8.8, 25.8),
  deploy: new THREE.Vector3(0, 9.4, 27.6),
  observatory: new THREE.Vector3(0, 9.4, 27.6)
};
const facilityBounds = { minX: -10.6, maxX: 10.6, minZ: -8.2, maxZ: 3.6 };

function getCameraOffsetForMode() {
  const base = cameraOffsets[state.mode] ?? cameraOffsets.overview;
  const offset = base.clone();
  const aspect = window.innerWidth / Math.max(window.innerHeight, 1);
  if (state.mode === 'overview' && aspect < 1.15) {
    offset.y *= 1.12;
    offset.z *= 1.18;
  }
  return offset;
}

function getCameraTargetForMode() {
  const target = facilityFocus.clone();
  if (state.mode === 'overview') {
    target.y = 1.28;
    target.z -= 0.35;
  }
  return target;
}

function mat(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.55,
    metalness: options.metalness ?? 0.08,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1,
    side: options.side ?? THREE.FrontSide
  });
}

function box(name, size, position, material, parent = root) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function cylinder(name, radiusTop, radiusBottom, height, segments, position, material, parent = root) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function sphere(name, radius, segments, position, material, parent = root) {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, Math.max(8, Math.floor(segments * 0.5))), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function torus(name, radius, tube, radialSegments, tubularSegments, position, material, parent = root) {
  const mesh = new THREE.Mesh(new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments), material);
  mesh.name = name;
  mesh.position.set(...position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function makeTextSprite(text, color = '#f6f8ff', size = 118) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1024;
  canvas.height = 256;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `900 ${size}px Inter, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.shadowColor = color;
  ctx.shadowBlur = 18;
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
  sprite.scale.set(3.4, 0.85, 1);
  return sprite;
}

function addLight(type, color, intensity, position, distance) {
  const light = type === 'point'
    ? new THREE.PointLight(color, intensity, distance)
    : new THREE.DirectionalLight(color, intensity);
  light.position.set(...position);
  if (type !== 'point') {
    light.castShadow = true;
    light.shadow.mapSize.set(512, 512);
  }
  scene.add(light);
  return light;
}

function buildOffice() {
  scene.add(new THREE.AmbientLight(0xc8d8f4, 0.34));
  scene.add(new THREE.HemisphereLight(0xc4dcff, 0x271a14, 0.92));
  addLight('directional', 0xe8f1ff, 2.35, [6.0, 10.8, 9.5]);
  addLight('directional', 0x86b8ff, 1.35, [-7.5, 8.4, -11.5]);
  addLight('directional', 0xffcf8a, 0.86, [0, 5.8, 13.5]);
  addLight('point', COLORS.cyan, 9.8, [0, 2.25, 0.45], 12.5);
  addLight('point', COLORS.amber, 7.6, [-10.4, 4.2, 5.4], 15.0);
  addLight('point', COLORS.amber, 7.6, [10.4, 4.2, 5.4], 15.0);
  addLight('point', 0x8fc7ff, 9.2, [0, 5.8, -10.6], 24.0);
  addLight('point', COLORS.coral, 3.2, [4.2, 2.2, 1.2], 9.2);

  buildShell();
  buildCeilingAndBulkheads();
  buildOverheadRibPracticalArchitecture();
  buildCalibratedAsteroidProscenium();
  buildTargetCutawayMissionControl();
  buildRearHangarWindowScaleContext();
  buildInteriorDominanceMassing();
  buildAsteroidInsertedArchitectureContrast();
  buildNorthStarOperationsHub();
  buildReadabilityHotfixLighting();
  buildRooms();
  buildStationWorkspaceIdentityKits();
  buildCommandHoloTableHero();
  buildCommandPitLightingHierarchy();
  buildCommandPitMaterialContrast();
  buildRailingsAndCatwalks();
  buildCommandCrewInteractionSilhouettes();
  buildOperators();

  const title = makeTextSprite('MISSION CONTROL', '#f8fbff', 86);
  title.position.set(0, 3.92, -6.52);
  title.material.opacity = 0.42;
  root.add(title);
  const sub = makeTextSprite('CLICK A ROOM · FOLLOW THE AGENTS', '#9fb5e7', 38);
  sub.position.set(0, 3.52, -6.52);
  sub.scale.set(2.65, 0.58, 1);
  sub.material.opacity = 0.34;
  root.add(sub);
}

function buildShell() {
  const floorMat = mat(COLORS.floor, { roughness: 0.58, metalness: 0.36 });
  const deckMat = mat(0x121a2c, { roughness: 0.48, metalness: 0.5 });
  const trenchMat = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.28, transparent: true, opacity: 0.12, roughness: 0.12, metalness: 0.1 });
  const wallMat = mat(COLORS.wall, { roughness: 0.56, metalness: 0.22 });
  const sideMat = mat(COLORS.wallDark, { roughness: 0.7, metalness: 0.18 });
  const monitorMat = mat(0x182742, { emissive: 0x183f60, emissiveIntensity: 0.34, transparent: true, opacity: 0.46 });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 25), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);

  // Broad slabs and continuous data bands: fewer objects, clearer production-floor read.
  box('left production deck plate', [10.8, 0.055, 18.0], [-8.5, 0.03, -2.4], deckMat);
  box('right production deck plate', [10.8, 0.055, 18.0], [8.5, 0.03, -2.4], deckMat);
  box('rear production apron', [27.2, 0.065, 2.2], [0, 0.045, -10.2], deckMat);
  box('command approach deck', [15.8, 0.065, 4.2], [0, 0.06, 3.2], deckMat);
  box('central wide inspection trench', [1.05, 0.035, 18.8], [0, 0.08, -1.9], trenchMat);
  box('left production inspection wash', [0.28, 0.03, 16.2], [-6.6, 0.085, -1.9], trenchMat);
  box('right production inspection wash', [0.28, 0.03, 16.2], [6.6, 0.085, -1.9], trenchMat);

  box('rear wall', [28.0, 6.1, 0.25], [0, 2.9, -12.05], wallMat);
  const leftWall = box('left wall', [22.0, 5.6, 0.2], [-14.8, 2.75, -1.55], sideMat);
  leftWall.rotation.y = Math.PI / 2;
  const rightWall = box('right wall', [22.0, 5.6, 0.2], [14.8, 2.75, -1.55], sideMat);
  rightWall.rotation.y = Math.PI / 2;


  box('rear wall continuous operations monitor band', [18.6, 0.42, 0.08], [0, 3.6, -11.86], monitorMat);
  box('rear wall lower production telemetry band', [22.4, 0.16, 0.06], [0, 2.18, -11.82], monitorMat);
  box('left deck broad amber workflow lane', [8.8, 0.035, 0.055], [-7.2, 0.24, 3.85], mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.18, transparent: true, opacity: 0.14 }));
  box('right deck broad cyan workflow lane', [8.8, 0.035, 0.055], [7.2, 0.24, 3.85], mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.18, transparent: true, opacity: 0.14 }));
  box('rear deck broad factory transfer lane', [18.4, 0.035, 0.055], [0, 0.26, -8.65], mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.14, transparent: true, opacity: 0.12 }));
  box('front deck broad command transfer lane', [13.2, 0.035, 0.055], [0, 0.28, 5.2], mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.14, transparent: true, opacity: 0.12 }));
}



function buildCeilingAndBulkheads() {
  const ceilingMat = mat(COLORS.blackMetal, { roughness: 0.48, metalness: 0.55 });
  const bulkMat = mat(COLORS.wallDark, { roughness: 0.62, metalness: 0.26 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.38, transparent: true, opacity: 0.36 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.24, transparent: true, opacity: 0.18 });

  box('heavy ceiling slab left', [8.0, 0.18, 14.0], [-6.2, 4.75, -0.7], ceilingMat);
  box('heavy ceiling slab right', [8.0, 0.18, 14.0], [6.2, 4.75, -0.7], ceilingMat);
  box('rear ceiling cap', [20.0, 0.2, 1.4], [0, 4.75, -6.45], ceilingMat);
  box('front ceiling bulkhead', [20.0, 0.28, 0.9], [0, 4.45, 6.35], ceilingMat);
  box('front left bulkhead', [2.45, 3.05, 0.44], [-8.9, 2.75, 6.55], bulkMat);
  box('front right bulkhead', [2.45, 3.05, 0.44], [8.9, 2.75, 6.55], bulkMat);

  box('ceiling left broad amber production cove', [4.8, 0.035, 8.8], [-5.4, 4.58, -0.75], amber);
  box('ceiling right broad amber production cove', [4.8, 0.035, 8.8], [5.4, 4.58, -0.75], amber);
  box('ceiling central cyan command datum front', [5.4, 0.035, 0.055], [0, 4.34, 2.68], cyan);
  box('ceiling central cyan command datum rear', [5.4, 0.035, 0.055], [0, 4.34, -1.78], cyan);
  box('ceiling central cyan command datum left', [0.055, 0.035, 4.1], [-2.72, 4.34, 0.45], cyan);
  box('ceiling central cyan command datum right', [0.055, 0.035, 4.1], [2.72, 4.34, 0.45], cyan);
}

function buildOverheadRibPracticalArchitecture() {
  const graphite = mat(0x111827, { roughness: 0.42, metalness: 0.72 });
  const steel = mat(0x4b566d, { roughness: 0.34, metalness: 0.82 });
  const shadow = mat(0x030711, { roughness: 0.92, metalness: 0.12 });
  const warm = mat(0xffbc6a, { emissive: COLORS.amber, emissiveIntensity: 0.42, transparent: true, opacity: 0.28, roughness: 0.14 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.34, transparent: true, opacity: 0.22, roughness: 0.08 });
  const dimAmber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.2, transparent: true, opacity: 0.14, roughness: 0.18 });

  const ribs = [
    ['front left command ceiling rib', -5.6, 2.95, -34, 7.2],
    ['front right command ceiling rib', 5.6, 2.95, 34, 7.2],
    ['mid left command ceiling rib', -4.1, 0.25, -18, 7.8],
    ['mid right command ceiling rib', 4.1, 0.25, 18, 7.8],
    ['rear left command ceiling rib', -5.2, -3.18, 22, 6.8],
    ['rear right command ceiling rib', 5.2, -3.18, -22, 6.8]
  ];

  ribs.forEach(([name, x, z, yaw, length], index) => {
    const rib = box(name, [0.34, 0.34, length], [x, 4.36, z], index % 2 ? steel : graphite);
    rib.rotation.y = THREE.MathUtils.degToRad(yaw);
    const strip = box(`${name} inset warm practical`, [0.055, 0.04, length - 1.24], [x, 4.14, z + 0.12], warm);
    strip.rotation.y = rib.rotation.y;
    const cheek = box(`${name} dark service shadow cheek`, [0.08, 0.18, length - 0.72], [x + (x < 0 ? -0.24 : 0.24), 4.18, z - 0.08], shadow);
    cheek.rotation.y = rib.rotation.y;
  });

  box('overhead left longitudinal service spine', [0.42, 0.32, 12.4], [-7.92, 4.18, -1.2], graphite);
  box('overhead right longitudinal service spine', [0.42, 0.32, 12.4], [7.92, 4.18, -1.2], graphite);
  box('overhead left amber wall wash slot', [0.055, 0.04, 10.8], [-7.55, 4.0, -1.05], dimAmber);
  box('overhead right amber wall wash slot', [0.055, 0.04, 10.8], [7.55, 4.0, -1.05], dimAmber);
  box('overhead rear hangar header truss', [15.8, 0.36, 0.34], [0, 4.18, -7.88], steel);
  box('overhead rear hangar warm underside strip', [12.8, 0.045, 0.055], [0, 3.94, -7.58], warm);
  box('overhead command oculus forward support', [6.8, 0.24, 0.22], [0, 4.22, 2.92], graphite);
  box('overhead command oculus aft support', [6.8, 0.24, 0.22], [0, 4.22, -2.24], graphite);
  box('overhead oculus forward cyan slit', [5.2, 0.035, 0.045], [0, 4.02, 2.66], cyan);
  box('overhead oculus aft cyan slit', [5.2, 0.035, 0.045], [0, 4.02, -1.98], cyan);
}


function buildCalibratedAsteroidProscenium() {
  const outerRock = mat(0x100d14, { roughness: 0.98, metalness: 0.01 });
  const cutFace = mat(0x302633, { roughness: 0.92, metalness: 0.02 });
  const deepShadow = mat(0x020309, { roughness: 1.0, metalness: 0.0 });
  const coolRim = mat(0x5aa5ff, { emissive: 0x5aa5ff, emissiveIntensity: 0.12, transparent: true, opacity: 0.12 });
  const amberRim = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.12, transparent: true, opacity: 0.12 });

  // One controlled border system replaces overlapping rim/foreground/vertical-slice rock passes.
  // Target read: asteroid/comet is a 15–25% proscenium, never the subject.
  box('calibrated asteroid outer left proscenium', [1.18, 5.7, 18.4], [-14.9, 2.78, -2.1], outerRock);
  box('calibrated asteroid outer right proscenium', [1.18, 5.7, 18.4], [14.9, 2.78, -2.1], outerRock);
  box('calibrated asteroid overhead crown proscenium', [29.2, 0.86, 8.2], [0, 5.58, -2.55], outerRock);
  box('calibrated asteroid lower sill proscenium', [29.0, 0.56, 1.28], [0, 0.12, 7.05], deepShadow);

  box('calibrated left exposed vertical cut face', [0.16, 4.9, 12.2], [-14.08, 2.76, -2.35], cutFace);
  box('calibrated right exposed vertical cut face', [0.16, 4.9, 12.2], [14.08, 2.76, -2.35], cutFace);
  box('calibrated top exposed cut face', [24.8, 0.16, 5.4], [0, 5.02, -1.1], cutFace);
  box('calibrated lower exposed cut shelf', [24.4, 0.14, 0.48], [0, 0.72, 6.18], cutFace);

  box('calibrated left interior shadow reveal', [0.42, 4.2, 13.6], [-13.42, 2.72, -1.85], deepShadow);
  box('calibrated right interior shadow reveal', [0.42, 4.2, 13.6], [13.42, 2.72, -1.85], deepShadow);
  box('calibrated top interior shadow reveal', [25.2, 0.34, 4.8], [0, 4.92, 0.18], deepShadow);
  box('calibrated foreground sill interior shadow reveal', [24.2, 0.26, 0.58], [0, 0.78, 6.66], deepShadow);

  box('calibrated left cool edge datum', [0.045, 3.2, 0.055], [-13.18, 3.0, -7.4], coolRim);
  box('calibrated right cool edge datum', [0.045, 3.2, 0.055], [13.18, 3.0, -7.4], coolRim);
  box('calibrated crown amber edge datum', [12.8, 0.035, 0.045], [0, 4.68, 2.65], amberRim);
  box('calibrated sill amber edge datum', [13.8, 0.035, 0.045], [0, 0.94, 6.0], amberRim);
}
function buildTargetCutawayMissionControl() {
  const shadow = mat(0x02050c, { roughness: 1.0, metalness: 0.0 });
  const steel = mat(0x39465d, { roughness: 0.38, metalness: 0.72 });
  const darkSteel = mat(0x0c1422, { roughness: 0.58, metalness: 0.52 });
  const glass = mat(0x07192b, { emissive: 0x0d3450, emissiveIntensity: 0.22, transparent: true, opacity: 0.34, roughness: 0.16, metalness: 0.18 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.72, transparent: true, opacity: 0.42, roughness: 0.08 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.58, transparent: true, opacity: 0.38, roughness: 0.12 });
  const gold = mat(COLORS.gold, { emissive: COLORS.gold, emissiveIntensity: 0.36, transparent: true, opacity: 0.26 });
  const coral = mat(COLORS.coral, { emissive: COLORS.coral, emissiveIntensity: 0.34, transparent: true, opacity: 0.25 });
  const green = mat(COLORS.green, { emissive: COLORS.green, emissiveIntensity: 0.34, transparent: true, opacity: 0.25 });
  const violet = mat(COLORS.violet, { emissive: COLORS.violet, emissiveIntensity: 0.34, transparent: true, opacity: 0.25 });

  // Target reset now starts inside the calibrated asteroid border: one room, one floor, one rear plane.
  // Duplicate rock shoulders were pruned so the asteroid stays a page frame instead of becoming the subject.

  // Rear hangar/window: depth and sci-fi operations-room backdrop instead of a sealed black wall.
  box('target reset panoramic rear black glass', [20.8, 2.6, 0.12], [0, 3.0, -11.42], glass);
  box('target reset rear hangar horizon glow', [17.8, 0.08, 0.05], [0, 3.36, -11.22], cyan);
  box('target reset rear factory silhouette left', [5.0, 0.34, 0.08], [-5.2, 2.72, -11.16], shadow);
  box('target reset rear factory silhouette right', [5.6, 0.28, 0.08], [4.8, 2.52, -11.16], shadow);
  box('target reset rear pressure header', [22.4, 0.28, 0.32], [0, 4.52, -10.95], steel);
  box('target reset rear pressure sill', [22.4, 0.22, 0.32], [0, 1.36, -10.95], steel);

  // Open floor and catwalk cross: readable spatial plan before detail.
  box('target reset open command floor plate', [23.8, 0.1, 13.6], [0, 0.16, -1.6], darkSteel);
  box('target reset central recessed tactical pit', [7.2, 0.16, 5.8], [0, 0.28, 0.18], shadow);
  box('target reset main amber crosswalk', [22.4, 0.055, 0.32], [0, 0.52, 0.28], amber);
  box('target reset main cyan spine walk', [0.32, 0.055, 12.4], [0, 0.54, -2.35], cyan);
  box('target reset left long catwalk span', [8.2, 0.1, 0.5], [-7.4, 0.5, -1.0], steel);
  box('target reset right long catwalk span', [8.2, 0.1, 0.5], [7.4, 0.5, -1.0], steel);

  const bay = (label, x, z, accentMat) => {
    box(`target reset ${label} bay architectural wall`, [5.4, 2.45, 0.28], [x, 2.15, z], steel);
    box(`target reset ${label} bay dark work volume`, [4.3, 1.55, 0.14], [x, 2.12, z + 0.18], shadow);
    box(`target reset ${label} bay colored system header`, [4.2, 0.06, 0.06], [x, 3.38, z + 0.36], accentMat);
    box(`target reset ${label} bay console island`, [2.7, 0.46, 1.0], [x, 0.82, z + 1.28], darkSteel);
    box(`target reset ${label} bay glass display`, [1.8, 0.72, 0.08], [x, 1.42, z + 0.72], glass);
  };
  bay('build fabrication', -8.4, 1.35, gold);
  bay('review containment', 8.4, 1.35, coral);
  bay('observatory signal', -8.4, -7.2, violet);
  bay('deploy dock', 8.4, -7.2, green);
}

function buildRearHangarWindowScaleContext() {
  const glass = mat(0x071b31, { emissive: 0x0d3e64, emissiveIntensity: 0.28, transparent: true, opacity: 0.26, roughness: 0.12, metalness: 0.16 });
  const haze = mat(0x59f1ff, { emissive: COLORS.cyan, emissiveIntensity: 0.16, transparent: true, opacity: 0.12, roughness: 0.06 });
  const steel = mat(0x46536a, { roughness: 0.36, metalness: 0.8 });
  const shadow = mat(0x02040a, { roughness: 0.95, metalness: 0.1 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.42, transparent: true, opacity: 0.26, roughness: 0.08 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.34, transparent: true, opacity: 0.22, roughness: 0.12 });
  const red = mat(COLORS.coral, { emissive: COLORS.coral, emissiveIntensity: 0.2, transparent: true, opacity: 0.18, roughness: 0.12 });

  box('rear hangar panoramic cool glass depth layer', [15.2, 1.42, 0.045], [0, 3.13, -10.34], glass);
  box('rear hangar soft exterior haze shelf', [13.6, 0.62, 0.04], [0, 3.02, -10.26], haze);
  box('rear hangar upper pressure frame', [16.4, 0.18, 0.16], [0, 3.98, -10.18], steel);
  box('rear hangar lower pressure frame', [16.4, 0.16, 0.16], [0, 2.16, -10.18], steel);
  box('rear hangar left pressure mullion', [0.22, 1.82, 0.16], [-8.34, 3.06, -10.18], steel);
  box('rear hangar right pressure mullion', [0.22, 1.82, 0.16], [8.34, 3.06, -10.18], steel);

  box('rear hangar docked shuttle broad silhouette body', [3.9, 0.42, 0.08], [-2.2, 3.02, -10.08], shadow);
  box('rear hangar docked shuttle nose wedge read', [0.74, 0.28, 0.08], [0.08, 3.02, -10.06], shadow);
  box('rear hangar docked shuttle left wing mass', [1.42, 0.12, 0.08], [-3.35, 2.82, -10.05], shadow);
  box('rear hangar docked shuttle right wing mass', [1.18, 0.1, 0.08], [-1.05, 2.82, -10.05], shadow);
  box('rear hangar shuttle cyan engine line', [1.04, 0.04, 0.045], [-4.14, 3.02, -10.0], cyan);

  const craneA = box('rear hangar diagonal maintenance crane arm A', [4.6, 0.12, 0.08], [4.26, 3.52, -10.02], steel);
  craneA.rotation.z = THREE.MathUtils.degToRad(-12);
  const craneB = box('rear hangar diagonal maintenance crane arm B', [3.6, 0.1, 0.08], [5.24, 2.64, -10.01], steel);
  craneB.rotation.z = THREE.MathUtils.degToRad(18);
  box('rear hangar crane amber joint beacon', [0.3, 0.06, 0.045], [3.02, 3.28, -9.98], amber);
  box('rear hangar far runway cyan recession left', [4.8, 0.045, 0.04], [-5.2, 2.42, -10.02], cyan);
  box('rear hangar far runway cyan recession right', [4.8, 0.045, 0.04], [5.2, 2.42, -10.02], cyan);
  box('rear hangar left asteroid dock shadow shoulder', [1.1, 1.1, 0.05], [-7.12, 2.9, -10.04], shadow);
  box('rear hangar right asteroid dock shadow shoulder', [1.1, 1.0, 0.05], [7.12, 2.85, -10.04], shadow);
  box('rear hangar distant service beacon cluster A', [0.42, 0.05, 0.04], [-6.7, 3.52, -9.98], amber);
  box('rear hangar distant service beacon cluster B', [0.36, 0.05, 0.04], [6.9, 3.42, -9.98], red);
  box('rear hangar centerline docking clearance light', [0.5, 0.045, 0.04], [0.9, 2.5, -9.98], amber);
  box('rear hangar cyan rim reflected on command glass', [7.6, 0.035, 0.04], [0, 2.02, -9.96], cyan);
}

function buildInteriorDominanceMassing() {
  const hull = mat(0x17243a, { roughness: 0.44, metalness: 0.68 });
  const dark = mat(0x030711, { roughness: 0.92, metalness: 0.08 });
  const steel = mat(0x344159, { roughness: 0.36, metalness: 0.76 });
  const glass = mat(0x071a2c, { emissive: 0x0b3450, emissiveIntensity: 0.16, transparent: true, opacity: 0.22, roughness: 0.16, metalness: 0.2 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.34, transparent: true, opacity: 0.22, roughness: 0.08 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.3, transparent: true, opacity: 0.2, roughness: 0.1 });
  const gold = mat(COLORS.gold, { emissive: COLORS.gold, emissiveIntensity: 0.24, transparent: true, opacity: 0.18 });
  const coral = mat(COLORS.coral, { emissive: COLORS.coral, emissiveIntensity: 0.22, transparent: true, opacity: 0.17 });
  const green = mat(COLORS.green, { emissive: COLORS.green, emissiveIntensity: 0.22, transparent: true, opacity: 0.17 });
  const violet = mat(COLORS.violet, { emissive: COLORS.violet, emissiveIntensity: 0.22, transparent: true, opacity: 0.17 });

  // Interior ratio lock: engineered metal mass steps in front of the asteroid border.
  // The rock remains readable at the page edge, but the production floor owns the frame.
  box('dominance left inner pressure jamb', [1.05, 4.95, 13.6], [-12.15, 2.92, -1.85], hull);
  box('dominance right inner pressure jamb', [1.05, 4.95, 13.6], [12.15, 2.92, -1.85], hull);
  box('dominance top interior service lintel', [22.4, 0.5, 4.8], [0, 5.02, -0.45], hull);
  box('dominance lower command sill', [22.2, 0.3, 1.05], [0, 0.72, 5.64], dark);
  box('dominance rear integrated factory wall', [21.2, 3.7, 0.28], [0, 2.82, -10.78], dark);
  box('dominance rear glass operations slot', [14.4, 1.1, 0.06], [0, 3.14, -10.48], glass);

  box('dominance broad build upper mezzanine', [6.6, 0.32, 1.22], [-8.35, 1.58, 3.18], hull);
  box('dominance broad review upper mezzanine', [6.6, 0.32, 1.22], [8.35, 1.58, 3.18], hull);
  box('dominance broad observatory upper mezzanine', [6.4, 0.32, 1.18], [-8.35, 1.68, -5.32], hull);
  box('dominance broad deploy upper mezzanine', [6.4, 0.32, 1.18], [8.35, 1.68, -5.32], hull);
  box('dominance build dark equipment bay', [5.4, 1.08, 0.16], [-8.35, 2.12, 2.4], dark);
  box('dominance review dark equipment bay', [5.4, 1.08, 0.16], [8.35, 2.12, 2.4], dark);
  box('dominance observatory dark equipment bay', [5.2, 1.12, 0.16], [-8.35, 2.22, -6.08], dark);
  box('dominance deploy dark equipment bay', [5.2, 1.12, 0.16], [8.35, 2.22, -6.08], dark);

  box('dominance central production floor mass', [8.8, 0.18, 9.4], [0, 0.52, -1.15], steel);
  box('dominance command pit black negative space', [5.2, 0.2, 4.2], [0, 0.66, 0.38], dark);
  box('dominance front command apron block', [12.8, 0.24, 1.18], [0, 0.88, 4.34], hull);
  box('dominance rear assembly apron block', [13.6, 0.24, 1.28], [0, 1.02, -7.52], hull);
  box('dominance central cyan production centerline', [0.24, 0.04, 10.8], [0, 1.16, -1.85], cyan);
  box('dominance command amber threshold line', [9.6, 0.04, 0.045], [0, 1.18, 3.52], amber);

  box('dominance left sidewall machine slab', [0.72, 3.0, 5.6], [-10.65, 2.82, 0.95], steel);
  box('dominance right sidewall machine slab', [0.72, 3.0, 5.6], [10.65, 2.82, 0.95], steel);
  box('dominance left rear sidewall machine slab', [0.72, 3.2, 5.8], [-10.65, 2.92, -6.05], steel);
  box('dominance right rear sidewall machine slab', [0.72, 3.2, 5.8], [10.65, 2.92, -6.05], steel);
  box('dominance left black service void', [0.12, 2.4, 9.8], [-10.22, 2.86, -2.5], dark);
  box('dominance right black service void', [0.12, 2.4, 9.8], [10.22, 2.86, -2.5], dark);

  box('dominance front full-width gantry', [18.6, 0.2, 0.48], [0, 2.58, 2.98], steel);
  box('dominance center full-width gantry', [18.4, 0.2, 0.48], [0, 3.02, -2.36], hull);
  box('dominance rear full-width gantry', [16.2, 0.2, 0.48], [0, 3.34, -7.48], steel);
  box('dominance front gantry amber underside', [13.0, 0.04, 0.045], [0, 2.42, 3.28], amber);
  box('dominance center gantry cyan underside', [12.4, 0.04, 0.045], [0, 2.86, -2.06], cyan);
  box('dominance rear gantry amber underside', [10.8, 0.04, 0.045], [0, 3.18, -7.18], amber);

  box('dominance build bay amber identity rail', [4.8, 0.045, 0.045], [-8.35, 2.86, 3.78], gold);
  box('dominance review bay coral identity rail', [4.8, 0.045, 0.045], [8.35, 2.86, 3.78], coral);
  box('dominance observatory bay violet identity rail', [4.8, 0.045, 0.045], [-8.35, 2.96, -4.72], violet);
  box('dominance deploy bay green identity rail', [4.8, 0.045, 0.045], [8.35, 2.96, -4.72], green);
}

function buildAsteroidInsertedArchitectureContrast() {
  const basalt = mat(0x17121a, { roughness: 0.98, metalness: 0.02 });
  const cutFace = mat(0x2b2430, { roughness: 0.9, metalness: 0.04 });
  const bronze = mat(0x8e6738, { roughness: 0.32, metalness: 0.78, emissive: 0x2f1806, emissiveIntensity: 0.06 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.18, transparent: true, opacity: 0.14, roughness: 0.08 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.16, transparent: true, opacity: 0.12, roughness: 0.12 });
  const shadow = mat(0x020309, { roughness: 1.0, metalness: 0.0 });

  box('inserted architecture rear left asteroid aperture shoulder', [2.2, 2.35, 0.14], [-9.6, 3.02, -10.0], basalt);
  box('inserted architecture rear right asteroid aperture shoulder', [2.2, 2.35, 0.14], [9.6, 3.02, -10.0], basalt);
  box('inserted architecture rear top rough cut lintel', [16.8, 0.42, 0.14], [0, 4.28, -10.02], cutFace);
  box('inserted architecture rear lower rough cut sill', [16.4, 0.28, 0.14], [0, 1.82, -10.02], cutFace);
  box('inserted architecture rear bronze retaining header', [14.8, 0.12, 0.06], [0, 4.02, -9.88], bronze);
  box('inserted architecture rear bronze retaining sill', [14.8, 0.1, 0.06], [0, 2.06, -9.88], bronze);
  box('inserted architecture rear left bronze jamb insert', [0.08, 1.74, 0.06], [-7.42, 3.05, -9.86], bronze);
  box('inserted architecture rear right bronze jamb insert', [0.08, 1.74, 0.06], [7.42, 3.05, -9.86], bronze);
  box('inserted architecture rear cool rim on rock cut', [12.2, 0.04, 0.045], [0, 3.78, -9.82], cyan);

  const pockets = [
    ['build bay', -10.85, 2.82, 2.2, amber],
    ['review bay', 10.85, 2.82, 2.2, amber],
    ['observatory bay', -10.85, 2.92, -5.88, cyan],
    ['deploy bay', 10.85, 2.92, -5.88, cyan]
  ];
  pockets.forEach(([name, x, y, z, rim]) => {
    box(`inserted architecture ${name} matte rock pocket`, [0.62, 2.0, 2.65], [x, y, z], basalt);
    box(`inserted architecture ${name} bronze vertical retaining rail`, [0.08, 1.72, 0.08], [x * 0.985, y, z + 1.24], bronze);
    box(`inserted architecture ${name} status rim caught on rock`, [0.045, 1.2, 0.05], [x * 0.975, y + 0.12, z - 0.68], rim);
  });

  box('inserted architecture left command pit rock retaining mass', [0.54, 0.52, 4.8], [-4.96, 1.12, 0.38], cutFace);
  box('inserted architecture right command pit rock retaining mass', [0.54, 0.52, 4.8], [4.96, 1.12, 0.38], cutFace);
  box('inserted architecture front command bronze retaining lip', [8.8, 0.08, 0.08], [0, 1.42, 3.88], bronze);
  box('inserted architecture rear command bronze retaining lip', [7.8, 0.06, 0.06], [0, 1.4, -2.88], bronze);
  box('inserted architecture rear command shadow undercut', [8.2, 0.12, 0.08], [0, 1.36, -3.06], shadow);
}

function buildNorthStarOperationsHub() {
  const graphite = mat(0x111827, { roughness: 0.36, metalness: 0.74 });
  const dark = mat(0x020611, { roughness: 0.86, metalness: 0.16 });
  const steel = mat(0x46536a, { roughness: 0.34, metalness: 0.78 });
  const blackGlass = mat(0x04101c, { roughness: 0.12, metalness: 0.3, transparent: true, opacity: 0.72, emissive: 0x082642, emissiveIntensity: 0.16 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.72, transparent: true, opacity: 0.42, roughness: 0.08 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.52, transparent: true, opacity: 0.34, roughness: 0.1 });
  const warm = mat(0xffc071, { emissive: COLORS.amber, emissiveIntensity: 0.42, transparent: true, opacity: 0.26, roughness: 0.18 });

  // North-star read: a circular sunken operations hub with an inward-facing console ring.
  cylinder('north star sunken operations outer ring', 4.6, 4.9, 0.2, 40, [0, 0.92, 0.38], graphite);
  cylinder('north star dark recessed command pit', 3.22, 3.42, 0.16, 40, [0, 1.04, 0.38], dark);
  cylinder('north star cyan glass floor halo', 2.76, 2.76, 0.035, 40, [0, 1.16, 0.38], cyan);
  const outerAmber = torus('north star amber floor trim ring', 4.72, 0.035, 8, 72, [0, 1.18, 0.38], amber);
  outerAmber.rotation.x = Math.PI / 2;
  const innerCyan = torus('north star cyan pit trim ring', 3.2, 0.026, 8, 72, [0, 1.22, 0.38], cyan);
  innerCyan.rotation.x = Math.PI / 2;
  const tableGlow = torus('north star table projected tactical ring', 1.44, 0.022, 8, 56, [0, 2.02, 0.38], cyan);
  tableGlow.rotation.x = Math.PI / 2;

  const consoleArc = [
    [-3.45, 1.95, -18], [-1.72, 3.92, -8], [1.72, 3.92, 8], [3.45, 1.95, 18],
    [-3.72, -1.32, 18], [-1.55, -2.86, 8], [1.55, -2.86, -8], [3.72, -1.32, -18]
  ];
  consoleArc.forEach(([x, z, yaw], index) => {
    const console = box('north star inward console island', [1.22, 0.34, 0.72], [x, 1.36, z + 0.38], blackGlass);
    console.rotation.y = THREE.MathUtils.degToRad(yaw);
    const screen = box('north star tilted cyan console screen', [0.86, 0.38, 0.045], [x, 1.7, z + 0.08], cyan);
    screen.rotation.x = -0.28;
    screen.rotation.y = console.rotation.y;
    const pedestal = box('north star operator pedestal shadow', [0.42, 0.18, 0.42], [x * 0.96, 1.16, z + 0.76], index % 2 ? steel : dark);
    pedestal.rotation.y = console.rotation.y;
  });

  // Ceiling ring mirrors the table below, just like the primary board.
  const ceilingRing = torus('north star overhead circular service oculus', 3.96, 0.055, 8, 72, [0, 4.72, 0.28], steel);
  ceilingRing.rotation.x = Math.PI / 2;
  const ceilingLight = torus('north star overhead cyan practical halo', 3.34, 0.025, 8, 72, [0, 4.62, 0.28], cyan);
  ceilingLight.rotation.x = Math.PI / 2;
  const ribAngles = [-58, -38, -18, 18, 38, 58];
  ribAngles.forEach((angle, index) => {
    const rad = THREE.MathUtils.degToRad(angle);
    const x = Math.sin(rad) * 3.4;
    const z = Math.cos(rad) * -2.25 + 0.18;
    const rib = box('north star radial ceiling rib', [0.18, 0.22, 6.1], [x, 4.52, z], index % 2 ? graphite : steel);
    rib.rotation.y = -rad;
    const strip = box('north star warm rib practical strip', [0.055, 0.04, 4.7], [x * 0.98, 4.34, z + 0.22], warm);
    strip.rotation.y = -rad;
  });
}

function buildCommandHoloTableHero() {
  const group = new THREE.Group();
  group.position.set(0, 0.76, 0.38);
  root.add(group);

  const graphite = mat(0x141b2a, { roughness: 0.36, metalness: 0.78 });
  const blackGlass = mat(0x050b14, { roughness: 0.12, metalness: 0.28, transparent: true, opacity: 0.82 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.92, transparent: true, opacity: 0.48, roughness: 0.06 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.68, transparent: true, opacity: 0.42, roughness: 0.1 });
  const holo = mat(0x8ff7ff, { emissive: COLORS.cyan, emissiveIntensity: 1.34, transparent: true, opacity: 0.42, roughness: 0.04 });
  const scan = mat(0x9ff8ff, { emissive: COLORS.cyan, emissiveIntensity: 0.88, transparent: true, opacity: 0.22, roughness: 0.05 });
  const nodeMat = mat(0xd8fbff, { emissive: COLORS.cyan, emissiveIntensity: 1.1, transparent: true, opacity: 0.62, roughness: 0.08 });

  cylinder('target reset command table graphite base', 2.35, 2.75, 0.46, 32, [0, 0.0, 0], graphite, group);
  cylinder('target reset command table black glass inset', 2.1, 2.1, 0.08, 32, [0, 0.3, 0], blackGlass, group);
  cylinder('target reset command table cyan tactical surface', 1.78, 1.78, 0.05, 32, [0, 0.38, 0], cyan, group);
  const ring = torus('target reset amber holo-table trim ring', 2.22, 0.035, 8, 64, [0, 0.45, 0], amber, group);
  ring.rotation.x = Math.PI / 2;
  const globe = sphere('hero hologram dominant blue mission globe', 0.92, 28, [0, 1.76, 0], holo, group);
  globe.scale.set(1.05, 0.78, 1.16);
  const scanColumn = cylinder('hero hologram soft vertical scan column', 0.82, 1.22, 2.42, 32, [0, 1.34, 0], scan, group);
  scanColumn.rotation.y = 0.18;
  const orbitA = torus('hero hologram bright orbital route A', 1.24, 0.018, 8, 64, [0, 1.76, 0], cyan, group);
  orbitA.rotation.x = Math.PI / 2.32;
  orbitA.rotation.z = 0.48;
  const orbitB = torus('hero hologram amber transfer orbit B', 1.52, 0.016, 8, 64, [0, 1.76, 0], amber, group);
  orbitB.rotation.x = Math.PI / 2.02;
  orbitB.rotation.z = -0.36;
  const orbitC = torus('hero hologram vertical polar orbit C', 1.05, 0.014, 8, 56, [0, 1.76, 0], cyan, group);
  orbitC.rotation.y = Math.PI / 2;
  orbitC.rotation.z = 0.2;

  const surfaceOuter = torus('hero hologram table outer cyan tactical projection', 1.72, 0.02, 8, 64, [0, 0.55, 0], cyan, group);
  surfaceOuter.rotation.x = Math.PI / 2;
  const surfaceInner = torus('hero hologram table inner amber route projection', 0.96, 0.016, 8, 56, [0, 0.59, 0], amber, group);
  surfaceInner.rotation.x = Math.PI / 2;
  cylinder('hero hologram bright central emitter core', 0.2, 0.34, 0.16, 24, [0, 0.7, 0], nodeMat, group);
  cylinder('hero hologram blue spill light pool', 2.55, 2.55, 0.035, 40, [0, -0.08, 0], scan, group);

  const nodes = [
    [-0.86, 1.98, 0.42], [0.74, 2.12, -0.36], [0.32, 1.28, 0.82], [-0.38, 1.5, -0.9],
    [-1.18, 0.7, 0.46], [1.12, 0.74, -0.32], [0.0, 0.78, 1.28]
  ];
  nodes.forEach(([x, y, z], index) => {
    const node = sphere('hero hologram mission node marker', index < 4 ? 0.075 : 0.055, 10, [x, y, z], nodeMat, group);
    node.scale.y = 0.72;
  });

  const routes = [
    [-0.52, 1.42, 0.16, 0.9, 0.028, 0.028, 24],
    [0.48, 1.56, -0.12, 0.78, 0.026, 0.026, -18],
    [0.0, 0.82, 0.88, 1.12, 0.022, 0.022, 0]
  ];
  routes.forEach(([x, y, z, width, h, d, yaw]) => {
    const route = box('hero hologram floating route segment', [width, h, d], [x, y, z], scan, group);
    route.rotation.y = THREE.MathUtils.degToRad(yaw);
  });

  box('target reset holo table front operator console', [1.6, 0.34, 0.62], [0, 0.36, 2.75], blackGlass, group);
  box('target reset holo table left operator console', [1.2, 0.3, 0.54], [-2.9, 0.34, 0.6], blackGlass, group);
  box('target reset holo table right operator console', [1.2, 0.3, 0.54], [2.9, 0.34, 0.6], blackGlass, group);
  box('hero hologram front console cyan spill edge', [1.34, 0.04, 0.05], [0, 0.62, 3.08], cyan, group);
  box('hero hologram left console cyan spill edge', [0.96, 0.04, 0.05], [-2.9, 0.56, 0.96], cyan, group);
  box('hero hologram right console cyan spill edge', [0.96, 0.04, 0.05], [2.9, 0.56, 0.96], cyan, group);
  addLight('point', COLORS.cyan, 4.4, [0, 2.0, 0.38], 8.2);
}

function buildCommandPitLightingHierarchy() {
  const warmPit = mat(0xffb56a, { emissive: COLORS.amber, emissiveIntensity: 0.44, transparent: true, opacity: 0.22, roughness: 0.16 });
  const cyanHaze = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.2, transparent: true, opacity: 0.1, roughness: 0.05 });
  const heroCyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.46, transparent: true, opacity: 0.2, roughness: 0.06 });
  const dimmer = mat(0x02040a, { roughness: 0.98, metalness: 0.0, transparent: true, opacity: 0.34 });
  const softDarker = mat(0x050812, { roughness: 0.9, metalness: 0.05, transparent: true, opacity: 0.24 });
  const mutedAmber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.18, transparent: true, opacity: 0.14, roughness: 0.18 });

  cylinder('lighting hierarchy warm under table bounce pool', 2.05, 2.28, 0.035, 40, [0, 0.82, 0.38], warmPit);
  cylinder('lighting hierarchy cyan hologram atmosphere veil', 1.55, 1.9, 1.32, 36, [0, 1.7, 0.38], cyanHaze);
  const heroBackGlow = box('lighting hierarchy soft cyan backplate behind globe', [2.4, 1.32, 0.045], [0, 2.02, -0.7], heroCyan);
  heroBackGlow.rotation.x = THREE.MathUtils.degToRad(-4);
  box('lighting hierarchy foreground commander warm rim', [0.82, 0.045, 0.04], [0, 1.78, 3.22], warmPit);
  box('lighting hierarchy left crew cyan rim edge', [0.72, 0.04, 0.04], [-2.42, 1.62, 2.46], heroCyan);
  box('lighting hierarchy right crew amber rim edge', [0.72, 0.04, 0.04], [2.42, 1.62, 2.46], mutedAmber);
  box('lighting hierarchy front console amber underglow', [1.7, 0.04, 0.06], [0, 1.06, 3.08], warmPit);
  box('lighting hierarchy left console dimmer hood', [1.12, 0.24, 0.05], [-2.88, 1.44, 0.18], softDarker);
  box('lighting hierarchy right console dimmer hood', [1.12, 0.24, 0.05], [2.88, 1.44, 0.18], softDarker);

  box('lighting hierarchy rear hangar contrast damper upper', [14.8, 0.58, 0.04], [0, 3.72, -9.92], dimmer);
  box('lighting hierarchy rear hangar contrast damper lower', [14.8, 0.42, 0.04], [0, 2.22, -9.92], softDarker);
  box('lighting hierarchy left station peripheral dim veil', [3.8, 1.08, 0.04], [-8.4, 2.14, 2.68], softDarker);
  box('lighting hierarchy right station peripheral dim veil', [3.8, 1.08, 0.04], [8.4, 2.14, 2.68], softDarker);
  box('lighting hierarchy rear station peripheral dim veil left', [3.7, 1.0, 0.04], [-8.4, 2.24, -6.36], softDarker);
  box('lighting hierarchy rear station peripheral dim veil right', [3.7, 1.0, 0.04], [8.4, 2.24, -6.36], softDarker);
  box('lighting hierarchy ceiling left corner vignette baffle', [5.8, 0.22, 5.2], [-8.2, 4.22, -3.2], dimmer);
  box('lighting hierarchy ceiling right corner vignette baffle', [5.8, 0.22, 5.2], [8.2, 4.22, -3.2], dimmer);
  box('lighting hierarchy left ceiling practical soft mask', [4.4, 0.06, 0.04], [-5.6, 4.05, 2.92], softDarker);
  box('lighting hierarchy right ceiling practical soft mask', [4.4, 0.06, 0.04], [5.6, 4.05, 2.92], softDarker);
  box('lighting hierarchy left floor bounce crescent', [2.4, 0.03, 0.05], [-1.82, 1.0, 1.82], warmPit);
  box('lighting hierarchy right floor bounce crescent', [2.4, 0.03, 0.05], [1.82, 1.0, 1.82], warmPit);
  box('lighting hierarchy rear seated crew cyan rim', [1.8, 0.035, 0.04], [0, 1.48, -2.18], heroCyan);
  box('lighting hierarchy center supervisor sightline glow', [1.1, 0.035, 0.04], [0, 1.56, 1.88], mutedAmber);
  box('lighting hierarchy pit amber threshold emphasis', [5.2, 0.035, 0.05], [0, 1.03, 2.92], mutedAmber);
  box('lighting hierarchy rear cyan depth kept secondary', [8.8, 0.035, 0.04], [0, 2.68, -9.86], heroCyan);
}

function buildCommandPitMaterialContrast() {
  const blackGlass = mat(0x030912, { roughness: 0.08, metalness: 0.3, transparent: true, opacity: 0.72, emissive: 0x031627, emissiveIntensity: 0.1 });
  const graphite = mat(0x101723, { roughness: 0.32, metalness: 0.82 });
  const bronze = mat(0x9b6b32, { roughness: 0.26, metalness: 0.84, emissive: 0x4d2a08, emissiveIntensity: 0.08 });
  const warm = mat(0xffb56a, { emissive: COLORS.amber, emissiveIntensity: 0.26, transparent: true, opacity: 0.18, roughness: 0.12 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.24, transparent: true, opacity: 0.18, roughness: 0.07 });
  const shadow = mat(0x02040a, { roughness: 0.92, metalness: 0.12 });

  cylinder('material contrast polished black glass outer command deck', 4.34, 4.52, 0.026, 48, [0, 1.205, 0.38], blackGlass);
  cylinder('material contrast dark graphite inner pit liner', 3.02, 3.18, 0.045, 48, [0, 1.235, 0.38], graphite);
  const bronzeOuter = torus('material contrast bronze command deck outer bevel', 4.55, 0.026, 8, 72, [0, 1.255, 0.38], bronze);
  bronzeOuter.rotation.x = Math.PI / 2;
  const bronzeInner = torus('material contrast bronze command deck inner bevel', 3.08, 0.022, 8, 72, [0, 1.27, 0.38], bronze);
  bronzeInner.rotation.x = Math.PI / 2;
  const glassSeam = torus('material contrast restrained cyan glass seam', 3.78, 0.012, 8, 72, [0, 1.29, 0.38], cyan);
  glassSeam.rotation.x = Math.PI / 2;

  const consoleCaps = [
    ['front', 0, 3.02, 0], ['left', -3.18, 0.94, -62], ['right', 3.18, 0.94, 62], ['rear', 0, -2.58, 180]
  ];
  consoleCaps.forEach(([name, x, z, yaw], index) => {
    const cap = box(`material contrast ${name} graphite console cap`, [1.5, 0.08, 0.56], [x, 1.36, z], graphite);
    cap.rotation.y = THREE.MathUtils.degToRad(yaw);
    const trim = box(`material contrast ${name} bronze console lip`, [1.36, 0.035, 0.045], [x, 1.43, z + 0.28], bronze);
    trim.rotation.y = cap.rotation.y;
    const pool = box(`material contrast ${name} warm operator pool`, [1.04, 0.03, 0.08], [x, 1.48, z + 0.18], index === 0 ? warm : bronze);
    pool.rotation.y = cap.rotation.y;
  });
  box('material contrast front stair bronze threshold', [4.2, 0.04, 0.05], [0, 1.16, 3.55], bronze);
  box('material contrast rear stair bronze threshold', [3.8, 0.04, 0.05], [0, 1.16, -2.54], bronze);
  box('material contrast left rail bronze catchlight', [0.05, 0.035, 2.7], [-2.72, 1.48, 0.46], bronze);
  box('material contrast right rail bronze catchlight', [0.05, 0.035, 2.7], [2.72, 1.48, 0.46], bronze);
  box('material contrast table base warm reflection line', [2.2, 0.035, 0.045], [0, 1.39, 1.34], warm);
  box('material contrast left pit shadow value mass', [0.52, 0.08, 3.2], [-3.08, 1.13, 0.38], shadow);
  box('material contrast right pit shadow value mass', [0.52, 0.08, 3.2], [3.08, 1.13, 0.38], shadow);
}



function buildReadabilityHotfixLighting() {
  const coolFlood = mat(0xaecbff, {
    emissive: 0x8fc7ff,
    emissiveIntensity: 0.72,
    transparent: true,
    opacity: 0.34,
    roughness: 0.2,
    metalness: 0.0
  });
  const warmFlood = mat(0xffc46b, {
    emissive: COLORS.amber,
    emissiveIntensity: 0.78,
    transparent: true,
    opacity: 0.32,
    roughness: 0.2,
    metalness: 0.0
  });
  const cyanDatum = mat(COLORS.cyan, {
    emissive: COLORS.cyan,
    emissiveIntensity: 0.95,
    transparent: true,
    opacity: 0.42,
    roughness: 0.1,
    metalness: 0.0
  });
  const readableSteel = mat(0x3b4963, {
    emissive: 0x15243c,
    emissiveIntensity: 0.18,
    roughness: 0.42,
    metalness: 0.58
  });

  // Production hotfix: public page had the environment black-crushed into the background.
  // These are broad industrial light cards, not decorative neon: they force a readable first-frame silhouette.
  box('readability lock overhead cool wash bar', [18.8, 0.075, 0.22], [0, 4.18, 1.65], coolFlood);
  box('readability lock rear warm silhouette bar', [19.4, 0.09, 0.24], [0, 3.76, -9.92], warmFlood);
  box('readability lock central cyan production spine', [0.22, 2.9, 0.075], [0, 2.24, -5.82], cyanDatum);
  box('readability lock left bay overhead worklight', [5.6, 0.065, 0.2], [-7.25, 3.58, 0.42], coolFlood);
  box('readability lock right bay overhead worklight', [5.6, 0.065, 0.2], [7.25, 3.58, 0.42], warmFlood);
  box('readability lock rear plant left worklight', [5.0, 0.065, 0.2], [-7.15, 3.84, -6.98], cyanDatum);
  box('readability lock rear plant right worklight', [5.0, 0.065, 0.2], [7.15, 3.84, -6.98], coolFlood);

  // Light-colored structural witness marks make it obvious the 3D scene loaded even before screenshots are pixel-checked.
  box('readability lock left vertical witness pier', [0.18, 3.1, 0.2], [-12.64, 2.74, -2.4], readableSteel);
  box('readability lock right vertical witness pier', [0.18, 3.1, 0.2], [12.64, 2.74, -2.4], readableSteel);
  box('readability lock rear factory horizon witness', [16.8, 0.16, 0.18], [0, 2.18, -10.32], readableSteel);
}



function buildRooms() {
  Object.entries(ROOMS).forEach(([id, room]) => {
    if (!room.pos) return;
    const [x, , z] = room.pos;
    const group = new THREE.Group();
    group.position.set(x, 0.02, z);
    root.add(group);

    buildEmbeddedBayFrame(room.label, group, room.accent);

    const platform = box(`${room.label} inset bay deck`, [3.15, 0.18, 2.18], [0, 0.09, 0.08], mat(0x151d35, { roughness: 0.56, metalness: 0.12 }), group);
    platform.userData.mode = id;
    roomMeshes.push(platform);

    const alcoveMat = mat(COLORS.gunmetal, { roughness: 0.48, metalness: 0.42 });
    box(`${room.label} alcove back wall`, [3.25, 1.16, 0.1], [0, 0.82, -0.98], alcoveMat, group);
    box(`${room.label} alcove left fin`, [0.1, 1.05, 1.48], [-1.66, 0.8, -0.34], alcoveMat, group);
    box(`${room.label} alcove right fin`, [0.1, 1.05, 1.48], [1.66, 0.8, -0.34], alcoveMat, group);
    box(`${room.label} alcove canopy`, [3.38, 0.1, 1.75], [0, 1.46, -0.22], mat(COLORS.blackMetal, { roughness: 0.42, metalness: 0.58 }), group);
    box(`${room.label} alcove light bar`, [2.62, 0.035, 0.055], [0, 1.32, -0.94], mat(room.accent, { emissive: room.accent, emissiveIntensity: 0.45, transparent: true, opacity: 0.42 }), group);

    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(3.65, 2.48),
      mat(room.accent, { emissive: room.accent, emissiveIntensity: 0.32, transparent: true, opacity: 0.05, side: THREE.DoubleSide })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.195;
    group.add(glow);
    glow.userData.mode = id;
    roomMeshes.push(glow);

    const landingMat = mat(room.accent, { emissive: room.accent, emissiveIntensity: 0.36, transparent: true, opacity: 0.2 });
    box(`${room.label} rectangular workcell landing front`, [2.45, 0.035, 0.055], [0, 0.3, 0.98], landingMat, group);
    box(`${room.label} rectangular workcell landing rear`, [2.45, 0.035, 0.055], [0, 0.3, -0.78], landingMat, group);
    box(`${room.label} rectangular workcell landing left`, [0.055, 0.035, 1.48], [-1.28, 0.3, 0.1], landingMat, group);
    box(`${room.label} rectangular workcell landing right`, [0.055, 0.035, 1.48], [1.28, 0.3, 0.1], landingMat, group);

    const label = makeTextSprite(room.label, `#${room.accent.toString(16).padStart(6, '0')}`, room.label.length > 7 ? 52 : 68);
    label.position.set(0, 0.62, -0.64);
    label.scale.set(room.label.length > 7 ? 1.55 : 1.28, 0.34, 1);
    label.material.opacity = 0.38;
    group.add(label);

    // No per-room beacons, circular pads, or animated attention poles; broad bay geometry carries the read.
    glow.material.opacity = 0.035;
  });
}

function buildEmbeddedBayFrame(label, group, accent) {
  const rockMat = mat(COLORS.rock, { roughness: 0.94, metalness: 0.02 });
  const steel = mat(COLORS.brushedSteel, { roughness: 0.38, metalness: 0.72 });
  const shadow = mat(0x090d18, { roughness: 0.64, metalness: 0.28 });
  const accentMat = mat(accent, { emissive: accent, emissiveIntensity: 0.4, transparent: true, opacity: 0.38 });

  box(`${label} recessed bay shadow`, [4.25, 1.65, 0.24], [0, 0.94, -1.24], shadow, group);
  box(`${label} embedded bay sill`, [4.05, 0.18, 0.34], [0, 0.28, -1.0], steel, group);
  box(`${label} embedded bay upper truss`, [4.35, 0.16, 0.28], [0, 1.7, -0.84], steel, group);
  box(`${label} embedded bay left column`, [0.18, 1.55, 0.32], [-2.12, 0.92, -0.75], steel, group);
  box(`${label} embedded bay right column`, [0.18, 1.55, 0.32], [2.12, 0.92, -0.75], steel, group);
  box(`${label} district depth marker`, [3.65, 0.035, 0.045], [0, 1.58, -1.05], accentMat, group);
  box(`${label} bay floor threshold glow`, [3.75, 0.025, 0.05], [0, 0.22, 1.1], accentMat, group);

  // Pruned four small rock chunks per bay; two broad cheek plates keep the carved read without pebble spam.
  box(`${label} broad left carved cheek`, [0.42, 1.48, 0.42], [-2.38, 0.96, -0.82], rockMat, group);
  box(`${label} broad right carved cheek`, [0.42, 1.48, 0.42], [2.38, 0.96, -0.82], rockMat, group);
}

function buildStationWorkspaceIdentityKits() {
  const dark = mat(0x050914, { roughness: 0.74, metalness: 0.32 });
  const steel = mat(0x3b465d, { roughness: 0.36, metalness: 0.76 });
  const blackGlass = mat(0x061323, { roughness: 0.12, metalness: 0.24, transparent: true, opacity: 0.66, emissive: 0x08233b, emissiveIntensity: 0.16 });
  const warm = mat(0xffc071, { emissive: COLORS.amber, emissiveIntensity: 0.34, transparent: true, opacity: 0.24, roughness: 0.12 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.34, transparent: true, opacity: 0.24, roughness: 0.08 });
  const gold = mat(COLORS.gold, { emissive: COLORS.gold, emissiveIntensity: 0.32, transparent: true, opacity: 0.24, roughness: 0.1 });
  const coral = mat(COLORS.coral, { emissive: COLORS.coral, emissiveIntensity: 0.28, transparent: true, opacity: 0.22, roughness: 0.1 });
  const green = mat(COLORS.green, { emissive: COLORS.green, emissiveIntensity: 0.28, transparent: true, opacity: 0.22, roughness: 0.1 });
  const violet = mat(COLORS.violet, { emissive: COLORS.violet, emissiveIntensity: 0.28, transparent: true, opacity: 0.22, roughness: 0.1 });

  const workspaces = [
    ['build navigation traffic control', -8.4, 2.35, gold, warm, -0.08],
    ['review security tactical coordination', 8.4, 2.35, coral, warm, 0.08],
    ['observatory asteroid telemetry', -8.4, -6.05, violet, cyan, -0.04],
    ['deploy logistics hangar operations', 8.4, -6.05, green, cyan, 0.04]
  ];

  workspaces.forEach(([name, x, z, accent, lamp, skew], index) => {
    box(`${name} dedicated console workbench`, [3.1, 0.34, 0.86], [x, 1.12, z + 0.68], dark);
    box(`${name} black glass task surface`, [2.56, 0.06, 0.58], [x, 1.34, z + 0.42], blackGlass);
    box(`${name} local task board wall`, [2.34, 0.86, 0.08], [x, 2.18, z - 0.42], blackGlass);
    box(`${name} primary data strip`, [1.86, 0.045, 0.045], [x, 2.54, z - 0.34], accent);
    box(`${name} secondary task graph`, [0.08, 0.46, 0.04], [x - 0.74, 2.2, z - 0.31], accent);
    box(`${name} secondary task graph twin`, [0.08, 0.36, 0.04], [x + 0.72, 2.15, z - 0.31], index % 2 ? cyan : warm);
    box(`${name} warm local overhead task lamp`, [2.7, 0.045, 0.16], [x, 2.82, z + 0.28], lamp);
    box(`${name} role keyboard lane`, [2.18, 0.04, 0.05], [x, 1.52, z + 0.82], accent);
    box(`${name} supervisor status header`, [2.0, 0.055, 0.05], [x, 2.72, z - 0.76], accent);
    box(`${name} tiny team-ready indicator`, [0.32, 0.055, 0.05], [x + 1.18, 2.72, z - 0.76], lamp);
    box(`${name} inbound task queue marker`, [0.32, 0.055, 0.05], [x - 1.18, 2.72, z - 0.76], index % 2 ? cyan : warm);
    box(`${name} side equipment tower left`, [0.22, 1.02, 0.34], [x - 1.78, 1.72, z + 0.18], steel);
    box(`${name} side equipment tower right`, [0.22, 1.02, 0.34], [x + 1.78, 1.72, z + 0.18], steel);
    box(`${name} floor cable run to command ring`, [0.08, 0.025, 2.1], [x * 0.82, 0.74, z * 0.68], index % 2 ? accent : cyan);
    box(`${name} return circulation seam`, [0.08, 0.025, 1.28], [x * 0.92, 0.75, z * 0.48], lamp);
    box(`${name} threshold task light chip`, [0.42, 0.03, 0.05], [x, 0.8, z + 1.08], accent);
    box(`${name} circulation arrow datum`, [1.26, 0.028, 0.06], [x + skew * 7, 0.78, z + 1.38], lamp);
  });
}


function buildRailingsAndCatwalks() {
  const railMat = mat(COLORS.brushedSteel, { roughness: 0.32, metalness: 0.76 });
  const deckMat = mat(0x101827, { roughness: 0.5, metalness: 0.52 });
  const glowMat = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.65, transparent: true, opacity: 0.64 });
  const catwalkSpan = (toX, toZ, color) => {
    const from = new THREE.Vector2(0, 0.45);
    const to = new THREE.Vector2(toX, toZ);
    const mid = from.clone().add(to).multiplyScalar(0.5);
    const length = from.distanceTo(to) - 2.0;
    const angle = Math.atan2(toZ - from.y, toX - from.x);
    const deck = box('long facility catwalk deck', [length, 0.055, 0.42], [mid.x, 0.16, mid.y], deckMat);
    deck.rotation.y = -angle;
    [-0.31, 0.31].forEach((side) => {
      const rail = box('long facility catwalk rail', [length, 0.035, 0.035], [mid.x + Math.sin(angle) * side, 0.42, mid.y + Math.cos(angle) * side], railMat);
      rail.rotation.y = -angle;
    });
    const centerline = box('catwalk distance glow seam', [length * 0.86, 0.018, 0.025], [mid.x, 0.205, mid.y], mat(color, { emissive: color, emissiveIntensity: 0.35, transparent: true, opacity: 0.32 }));
    centerline.rotation.y = -angle;
  };
  catwalkSpan(-8.4, 2.35, COLORS.gold);
  catwalkSpan(8.4, 2.35, COLORS.coral);
  catwalkSpan(8.4, -6.05, COLORS.green);
  catwalkSpan(-8.4, -6.05, COLORS.violet);

  // Fewer large guard forms around command pit; no post loop or tiny rail necklace.
  box('command pit front broad guard rail', [4.4, 0.16, 0.12], [0, 0.58, 2.72], railMat);
  box('command pit rear broad guard rail', [4.4, 0.16, 0.12], [0, 0.58, -1.82], railMat);
  box('command pit left broad guard rail', [0.12, 0.16, 3.8], [-2.52, 0.58, 0.45], railMat);
  box('command pit right broad guard rail', [0.12, 0.16, 3.8], [2.52, 0.58, 0.45], railMat);
  box('command pit front amber safety datum', [3.6, 0.04, 0.045], [0, 0.76, 2.58], glowMat);
  box('command pit rear amber safety datum', [3.6, 0.04, 0.045], [0, 0.76, -1.68], glowMat);
  box('command pit left amber safety datum', [0.045, 0.04, 2.9], [-2.36, 0.76, 0.45], glowMat);
  box('command pit right amber safety datum', [0.045, 0.04, 2.9], [2.36, 0.76, 0.45], glowMat);

  [[-8.4, 2.35], [8.4, 2.35], [-8.4, -6.05], [8.4, -6.05]].forEach(([x, z]) => {
    box('catwalk edge broad stop', [1.5, 0.08, 0.08], [x, 0.32, z + 0.86], railMat);
    box('catwalk edge broad stop', [1.5, 0.08, 0.08], [x, 0.32, z - 0.86], railMat);
  });
}

function buildCommandCrewInteractionSilhouettes() {
  const suit = mat(0x141923, { roughness: 0.58, metalness: 0.22 });
  const visor = mat(0x06111f, { emissive: COLORS.cyan, emissiveIntensity: 0.42, transparent: true, opacity: 0.72, roughness: 0.08 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.82, transparent: true, opacity: 0.62, roughness: 0.08 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.58, transparent: true, opacity: 0.5, roughness: 0.12 });
  const tablet = mat(0x07182a, { emissive: 0x0d5f86, emissiveIntensity: 0.42, transparent: true, opacity: 0.7, roughness: 0.12, metalness: 0.18 });

  const crew = [
    ['foreground commander silhouette', 0.0, 3.32, 1.06, 0.84, 0, 'point', cyan],
    ['left leaning console operator', -2.35, 2.36, 1.2, 0.7, -22, 'lean', amber],
    ['right leaning console operator', 2.35, 2.36, 1.2, 0.7, 22, 'lean', cyan],
    ['left discussion operator', -3.18, 0.12, 1.28, 0.78, -64, 'tablet', cyan],
    ['right discussion operator', 3.18, 0.12, 1.28, 0.78, 64, 'tablet', amber],
    ['rear seated console operator left', -1.55, -2.42, 1.05, 0.58, -150, 'seated', cyan],
    ['rear seated console operator right', 1.55, -2.42, 1.05, 0.58, 150, 'seated', amber]
  ];

  crew.forEach(([name, x, z, y, scale, yaw, pose, accent], index) => {
    const group = new THREE.Group();
    group.name = name;
    group.position.set(x, y, z + 0.38);
    group.rotation.y = THREE.MathUtils.degToRad(yaw);
    root.add(group);

    const body = cylinder(`${name} dark suited torso`, 0.13 * scale, 0.17 * scale, 0.62 * scale, 8, [0, 0.08, 0], suit, group);
    body.rotation.z = pose === 'lean' ? (x < 0 ? -0.18 : 0.18) : 0;
    const head = sphere(`${name} helmet silhouette`, 0.17 * scale, 10, [0, 0.48 * scale, 0], suit, group);
    head.scale.y = 1.08;
    box(`${name} cyan visor slit`, [0.2 * scale, 0.052 * scale, 0.035 * scale], [0, 0.5 * scale, 0.14 * scale], visor, group);
    box(`${name} role chest glow`, [0.18 * scale, 0.035 * scale, 0.025 * scale], [0, 0.16 * scale, 0.14 * scale], accent, group);
    box(`${name} boot stance shadow`, [0.34 * scale, 0.05 * scale, 0.16 * scale], [0, -0.28 * scale, 0.02], suit, group);

    if (pose === 'point') {
      const arm = box(`${name} pointing arm toward hologram`, [0.46 * scale, 0.045 * scale, 0.045 * scale], [-0.26 * scale, 0.28 * scale, 0.12], accent, group);
      arm.rotation.z = -0.34;
      const other = box(`${name} braced command arm`, [0.34 * scale, 0.045 * scale, 0.045 * scale], [0.28 * scale, 0.18 * scale, 0.11], suit, group);
      other.rotation.z = 0.32;
    } else if (pose === 'lean') {
      box(`${name} left hand planted on console`, [0.38 * scale, 0.04 * scale, 0.04 * scale], [-0.18 * scale, 0.08 * scale, 0.22 * scale], accent, group);
      box(`${name} right hand planted on console`, [0.38 * scale, 0.04 * scale, 0.04 * scale], [0.18 * scale, 0.08 * scale, 0.22 * scale], accent, group);
      box(`${name} console interaction glow pool`, [0.52 * scale, 0.025 * scale, 0.16 * scale], [0, -0.02 * scale, 0.38 * scale], tablet, group);
    } else if (pose === 'tablet') {
      box(`${name} handheld tactical tablet`, [0.28 * scale, 0.2 * scale, 0.035 * scale], [0.23 * scale, 0.2 * scale, 0.2 * scale], tablet, group);
      box(`${name} tablet support arm`, [0.32 * scale, 0.04 * scale, 0.04 * scale], [0.1 * scale, 0.18 * scale, 0.12 * scale], suit, group);
    } else {
      box(`${name} seated console forearms`, [0.48 * scale, 0.04 * scale, 0.04 * scale], [0, 0.02 * scale, 0.26 * scale], accent, group);
      box(`${name} compact seat block`, [0.42 * scale, 0.18 * scale, 0.34 * scale], [0, -0.32 * scale, -0.08 * scale], suit, group);
    }

    operators.push({ group, baseY: y, index: index + 20, agent: { name } });
  });
}


function buildOperators() {
  AGENTS.forEach((agent, index) => {
    const room = ROOMS[agent.room];
    const [rx, , rz] = room.pos;
    const group = new THREE.Group();
    group.position.set(rx + agent.offset[0], 0.58, rz + agent.offset[1]);
    group.lookAt(new THREE.Vector3(0, 0.58, 0.35));
    root.add(group);

    const suit = mat(0x303744, { roughness: 0.5, metalness: 0.24 });
    const visorMat = mat(0x07111f, { emissive: agent.color, emissiveIntensity: 0.22, transparent: true, opacity: 0.72, roughness: 0.08 });
    const roleGlow = mat(agent.color, { emissive: agent.color, emissiveIntensity: 0.82, transparent: true, opacity: 0.72 });

    // Simplified operators: enough human scale, no bobblehead micro-kit budget.
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.48, 4, 8), suit);
    body.position.y = -0.13;
    body.castShadow = true;
    group.add(body);

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 10), mat(0xd9dde6, { roughness: 0.32, metalness: 0.16 }));
    helmet.position.y = 0.22;
    helmet.castShadow = true;
    group.add(helmet);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.065, 0.035), visorMat);
    visor.position.set(0, 0.23, 0.16);
    group.add(visor);
    box('operator simplified role chest bar', [0.2, 0.035, 0.025], [0, -0.03, 0.16], roleGlow, group);
    box('operator simplified boot stance block', [0.3, 0.05, 0.14], [0, -0.52, 0.02], suit, group);

    operators.push({ group, baseY: 0.58, index, agent });
  });
}

function updateHud() {
  const room = ROOMS[state.mode];
  const title = document.getElementById('focus-title');
  const body = document.getElementById('focus-body');
  if (title) title.textContent = room.title;
  if (body) body.textContent = room.body;

  const metrics = {
    'metric-agents': state.metrics.agents,
    'metric-missions': state.metrics.missions,
    'metric-active': state.metrics.active,
    'metric-review': state.metrics.review
  };
  Object.entries(metrics).forEach(([id, value]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
  });

  const feed = document.getElementById('feed-list');
  if (feed) feed.innerHTML = state.feed.slice(0, 5).map(([who, what]) => `<div class="feed-item"><strong>${who}</strong> ${what}</div>`).join('');
}

function setMode(modeName) {
  state.mode = modeName;
  document.querySelectorAll('.dock-button[data-mode]').forEach((button) => button.classList.toggle('active', button.dataset.mode === modeName));
  const room = ROOMS[modeName];
  if (room?.target) facilityTarget.set(room.target[0], room.target[1], room.target[2]);
  if (room?.camera) camera.position.set(room.camera[0], room.camera[1], room.camera[2]);
  updateHud();
}

function clampFacilityTarget(target) {
  target.x = THREE.MathUtils.clamp(target.x, facilityBounds.minX, facilityBounds.maxX);
  target.z = THREE.MathUtils.clamp(target.z, facilityBounds.minZ, facilityBounds.maxZ);
  return target;
}

function updateFacilityNavigation(delta) {
  const speed = navKeys.has('shift') ? 7.6 : 4.4;
  const step = speed * delta;
  if (navKeys.has('w') || navKeys.has('arrowup')) facilityTarget.z -= step;
  if (navKeys.has('s') || navKeys.has('arrowdown')) facilityTarget.z += step;
  if (navKeys.has('a') || navKeys.has('arrowleft')) facilityTarget.x -= step;
  if (navKeys.has('d') || navKeys.has('arrowright')) facilityTarget.x += step;
  clampFacilityTarget(facilityTarget);
  facilityFocus.lerp(facilityTarget, 0.08);
}

function simulateShift() {
  state.tick += 1;
  state.metrics.missions = 10 + Math.floor(Math.random() * 8);
  state.metrics.active = 2 + Math.floor(Math.random() * 5);
  state.metrics.review = 1 + Math.floor(Math.random() * 4);
  const events = [
    ['Artemis', 'rerouted a mission through the central holo-table.'],
    ['Forge', 'pulled a fresh scene pass onto the build floor.'],
    ['Sentinel', 'moved a risky change into the review chamber.'],
    ['Quartermaster', 'lit a green deploy lane at the dock.'],
    ['Prospector', 'found a useful reference in the observatory.']
  ];
  state.feed.unshift(events[Math.floor(Math.random() * events.length)]);
  updateHud();
}

function onPointer(event, click = false) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hit = raycaster.intersectObjects(roomMeshes, false)[0];
  renderer.domElement.style.cursor = hit ? 'pointer' : 'crosshair';
  if (!click) return;
  if (hit?.object?.userData?.mode) {
    setMode(hit.object.userData.mode);
    return;
  }
  if (raycaster.ray.intersectPlane(floorPlane, clickTarget)) {
    facilityTarget.set(clickTarget.x, 1.05, clickTarget.z);
    clampFacilityTarget(facilityTarget);
    state.mode = 'overview';
    document.querySelectorAll('.dock-button[data-mode]').forEach((button) => button.classList.toggle('active', button.dataset.mode === 'overview'));
    updateHud();
  }
}

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.05);
  const t = clock.elapsedTime;
  updateFacilityNavigation(delta);
  operators.forEach((operator) => {
    operator.group.position.y = operator.baseY + Math.sin(t * 1.7 + operator.index) * 0.035;
    operator.group.rotation.y += Math.sin(t * 0.3 + operator.index) * 0.0008;
  });
  const offset = getCameraOffsetForMode();
  const desiredTarget = getCameraTargetForMode();
  const desiredCamera = new THREE.Vector3(desiredTarget.x + offset.x, offset.y, desiredTarget.z + offset.z);
  camera.position.lerp(desiredCamera, 0.06);
  controls.target.lerp(desiredTarget, 0.08);
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

renderer.domElement.addEventListener('pointermove', (event) => onPointer(event));
renderer.domElement.addEventListener('pointerdown', (event) => onPointer(event, true));
window.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright', 'shift'].includes(key)) {
    navKeys.add(key);
    event.preventDefault();
  }
});
window.addEventListener('keyup', (event) => navKeys.delete(event.key.toLowerCase()));
document.querySelectorAll('.dock-button[data-mode]').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
document.getElementById('shuffle-btn').addEventListener('click', simulateShift);

buildOffice();
updateHud();
animate();
