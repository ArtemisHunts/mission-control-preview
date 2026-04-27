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
    camera: [0, 27.6, 74.8],
    target: [0, 2.55, -4.35],
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
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.82;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.bg);
scene.fog = new THREE.Fog(COLORS.bg, 42, 218);

const camera = new THREE.PerspectiveCamera(69, window.innerWidth / window.innerHeight, 0.1, 320);
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
const fixedCameraOffset = new THREE.Vector3(0, 25.05, 78.85);
const facilityBounds = { minX: -16.4, maxX: 16.4, minZ: -15.6, maxZ: 4.8 };

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
    light.shadow.mapSize.set(1024, 1024);
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
  buildMacroCutawayFrame();
  buildExteriorObservationShell();
  buildMineMouthOuterAperture();
  buildApertureDepthOcclusionMasks();
  buildVerticalSliceSurveyMarks();
  buildCutawayThicknessDatumStack();
  buildRearProductionVoidExpansion();
  buildProductionCavernParallaxScales();
  buildRearCavernDepthGate();
  buildMacroFacilityDepthMarkers();
  buildWideOverviewLightingScaffold();
  buildWideReadabilityRimStack();
  buildMacroRevealLighting();
  buildAsteroidField();
  buildExteriorVista();
  buildDistantFacilityDepth();
  buildRooms();
  buildHoloTable();
  buildSignalLanes();
  buildRailingsAndCatwalks();
  buildCableConduits();
  buildServiceDrones();
  buildRemoteBayMaintenanceDrones();
  buildIndustrialSetDressing();
  buildVolumetricLightPlanes();
  buildArchitecturalRibs();
  buildTowers();
  buildOperators();
  buildSignalOrbs();

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
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 25), mat(COLORS.floor, { roughness: 0.62, metalness: 0.28 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);

  // Paneled metal floor with glass tech trenches.
  for (let x = -13.5; x <= 13.5; x += 1.8) {
    for (let z = -10.6; z <= 7.0; z += 1.55) {
      const panel = box('floor panel', [1.65, 0.025, 1.34], [x, 0.018, z], mat(0x121a2c, { roughness: 0.48, metalness: 0.48 }));
      panel.castShadow = false;
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(panel.geometry), new THREE.LineBasicMaterial({ color: 0x26344f, transparent: true, opacity: 0.42 }));
      panel.add(edges);
    }
  }

  [-6.6, 6.6].forEach((x) => {
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.035, 20.2), mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.45, transparent: true, opacity: 0.14, roughness: 0.12, metalness: 0.1 }));
    glass.position.set(x, 0.04, -1.8);
    glass.receiveShadow = true;
    root.add(glass);
  });

  box('rear wall', [28.0, 6.1, 0.25], [0, 2.9, -12.05], mat(COLORS.wall, { roughness: 0.56, metalness: 0.22 }));
  const leftWall = box('left wall', [22.0, 5.6, 0.2], [-14.8, 2.75, -1.55], mat(COLORS.wallDark, { roughness: 0.7, metalness: 0.18 }));
  leftWall.rotation.y = Math.PI / 2;
  const rightWall = box('right wall', [22.0, 5.6, 0.2], [14.8, 2.75, -1.55], mat(COLORS.wallDark, { roughness: 0.7, metalness: 0.18 }));
  rightWall.rotation.y = Math.PI / 2;

  buildWindowWall();

  [-12.4, -8.2, -5.1, -2.1, 2.1, 5.1, 8.2, 12.4].forEach((x) => {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.035, 21.0), mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.55, transparent: true, opacity: 0.38 }));
    strip.position.set(x, 0.055, -1.9);
    root.add(strip);
  });

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
  const rockMat = mat(COLORS.rock, { roughness: 0.92, metalness: 0.02 });
  const clusters = [
    [-10.7, 0.65, -7.2, 1.8], [-10.8, 1.7, 3.1, 1.35], [10.7, 0.8, -7.0, 1.65], [10.8, 1.9, 3.4, 1.3],
    [-7.4, 0.35, 6.7, 1.15], [7.5, 0.35, 6.65, 1.18], [0, 4.55, -7.8, 1.6]
  ];
  clusters.forEach(([x, y, z, scale], index) => {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(scale, 0), rockMat);
    rock.position.set(x, y, z);
    rock.rotation.set(index * 0.7, index * 0.33, index * 0.49);
    rock.scale.set(1.35, 0.8 + (index % 2) * 0.35, 0.95);
    rock.castShadow = true;
    rock.receiveShadow = true;
    root.add(rock);
  });
}

function buildAsteroidRim() {
  const rimMat = mat(COLORS.rock, { roughness: 0.95, metalness: 0.01 });
  const rimPoints = [];
  for (let i = 0; i < 24; i += 1) {
    const z = -9.6 + i * 0.75;
    rimPoints.push([-12.4 + Math.sin(i * 0.9) * 0.4, z, 0.75 + (i % 4) * 0.18]);
    rimPoints.push([12.4 + Math.cos(i * 0.8) * 0.4, z, 0.75 + ((i + 2) % 4) * 0.18]);
  }
  for (let i = 0; i < 18; i += 1) {
    const x = -11.2 + i * 1.32;
    rimPoints.push([x, 4.95 + Math.sin(i) * 0.3, 0.65 + (i % 3) * 0.22]);
    rimPoints.push([x, -10.2 + Math.cos(i) * 0.25, 0.9 + ((i + 1) % 3) * 0.24]);
  }
  rimPoints.forEach(([x, z, scale], index) => {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(scale, 0), rimMat);
    rock.position.set(x, 0.18 + (index % 5) * 0.08, z);
    rock.rotation.set(index * 0.37, index * 0.61, index * 0.23);
    rock.scale.set(1.5 + (index % 3) * 0.22, 0.65 + (index % 4) * 0.16, 1.1);
    rock.castShadow = true;
    rock.receiveShadow = true;
    root.add(rock);
  });
}

function buildForegroundCutawayFrame() {
  const rockMat = mat(COLORS.rock, { roughness: 0.96, metalness: 0.01 });
  const shadowMat = mat(0x03050b, { roughness: 0.9, metalness: 0.02 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.26, transparent: true, opacity: 0.28 });

  box('foreground asteroid cutaway shadow sill', [29.5, 0.34, 0.85], [0, 0.25, 7.35], shadowMat);
  box('upper asteroid cutaway shadow lip', [29.5, 0.44, 0.92], [0, 5.32, -2.4], shadowMat);
  box('left asteroid cutaway side shadow', [0.7, 4.8, 18.5], [-15.15, 2.6, -2.25], shadowMat);
  box('right asteroid cutaway side shadow', [0.7, 4.8, 18.5], [15.15, 2.6, -2.25], shadowMat);

  for (let i = 0; i < 18; i += 1) {
    const x = -14.4 + i * 1.7;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55 + (i % 4) * 0.13, 0), rockMat);
    rock.position.set(x, 0.58 + (i % 3) * 0.08, 7.0 + Math.sin(i * 0.7) * 0.35);
    rock.rotation.set(i * 0.42, i * 0.25, i * 0.63);
    rock.scale.set(1.8, 0.72 + (i % 2) * 0.24, 1.12);
    rock.castShadow = true;
    rock.receiveShadow = true;
    root.add(rock);
  }

  for (let i = 0; i < 16; i += 1) {
    const z = 5.8 - i * 1.08;
    [-1, 1].forEach((side) => {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.66 + (i % 5) * 0.12, 0), rockMat);
      rock.position.set(side * (14.2 + Math.sin(i) * 0.28), 1.2 + (i % 4) * 0.38, z);
      rock.rotation.set(i * 0.31, side * i * 0.47, i * 0.19);
      rock.scale.set(1.1, 1.35, 1.65);
      rock.castShadow = true;
      rock.receiveShadow = true;
      root.add(rock);
    });
  }

  for (let i = 0; i < 14; i += 1) {
    const x = -13 + i * 2;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.62 + (i % 3) * 0.16, 0), rockMat);
    rock.position.set(x, 5.12 + Math.sin(i * 0.4) * 0.22, -8.4 + Math.cos(i * 0.7) * 0.55);
    rock.rotation.set(i * 0.22, i * 0.52, i * 0.4);
    rock.scale.set(1.55, 0.72, 1.22);
    rock.castShadow = true;
    rock.receiveShadow = true;
    root.add(rock);
  }

  [-10.8, -5.4, 0, 5.4, 10.8].forEach((x) => {
    box('cutaway maintenance glint', [0.06, 0.035, 0.42], [x, 0.74, 6.7], amber);
  });

  const seamMat = mat(0x2c2531, { roughness: 0.98, metalness: 0.01 });
  const mineralMat = mat(0x3d3143, { emissive: 0x19111c, emissiveIntensity: 0.18, roughness: 0.88, metalness: 0.03 });

  for (let i = 0; i < 9; i += 1) {
    const x = -12.8 + i * 3.2;
    const ledge = box('foreground cutaway layered strata shelf', [2.35 + (i % 3) * 0.28, 0.045, 0.075], [x, 0.92 + (i % 2) * 0.09, 6.64 + Math.sin(i) * 0.12], seamMat);
    ledge.rotation.y = Math.sin(i * 1.7) * 0.16;

    const vein = box('foreground cutaway mineral vein', [1.25 + (i % 2) * 0.42, 0.024, 0.045], [x + 0.32, 1.08 + (i % 3) * 0.08, 6.58 + Math.cos(i) * 0.1], mineralMat);
    vein.rotation.y = -0.22 + (i % 4) * 0.11;
  }

  for (let i = 0; i < 7; i += 1) {
    const x = -11.6 + i * 3.85;
    const ceilingSeam = box('upper cutaway compressed rock seam', [1.7 + (i % 2) * 0.52, 0.035, 0.06], [x, 4.86 + Math.sin(i * 0.8) * 0.1, -8.02 + Math.cos(i) * 0.18], seamMat);
    ceilingSeam.rotation.y = 0.18 - (i % 3) * 0.14;
  }

  for (let i = 0; i < 6; i += 1) {
    const z = 4.55 - i * 2.45;
    [-1, 1].forEach((side) => {
      const sideSeam = box('side cutaway vertical fracture seam', [0.045, 0.82 + (i % 2) * 0.28, 0.07], [side * 14.02, 1.48 + (i % 3) * 0.42, z], seamMat);
      sideSeam.rotation.z = side * (0.08 + i * 0.015);
    });
  }
}

