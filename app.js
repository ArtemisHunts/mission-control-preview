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
    camera: [0, 11.4, 34.6],
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
  overview: new THREE.Vector3(0, 11.2, 34.2),
  command: new THREE.Vector3(0, 6.8, 17.6),
  build: new THREE.Vector3(0, 8.8, 25.8),
  review: new THREE.Vector3(0, 8.8, 25.8),
  deploy: new THREE.Vector3(0, 9.4, 27.6),
  observatory: new THREE.Vector3(0, 9.4, 27.6)
};
const facilityBounds = { minX: -10.6, maxX: 10.6, minZ: -8.2, maxZ: 3.6 };
const overviewClearSightlineHidden = [
  'dominance front full-width gantry',
  'dominance center full-width gantry',
  'dominance rear full-width gantry',
  'dominance front gantry amber underside',
  'dominance center gantry cyan underside',
  'dominance rear gantry amber underside',
  'dominance front command apron block',
  'rear production apron'
];
const overviewClearSightlineFaded = [
  'calibrated asteroid lower sill proscenium',
  'calibrated foreground sill interior shadow reveal',
  'dominance lower command sill',
  'inserted architecture rear command shadow undercut'
];

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
  addLight('point', 0x7fc7ff, 4.8, [0, 3.35, -7.35], 12.5);
  addLight('point', COLORS.amber, 3.4, [0, 4.15, -2.3], 11.0);
  addLight('point', COLORS.coral, 3.2, [4.2, 2.2, 1.2], 9.2);

  buildShell();
  buildCeilingAndBulkheads();
  buildOverheadRibPracticalArchitecture();
  buildVerifiedCeilingOculusHubFrame();
  buildCalibratedAsteroidProscenium();
  buildTargetCutawayMissionControl();
  buildRearHangarWindowScaleContext();
  buildInteriorDominanceMassing();
  buildAsteroidInsertedArchitectureContrast();
  buildNorthStarOperationsHub();
  buildReadabilityHotfixLighting();
  buildVerifiedUpperBandSidePlatformReadability();
  buildVerifiedRearHangarDepthSeparation();
  buildVerifiedFabricationDeploySeparation();
  buildVerifiedRearServiceDeckReveal();
  buildVerifiedRearRibMachineryBand();
  buildVerifiedUpperRearVoidBreaks();
  buildVerifiedRearPanoramaCeilingStrips();
  buildVerifiedRearWindowShipSilhouette();
  buildVerifiedRearOperationsAtriumDepth();
  buildVerifiedModularRearBayWall();
  buildVerifiedBayWallRimReadability();
  buildVerifiedRearHangarWindowContext();
  buildRooms();
  buildStationWorkspaceIdentityKits();
  buildVerifiedSideOperatorBayReadability();
  buildVerifiedSideBayRoleProps();
  buildVerifiedOuterBayActivityReadability();
  buildCommandHoloTableHero();
  buildVerifiedHoloGlobeCommandScale();
  buildVerifiedReadableWorkstationSilhouettes();
  buildVerifiedCenterValueSeparation();
  buildCommandPitLightingHierarchy();
  buildCommandPitMaterialContrast();
  buildRailingsAndCatwalks();
  buildCommandCrewInteractionSilhouettes();
  buildVerifiedOperatorWorkstationActivity();
  buildVerifiedOperatorReadabilityAnchors();
  buildVerifiedOperatorRimSeparation();
  buildOperators();
  applyVerifiedOverviewOcclusionRelief();
  configureOverviewClearSightlinePrune();

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



function buildVerifiedCeilingOculusHubFrame() {
  const graphite = mat(0x0b111d, { roughness: 0.58, metalness: 0.62 });
  const steel = mat(0x344056, { roughness: 0.38, metalness: 0.78 });
  const shadow = mat(0x02050c, { roughness: 0.95, metalness: 0.08 });
  const warm = mat(0xffbd73, { emissive: COLORS.amber, emissiveIntensity: 0.48, transparent: true, opacity: 0.3, roughness: 0.1 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.36, transparent: true, opacity: 0.22, roughness: 0.08 });

  // Keep the center open: this is a ceiling frame around the holo-table, not a hanging prop over it.
  const ringOuter = torus('verified ceiling oculus hub frame high perimeter armored ring', 5.6, 0.052, 8, 96, [0, 4.68, -0.16], graphite);
  ringOuter.rotation.x = Math.PI / 2;
  const ringInner = torus('verified ceiling oculus hub frame thin cyan command datum ring', 4.72, 0.018, 8, 96, [0, 4.46, -0.16], cyan);
  ringInner.rotation.x = Math.PI / 2;
  const amberOuter = torus('verified ceiling oculus hub frame thin warm perimeter practical ring', 6.06, 0.018, 8, 96, [0, 4.42, -0.16], warm);
  amberOuter.rotation.x = Math.PI / 2;

  const ribs = [
    ['left forward rake', -4.85, 2.18, -28, 5.5, warm],
    ['right forward rake', 4.85, 2.18, 28, 5.5, warm],
    ['left mid command rake', -5.55, -0.15, -12, 5.9, cyan],
    ['right mid command rake', 5.55, -0.15, 12, 5.9, cyan],
    ['left rear rake', -4.95, -2.75, 24, 5.2, warm],
    ['right rear rake', 4.95, -2.75, -24, 5.2, warm]
  ];
  ribs.forEach(([name, x, z, yaw, length, lightMat], index) => {
    const rib = box(`verified ceiling oculus hub frame ${name} open-center heavy rib`, [0.2, 0.22, length], [x, 4.42, z], index % 2 ? steel : graphite);
    rib.rotation.y = THREE.MathUtils.degToRad(yaw);
    const slot = box(`verified ceiling oculus hub frame ${name} underside practical`, [0.046, 0.032, length - 0.9], [x, 4.16, z + 0.04], lightMat);
    slot.rotation.y = rib.rotation.y;
    const cut = box(`verified ceiling oculus hub frame ${name} dark service trough`, [0.082, 0.088, length - 0.5], [x + (x < 0 ? -0.16 : 0.16), 4.24, z - 0.06], shadow);
    cut.rotation.y = rib.rotation.y;
  });

  box('verified ceiling oculus hub frame left dark canopy plate', [4.95, 0.13, 2.05], [-6.05, 4.56, 0.08], graphite);
  box('verified ceiling oculus hub frame right dark canopy plate', [4.95, 0.13, 2.05], [6.05, 4.56, 0.08], graphite);
  box('verified ceiling oculus hub frame rear warm hangar header emphasis', [9.2, 0.065, 0.052], [0, 4.06, -4.08], warm);
  box('verified ceiling oculus hub frame forward cool open sightline strip', [6.4, 0.052, 0.046], [0, 4.04, 3.46], cyan);
  addLight('point', COLORS.amber, 0.95, [-5.1, 4.2, 0.1], 6.2);
  addLight('point', COLORS.amber, 0.95, [5.1, 4.2, 0.1], 6.2);
  addLight('point', COLORS.cyan, 0.72, [0, 4.1, 2.4], 5.4);
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
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.48, transparent: true, opacity: 0.3, roughness: 0.08 });
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

function applyVerifiedOverviewOcclusionRelief() {
  const relief = [
    ['heavy ceiling slab left', [0.72, 0.48, 0.62], [0, 0.72, -0.25]],
    ['heavy ceiling slab right', [0.72, 0.48, 0.62], [0, 0.72, -0.25]],
    ['rear ceiling cap', [0.78, 0.5, 0.72], [0, 0.62, -0.18]],
    ['front ceiling bulkhead', [0.72, 0.42, 0.42], [0, 0.7, 0.44]],
    ['calibrated top interior shadow reveal', [0.82, 0.42, 0.46], [0, 0.58, -0.34]],
    ['calibrated foreground sill interior shadow reveal', [0.78, 0.54, 0.42], [0, -0.34, 0.24]],
    ['dominance lower command sill', [0.82, 0.58, 0.46], [0, -0.2, 0.38]],
    ['lighting hierarchy ceiling left corner vignette baffle', [0.58, 0.42, 0.42], [0, 0.36, -0.28]],
    ['lighting hierarchy ceiling right corner vignette baffle', [0.58, 0.42, 0.42], [0, 0.36, -0.28]]
  ];

  relief.forEach(([name, scale, offset]) => {
    const mesh = root.getObjectByName(name);
    if (!mesh) return;
    mesh.scale.multiply(new THREE.Vector3(...scale));
    mesh.position.add(new THREE.Vector3(...offset));
  });

  const dimmed = [
    'calibrated asteroid lower sill proscenium',
    'calibrated lower exposed cut shelf',
    'inserted architecture rear lower rough cut sill',
    'inserted architecture rear command shadow undercut'
  ];

  dimmed.forEach((name) => {
    const mesh = root.getObjectByName(name);
    if (!mesh) return;
    mesh.scale.y *= 0.72;
    mesh.position.y -= 0.12;
  });
}

function configureOverviewClearSightlinePrune() {
  [...overviewClearSightlineHidden, ...overviewClearSightlineFaded].forEach((name) => {
    const mesh = root.getObjectByName(name);
    if (!mesh) return;
    mesh.userData.overviewBaseVisible = mesh.visible;
    if (mesh.material) {
      mesh.material = mesh.material.clone();
      mesh.material.transparent = true;
      mesh.userData.overviewBaseOpacity = mesh.material.opacity ?? 1;
    }
  });
}

