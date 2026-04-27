import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const COLORS = {
  bg: 0x050712,
  floor: 0x0c1224,
  wall: 0x10182c,
  wallDark: 0x070b17,
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
    body: 'A full spatial read of Mission Control: central holo-table, room clusters, visible operators, signal lanes, and deploy traffic.',
    camera: [0, 14.9, 44.6],
    target: [0, 1.62, -3.1],
    accent: COLORS.cyan
  },
  command: {
    title: 'Central Holo-table',
    body: 'The mission graph lives here. Artemis and Navigator turn tasks into visible routing decisions before work fans out into the rooms.',
    camera: [3.7, 3.2, 4.2],
    target: [0, 0.95, 0.35],
    accent: COLORS.cyan,
    pos: [0, 0, 0.55],
    label: 'COMMAND'
  },
  build: {
    title: 'Build Floor',
    body: 'Forge works here: UI fabrication, interaction passes, scene construction, and the hands-on production lane.',
    camera: [0, 25.4, 66.8],
    target: [-12.45, 1.05, -0.25],
    accent: COLORS.gold,
    pos: [-12.75, 0, -0.25],
    label: 'BUILD'
  },
  review: {
    title: 'Review Chamber',
    body: 'Sentinel owns this room. Coral containment rings mark QA, safety checks, regressions, and work that needs a sharper eye.',
    camera: [0, 25.4, 66.8],
    target: [12.45, 1.05, -0.45],
    accent: COLORS.coral,
    pos: [12.75, 0, -0.45],
    label: 'REVIEW'
  },
  deploy: {
    title: 'Deploy Dock',
    body: 'Quartermaster stages releases here. Green-lit launch rails show what is ready to ship, publish, or route into production.',
    camera: [0, 25.4, 66.8],
    target: [12.65, 1.05, -10.55],
    accent: COLORS.green,
    pos: [12.85, 0, -10.65],
    label: 'DEPLOY'
  },
  observatory: {
    title: 'Observatory',
    body: 'Prospector watches the signal room: research, memory, requirements, references, and the weird clues hiding in the noise.',
    camera: [0, 25.4, 66.8],
    target: [-12.65, 1.05, -10.55],
    accent: COLORS.violet,
    pos: [-12.85, 0, -10.65],
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.82;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.bg);
scene.fog = new THREE.Fog(COLORS.bg, 22, 118);

const camera = new THREE.PerspectiveCamera(58, window.innerWidth / window.innerHeight, 0.1, 190);
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
const animated = [];
const towers = [];
const operators = [];
const signalOrbs = [];
const roomMeshes = [];
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
const clickTarget = new THREE.Vector3();
const navKeys = new Set();
const facilityFocus = new THREE.Vector3(...ROOMS.overview.target);
const facilityTarget = new THREE.Vector3(...ROOMS.overview.target);
const fixedCameraOffset = new THREE.Vector3(0, 13.4, 48.2);
const facilityBounds = { minX: -14.8, maxX: 14.8, minZ: -13.6, maxZ: 4.4 };

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
  scene.add(new THREE.AmbientLight(0xb8c7e6, 0.105));
  scene.add(new THREE.HemisphereLight(0xa9c6ff, 0x160d09, 0.4));
  addLight('directional', 0xc2d4ff, 1.12, [5.5, 9.5, 8.5]);
  addLight('directional', 0x365582, 0.74, [-6, 7.2, -10]);
  addLight('point', COLORS.cyan, 6.4, [0, 1.35, 0.45], 8.4);
  addLight('point', COLORS.amber, 4.1, [-10.4, 4.2, 5.4], 10.5);
  addLight('point', COLORS.amber, 4.1, [10.4, 4.2, 5.4], 10.5);
  addLight('point', 0x6ab2ff, 5.6, [0, 5.2, -10.6], 16.5);
  addLight('point', COLORS.coral, 1.55, [4.2, 1.8, 1.2], 6.4);

  buildShell();
  buildCeilingAndBulkheads();
  buildRockCave();
  buildAsteroidRim();
  buildForegroundCutawayFrame();
  buildVerticalSliceContainer();
  buildInteriorFacilityDominance();
  buildEnclosedProductionShellStack();
  buildInteriorCommandGalleryCompression();
  buildSealedProductionMegashell();
  buildInteriorProductionCanyonHierarchy();
  buildRearCavernDepthGate();
  buildMacroFacilityDepthMarkers();
  buildWideOverviewLightingScaffold();
  buildAsteroidField();
  buildExteriorVista();
  buildDistantFacilityDepth();
  buildRooms();
  buildHoloTable();
  buildSignalLanes();
  buildRailingsAndCatwalks();
  buildCableConduits();
  buildIndustrialSetDressing();
  buildVolumetricLightPlanes();
  buildArchitecturalRibs();
  buildTowers();
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
  const trenchMat = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.36, transparent: true, opacity: 0.16, roughness: 0.12, metalness: 0.1 });

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 25), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);

  // Corrective FPS pass: replace dozens of tiny panels/edge lines with broad readable deck plates.
  [
    ['left production deck plate', [-8.5, 0.03, -2.4], [10.8, 0.055, 18.0]],
    ['right production deck plate', [8.5, 0.03, -2.4], [10.8, 0.055, 18.0]],
    ['rear production apron', [0, 0.045, -10.2], [27.2, 0.065, 2.2]],
    ['command approach deck', [0, 0.06, 3.2], [15.8, 0.065, 4.2]]
  ].forEach(([name, position, size]) => box(name, size, position, deckMat));

  [-6.6, 0, 6.6].forEach((x) => {
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.035, 18.8), trenchMat);
    glass.position.set(x, 0.08, -1.9);
    glass.receiveShadow = true;
    root.add(glass);
  });

  box('rear wall', [28.0, 6.1, 0.25], [0, 2.9, -12.05], mat(COLORS.wall, { roughness: 0.56, metalness: 0.22 }));
  const sideMat = mat(COLORS.wallDark, { roughness: 0.7, metalness: 0.18 });
  const leftWall = box('left wall', [22.0, 5.6, 0.2], [-14.8, 2.75, -1.55], sideMat);
  leftWall.rotation.y = Math.PI / 2;
  const rightWall = box('right wall', [22.0, 5.6, 0.2], [14.8, 2.75, -1.55], sideMat);
  rightWall.rotation.y = Math.PI / 2;

  buildWindowWall();

  [-10.8, -5.4, 0, 5.4, 10.8].forEach((x) => {
    box('wall monitor', [1.05, 0.46, 0.08], [x, 3.6, -11.86], mat(0x182742, { emissive: 0x183f60, emissiveIntensity: 0.52 }));
  });
}

function buildWindowWall() {
  const windowMat = mat(0x020611, { emissive: 0x061a2a, emissiveIntensity: 0.13, transparent: true, opacity: 0.52, roughness: 0.05, metalness: 0.28 });
  const pane = box('armored hangar aperture glass', [18.4, 2.42, 0.055], [0, 2.8, -11.9], windowMat);
  pane.castShadow = false;
  const frameMat = mat(COLORS.blackMetal, { roughness: 0.34, metalness: 0.68 });
  box('hangar aperture top frame', [18.7, 0.18, 0.18], [0, 4.08, -11.81], frameMat);
  box('hangar aperture bottom frame', [18.7, 0.16, 0.18], [0, 1.48, -11.81], frameMat);
  box('hangar aperture left frame', [0.18, 1.92, 0.18], [-9.45, 2.8, -11.81], frameMat);
  box('hangar aperture right frame', [0.18, 1.92, 0.18], [9.45, 2.8, -11.81], frameMat);
  [-6.2, -3.1, 0, 3.1, 6.2].forEach((x) => box('hangar aperture mullion', [0.08, 2.42, 0.12], [x, 2.8, -11.79], frameMat));
  box('hangar cyan rim top', [18.1, 0.035, 0.08], [0, 4.26, -11.74], mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.55, transparent: true, opacity: 0.42 }));
  box('hangar amber sill', [18.4, 0.045, 0.09], [0, 1.66, -11.74], mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.7, transparent: true, opacity: 0.55 }));
}

function buildCeilingAndBulkheads() {
  const ceilingMat = mat(COLORS.blackMetal, { roughness: 0.48, metalness: 0.55 });
  box('heavy ceiling slab left', [8.0, 0.18, 14.0], [-6.2, 4.75, -0.7], ceilingMat);
  box('heavy ceiling slab right', [8.0, 0.18, 14.0], [6.2, 4.75, -0.7], ceilingMat);
  box('rear ceiling cap', [20.0, 0.2, 1.4], [0, 4.75, -6.45], ceilingMat);
  box('front ceiling bulkhead', [20.0, 0.28, 0.9], [0, 4.45, 6.35], ceilingMat);
  box('front left bulkhead', [2.45, 3.05, 0.44], [-8.9, 2.75, 6.55], mat(COLORS.wallDark, { roughness: 0.62, metalness: 0.26 }));
  box('front right bulkhead', [2.45, 3.05, 0.44], [8.9, 2.75, 6.55], mat(COLORS.wallDark, { roughness: 0.62, metalness: 0.26 }));
  [-7.4, -4.2, -1.4, 1.4, 4.2, 7.4].forEach((x) => {
    box('ceiling inset amber strip', [0.045, 0.035, 9.2], [x, 4.58, -0.75], mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.52, transparent: true, opacity: 0.46 }));
  });
  const recess = new THREE.Mesh(new THREE.TorusGeometry(2.35, 0.035, 10, 96), mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.48, transparent: true, opacity: 0.24 }));
  recess.position.set(0, 4.45, 0.45);
  recess.rotation.x = Math.PI / 2;
  root.add(recess);
}