function buildVerticalSliceContainer() {
  const outerRock = mat(0x100d14, { roughness: 0.98, metalness: 0.01 });
  const innerRock = mat(0x211a23, { roughness: 0.96, metalness: 0.01 });
  const deepShadow = mat(0x020309, { roughness: 1.0, metalness: 0.0 });
  const cutPlane = mat(0x302633, { roughness: 0.92, metalness: 0.02 });
  const coolRim = mat(0x5aa5ff, { emissive: 0x5aa5ff, emissiveIntensity: 0.22, transparent: true, opacity: 0.24 });
  const warmWorkLight = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.48, transparent: true, opacity: 0.38 });

  // Big occluding silhouette: the base is a vertical slice cut into an asteroid, not a room floating in space.
  box('vertical slice outer left asteroid mass', [1.65, 6.8, 22.5], [-16.25, 2.95, -2.15], outerRock);
  box('vertical slice outer right asteroid mass', [1.65, 6.8, 22.5], [16.25, 2.95, -2.15], outerRock);
  box('vertical slice overhead asteroid crown', [32.4, 1.35, 13.4], [0, 5.85, -3.6], outerRock);
  box('vertical slice lower fractured sill', [32.2, 0.95, 2.2], [0, -0.18, 6.95], deepShadow);
  box('vertical slice rear cavern darkness', [30.4, 6.8, 0.34], [0, 3.05, -13.05], deepShadow);

  const sideFaces = [
    [-14.95, 3.05, -4.8, 0.18], [14.95, 3.05, -4.8, -0.18],
    [-14.65, 2.35, 1.8, -0.12], [14.65, 2.35, 1.8, 0.12]
  ];
  sideFaces.forEach(([x, y, z, rz], i) => {
    const face = box('vertical slice exposed cut plane', [0.18, 4.2 + (i % 2) * 0.9, 6.6], [x, y, z], cutPlane);
    face.rotation.z = rz;
  });

  // Jagged visible border around the viewport-like opening.
  for (let i = 0; i < 28; i += 1) {
    const z = 6.65 - i * 0.72;
    [-1, 1].forEach((side) => {
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.52 + (i % 5) * 0.12, 0), i % 3 ? innerRock : outerRock);
      rock.name = 'vertical slice jagged side border rock';
      rock.position.set(side * (14.9 + Math.sin(i * 0.75) * 0.46), 0.7 + (i % 6) * 0.68, z);
      rock.rotation.set(i * 0.31, side * i * 0.43, i * 0.17);
      rock.scale.set(1.35 + (i % 4) * 0.22, 1.05 + (i % 3) * 0.28, 1.65);
      rock.castShadow = true;
      rock.receiveShadow = true;
      root.add(rock);
    });
  }

  for (let i = 0; i < 22; i += 1) {
    const x = -14.6 + i * 1.4;
    const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(0.58 + (i % 4) * 0.14, 0), i % 2 ? innerRock : outerRock);
    crown.name = 'vertical slice jagged overhead crown rock';
    crown.position.set(x, 5.35 + Math.sin(i * 0.58) * 0.36, -7.9 + Math.cos(i * 0.43) * 1.2);
    crown.rotation.set(i * 0.27, i * 0.39, i * 0.51);
    crown.scale.set(1.55, 0.85 + (i % 3) * 0.22, 1.45);
    crown.castShadow = true;
    crown.receiveShadow = true;
    root.add(crown);
  }

  // Stratified cross-section bands and embedded work lights clarify this as carved rock.
  for (let i = 0; i < 9; i += 1) {
    const y = 1.05 + i * 0.46;
    [-1, 1].forEach((side) => {
      const seam = box('vertical slice side sediment seam', [0.075, 0.035, 4.2 + (i % 2) * 1.1], [side * 14.34, y, 3.65 - i * 1.18], i % 3 ? cutPlane : deepShadow);
      seam.rotation.z = side * (0.04 + i * 0.012);
      seam.rotation.y = side * 0.05;
    });
  }

  [-11.8, -7.4, -3.1, 3.1, 7.4, 11.8].forEach((x, i) => {
    box('container amber inspection lamp', [0.08, 0.045, 0.62], [x, 5.03 + Math.sin(i) * 0.08, 2.85 - (i % 2) * 0.7], warmWorkLight);
  });
  [-13.75, 13.75].forEach((x) => {
    box('cool blue depth rim on cutaway wall', [0.05, 3.9, 0.08], [x, 2.9, -10.2], coolRim);
  });
}

function buildMacroCutawayFrame() {
  const outerRock = mat(0x0b0910, { roughness: 0.99, metalness: 0.0 });
  const cutFace = mat(0x2a222d, { roughness: 0.95, metalness: 0.01 });
  const seam = mat(0x463846, { roughness: 0.9, metalness: 0.02 });

  // Macro container read pass: oversized shoulders/crown/sill stay visible from the pulled-back overview.
  box('macro cutaway left asteroid shoulder mass', [2.2, 8.2, 25.5], [-18.7, 3.4, -2.1], outerRock);
  box('macro cutaway right asteroid shoulder mass', [2.2, 8.2, 25.5], [18.7, 3.4, -2.1], outerRock);
  box('macro cutaway upper crown mass', [37.0, 1.15, 16.5], [0, 7.0, -3.1], outerRock);
  box('macro cutaway foreground sill mass', [37.0, 0.85, 2.7], [0, -0.52, 7.85], outerRock);

  [-17.15, 17.15].forEach((x, sideIndex) => {
    const side = sideIndex === 0 ? -1 : 1;
    box('macro exposed vertical cut face', [0.22, 6.6, 8.8], [x, 3.35, 0.8], cutFace).rotation.z = side * 0.08;
    for (let i = 0; i < 8; i += 1) {
      const band = box('macro container sediment band', [0.07, 0.035, 4.9], [side * 16.72, 1.0 + i * 0.62, 5.0 - i * 1.55], seam);
      band.rotation.z = side * (0.06 + i * 0.01);
    }
  });

  for (let i = 0; i < 18; i += 1) {
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.72 + (i % 5) * 0.16, 0), outerRock);
    rock.name = 'macro cutaway crown silhouette rock';
    rock.position.set(-16.5 + i * 1.95, 6.45 + Math.sin(i * 0.7) * 0.38, 1.7 - (i % 3) * 1.7);
    rock.rotation.set(i * 0.29, i * 0.41, i * 0.18);
    rock.scale.set(1.75, 0.9 + (i % 3) * 0.2, 1.5);
    rock.castShadow = true;
    rock.receiveShadow = true;
    root.add(rock);
  }
}