function updateOverviewClearSightline() {
  const clearOverview = state.mode === 'overview';
  overviewClearSightlineHidden.forEach((name) => {
    const mesh = root.getObjectByName(name);
    if (!mesh) return;
    mesh.visible = clearOverview ? false : mesh.userData.overviewBaseVisible !== false;
  });
  overviewClearSightlineFaded.forEach((name) => {
    const mesh = root.getObjectByName(name);
    if (!mesh?.material) return;
    mesh.visible = mesh.userData.overviewBaseVisible !== false;
    mesh.material.opacity = clearOverview ? 0.12 : mesh.userData.overviewBaseOpacity;
  });
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



function buildVerifiedSideOperatorBayReadability() {
  const deskMat = mat(0x111928, { roughness: 0.48, metalness: 0.62 });
  const chairMat = mat(0x070b13, { roughness: 0.72, metalness: 0.28 });
  const suitMat = mat(0xbfc8d7, { emissive: 0x21364e, emissiveIntensity: 0.07, roughness: 0.44, metalness: 0.22 });
  const visorMat = mat(0xd8fbff, { emissive: COLORS.cyan, emissiveIntensity: 0.42, transparent: true, opacity: 0.52, roughness: 0.05 });
  const cyanScreen = mat(0x59f1ff, { emissive: COLORS.cyan, emissiveIntensity: 0.62, transparent: true, opacity: 0.42, roughness: 0.08 });
  const amberScreen = mat(0xffb65c, { emissive: COLORS.amber, emissiveIntensity: 0.58, transparent: true, opacity: 0.4, roughness: 0.1 });
  const greenScreen = mat(COLORS.green, { emissive: COLORS.green, emissiveIntensity: 0.48, transparent: true, opacity: 0.36, roughness: 0.1 });
  const violetScreen = mat(COLORS.violet, { emissive: COLORS.violet, emissiveIntensity: 0.48, transparent: true, opacity: 0.36, roughness: 0.1 });
  const rimMat = mat(0xaef8ff, { emissive: COLORS.cyan, emissiveIntensity: 0.32, transparent: true, opacity: 0.22, roughness: 0.08 });

  const bays = [
    ['build floor large side operator bay', -6.55, 3.02, amberScreen, -10],
    ['review large side operator bay', 6.55, 3.02, cyanScreen, 10],
    ['observatory large side operator bay', -7.25, -3.35, violetScreen, -8],
    ['deploy large side operator bay', 7.25, -3.35, greenScreen, 8]
  ];

  bays.forEach(([name, x, z, screenMat, yaw]) => {
    const side = x < 0 ? -1 : 1;
    const rot = THREE.MathUtils.degToRad(yaw);
    const desk = box(`verified side operator bay readability ${name} broad console island`, [2.82, 0.4, 1.26], [x, 0.78, z], deskMat);
    desk.rotation.y = rot;
    const screen = box(`verified side operator bay readability ${name} inward monitor face`, [1.98, 0.92, 0.075], [x - side * 0.24, 1.44, z - 0.48], screenMat);
    screen.rotation.y = rot;
    const status = box(`verified side operator bay readability ${name} thick status strip`, [2.12, 0.07, 0.052], [x, 1.16, z - 0.68], screenMat);
    status.rotation.y = rot;
    const chair = box(`verified side operator bay readability ${name} visible chair block`, [0.66, 0.5, 0.58], [x + side * 0.22, 0.78, z + 0.56], chairMat);
    chair.rotation.y = rot;
    const torso = box(`verified side operator bay readability ${name} operator torso`, [0.28, 0.54, 0.14], [x + side * 0.18, 1.22, z + 0.34], suitMat);
    torso.rotation.y = rot;
    cylinder(`verified side operator bay readability ${name} operator helmet`, 0.19, 0.18, 0.21, 14, [x + side * 0.18, 1.55, z + 0.29], suitMat);
    const visor = box(`verified side operator bay readability ${name} operator cyan visor read`, [0.28, 0.07, 0.045], [x + side * 0.18, 1.57, z + 0.16], visorMat);
    visor.rotation.y = rot;
    const shoulder = box(`verified side operator bay readability ${name} helmet shoulder rim`, [0.64, 0.045, 0.045], [x + side * 0.16, 1.38, z + 0.12], rimMat);
    shoulder.rotation.y = rot;
  });

  box('verified side operator bay readability left warm workpool floor edge', [3.5, 0.035, 0.045], [-6.55, 0.34, 3.72], amberScreen);
  box('verified side operator bay readability right cool workpool floor edge', [3.5, 0.035, 0.045], [6.55, 0.34, 3.72], cyanScreen);
  addLight('point', COLORS.amber, 1.55, [-6.55, 2.1, 3.25], 5.4);
  addLight('point', COLORS.cyan, 1.55, [6.55, 2.1, 3.25], 5.4);
}


function buildVerifiedSideBayRoleProps() {
  const armMat = mat(0x273044, { roughness: 0.38, metalness: 0.82 });
  const darkJoint = mat(0x070b13, { roughness: 0.68, metalness: 0.42 });
  const amberWork = mat(0xffbd66, { emissive: COLORS.amber, emissiveIntensity: 0.52, transparent: true, opacity: 0.38, roughness: 0.1 });
  const cyanWork = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.42, transparent: true, opacity: 0.3, roughness: 0.08 });
  const greenWork = mat(COLORS.green, { emissive: COLORS.green, emissiveIntensity: 0.42, transparent: true, opacity: 0.3, roughness: 0.1 });
  const cargoMat = mat(0x151e2d, { roughness: 0.5, metalness: 0.58 });

  // Left bay: fabrication/assembly identity, one large readable robot-arm silhouette.
  box('verified side bay role props left fabrication overhead gantry beam', [3.6, 0.16, 0.18], [-6.7, 2.28, 3.78], armMat);
  const upperArm = box('verified side bay role props left fabrication angled robot upper arm', [0.22, 0.18, 1.55], [-7.05, 1.82, 3.12], armMat);
  upperArm.rotation.x = THREE.MathUtils.degToRad(-26);
  upperArm.rotation.y = THREE.MathUtils.degToRad(-10);
  const lowerArm = box('verified side bay role props left fabrication angled robot lower arm', [0.18, 0.16, 1.18], [-6.48, 1.38, 2.62], armMat);
  lowerArm.rotation.x = THREE.MathUtils.degToRad(34);
  lowerArm.rotation.y = THREE.MathUtils.degToRad(16);
  cylinder('verified side bay role props left fabrication shoulder joint', 0.18, 0.18, 0.16, 16, [-7.42, 1.96, 3.42], darkJoint).rotation.z = Math.PI / 2;
  cylinder('verified side bay role props left fabrication elbow joint', 0.14, 0.14, 0.14, 14, [-6.72, 1.52, 2.86], darkJoint).rotation.z = Math.PI / 2;
  box('verified side bay role props left fabrication clamp nozzle', [0.42, 0.16, 0.16], [-6.05, 1.2, 2.22], amberWork);
  box('verified side bay role props left half-built module under arm', [1.22, 0.38, 0.68], [-6.35, 0.82, 2.12], cargoMat);
  box('verified side bay role props left fabrication cyan scan line', [1.42, 0.045, 0.04], [-6.35, 1.14, 2.06], cyanWork);
  box('verified side bay role props left fabrication amber spark pool', [0.46, 0.045, 0.04], [-5.78, 1.08, 2.08], amberWork);

  // Right bay: deploy/logistics identity, one large outbound cradle/pod silhouette.
  box('verified side bay role props right deploy cradle base', [2.9, 0.22, 1.14], [6.85, 0.74, 2.45], cargoMat);
  box('verified side bay role props right deploy left guide rail', [0.12, 0.18, 2.42], [5.76, 0.96, 2.05], armMat);
  box('verified side bay role props right deploy right guide rail', [0.12, 0.18, 2.42], [7.94, 0.96, 2.05], armMat);
  const pod = box('verified side bay role props right deploy cargo pod in cradle', [1.42, 0.58, 0.74], [6.85, 1.16, 2.26], cargoMat);
  pod.rotation.z = THREE.MathUtils.degToRad(-2);
  box('verified side bay role props right deploy pod cyan status window', [0.72, 0.08, 0.045], [6.85, 1.28, 1.86], cyanWork);
  box('verified side bay role props right deploy green ready strip', [2.22, 0.05, 0.045], [6.85, 1.02, 1.22], greenWork);
  box('verified side bay role props right deploy rear launch rail glow', [2.8, 0.04, 0.04], [6.85, 0.78, 0.72], greenWork);
  box('verified side bay role props right deploy amber hazard beacon', [0.32, 0.08, 0.04], [5.56, 1.34, 2.68], amberWork);
  // Bolder readable overlays: one unmistakable fabrication arm, one unmistakable outbound cradle.
  const visibleArm = box('verified side bay role props readable left fabrication vertical robot mast', [0.26, 1.42, 0.2], [-5.42, 1.66, 2.62], armMat);
  visibleArm.rotation.z = THREE.MathUtils.degToRad(-12);
  const visibleClaw = box('verified side bay role props readable left fabrication open clamp silhouette', [0.82, 0.2, 0.18], [-5.08, 1.05, 2.1], amberWork);
  visibleClaw.rotation.z = THREE.MathUtils.degToRad(-8);
  box('verified side bay role props readable left fabrication workpiece bright top', [1.44, 0.08, 0.56], [-5.74, 0.92, 1.92], cyanWork);
  box('verified side bay role props readable right deploy outbound cradle tall backplate', [1.72, 0.92, 0.18], [5.36, 1.28, 2.02], cargoMat);
  box('verified side bay role props readable right deploy twin green launch rails', [2.72, 0.08, 0.08], [5.68, 1.05, 1.35], greenWork);
  box('verified side bay role props readable right deploy pod bright nose', [0.76, 0.22, 0.08], [5.28, 1.42, 1.78], cyanWork);
  addLight('point', COLORS.amber, 1.2, [-5.4, 1.65, 2.2], 3.8);
  addLight('point', COLORS.green, 1.15, [5.55, 1.65, 1.9], 3.8);
}

function buildVerifiedOuterBayActivityReadability() {
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.48, transparent: true, opacity: 0.3, roughness: 0.08 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.44, transparent: true, opacity: 0.28, roughness: 0.12 });
  const green = mat(COLORS.green, { emissive: COLORS.green, emissiveIntensity: 0.4, transparent: true, opacity: 0.27, roughness: 0.12 });
  const violet = mat(COLORS.violet, { emissive: COLORS.violet, emissiveIntensity: 0.38, transparent: true, opacity: 0.26, roughness: 0.12 });
  const coral = mat(COLORS.coral, { emissive: COLORS.coral, emissiveIntensity: 0.4, transparent: true, opacity: 0.27, roughness: 0.12 });
  const graphite = mat(0x141c2c, { roughness: 0.42, metalness: 0.68 });
  const blackGlass = mat(0x030915, { roughness: 0.12, metalness: 0.34, transparent: true, opacity: 0.78, emissive: 0x061828, emissiveIntensity: 0.08 });
  const suit = mat(0x9aa6b8, { roughness: 0.44, metalness: 0.38, emissive: 0x1b2738, emissiveIntensity: 0.06 });
  const shadow = mat(0x02040a, { roughness: 0.96, metalness: 0.06 });

  const bayData = [
    ['build fabrication', -8.35, 2.08, amber, -10, 1],
    ['review containment', 8.35, 2.08, coral, 10, -1],
    ['observatory signal', -8.35, -5.76, violet, -10, 1],
    ['deploy dock', 8.35, -5.76, green, 10, -1]
  ];

  bayData.forEach(([name, x, z, accent, yaw, side], index) => {
    const deck = box(`verified outer bay activity ${name} readable workpool`, [4.9, 0.032, 1.55], [x, 1.18, z], accent);
    deck.rotation.y = THREE.MathUtils.degToRad(yaw * 0.32);
    const rearRail = box(`verified outer bay activity ${name} rear console rail`, [4.2, 0.08, 0.08], [x, 1.72, z - 0.84], accent);
    rearRail.rotation.y = deck.rotation.y;
    const frontRail = box(`verified outer bay activity ${name} front hazard lane`, [3.8, 0.04, 0.055], [x, 1.24, z + 0.9], index % 2 ? cyan : amber);
    frontRail.rotation.y = deck.rotation.y;

    const consoleA = box(`verified outer bay activity ${name} left live console island`, [0.94, 0.38, 0.58], [x - 1.05 * side, 1.42, z - 0.1], blackGlass);
    consoleA.rotation.y = THREE.MathUtils.degToRad(yaw + 7 * side);
    const consoleB = box(`verified outer bay activity ${name} right live console island`, [0.9, 0.34, 0.54], [x + 1.18 * side, 1.4, z + 0.28], blackGlass);
    consoleB.rotation.y = THREE.MathUtils.degToRad(yaw - 9 * side);
    const screenA = box(`verified outer bay activity ${name} console readable screen A`, [0.7, 0.36, 0.045], [x - 1.05 * side, 1.76, z - 0.42], accent);
    screenA.rotation.y = consoleA.rotation.y;
    const screenB = box(`verified outer bay activity ${name} console readable screen B`, [0.62, 0.32, 0.045], [x + 1.18 * side, 1.7, z + 0.0], index % 2 ? cyan : amber);
    screenB.rotation.y = consoleB.rotation.y;

    const operators = [
      [x - 1.62 * side, z + 0.14, 0.24],
      [x - 0.25 * side, z - 0.54, 0.2],
      [x + 1.72 * side, z + 0.56, 0.22]
    ];
    operators.forEach(([opX, opZ, width], opIndex) => {
      const torso = box(`verified outer bay activity ${name} operator torso ${opIndex + 1}`, [width, 0.45, 0.16], [opX, 1.66, opZ], suit);
      torso.rotation.y = THREE.MathUtils.degToRad(yaw + (opIndex - 1) * 12);
      const helmet = sphere(`verified outer bay activity ${name} operator helmet ${opIndex + 1}`, 0.115, 10, [opX, 1.96, opZ], suit);
      helmet.scale.y = 0.92;
      const visor = box(`verified outer bay activity ${name} operator visor/rim ${opIndex + 1}`, [0.22, 0.032, 0.032], [opX, 2.05, opZ + 0.1], accent);
      visor.rotation.y = torso.rotation.y;
    });

    const cartX = x + 2.05 * side;
    const cart = box(`verified outer bay activity ${name} cargo cart silhouette`, [0.8, 0.26, 0.48], [cartX, 1.34, z - 0.62], graphite);
    cart.rotation.y = THREE.MathUtils.degToRad(yaw - 14 * side);
    const cargo = box(`verified outer bay activity ${name} glowing cargo/status load`, [0.48, 0.26, 0.32], [cartX, 1.58, z - 0.62], index % 2 ? cyan : amber);
    cargo.rotation.y = cart.rotation.y;
    const arm = box(`verified outer bay activity ${name} robotic service arm`, [0.12, 0.96, 0.1], [x - 2.08 * side, 1.92, z - 0.72], graphite);
    arm.rotation.z = THREE.MathUtils.degToRad(12 * side);
    const claw = box(`verified outer bay activity ${name} robotic arm lit toolhead`, [0.5, 0.09, 0.08], [x - 2.24 * side, 1.42, z - 0.42], accent);
    claw.rotation.y = THREE.MathUtils.degToRad(yaw);

    const plaque = box(`verified outer bay activity ${name} bay identity plaque`, [1.15, 0.08, 0.045], [x, 2.82, z - 1.22], accent);
    plaque.rotation.y = deck.rotation.y;
    const shadowCut = box(`verified outer bay activity ${name} dark backdrop separation`, [4.6, 0.5, 0.045], [x, 2.2, z - 1.18], shadow);
    shadowCut.rotation.y = deck.rotation.y;
    const bayGlow = box(`verified outer bay activity ${name} large readable status wall glow`, [3.65, 0.5, 0.036], [x, 2.28, z - 0.98], accent);
    bayGlow.rotation.y = deck.rotation.y;
    const topStatus = box(`verified outer bay activity ${name} upper task queue light bar`, [2.9, 0.065, 0.034], [x, 2.58, z - 0.9], index % 2 ? cyan : amber);
    topStatus.rotation.y = deck.rotation.y;
    const lowerStatus = box(`verified outer bay activity ${name} lower workcell telemetry strip`, [3.25, 0.045, 0.034], [x, 2.03, z - 0.82], accent);
    lowerStatus.rotation.y = deck.rotation.y;
  });

  addLight('point', COLORS.amber, 2.4, [-8.4, 2.3, 2.1], 5.6);
  addLight('point', COLORS.coral, 2.0, [8.4, 2.3, 2.1], 5.2);
  addLight('point', COLORS.violet, 1.8, [-8.4, 2.3, -5.8], 5.2);
  addLight('point', COLORS.green, 1.8, [8.4, 2.3, -5.8], 5.2);
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