function buildRockCave() {
  const rockMat = mat(COLORS.rock, { roughness: 0.94, metalness: 0.01 });
  // Rock is now a restrained page border, not a field of noisy foreground subjects.
  [
    ['left lower carved border mass', [1.15, 1.2, 5.2], [-14.2, 0.72, 3.1]],
    ['right lower carved border mass', [1.15, 1.2, 5.2], [14.2, 0.72, 3.1]],
    ['left rear carved border mass', [1.0, 1.6, 5.8], [-14.15, 1.4, -7.4]],
    ['right rear carved border mass', [1.0, 1.6, 5.8], [14.15, 1.4, -7.4]],
    ['upper rear rock cap accent', [7.4, 0.55, 1.6], [0, 4.9, -8.6]]
  ].forEach(([name, size, position], index) => {
    const rock = box(name, size, position, rockMat);
    rock.rotation.z = (index - 2) * 0.015;
  });
}

function buildAsteroidRim() {
  const rimMat = mat(COLORS.rock, { roughness: 0.96, metalness: 0.01 });
  const cutMat = mat(0x2b2330, { roughness: 0.92, metalness: 0.02 });
  // Broad proscenium slabs replace the old pebble-ring. This keeps the asteroid at roughly 15–25% of the frame.
  const left = box('slim left asteroid proscenium slab', [0.86, 5.4, 18.2], [-14.6, 2.65, -2.0], rimMat);
  const right = box('slim right asteroid proscenium slab', [0.86, 5.4, 18.2], [14.6, 2.65, -2.0], rimMat);
  left.rotation.z = -0.015;
  right.rotation.z = 0.015;
  box('slim top asteroid proscenium crown', [28.2, 0.66, 8.4], [0, 5.45, -3.2], rimMat);
  box('slim lower asteroid proscenium sill', [28.4, 0.42, 1.3], [0, 0.26, 7.0], rimMat);
  [-13.9, 13.9].forEach((x) => box('clean exposed side cut face', [0.08, 4.5, 12.6], [x, 2.72, -2.5], cutMat));
}

function buildForegroundCutawayFrame() {
  const shadowMat = mat(0x03050b, { roughness: 0.9, metalness: 0.02 });
  const seamMat = mat(0x2c2531, { roughness: 0.98, metalness: 0.01 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.22, transparent: true, opacity: 0.22 });

  // Keep the cutaway readable with a few large surfaces, not dozens of individual rocks.
  box('foreground asteroid cutaway shadow sill', [28.0, 0.28, 0.78], [0, 0.28, 7.26], shadowMat);
  box('upper asteroid cutaway shadow lip', [28.0, 0.34, 0.82], [0, 5.18, -2.6], shadowMat);
  box('left asteroid cutaway side shadow', [0.52, 4.35, 17.4], [-14.7, 2.48, -2.2], shadowMat);
  box('right asteroid cutaway side shadow', [0.52, 4.35, 17.4], [14.7, 2.48, -2.2], shadowMat);

  [-10.8, -5.4, 0, 5.4, 10.8].forEach((x, i) => {
    box('restrained cutaway maintenance glint', [0.055, 0.032, 0.38], [x, 0.78, 6.74], i % 2 ? amber : seamMat);
  });
  [-9.6, -3.2, 3.2, 9.6].forEach((x, i) => {
    const seam = box('large foreground cutaway strata shelf', [3.6, 0.04, 0.07], [x, 0.95 + i * 0.025, 6.62], seamMat);
    seam.rotation.y = (i - 1.5) * 0.08;
  });
}

function buildVerticalSliceContainer() {
  const outerRock = mat(0x100d14, { roughness: 0.98, metalness: 0.01 });
  const deepShadow = mat(0x020309, { roughness: 1.0, metalness: 0.0 });
  const cutPlane = mat(0x302633, { roughness: 0.92, metalness: 0.02 });
  const coolRim = mat(0x5aa5ff, { emissive: 0x5aa5ff, emissiveIntensity: 0.18, transparent: true, opacity: 0.18 });
  const warmWorkLight = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.34, transparent: true, opacity: 0.28 });

  // Corrective frame allocation: a simplified carved border surrounds the dominant interior facility.
  box('vertical slice outer left asteroid mass', [1.05, 5.8, 19.2], [-15.35, 2.75, -2.25], outerRock);
  box('vertical slice outer right asteroid mass', [1.05, 5.8, 19.2], [15.35, 2.75, -2.25], outerRock);
  box('vertical slice overhead asteroid crown', [30.0, 0.92, 9.6], [0, 5.72, -3.8], outerRock);
  box('vertical slice lower fractured sill', [30.0, 0.58, 1.55], [0, 0.02, 6.98], deepShadow);
  box('vertical slice rear cavern darkness', [28.2, 5.2, 0.24], [0, 2.92, -13.05], deepShadow);

  [-14.32, 14.32].forEach((x, i) => {
    const face = box('vertical slice clean exposed cut plane', [0.14, 4.6, 12.0], [x, 2.72, -2.4], cutPlane);
    face.rotation.z = i ? -0.06 : 0.06;
    box('cool blue depth rim on cutaway wall', [0.045, 3.4, 0.06], [x * 0.98, 2.85, -10.1], coolRim);
  });

  [-10.4, -5.2, 0, 5.2, 10.4].forEach((x, i) => {
    box('container amber inspection lamp', [0.075, 0.04, 0.48], [x, 5.06 + Math.sin(i) * 0.04, 2.65 - (i % 2) * 0.58], warmWorkLight);
  });
}

function buildWideOverviewLightingScaffold() {
  const topFill = addLight('directional', 0xd5e3ff, 0.62, [0, 13.0, 18.0]);
  topFill.target.position.set(0, 1.8, -5.2);
  scene.add(topFill.target);
  addLight('point', 0x8ebcff, 3.2, [-18.0, 6.8, 9.2], 18.5);
  addLight('point', 0x8ebcff, 3.2, [18.0, 6.8, 9.2], 18.5);
  addLight('point', COLORS.amber, 2.45, [-16.2, 1.2, 7.6], 14.0);
  addLight('point', COLORS.amber, 2.45, [16.2, 1.2, 7.6], 14.0);

  const beamMat = (color, opacity) => mat(color, {
    emissive: color,
    emissiveIntensity: 0.16,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    roughness: 0.1,
    metalness: 0.0
  });

  [
    [-11.2, 2.4, 2.4, COLORS.gold, 0.035],
    [11.2, 2.4, 2.4, COLORS.coral, 0.035],
    [-11.4, 2.5, -8.2, COLORS.violet, 0.032],
    [11.4, 2.5, -8.2, COLORS.green, 0.032]
  ].forEach(([x, y, z, color, opacity], i) => {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(5.4, 2.1), beamMat(color, opacity));
    plane.name = 'wide overview district readability wash';
    plane.position.set(x, y, z);
    plane.rotation.x = -0.24;
    plane.rotation.z = x < 0 ? -0.04 : 0.04;
    root.add(plane);
    animated.push((t) => { plane.material.opacity = opacity + Math.sin(t * 0.5 + i) * 0.006; });
  });
}


