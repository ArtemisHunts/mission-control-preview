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
    body: 'A full spatial read of Mission Control: fabrication line, compact command core, production bays, visible operators, and deploy traffic.',
    camera: [0, 8.85, 26.8],
    target: [0, 1.92, -4.05],
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.0));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.82;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.bg);
scene.fog = new THREE.Fog(COLORS.bg, 12, 70);

const camera = new THREE.PerspectiveCamera(44, window.innerWidth / window.innerHeight, 0.1, 115);
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
const fixedCameraOffset = new THREE.Vector3(0, 8.55, 26.8);
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
  buildAsteroidRim();
  buildForegroundCutawayFrame();
  buildVerticalSliceContainer();
  buildPrunedDominantProductionHall();
  buildInteriorCompressionLock();
  buildInteriorFrameLock();
  buildBroadProductionBayBackplates();
  buildWideOverviewLightingScaffold();
  buildDistantFacilityDepth();
  buildRooms();
  buildCommandProcessCore();
  buildCentralFabricationLine();
  buildRailingsAndCatwalks();
  buildIndustrialSetDressing();
  buildVolumetricLightPlanes();
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
  const blindMat = mat(0x020611, { roughness: 0.82, metalness: 0.18 });
  const frameMat = mat(COLORS.blackMetal, { roughness: 0.34, metalness: 0.68 });
  const glassMat = mat(0x061526, { roughness: 0.14, metalness: 0.25, transparent: true, opacity: 0.22, emissive: 0x071e34, emissiveIntensity: 0.08 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.32, transparent: true, opacity: 0.26 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.3, transparent: true, opacity: 0.24 });

  // Rear wall is now an interior instrumentation band, not an exterior panorama.
  box('sealed rear production blind', [19.4, 2.34, 0.08], [0, 2.82, -11.88], blindMat);
  box('sealed rear instrumentation glass band', [13.2, 0.82, 0.055], [0, 3.18, -11.78], glassMat);
  box('sealed rear top pressure frame', [19.7, 0.18, 0.18], [0, 4.08, -11.74], frameMat);
  box('sealed rear bottom pressure frame', [19.7, 0.16, 0.18], [0, 1.48, -11.74], frameMat);
  box('sealed rear left pressure jamb', [0.18, 2.28, 0.18], [-9.92, 2.8, -11.73], frameMat);
  box('sealed rear right pressure jamb', [0.18, 2.28, 0.18], [9.92, 2.8, -11.73], frameMat);
  [-5.8, -2.9, 0, 2.9, 5.8].forEach((x, i) => {
    box('sealed rear instrument mullion', [0.08, 1.82, 0.1], [x, 3.0, -11.69], frameMat);
    box('sealed rear low telemetry tile', [1.08, 0.18, 0.055], [x, 2.25, -11.66], i % 2 ? amber : cyan);
  });
  box('sealed rear cyan operations datum', [13.8, 0.035, 0.06], [0, 3.78, -11.64], cyan);
  box('sealed rear amber production datum', [16.6, 0.04, 0.06], [0, 1.78, -11.64], amber);
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
  const ceilingDatum = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.28, transparent: true, opacity: 0.18 });
  box('ceiling rectangular command datum front', [5.4, 0.035, 0.055], [0, 4.34, 2.68], ceilingDatum);
  box('ceiling rectangular command datum rear', [5.4, 0.035, 0.055], [0, 4.34, -1.78], ceilingDatum);
  box('ceiling rectangular command datum left', [0.055, 0.035, 4.1], [-2.72, 4.34, 0.45], ceilingDatum);
  box('ceiling rectangular command datum right', [0.055, 0.035, 4.1], [2.72, 4.34, 0.45], ceilingDatum);
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