function buildVerifiedHoloGlobeCommandScale() {
  const command = new THREE.Group();
  command.position.set(0, 0.0, 0.38);
  root.add(command);

  const holoGlass = mat(0x8ff7ff, { emissive: COLORS.cyan, emissiveIntensity: 1.56, transparent: true, opacity: 0.34, roughness: 0.03 });
  const holoCore = mat(0xd7fdff, { emissive: COLORS.cyan, emissiveIntensity: 1.72, transparent: true, opacity: 0.48, roughness: 0.03 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.82, transparent: true, opacity: 0.44, roughness: 0.06 });
  const cyanSoft = mat(0x7fc7ff, { emissive: 0x45b7ff, emissiveIntensity: 0.46, transparent: true, opacity: 0.24, roughness: 0.08 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.5, transparent: true, opacity: 0.3, roughness: 0.12 });
  const blackGlass = mat(0x030914, { roughness: 0.12, metalness: 0.34, transparent: true, opacity: 0.78, emissive: 0x04192a, emissiveIntensity: 0.1 });
  const suit = mat(0x8f9bb0, { roughness: 0.42, metalness: 0.42, emissive: 0x17243a, emissiveIntensity: 0.08 });
  // Screenshot-driven hero correction: the north-star board needs a commanding blue globe, not a tiny table prop.
  const outerGlobe = sphere('verified holo globe command scale translucent outer mission sphere', 1.46, 32, [0, 2.76, 0], holoGlass, command);
  outerGlobe.scale.set(1.1, 0.84, 1.16);
  const coreGlobe = sphere('verified holo globe command scale bright inner tactical core', 0.78, 24, [0, 2.76, 0], holoCore, command);
  coreGlobe.scale.set(1.0, 0.78, 1.05);
  const beam = cylinder('verified holo globe command scale readable vertical scan beam', 0.84, 1.38, 3.22, 36, [0, 2.02, 0], cyanSoft, command);
  beam.rotation.y = 0.16;
  const equator = torus('verified holo globe command scale bright equator orbit', 1.66, 0.026, 8, 72, [0, 2.76, 0], cyan, command);
  equator.rotation.x = Math.PI / 2;
  const polar = torus('verified holo globe command scale vertical polar orbit', 1.34, 0.022, 8, 64, [0, 2.76, 0], cyanSoft, command);
  polar.rotation.y = Math.PI / 2;
  polar.rotation.z = 0.28;
  const amberOrbit = torus('verified holo globe command scale amber transfer orbit', 1.9, 0.018, 8, 72, [0, 2.76, 0], amber, command);
  amberOrbit.rotation.x = Math.PI / 2.18;
  amberOrbit.rotation.z = -0.42;

  const tableOuter = torus('verified holo globe command scale thick cyan table hero rim', 2.76, 0.038, 8, 80, [0, 1.22, 0], cyan, command);
  tableOuter.rotation.x = Math.PI / 2;
  const tableInner = torus('verified holo globe command scale amber pit command ring', 2.2, 0.026, 8, 72, [0, 1.25, 0], amber, command);
  tableInner.rotation.x = Math.PI / 2;
  cylinder('verified holo globe command scale blue floor bounce disk', 3.05, 3.05, 0.035, 48, [0, 0.88, 0], cyanSoft, command);

  const consoleStations = [
    ['front center', 0, 3.28, 0, 1.66, amber],
    ['front left', -1.94, 2.72, -24, 1.28, cyan],
    ['front right', 1.94, 2.72, 24, 1.28, cyan],
    ['left command arc', -3.18, 0.72, -78, 1.12, amber],
    ['right command arc', 3.18, 0.72, 78, 1.12, amber],
    ['rear watch', 0, -2.72, 180, 1.36, cyanSoft]
  ];
  consoleStations.forEach(([name, x, z, yaw, width, accent], index) => {
    const base = box(`verified holo globe command scale ${name} operator console wedge`, [width, 0.34, 0.54], [x, 1.08, z], blackGlass, command);
    base.rotation.y = THREE.MathUtils.degToRad(yaw);
    const screen = box(`verified holo globe command scale ${name} readable blue reader panel`, [width * 0.78, 0.42, 0.045], [x, 1.42, z - 0.2], accent, command);
    screen.rotation.y = base.rotation.y;
    const body = box(`verified holo globe command scale ${name} seated operator torso`, [0.22, 0.48, 0.18], [x * 0.95, 1.48, z + (z > 0 ? 0.46 : -0.42)], suit, command);
    body.rotation.y = base.rotation.y;
    const head = sphere(`verified holo globe command scale ${name} operator helmet highlight`, 0.13, 12, [x * 0.95, 1.82, z + (z > 0 ? 0.46 : -0.42)], suit, command);
    head.scale.y = 0.92;
    const rim = box(`verified holo globe command scale ${name} operator cyan rim cue`, [0.28, 0.035, 0.035], [x * 0.95, 1.97, z + (z > 0 ? 0.58 : -0.54)], index % 2 ? amber : cyan, command);
    rim.rotation.y = base.rotation.y;
  });

  addLight('point', COLORS.cyan, 5.6, [0, 2.75, 0.38], 8.8);
}


function buildVerifiedReadableWorkstationSilhouettes() {
  const blackGlass = mat(0x030814, { roughness: 0.14, metalness: 0.38, transparent: true, opacity: 0.84, emissive: 0x061523, emissiveIntensity: 0.08 });
  const graphite = mat(0x151d2d, { roughness: 0.38, metalness: 0.72 });
  const suit = mat(0xa5b0c2, { roughness: 0.44, metalness: 0.42, emissive: 0x172338, emissiveIntensity: 0.08 });
  const shadow = mat(0x02040a, { roughness: 0.96, metalness: 0.04, transparent: true, opacity: 0.72 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.46, transparent: true, opacity: 0.24, roughness: 0.08 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.3, transparent: true, opacity: 0.18, roughness: 0.12 });

  // Fewer, larger operators: readable at default camera, not another layer of tiny specks.
  const pods = [
    ['foreground commander', 0, 4.18, 0, 2.15, amber, 'standing'],
    ['front left navigator', -2.95, 3.24, -24, 1.7, cyan, 'seated'],
    ['front right quartermaster', 2.95, 3.24, 24, 1.7, cyan, 'seated'],
    ['rear table watch', 0, -3.05, 180, 1.7, cyan, 'seated']
  ];

  pods.forEach(([name, x, z, yaw, width, accent, pose], index) => {
    const rot = THREE.MathUtils.degToRad(yaw);
    const console = box(`verified readable workstation silhouette ${name} large console pod`, [width, 0.46, 0.72], [x, 1.2, z], blackGlass);
    console.rotation.y = rot;
    const screen = box(`verified readable workstation silhouette ${name} facing readable screen`, [width * 0.78, 0.54, 0.052], [x, 1.62, z - 0.28], accent);
    screen.rotation.y = rot;
    const hood = box(`verified readable workstation silhouette ${name} dark screen hood`, [width * 0.9, 0.16, 0.08], [x, 1.88, z - 0.34], graphite);
    hood.rotation.y = rot;
    const chair = box(`verified readable workstation silhouette ${name} chair/readable base`, [0.42, 0.28, 0.42], [x, 1.16, z + (z > 0 ? 0.52 : -0.5)], graphite);
    chair.rotation.y = rot;
    const torsoHeight = pose === 'standing' ? 0.82 : 0.62;
    const torsoY = pose === 'standing' ? 1.86 : 1.68;
    const torso = box(`verified readable workstation silhouette ${name} large operator torso`, [0.4, torsoHeight, 0.26], [x, torsoY, z + (z > 0 ? 0.6 : -0.55)], suit);
    torso.rotation.y = rot;
    const head = sphere(`verified readable workstation silhouette ${name} readable helmet`, 0.19, 12, [x, torsoY + torsoHeight * 0.55, z + (z > 0 ? 0.6 : -0.55)], suit);
    head.scale.y = 0.92;
    const visor = box(`verified readable workstation silhouette ${name} bright visor slash`, [0.36, 0.045, 0.035], [x, torsoY + torsoHeight * 0.7, z + (z > 0 ? 0.72 : -0.67)], index % 2 ? cyan : amber);
    visor.rotation.y = rot;
    const arm = box(`verified readable workstation silhouette ${name} arm-to-console gesture`, [0.5, 0.09, 0.08], [x + (index % 2 ? 0.22 : -0.22), torsoY - 0.08, z + (z > 0 ? 0.28 : -0.24)], suit);
    arm.rotation.y = rot + THREE.MathUtils.degToRad(index % 2 ? 16 : -16);
    const contact = box(`verified readable workstation silhouette ${name} floor contact shadow`, [width * 1.25, 0.026, 0.82], [x, 0.99, z + (z > 0 ? 0.18 : -0.18)], shadow);
    contact.rotation.y = rot;
    const rim = box(`verified readable workstation silhouette ${name} warm/cool operator rim`, [0.5, 0.045, 0.04], [x, torsoY + torsoHeight * 0.25, z + (z > 0 ? 0.78 : -0.74)], accent);
    rim.rotation.y = rot;
  });

  addLight('point', COLORS.cyan, 1.6, [0, 2.2, 3.6], 4.8);
  addLight('point', COLORS.amber, 0.95, [-3.4, 2.0, 2.2], 3.8);
  addLight('point', COLORS.amber, 0.95, [3.4, 2.0, 2.2], 3.8);
}


function buildVerifiedCenterValueSeparation() {
  const centerCyan = mat(0xaaf8ff, { emissive: COLORS.cyan, emissiveIntensity: 1.05, transparent: true, opacity: 0.42, roughness: 0.04 });
  const centerWhite = mat(0xf1feff, { emissive: 0xbdfcff, emissiveIntensity: 0.86, transparent: true, opacity: 0.34, roughness: 0.05 });
  const amberLow = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.22, transparent: true, opacity: 0.14, roughness: 0.12 });
  const dimMask = mat(0x01030a, { roughness: 1.0, metalness: 0.0, transparent: true, opacity: 0.58 });
  const coolRim = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.28, transparent: true, opacity: 0.16, roughness: 0.08 });
  const darkGlass = mat(0x020711, { roughness: 0.72, metalness: 0.18, transparent: true, opacity: 0.68 });

  // Screenshot-driven value tier: foreground crew supports the table; the table owns the brightest clean shape.
  const heroLift = cylinder('verified center value separation clean cyan table lift disk', 3.28, 3.28, 0.035, 48, [0, 1.08, 0.38], centerCyan);
  heroLift.rotation.y = 0.08;
  const heroCore = cylinder('verified center value separation white-blue emitter accent', 0.46, 0.58, 0.055, 32, [0, 1.42, 0.38], centerWhite);
  heroCore.rotation.y = 0.16;
  const outerGuide = torus('verified center value separation crisp outer command ring', 3.18, 0.034, 8, 80, [0, 1.33, 0.38], centerCyan);
  outerGuide.rotation.x = Math.PI / 2;
  const innerGuide = torus('verified center value separation warm inner crew boundary ring', 2.42, 0.018, 8, 72, [0, 1.34, 0.38], amberLow);
  innerGuide.rotation.x = Math.PI / 2;

  const dimmers = [
    ['foreground commander pod value mask', 0, 4.22, 2.58, 0],
    ['front left pod value mask', -2.95, 3.42, 1.96, -24],
    ['front right pod value mask', 2.95, 3.42, 1.96, 24]
  ];
  dimmers.forEach(([name, x, z, width, yaw]) => {
    const mask = box(`verified center value separation ${name}`, [width, 0.34, 0.72], [x, 1.54, z], dimMask);
    mask.rotation.y = THREE.MathUtils.degToRad(yaw);
    const topBaffle = box(`verified center value separation ${name} dark top baffle`, [width * 0.9, 0.08, 0.62], [x, 1.9, z - 0.16], darkGlass);
    topBaffle.rotation.y = mask.rotation.y;
    const inwardRim = box(`verified center value separation ${name} thin inward cyan rim`, [width * 0.78, 0.035, 0.035], [x, 1.7, z - 0.48], coolRim);
    inwardRim.rotation.y = mask.rotation.y;
  });

  box('verified center value separation bright table front vertical read', [3.2, 0.08, 0.045], [0, 1.46, 2.08], centerWhite);
  box('verified center value separation central floor cyan spill front', [5.4, 0.035, 0.04], [0, 1.02, 2.3], centerCyan);
  box('verified center value separation central floor cyan spill rear', [4.2, 0.03, 0.04], [0, 1.02, -1.72], centerCyan);
  box('verified center value separation left crew silhouette edge only', [0.66, 0.04, 0.035], [-2.96, 2.02, 2.98], coolRim);
  box('verified center value separation right crew silhouette edge only', [0.66, 0.04, 0.035], [2.96, 2.02, 2.98], coolRim);

  addLight('point', COLORS.cyan, 4.4, [0, 1.82, 0.38], 5.8);
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