function buildExteriorObservationShell() {
  const outerRock = mat(0x07060b, { roughness: 1.0, metalness: 0.0 });
  const innerRock = mat(0x17121b, { roughness: 0.98, metalness: 0.01 });
  const cutFace = mat(0x332936, { roughness: 0.94, metalness: 0.02 });
  const blueEdge = mat(0x467ecb, { emissive: 0x467ecb, emissiveIntensity: 0.2, transparent: true, opacity: 0.2 });
  const amberEdge = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.26, transparent: true, opacity: 0.25 });

  // Outside-in framing pass: build a readable exterior proscenium around the whole base at the default camera distance.
  // These masses intentionally sit beyond the previous room shell so the first read is "asteroid container", not interior wall.
  const masses = [
    ['wide overview outer left asteroid cheek', [2.9, 10.4, 31.5], [-22.6, 3.35, -3.2], -0.02],
    ['wide overview outer right asteroid cheek', [2.9, 10.4, 31.5], [22.6, 3.35, -3.2], 0.02],
    ['wide overview upper asteroid canopy', [43.8, 1.95, 20.2], [0, 8.45, -3.95], 0],
    ['wide overview lower asteroid observation sill', [43.4, 1.22, 4.2], [0, -1.05, 7.72], 0],
    ['wide overview rear upper cavern cap', [37.8, 1.28, 5.8], [0, 6.35, -15.45], 0],
    ['wide overview rear lower cavern floor lip', [35.4, 0.72, 4.6], [0, 0.22, -14.8], 0]
  ];

  masses.forEach(([name, size, position, rz]) => {
    const shell = box(name, size, position, outerRock);
    shell.rotation.z = rz;
  });

  [
    [-20.72, 3.65, 1.6, -0.06],
    [20.72, 3.65, 1.6, 0.06],
    [-20.24, 2.88, -7.2, 0.04],
    [20.24, 2.88, -7.2, -0.04],
    [-18.85, 4.85, -13.0, -0.03],
    [18.85, 4.85, -13.0, 0.03]
  ].forEach(([x, y, z, rz], i) => {
    const face = box('wide overview exposed asteroid cut cheek', [0.28, 6.8 - (i % 3) * 0.75, 6.4 + (i % 2) * 1.6], [x, y, z], cutFace);
    face.rotation.z = rz;
    face.rotation.y = x < 0 ? 0.05 : -0.05;
  });

  for (let i = 0; i < 34; i += 1) {
    const z = 8.0 - i * 0.72;
    [-1, 1].forEach((side) => {
      const radius = 0.82 + (i % 6) * 0.12;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(radius, 0), i % 4 === 0 ? cutFace : outerRock);
      rock.name = 'wide overview jagged exterior side silhouette';
      rock.position.set(side * (20.4 + Math.sin(i * 0.57) * 0.95), 0.32 + (i % 8) * 0.78, z + Math.cos(i * 0.43) * 0.42);
      rock.rotation.set(i * 0.22, side * i * 0.39, i * 0.31);
      rock.scale.set(1.55 + (i % 4) * 0.2, 1.08 + (i % 3) * 0.18, 1.75 + (i % 2) * 0.18);
      rock.castShadow = true;
      rock.receiveShadow = true;
      root.add(rock);
    });
  }

  for (let i = 0; i < 30; i += 1) {
    const x = -20.4 + i * 1.42;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.76 + (i % 5) * 0.13, 0), i % 3 === 0 ? innerRock : outerRock);
    rock.name = 'wide overview crown broken asteroid teeth';
    rock.position.set(x + Math.sin(i * 1.2) * 0.2, 7.52 + Math.sin(i * 0.52) * 0.55, 2.65 - (i % 5) * 1.06);
    rock.rotation.set(i * 0.28, i * 0.42, i * 0.18);
    rock.scale.set(1.78, 0.92 + (i % 4) * 0.16, 1.45 + (i % 3) * 0.12);
    rock.castShadow = true;
    rock.receiveShadow = true;
    root.add(rock);
  }

  for (let i = 0; i < 28; i += 1) {
    const x = -19.2 + i * 1.42;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.68 + (i % 4) * 0.14, 0), i % 3 ? outerRock : innerRock);
    rock.name = 'wide overview foreground sill broken asteroid teeth';
    rock.position.set(x + Math.cos(i * 0.81) * 0.32, 0.28 + (i % 3) * 0.11, 8.72 + Math.sin(i * 0.65) * 0.54);
    rock.rotation.set(i * 0.34, i * 0.2, i * 0.44);
    rock.scale.set(1.82, 0.76 + (i % 2) * 0.2, 1.28);
    rock.castShadow = true;
    rock.receiveShadow = true;
    root.add(rock);
  }

  for (let i = 0; i < 12; i += 1) {
    const y = 0.88 + i * 0.56;
    [-1, 1].forEach((side) => {
      const strip = box('wide overview blue cut-plane edge cue', [0.065, 0.035, 3.35 + (i % 3) * 0.85], [side * 19.62, y, 6.7 - i * 1.58], i % 2 ? blueEdge : amberEdge);
      strip.rotation.z = side * (0.03 + i * 0.008);
      strip.rotation.y = side * 0.08;
    });
  }
}

function buildVerticalSliceSurveyMarks() {
  const shadow = mat(0x050409, { roughness: 1.0, metalness: 0.0 });
  const strataDark = mat(0x211923, { roughness: 0.98, metalness: 0.01 });
  const strataLight = mat(0x443746, { roughness: 0.92, metalness: 0.02 });
  const amber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.22, transparent: true, opacity: 0.24 });
  const cyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.2, transparent: true, opacity: 0.2 });

  // Survey-style slice marks make the shell thickness readable from the pulled-back default view.
  const sideLevels = [
    [0.95, 7.15, 4.1],
    [1.55, 5.92, 3.65],
    [2.15, 4.35, 4.9],
    [2.78, 2.86, 3.4],
    [3.38, 1.25, 4.55],
    [3.98, -0.42, 3.7],
    [4.58, -2.15, 4.35],
    [5.16, -3.92, 3.2],
    [5.72, -5.65, 4.2],
    [6.26, -7.32, 3.55]
  ];

  sideLevels.forEach(([y, z, length], i) => {
    [-1, 1].forEach((side) => {
      const topBand = box('wide overview sidewall sediment datum', [0.09, 0.035, length], [side * 20.02, y, z], i % 2 ? strataLight : strataDark);
      topBand.rotation.z = side * (0.04 + i * 0.006);
      topBand.rotation.y = side * (0.09 - i * 0.004);

      const undercut = box('wide overview sidewall undercut shadow groove', [0.07, 0.026, length * 0.78], [side * 19.82, y - 0.18, z - 0.18], shadow);
      undercut.rotation.z = side * (0.02 + i * 0.004);
      undercut.rotation.y = side * 0.04;
    });
  });

  for (let i = 0; i < 14; i += 1) {
    const x = -18.2 + i * 2.8;
    const z = 5.85 - (i % 5) * 1.42;
    const crownBand = box('wide overview crown layered cut shelf', [1.65 + (i % 3) * 0.44, 0.055, 0.09], [x, 7.28 + Math.sin(i) * 0.08, z], i % 2 ? strataDark : strataLight);
    crownBand.rotation.y = -0.24 + (i % 4) * 0.13;

    const crownShadow = box('wide overview crown shelf shadow reveal', [1.22 + (i % 2) * 0.38, 0.04, 0.07], [x + 0.4, 7.04 + Math.cos(i) * 0.08, z - 0.42], shadow);
    crownShadow.rotation.y = 0.18 - (i % 3) * 0.11;
  }

  for (let i = 0; i < 13; i += 1) {
    const x = -17.1 + i * 2.85;
    const sillBand = box('wide overview foreground sill stratigraphy band', [1.85 + (i % 3) * 0.34, 0.05, 0.08], [x, 0.82 + Math.sin(i * 0.4) * 0.06, 8.12 + Math.cos(i) * 0.12], i % 2 ? strataLight : strataDark);
    sillBand.rotation.y = 0.2 - (i % 5) * 0.08;

    const locator = box('wide overview exterior amber survey locator', [0.08, 0.04, 0.35], [x + 0.75, 0.98 + (i % 2) * 0.05, 7.66], i % 3 === 0 ? cyan : amber);
    locator.rotation.y = sillBand.rotation.y;
  }

  [-14.8, -7.4, 0, 7.4, 14.8].forEach((x, i) => {
    const hanger = box('wide overview hanging plumb-line scale marker', [0.035, 1.4 + (i % 2) * 0.32, 0.035], [x, 5.95, 5.0 - (i % 3) * 1.1], i % 2 ? cyan : amber);
    hanger.rotation.z = (i - 2) * 0.015;
    box('wide overview plumb-line bottom weight', [0.16, 0.1, 0.16], [x, 5.16 - (i % 2) * 0.16, 5.0 - (i % 3) * 1.1], shadow);
  });
}