function buildBroadProductionBayBackplates() {
  const hull = mat(0x162238, { roughness: 0.46, metalness: 0.66 });
  const dark = mat(0x02050c, { roughness: 0.92, metalness: 0.08 });
  const steel = mat(0x28344a, { roughness: 0.38, metalness: 0.72 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.14, transparent: true, opacity: 0.1 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.14, transparent: true, opacity: 0.1 });
  const gold = mat(COLORS.gold, { emissive: COLORS.gold, emissiveIntensity: 0.14, transparent: true, opacity: 0.1 });
  const coral = mat(COLORS.coral, { emissive: COLORS.coral, emissiveIntensity: 0.13, transparent: true, opacity: 0.1 });
  const green = mat(COLORS.green, { emissive: COLORS.green, emissiveIntensity: 0.13, transparent: true, opacity: 0.1 });
  const violet = mat(COLORS.violet, { emissive: COLORS.violet, emissiveIntensity: 0.13, transparent: true, opacity: 0.1 });

  // Large bay backplates replace the remaining "mini-room" impression with facility-scale production walls.
  box('broad backplate build district pressure wall', [7.4, 2.7, 0.24], [-7.8, 2.0, 0.85], hull);
  box('broad backplate review district pressure wall', [7.4, 2.7, 0.24], [7.8, 2.0, 0.85], hull);
  box('broad backplate observatory district pressure wall', [7.0, 2.9, 0.24], [-7.9, 2.35, -7.55], hull);
  box('broad backplate deploy district pressure wall', [7.0, 2.9, 0.24], [7.9, 2.35, -7.55], hull);

  box('broad backplate build dark work void', [5.7, 1.55, 0.12], [-7.8, 2.1, 1.02], dark);
  box('broad backplate review dark work void', [5.7, 1.55, 0.12], [7.8, 2.1, 1.02], dark);
  box('broad backplate observatory dark work void', [5.4, 1.68, 0.12], [-7.9, 2.48, -7.38], dark);
  box('broad backplate deploy dark work void', [5.4, 1.68, 0.12], [7.9, 2.48, -7.38], dark);

  box('broad backplate build amber header', [5.6, 0.055, 0.045], [-7.8, 3.42, 1.18], gold);
  box('broad backplate review coral header', [5.6, 0.055, 0.045], [7.8, 3.42, 1.18], coral);
  box('broad backplate observatory violet header', [5.2, 0.055, 0.045], [-7.9, 3.86, -7.22], violet);
  box('broad backplate deploy green header', [5.2, 0.055, 0.045], [7.9, 3.86, -7.22], green);

  box('broad backplate central rear factory lintel', [15.8, 0.34, 0.5], [0, 3.95, -5.42], steel);
  box('broad backplate central rear black service band', [12.8, 0.48, 0.18], [0, 3.48, -5.18], dark);
  box('broad backplate central rear cyan process datum', [10.2, 0.04, 0.045], [0, 3.18, -4.96], cyan);
  box('broad backplate central rear amber process datum', [10.2, 0.04, 0.045], [0, 2.84, -4.96], amber);

  box('broad backplate left district lower machine shelf', [6.6, 0.26, 0.7], [-7.85, 1.08, -2.2], steel);
  box('broad backplate right district lower machine shelf', [6.6, 0.26, 0.7], [7.85, 1.08, -2.2], steel);
  box('broad backplate left shelf shadow bite', [4.8, 0.18, 0.12], [-7.85, 1.22, -1.84], dark);
  box('broad backplate right shelf shadow bite', [4.8, 0.18, 0.12], [7.85, 1.22, -1.84], dark);
  box('broad backplate left shelf cyan lane', [4.2, 0.035, 0.045], [-7.85, 1.34, -1.48], cyan);
  box('broad backplate right shelf amber lane', [4.2, 0.035, 0.045], [7.85, 1.34, -1.48], amber);
  box('broad backplate left vertical service pier', [0.34, 2.4, 0.34], [-4.25, 2.25, -2.8], hull);
  box('broad backplate right vertical service pier', [0.34, 2.4, 0.34], [4.25, 2.25, -2.8], hull);
  box('broad backplate central black loading throat', [3.2, 1.4, 0.18], [0, 2.32, -3.12], dark);
  box('broad backplate central loading throat cyan lip', [2.4, 0.04, 0.045], [0, 3.04, -2.92], cyan);
  box('broad backplate central loading throat amber sill', [2.4, 0.04, 0.045], [0, 1.58, -2.92], amber);
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
  });
}