function buildInteriorFacilityDominance() {
  const deck = mat(0x101827, { roughness: 0.52, metalness: 0.5 });
  const deckDark = mat(0x070c16, { roughness: 0.68, metalness: 0.38 });
  const hull = mat(0x172235, { roughness: 0.46, metalness: 0.68 });
  const wall = mat(0x0d1524, { roughness: 0.62, metalness: 0.32 });
  const shadow = mat(0x000106, { roughness: 1.0, metalness: 0.0 });
  const glass = mat(0x061426, { roughness: 0.16, metalness: 0.22, transparent: true, opacity: 0.38, emissive: 0x08213a, emissiveIntensity: 0.1 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.28, transparent: true, opacity: 0.18 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.24, transparent: true, opacity: 0.16 });
  const gold = mat(COLORS.gold, { emissive: COLORS.gold, emissiveIntensity: 0.22, transparent: true, opacity: 0.15 });
  const coral = mat(COLORS.coral, { emissive: COLORS.coral, emissiveIntensity: 0.2, transparent: true, opacity: 0.14 });
  const green = mat(COLORS.green, { emissive: COLORS.green, emissiveIntensity: 0.2, transparent: true, opacity: 0.14 });
  const violet = mat(COLORS.violet, { emissive: COLORS.violet, emissiveIntensity: 0.2, transparent: true, opacity: 0.14 });

  // Corrective composition pass: big facility forms own the screen; asteroid remains a border/proscenium.
  box('corrective dominant production floor plate', [28.5, 0.16, 18.8], [0, 0.09, -2.5], deck);
  box('corrective central command pit shadow mass', [8.8, 0.18, 6.4], [0, 0.2, 0.4], shadow);
  box('corrective command floor raised ring slab', [11.2, 0.14, 7.6], [0, 0.34, 0.15], deckDark);
  box('corrective rear production wall broad pressure hull', [27.4, 5.4, 0.32], [0, 2.86, -12.6], wall);
  box('corrective rear observation glass band', [22.4, 2.1, 0.08], [0, 3.1, -12.35], glass);
  box('corrective upper interior truss header', [26.8, 0.28, 0.42], [0, 5.35, -7.6], hull);
  box('corrective lower mechanical horizon shelf', [25.8, 0.18, 0.74], [0, 1.1, -10.9], deckDark);

  const bayFrames = [
    ['build', -12.75, 1.78, -0.25, 6.4, 3.2, gold],
    ['review', 12.75, 1.78, -0.45, 6.4, 3.2, coral],
    ['observatory', -12.85, 1.92, -10.65, 6.2, 3.35, violet],
    ['deploy', 12.85, 1.92, -10.65, 6.2, 3.35, green]
  ];

  bayFrames.forEach(([label, x, y, z, width, height, accent]) => {
    const group = new THREE.Group();
    group.name = `corrective ${label} broad interior production bay`;
    group.position.set(x, 0, z);
    root.add(group);

    box('corrective bay back wall mass', [width, height, 0.28], [0, y, -1.05], wall, group);
    box('corrective bay dark internal volume', [width * 0.78, height * 0.64, 0.16], [0, y + 0.02, -0.86], shadow, group);
    box('corrective bay top pressure beam', [width * 0.96, 0.14, 0.22], [0, y + height * 0.52, -0.68], hull, group);
    box('corrective bay lower deck apron', [width * 0.92, 0.12, 1.05], [0, 0.62, 0.08], deckDark, group);
    box('corrective bay vertical left jamb', [0.18, height * 0.92, 0.18], [-width * 0.52, y, -0.72], hull, group);
    box('corrective bay vertical right jamb', [0.18, height * 0.92, 0.18], [width * 0.52, y, -0.72], hull, group);
    box('corrective bay clean accent header line', [width * 0.76, 0.04, 0.06], [0, y + height * 0.38, -0.45], accent, group);
    box('corrective bay broad floor identity stripe', [width * 0.7, 0.035, 0.08], [0, 0.76, 0.65], accent, group);
  });

  const deckSpines = [
    [0, 0.72, 3.6, 24.0, amber],
    [0, 0.74, -5.3, 24.5, cyan],
    [-7.2, 0.76, -3.0, 14.5, gold],
    [7.2, 0.76, -3.0, 14.5, coral]
  ];

  deckSpines.forEach(([x, y, z, length, accent], index) => {
    const spine = box('corrective large interior deck lane spine', [length, 0.045, 0.08], [x, y, z], index < 2 ? accent : deckDark);
    spine.rotation.y = index > 1 ? Math.PI / 2 : 0;
  });

  const rearMachines = [
    [-9.8, 2.0, -10.8, 4.2, amber],
    [0, 2.2, -11.0, 5.4, cyan],
    [9.8, 2.0, -10.8, 4.2, green]
  ];

  rearMachines.forEach(([x, y, z, width, accent]) => {
    box('corrective rear production machine silhouette block', [width, 1.4, 0.42], [x, y, z], deckDark);
    box('corrective rear production machine glass strip', [width * 0.72, 0.22, 0.06], [x, y + 0.32, z + 0.24], glass);
    box('corrective rear production machine status line', [width * 0.56, 0.035, 0.045], [x, y + 0.72, z + 0.28], accent);
  });

  [-13.6, 13.6].forEach((x, index) => {
    box('corrective asteroid border slim side shadow', [0.62, 6.2, 18.0], [x, 3.0, -2.1], shadow);
    box('corrective slim cutaway side catchlight', [0.05, 4.6, 0.06], [x * 0.985, 3.1, 4.8], index ? cyan : amber);
  });
  box('corrective asteroid border slim crown shadow', [28.0, 0.62, 8.6], [0, 6.22, -1.2], shadow);
  box('corrective asteroid border slim foreground sill', [28.0, 0.36, 1.25], [0, 0.22, 7.25], shadow);

  const mezzanineMat = mat(0x131f31, { roughness: 0.5, metalness: 0.58 });
  box('corrective left interior mezzanine balcony mass', [11.2, 0.18, 2.4], [-8.2, 1.36, -6.9], mezzanineMat);
  box('corrective right interior mezzanine balcony mass', [11.2, 0.18, 2.4], [8.2, 1.36, -6.9], mezzanineMat);
  box('corrective rear continuous production gantry', [23.6, 0.16, 1.1], [0, 2.42, -9.7], mezzanineMat);

  const ceilingRibs = [
    [-10.8, 4.92, 1.6, 5.8],
    [-5.4, 5.02, -2.2, 7.2],
    [0, 5.12, -5.6, 8.4],
    [5.4, 5.02, -2.2, 7.2],
    [10.8, 4.92, 1.6, 5.8]
  ];

  ceilingRibs.forEach(([x, y, z, depth], index) => {
    const rib = box('corrective broad interior ceiling production rib', [0.18, 0.18, depth], [x, y, z], index % 2 ? hull : deckDark);
    rib.rotation.z = (index - 2) * 0.018;
    box('corrective ceiling rib restrained practical strip', [0.05, 0.035, depth * 0.72], [x, y - 0.14, z + 0.12], index % 2 ? cyan : amber);
  });
}


function buildEnclosedProductionShellStack() {
  const hull = mat(0x162236, { roughness: 0.46, metalness: 0.66 });
  const deepHull = mat(0x09101d, { roughness: 0.64, metalness: 0.42 });
  const shadow = mat(0x000207, { roughness: 1.0, metalness: 0.0 });
  const glass = mat(0x061729, { roughness: 0.14, metalness: 0.26, transparent: true, opacity: 0.32, emissive: 0x09253e, emissiveIntensity: 0.12 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.26, transparent: true, opacity: 0.18 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.25, transparent: true, opacity: 0.18 });
  const steel = mat(COLORS.brushedSteel, { roughness: 0.36, metalness: 0.72 });

  // Interior-dominance shell pass: the viewer should read a wrapped production hall, not an asteroid exterior.
  box('enclosed production shell left inner wall slab', [0.42, 5.6, 17.0], [-13.15, 2.78, -2.35], hull);
  box('enclosed production shell right inner wall slab', [0.42, 5.6, 17.0], [13.15, 2.78, -2.35], hull);
  box('enclosed production shell top inner bulkhead', [25.8, 0.46, 9.6], [0, 5.1, -2.8], hull);
  box('enclosed production shell lower balcony datum', [25.6, 0.22, 1.05], [0, 1.34, -7.95], deepHull);
  box('enclosed production shell rear machinery wall', [24.8, 3.35, 0.24], [0, 2.94, -11.72], shadow);
  box('enclosed production shell rear glass control band', [19.6, 1.18, 0.08], [0, 3.26, -11.48], glass);

  const ribs = [
    [-11.6, -7.8, 4.1],
    [-7.4, -7.1, 4.7],
    [-3.2, -6.4, 5.15],
    [3.2, -6.4, 5.15],
    [7.4, -7.1, 4.7],
    [11.6, -7.8, 4.1]
  ];

  ribs.forEach(([x, z, height], index) => {
    const post = box('enclosed production shell tall pressure rib', [0.18, height, 0.22], [x, 2.8, z], index % 2 ? steel : hull);
    post.rotation.z = (index - 2.5) * 0.018;
    box('enclosed production shell rib foot block', [0.62, 0.16, 0.46], [x, 0.9, z + 0.12], deepHull);
    box('enclosed production shell rib amber service slit', [0.035, height * 0.58, 0.045], [x + (index < 3 ? 0.12 : -0.12), 2.8, z + 0.18], index % 2 ? cyan : amber);
  });

  [
    ['build lower assembly bay mass', -9.9, 0.84, -4.35, 6.4, COLORS.gold],
    ['review lower containment bay mass', 9.9, 0.84, -4.35, 6.4, COLORS.coral],
    ['observatory upper signal bay mass', -8.8, 2.38, -9.55, 5.8, COLORS.violet],
    ['deploy upper logistics bay mass', 8.8, 2.38, -9.55, 5.8, COLORS.green]
  ].forEach(([name, x, y, z, width, color]) => {
    const accent = mat(color, { emissive: color, emissiveIntensity: 0.22, transparent: true, opacity: 0.16 });
    box(`enclosed production shell ${name}`, [width, 0.42, 1.22], [x, y, z], deepHull);
    box(`enclosed production shell ${name} face`, [width * 0.82, 0.08, 0.08], [x, y + 0.29, z + 0.64], accent);
    box(`enclosed production shell ${name} rear shadow`, [width * 0.68, 0.68, 0.12], [x, y + 0.42, z - 0.62], shadow);
  });

  const bridgeRuns = [
    [0, 1.9, -3.7, 22.4, cyan],
    [0, 2.82, -8.9, 20.8, amber],
    [-6.4, 1.66, -6.1, 7.2, amber],
    [6.4, 1.66, -6.1, 7.2, cyan]
  ];

  bridgeRuns.forEach(([x, y, z, length, light], index) => {
    const bridge = box('enclosed production shell broad catwalk run', [length, 0.12, 0.54], [x, y, z], index < 2 ? hull : deepHull);
    bridge.rotation.y = index > 1 ? Math.PI / 2 : 0;
    const strip = box('enclosed production shell catwalk readable edge light', [length * 0.86, 0.035, 0.045], [x, y + 0.12, z + 0.31], light);
    strip.rotation.y = bridge.rotation.y;
  });

  box('enclosed production shell command nucleus rear plinth', [7.8, 0.32, 1.25], [0, 1.04, -2.25], deepHull);
  box('enclosed production shell command nucleus glass fascia', [6.4, 0.58, 0.08], [0, 1.32, -1.6], glass);
  box('enclosed production shell foreground interior threshold', [22.0, 0.18, 0.72], [0, 0.68, 5.92], hull);
  box('enclosed production shell foreground safety line', [18.0, 0.035, 0.05], [0, 0.84, 5.54], amber);

  const lowerDecks = [
    [-10.6, 0.48, -1.5, 5.6, COLORS.gold],
    [10.6, 0.48, -1.5, 5.6, COLORS.coral],
    [-10.2, 0.52, -9.2, 5.0, COLORS.violet],
    [10.2, 0.52, -9.2, 5.0, COLORS.green]
  ];

  lowerDecks.forEach(([x, y, z, width, color], index) => {
    const deckLight = mat(color, { emissive: color, emissiveIntensity: 0.2, transparent: true, opacity: 0.14 });
    box('enclosed production shell lower level broad deck', [width, 0.1, 1.0], [x, y, z], deepHull);
    box('enclosed production shell lower level back wall', [width * 0.88, 0.92, 0.1], [x, y + 0.54, z - 0.5], shadow);
    box('enclosed production shell lower level identity light', [width * 0.74, 0.035, 0.04], [x, y + 0.98, z - 0.42], deckLight);
    box('enclosed production shell lower level front rail', [width * 0.82, 0.05, 0.045], [x, y + 0.26, z + 0.52], steel);
    const serviceColumn = box('enclosed production shell lower level service column', [0.14, 1.2, 0.14], [x + (index % 2 ? -width * 0.35 : width * 0.35), y + 0.7, z - 0.12], hull);
    serviceColumn.rotation.z = index % 2 ? -0.05 : 0.05;
  });

  box('enclosed production shell left wall continuous systems chase', [0.26, 3.2, 9.6], [-12.45, 2.46, -4.8], deepHull);
  box('enclosed production shell right wall continuous systems chase', [0.26, 3.2, 9.6], [12.45, 2.46, -4.8], deepHull);
  box('enclosed production shell left systems amber edge', [0.045, 2.4, 0.055], [-12.24, 2.58, 0.2], amber);
  box('enclosed production shell right systems cyan edge', [0.045, 2.4, 0.055], [12.24, 2.58, 0.2], cyan);
  box('enclosed production shell rear overhead crane beam', [18.4, 0.18, 0.22], [0, 4.18, -9.25], steel);
  box('enclosed production shell rear overhead crane shadow', [11.2, 0.14, 0.16], [0, 3.9, -8.74], shadow);
  box('enclosed production shell left bay compression wall', [4.8, 2.4, 0.18], [-9.4, 2.22, -11.05], deepHull);
  box('enclosed production shell right bay compression wall', [4.8, 2.4, 0.18], [9.4, 2.22, -11.05], deepHull);
  box('enclosed production shell centerline production axis glow', [0.08, 0.035, 10.8], [0, 0.92, -4.1], cyan);
  box('enclosed production shell command threshold amber datum', [8.4, 0.035, 0.055], [0, 0.98, 1.96], amber);
}