function buildRearProductionVoidExpansion() {
  const voidMat = mat(0x010208, { roughness: 1.0, metalness: 0.0 });
  const matteBlue = mat(0x07101f, { roughness: 0.86, metalness: 0.18 });
  const steel = mat(0x1a2635, { roughness: 0.5, metalness: 0.62 });
  const dimCyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.22, transparent: true, opacity: 0.18 });
  const dimAmber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.2, transparent: true, opacity: 0.18 });

  // Push the back of the slice outward with negative space. The station floor should feel like one balcony in a larger asteroid plant.
  [
    [-18.6, 29.0, 5.6, 0],
    [-22.4, 22.4, 4.7, 0.22],
    [-26.0, 16.8, 3.85, -0.12],
    [-30.2, 11.2, 3.0, 0.1]
  ].forEach(([z, width, height, ry], i) => {
    const voidPlane = box('wide overview rear production void matte layer', [width, height, 0.14], [0, 3.05 + i * 0.12, z], voidMat);
    voidPlane.rotation.y = ry * 0.03;
    box('wide overview rear production catwalk silhouette', [width * 0.78, 0.08, 0.42], [0, 1.22 + i * 0.52, z + 0.35], matteBlue);
    box('wide overview rear production upper truss silhouette', [width * 0.72, 0.075, 0.08], [0, 4.92 - i * 0.28, z + 0.22], steel);
    [-1, 1].forEach((side) => {
      box('wide overview rear production side pressure rib', [0.16, height * 0.76, 0.12], [side * (width * 0.42), 3.0, z + 0.24], steel);
      const diagonal = box('wide overview rear production diagonal support', [0.08, height * 0.62, 0.08], [side * (width * 0.33), 3.0, z + 0.28], matteBlue);
      diagonal.rotation.z = side * (0.18 + i * 0.03);
    });
  });

  for (let row = 0; row < 4; row += 1) {
    const z = -17.4 - row * 3.15;
    const width = 24.5 - row * 4.1;
    for (let i = 0; i < 9 - row; i += 1) {
      const x = -width * 0.42 + i * (width * 0.84 / (8 - row));
      const y = 2.0 + (i % 4) * 0.38 + row * 0.22;
      const window = box('wide overview far production bay pinlight', [0.18, 0.055, 0.035], [x, y, z], (i + row) % 2 ? dimCyan : dimAmber);
      window.rotation.y = (i - 4) * 0.015;
    }
  }

  [
    [-13.4, -16.2, COLORS.violet],
    [13.4, -16.2, COLORS.green],
    [-9.4, -20.8, COLORS.gold],
    [9.4, -20.8, COLORS.coral]
  ].forEach(([x, z, color], i) => {
    const shaftMat = mat(color, { emissive: color, emissiveIntensity: 0.18, transparent: true, opacity: 0.14 });
    const shaft = new THREE.Mesh(new THREE.PlaneGeometry(1.8, 7.2 - i * 0.65), shaftMat);
    shaft.name = 'wide overview rear atmospheric depth shaft';
    shaft.position.set(x, 3.24, z);
    shaft.rotation.x = -0.03;
    shaft.rotation.z = x < 0 ? 0.04 : -0.04;
    root.add(shaft);
    animated.push((t) => { shaft.material.opacity = 0.11 + Math.sin(t * 0.42 + i) * 0.018; });
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


function buildMineMouthOuterAperture() {
  const basalt = mat(0x05040a, { roughness: 1.0, metalness: 0.0 });
  const pressureRock = mat(0x0e0a12, { roughness: 1.0, metalness: 0.0 });
  const cutFace = mat(0x3a2e3b, { roughness: 0.94, metalness: 0.01 });
  const shadow = mat(0x010106, { roughness: 1.0, metalness: 0.0 });
  const coldDust = mat(0x23334a, { emissive: 0x0f2237, emissiveIntensity: 0.12, transparent: true, opacity: 0.22, roughness: 0.92 });
  const amberDust = mat(0x4a3218, { emissive: COLORS.amber, emissiveIntensity: 0.12, transparent: true, opacity: 0.16, roughness: 0.88 });

  // Mine-mouth pass: a bigger, rougher outside contour sits in front of the room shell.
  // The camera should read this as a carved asteroid face with the base exposed inside it.
  const apertureMasses = [
    ['mine-mouth far left exterior asteroid mass', [4.1, 12.4, 38.0], [-27.2, 3.55, -3.6], -0.055],
    ['mine-mouth far right exterior asteroid mass', [4.1, 12.4, 38.0], [27.2, 3.55, -3.6], 0.055],
    ['mine-mouth high overburden asteroid cap', [51.0, 2.45, 24.5], [0, 9.95, -4.5], -0.006],
    ['mine-mouth lower foreground broken lip', [50.0, 1.7, 5.45], [0, -1.82, 8.88], 0.006],
    ['mine-mouth back pressure shadow lintel', [43.0, 1.05, 4.6], [0, 7.15, -18.15], 0],
    ['mine-mouth back lower occluding shelf', [39.5, 0.62, 3.4], [0, 0.05, -17.55], 0]
  ];

  apertureMasses.forEach(([name, size, position, rz]) => {
    const mesh = box(name, size, position, basalt);
    mesh.rotation.z = rz;
  });

  const cheekFaces = [
    [-24.3, 3.8, 6.6, 7.8, -0.09],
    [24.3, 3.8, 6.6, 7.8, 0.09],
    [-25.0, 4.05, -1.8, 8.8, 0.055],
    [25.0, 4.05, -1.8, 8.8, -0.055],
    [-23.5, 4.38, -11.3, 6.8, -0.035],
    [23.5, 4.38, -11.3, 6.8, 0.035],
    [-21.2, 5.05, -18.25, 4.2, 0.025],
    [21.2, 5.05, -18.25, 4.2, -0.025]
  ];

  cheekFaces.forEach(([x, y, z, depth, rz], i) => {
    const face = box('mine-mouth broad exposed blasted cut face', [0.34, 7.4 - (i % 4) * 0.58, depth], [x, y, z], i % 3 === 0 ? pressureRock : cutFace);
    face.rotation.z = rz;
    face.rotation.y = x < 0 ? 0.07 : -0.07;
  });

  for (let i = 0; i < 44; i += 1) {
    const z = 10.2 - i * 0.78;
    [-1, 1].forEach((side) => {
      const scale = 0.96 + (i % 7) * 0.14;
      const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(scale, 0), i % 5 === 0 ? cutFace : basalt);
      rock.name = 'mine-mouth exterior broken side boulder';
      rock.position.set(side * (23.6 + Math.sin(i * 0.51) * 1.35), 0.15 + (i % 9) * 0.86, z + Math.cos(i * 0.33) * 0.7);
      rock.rotation.set(i * 0.22, side * i * 0.36, i * 0.47);
      rock.scale.set(1.9 + (i % 5) * 0.18, 1.05 + (i % 4) * 0.18, 1.78 + (i % 3) * 0.22);
      rock.castShadow = true;
      rock.receiveShadow = true;
      root.add(rock);
    });
  }

  for (let i = 0; i < 38; i += 1) {
    const x = -23.4 + i * 1.25;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.88 + (i % 6) * 0.12, 0), i % 4 === 0 ? pressureRock : basalt);
    rock.name = 'mine-mouth overhead fractured crown tooth';
    rock.position.set(x + Math.sin(i * 0.82) * 0.28, 8.64 + Math.sin(i * 0.37) * 0.66, 5.6 - (i % 8) * 1.38);
    rock.rotation.set(i * 0.31, i * 0.26, i * 0.21);
    rock.scale.set(1.9 + (i % 4) * 0.16, 0.86 + (i % 5) * 0.13, 1.6);
    rock.castShadow = true;
    rock.receiveShadow = true;
    root.add(rock);
  }

  for (let i = 0; i < 36; i += 1) {
    const x = -22.8 + i * 1.3;
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(0.74 + (i % 5) * 0.13, 0), i % 3 === 0 ? pressureRock : basalt);
    rock.name = 'mine-mouth foreground parallax sill boulder';
    rock.position.set(x + Math.cos(i * 0.76) * 0.4, -0.18 + (i % 4) * 0.12, 10.15 + Math.sin(i * 0.6) * 0.75);
    rock.rotation.set(i * 0.44, i * 0.18, i * 0.3);
    rock.scale.set(2.15, 0.72 + (i % 3) * 0.16, 1.34 + (i % 2) * 0.16);
    rock.castShadow = true;
    rock.receiveShadow = true;
    root.add(rock);
  }

  [-20.8, -15.4, -10.2, -5.1, 0, 5.1, 10.2, 15.4, 20.8].forEach((x, i) => {
    const slit = box('mine-mouth foreground shadow slot between rock and glass', [1.55 + (i % 2) * 0.5, 0.07, 0.12], [x, 0.46 + (i % 3) * 0.04, 9.28], shadow);
    slit.rotation.y = -0.14 + i * 0.035;
  });

  for (let i = 0; i < 10; i += 1) {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(3.7 + (i % 3) * 0.8, 1.25 + (i % 2) * 0.42), i % 2 ? coldDust : amberDust);
    plane.name = 'mine-mouth exterior dust pocket separating shell from room';
    plane.position.set(-19.2 + i * 4.25, 1.15 + (i % 4) * 0.72, 8.35 - (i % 3) * 1.24);
    plane.rotation.x = -0.18;
    plane.rotation.z = -0.08 + (i % 5) * 0.04;
    root.add(plane);
    animated.push((t) => { plane.material.opacity = (i % 2 ? 0.18 : 0.12) + Math.sin(t * 0.28 + i) * 0.018; });
  }
}