function buildPrunedDominantProductionHall() {
  const floor = mat(0x101827, { roughness: 0.5, metalness: 0.52 });
  const floorDark = mat(0x050a13, { roughness: 0.72, metalness: 0.36 });
  const hull = mat(0x142033, { roughness: 0.48, metalness: 0.66 });
  const pressure = mat(0x1b2940, { roughness: 0.42, metalness: 0.72 });
  const shadow = mat(0x000207, { roughness: 1.0, metalness: 0.0 });
  const glass = mat(0x06182a, { roughness: 0.12, metalness: 0.24, transparent: true, opacity: 0.28, emissive: 0x071f36, emissiveIntensity: 0.08 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.18, transparent: true, opacity: 0.14 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.18, transparent: true, opacity: 0.14 });
  const gold = mat(COLORS.gold, { emissive: COLORS.gold, emissiveIntensity: 0.16, transparent: true, opacity: 0.12 });
  const coral = mat(COLORS.coral, { emissive: COLORS.coral, emissiveIntensity: 0.15, transparent: true, opacity: 0.11 });
  const green = mat(COLORS.green, { emissive: COLORS.green, emissiveIntensity: 0.14, transparent: true, opacity: 0.11 });
  const violet = mat(COLORS.violet, { emissive: COLORS.violet, emissiveIntensity: 0.14, transparent: true, opacity: 0.11 });

  // Michael correction: one dominant interior production facility. Old stacked corrective layers are no longer called.
  box('pruned hall single dominant production floor', [28.6, 0.12, 18.6], [0, 0.07, -2.45], floor);
  box('pruned hall dark subfloor canyon', [5.4, 0.18, 13.8], [0, 0.23, -2.25], shadow);
  box('pruned hall command dais broad foundation', [9.8, 0.3, 4.2], [0, 0.48, 0.9], pressure);
  box('pruned hall command dais black undercut', [7.1, 0.2, 1.0], [0, 0.72, 2.55], shadow);
  box('pruned hall cyan central conveyor spine', [0.38, 0.045, 12.0], [0, 0.86, -2.6], cyan);
  box('pruned hall amber command threshold', [8.4, 0.04, 0.05], [0, 0.94, 3.16], amber);

  box('pruned hall left continuous interior wall', [1.18, 5.4, 16.8], [-11.85, 2.82, -2.7], hull);
  box('pruned hall right continuous interior wall', [1.18, 5.4, 16.8], [11.85, 2.82, -2.7], hull);
  box('pruned hall rear pressure bulkhead', [23.2, 4.15, 0.38], [0, 2.9, -10.92], floorDark);
  box('pruned hall rear interior observation band', [14.2, 1.05, 0.06], [0, 3.35, -10.62], glass);
  box('pruned hall overhead service raft', [22.8, 0.64, 5.2], [0, 4.72, -0.8], pressure);
  box('pruned hall overhead black negative slot', [15.0, 0.18, 2.2], [0, 4.34, 0.6], shadow);

  const bayBlocks = [
    ['build broad production bay', -7.4, 1.16, 1.35, 6.4, gold],
    ['review broad QA bay', 7.4, 1.16, 1.35, 6.4, coral],
    ['observatory broad signal bay', -7.3, 1.62, -6.65, 5.8, violet],
    ['deploy broad logistics bay', 7.3, 1.62, -6.65, 5.8, green]
  ];

  bayBlocks.forEach(([name, x, y, z, width, accent], index) => {
    box(`pruned hall ${name} stepped deck`, [width, 0.28, 1.22], [x, y, z], hull);
    box(`pruned hall ${name} recessed shadow volume`, [width * 0.82, 0.72, 0.12], [x, y + 0.38, z - 0.7], shadow);
    box(`pruned hall ${name} readable identity rail`, [width * 0.72, 0.04, 0.045], [x, y + 0.56, z + 0.68], accent);
    box(`pruned hall ${name} rear machine cap`, [width * 0.68, 0.22, 0.5], [x, y + 0.78, z - 0.55], floorDark);
    box(`pruned hall ${name} load pier`, [0.2, 1.2, 0.22], [x + (index % 2 ? -width * 0.46 : width * 0.46), y + 0.66, z], pressure);
  });

  const sideBays = [
    [-10.15, 2.35, 1.7, 3.6, amber],
    [10.15, 2.35, 1.7, 3.6, cyan],
    [-10.15, 2.72, -5.0, 4.4, cyan],
    [10.15, 2.72, -5.0, 4.4, amber]
  ];

  sideBays.forEach(([x, y, z, depth, accent]) => {
    const wall = box('pruned hall side production wall mass', [0.72, 2.8, depth], [x, y, z], pressure);
    wall.rotation.z = x < 0 ? 0.02 : -0.02;
    box('pruned hall side wall black service void', [0.12, 1.9, depth * 0.7], [x * 0.985, y, z], shadow);
    box('pruned hall side wall long status seam', [0.04, 0.05, depth * 0.62], [x * 0.948, y + 0.95, z], accent);
  });

  const gantries = [
    [0, 2.42, 2.3, 17.4, amber],
    [0, 2.86, -3.35, 18.6, cyan],
    [0, 3.24, -7.65, 15.2, amber]
  ];

  gantries.forEach(([x, y, z, width, accent], index) => {
    box('pruned hall transverse operations gantry slab', [width, 0.18, 0.52], [x, y, z], index % 2 ? hull : pressure);
    box('pruned hall gantry underside shadow reveal', [width * 0.82, 0.1, 0.1], [x, y - 0.19, z + 0.18], shadow);
    box('pruned hall gantry restrained practical edge', [width * 0.68, 0.035, 0.04], [x, y + 0.14, z + 0.3], accent);
  });

  const roofBaffles = [
    [-6.6, 4.46, 2.3, 4.8, cyan],
    [0, 4.56, -1.8, 5.6, amber],
    [6.6, 4.46, 2.3, 4.8, cyan]
  ];

  roofBaffles.forEach(([x, y, z, depth, accent]) => {
    box('pruned hall roof machinery baffle', [3.8, 0.34, depth], [x, y, z], floorDark);
    box('pruned hall roof baffle black underside', [2.9, 0.1, depth * 0.58], [x, y - 0.24, z + 0.18], shadow);
    box('pruned hall roof baffle guide line', [2.2, 0.035, 0.04], [x, y - 0.42, z + depth * 0.36], accent);
  });

  box('pruned hall foreground interior balcony lip', [19.4, 0.3, 1.0], [0, 0.88, 5.34], floorDark);
  box('pruned hall foreground black frame reveal', [12.4, 0.34, 0.12], [0, 1.12, 4.86], shadow);
  box('pruned hall foreground cyan guide datum', [10.6, 0.035, 0.045], [0, 1.32, 4.72], cyan);
  box('pruned hall left front compression cheek', [2.8, 1.2, 0.42], [-8.9, 1.28, 4.72], pressure);
  box('pruned hall right front compression cheek', [2.8, 1.2, 0.42], [8.9, 1.28, 4.72], pressure);

  // These mask the remaining rock to a page-border/proscenium ratio instead of letting it become the subject.
  box('pruned hall left asteroid-to-interior cover plate', [1.8, 5.2, 1.0], [-12.45, 3.0, 3.2], hull);
  box('pruned hall right asteroid-to-interior cover plate', [1.8, 5.2, 1.0], [12.45, 3.0, 3.2], hull);
  box('pruned hall top asteroid-to-interior cover plate', [22.0, 0.42, 1.2], [0, 5.06, 3.08], floorDark);
}