function buildVerifiedUpperBandSidePlatformReadability() {
  const ribMat = mat(0x20283a, { roughness: 0.42, metalness: 0.72 });
  const panelMat = mat(0x0b1220, { roughness: 0.68, metalness: 0.42 });
  const warmTrim = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.34, transparent: true, opacity: 0.2, roughness: 0.16 });
  const coolTrim = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.32, transparent: true, opacity: 0.18, roughness: 0.12 });
  const violetTrim = mat(COLORS.violet, { emissive: COLORS.violet, emissiveIntensity: 0.22, transparent: true, opacity: 0.14, roughness: 0.16 });
  const platformLip = mat(0x43516c, { roughness: 0.36, metalness: 0.78 });
  const darkBracket = mat(0x070b13, { roughness: 0.74, metalness: 0.28 });

  // Screenshot-driven fix: break the upper black stripe into readable service infrastructure.
  const overheadSegments = [
    [-8.8, 1.55, 2.4, warmTrim],
    [-4.4, -0.8, 2.9, coolTrim],
    [0, 1.05, 3.4, warmTrim],
    [4.4, -0.8, 2.9, coolTrim],
    [8.8, 1.55, 2.4, warmTrim]
  ];
  overheadSegments.forEach(([x, z, length, lightMat], index) => {
    const rib = box(`verified upper band service divider ${index + 1}`, [0.16, 0.28, length], [x, 4.86, z], ribMat);
    rib.rotation.y = THREE.MathUtils.degToRad(index % 2 ? -8 : 8);
    const seam = box(`verified upper band inset practical ${index + 1}`, [0.045, 0.035, length - 0.42], [x + (index - 2) * 0.035, 4.66, z], lightMat);
    seam.rotation.y = rib.rotation.y;
    const panel = box(`verified upper band dark recessed service panel ${index + 1}`, [1.45, 0.055, 0.2], [x, 4.62, z + 1.18], panelMat);
    panel.rotation.y = THREE.MathUtils.degToRad(index % 2 ? 4 : -4);
  });
  box('verified upper command crown interrupted amber datum', [5.4, 0.035, 0.045], [-4.8, 4.72, 2.42], warmTrim);
  box('verified upper command crown interrupted cyan datum', [5.4, 0.035, 0.045], [4.8, 4.72, 2.42], coolTrim);

  // Side decks should read as inhabited work platforms, not dark walls. Keep them secondary to the table.
  const sidePlatforms = [
    ['left', -8.05, warmTrim, coolTrim, -1],
    ['right', 8.05, coolTrim, violetTrim, 1]
  ];
  sidePlatforms.forEach(([side, x, primary, secondary, sign]) => {
    box(`verified ${side} platform front luminous lip`, [4.9, 0.045, 0.055], [x, 0.82, 3.12], primary);
    box(`verified ${side} platform rear luminous lip`, [4.4, 0.045, 0.055], [x, 0.86, -5.08], secondary);
    box(`verified ${side} platform inner catwalk edge`, [0.055, 0.04, 6.2], [x - sign * 2.55, 0.84, -1.0], primary);
    box(`verified ${side} platform outer rail silhouette`, [0.08, 0.22, 5.6], [x + sign * 2.32, 0.98, -1.18], platformLip);
    [-3.65, -1.65, 0.35, 2.35].forEach((z, index) => {
      box(`verified ${side} platform vertical support ${index + 1}`, [0.12, 0.62, 0.1], [x + sign * 2.18, 0.72, z], darkBracket);
      box(`verified ${side} platform console pinlight ${index + 1}`, [0.34, 0.035, 0.04], [x - sign * 1.08, 1.18, z], index % 2 ? secondary : primary);
    });
  });
}

function buildVerifiedRearHangarDepthSeparation() {
  const farGlass = mat(0x071a2d, { emissive: 0x0b3552, emissiveIntensity: 0.2, transparent: true, opacity: 0.3, roughness: 0.18, metalness: 0.12 });
  const deepHaze = mat(0x5fb9ff, { emissive: 0x2b86c7, emissiveIntensity: 0.22, transparent: true, opacity: 0.16, roughness: 0.04 });
  const frame = mat(0x506078, { roughness: 0.34, metalness: 0.84 });
  const darkBay = mat(0x030711, { roughness: 0.9, metalness: 0.12 });
  const ship = mat(0x101827, { roughness: 0.52, metalness: 0.62 });
  const cargo = mat(0x1e2a3f, { roughness: 0.56, metalness: 0.46 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.42, transparent: true, opacity: 0.24, roughness: 0.12 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.4, transparent: true, opacity: 0.22, roughness: 0.08 });
  const dimBlue = mat(0x77bfff, { emissive: 0x3a8dff, emissiveIntensity: 0.18, transparent: true, opacity: 0.12, roughness: 0.12 });

  // Verification pass: separate foreground command pit, mid catwalk, and deep rear hangar volume.
  box('verified rear hangar far recessed blue glass volume', [13.4, 1.72, 0.055], [0, 3.06, -11.34], farGlass);
  box('verified rear hangar deep atmospheric haze layer', [12.2, 0.86, 0.045], [0, 2.94, -11.18], deepHaze);
  box('verified rear hangar far back wall shadow', [11.6, 0.42, 0.05], [0, 2.52, -11.1], darkBay);
  box('verified rear hangar upper aperture cold rim', [14.4, 0.11, 0.08], [0, 3.86, -10.92], frame);
  box('verified rear hangar lower aperture cold rim', [14.4, 0.1, 0.08], [0, 2.08, -10.92], frame);
  box('verified rear hangar left depth jamb', [0.12, 1.76, 0.08], [-7.24, 2.96, -10.9], frame);
  box('verified rear hangar right depth jamb', [0.12, 1.76, 0.08], [7.24, 2.96, -10.9], frame);
  box('verified rear hangar mid occlusion catwalk shadow', [12.6, 0.16, 0.06], [0, 2.34, -9.78], darkBay);

  const runwayStrips = [
    [-5.6, 2.35, -10.72, -8],
    [-2.75, 2.3, -10.64, -3],
    [2.75, 2.3, -10.64, 3],
    [5.6, 2.35, -10.72, 8]
  ];
  runwayStrips.forEach(([x, y, z, yaw], index) => {
    const strip = box(`verified rear hangar receding runway strip ${index + 1}`, [2.2, 0.035, 0.04], [x, y, z], index % 2 ? amber : cyan);
    strip.rotation.z = THREE.MathUtils.degToRad(yaw);
  });

  const craftBody = box('verified rear hangar parked utility craft body', [2.45, 0.34, 0.07], [-2.35, 3.1, -10.62], ship);
  craftBody.rotation.z = THREE.MathUtils.degToRad(-2);
  box('verified rear hangar utility craft cyan rim', [1.45, 0.035, 0.04], [-3.05, 3.34, -10.57], cyan);
  box('verified rear hangar utility craft nose block', [0.46, 0.2, 0.055], [-0.98, 3.08, -10.56], ship);
  box('verified rear hangar left cargo pod silhouette', [0.92, 0.44, 0.06], [2.22, 2.74, -10.58], cargo);
  box('verified rear hangar right cargo pod silhouette', [0.76, 0.36, 0.06], [3.4, 2.84, -10.56], cargo);
  box('verified rear hangar overhead docking rail left', [4.2, 0.065, 0.045], [-4.2, 3.58, -10.5], dimBlue);
  box('verified rear hangar overhead docking rail right', [4.2, 0.065, 0.045], [4.2, 3.58, -10.5], dimBlue);
  box('verified rear hangar tiny amber maintenance crew left', [0.14, 0.08, 0.04], [-5.9, 2.58, -10.46], amber);
  box('verified rear hangar tiny cyan maintenance crew right', [0.14, 0.08, 0.04], [5.85, 2.62, -10.46], cyan);
  box('verified rear hangar center docking beacon scale cue', [0.22, 0.045, 0.04], [0, 2.58, -10.44], amber);
}

function buildVerifiedFabricationDeploySeparation() {
  const laneCyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.42, transparent: true, opacity: 0.24, roughness: 0.08 });
  const laneAmber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.42, transparent: true, opacity: 0.24, roughness: 0.1 });
  const laneGreen = mat(COLORS.green, { emissive: COLORS.green, emissiveIntensity: 0.34, transparent: true, opacity: 0.2, roughness: 0.12 });
  const bayRim = mat(0x8fc7ff, { emissive: 0x4aa8ff, emissiveIntensity: 0.26, transparent: true, opacity: 0.18, roughness: 0.12 });
  const warmRim = mat(0xffbd70, { emissive: COLORS.amber, emissiveIntensity: 0.3, transparent: true, opacity: 0.2, roughness: 0.12 });
  const sledMat = mat(0x18243a, { roughness: 0.5, metalness: 0.58 });
  const moduleMat = mat(0x0d1422, { roughness: 0.72, metalness: 0.24 });

  // Screenshot-driven fix: make rear fabrication/deploy read as active infrastructure, not a dark wall.
  const guideLanes = [
    ['left fabrication guide lane', -4.4, -1.18, -8, 4.8, laneAmber],
    ['right deploy guide lane', 4.4, -1.18, 8, 4.8, laneGreen],
    ['rear assembly centerline guide', 0, -4.72, 0, 5.6, laneCyan],
    ['left rear bay return guide', -6.6, -5.92, -4, 3.4, laneCyan],
    ['right rear bay return guide', 6.6, -5.92, 4, 3.4, laneGreen]
  ];
  guideLanes.forEach(([name, x, z, yaw, length, material]) => {
    const strip = box(`verified fabrication deploy ${name}`, [length, 0.026, 0.04], [x, 0.66, z], material);
    strip.rotation.y = THREE.MathUtils.degToRad(yaw);
  });

  const bayEdges = [
    ['build bay upper fabrication rim', -8.35, 3.28, 2.52, warmRim],
    ['deploy bay upper logistics rim', 8.35, 3.28, -5.52, laneGreen],
    ['observatory bay cool service rim', -8.35, 3.28, -5.52, bayRim],
    ['rear assembly gantry edge rim', 0, 3.08, -7.22, laneAmber],
    ['rear lower deck cyan separation rim', 0, 1.32, -7.82, laneCyan]
  ];
  bayEdges.forEach(([name, x, y, z, material]) => {
    box(`verified fabrication deploy ${name}`, [4.9, 0.04, 0.045], [x, y, z], material);
  });

  const sleds = [
    ['left cargo sled silhouette', -4.72, 0.82, -3.34, -10, laneAmber],
    ['center module carrier silhouette', 0.18, 0.84, -5.72, 0, laneCyan],
    ['right deploy sled silhouette', 4.72, 0.82, -3.34, 10, laneGreen]
  ];
  sleds.forEach(([name, x, y, z, yaw, accent]) => {
    const sled = box(`verified fabrication deploy ${name}`, [0.72, 0.22, 0.42], [x, y, z], sledMat);
    sled.rotation.y = THREE.MathUtils.degToRad(yaw);
    const module = box(`verified fabrication deploy ${name} module load`, [0.46, 0.28, 0.3], [x, y + 0.22, z], moduleMat);
    module.rotation.y = sled.rotation.y;
    box(`verified fabrication deploy ${name} status slit`, [0.5, 0.035, 0.035], [x, y + 0.38, z + 0.22], accent);
  });
}

function buildVerifiedRearServiceDeckReveal() {
  const coolFill = mat(0x22344d, { emissive: 0x102f52, emissiveIntensity: 0.18, transparent: true, opacity: 0.16, roughness: 0.38, metalness: 0.22 });
  const coolRim = mat(0x8fc7ff, { emissive: 0x4aa8ff, emissiveIntensity: 0.34, transparent: true, opacity: 0.2, roughness: 0.1 });
  const cyanSoft = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.28, transparent: true, opacity: 0.16, roughness: 0.08 });
  const amberSoft = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.24, transparent: true, opacity: 0.14, roughness: 0.12 });
  const ribMat = mat(0x26344a, { roughness: 0.5, metalness: 0.62 });
  const darkModule = mat(0x0b1220, { roughness: 0.72, metalness: 0.28 });

  // Reveal structure behind the command ring without competing with the central hologram.
  box('verified rear service deck cool fill left', [5.8, 0.46, 0.045], [-5.9, 2.78, -9.44], coolFill);
  box('verified rear service deck cool fill right', [5.8, 0.46, 0.045], [5.9, 2.78, -9.44], coolFill);
  box('verified rear service deck bridge front seam', [12.4, 0.035, 0.04], [0, 2.42, -8.24], coolRim);
  box('verified rear service deck mid catwalk seam', [10.6, 0.03, 0.04], [0, 2.82, -6.52], cyanSoft);
  box('verified rear service deck far base seam', [13.2, 0.03, 0.04], [0, 2.08, -10.04], amberSoft);
  box('verified rear service left bay floor cool lift', [3.8, 0.026, 0.035], [-7.08, 1.72, -6.8], cyanSoft);
  box('verified rear service right bay floor cool lift', [3.8, 0.026, 0.035], [7.08, 1.72, -6.8], coolRim);

  [-6.2, -3.1, 0, 3.1, 6.2].forEach((x, index) => {
    box(`verified rear service vertical shaft rib ${index + 1}`, [0.12, 1.34, 0.055], [x, 3.02, -9.62], ribMat);
    box(`verified rear service shaft rib cool edge ${index + 1}`, [0.035, 1.04, 0.035], [x + 0.12, 3.0, -9.56], index % 2 ? cyanSoft : coolRim);
  });

  const modules = [
    ['left fabrication stacked module silhouette', -5.05, 2.36, -8.92, 0.96, 0.5, amberSoft],
    ['center rear gantry module silhouette', 0, 2.5, -9.18, 1.36, 0.42, cyanSoft],
    ['right deploy stacked module silhouette', 5.05, 2.36, -8.92, 0.96, 0.5, coolRim],
    ['upper left crane carriage silhouette', -3.65, 3.46, -9.08, 1.28, 0.22, amberSoft],
    ['upper right crane carriage silhouette', 3.65, 3.46, -9.08, 1.28, 0.22, cyanSoft]
  ];
  modules.forEach(([name, x, y, z, width, height, rim]) => {
    box(`verified rear service ${name}`, [width, height, 0.06], [x, y, z], darkModule);
    box(`verified rear service ${name} top rim`, [width * 0.82, 0.03, 0.035], [x, y + height * 0.52, z + 0.04], rim);
  });
  box('verified rear service left gantry vertical reveal', [0.1, 0.92, 0.045], [-7.6, 2.74, -8.72], coolRim);
  box('verified rear service right gantry vertical reveal', [0.1, 0.92, 0.045], [7.6, 2.74, -8.72], amberSoft);
}