function buildInteriorCommandGalleryCompression() {
  const hull = mat(0x142033, { roughness: 0.48, metalness: 0.64 });
  const darkHull = mat(0x070c16, { roughness: 0.66, metalness: 0.38 });
  const shadow = mat(0x000207, { roughness: 1.0, metalness: 0.0 });
  const glass = mat(0x071a2f, { roughness: 0.14, metalness: 0.22, transparent: true, opacity: 0.3, emissive: 0x09243c, emissiveIntensity: 0.1 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.22, transparent: true, opacity: 0.17 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.2, transparent: true, opacity: 0.16 });
  const gold = mat(COLORS.gold, { emissive: COLORS.gold, emissiveIntensity: 0.18, transparent: true, opacity: 0.14 });
  const coral = mat(COLORS.coral, { emissive: COLORS.coral, emissiveIntensity: 0.16, transparent: true, opacity: 0.13 });

  // Foreground and side galleries deliberately steal visual weight from the asteroid border.
  box('interior command gallery left foreground buttress', [3.2, 2.2, 1.4], [-10.4, 1.38, 5.2], hull);
  box('interior command gallery right foreground buttress', [3.2, 2.2, 1.4], [10.4, 1.38, 5.2], hull);
  box('interior command gallery front operations balcony', [18.8, 0.34, 1.25], [0, 1.02, 4.95], darkHull);
  box('interior command gallery front glass control fascia', [13.6, 0.62, 0.08], [0, 1.42, 4.28], glass);
  box('interior command gallery amber balcony safety datum', [16.4, 0.04, 0.055], [0, 1.28, 4.18], amber);

  const sideWallMasses = [
    ['left build-side interior containment wall', -11.65, 2.55, 0.7, 4.2, gold],
    ['right review-side interior containment wall', 11.65, 2.55, 0.7, 4.2, coral],
    ['left observatory-side interior containment wall', -11.65, 2.9, -7.0, 4.8, cyan],
    ['right deploy-side interior containment wall', 11.65, 2.9, -7.0, 4.8, amber]
  ];

  sideWallMasses.forEach(([name, x, y, z, depth, accent], index) => {
    const mass = box(`interior command gallery ${name}`, [0.72, 2.7, depth], [x, y, z], hull);
    mass.rotation.z = x < 0 ? 0.025 : -0.025;
    box(`interior command gallery ${name} recessed dark volume`, [0.16, 1.9, depth * 0.72], [x * 0.992, y, z], shadow);
    box(`interior command gallery ${name} broad identity slit`, [0.05, 0.06, depth * 0.62], [x * 0.968, y + 1.1, z], accent);
    box(`interior command gallery ${name} lower service ledge`, [1.05, 0.14, depth * 0.88], [x * 0.986, 1.02, z], darkHull);
    box(`interior command gallery ${name} upper compression cap`, [1.0, 0.16, depth * 0.82], [x * 0.986, y + 1.42, z], index % 2 ? hull : darkHull);
  });

  [
    [-6.8, 2.18, 2.2, 5.4, amber],
    [6.8, 2.18, 2.2, 5.4, cyan],
    [-6.8, 2.62, -5.4, 6.0, cyan],
    [6.8, 2.62, -5.4, 6.0, amber]
  ].forEach(([x, y, z, length, light], index) => {
    const beam = box('interior command gallery overhead crossbeam', [length, 0.18, 0.22], [x, y + 2.05, z], index % 2 ? hull : darkHull);
    beam.rotation.y = index < 2 ? 0.08 * Math.sign(x) : -0.06 * Math.sign(x);
    const edge = box('interior command gallery crossbeam practical edge', [length * 0.7, 0.035, 0.045], [x, y + 1.88, z + 0.18], light);
    edge.rotation.y = beam.rotation.y;
  });

  box('interior command gallery rear pressure-door silhouette', [6.8, 2.4, 0.2], [0, 2.68, -10.98], shadow);
  box('interior command gallery rear pressure-door horizontal split', [5.8, 0.045, 0.05], [0, 2.68, -10.82], cyan);
  box('interior command gallery command pit lower occlusion plate', [9.6, 0.2, 1.4], [0, 0.62, 1.7], darkHull);
  box('interior command gallery command pit cyan read line', [7.2, 0.035, 0.05], [0, 0.78, 1.02], cyan);
}


function buildSealedProductionMegashell() {
  const hull = mat(0x121d30, { roughness: 0.5, metalness: 0.66 });
  const darkHull = mat(0x050a13, { roughness: 0.72, metalness: 0.36 });
  const pressure = mat(0x1b2940, { roughness: 0.42, metalness: 0.72 });
  const shadow = mat(0x000207, { roughness: 1.0, metalness: 0.0 });
  const glass = mat(0x06182a, { roughness: 0.14, metalness: 0.26, transparent: true, opacity: 0.26, emissive: 0x071f36, emissiveIntensity: 0.08 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.2, transparent: true, opacity: 0.15 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.2, transparent: true, opacity: 0.15 });

  // Final corrective composition lock: a sealed industrial megashell occupies the frame; asteroid is only the outside edge.
  box('sealed production megashell left armored wall band', [1.25, 5.2, 15.4], [-11.9, 2.72, -2.4], hull);
  box('sealed production megashell right armored wall band', [1.25, 5.2, 15.4], [11.9, 2.72, -2.4], hull);
  box('sealed production megashell overhead service spine', [22.0, 0.72, 3.6], [0, 4.72, -0.8], pressure);
  box('sealed production megashell rear blast bulkhead', [21.2, 3.8, 0.42], [0, 2.86, -10.62], darkHull);
  box('sealed production megashell rear bounded asteroid slit', [10.8, 0.72, 0.08], [0, 3.38, -10.32], shadow);
  box('sealed production megashell rear armored glass shield', [11.4, 0.82, 0.055], [0, 3.38, -10.24], glass);
  box('sealed production megashell command island compression deck', [12.6, 0.34, 4.2], [0, 0.82, 1.85], darkHull);
  box('sealed production megashell command island cyan front read', [8.2, 0.04, 0.055], [0, 1.04, 3.98], cyan);

  const wallModules = [
    ['left forward production shutter', -10.72, 1.62, 2.65, 3.1, amber],
    ['right forward production shutter', 10.72, 1.62, 2.65, 3.1, cyan],
    ['left rear production shutter', -10.72, 2.15, -5.45, 4.2, cyan],
    ['right rear production shutter', 10.72, 2.15, -5.45, 4.2, amber]
  ];

  wallModules.forEach(([name, x, y, z, depth, light], index) => {
    const module = box(`sealed production megashell ${name} mass`, [0.88, 2.4, depth], [x, y, z], pressure);
    module.rotation.z = x < 0 ? 0.018 : -0.018;
    box(`sealed production megashell ${name} black recessed slot`, [0.12, 1.56, depth * 0.72], [x * 0.988, y + 0.08, z], shadow);
    box(`sealed production megashell ${name} broad status line`, [0.045, 0.05, depth * 0.64], [x * 0.955, y + 0.98, z], light);
    box(`sealed production megashell ${name} lower hinge block`, [0.52, 0.18, depth * 0.8], [x * 0.966, y - 1.14, z], darkHull);
    box(`sealed production megashell ${name} upper lock rail`, [0.5, 0.14, depth * 0.72], [x * 0.966, y + 1.22, z], hull);
  });

  const overheadRibs = [
    [-8.8, 3.82, 3.2, 5.6],
    [-4.4, 4.05, -0.8, 6.2],
    [0, 4.16, -4.2, 6.8],
    [4.4, 4.05, -0.8, 6.2],
    [8.8, 3.82, 3.2, 5.6]
  ];

  overheadRibs.forEach(([x, y, z, depth], index) => {
    const rib = box('sealed production megashell overhead rib', [0.28, 0.24, depth], [x, y, z], index % 2 ? hull : pressure);
    rib.rotation.z = (index - 2) * 0.028;
    box('sealed production megashell rib underside practical', [0.05, 0.035, depth * 0.72], [x, y - 0.22, z + 0.12], index % 2 ? cyan : amber);
  });

  const floorCuts = [
    [-5.8, -1.0, 5.4, cyan],
    [5.8, -1.0, 5.4, amber],
    [-5.8, -7.4, 4.8, amber],
    [5.8, -7.4, 4.8, cyan]
  ];

  floorCuts.forEach(([x, z, width, light], index) => {
    box('sealed production megashell subfloor dark process cut', [width, 0.12, 0.82], [x, 0.38, z], shadow);
    box('sealed production megashell subfloor raised machine cap', [width * 0.78, 0.16, 0.44], [x, 0.62, z - 0.06], darkHull);
    box('sealed production megashell subfloor controlled glow lane', [width * 0.58, 0.035, 0.045], [x, 0.76, z + 0.42], light);
    box('sealed production megashell subfloor vertical datum post', [0.14, 0.9, 0.14], [x + (index % 2 ? -width * 0.42 : width * 0.42), 1.0, z - 0.22], pressure);
  });

  box('sealed production megashell foreground frame lock beam', [20.0, 0.22, 0.82], [0, 1.52, 5.46], pressure);
  box('sealed production megashell foreground black negative space', [15.4, 0.72, 0.12], [0, 1.84, 5.02], shadow);
  box('sealed production megashell foreground amber guide line', [13.2, 0.04, 0.05], [0, 2.22, 4.94], amber);
  box('sealed production megashell asteroid border occlusion mask', [27.4, 0.18, 0.38], [0, 5.38, 2.78], darkHull);
  box('sealed production megashell left lower compression cheek', [2.6, 1.2, 0.36], [-10.8, 1.08, 4.55], hull);
  box('sealed production megashell right lower compression cheek', [2.6, 1.2, 0.36], [10.8, 1.08, 4.55], hull);
}