function buildInteriorCompressionLock() {
  const hull = mat(0x142033, { roughness: 0.48, metalness: 0.66 });
  const dark = mat(0x02050d, { roughness: 0.9, metalness: 0.12 });
  const steel = mat(0x273247, { roughness: 0.38, metalness: 0.72 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.18, transparent: true, opacity: 0.13 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.18, transparent: true, opacity: 0.13 });
  const glass = mat(0x06182a, { roughness: 0.16, metalness: 0.24, transparent: true, opacity: 0.24, emissive: 0x071f36, emissiveIntensity: 0.08 });

  // Ratio lock: large interior metalwork covers the edges so rock stays a border and the hall fills the frame.
  box('compression lock left inner pressure wall', [1.9, 5.15, 12.8], [-10.85, 2.92, -1.35], hull);
  box('compression lock right inner pressure wall', [1.9, 5.15, 12.8], [10.85, 2.92, -1.35], hull);
  box('compression lock top interior lintel', [21.8, 0.72, 5.8], [0, 5.0, 0.65], hull);
  box('compression lock lower command apron', [20.6, 0.34, 1.28], [0, 0.9, 5.2], dark);
  box('compression lock rear blast door mass', [18.4, 3.1, 0.34], [0, 2.9, -9.84], dark);
  box('compression lock rear narrow operations slit', [9.2, 0.82, 0.06], [0, 3.42, -9.54], glass);

  const wallModules = [
    [-9.65, 2.36, 2.7, 2.6, amber],
    [9.65, 2.36, 2.7, 2.6, cyan],
    [-9.65, 2.72, -3.35, 3.4, cyan],
    [9.65, 2.72, -3.35, 3.4, amber]
  ];
  wallModules.forEach(([x, y, z, depth, accent]) => {
    box('compression lock broad side machinery block', [0.82, 2.25, depth], [x, y, z], steel);
    box('compression lock side machinery dark bite', [0.12, 1.48, depth * 0.66], [x * 0.985, y, z], dark);
    box('compression lock side machinery service line', [0.045, 0.05, depth * 0.6], [x * 0.948, y + 0.78, z], accent);
  });

  const crossMembers = [
    [0, 1.82, 3.72, 16.2, amber],
    [0, 2.58, -1.82, 17.4, cyan],
    [0, 3.34, -6.62, 14.8, amber]
  ];
  crossMembers.forEach(([x, y, z, width, accent], i) => {
    box('compression lock full-width production crossbeam', [width, 0.24, 0.42], [x, y, z], i % 2 ? hull : steel);
    box('compression lock crossbeam shadow undercut', [width * 0.72, 0.1, 0.08], [x, y - 0.22, z + 0.2], dark);
    box('compression lock crossbeam status strip', [width * 0.58, 0.035, 0.04], [x, y + 0.16, z + 0.25], accent);
  });

  box('compression lock left asteroid mask cheek', [1.25, 4.8, 9.0], [-12.82, 3.05, -0.25], dark);
  box('compression lock right asteroid mask cheek', [1.25, 4.8, 9.0], [12.82, 3.05, -0.25], dark);
  box('compression lock crown asteroid mask', [23.8, 0.54, 4.6], [0, 5.44, 0.2], dark);
  box('compression lock left overhead plant bay', [6.8, 0.34, 4.8], [-6.2, 4.72, -3.2], steel);
  box('compression lock right overhead plant bay', [6.8, 0.34, 4.8], [6.2, 4.72, -3.2], steel);
  box('compression lock central dark ceiling service void', [4.4, 0.28, 5.6], [0, 4.58, -2.9], dark);
  box('compression lock overhead amber production datum', [11.6, 0.035, 0.045], [0, 4.36, -0.8], amber);
}