function buildVerifiedRearRibMachineryBand() {
  const ribMat = mat(0x2e394b, { roughness: 0.48, metalness: 0.68 });
  const ribShadow = mat(0x090f1a, { roughness: 0.82, metalness: 0.2 });
  const coolPractical = mat(0x9fd2ff, { emissive: 0x4f9bd9, emissiveIntensity: 0.26, transparent: true, opacity: 0.18, roughness: 0.1 });
  const amberPractical = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.22, transparent: true, opacity: 0.14, roughness: 0.14 });
  const cableMat = mat(0x111a28, { roughness: 0.62, metalness: 0.46 });
  const hatchMat = mat(0x182235, { roughness: 0.68, metalness: 0.36 });

  // Screenshot-driven fix: a readable rear machinery band, split left/right so the holo-table keeps the center clean.
  const ribXs = [-7.25, -6.25, -5.25, -4.25, 4.25, 5.25, 6.25, 7.25];
  ribXs.forEach((x, index) => {
    const side = x < 0 ? 'left' : 'right';
    const rib = box(`verified rear rib machinery ${side} vertical support ${index + 1}`, [0.16, 1.66, 0.07], [x, 3.02, -9.18], ribMat);
    rib.rotation.z = THREE.MathUtils.degToRad(x < 0 ? -2 : 2);
    const shadow = box(`verified rear rib machinery ${side} inset shadow slot ${index + 1}`, [0.07, 1.24, 0.04], [x + (x < 0 ? 0.13 : -0.13), 2.98, -9.12], ribShadow);
    shadow.rotation.z = rib.rotation.z;
    const trim = box(`verified rear rib machinery ${side} dim vertical practical ${index + 1}`, [0.035, 0.96, 0.035], [x + (x < 0 ? 0.22 : -0.22), 3.02, -9.07], index % 2 ? coolPractical : amberPractical);
    trim.rotation.z = rib.rotation.z;
  });

  const trays = [
    ['left upper cable tray', -5.75, 3.78, -8.92, 3.8, coolPractical],
    ['right upper cable tray', 5.75, 3.78, -8.92, 3.8, coolPractical],
    ['left lower maintenance rail', -5.75, 2.26, -8.76, 3.4, amberPractical],
    ['right lower maintenance rail', 5.75, 2.26, -8.76, 3.4, amberPractical]
  ];
  trays.forEach(([name, x, y, z, width, light]) => {
    box(`verified rear rib machinery ${name}`, [width, 0.12, 0.08], [x, y, z], cableMat);
    box(`verified rear rib machinery ${name} inset practical`, [width * 0.82, 0.032, 0.035], [x, y - 0.1, z + 0.05], light);
  });

  const hatches = [
    ['left service transformer A', -6.85, 2.56, 0.72, 0.42, coolPractical],
    ['left service transformer B', -4.72, 2.54, 0.58, 0.48, amberPractical],
    ['right service transformer A', 4.72, 2.54, 0.58, 0.48, coolPractical],
    ['right service transformer B', 6.85, 2.56, 0.72, 0.42, amberPractical]
  ];
  hatches.forEach(([name, x, y, width, height, light]) => {
    box(`verified rear rib machinery ${name}`, [width, height, 0.07], [x, y, -8.58], hatchMat);
    box(`verified rear rib machinery ${name} service slit`, [width * 0.66, 0.032, 0.035], [x, y + height * 0.18, -8.5], light);
  });
}

function buildVerifiedUpperRearVoidBreaks() {
  const glass = mat(0x081a2a, { emissive: 0x0d3a62, emissiveIntensity: 0.24, transparent: true, opacity: 0.3, roughness: 0.12, metalness: 0.18 });
  const haze = mat(0x75baff, { emissive: 0x2c7fbd, emissiveIntensity: 0.2, transparent: true, opacity: 0.14, roughness: 0.04 });
  const rim = mat(0x9fd2ff, { emissive: 0x4f9bd9, emissiveIntensity: 0.24, transparent: true, opacity: 0.18, roughness: 0.08 });
  const warmRim = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.18, transparent: true, opacity: 0.12, roughness: 0.12 });
  const asteroid = mat(0x0b111d, { roughness: 0.92, metalness: 0.04 });
  const star = mat(0xbfe4ff, { emissive: 0x87d4ff, emissiveIntensity: 0.32, transparent: true, opacity: 0.34, roughness: 0.1 });

  // Recess the heavy rear band with narrow exterior apertures; leave the command-table center mostly clean.
  const apertures = [
    ['far left hangar slit', -6.55, 3.52, 1.45, 0.44, rim],
    ['mid left hangar slit', -4.45, 3.62, 1.18, 0.34, warmRim],
    ['mid right hangar slit', 4.45, 3.62, 1.18, 0.34, rim],
    ['far right hangar slit', 6.55, 3.52, 1.45, 0.44, warmRim]
  ];
  apertures.forEach(([name, x, y, width, height, trim], index) => {
    box(`verified upper rear void ${name} cool glass`, [width, height, 0.04], [x, y, -9.36], glass);
    box(`verified upper rear void ${name} exterior haze`, [width * 0.84, height * 0.46, 0.035], [x, y, -9.32], haze);
    box(`verified upper rear void ${name} lower recessed rim`, [width * 0.94, 0.028, 0.032], [x, y - height * 0.58, -9.28], trim);
    box(`verified upper rear void ${name} upper shadow lip`, [width, 0.055, 0.04], [x, y + height * 0.58, -9.26], asteroid);
    box(`verified upper rear void ${name} asteroid exterior notch`, [width * 0.28, height * 0.5, 0.035], [x + (index % 2 ? -0.34 : 0.34), y - 0.02, -9.24], asteroid);
  });

  const starPins = [
    [-6.95, 3.58], [-6.18, 3.45], [-4.65, 3.66], [-4.1, 3.54],
    [4.08, 3.55], [4.72, 3.68], [6.15, 3.46], [6.92, 3.6]
  ];
  starPins.forEach(([x, y], index) => {
    box(`verified upper rear void exterior star pin ${index + 1}`, [0.055, 0.018, 0.022], [x, y, -9.2], star);
  });

  box('verified upper rear void continuous lower edge relief', [12.6, 0.026, 0.032], [0, 3.18, -8.92], rim);
  box('verified upper rear void central clean shadow reserve', [2.1, 0.5, 0.04], [0, 3.56, -9.18], asteroid);
  box('verified upper rear void left lintel fade', [3.4, 0.04, 0.035], [-5.5, 3.88, -9.12], rim);
  box('verified upper rear void right lintel fade', [3.4, 0.04, 0.035], [5.5, 3.88, -9.12], rim);
}


function buildVerifiedRearPanoramaCeilingStrips() {
  const glass = mat(0x0b3458, { emissive: 0x0d6ca6, emissiveIntensity: 0.42, transparent: true, opacity: 0.38, roughness: 0.08, metalness: 0.18 });
  const haze = mat(0x8ed4ff, { emissive: 0x36a6e2, emissiveIntensity: 0.34, transparent: true, opacity: 0.2, roughness: 0.04 });
  const frame = mat(0x526078, { roughness: 0.34, metalness: 0.78 });
  const deepSpace = mat(0x02040a, { roughness: 1.0, metalness: 0.0 });
  const rock = mat(0x15101a, { roughness: 0.96, metalness: 0.02 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.32, transparent: true, opacity: 0.22, roughness: 0.08 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.26, transparent: true, opacity: 0.18, roughness: 0.12 });
  const dimBlue = mat(0x82c8ff, { emissive: 0x4ca8ee, emissiveIntensity: 0.36, transparent: true, opacity: 0.24, roughness: 0.08 });

  // Verification-first target: make the rear read as a panoramic asteroid hangar, not a dark compressed band.
  box('verified rear panorama wide blue hangar glass field', [19.2, 1.36, 0.038], [0, 3.04, -9.18], glass);
  box('verified rear panorama exterior cyan atmosphere shelf', [17.6, 0.62, 0.032], [0, 3.08, -9.13], haze);
  box('verified rear panorama deep exterior void behind glass', [18.0, 1.08, 0.034], [0, 3.18, -9.21], deepSpace);
  box('verified rear panorama top armored header frame', [19.6, 0.14, 0.08], [0, 3.82, -9.04], frame);
  box('verified rear panorama lower armored sill frame', [19.6, 0.12, 0.08], [0, 2.26, -9.04], frame);
  box('verified rear panorama left armored jamb frame', [0.12, 1.34, 0.08], [-9.42, 3.07, -9.03], frame);
  box('verified rear panorama right armored jamb frame', [0.12, 1.34, 0.08], [9.42, 3.07, -9.03], frame);

  const mullions = [-6.85, -3.35, 3.35, 6.85];
  mullions.forEach((x, index) => {
    box(`verified rear panorama window mullion ${index + 1}`, [0.08, 1.2, 0.06], [x, 3.07, -8.98], frame);
    box(`verified rear panorama mullion caught cyan edge ${index + 1}`, [0.026, 0.96, 0.034], [x + 0.08, 3.04, -8.94], dimBlue);
  });

  const exteriorSilhouettes = [
    ['left asteroid wall mass', -7.55, 3.0, 2.1, 0.52, rock],
    ['right asteroid wall mass', 7.55, 3.08, 2.0, 0.54, rock],
    ['distant docked hauler body', -1.0, 3.1, 3.05, 0.32, deepSpace],
    ['distant hauler wing bar', -2.52, 2.88, 1.2, 0.11, deepSpace],
    ['distant service deck silhouette', 4.0, 2.74, 3.4, 0.18, deepSpace]
  ];
  exteriorSilhouettes.forEach(([name, x, y, width, height, material]) => {
    box(`verified rear panorama ${name}`, [width, height, 0.04], [x, y, -8.9], material);
  });

  box('verified rear panorama hauler cyan engine trace', [1.18, 0.045, 0.032], [-3.04, 3.1, -8.86], cyan);
  box('verified rear panorama central horizon command glow', [9.8, 0.04, 0.032], [0, 3.4, -8.84], cyan);
  box('verified rear panorama lower window readable cyan shelf', [13.6, 0.04, 0.032], [0, 2.66, -8.84], dimBlue);
  box('verified rear panorama distant amber dock beacon left', [0.42, 0.035, 0.032], [-5.38, 3.48, -8.86], amber);
  box('verified rear panorama distant amber dock beacon right', [0.42, 0.035, 0.032], [5.5, 3.44, -8.86], amber);
  box('verified rear panorama low runway perspective left', [4.8, 0.032, 0.032], [-4.2, 2.55, -8.84], dimBlue);
  box('verified rear panorama low runway perspective right', [4.8, 0.032, 0.032], [4.2, 2.55, -8.84], dimBlue);

  const ceilingBars = [
    ['left forward practical strip', -4.8, 4.08, -0.7, 6.4, -8, amber],
    ['right forward practical strip', 4.8, 4.08, -0.7, 6.4, 8, amber],
    ['left rear cool ceiling datum', -5.7, 4.04, -5.05, 4.2, 10, dimBlue],
    ['right rear cool ceiling datum', 5.7, 4.04, -5.05, 4.2, -10, dimBlue],
    ['center aft command blue spine', 0, 4.02, -3.8, 5.4, 0, cyan]
  ];
  ceilingBars.forEach(([name, x, y, z, length, yaw, material]) => {
    const strip = box(`verified rear panorama ceiling ${name}`, [0.074, 0.042, length], [x, y, z], material);
    strip.rotation.y = THREE.MathUtils.degToRad(yaw);
    const backing = box(`verified rear panorama ceiling ${name} dark rib backing`, [0.22, 0.12, length + 0.4], [x, y + 0.06, z], deepSpace);
    backing.rotation.y = strip.rotation.y;
  });
}