function buildApertureDepthOcclusionMasks() {
  const black = mat(0x000105, { roughness: 1.0, metalness: 0.0, transparent: true, opacity: 0.74 });
  const softBlue = mat(0x0a1728, { emissive: 0x102b48, emissiveIntensity: 0.14, transparent: true, opacity: 0.22, roughness: 0.9 });
  const softAmber = mat(0x211509, { emissive: COLORS.amber, emissiveIntensity: 0.1, transparent: true, opacity: 0.18, roughness: 0.9 });
  const seam = mat(0x352a35, { roughness: 0.96, metalness: 0.02 });

  // Dark masks intentionally occlude the rectangular room edges so the full frame reads as an irregular rock aperture.
  const occluders = [
    ['left aperture occlusion wedge upper', [-23.2, 6.55, 1.8], [0.72, 3.0, 11.0], -0.13],
    ['left aperture occlusion wedge lower', [-23.0, 1.15, 5.6], [0.82, 2.1, 8.6], 0.1],
    ['left aperture occlusion wedge rear', [-22.0, 5.2, -13.2], [0.62, 2.8, 7.4], -0.06],
    ['right aperture occlusion wedge upper', [23.2, 6.55, 1.8], [0.72, 3.0, 11.0], 0.13],
    ['right aperture occlusion wedge lower', [23.0, 1.15, 5.6], [0.82, 2.1, 8.6], -0.1],
    ['right aperture occlusion wedge rear', [22.0, 5.2, -13.2], [0.62, 2.8, 7.4], 0.06],
    ['top aperture occlusion shelf left', [-12.4, 8.36, 1.7], [13.2, 0.74, 9.6], -0.03],
    ['top aperture occlusion shelf right', [12.4, 8.36, 1.7], [13.2, 0.74, 9.6], 0.03],
    ['front aperture occlusion sill left', [-12.6, -0.24, 9.9], [13.8, 0.56, 1.34], 0.02],
    ['front aperture occlusion sill right', [12.6, -0.24, 9.9], [13.8, 0.56, 1.34], -0.02]
  ];

  occluders.forEach(([name, position, size, rz]) => {
    const mask = box(name, size, position, black);
    mask.rotation.z = rz;
    mask.renderOrder = 2;
  });

  for (let i = 0; i < 14; i += 1) {
    const z = 8.8 - i * 1.45;
    [-1, 1].forEach((side) => {
      const slot = box('aperture depth alternating side shadow slot', [0.08, 0.34 + (i % 3) * 0.08, 1.0 + (i % 2) * 0.36], [side * 22.42, 1.18 + (i % 6) * 0.76, z], i % 2 ? softBlue : softAmber);
      slot.rotation.z = side * (0.08 + i * 0.006);
      slot.rotation.y = side * 0.08;
    });
  }

  for (let i = 0; i < 16; i += 1) {
    const x = -20.0 + i * 2.65;
    const ceilingCrack = box('aperture top negative-space crack', [1.3 + (i % 4) * 0.35, 0.045, 0.08], [x, 8.05 + Math.sin(i * 0.5) * 0.05, 6.4 - (i % 6) * 1.12], black);
    ceilingCrack.rotation.y = -0.2 + (i % 5) * 0.1;
    const lipHighlight = box('aperture top thin sliced edge catchlight', [1.05 + (i % 3) * 0.28, 0.035, 0.06], [x + 0.32, 7.9, 6.08 - (i % 6) * 1.12], i % 2 ? softBlue : seam);
    lipHighlight.rotation.y = ceilingCrack.rotation.y * 0.75;
  }

  for (let i = 0; i < 15; i += 1) {
    const x = -19.6 + i * 2.8;
    const crack = box('aperture foreground sill negative-space crack', [1.18 + (i % 4) * 0.34, 0.05, 0.07], [x, 0.38 + Math.sin(i * 0.4) * 0.04, 9.72 + Math.cos(i) * 0.1], black);
    crack.rotation.y = 0.22 - (i % 6) * 0.08;
    const chip = box('aperture foreground sliced chip highlight', [0.72 + (i % 3) * 0.24, 0.036, 0.055], [x + 0.48, 0.58, 9.44], i % 3 === 0 ? softAmber : seam);
    chip.rotation.y = crack.rotation.y * 0.8;
  }
}

function buildCutawayThicknessDatumStack() {
  const deep = mat(0x030208, { roughness: 1.0, metalness: 0.0 });
  const mid = mat(0x241b27, { roughness: 0.96, metalness: 0.01 });
  const light = mat(0x514050, { roughness: 0.9, metalness: 0.02 });
  const warm = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.24, transparent: true, opacity: 0.22 });
  const cool = mat(0x77b7ff, { emissive: 0x77b7ff, emissiveIntensity: 0.2, transparent: true, opacity: 0.2 });

  // These datum layers turn the decorative rock frame into a measured vertical slice of material.
  const sideStrata = [
    [0.78, 9.1, 5.2, -0.12],
    [1.18, 7.95, 4.6, -0.08],
    [1.62, 6.65, 5.8, -0.04],
    [2.06, 5.18, 4.7, 0.01],
    [2.5, 3.75, 6.2, 0.05],
    [2.92, 2.22, 4.85, 0.09],
    [3.38, 0.7, 5.6, 0.12],
    [3.84, -0.95, 4.5, 0.08],
    [4.32, -2.58, 5.1, 0.04],
    [4.78, -4.24, 4.4, -0.02],
    [5.23, -5.88, 5.0, -0.06],
    [5.68, -7.55, 3.9, -0.1],
    [6.12, -9.0, 3.4, -0.13]
  ];

  sideStrata.forEach(([y, z, length, angle], i) => {
    [-1, 1].forEach((side) => {
      const material = i % 3 === 0 ? light : i % 3 === 1 ? mid : deep;
      const band = box('expanded cutaway sidewall geological datum band', [0.11, 0.04, length], [side * 22.1, y, z], material);
      band.rotation.z = side * (0.035 + i * 0.006);
      band.rotation.y = side * angle;

      const shadow = box('expanded cutaway sidewall recess shadow under datum', [0.075, 0.032, length * 0.78], [side * 21.74, y - 0.16, z - 0.18], deep);
      shadow.rotation.z = band.rotation.z * 0.8;
      shadow.rotation.y = band.rotation.y * 0.65;
    });
  });

  for (let i = 0; i < 18; i += 1) {
    const x = -21.2 + i * 2.5;
    const z = 7.6 - (i % 7) * 1.05;
    const layer = box('expanded cutaway overhead compression shelf', [1.72 + (i % 4) * 0.45, 0.06, 0.1], [x, 8.28 + Math.sin(i * 0.5) * 0.08, z], i % 2 ? mid : light);
    layer.rotation.y = -0.28 + (i % 6) * 0.1;
    const under = box('expanded cutaway overhead dark undercut', [1.15 + (i % 3) * 0.38, 0.043, 0.08], [x + 0.5, 8.02 + Math.cos(i * 0.7) * 0.08, z - 0.38], deep);
    under.rotation.y = layer.rotation.y * 0.7;
  }

  for (let i = 0; i < 17; i += 1) {
    const x = -20.4 + i * 2.55;
    const z = 9.18 + Math.sin(i * 0.55) * 0.25;
    const shelf = box('expanded cutaway foreground sill horizontal layer', [1.8 + (i % 4) * 0.32, 0.055, 0.09], [x, 0.68 + Math.sin(i * 0.45) * 0.05, z], i % 2 ? light : mid);
    shelf.rotation.y = 0.24 - (i % 6) * 0.07;

    const pocket = box('expanded cutaway foreground occlusion crack', [1.2 + (i % 3) * 0.3, 0.04, 0.07], [x + 0.38, 0.52, z + 0.24], deep);
    pocket.rotation.y = shelf.rotation.y * 0.8;
  }

  for (let i = 0; i < 12; i += 1) {
    const y = 1.0 + i * 0.43;
    [-1, 1].forEach((side) => {
      const locator = box('expanded cutaway depth station locator tick', [0.08, 0.04, 0.42], [side * 21.18, y, 8.45 - i * 1.22], i % 2 ? cool : warm);
      locator.rotation.z = side * 0.08;
      locator.rotation.y = side * 0.1;
    });
  }

  const scalePosts = [
    [-18.2, 7.58, 5.55, 1.55],
    [-9.1, 7.74, 3.55, 1.2],
    [0, 7.62, 4.9, 1.65],
    [9.1, 7.72, 3.55, 1.2],
    [18.2, 7.56, 5.55, 1.55]
  ];

  scalePosts.forEach(([x, y, z, drop], i) => {
    const line = box('expanded cutaway hanging geologic scale line', [0.035, drop, 0.035], [x, y - drop * 0.5, z], i % 2 ? cool : warm);
    line.rotation.z = -0.02 + i * 0.01;
    const weight = box('expanded cutaway hanging scale weight', [0.18, 0.12, 0.18], [x, y - drop - 0.06, z], deep);
    weight.rotation.y = i * 0.35;
  });

  for (let i = 0; i < 24; i += 1) {
    const z = 6.7 - i * 0.58;
    [-1, 1].forEach((side) => {
      const pebble = new THREE.Mesh(new THREE.DodecahedronGeometry(0.16 + (i % 4) * 0.035, 0), i % 2 ? mid : light);
      pebble.name = 'expanded cutaway small exposed aggregate pebble';
      pebble.position.set(side * (21.35 + Math.sin(i) * 0.25), 0.92 + (i % 7) * 0.67, z);
      pebble.rotation.set(i * 0.19, side * i * 0.33, i * 0.27);
      pebble.scale.set(1.4, 0.7 + (i % 3) * 0.15, 0.95);
      pebble.castShadow = true;
      pebble.receiveShadow = true;
      root.add(pebble);
    });
  }
}