function buildInteriorProductionCanyonHierarchy() {
  const hull = mat(0x121d30, { roughness: 0.5, metalness: 0.66 });
  const darkHull = mat(0x050a13, { roughness: 0.72, metalness: 0.36 });
  const pressure = mat(0x1b2940, { roughness: 0.42, metalness: 0.72 });
  const shadow = mat(0x000207, { roughness: 1.0, metalness: 0.0 });
  const glass = mat(0x06182a, { roughness: 0.12, metalness: 0.26, transparent: true, opacity: 0.24, emissive: 0x071f36, emissiveIntensity: 0.08 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.2, transparent: true, opacity: 0.15 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.2, transparent: true, opacity: 0.15 });
  const gold = mat(COLORS.gold, { emissive: COLORS.gold, emissiveIntensity: 0.17, transparent: true, opacity: 0.13 });
  const green = mat(COLORS.green, { emissive: COLORS.green, emissiveIntensity: 0.15, transparent: true, opacity: 0.12 });
  const violet = mat(COLORS.violet, { emissive: COLORS.violet, emissiveIntensity: 0.15, transparent: true, opacity: 0.12 });

  // Interior-first production canyon: one big hierarchy element that owns the hero shot without prop spam.
  box('production canyon central command spine base', [3.2, 0.28, 12.4], [0, 0.92, -2.9], pressure);
  box('production canyon central recessed service trench', [1.6, 0.16, 10.2], [0, 1.08, -3.1], shadow);
  box('production canyon central cyan routing lane', [0.18, 0.04, 9.2], [0, 1.22, -3.2], cyan);
  box('production canyon command island rear riser', [7.8, 0.42, 1.3], [0, 1.18, -1.45], darkHull);
  box('production canyon command island front riser', [9.6, 0.34, 1.05], [0, 1.0, 2.74], darkHull);
  box('production canyon command island glass front fascia', [6.8, 0.58, 0.065], [0, 1.42, 2.18], glass);
  box('production canyon command island amber lip', [7.4, 0.04, 0.045], [0, 1.72, 2.08], amber);

  const tiers = [
    ['left build amphitheater tier', -7.3, 1.04, 1.6, 6.2, gold],
    ['right review amphitheater tier', 7.3, 1.04, 1.6, 6.2, amber],
    ['left observatory rear tier', -7.4, 1.52, -6.35, 5.6, violet],
    ['right deploy rear tier', 7.4, 1.52, -6.35, 5.6, green]
  ];

  tiers.forEach(([name, x, y, z, width, light], index) => {
    box(`production canyon ${name} broad stepped floor`, [width, 0.24, 1.25], [x, y, z], hull);
    box(`production canyon ${name} undercroft shadow`, [width * 0.84, 0.6, 0.12], [x, y + 0.2, z - 0.7], shadow);
    box(`production canyon ${name} identity rail`, [width * 0.74, 0.04, 0.045], [x, y + 0.3, z + 0.68], light);
    box(`production canyon ${name} rear machinery cap`, [width * 0.72, 0.18, 0.44], [x, y + 0.58, z - 0.54], darkHull);
    box(`production canyon ${name} side compression pier`, [0.22, 1.18, 0.24], [x + (index % 2 ? -width * 0.46 : width * 0.46), y + 0.64, z], pressure);
  });

  const gantries = [
    [0, 2.55, 1.15, 17.8, amber],
    [0, 2.88, -4.15, 18.6, cyan],
    [0, 3.18, -8.15, 16.4, amber]
  ];

  gantries.forEach(([x, y, z, width, light], index) => {
    box('production canyon transverse operations gantry', [width, 0.16, 0.46], [x, y, z], index % 2 ? hull : pressure);
    box('production canyon gantry underside dark reveal', [width * 0.86, 0.1, 0.12], [x, y - 0.18, z + 0.14], shadow);
    box('production canyon gantry controlled light edge', [width * 0.74, 0.035, 0.04], [x, y + 0.12, z + 0.28], light);
  });

  [-9.9, 9.9].forEach((x, index) => {
    box('production canyon sidewall stacked machinery mass lower', [1.2, 1.8, 5.4], [x, 1.7, -1.3], darkHull);
    box('production canyon sidewall stacked machinery mass upper', [1.0, 2.1, 4.8], [x, 3.25, -5.9], pressure);
    box('production canyon sidewall vertical black service void', [0.14, 2.8, 3.6], [x * 0.982, 2.55, -3.65], shadow);
    box('production canyon sidewall restrained service glow', [0.04, 2.1, 0.05], [x * 0.94, 2.85, -2.35], index ? cyan : amber);
  });

  const lowerPlant = [
    [-4.8, 0.48, -0.38, 3.6, cyan],
    [4.8, 0.48, -0.38, 3.6, amber],
    [-4.8, 0.52, -5.55, 3.2, amber],
    [4.8, 0.52, -5.55, 3.2, cyan]
  ];

  lowerPlant.forEach(([x, y, z, width, light], index) => {
    box('production canyon lower visible logistics floor slab', [width, 0.12, 0.72], [x, y, z], darkHull);
    box('production canyon lower logistics black cut', [width * 0.74, 0.48, 0.1], [x, y + 0.28, z - 0.38], shadow);
    box('production canyon lower logistics controlled light', [width * 0.58, 0.035, 0.04], [x, y + 0.56, z + 0.36], light);
    box('production canyon lower logistics vertical load post', [0.12, 0.92, 0.12], [x + (index % 2 ? -width * 0.38 : width * 0.38), y + 0.62, z - 0.04], pressure);
  });

  box('production canyon rear sealed blast shutter cap', [13.8, 1.18, 0.24], [0, 4.08, -10.08], pressure);
  box('production canyon rear slit reduced exterior aperture', [7.6, 0.36, 0.06], [0, 3.42, -9.86], shadow);
  box('production canyon rear slit armored blue glint', [7.2, 0.035, 0.04], [0, 3.64, -9.78], cyan);
  box('production canyon foreground interior floor occluder', [18.4, 0.28, 0.84], [0, 0.88, 5.54], darkHull);
  box('production canyon foreground interior cyan datum', [12.8, 0.035, 0.045], [0, 1.08, 5.06], cyan);
  box('production canyon left foreground side cheek', [2.8, 1.05, 0.38], [-9.4, 1.34, 4.62], pressure);
  box('production canyon right foreground side cheek', [2.8, 1.05, 0.38], [9.4, 1.34, 4.62], pressure);
  box('production canyon left overhead occluding baffle', [4.6, 0.32, 1.2], [-6.8, 4.55, 3.1], darkHull);
  box('production canyon right overhead occluding baffle', [4.6, 0.32, 1.2], [6.8, 4.55, 3.1], darkHull);
  box('production canyon center overhead mission spine glow', [0.12, 0.035, 7.8], [0, 4.22, -1.3], cyan);
  box('production canyon rear upper amber production datum', [10.4, 0.035, 0.045], [0, 4.62, -7.4], amber);
  box('production canyon left asteroid-border cover plate', [2.4, 0.2, 0.48], [-12.2, 4.82, 1.4], hull);
  box('production canyon right asteroid-border cover plate', [2.4, 0.2, 0.48], [12.2, 4.82, 1.4], hull);
}

function buildRearCavernDepthGate() {
  const voidMat = mat(0x010207, { roughness: 1.0, metalness: 0.0 });
  const steelShadow = mat(0x070d16, { roughness: 0.62, metalness: 0.5 });
  const rim = mat(0x5aa5ff, { emissive: 0x5aa5ff, emissiveIntensity: 0.36, transparent: true, opacity: 0.26 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.34, transparent: true, opacity: 0.34 });

  [-15.0, -17.4, -20.2].forEach((z, i) => {
    box('macro rear cavern nested darkness plane', [27 - i * 3.8, 4.8 - i * 0.5, 0.16], [0, 3.0 + i * 0.16, z], voidMat);
    box('macro rear cavern upper service rim', [24 - i * 3.6, 0.07, 0.06], [0, 5.18 - i * 0.12, z + 0.12], i % 2 ? amber : rim);
    [-1, 1].forEach((side) => {
      box('macro rear cavern side rim', [0.06, 3.8 - i * 0.3, 0.06], [side * (13.0 - i * 1.8), 3.15, z + 0.14], rim);
      box('macro distant service shaft silhouette', [0.24, 2.7 - i * 0.28, 0.16], [side * (9.4 - i * 1.2), 2.6, z + 0.35], steelShadow);
    });
  });
}