function buildVerifiedRearWindowShipSilhouette() {
  const glassLift = mat(0x0d4875, { emissive: 0x1593d6, emissiveIntensity: 0.5, transparent: true, opacity: 0.34, roughness: 0.06, metalness: 0.12 });
  const haze = mat(0xb7e8ff, { emissive: 0x55baf2, emissiveIntensity: 0.42, transparent: true, opacity: 0.24, roughness: 0.04 });
  const ship = mat(0x03060d, { roughness: 0.82, metalness: 0.32 });
  const shipEdge = mat(0x7bd8ff, { emissive: COLORS.cyan, emissiveIntensity: 0.42, transparent: true, opacity: 0.26, roughness: 0.08 });
  const amberEdge = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.28, transparent: true, opacity: 0.2, roughness: 0.12 });
  const rock = mat(0x120d16, { roughness: 0.98, metalness: 0.02 });
  const frame = mat(0x44536d, { roughness: 0.38, metalness: 0.76 });

  // Fewer, larger forms: the rear window should read as an asteroid hangar, not a field of tiny UI dots.
  box('verified rear window ship silhouette broad readable blue glass lift', [18.8, 1.42, 0.034], [0, 3.18, -7.86], glassLift);
  box('verified rear window ship silhouette exterior haze behind dock', [16.4, 0.68, 0.03], [0, 3.2, -7.82], haze);
  box('verified rear window ship silhouette left cavern rock shoulder', [2.7, 1.12, 0.05], [-7.7, 3.1, -7.76], rock);
  box('verified rear window ship silhouette right cavern rock shoulder', [2.55, 1.08, 0.05], [7.7, 3.14, -7.76], rock);
  box('verified rear window ship silhouette upper cavern bite', [13.6, 0.28, 0.045], [0, 3.94, -7.74], rock);

  const ribs = [-5.45, -3.2, 3.2, 5.45];
  ribs.forEach((x, index) => {
    box(`verified rear window ship silhouette docking bay vertical rib ${index + 1}`, [0.13, 1.34, 0.05], [x, 3.16, -7.7], frame);
    box(`verified rear window ship silhouette docking rib cyan edge ${index + 1}`, [0.032, 1.02, 0.03], [x + 0.1, 3.16, -7.66], shipEdge);
  });

  const body = box('verified rear window ship silhouette docked hauler main body', [6.1, 0.58, 0.06], [-0.72, 3.2, -7.58], ship);
  body.rotation.z = THREE.MathUtils.degToRad(-1.5);
  const nose = box('verified rear window ship silhouette docked hauler nose block', [1.24, 0.4, 0.055], [2.68, 3.22, -7.56], ship);
  nose.rotation.z = THREE.MathUtils.degToRad(5);
  const leftWing = box('verified rear window ship silhouette docked hauler left wing', [2.4, 0.18, 0.05], [-3.34, 2.9, -7.55], ship);
  leftWing.rotation.z = THREE.MathUtils.degToRad(-9);
  const rightWing = box('verified rear window ship silhouette docked hauler right wing', [2.1, 0.16, 0.05], [0.9, 2.9, -7.55], ship);
  rightWing.rotation.z = THREE.MathUtils.degToRad(8);
  box('verified rear window ship silhouette docked hauler cyan cockpit slash', [1.0, 0.055, 0.032], [1.9, 3.34, -7.5], shipEdge);
  box('verified rear window ship silhouette docked hauler engine glow left', [0.8, 0.055, 0.032], [-4.02, 3.2, -7.5], shipEdge);
  box('verified rear window ship silhouette docked hauler engine glow right', [0.64, 0.05, 0.032], [-3.28, 3.08, -7.5], amberEdge);

  box('verified rear window ship silhouette low hangar runway perspective left', [6.2, 0.05, 0.034], [-4.8, 2.48, -7.5], shipEdge);
  box('verified rear window ship silhouette low hangar runway perspective right', [6.2, 0.05, 0.034], [4.8, 2.48, -7.5], shipEdge);
  box('verified rear window ship silhouette far dock amber beacon bar', [1.6, 0.06, 0.032], [5.35, 3.52, -7.5], amberEdge);

  addLight('point', 0x75cfff, 4.0, [0, 3.32, -6.9], 9.2);
}




function buildVerifiedRearHangarWindowContext() {
  const glass = mat(0x0a3f66, { emissive: 0x0b7fbd, emissiveIntensity: 0.62, transparent: true, opacity: 0.58, roughness: 0.06, metalness: 0.16 });
  const deep = mat(0x01030a, { roughness: 1.0, metalness: 0.0 });
  const haze = mat(0x9ee6ff, { emissive: 0x37b8ff, emissiveIntensity: 0.5, transparent: true, opacity: 0.24, roughness: 0.04 });
  const frame = mat(0x4a5871, { roughness: 0.36, metalness: 0.78 });
  const rock = mat(0x120d17, { roughness: 0.98, metalness: 0.02 });
  const ship = mat(0x030711, { roughness: 0.84, metalness: 0.34 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.42, transparent: true, opacity: 0.26, roughness: 0.08 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.3, transparent: true, opacity: 0.2, roughness: 0.12 });

  // One readable second-read vista behind the command pit: outside asteroid hangar, not another UI panel.
  box('verified rear hangar window context deep exterior void panel', [18.4, 2.12, 0.035], [0, 3.02, -5.72], deep);
  box('verified rear hangar window context wide blue glass aperture', [17.8, 1.82, 0.04], [0, 3.02, -5.66], glass);
  box('verified rear hangar window context exterior atmospheric blue shelf', [15.8, 0.76, 0.032], [0, 3.12, -5.6], haze);
  box('verified rear hangar window context armored top blast frame', [17.8, 0.16, 0.08], [0, 3.98, -5.52], frame);
  box('verified rear hangar window context armored lower sill frame', [17.8, 0.14, 0.08], [0, 1.96, -5.52], frame);
  box('verified rear hangar window context left heavy jamb', [0.16, 1.64, 0.08], [-9.1, 3.02, -5.5], frame);
  box('verified rear hangar window context right heavy jamb', [0.16, 1.64, 0.08], [9.1, 3.02, -5.5], frame);

  [-6.2, -3.1, 3.1, 6.2].forEach((x, index) => {
    box(`verified rear hangar window context thick blast mullion ${index + 1}`, [0.12, 1.46, 0.065], [x, 3.02, -5.46], frame);
    box(`verified rear hangar window context mullion cool edge ${index + 1}`, [0.032, 1.08, 0.034], [x + 0.11, 3.03, -5.41], cyan);
  });

  box('verified rear hangar window context cropped left asteroid outside glass', [2.6, 1.08, 0.05], [-7.48, 3.04, -5.36], rock);
  box('verified rear hangar window context cropped right asteroid outside glass', [2.25, 0.98, 0.05], [7.48, 3.12, -5.36], rock);
  box('verified rear hangar window context upper cavern bite silhouette', [9.8, 0.28, 0.045], [0, 3.7, -5.34], rock);
  const hauler = box('verified rear hangar window context docked hauler broad silhouette', [4.8, 0.44, 0.055], [-0.92, 3.1, -5.28], ship);
  hauler.rotation.z = THREE.MathUtils.degToRad(-2);
  const nose = box('verified rear hangar window context docked hauler nose silhouette', [1.05, 0.28, 0.052], [2.02, 3.14, -5.26], ship);
  nose.rotation.z = THREE.MathUtils.degToRad(5);
  box('verified rear hangar window context hauler cyan cockpit slash', [0.82, 0.048, 0.03], [1.48, 3.26, -5.22], cyan);
  box('verified rear hangar window context hauler amber engine cue', [0.62, 0.046, 0.03], [-3.12, 3.12, -5.22], amber);
  box('verified rear hangar window context rear balcony dark rail', [14.2, 0.09, 0.07], [0, 2.08, -5.06], ship);
  box('verified rear hangar window context rear balcony cyan rim', [12.6, 0.038, 0.035], [0, 2.22, -5.02], cyan);
  box('verified rear hangar window context left receding runway line', [5.1, 0.035, 0.032], [-4.36, 2.42, -5.0], cyan);
  box('verified rear hangar window context right receding runway line', [5.1, 0.035, 0.032], [4.36, 2.42, -5.0], cyan);
  box('verified rear hangar window context tiny left operator silhouette', [0.16, 0.36, 0.05], [-5.25, 2.4, -4.98], ship);
  box('verified rear hangar window context tiny right operator silhouette', [0.16, 0.36, 0.05], [5.38, 2.4, -4.98], ship);
  // High-read exterior anchors: make the rear unmistakably outside glass at overview scale.
  const star = mat(0xdff6ff, { emissive: 0xb7ecff, emissiveIntensity: 0.66, transparent: true, opacity: 0.72, roughness: 0.04 });
  const planetGlow = mat(0x6fc8ff, { emissive: 0x3aa8ff, emissiveIntensity: 0.38, transparent: true, opacity: 0.34, roughness: 0.08 });
  sphere('verified rear hangar window context distant blue moon outside glass', 0.42, 18, [6.62, 3.36, -5.18], planetGlow);
  box('verified rear hangar window context readable docked ship top edge', [4.2, 0.05, 0.032], [-0.86, 3.36, -5.18], cyan);
  box('verified rear hangar window context readable docked ship lower edge', [4.6, 0.045, 0.032], [-1.02, 2.78, -5.18], cyan);
  box('verified rear hangar window context bright exterior star cluster left A', [0.07, 0.026, 0.024], [-6.82, 3.42, -5.16], star);
  box('verified rear hangar window context bright exterior star cluster left B', [0.05, 0.022, 0.024], [-5.92, 3.18, -5.16], star);
  box('verified rear hangar window context bright exterior star cluster center', [0.06, 0.024, 0.024], [0.3, 3.52, -5.16], star);
  box('verified rear hangar window context bright exterior star cluster right A', [0.055, 0.022, 0.024], [5.28, 3.6, -5.16], star);
  box('verified rear hangar window context bright exterior star cluster right B', [0.07, 0.026, 0.024], [7.18, 3.24, -5.16], star);
  addLight('point', 0x7fd3ff, 3.2, [0, 3.1, -4.9], 9.6);
}

function buildVerifiedRearOperationsAtriumDepth() {
  const pressureShell = mat(0x060913, { roughness: 0.88, metalness: 0.22 });
  const armor = mat(0x101827, { roughness: 0.52, metalness: 0.62 });
  const darkSteel = mat(0x0b101c, { roughness: 0.66, metalness: 0.48 });
  const graphite = mat(0x1b2434, { roughness: 0.46, metalness: 0.74 });
  const glass = mat(0x092033, { emissive: 0x0a4460, emissiveIntensity: 0.1, transparent: true, opacity: 0.34, roughness: 0.22, metalness: 0.18 });
  const warm = mat(0xffb86b, { emissive: COLORS.amber, emissiveIntensity: 0.3, transparent: true, opacity: 0.22, roughness: 0.16 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.26, transparent: true, opacity: 0.18, roughness: 0.1 });
  const tinySuit = mat(0xbfc7d6, { emissive: 0x315577, emissiveIntensity: 0.06, roughness: 0.48, metalness: 0.2 });
  const droneMat = mat(0x78efff, { emissive: COLORS.cyan, emissiveIntensity: 0.38, transparent: true, opacity: 0.58, roughness: 0.12 });

  // Large, low-contrast rear atrium layer: depth/scale context, not a competing focal point.
  box('verified rear operations atrium pressure shell backplate', [18.4, 5.8, 0.18], [0, 2.98, -12.36], pressureShell);
  box('verified rear operations atrium upper dark cavern slot', [14.8, 1.2, 0.12], [0, 4.72, -12.16], mat(0x02040a, { roughness: 1.0, metalness: 0.0 }));
  box('verified rear operations atrium observation glass span', [11.8, 1.56, 0.08], [0, 3.28, -12.02], glass);
  box('verified rear operations atrium lower factory shadow mouth', [12.6, 0.82, 0.12], [0, 1.54, -12.05], mat(0x03050b, { roughness: 1.0, metalness: 0.02 }));

  const archFrames = [
    ['outer left armored atrium rib', -6.72, 3.05, 3.64, -10],
    ['outer right armored atrium rib', 6.72, 3.05, 3.64, 10],
    ['inner left armored atrium rib', -4.72, 3.06, 3.22, -6],
    ['inner right armored atrium rib', 4.72, 3.06, 3.22, 6]
  ];
  archFrames.forEach(([name, x, y, height, yaw]) => {
    const rib = box(`verified rear operations atrium ${name}`, [0.28, height, 0.26], [x, y, -11.78], armor);
    rib.rotation.z = THREE.MathUtils.degToRad(yaw);
    const inset = box(`verified rear operations atrium ${name} warm inset seam`, [0.045, height - 0.72, 0.055], [x * 0.995, y, -11.55], warm);
    inset.rotation.z = rib.rotation.z;
  });

  box('verified rear operations atrium top bridge truss', [14.2, 0.24, 0.26], [0, 4.32, -11.72], graphite);
  box('verified rear operations atrium lower gantry tier', [13.4, 0.16, 0.42], [0, 2.38, -11.18], darkSteel);
  box('verified rear operations atrium upper gantry tier', [10.4, 0.13, 0.36], [0, 3.72, -11.28], darkSteel);
  box('verified rear operations atrium lower gantry amber rail', [12.0, 0.045, 0.045], [0, 2.58, -10.92], warm);
  box('verified rear operations atrium upper gantry cyan rail', [8.8, 0.04, 0.04], [0, 3.9, -10.96], cyan);

  const liftColumns = [
    ['left lift column', -3.1], ['right lift column', 3.1], ['far left utility column', -5.55], ['far right utility column', 5.55]
  ];
  liftColumns.forEach(([name, x]) => {
    box(`verified rear operations atrium ${name}`, [0.18, 3.58, 0.2], [x, 2.88, -11.02], graphite);
    box(`verified rear operations atrium ${name} cool status slit`, [0.035, 2.62, 0.035], [x, 2.88, -10.82], cyan);
  });

  box('verified rear operations atrium suspended cargo rail left', [4.8, 0.12, 0.16], [-4.2, 4.02, -10.62], darkSteel).rotation.y = THREE.MathUtils.degToRad(-10);
  box('verified rear operations atrium suspended cargo rail right', [4.8, 0.12, 0.16], [4.2, 4.02, -10.62], darkSteel).rotation.y = THREE.MathUtils.degToRad(10);
  box('verified rear operations atrium tiny cargo block left', [0.54, 0.34, 0.34], [-5.55, 3.58, -10.38], armor);
  box('verified rear operations atrium tiny cargo block right', [0.54, 0.34, 0.34], [5.55, 3.58, -10.38], armor);

  const tinyOps = [
    ['lower left distant operator', -4.7, 2.74, -10.64],
    ['lower right distant operator', 4.7, 2.74, -10.64],
    ['upper left distant operator', -2.25, 4.08, -10.72],
    ['upper right distant operator', 2.25, 4.08, -10.72]
  ];
  tinyOps.forEach(([name, x, y, z]) => {
    cylinder(`verified rear operations atrium ${name} helmet`, 0.055, 0.055, 0.06, 10, [x, y + 0.19, z], tinySuit);
    box(`verified rear operations atrium ${name} body`, [0.08, 0.22, 0.045], [x, y + 0.04, z], tinySuit);
  });

  sphere('verified rear operations atrium left service drone', 0.075, 12, [-1.55, 3.36, -10.24], droneMat);
  sphere('verified rear operations atrium right service drone', 0.065, 12, [1.72, 2.92, -10.18], droneMat);

  // Visible overlay in front of the existing rear glass: big forms first, small details only for scale.
  box('verified rear operations atrium visible outer header beam', [17.2, 0.28, 0.18], [0, 4.42, -6.72], graphite);
  box('verified rear operations atrium visible inner header shadow bite', [12.6, 0.18, 0.16], [0, 4.12, -6.68], pressureShell);
  box('verified rear operations atrium visible left massive lift tower', [0.34, 3.34, 0.18], [-8.16, 3.0, -6.68], armor);
  box('verified rear operations atrium visible right massive lift tower', [0.34, 3.34, 0.18], [8.16, 3.0, -6.68], armor);
  box('verified rear operations atrium visible left inner lift status', [0.048, 2.36, 0.042], [-7.86, 3.0, -6.56], cyan);
  box('verified rear operations atrium visible right inner lift status', [0.048, 2.36, 0.042], [7.86, 3.0, -6.56], cyan);
  const visibleLeftRail = box('verified rear operations atrium visible left cargo rail perspective', [5.8, 0.13, 0.12], [-4.72, 3.9, -6.52], darkSteel);
  visibleLeftRail.rotation.z = THREE.MathUtils.degToRad(-3);
  visibleLeftRail.rotation.y = THREE.MathUtils.degToRad(-12);
  const visibleRightRail = box('verified rear operations atrium visible right cargo rail perspective', [5.8, 0.13, 0.12], [4.72, 3.9, -6.52], darkSteel);
  visibleRightRail.rotation.z = THREE.MathUtils.degToRad(3);
  visibleRightRail.rotation.y = THREE.MathUtils.degToRad(12);
  box('verified rear operations atrium visible lower maintenance bridge', [11.6, 0.16, 0.22], [0, 2.48, -6.5], darkSteel);
  box('verified rear operations atrium visible lower bridge amber underside', [9.8, 0.042, 0.04], [0, 2.31, -6.35], warm);
  box('verified rear operations atrium visible upper bridge cyan datum', [8.2, 0.042, 0.04], [0, 3.64, -6.36], cyan);
  box('verified rear operations atrium visible left service platform', [2.1, 0.12, 0.26], [-6.0, 2.86, -6.34], armor);
  box('verified rear operations atrium visible right service platform', [2.1, 0.12, 0.26], [6.0, 2.86, -6.34], armor);
  box('verified rear operations atrium visible center cavern reserve', [3.9, 1.12, 0.08], [0, 3.25, -6.46], mat(0x02050b, { roughness: 1.0, metalness: 0.0, transparent: true, opacity: 0.72 }));
  box('verified rear operations atrium visible tiny operator left body', [0.08, 0.22, 0.045], [-5.82, 3.04, -6.18], tinySuit);
  cylinder('verified rear operations atrium visible tiny operator left helmet', 0.055, 0.055, 0.06, 10, [-5.82, 3.2, -6.18], tinySuit);
  box('verified rear operations atrium visible tiny operator right body', [0.08, 0.22, 0.045], [5.82, 3.04, -6.18], tinySuit);
  cylinder('verified rear operations atrium visible tiny operator right helmet', 0.055, 0.055, 0.06, 10, [5.82, 3.2, -6.18], tinySuit);
  sphere('verified rear operations atrium visible center service drone', 0.07, 12, [0.9, 3.82, -6.12], droneMat);
  addLight('point', 0x86cfff, 1.65, [0, 3.65, -6.45], 7.4);
}