function buildInteriorFrameLock() {
  const hull = mat(0x111c2e, { roughness: 0.5, metalness: 0.64 });
  const dark = mat(0x01030a, { roughness: 0.96, metalness: 0.04 });
  const steel = mat(0x28344a, { roughness: 0.38, metalness: 0.72 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.16, transparent: true, opacity: 0.12 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.16, transparent: true, opacity: 0.12 });

  // Final ratio lock for this direction: engineered interior masks the rock edge; asteroid reads only as outer border.
  box('interior frame left full-height engineered jamb', [1.65, 5.35, 13.8], [-11.62, 3.0, -2.35], hull);
  box('interior frame right full-height engineered jamb', [1.65, 5.35, 13.8], [11.62, 3.0, -2.35], hull);
  box('interior frame top full-width service lintel', [22.6, 0.58, 6.2], [0, 5.18, -2.0], hull);
  box('interior frame lower production sill', [22.2, 0.32, 1.05], [0, 0.72, 5.35], dark);

  box('interior frame left bay black service pocket', [0.18, 3.8, 5.8], [-10.72, 3.0, -3.4], dark);
  box('interior frame right bay black service pocket', [0.18, 3.8, 5.8], [10.72, 3.0, -3.4], dark);
  box('interior frame rear factory header slab', [18.6, 0.42, 0.68], [0, 4.25, -8.65], steel);
  box('interior frame rear lower factory datum', [17.2, 0.18, 0.62], [0, 1.55, -8.35], steel);

  box('interior frame left cyan process line', [0.045, 3.2, 0.055], [-10.44, 3.0, 0.4], cyan);
  box('interior frame right amber process line', [0.045, 3.2, 0.055], [10.44, 3.0, 0.4], amber);
  box('interior frame top amber process line', [14.0, 0.035, 0.045], [0, 4.84, 1.28], amber);
  box('interior frame floor cyan production datum', [12.6, 0.035, 0.045], [0, 0.94, 4.72], cyan);
}