function buildProductionCavernParallaxScales() {
  const voidMat = mat(0x000106, { roughness: 1.0, metalness: 0.0 });
  const deck = mat(0x07101c, { roughness: 0.68, metalness: 0.42 });
  const rail = mat(0x263448, { roughness: 0.48, metalness: 0.62 });
  const graphite = mat(0x101724, { roughness: 0.62, metalness: 0.5 });
  const dimCyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.18, transparent: true, opacity: 0.16 });
  const dimAmber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.16, transparent: true, opacity: 0.15 });
  const vapor = (color, opacity) => mat(color, { emissive: color, emissiveIntensity: 0.12, transparent: true, opacity, side: THREE.DoubleSide, roughness: 0.2 });

  // New negative space: side galleries and back-plane gantries make the four visible districts feel like one slice of a much larger plant.
  const rearLayers = [
    [-22.5, 31.5, 5.8, 0.0],
    [-27.0, 25.5, 5.0, 0.05],
    [-31.8, 18.5, 4.0, -0.05],
    [-37.2, 12.0, 3.2, 0.04]
  ];

  rearLayers.forEach(([z, width, height, tilt], i) => {
    const portal = box('parallax rear excavated production void layer', [width, height, 0.12], [0, 3.0 + i * 0.18, z], voidMat);
    portal.rotation.y = tilt;
    box('parallax rear suspended maintenance deck', [width * 0.76, 0.075, 0.52], [0, 1.08 + i * 0.45, z + 0.45], deck);
    box('parallax rear upper pipe bridge', [width * 0.72, 0.075, 0.08], [0, 4.92 - i * 0.28, z + 0.24], rail);
    box('parallax rear lower pipe bridge', [width * 0.54, 0.055, 0.07], [0, 2.1 + i * 0.22, z + 0.22], rail);

    [-1, 1].forEach((side) => {
      box('parallax rear vertical hoist spine', [0.18, height * 0.75, 0.11], [side * (width * 0.43), 2.95, z + 0.26], graphite);
      box('parallax rear inner pressure post', [0.11, height * 0.58, 0.09], [side * (width * 0.28), 2.8, z + 0.3], rail);
      const braceA = box('parallax rear diagonal roof brace', [0.07, height * 0.64, 0.07], [side * (width * 0.34), 3.15, z + 0.34], graphite);
      braceA.rotation.z = side * (0.22 + i * 0.035);
      const braceB = box('parallax rear diagonal floor brace', [0.06, height * 0.42, 0.06], [side * (width * 0.18), 1.7 + i * 0.16, z + 0.34], graphite);
      braceB.rotation.z = side * (-0.28 + i * 0.025);
    });
  });

  const sideGalleries = [
    [-18.7, -6.2, COLORS.violet, 'left observatory service gallery'],
    [-18.5, 2.4, COLORS.gold, 'left build transfer gallery'],
    [18.7, -6.2, COLORS.green, 'right deploy service gallery'],
    [18.5, 2.4, COLORS.coral, 'right review transfer gallery']
  ];

  sideGalleries.forEach(([x, z, color, label], index) => {
    const side = x < 0 ? -1 : 1;
    const accent = mat(color, { emissive: color, emissiveIntensity: 0.26, transparent: true, opacity: 0.22 });
    const darkAccent = mat(color, { emissive: color, emissiveIntensity: 0.12, transparent: true, opacity: 0.12 });
    const gallery = new THREE.Group();
    gallery.name = label;
    gallery.position.set(x, 0, z);
    root.add(gallery);

    box('parallax side gallery recessed black mouth', [0.18, 2.4, 4.4], [0, 2.1, 0], voidMat, gallery);
    box('parallax side gallery exterior pressure frame', [0.24, 2.95, 4.85], [side * -0.16, 2.18, 0], graphite, gallery);
    box('parallax side gallery catwalk slab', [0.72, 0.08, 3.72], [side * 0.08, 1.0, 0.18], deck, gallery);
    box('parallax side gallery lit handrail', [0.06, 0.05, 3.42], [side * 0.48, 1.32, 0.16], accent, gallery);
    box('parallax side gallery rear handrail shadow', [0.04, 0.035, 3.0], [side * 0.18, 1.26, -0.22], rail, gallery);

    for (let i = 0; i < 5; i += 1) {
      const zz = -1.8 + i * 0.9;
      box('parallax side gallery vertical bay divider', [0.055, 1.52, 0.045], [side * 0.36, 1.88, zz], rail, gallery);
      box('parallax side gallery tiny work window', [0.06, 0.16, 0.34], [side * 0.5, 2.0 + (i % 2) * 0.24, zz + 0.12], i % 2 ? accent : darkAccent, gallery);
    }

    const vaporPlane = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 4.2), vapor(color, 0.035));
    vaporPlane.name = 'parallax side gallery atmospheric slit';
    vaporPlane.position.set(x + side * 0.36, 2.18, z + 0.1);
    vaporPlane.rotation.y = side * Math.PI / 2;
    root.add(vaporPlane);
    animated.push((t) => { vaporPlane.material.opacity = 0.025 + Math.sin(t * 0.45 + index) * 0.008; });
  });

  const roomAnchors = [
    ['build', COLORS.gold, -14.2, -18.8],
    ['review', COLORS.coral, 14.2, -18.8],
    ['observatory', COLORS.violet, -11.2, -24.0],
    ['deploy', COLORS.green, 11.2, -24.0]
  ];

  roomAnchors.forEach(([roomId, color, sx, dz], i) => {
    const [x, , z] = ROOMS[roomId].pos;
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(x * 0.92, 1.65, z - 0.4),
      new THREE.Vector3((x + sx) * 0.52, 2.0 + i * 0.1, z - 4.8),
      new THREE.Vector3(sx, 2.65 + i * 0.12, dz)
    ]);
    const tube = new THREE.Mesh(
      new THREE.TubeGeometry(curve, 36, 0.026, 8, false),
      mat(color, { emissive: color, emissiveIntensity: 0.22, transparent: true, opacity: 0.2 })
    );
    tube.name = `parallax ${roomId} district umbilical into rear plant`;
    root.add(tube);
  });

  for (let row = 0; row < 5; row += 1) {
    const z = -19.6 - row * 3.7;
    const width = 28.0 - row * 4.6;
    const count = 10 - row;
    for (let i = 0; i < count; i += 1) {
      const x = -width * 0.42 + i * (width * 0.84 / Math.max(1, count - 1));
      const y = 1.72 + row * 0.34 + (i % 4) * 0.26;
      const lightMat = (row + i) % 2 ? dimCyan : dimAmber;
      const window = box('parallax far plant tiny readable scale light', [0.14, 0.045, 0.035], [x, y, z], lightMat);
      window.rotation.y = (i - count / 2) * 0.012;
    }
  }

  [
    [-15.8, -20.4, COLORS.violet, 1.0],
    [15.8, -20.4, COLORS.green, 0.8],
    [-10.0, -27.2, COLORS.gold, 0.6],
    [10.0, -27.2, COLORS.coral, 0.4],
    [0, -33.5, COLORS.cyan, 0.2]
  ].forEach(([x, z, color, phase], i) => {
    const shaft = new THREE.Mesh(new THREE.PlaneGeometry(2.3 - i * 0.18, 8.4 - i * 0.8), vapor(color, 0.026 - i * 0.002));
    shaft.name = 'parallax rear deep atmospheric shaft';
    shaft.position.set(x, 3.2 + i * 0.12, z);
    shaft.rotation.x = -0.025;
    shaft.rotation.z = x < 0 ? 0.045 : x > 0 ? -0.045 : 0;
    root.add(shaft);
    animated.push((t) => { shaft.material.opacity = 0.018 + Math.sin(t * 0.32 + phase) * 0.006; });
  });
}