function buildVerifiedModularRearBayWall() {
  const slab = mat(0x111827, { roughness: 0.58, metalness: 0.58 });
  const dark = mat(0x03060d, { roughness: 0.96, metalness: 0.08 });
  const graphite = mat(0x202b3d, { roughness: 0.42, metalness: 0.78 });
  const steel = mat(0x5b687e, { roughness: 0.32, metalness: 0.82 });
  const glass = mat(0x092238, { emissive: 0x0c4b72, emissiveIntensity: 0.18, transparent: true, opacity: 0.34, roughness: 0.16, metalness: 0.18 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.34, transparent: true, opacity: 0.24, roughness: 0.08 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.3, transparent: true, opacity: 0.22, roughness: 0.12 });
  const dimCyan = mat(0x82dfff, { emissive: COLORS.cyan, emissiveIntensity: 0.22, transparent: true, opacity: 0.16, roughness: 0.1 });
  const suit = mat(0xc7ccd8, { emissive: 0x263b55, emissiveIntensity: 0.05, roughness: 0.48, metalness: 0.2 });

  // Bolder modular bay wall: a few large forms readable from overview, not greeble noise.
  box('verified modular rear bay wall left production cell mass', [3.45, 2.25, 0.26], [-6.6, 3.08, -5.96], slab);
  box('verified modular rear bay wall right production cell mass', [3.45, 2.25, 0.26], [6.6, 3.08, -5.96], slab);
  box('verified modular rear bay wall center high command lintel', [9.2, 0.42, 0.28], [0, 4.34, -5.9], graphite);
  box('verified modular rear bay wall lower gantry bridge slab', [12.4, 0.24, 0.36], [0, 2.42, -5.72], graphite);
  box('verified modular rear bay wall central dark blast-door aperture', [4.4, 1.56, 0.14], [0, 3.26, -5.62], dark);
  box('verified modular rear bay wall central blue pressure glass', [3.74, 0.74, 0.06], [0, 3.36, -5.48], glass);

  const sideCells = [
    ['left upper recessed fabrication bay', -6.6, 3.66, cyan],
    ['left lower cargo lift bay', -6.6, 2.62, amber],
    ['right upper recessed comms bay', 6.6, 3.66, amber],
    ['right lower assembly lift bay', 6.6, 2.62, cyan]
  ];
  sideCells.forEach(([name, x, y, edge]) => {
    box(`verified modular rear bay wall ${name} dark mouth`, [2.38, 0.64, 0.08], [x, y, -5.72], dark);
    box(`verified modular rear bay wall ${name} top edge`, [2.08, 0.04, 0.04], [x, y + 0.36, -5.54], edge);
    box(`verified modular rear bay wall ${name} left jamb`, [0.06, 0.5, 0.04], [x - 1.24, y, -5.54], steel);
    box(`verified modular rear bay wall ${name} right jamb`, [0.06, 0.5, 0.04], [x + 1.24, y, -5.54], steel);
  });

  const towers = [
    ['far left lift tower', -9.25, -4], ['inner left lift tower', -3.15, -2],
    ['inner right lift tower', 3.15, 2], ['far right lift tower', 9.25, 4]
  ];
  towers.forEach(([name, x, lean]) => {
    const tower = box(`verified modular rear bay wall ${name} armored vertical`, [0.38, 3.26, 0.28], [x, 3.12, -5.82], graphite);
    tower.rotation.z = THREE.MathUtils.degToRad(lean);
    const slit = box(`verified modular rear bay wall ${name} dim status slit`, [0.052, 2.3, 0.045], [x + (x < 0 ? 0.28 : -0.28), 3.12, -5.5], x < 0 ? dimCyan : amber);
    slit.rotation.z = tower.rotation.z;
  });

  const rails = [
    ['upper left crane rail', -4.65, 4.05, -9], ['upper right crane rail', 4.65, 4.05, 9],
    ['mid left transfer rail', -4.9, 2.78, -5], ['mid right transfer rail', 4.9, 2.78, 5]
  ];
  rails.forEach(([name, x, y, yaw]) => {
    const rail = box(`verified modular rear bay wall ${name} chunky perspective beam`, [4.4, 0.14, 0.16], [x, y, -5.22], steel);
    rail.rotation.y = THREE.MathUtils.degToRad(yaw);
    const glow = box(`verified modular rear bay wall ${name} underside guide light`, [3.4, 0.036, 0.036], [x, y - 0.13, -5.04], name.includes('upper') ? cyan : amber);
    glow.rotation.y = rail.rotation.y;
  });

  box('verified modular rear bay wall left suspended cargo block', [0.68, 0.48, 0.34], [-5.82, 3.46, -4.92], dark);
  box('verified modular rear bay wall right suspended cargo block', [0.68, 0.48, 0.34], [5.82, 3.46, -4.92], dark);
  box('verified modular rear bay wall long amber bridge underside', [10.8, 0.05, 0.045], [0, 2.23, -5.34], amber);
  box('verified modular rear bay wall long cyan upper datum', [7.4, 0.045, 0.04], [0, 4.08, -5.34], dimCyan);

  const scaleOps = [
    ['left bridge operator', -4.88, 2.67], ['right bridge operator', 4.88, 2.67],
    ['left upper gantry operator', -7.42, 3.98], ['right upper gantry operator', 7.42, 3.98]
  ];
  scaleOps.forEach(([name, x, y]) => {
    cylinder(`verified modular rear bay wall ${name} helmet`, 0.052, 0.052, 0.055, 10, [x, y + 0.18, -4.82], suit);
    box(`verified modular rear bay wall ${name} body`, [0.08, 0.2, 0.044], [x, y + 0.035, -4.82], suit);
  });

  // Near-rear side portals keep the center open while making the bay wall read at thumbnail scale.
  box('verified modular rear bay wall left near portal armored cheek', [1.28, 2.72, 0.26], [-8.6, 2.92, -4.42], graphite);
  box('verified modular rear bay wall right near portal armored cheek', [1.28, 2.72, 0.26], [8.6, 2.92, -4.42], graphite);
  box('verified modular rear bay wall left near portal dark opening', [2.28, 1.42, 0.12], [-7.15, 2.9, -4.28], dark);
  box('verified modular rear bay wall right near portal dark opening', [2.28, 1.42, 0.12], [7.15, 2.9, -4.28], dark);
  box('verified modular rear bay wall left near portal cyan vertical edge', [0.052, 2.18, 0.044], [-6.02, 2.95, -4.08], cyan);
  box('verified modular rear bay wall right near portal amber vertical edge', [0.052, 2.18, 0.044], [6.02, 2.95, -4.08], amber);
  box('verified modular rear bay wall left near portal lower deck ledge', [3.1, 0.14, 0.2], [-7.25, 2.08, -4.05], steel);
  box('verified modular rear bay wall right near portal lower deck ledge', [3.1, 0.14, 0.2], [7.25, 2.08, -4.05], steel);
  box('verified modular rear bay wall wide upper truss silhouette', [15.2, 0.22, 0.2], [0, 4.62, -4.7], graphite);
  box('verified modular rear bay wall wide upper truss warm underside', [12.4, 0.044, 0.04], [0, 4.42, -4.48], amber);

  addLight('point', 0x7ecbff, 1.55, [0, 3.55, -5.25], 6.4);
}