function buildCentralFabricationLine() {
  const deck = mat(0x111a2b, { roughness: 0.48, metalness: 0.58 });
  const dark = mat(0x02050d, { roughness: 0.92, metalness: 0.12 });
  const steel = mat(COLORS.brushedSteel, { roughness: 0.34, metalness: 0.76 });
  const graphite = mat(0x1b2638, { roughness: 0.42, metalness: 0.68 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.22, transparent: true, opacity: 0.16 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.22, transparent: true, opacity: 0.16 });

  // Performance-safe production read: a few big fabrication forms replace animated signal tracks/cables.
  box('fabrication line central conveyor bed', [3.4, 0.24, 11.8], [0, 0.98, -2.7], deck);
  box('fabrication line black service slot', [1.25, 0.28, 10.4], [0, 1.17, -2.85], dark);
  box('fabrication line cyan inspection glass', [0.46, 0.045, 8.2], [0, 1.36, -3.3], cyan);
  box('fabrication line front command bridge', [10.4, 0.28, 0.82], [0, 1.42, 2.85], graphite);
  box('fabrication line rear assembly bridge', [13.8, 0.3, 0.92], [0, 2.08, -6.9], graphite);
  box('fabrication line overhead crane rail left', [0.22, 0.2, 11.2], [-2.6, 3.56, -2.85], steel);
  box('fabrication line overhead crane rail right', [0.22, 0.2, 11.2], [2.6, 3.56, -2.85], steel);
  box('fabrication line overhead crane carriage', [5.8, 0.42, 0.82], [0, 3.34, -1.2], graphite);
  box('fabrication line crane shadow block', [3.2, 0.78, 0.32], [0, 2.82, -1.2], dark);
  box('fabrication line suspended component silhouette', [2.3, 0.42, 1.36], [0, 2.42, -2.05], steel);
  box('fabrication line suspended component cyan scan edge', [1.7, 0.04, 0.055], [0, 2.68, -1.34], cyan);

  const arms = [
    ['left forward clamp arm', -4.2, 1.82, 0.4, 0.34, amber],
    ['right forward clamp arm', 4.2, 1.82, 0.4, -0.34, cyan],
    ['left rear clamp arm', -4.6, 2.28, -5.35, 0.42, cyan],
    ['right rear clamp arm', 4.6, 2.28, -5.35, -0.42, amber]
  ];

  arms.forEach(([name, x, y, z, tilt, accent]) => {
    const shoulder = box(`fabrication line ${name} shoulder block`, [0.82, 0.54, 0.82], [x, y, z], graphite);
    shoulder.rotation.z = tilt * 0.25;
    const boom = box(`fabrication line ${name} broad boom`, [2.05, 0.2, 0.28], [x * 0.84, y + 0.15, z - 0.12], steel);
    boom.rotation.z = tilt;
    boom.rotation.y = x < 0 ? -0.18 : 0.18;
    box(`fabrication line ${name} clamp head`, [0.48, 0.36, 0.42], [x * 0.68, y + 0.04, z - 0.28], dark);
    box(`fabrication line ${name} status edge`, [0.42, 0.035, 0.04], [x * 0.68, y + 0.28, z - 0.02], accent);
  });

  box('fabrication line left logistics deck mass', [4.4, 0.22, 5.6], [-6.9, 1.0, -2.6], graphite);
  box('fabrication line right logistics deck mass', [4.4, 0.22, 5.6], [6.9, 1.0, -2.6], graphite);
  box('fabrication line left logistics amber aisle', [3.2, 0.04, 0.05], [-6.9, 1.18, 0.0], amber);
  box('fabrication line right logistics cyan aisle', [3.2, 0.04, 0.05], [6.9, 1.18, 0.0], cyan);
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

    buildWorkspaceProps(id, group, room.accent);

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

function buildWorkspaceProps(id, group, accent) {
  const dark = mat(COLORS.blackMetal, { roughness: 0.44, metalness: 0.58 });
  const hull = mat(COLORS.gunmetal, { roughness: 0.42, metalness: 0.62 });
  const steel = mat(COLORS.brushedSteel, { roughness: 0.34, metalness: 0.74 });
  const glass = mat(accent, { emissive: accent, emissiveIntensity: 0.46, transparent: true, opacity: 0.34 });

  // Pruned the console/chair micro-kit into big production workcells. Operators still provide scale.
  const workcell = (name, x, z, width = 1.55, depth = 0.78) => {
    box(`${name} broad production plinth`, [width, 0.22, depth], [x, 0.35, z], dark, group);
    box(`${name} angled machinery face`, [width * 0.82, 0.48, 0.08], [x, 0.72, z - depth * 0.38], hull, group).rotation.x = -0.08;
    box(`${name} single readable status band`, [width * 0.64, 0.04, 0.04], [x, 0.96, z - depth * 0.44], glass, group);
    box(`${name} front safety rail`, [width * 0.78, 0.055, 0.045], [x, 0.58, z + depth * 0.48], steel, group);
  };

  const fixture = (name, x, z, width = 1.1, height = 0.62) => {
    box(`${name} vertical process slab`, [width, height, 0.1], [x, 0.62, z], hull, group);
    box(`${name} black recessed work window`, [width * 0.72, height * 0.48, 0.055], [x, 0.68, z + 0.07], dark, group);
    box(`${name} accent read line`, [width * 0.58, 0.035, 0.04], [x, 0.98, z + 0.1], glass, group);
  };

  if (id === 'build') {
    workcell('build bay assembly bench', -0.42, 0.12, 1.8, 0.86);
    fixture('build bay parts rack', 0.72, -0.22, 0.74, 0.82);
    box('build bay large material crate', [0.72, 0.34, 0.5], [0.55, 0.42, 0.68], steel, group);
  } else if (id === 'review') {
    workcell('review bay inspection console', 0, 0.42, 1.65, 0.82);
    fixture('review bay containment plate', 0, -0.28, 1.25, 0.94);
  } else if (id === 'deploy') {
    workcell('deploy bay logistics console', -0.48, 0.36, 1.52, 0.8);
    box('deploy bay sealed airlock slab', [1.24, 0.76, 0.1], [0.48, 0.72, -0.58], dark, group);
    box('deploy bay broad launch lane', [1.4, 0.06, 1.18], [0.18, 0.36, 0.12], glass, group);
  } else if (id === 'observatory') {
    workcell('observatory bay signal console', 0.4, 0.34, 1.56, 0.82);
    fixture('observatory bay sensor wall', -0.55, -0.26, 0.9, 0.88);
  } else if (id === 'command') {
    workcell('command left operations island', -0.78, 0.34, 1.18, 0.72);
    workcell('command right operations island', 0.78, 0.34, 1.18, 0.72);
  }
}

function buildCommandProcessCore() {
  const group = new THREE.Group();
  group.position.set(0, 0.52, 0.55);
  root.add(group);

  const dark = mat(0x050914, { roughness: 0.58, metalness: 0.48 });
  const hull = mat(0x141c31, { roughness: 0.34, metalness: 0.5 });
  const steel = mat(COLORS.brushedSteel, { roughness: 0.34, metalness: 0.72 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.42, transparent: true, opacity: 0.24, roughness: 0.08 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.34, transparent: true, opacity: 0.24 });

  // Compact process core: keeps Mission Control identity without animated hologram clutter dominating the factory.
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.76, 2.05, 0.48, 10), hull);
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const top = new THREE.Mesh(new THREE.CylinderGeometry(1.96, 1.96, 0.055, 24), cyan);
  top.position.y = 0.34;
  group.add(top);

  box('command process core front black fascia', [2.7, 0.42, 0.1], [0, 0.05, 1.62], dark, group);
  box('command process core rear machinery spine', [2.35, 0.52, 0.22], [0, 0.36, -1.22], steel, group);
  box('command process core amber trim front', [2.25, 0.045, 0.045], [0, 0.48, 1.72], amber, group);
  box('command process core cyan route slab', [0.38, 0.04, 2.6], [0, 0.56, 0.05], cyan, group);
  box('command process core left operator wing', [1.3, 0.22, 0.62], [-1.9, 0.18, 0.15], dark, group);
  box('command process core right operator wing', [1.3, 0.22, 0.62], [1.9, 0.18, 0.15], dark, group);
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

  // Fewer large guard forms around command pit; no post loop or tiny rail necklace.
  box('command pit front broad guard rail', [4.4, 0.16, 0.12], [0, 0.58, 2.72], railMat);
  box('command pit rear broad guard rail', [4.4, 0.16, 0.12], [0, 0.58, -1.82], railMat);
  box('command pit left broad guard rail', [0.12, 0.16, 3.8], [-2.52, 0.58, 0.45], railMat);
  box('command pit right broad guard rail', [0.12, 0.16, 3.8], [2.52, 0.58, 0.45], railMat);
  box('command pit front amber safety datum', [3.6, 0.04, 0.045], [0, 0.76, 2.58], glowMat);
  box('command pit rear amber safety datum', [3.6, 0.04, 0.045], [0, 0.76, -1.68], glowMat);
  box('command pit left amber safety datum', [0.045, 0.04, 2.9], [-2.36, 0.76, 0.45], glowMat);
  box('command pit right amber safety datum', [0.045, 0.04, 2.9], [2.36, 0.76, 0.45], glowMat);

  [[-14.1, -0.25], [14.1, -0.45], [-12.85, -10.65], [12.85, -10.65]].forEach(([x, z]) => {
    box('catwalk edge broad stop', [1.5, 0.08, 0.08], [x, 0.32, z + 0.86], railMat);
    box('catwalk edge broad stop', [1.5, 0.08, 0.08], [x, 0.32, z - 0.86], railMat);
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