function buildMacroFacilityDepthMarkers() {
  const deckMat = mat(0x0a111d, { roughness: 0.62, metalness: 0.48 });
  const railMat = mat(0x223044, { roughness: 0.46, metalness: 0.62 });
  const dimCyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.34, transparent: true, opacity: 0.24 });
  const dimAmber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.28, transparent: true, opacity: 0.26 });

  // Facility depth pass: repeated terraces and shafts make the four districts feel embedded in a much deeper production base.
  [
    [-5.8, 1.18, 25.0],
    [-8.8, 1.72, 22.0],
    [-12.1, 2.25, 18.2],
    [-15.6, 2.78, 14.8]
  ].forEach(([z, y, width], i) => {
    box('macro facility depth terrace deck', [width, 0.08, 0.58], [0, y, z], deckMat);
    box('macro facility depth terrace front rail', [width * 0.94, 0.035, 0.04], [0, y + 0.26, z + 0.31], i % 2 ? dimAmber : dimCyan);
    box('macro facility depth terrace rear rail', [width * 0.86, 0.03, 0.035], [0, y + 0.22, z - 0.28], railMat);
    [-1, 1].forEach((side) => {
      box('macro facility vertical service shaft', [0.16, 4.15 - i * 0.35, 0.16], [side * (13.7 - i * 1.15), y + 1.65, z - 0.2], railMat);
      const brace = box('macro facility diagonal depth brace', [0.08, 2.2, 0.08], [side * (12.65 - i * 1.05), y + 0.9, z + 0.05], deckMat);
      brace.rotation.z = side * 0.24;
    });
  });

  [
    ['build', COLORS.gold, -10.8],
    ['review', COLORS.coral, 10.8],
    ['deploy', COLORS.green, 8.4],
    ['observatory', COLORS.violet, -8.4]
  ].forEach(([roomId, color, shaftX], i) => {
    const room = ROOMS[roomId];
    const [x, , z] = room.pos;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x * 0.82, 1.85, z - 0.25),
      new THREE.Vector3((x + shaftX) * 0.45, 2.25 + i * 0.12, z - 3.4),
      new THREE.Vector3(shaftX, 2.55 + i * 0.12, -14.6)
    ]);
    const conduit = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 28, 0.022, 8, false),
      mat(color, { emissive: color, emissiveIntensity: 0.3, transparent: true, opacity: 0.22 })
    );
    conduit.name = `macro ${room.label.toLowerCase()} district depth conduit`;
    root.add(conduit);
  });

  for (let i = 0; i < 18; i += 1) {
    const x = -10.2 + (i % 9) * 2.55;
    const z = -13.9 - Math.floor(i / 9) * 2.25;
    const y = 2.15 + (i % 3) * 0.42;
    box('macro distant production window scale marker', [0.16, 0.055, 0.035], [x, y, z], i % 2 ? dimAmber : dimCyan);
  }
}

function buildAsteroidField() {
  // Exterior is deliberately demoted to a quiet backdrop behind the facility window.
  const starMat = mat(0x9fb5e7, { emissive: 0x6f8ec8, emissiveIntensity: 0.22, transparent: true, opacity: 0.22 });
  [-7.2, -3.4, 2.6, 7.1].forEach((x, index) => {
    const glint = box('restrained exterior window star glint', [0.055, 0.055, 0.025], [x, 3.0 + (index % 2) * 0.55, -16.8 - index * 1.2], starMat);
    glint.castShadow = false;
    glint.receiveShadow = false;
  });
}

function buildArchitecturalRibs() {
  [-8.2, -5.4, -2.7, 0, 2.7, 5.4, 8.2].forEach((x, index) => {
    const rib = box('overhead rib', [0.18, 0.18, 12.6], [x, 4.45, -0.9], mat(COLORS.brushedSteel, { roughness: 0.34, metalness: 0.72 }));
    rib.rotation.x = index % 2 ? 0.08 : -0.08;
    const lamp = box('rib amber practical', [0.055, 0.055, 6.8], [x, 4.28, -0.9], mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.8, transparent: true, opacity: 0.76 }));
    lamp.rotation.x = rib.rotation.x;
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.035, 10, 96), mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 1.1, transparent: true, opacity: 0.84 }));
  ring.position.set(0, 3.95, 0.45);
  ring.rotation.x = Math.PI / 2;
  root.add(ring);
  animated.push(() => { ring.rotation.z += 0.002; });
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

    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.36, 0.018, 8, 72), mat(room.accent, { emissive: room.accent, emissiveIntensity: 0.55, transparent: true, opacity: 0.36 }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.28;
    group.add(ring);

    const label = makeTextSprite(room.label, `#${room.accent.toString(16).padStart(6, '0')}`, room.label.length > 7 ? 52 : 68);
    label.position.set(0, 0.62, -0.64);
    label.scale.set(room.label.length > 7 ? 1.55 : 1.28, 0.34, 1);
    label.material.opacity = 0.38;
    group.add(label);

    buildWorkspaceProps(id, group, room.accent);

    const tower = box(`${room.label} beacon`, [0.08, 0.88, 0.08], [0.94, 0.66, 0.58], mat(room.accent, { emissive: room.accent, emissiveIntensity: 0.48, transparent: true, opacity: 0.42 }), group);
    animated.push((t) => {
      ring.rotation.z += 0.004;
      glow.material.opacity = 0.035 + Math.sin(t * 1.7 + x) * 0.012;
      tower.scale.y = 0.9 + Math.sin(t * 2.1 + z) * 0.14;
    });
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

  [[-2.55, 0.48, -0.72], [2.55, 0.5, -0.68], [-2.35, 1.38, -0.95], [2.35, 1.42, -0.92]].forEach(([x, y, z], index) => {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.42 + (index % 2) * 0.12, 0), rockMat);
    rock.position.set(x, y, z);
    rock.rotation.set(index * 0.7, index * 0.31, index * 0.44);
    rock.scale.set(1.45, 0.82, 1.05);
    rock.castShadow = true;
    rock.receiveShadow = true;
    group.add(rock);
  });
}

function buildWorkspaceProps(id, group, accent) {
  const screen = (x, z, w = 0.42, h = 0.32) => {
    const s = box('workspace screen', [w, h, 0.04], [x, 0.56, z], mat(accent, { emissive: accent, emissiveIntensity: 1.05, transparent: true, opacity: 0.58 }), group);
    s.rotation.x = -0.12;
    return s;
  };
  const consoleDesk = (x, z) => {
    const dark = mat(COLORS.blackMetal, { roughness: 0.4, metalness: 0.62 });
    const steel = mat(COLORS.brushedSteel, { roughness: 0.34, metalness: 0.74 });
    box('console chair kit workstation plinth', [0.78, 0.08, 0.38], [x, 0.26, z + 0.02], dark, group);
    box('console chair kit angled desk shell', [0.72, 0.18, 0.32], [x, 0.36, z], mat(COLORS.gunmetal, { roughness: 0.42, metalness: 0.52 }), group);
    const terminalFrame = box('console chair kit black glass terminal frame', [0.54, 0.36, 0.035], [x, 0.58, z - 0.21], dark, group);
    terminalFrame.rotation.x = -0.12;
    screen(x, z - 0.235, 0.44, 0.24);
    [-0.24, 0.24].forEach((sx) => box('console chair kit support strut', [0.035, 0.28, 0.035], [x + sx, 0.42, z - 0.05], steel, group));
    [-0.18, 0, 0.18].forEach((sx) => box('console chair kit tactile key strip', [0.055, 0.012, 0.025], [x + sx, 0.47, z - 0.09], mat(accent, { emissive: accent, emissiveIntensity: 0.82, transparent: true, opacity: 0.65 }), group));
  };
  const operatorStation = (x, z, rotation = 0) => {
    const station = new THREE.Group();
    station.position.set(x, 0, z);
    station.rotation.y = rotation;
    group.add(station);
    const dark = mat(COLORS.blackMetal, { roughness: 0.42, metalness: 0.55 });
    const steel = mat(COLORS.brushedSteel, { roughness: 0.36, metalness: 0.7 });
    const cushion = mat(0x20293a, { roughness: 0.5, metalness: 0.28 });
    box('console chair kit operator pedestal', [0.5, 0.09, 0.34], [0, 0.22, 0.18], dark, station);
    box('console chair kit chair swivel base', [0.18, 0.24, 0.18], [0, 0.28, 0.16], steel, station);
    box('console chair kit bucket seat cushion', [0.34, 0.075, 0.3], [0, 0.36, 0.15], cushion, station);
    box('console chair kit high back shell', [0.34, 0.42, 0.055], [0, 0.58, 0.31], cushion, station);
    box('console chair kit headrest block', [0.24, 0.095, 0.06], [0, 0.82, 0.3], dark, station);
    box('console chair kit left arm rail', [0.06, 0.17, 0.24], [-0.23, 0.46, 0.14], steel, station);
    box('console chair kit right arm rail', [0.06, 0.17, 0.24], [0.23, 0.46, 0.14], steel, station);
    box('console chair kit wraparound console slab', [0.68, 0.11, 0.26], [0, 0.49, -0.26], mat(COLORS.gunmetal, { roughness: 0.36, metalness: 0.62 }), station);
    [-0.22, 0, 0.22].forEach((sx) => {
      const monitor = box('console chair kit angled monitor glass', [0.18, 0.18, 0.035], [sx, 0.68, -0.39], mat(accent, { emissive: accent, emissiveIntensity: 0.55, transparent: true, opacity: 0.46 }), station);
      monitor.rotation.x = -0.22;
    });
    [-0.18, -0.06, 0.06, 0.18].forEach((px) => {
      box('console chair kit data pip row', [0.035, 0.012, 0.02], [px, 0.56, -0.13], mat(accent, { emissive: accent, emissiveIntensity: 0.9, transparent: true, opacity: 0.72 }), station);
    });
  };
  if (id === 'build') {
    operatorStation(-0.62, -0.12, 0.12);
    consoleDesk(-0.42, 0.1);
    box('fabrication bench', [0.9, 0.18, 0.36], [0.38, 0.31, 0.2], mat(COLORS.brushedSteel, { roughness: 0.38, metalness: 0.68 }), group);
    [-0.05, 0.2, 0.48].forEach((x, i) => box('crate stack', [0.22, 0.18 + i * 0.07, 0.22], [x, 0.34 + i * 0.03, 0.58], mat(0x4b3a25, { roughness: 0.64, metalness: 0.12 }), group));
  } else if (id === 'review') {
    operatorStation(0, 0.45, Math.PI);
    const chamber = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.018, 8, 72), mat(accent, { emissive: accent, emissiveIntensity: 1.25, transparent: true, opacity: 0.72 }));
    chamber.rotation.x = Math.PI / 2;
    chamber.position.y = 0.52;
    group.add(chamber);
    screen(-0.48, -0.1); screen(0.48, -0.1);
  } else if (id === 'deploy') {
    operatorStation(-0.62, 0.38, -0.25);
    box('deploy rail left', [0.08, 0.08, 1.24], [-0.34, 0.29, 0.02], mat(accent, { emissive: accent, emissiveIntensity: 0.9, transparent: true, opacity: 0.66 }), group);
    box('deploy rail right', [0.08, 0.08, 1.24], [0.34, 0.29, 0.02], mat(accent, { emissive: accent, emissiveIntensity: 0.9, transparent: true, opacity: 0.66 }), group);
    box('dock door', [0.86, 0.62, 0.07], [0, 0.62, -0.72], mat(COLORS.blackMetal, { roughness: 0.38, metalness: 0.62 }), group);
  } else if (id === 'observatory') {
    operatorStation(0.42, 0.38, -0.38);
    screen(0, -0.26, 0.72, 0.38);
    const dish = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.28, 32, 1, true), mat(accent, { emissive: accent, emissiveIntensity: 0.55, transparent: true, opacity: 0.34, side: THREE.DoubleSide }));
    dish.position.set(-0.48, 0.58, 0.28);
    dish.rotation.z = -0.7;
    group.add(dish);
  } else if (id === 'command') {
    operatorStation(-0.95, 0.04, Math.PI / 2);
    operatorStation(0.95, 0.04, -Math.PI / 2);
    consoleDesk(-0.58, 0.42); consoleDesk(0.58, 0.42);
  }
}