function buildWideReadabilityRimStack() {
  const topKey = addLight('directional', 0xe0e9ff, 0.48, [0, 16.5, 24.0]);
  topKey.name = 'wide readability soft top key';
  topKey.target.position.set(0, 1.8, -5.8);
  scene.add(topKey.target);

  const rearBlue = addLight('directional', 0x7eb8ff, 0.62, [0, 7.4, -28.0]);
  rearBlue.name = 'wide readability rear cavern rim key';
  rearBlue.target.position.set(0, 2.2, -4.4);
  scene.add(rearBlue.target);

  addLight('point', 0x93c3ff, 2.4, [-22.4, 7.4, 7.6], 24.0);
  addLight('point', 0x93c3ff, 2.4, [22.4, 7.4, 7.6], 24.0);
  addLight('point', COLORS.amber, 1.65, [-21.0, 0.85, 9.0], 18.0);
  addLight('point', COLORS.amber, 1.65, [21.0, 0.85, 9.0], 18.0);
  addLight('point', 0x6aa7ff, 2.0, [0, 5.2, -24.0], 26.0);

  const beamMat = (color, opacity) => mat(color, {
    emissive: color,
    emissiveIntensity: 0.14,
    transparent: true,
    opacity,
    side: THREE.DoubleSide,
    roughness: 0.1,
    metalness: 0.0
  });

  const readableWashes = [
    [-13.4, 2.35, 1.65, 6.0, 2.35, COLORS.gold, 0.03, -0.08],
    [13.4, 2.35, 1.65, 6.0, 2.35, COLORS.coral, 0.03, 0.08],
    [-13.6, 2.45, -8.95, 6.0, 2.45, COLORS.violet, 0.028, -0.07],
    [13.6, 2.45, -8.95, 6.0, 2.45, COLORS.green, 0.028, 0.07],
    [0, 2.7, -3.4, 9.8, 2.8, COLORS.cyan, 0.018, 0]
  ];

  readableWashes.forEach(([x, y, z, w, h, color, opacity, rz], i) => {
    const wash = new THREE.Mesh(new THREE.PlaneGeometry(w, h), beamMat(color, opacity));
    wash.name = 'wide readability controlled district silhouette wash';
    wash.position.set(x, y, z);
    wash.rotation.x = -0.22;
    wash.rotation.z = rz;
    root.add(wash);
    animated.push((t) => { wash.material.opacity = opacity + Math.sin(t * 0.38 + i) * 0.004; });
  });

  const rimSegments = [
    [-21.2, 3.2, 4.4, 0.05, 3.8, COLORS.cyan],
    [21.2, 3.2, 4.4, 0.05, 3.8, COLORS.cyan],
    [-21.2, 3.1, -7.4, 0.05, 4.4, COLORS.amber],
    [21.2, 3.1, -7.4, 0.05, 4.4, COLORS.amber],
    [-16.4, 6.7, 5.0, 6.2, 0.045, COLORS.cyan],
    [16.4, 6.7, 5.0, 6.2, 0.045, COLORS.cyan],
    [-8.2, 6.9, -3.2, 7.0, 0.045, COLORS.amber],
    [8.2, 6.9, -3.2, 7.0, 0.045, COLORS.amber]
  ];

  rimSegments.forEach(([x, y, z, width, height, color], i) => {
    const size = width < 0.1 ? [0.06, height, 0.055] : [width, height, 0.055];
    const rim = box('wide readability rim highlight along asteroid aperture', size, [x, y, z], beamMat(color, i % 2 ? 0.19 : 0.16));
    rim.rotation.z = x < 0 ? -0.04 : 0.04;
  });

  const fogBands = [
    [0, 3.9, -14.5, 26.0, 3.2, 0x77b7ff, 0.028],
    [0, 4.5, -20.4, 20.0, 3.0, 0x77b7ff, 0.02],
    [0, 2.15, 6.7, 32.0, 1.8, COLORS.amber, 0.014]
  ];

  fogBands.forEach(([x, y, z, w, h, color, opacity], i) => {
    const fog = new THREE.Mesh(new THREE.PlaneGeometry(w, h), beamMat(color, opacity));
    fog.name = 'wide readability atmospheric depth veil';
    fog.position.set(x, y, z);
    fog.rotation.x = -0.08;
    root.add(fog);
    animated.push((t) => { fog.material.opacity = opacity + Math.sin(t * 0.22 + i) * 0.004; });
  });
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

function buildMacroRevealLighting() {
  const districtGlow = (roomId, color, label) => {
    const [x, , z] = ROOMS[roomId].pos;
    addLight('point', color, 1.85, [x, 2.35, z + 1.0], 7.2);
    const pool = new THREE.Mesh(
      new THREE.PlaneGeometry(4.8, 2.3),
      mat(color, { emissive: color, emissiveIntensity: 0.24, transparent: true, opacity: 0.038, side: THREE.DoubleSide, roughness: 0.1 })
    );
    pool.name = `macro ${label} station reveal glow plane`;
    pool.position.set(x, 1.32, z + 0.42);
    pool.rotation.x = -0.18;
    root.add(pool);
    animated.push((t) => { pool.material.opacity = 0.028 + Math.sin(t * 0.65 + x) * 0.007; });
  };

  districtGlow('build', COLORS.gold, 'build');
  districtGlow('review', COLORS.coral, 'review');
  districtGlow('deploy', COLORS.green, 'deploy');
  districtGlow('observatory', COLORS.violet, 'observatory');

  addLight('point', 0x8ebcff, 2.8, [0, 6.3, -17.2], 24);
  addLight('point', COLORS.amber, 2.1, [0, 5.9, 6.5], 19);
}

function buildAsteroidField() {
  const matRock = mat(0x262235, { roughness: 0.86 });
  for (let i = 0; i < 34; i += 1) {
    const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(0.035 + Math.random() * 0.12, 0), matRock);
    rock.position.set(-8.8 + Math.random() * 17.6, 1.4 + Math.random() * 3.4, -11.4 - Math.random() * 10);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    scene.add(rock);
    animated.push((t) => { rock.rotation.y += 0.001 + i * 0.00002; rock.position.x += Math.sin(t * 0.08 + i) * 0.0008; });
  }
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

function buildServiceDrones() {
  for (let i = 0; i < 3; i += 1) {
    const drone = new THREE.Group();
    drone.position.set(-1.6 + i * 1.6, 1.55 + i * 0.18, -0.7 - i * 0.55);
    root.add(drone);
    const body = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), mat(COLORS.blackMetal, { roughness: 0.22, metalness: 0.7 }));
    drone.add(body);
    box('drone eye', [0.06, 0.03, 0.018], [0, 0.02, 0.115], mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 1.5, transparent: true, opacity: 0.88 }), drone);
    signalOrbs.push({ mesh: body, index: 10 + i, base: 1 });
    animated.push((t) => {
      drone.position.y = 1.52 + i * 0.18 + Math.sin(t * 1.3 + i) * 0.12;
      drone.position.x += Math.sin(t * 0.5 + i) * 0.0015;
      drone.rotation.y += 0.012;
    });
  }
}