function buildVerifiedBayWallRimReadability() {
  const cyanEdge = mat(0xa9f7ff, { emissive: COLORS.cyan, emissiveIntensity: 0.56, transparent: true, opacity: 0.38, roughness: 0.06, metalness: 0.08 });
  const amberSlot = mat(0xffc06a, { emissive: COLORS.amber, emissiveIntensity: 0.48, transparent: true, opacity: 0.34, roughness: 0.1, metalness: 0.04 });
  const glossCatch = mat(0x5f708b, { emissive: 0x263e58, emissiveIntensity: 0.16, transparent: true, opacity: 0.34, roughness: 0.16, metalness: 0.86 });
  const coolGlass = mat(0x16567f, { emissive: 0x1688bd, emissiveIntensity: 0.26, transparent: true, opacity: 0.34, roughness: 0.08, metalness: 0.16 });
  const darkMatte = mat(0x03060d, { roughness: 0.98, metalness: 0.02, transparent: true, opacity: 0.5 });

  // Selective material/rim pass: reveal big rear bay-wall forms without making a neon backdrop.
  const rimLines = [
    ['central upper gantry cyan lip', 0, 4.48, -4.34, 8.8, cyanEdge],
    ['central lower bridge amber lip', 0, 2.58, -4.92, 10.8, amberSlot],
    ['left portal outer cyan catch', -6.05, 3.16, -3.86, 2.9, cyanEdge],
    ['right portal outer amber catch', 6.05, 3.16, -3.86, 2.9, amberSlot],
    ['left production cell cool top datum', -6.6, 4.05, -5.18, 2.82, cyanEdge],
    ['right production cell warm top datum', 6.6, 4.05, -5.18, 2.82, amberSlot]
  ];
  rimLines.forEach(([name, x, y, z, width, material]) => {
    box(`verified bay wall rim readability ${name}`, [width, 0.04, 0.038], [x, y, z], material);
  });

  const verticalCatches = [
    ['left lift tower near cyan edge', -8.03, 3.18, -4.0, cyanEdge],
    ['right lift tower near amber edge', 8.03, 3.18, -4.0, amberSlot],
    ['inner left tower cool glancing edge', -3.0, 3.26, -5.12, cyanEdge],
    ['inner right tower warm glancing edge', 3.0, 3.26, -5.12, amberSlot]
  ];
  verticalCatches.forEach(([name, x, y, z, material]) => {
    box(`verified bay wall rim readability ${name}`, [0.045, 2.28, 0.038], [x, y, z], material);
  });

  const glossCards = [
    ['left gantry brushed metal catch', -4.7, 3.9, -4.86, -8],
    ['right gantry brushed metal catch', 4.7, 3.9, -4.86, 8],
    ['left lower deck gloss plane', -6.9, 2.22, -3.9, 0],
    ['right lower deck gloss plane', 6.9, 2.22, -3.9, 0]
  ];
  glossCards.forEach(([name, x, y, z, yaw]) => {
    const plate = box(`verified bay wall rim readability ${name}`, [2.3, 0.06, 0.06], [x, y, z], glossCatch);
    plate.rotation.y = THREE.MathUtils.degToRad(yaw);
  });

  box('verified bay wall rim readability central aperture glass lift', [3.1, 0.46, 0.035], [0, 3.48, -4.78], coolGlass);
  box('verified bay wall rim readability central aperture matte reserve', [2.7, 0.7, 0.04], [0, 3.12, -4.82], darkMatte);
  addLight('point', 0x8bdcff, 1.28, [0, 3.52, -4.7], 5.8);
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

function buildVerifiedOperatorWorkstationActivity() {
  const suit = mat(0x252d3a, { roughness: 0.52, metalness: 0.28 });
  const shadow = mat(0x050913, { roughness: 0.86, metalness: 0.16 });
  const chairMat = mat(0x111827, { roughness: 0.58, metalness: 0.34 });
  const cableMat = mat(0x05070d, { roughness: 0.9, metalness: 0.08 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.5, transparent: true, opacity: 0.3, roughness: 0.1 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.48, transparent: true, opacity: 0.28, roughness: 0.12 });
  const green = mat(COLORS.green, { emissive: COLORS.green, emissiveIntensity: 0.36, transparent: true, opacity: 0.22, roughness: 0.12 });
  const violet = mat(COLORS.violet, { emissive: COLORS.violet, emissiveIntensity: 0.34, transparent: true, opacity: 0.2, roughness: 0.12 });
  const coral = mat(COLORS.coral, { emissive: COLORS.coral, emissiveIntensity: 0.34, transparent: true, opacity: 0.2, roughness: 0.12 });
  const glass = mat(0x071526, { emissive: 0x0c314f, emissiveIntensity: 0.2, transparent: true, opacity: 0.34, roughness: 0.16, metalness: 0.2 });

  const makeCrew = (name, x, z, yaw, scale, accent, pose = 'standing') => {
    const group = new THREE.Group();
    group.name = name;
    group.position.set(x, 0.68, z);
    group.rotation.y = THREE.MathUtils.degToRad(yaw);
    root.add(group);
    const bodyHeight = pose === 'seated' ? 0.48 : 0.68;
    cylinder(`${name} torso`, 0.13 * scale, 0.17 * scale, bodyHeight * scale, 8, [0, bodyHeight * scale * 0.35, 0], suit, group);
    sphere(`${name} helmet`, 0.14 * scale, 10, [0, bodyHeight * scale * 0.82, 0.02 * scale], suit, group);
    box(`${name} visor glow`, [0.18 * scale, 0.04 * scale, 0.035 * scale], [0, bodyHeight * scale * 0.82, 0.14 * scale], accent, group);
    box(`${name} work gesture arm left`, [0.34 * scale, 0.04 * scale, 0.04 * scale], [-0.18 * scale, bodyHeight * scale * 0.42, 0.16 * scale], accent, group);
    box(`${name} work gesture arm right`, [0.34 * scale, 0.04 * scale, 0.04 * scale], [0.18 * scale, bodyHeight * scale * 0.39, 0.16 * scale], accent, group);
    if (pose === 'seated') box(`${name} compact chair back`, [0.42 * scale, 0.48 * scale, 0.08 * scale], [0, 0.12 * scale, -0.2 * scale], chairMat, group);
    operators.push({ group, baseY: 0.68, index: operators.length + 40, agent: { name } });
  };

  const activityStations = [
    ['front table telemetry pair left', -0.95, 2.92, -12, 0.58, cyan, 'seated'],
    ['front table telemetry pair right', 0.95, 2.92, 12, 0.58, amber, 'seated'],
    ['build floor standing supervisor', -7.0, 0.92, -58, 0.5, amber, 'standing'],
    ['review chamber seated analyst', 7.0, 0.82, 58, 0.48, coral, 'seated'],
    ['observatory signal operator', -7.15, -5.55, -124, 0.46, violet, 'standing'],
    ['deploy dock headset runner', 7.18, -5.48, 124, 0.46, green, 'standing']
  ];
  activityStations.forEach(([name, x, z, yaw, scale, accent, pose]) => makeCrew(name, x, z, yaw, scale, accent, pose));

  [
    ['front table active mission screen', 0, 3.18, cyan],
    ['left ring active diagnostics screen', -3.12, 1.16, amber],
    ['right ring active diagnostics screen', 3.12, 1.16, cyan],
    ['build floor local monitor row', -7.2, 1.72, amber],
    ['review floor local monitor row', 7.2, 1.72, coral],
    ['observatory local monitor row', -7.25, -4.82, violet],
    ['deploy dock local monitor row', 7.25, -4.82, green]
  ].forEach(([name, x, z, accent], index) => {
    box(`${name} glass slab`, [0.78, 0.36, 0.045], [x, 1.52, z], glass);
    box(`${name} status scanline`, [0.58, 0.035, 0.04], [x, 1.68, z + 0.035], accent);
    box(`${name} lower task chip`, [0.42, 0.03, 0.04], [x + (index % 2 ? 0.22 : -0.22), 1.38, z + 0.04], accent);
  });

  const cableRuns = [
    ['left table cable run', -1.72, 1.9, 22],
    ['right table cable run', 1.72, 1.9, -22],
    ['build floor cart cable run', -7.6, 0.0, -8],
    ['deploy dock cart cable run', 7.6, -4.2, 8]
  ];
  cableRuns.forEach(([name, x, z, yaw]) => {
    const cable = box(name, [1.4, 0.025, 0.04], [x, 0.64, z], cableMat);
    cable.rotation.y = THREE.MathUtils.degToRad(yaw);
  });
  box('build floor small rolling task cart', [0.48, 0.28, 0.34], [-8.18, 0.76, 0.12], shadow);
  box('deploy dock small rolling task cart', [0.48, 0.28, 0.34], [8.18, 0.76, -4.52], shadow);
}

function buildVerifiedOperatorReadabilityAnchors() {
  const bodyMat = mat(0x182131, { roughness: 0.5, metalness: 0.34 });
  const shadowMat = mat(0x03060c, { roughness: 0.94, metalness: 0.04 });
  const consoleMat = mat(0x071526, { emissive: 0x0a2f4d, emissiveIntensity: 0.24, transparent: true, opacity: 0.42, roughness: 0.16, metalness: 0.22 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.78, transparent: true, opacity: 0.52, roughness: 0.08 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.64, transparent: true, opacity: 0.48, roughness: 0.1 });

  const anchors = [
    ['readable front left operator anchor', -1.34, 2.88, -12, 1.04, cyan, 'seated'],
    ['readable front right operator anchor', 1.34, 2.88, 12, 1.04, amber, 'seated'],
    ['readable mid left console anchor', -3.58, 0.72, -64, 0.98, amber, 'lean'],
    ['readable mid right console anchor', 3.58, 0.72, 64, 0.98, cyan, 'lean'],
    ['readable rear left bay operator anchor', -2.28, -2.48, -154, 0.92, cyan, 'standing'],
    ['readable rear right bay operator anchor', 2.28, -2.48, 154, 0.92, amber, 'standing']
  ];

  anchors.forEach(([name, x, z, yaw, scale, accent, pose], index) => {
    const group = new THREE.Group();
    group.name = name;
    const baseY = pose === 'seated' ? 0.98 : 1.06;
    group.position.set(x, baseY, z);
    group.rotation.y = THREE.MathUtils.degToRad(yaw);
    root.add(group);

    const seated = pose === 'seated';
    const torsoHeight = (seated ? 0.58 : 0.82) * scale;
    const torso = cylinder(`${name} clear torso silhouette`, 0.16 * scale, 0.22 * scale, torsoHeight, 10, [0, 0.22 * scale, 0], bodyMat, group);
    torso.rotation.z = pose === 'lean' ? (x < 0 ? -0.15 : 0.15) : 0;
    const head = sphere(`${name} readable helmet silhouette`, 0.18 * scale, 12, [0, 0.72 * scale, 0.02 * scale], bodyMat, group);
    head.scale.y = 1.1;
    box(`${name} bright visor head cue`, [0.25 * scale, 0.055 * scale, 0.04 * scale], [0, 0.74 * scale, 0.17 * scale], accent, group);
    box(`${name} chest role light`, [0.2 * scale, 0.04 * scale, 0.03 * scale], [0, 0.34 * scale, 0.18 * scale], accent, group);
    box(`${name} strong contact shadow`, [0.54 * scale, 0.035 * scale, 0.34 * scale], [0, -0.34 * scale, 0], shadowMat, group);
    box(`${name} left rim shoulder`, [0.05 * scale, 0.42 * scale, 0.04 * scale], [-0.2 * scale, 0.34 * scale, 0.14 * scale], accent, group);
    box(`${name} right working arm`, [0.42 * scale, 0.045 * scale, 0.045 * scale], [0.2 * scale, 0.28 * scale, 0.2 * scale], pose === 'lean' ? accent : bodyMat, group);
    if (seated) box(`${name} readable chair back silhouette`, [0.5 * scale, 0.42 * scale, 0.08 * scale], [0, -0.05 * scale, -0.22 * scale], bodyMat, group);

    const panelX = x + (x < 0 ? 0.34 : -0.34);
    const panelZ = z + (z > 1 ? 0.36 : -0.32);
    const panel = box(`${name} paired lit workstation panel`, [0.72 * scale, 0.34 * scale, 0.05 * scale], [panelX, baseY + 0.24 * scale, panelZ], consoleMat);
    panel.rotation.y = group.rotation.y;
    const scan = box(`${name} paired workstation scanline`, [0.54 * scale, 0.035 * scale, 0.035 * scale], [panelX, baseY + 0.38 * scale, panelZ + 0.03], accent);
    scan.rotation.y = group.rotation.y;
    operators.push({ group, baseY, index: index + 80, agent: { name } });
  });
}

function buildVerifiedOperatorRimSeparation() {
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.72, transparent: true, opacity: 0.38, roughness: 0.08 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.58, transparent: true, opacity: 0.34, roughness: 0.1 });
  const violet = mat(COLORS.violet, { emissive: COLORS.violet, emissiveIntensity: 0.42, transparent: true, opacity: 0.24, roughness: 0.12 });
  const green = mat(COLORS.green, { emissive: COLORS.green, emissiveIntensity: 0.42, transparent: true, opacity: 0.24, roughness: 0.12 });
  const backing = mat(0x050812, { roughness: 0.92, metalness: 0.08, transparent: true, opacity: 0.72 });
  const softSeat = mat(0x101724, { roughness: 0.64, metalness: 0.26 });

  const rimTargets = [
    ['rear left anchor separation', -2.28, -2.48, 1.06, -154, cyan, 0.92],
    ['rear right anchor separation', 2.28, -2.48, 1.06, 154, amber, 0.92],
    ['rear seated left separation', -1.55, -2.04, 1.05, -150, cyan, 0.62],
    ['rear seated right separation', 1.55, -2.04, 1.05, 150, amber, 0.62],
    ['observatory side operator separation', -7.15, -5.55, 0.68, -124, violet, 0.58],
    ['deploy side operator separation', 7.18, -5.48, 0.68, 124, green, 0.58],
    ['build side supervisor separation', -7.0, 0.92, 0.68, -58, amber, 0.62],
    ['review side analyst separation', 7.0, 0.82, 0.68, 58, cyan, 0.58]
  ];

  rimTargets.forEach(([name, x, z, y, yaw, accent, scale], index) => {
    const group = new THREE.Group();
    group.name = name;
    group.position.set(x, y, z);
    group.rotation.y = THREE.MathUtils.degToRad(yaw);
    root.add(group);
    box(`${name} dark chair backing silhouette`, [0.54 * scale, 0.58 * scale, 0.055], [0, 0.08 * scale, -0.2 * scale], index < 4 ? softSeat : backing, group);
    box(`${name} floor contact oval`, [0.64 * scale, 0.026, 0.32 * scale], [0, -0.34 * scale, 0.02], backing, group);
    box(`${name} helmet glint`, [0.24 * scale, 0.045 * scale, 0.035], [0.02 * scale, 0.68 * scale, 0.17 * scale], accent, group);
    box(`${name} holo-facing shoulder rim`, [0.055 * scale, 0.46 * scale, 0.035], [-0.2 * scale, 0.34 * scale, 0.14 * scale], accent, group);
    box(`${name} console-side forearm glint`, [0.38 * scale, 0.038 * scale, 0.035], [0.2 * scale, 0.22 * scale, 0.2 * scale], accent, group);
    if (index < 4) {
      box(`${name} seated torso lift`, [0.3 * scale, 0.08 * scale, 0.04], [0, 0.24 * scale, 0.16 * scale], accent, group);
    }
  });
  box('verified rear operator shared cyan readability datum', [2.6, 0.028, 0.035], [0, 1.34, -2.36], cyan);
  box('verified side operator shared amber readability datum', [0.035, 0.028, 2.2], [-6.82, 1.12, -2.22], amber);
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
  updateOverviewClearSightline();
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