function buildHoloTable() {
  const group = new THREE.Group();
  group.position.set(0, 0.44, 0.45);
  root.add(group);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.72, 1.98, 0.48, 12), mat(0x141c31, { roughness: 0.32, metalness: 0.42 }));
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const lowerRing = new THREE.Mesh(new THREE.TorusGeometry(1.82, 0.04, 12, 112), mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.9, transparent: true, opacity: 0.75 }));
  lowerRing.rotation.x = Math.PI / 2;
  lowerRing.position.y = 0.08;
  group.add(lowerRing);

  const glass = new THREE.Mesh(new THREE.CylinderGeometry(1.95, 1.95, 0.045, 96), mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.85, transparent: true, opacity: 0.28, roughness: 0.08 }));
  glass.position.y = 0.34;
  group.add(glass);

  const map = new THREE.Group();
  map.position.y = 0.92;
  group.add(map);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.38, 0.014, 8, 128), mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 1.55, transparent: true, opacity: 0.82 }));
  ring.rotation.x = Math.PI / 2;
  map.add(ring);
  const outer = new THREE.Mesh(new THREE.TorusGeometry(1.68, 0.01, 8, 128), mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.92, transparent: true, opacity: 0.58 }));
  outer.rotation.x = Math.PI / 2;
  map.add(outer);

  const holoRock = new THREE.Mesh(new THREE.IcosahedronGeometry(0.34, 1), mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 1.35, transparent: true, opacity: 0.48, roughness: 0.18 }));
  holoRock.position.y = 0.36;
  map.add(holoRock);

  const scanColumn = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.2, 32, 1, true), mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.5, transparent: true, opacity: 0.12, side: THREE.DoubleSide }));
  scanColumn.position.y = 0.34;
  map.add(scanColumn);

  const nodePositions = [[0, 0], [-0.72, 0.48], [0.78, 0.34], [-0.58, -0.62], [0.56, -0.66]];
  nodePositions.forEach(([x, z], index) => {
    const color = [COLORS.cyan, COLORS.gold, COLORS.coral, COLORS.green, COLORS.violet][index];
    const node = new THREE.Mesh(new THREE.IcosahedronGeometry(index === 0 ? 0.13 : 0.09, 1), mat(color, { emissive: color, emissiveIntensity: 1.7, transparent: true, opacity: 0.94 }));
    node.position.set(x, 0, z);
    map.add(node);
    if (index > 0) {
      const points = [new THREE.Vector3(0, 0, 0), new THREE.Vector3(x, 0, z)];
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.62 }));
      map.add(line);
    }
    animated.push((t) => { node.position.y = Math.sin(t * 1.9 + index) * 0.08; node.rotation.y += 0.01; });
  });

  animated.push((t) => {
    map.rotation.y += 0.0045;
    holoRock.rotation.x += 0.006;
    holoRock.rotation.y += 0.009;
    lowerRing.rotation.z -= 0.003;
    outer.rotation.z += 0.002;
    glass.material.opacity = 0.24 + Math.sin(t * 1.25) * 0.05;
    scanColumn.material.opacity = 0.09 + Math.sin(t * 2.1) * 0.035;
  });
}

function buildSignalLanes() {
  const lanes = [
    [[0, 0.025, 0.45], [-12.75, 0.025, -0.25], COLORS.gold],
    [[0, 0.025, 0.45], [12.75, 0.025, -0.45], COLORS.coral],
    [[0, 0.025, 0.45], [12.85, 0.025, -10.65], COLORS.green],
    [[0, 0.025, 0.45], [-12.85, 0.025, -10.65], COLORS.violet]
  ];
  lanes.forEach(([from, to, color], index) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...from),
      new THREE.Vector3((from[0] + to[0]) / 2, 0.03, (from[2] + to[2]) / 2),
      new THREE.Vector3(...to)
    ]);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.018, 8, false), mat(color, { emissive: color, emissiveIntensity: 0.55, transparent: true, opacity: 0.42 }));
    root.add(tube);
    animated.push((t) => { tube.material.opacity = 0.30 + Math.sin(t * 1.6 + index) * 0.08; });
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
  catwalkSpan(-12.75, -0.25, COLORS.gold);
  catwalkSpan(12.75, -0.45, COLORS.coral);
  catwalkSpan(12.85, -10.65, COLORS.green);
  catwalkSpan(-12.85, -10.65, COLORS.violet);
  const posts = [];
  for (let i = 0; i < 36; i += 1) {
    const a = (i / 36) * Math.PI * 2;
    const r = 2.35;
    const x = Math.cos(a) * r;
    const z = 0.45 + Math.sin(a) * r;
    posts.push([x, z]);
    box('central pit rail post', [0.045, 0.42, 0.045], [x, 0.36, z], railMat);
  }
  for (let i = 0; i < posts.length; i += 2) {
    const [x, z] = posts[i];
    const a = Math.atan2(z - 0.45, x);
    const rail = box('central pit rail glow', [0.34, 0.035, 0.035], [x, 0.58, z], glowMat);
    rail.rotation.y = -a;
  }
  [[-14.1, -0.25], [14.1, -0.45], [-12.85, -10.65], [12.85, -10.65]].forEach(([x, z]) => {
    box('catwalk edge', [1.5, 0.08, 0.08], [x, 0.32, z + 0.86], railMat);
    box('catwalk edge', [1.5, 0.08, 0.08], [x, 0.32, z - 0.86], railMat);
  });
}

function buildCableConduits() {
  const paths = [
    [[-9.6, 3.7, -6.6], [-6.4, 3.95, -4.8], [-1.8, 4.05, -5.4]],
    [[9.6, 3.6, -6.4], [6.4, 3.9, -4.85], [1.8, 4.0, -5.4]],
    [[-9.6, 2.9, 2.6], [-6.7, 3.05, 0.4], [-2.4, 3.2, 0.15]],
    [[9.6, 2.9, 2.6], [6.7, 3.05, 0.4], [2.4, 3.2, 0.15]]
  ];
  paths.forEach((points, index) => {
    const curve = new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)));
    const cable = new THREE.Mesh(new THREE.TubeGeometry(curve, 28, 0.025, 8, false), mat(index % 2 ? 0x1f2937 : 0x101827, { roughness: 0.6, metalness: 0.3 }));
    root.add(cable);
  });
}

function buildExteriorVista() {
  const voidMat = mat(0x01030a, { roughness: 1.0, metalness: 0.0 });
  const glassMat = mat(0x061526, { roughness: 0.14, metalness: 0.25, transparent: true, opacity: 0.34, emissive: 0x071e34, emissiveIntensity: 0.1 });
  const rim = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.2, transparent: true, opacity: 0.16 });

  // Exterior is now only a bounded rear window/slit so it cannot compete with the production facility.
  box('bounded rear exterior void through control glass', [14.8, 1.35, 0.06], [0, 3.05, -12.92], voidMat);
  box('bounded rear reinforced glass overlay', [15.4, 1.48, 0.035], [0, 3.05, -12.82], glassMat);
  box('bounded rear top window rim', [15.6, 0.045, 0.045], [0, 3.86, -12.76], rim);
  box('bounded rear lower window rim', [15.6, 0.045, 0.045], [0, 2.25, -12.76], rim);
  [-6.0, -3.0, 0, 3.0, 6.0].forEach((x) => {
    box('bounded rear window mullion silhouette', [0.06, 1.48, 0.05], [x, 3.05, -12.74], voidMat);
  });
}