function buildRemoteBayMaintenanceDrones() {
  // Asset pipeline pass: hand-blocked proxy for a compact remote-bay maintenance drone kit.
  const bayIds = ['build', 'review', 'deploy', 'observatory'];
  bayIds.forEach((id, index) => {
    const room = ROOMS[id];
    const [rx, , rz] = room.pos;
    const side = rx < 0 ? 1 : -1;
    const drone = new THREE.Group();
    drone.name = `${room.label} remote bay maintenance drone proxy`;
    drone.position.set(rx + side * 1.48, 1.08, rz + 0.84);
    drone.rotation.y = side > 0 ? -0.42 : 0.42;
    root.add(drone);

    const body = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.18, 0.26), mat(0x111827, { roughness: 0.34, metalness: 0.68 }));
    body.castShadow = true;
    body.receiveShadow = true;
    drone.add(body);

    const nose = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.115, 0.18, 16), mat(COLORS.brushedSteel, { roughness: 0.28, metalness: 0.76 }));
    nose.rotation.x = Math.PI / 2;
    nose.position.z = -0.2;
    nose.castShadow = true;
    drone.add(nose);

    box('remote bay drone optic slit', [0.18, 0.035, 0.018], [0, 0.025, -0.335], mat(room.accent, { emissive: room.accent, emissiveIntensity: 1.4, transparent: true, opacity: 0.82 }), drone);
    box('remote bay drone top antenna', [0.035, 0.24, 0.035], [0.11 * side, 0.2, 0.02], mat(COLORS.brushedSteel, { roughness: 0.32, metalness: 0.82 }), drone);
    box('remote bay drone left clamp arm', [0.05, 0.05, 0.32], [-0.22, -0.035, -0.02], mat(COLORS.brushedSteel, { roughness: 0.36, metalness: 0.78 }), drone);
    box('remote bay drone right clamp arm', [0.05, 0.05, 0.32], [0.22, -0.035, -0.02], mat(COLORS.brushedSteel, { roughness: 0.36, metalness: 0.78 }), drone);
    box('remote bay drone service tool glow', [0.035, 0.035, 0.22], [0.22, -0.08, -0.23], mat(room.accent, { emissive: room.accent, emissiveIntensity: 1.05, transparent: true, opacity: 0.72 }), drone);

    const repairSpark = box('remote bay drone repair spark marker', [0.045, 0.045, 0.045], [side * -0.28, -0.12, -0.34], mat(room.accent, { emissive: room.accent, emissiveIntensity: 1.8, transparent: true, opacity: 0.88 }), drone);
    animated.push((t) => {
      drone.position.y = 1.08 + Math.sin(t * 1.35 + index) * 0.08;
      drone.rotation.z = Math.sin(t * 0.9 + index) * 0.045;
      repairSpark.material.opacity = 0.48 + Math.max(0, Math.sin(t * 4.2 + index)) * 0.42;
    });
  });
}

function buildExteriorVista() {
  const planetCanvas = document.createElement('canvas');
  planetCanvas.width = 512;
  planetCanvas.height = 512;
  const ctx = planetCanvas.getContext('2d');
  const grd = ctx.createRadialGradient(230, 210, 40, 256, 256, 240);
  grd.addColorStop(0, 'rgba(145, 210, 255, 0.95)');
  grd.addColorStop(0.45, 'rgba(56, 104, 152, 0.7)');
  grd.addColorStop(1, 'rgba(8, 16, 34, 0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, 512, 512);
  const tex = new THREE.CanvasTexture(planetCanvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const planet = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, opacity: 0.46 }));
  planet.position.set(4.2, 2.8, -12.5);
  planet.scale.set(3.2, 3.2, 1);
  scene.add(planet);

  const ship = new THREE.Group();
  ship.position.set(-2.6, 2.05, -7.4);
  scene.add(ship);
  box('distant dock ship hull', [1.5, 0.16, 0.34], [0, 0, 0], mat(0x111827, { roughness: 0.42, metalness: 0.6 }), ship);
  box('distant dock ship nose', [0.36, 0.12, 0.26], [0.9, 0.01, 0], mat(0x1f2937, { roughness: 0.4, metalness: 0.65 }), ship);
  box('distant dock ship amber running light', [0.06, 0.035, 0.035], [-0.72, 0.09, 0.18], mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 1.2, transparent: true, opacity: 0.8 }), ship);
  animated.push((t) => { ship.position.y = 2.05 + Math.sin(t * 0.35) * 0.04; });
}

function buildDistantFacilityDepth() {
  const shadowSteel = mat(0x0b101b, { roughness: 0.58, metalness: 0.48 });
  const dimAmber = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.32, transparent: true, opacity: 0.34 });
  const dimCyan = mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.26, transparent: true, opacity: 0.24 });

  [-7.8, 0, 7.8].forEach((x, i) => {
    box('distant hangar service deck', [3.2, 0.1, 0.55], [x, 1.22 + i * 0.18, -8.55 - i * 0.5], shadowSteel);
    box('distant hangar lower rail', [3.1, 0.035, 0.035], [x, 1.45 + i * 0.18, -8.26 - i * 0.5], dimAmber);
    box('distant maintenance pylon', [0.16, 1.8, 0.16], [x - 1.45, 2.0 + i * 0.18, -8.45 - i * 0.5], shadowSteel);
    box('distant maintenance pylon', [0.16, 1.8, 0.16], [x + 1.45, 2.0 + i * 0.18, -8.45 - i * 0.5], shadowSteel);
  });

  [-9.2, -4.6, 4.6, 9.2].forEach((x, i) => {
    const rib = box('far hangar depth rib', [0.13, 3.2, 0.18], [x, 2.75, -9.15], shadowSteel);
    rib.rotation.z = x < 0 ? -0.1 : 0.1;
    box('far hangar marker light', [0.055, 0.055, 0.055], [x, 4.24, -8.95], i % 2 ? dimAmber : dimCyan);
  });

  const shuttle = new THREE.Group();
  shuttle.position.set(5.7, 1.82, -10.2);
  root.add(shuttle);
  box('tiny docked utility shuttle hull', [1.15, 0.13, 0.26], [0, 0, 0], shadowSteel, shuttle);
  box('tiny docked utility shuttle cockpit', [0.25, 0.09, 0.18], [0.62, 0.04, 0], dimCyan, shuttle);
  animated.push((t) => { shuttle.position.y = 1.82 + Math.sin(t * 0.28) * 0.025; });
}

function buildIndustrialSetDressing() {
  const crateMat = mat(0x2a231d, { roughness: 0.72, metalness: 0.18 });
  const steel = mat(COLORS.brushedSteel, { roughness: 0.35, metalness: 0.76 });
  const black = mat(COLORS.blackMetal, { roughness: 0.5, metalness: 0.52 });
  const crateStacks = [[-5.45, 3.25], [-4.85, 3.75], [5.2, 3.2], [4.7, 3.85], [5.6, -1.65], [-5.55, -1.45]];
  crateStacks.forEach(([x, z], i) => {
    const h = 0.22 + (i % 3) * 0.08;
    box('environment cargo crate', [0.42, h, 0.42], [x, 0.13 + h / 2, z], crateMat);
    box('crate metal band', [0.45, 0.025, 0.45], [x, 0.18 + h, z], steel);
  });
  [[-5.8, 1.0], [5.85, 0.85], [-5.35, -3.3], [5.35, -3.35]].forEach(([x, z]) => {
    const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.9, 18), black);
    tank.position.set(x, 0.55, z);
    tank.rotation.z = Math.PI / 2;
    tank.castShadow = true;
    tank.receiveShadow = true;
    root.add(tank);
    box('tank status strip', [0.02, 0.34, 0.035], [x, 0.55, z + 0.19], mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.7, transparent: true, opacity: 0.62 }));
  });
  // workstation chairs around the central table for scale
  [[-1.15, 1.55], [1.15, 1.55], [-1.35, -0.55], [1.35, -0.55]].forEach(([x, z], i) => {
    box('operator chair base', [0.26, 0.06, 0.26], [x, 0.26, z], black);
    box('operator chair back', [0.28, 0.36, 0.05], [x, 0.52, z - 0.13], mat(0x222c3d, { roughness: 0.45, metalness: 0.35 }));
  });
}

function buildVolumetricLightPlanes() {
  const beams = [
    [-5.6, 2.85, -6.65, COLORS.cyan],
    [0, 2.95, -6.65, COLORS.amber],
    [5.6, 2.85, -6.65, COLORS.cyan]
  ];
  beams.forEach(([x, y, z, color], i) => {
    const beam = new THREE.Mesh(
      new THREE.PlaneGeometry(2.8, 4.4),
      mat(color, { emissive: color, emissiveIntensity: 0.22, transparent: true, opacity: 0.055, side: THREE.DoubleSide, roughness: 0.1 })
    );
    beam.position.set(x, y, z + 0.08);
    beam.rotation.x = -0.22;
    root.add(beam);
    animated.push((t) => { beam.material.opacity = 0.04 + Math.sin(t * 0.8 + i) * 0.015; });
  });
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

function buildSignalOrbs() {
  const points = [
    [-3.6, 2.55, -2.75, COLORS.violet],
    [-1.4, 3.05, -3.2, COLORS.gold],
    [1.35, 3.15, -3.05, COLORS.green],
    [3.65, 2.45, -2.7, COLORS.coral],
    [0, 2.85, 0.45, COLORS.cyan]
  ];
  points.forEach(([x, y, z, color], index) => {
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.18, 1), mat(color, { emissive: color, emissiveIntensity: 1.9, roughness: 0.25, transparent: true, opacity: 0.86 }));
    orb.position.set(x, y, z);
    root.add(orb);
    signalOrbs.push({ mesh: orb, index, base: 0.82 + index * 0.04 });
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