function buildDistantFacilityDepth() {
  const shadowSteel = mat(0x0b101b, { roughness: 0.58, metalness: 0.48 });
  const plantDark = mat(0x050914, { roughness: 0.74, metalness: 0.32 });
  const dimAmber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.22, transparent: true, opacity: 0.2 });
  const dimCyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.2, transparent: true, opacity: 0.18 });

  // The rear depth is now interior plant depth, not exterior dock/ship language.
  [-7.8, 0, 7.8].forEach((x, i) => {
    box('interior rear production service deck', [4.4, 0.14, 0.74], [x, 1.24 + i * 0.2, -8.72 - i * 0.46], shadowSteel);
    box('interior rear production dark bay opening', [3.5, 0.72, 0.12], [x, 1.78 + i * 0.2, -9.1 - i * 0.46], plantDark);
    box('interior rear production lower rail', [3.9, 0.035, 0.035], [x, 1.52 + i * 0.2, -8.33 - i * 0.46], i % 2 ? dimCyan : dimAmber);
    box('interior rear production pylon left', [0.18, 1.95, 0.18], [x - 1.95, 2.08 + i * 0.2, -8.55 - i * 0.46], shadowSteel);
    box('interior rear production pylon right', [0.18, 1.95, 0.18], [x + 1.95, 2.08 + i * 0.2, -8.55 - i * 0.46], shadowSteel);
  });

  [-10.2, -5.1, 5.1, 10.2].forEach((x, i) => {
    const rib = box('interior rear compression rib', [0.16, 3.5, 0.2], [x, 2.8, -9.45], shadowSteel);
    rib.rotation.z = x < 0 ? -0.08 : 0.08;
    box('interior rear rib muted marker light', [0.052, 0.052, 0.052], [x, 4.35, -9.22], i % 2 ? dimAmber : dimCyan);
  });
}

function buildIndustrialSetDressing() {
  const darkPlant = mat(0x07101b, { roughness: 0.7, metalness: 0.4 });
  const steel = mat(COLORS.brushedSteel, { roughness: 0.35, metalness: 0.76 });
  const glass = mat(0x061729, { roughness: 0.16, metalness: 0.24, transparent: true, opacity: 0.28, emissive: 0x08233b, emissiveIntensity: 0.09 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.22, transparent: true, opacity: 0.18 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.22, transparent: true, opacity: 0.18 });

  // Corrective cleanup: replace crates/tanks/chair clutter with a few broad production-machine silhouettes.
  [
    ['left subfloor production trench', -6.8, 2.75, 5.2, amber],
    ['right subfloor production trench', 6.8, 2.75, 5.2, cyan],
    ['rear left process plinth', -7.4, -6.35, 4.8, cyan],
    ['rear right process plinth', 7.4, -6.35, 4.8, amber]
  ].forEach(([name, x, z, width, light], index) => {
    box(`${name} broad machinery base`, [width, 0.22, 1.05], [x, 0.44, z], darkPlant);
    box(`${name} recessed black service volume`, [width * 0.78, 0.72, 0.12], [x, 0.88, z - 0.48], mat(0x01030a, { roughness: 1.0, metalness: 0.0 }));
    box(`${name} restrained production light lane`, [width * 0.66, 0.04, 0.045], [x, 0.86, z + 0.54], light);
    box(`${name} front steel guard rail`, [width * 0.78, 0.055, 0.05], [x, 0.72, z + 0.58], steel);
    const panel = box(`${name} large glass process readout`, [width * 0.36, 0.42, 0.055], [x + (index % 2 ? -width * 0.2 : width * 0.2), 1.1, z - 0.56], glass);
    panel.rotation.x = -0.04;
  });
}

function buildVolumetricLightPlanes() {
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.16, transparent: true, opacity: 0.045, side: THREE.DoubleSide, roughness: 0.1 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.15, transparent: true, opacity: 0.04, side: THREE.DoubleSide, roughness: 0.1 });
  const shellBlue = mat(0x8ebcff, { emissive: 0x8ebcff, emissiveIntensity: 0.12, transparent: true, opacity: 0.032, side: THREE.DoubleSide, roughness: 0.1 });

  // Static broad readability washes: no animated haze spam, just large interior value separation.
  box('interior canyon left bay cool readability wash', [4.2, 2.1, 0.035], [-7.8, 2.4, -6.2], cyan);
  box('interior canyon right bay warm readability wash', [4.2, 2.1, 0.035], [7.8, 2.4, -6.2], amber);
  box('interior canyon rear shell low blue wash', [16.8, 2.4, 0.035], [0, 3.0, -10.15], shellBlue);
  box('interior canyon command table glow catcher', [8.4, 1.35, 0.035], [0, 1.64, 0.2], cyan);
}

function buildTowers() {
  const metrics = [
    ['AGENTS', 6, COLORS.cyan, -5.1, -3.6],
    ['MISSIONS', 12, COLORS.gold, -4.45, -3.6],
    ['ACTIVE', 4, COLORS.green, 4.45, -3.6],
    ['REVIEW', 3, COLORS.coral, 5.1, -3.6]
  ];
  metrics.forEach(([label, value, color, x, z]) => {
    const group = new THREE.Group();
    group.position.set(x, 0.05, z);
    root.add(group);
    box(`${label} pedestal`, [0.42, 0.16, 0.42], [0, 0.08, 0], mat(0x18213a, { roughness: 0.55 }), group);
    const height = 0.55 + Math.min(value, 14) * 0.105;
    const tower = box(`${label} tower`, [0.26, height, 0.26], [0, 0.16 + height / 2, 0], mat(color, { emissive: color, emissiveIntensity: 0.42, transparent: true, opacity: 0.58 }), group);
    towers.push({ mesh: tower, value, base: height, color });
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

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.19, 20, 20), mat(0xd9dde6, { roughness: 0.28, metalness: 0.18 }));
    helmet.position.y = 0.21;
    helmet.castShadow = true;
    group.add(helmet);

    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.135, 16, 16), mat(0x07111f, { emissive: agent.color, emissiveIntensity: 0.28, transparent: true, opacity: 0.72, roughness: 0.06 }));
    visor.scale.set(1.05, 0.45, 0.38);
    visor.position.set(0, 0.22, 0.12);
    group.add(visor);

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.38, 6, 12), mat(0x303744, { roughness: 0.48, metalness: 0.24 }));
    body.position.y = -0.12;
    body.castShadow = true;
    group.add(body);

    const suitPanel = mat(0xd4d6da, { roughness: 0.42, metalness: 0.18 });
    const suitJoint = mat(COLORS.blackMetal, { roughness: 0.48, metalness: 0.44 });
    const roleGlow = mat(agent.color, { emissive: agent.color, emissiveIntensity: 1.15, transparent: true, opacity: 0.82 });

    // Asset pipeline pass: hand-blocked operator avatar kit with stronger suit silhouette and role-read panels.
    box('operator avatar kit shoulder yoke', [0.42, 0.075, 0.18], [0, 0.02, 0], suitPanel, group);
    box('operator avatar kit chest plate', [0.26, 0.2, 0.055], [0, -0.1, 0.13], suitPanel, group);
    box('operator avatar kit role chest stripe', [0.19, 0.035, 0.022], [0, -0.045, 0.165], roleGlow, group);
    box('operator avatar kit backpack block', [0.22, 0.34, 0.09], [0, -0.08, -0.17], suitJoint, group);
    box('operator avatar kit left gauntlet arm', [0.065, 0.32, 0.06], [-0.22, -0.12, 0.025], suitPanel, group);
    box('operator avatar kit right gauntlet arm', [0.065, 0.32, 0.06], [0.22, -0.12, 0.025], suitPanel, group);
    box('operator avatar kit left boot leg', [0.075, 0.24, 0.075], [-0.075, -0.42, 0.015], suitJoint, group);
    box('operator avatar kit right boot leg', [0.075, 0.24, 0.075], [0.075, -0.42, 0.015], suitJoint, group);
    box('operator avatar kit boot stance bar', [0.28, 0.045, 0.13], [0, -0.55, 0.02], suitJoint, group);
    box('status light', [0.045, 0.045, 0.025], [0.11, 0.02, 0.14], roleGlow, group);

    const tag = makeTextSprite(agent.name.toUpperCase(), '#dfe9ff', 40);
    tag.position.set(0, 0.72, 0);
    tag.scale.set(0.46, 0.12, 1);
    tag.material.opacity = 0.26;
    group.add(tag);
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
  animated.forEach((fn) => fn(t));
  towers.forEach((tower, index) => {
    const pulse = 1 + Math.sin(t * 2.1 + tower.value + index) * 0.045;
    tower.mesh.scale.y = pulse;
    tower.mesh.material.emissiveIntensity = 0.75 + Math.sin(t * 2.4 + index) * 0.25;
  });
  operators.forEach((operator) => {
    operator.group.position.y = operator.baseY + Math.sin(t * 1.7 + operator.index) * 0.035;
    operator.group.rotation.y += Math.sin(t * 0.3 + operator.index) * 0.0008;
  });
  signalOrbs.forEach((orb) => {
    const pulse = orb.base + Math.sin(t * (0.9 + orb.index * 0.18)) * 0.1;
    orb.mesh.scale.setScalar(pulse);
    orb.mesh.rotation.x += 0.01;
    orb.mesh.rotation.y += 0.008;
  });

  const desiredCamera = new THREE.Vector3(facilityFocus.x + fixedCameraOffset.x, fixedCameraOffset.y, facilityFocus.z + fixedCameraOffset.z);
  camera.position.lerp(desiredCamera, 0.06);
  controls.target.lerp(facilityFocus, 0.08);
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
