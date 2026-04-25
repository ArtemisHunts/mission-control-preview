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
    camera: [8.3, 5.4, 9.2],
    target: [0, 1.05, -0.35],
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
    camera: [-5.8, 3.4, 4.65],
    target: [-3.35, 0.85, 0.35],
    accent: COLORS.gold,
    pos: [-3.65, 0, 0.45],
    label: 'BUILD'
  },
  review: {
    title: 'Review Chamber',
    body: 'Sentinel owns this room. Coral containment rings mark QA, safety checks, regressions, and work that needs a sharper eye.',
    camera: [5.4, 3.6, 4.45],
    target: [3.25, 0.9, 0.1],
    accent: COLORS.coral,
    pos: [3.65, 0, 0.25],
    label: 'REVIEW'
  },
  deploy: {
    title: 'Deploy Dock',
    body: 'Quartermaster stages releases here. Green-lit launch rails show what is ready to ship, publish, or route into production.',
    camera: [5.3, 3.5, -4.9],
    target: [3.7, 0.9, -2.55],
    accent: COLORS.green,
    pos: [3.7, 0, -2.75],
    label: 'DEPLOY'
  },
  observatory: {
    title: 'Observatory',
    body: 'Prospector watches the signal room: research, memory, requirements, references, and the weird clues hiding in the noise.',
    camera: [-5.4, 3.7, -4.8],
    target: [-3.55, 0.95, -2.65],
    accent: COLORS.violet,
    pos: [-3.7, 0, -2.75],
    label: 'OBSERVATORY'
  }
};

const AGENTS = [
  { name: 'Artemis', role: 'orchestration', room: 'command', color: COLORS.cyan, offset: [-0.55, 0.2] },
  { name: 'Navigator', role: 'strategy', room: 'command', color: COLORS.white, offset: [0.62, -0.28] },
  { name: 'Forge', role: 'frontend build', room: 'build', color: COLORS.gold, offset: [-0.3, 0.18] },
  { name: 'Sentinel', role: 'QA review', room: 'review', color: COLORS.coral, offset: [0.25, 0.16] },
  { name: 'Quartermaster', role: 'deploy ops', room: 'deploy', color: COLORS.green, offset: [0.25, 0.12] },
  { name: 'Prospector', role: 'research', room: 'observatory', color: COLORS.violet, offset: [-0.12, 0.12] }
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
renderer.toneMappingExposure = 1.08;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.bg);
scene.fog = new THREE.Fog(COLORS.bg, 10, 29);

const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 90);
camera.position.set(...ROOMS.overview.camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.12;
controls.minDistance = 5.2;
controls.maxDistance = 15;
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
  scene.add(new THREE.AmbientLight(0xffffff, 0.16));
  addLight('directional', 0xffffff, 2.35, [4, 7, 5]);
  addLight('point', COLORS.cyan, 18, [-4.5, 3.2, -3.1], 12);
  addLight('point', COLORS.coral, 12, [4.2, 2.4, 2.4], 10);
  addLight('point', COLORS.gold, 8, [-2.9, 2.3, 1.2], 8);

  buildShell();
  buildRockCave();
  buildAsteroidField();
  buildExteriorVista();
  buildRooms();
  buildHoloTable();
  buildSignalLanes();
  buildRailingsAndCatwalks();
  buildCableConduits();
  buildServiceDrones();
  buildIndustrialSetDressing();
  buildVolumetricLightPlanes();
  buildArchitecturalRibs();
  buildTowers();
  buildOperators();
  buildSignalOrbs();

  const title = makeTextSprite('MISSION CONTROL', '#f8fbff', 104);
  title.position.set(0, 3.32, -4.32);
  root.add(title);
  const sub = makeTextSprite('CLICK A ROOM · FOLLOW THE AGENTS', '#9fb5e7', 48);
  sub.position.set(0, 2.92, -4.32);
  sub.scale.set(3.15, 0.78, 1);
  root.add(sub);
}

function buildShell() {
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(14.5, 12.2), mat(COLORS.floor, { roughness: 0.62, metalness: 0.28 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);

  // Paneled metal floor with glass tech trenches.
  for (let x = -5.4; x <= 5.4; x += 1.8) {
    for (let z = -4.4; z <= 4.2; z += 1.55) {
      const panel = box('floor panel', [1.65, 0.025, 1.34], [x, 0.018, z], mat(0x121a2c, { roughness: 0.48, metalness: 0.48 }));
      panel.castShadow = false;
      const edges = new THREE.LineSegments(new THREE.EdgesGeometry(panel.geometry), new THREE.LineBasicMaterial({ color: 0x26344f, transparent: true, opacity: 0.42 }));
      panel.add(edges);
    }
  }

  [-2.7, 2.7].forEach((x) => {
    const glass = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.035, 8.9), mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.45, transparent: true, opacity: 0.14, roughness: 0.12, metalness: 0.1 }));
    glass.position.set(x, 0.04, -0.35);
    glass.receiveShadow = true;
    root.add(glass);
  });

  box('rear wall', [13.4, 4.7, 0.25], [0, 2.25, -4.8], mat(COLORS.wall, { roughness: 0.56, metalness: 0.22 }));
  const leftWall = box('left wall', [9.8, 4.25, 0.2], [-6.5, 2.08, -0.05], mat(COLORS.wallDark, { roughness: 0.7, metalness: 0.18 }));
  leftWall.rotation.y = Math.PI / 2;
  const rightWall = box('right wall', [9.8, 4.25, 0.2], [6.5, 2.08, -0.05], mat(COLORS.wallDark, { roughness: 0.7, metalness: 0.18 }));
  rightWall.rotation.y = Math.PI / 2;

  buildWindowWall();

  [-4.8, -2.4, 0, 2.4, 4.8].forEach((x) => {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.035, 10.4), mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.55, transparent: true, opacity: 0.38 }));
    strip.position.set(x, 0.055, -0.15);
    root.add(strip);
  });

  [-3.1, -1.55, 0, 1.55, 3.1].forEach((x) => {
    box('wall monitor', [1.05, 0.46, 0.08], [x, 2.85, -4.61], mat(0x182742, { emissive: 0x183f60, emissiveIntensity: 0.52 }));
  });
}

function buildWindowWall() {
  const windowMat = mat(0x030815, { emissive: 0x0a2740, emissiveIntensity: 0.3, transparent: true, opacity: 0.68, roughness: 0.08, metalness: 0.25 });
  [-2.9, 0, 2.9].forEach((x) => {
    const pane = box('panoramic window', [2.35, 1.2, 0.055], [x, 2.08, -4.66], windowMat);
    pane.castShadow = false;
    box('window amber sill', [2.55, 0.035, 0.08], [x, 1.42, -4.60], mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.9, transparent: true, opacity: 0.72 }));
  });
}

function buildRockCave() {
  const rockMat = mat(COLORS.rock, { roughness: 0.92, metalness: 0.02 });
  const clusters = [
    [-6.8, 0.65, -4.7, 1.4], [-6.9, 1.6, 2.2, 1.1], [6.8, 0.8, -4.4, 1.25], [6.9, 1.8, 2.5, 1.05],
    [-4.3, 0.35, 5.3, 0.9], [4.4, 0.35, 5.25, 0.95], [0, 3.9, -5.2, 1.25]
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

function buildAsteroidField() {
  const matRock = mat(0x262235, { roughness: 0.86 });
  for (let i = 0; i < 34; i += 1) {
    const rock = new THREE.Mesh(new THREE.IcosahedronGeometry(0.035 + Math.random() * 0.12, 0), matRock);
    rock.position.set(-5.8 + Math.random() * 11.6, 1.4 + Math.random() * 3.4, -8.4 - Math.random() * 7);
    rock.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    scene.add(rock);
    animated.push((t) => { rock.rotation.y += 0.001 + i * 0.00002; rock.position.x += Math.sin(t * 0.08 + i) * 0.0008; });
  }
}

function buildArchitecturalRibs() {
  [-5.2, -3.45, -1.7, 0, 1.7, 3.45, 5.2].forEach((x, index) => {
    const rib = box('overhead rib', [0.16, 0.16, 8.6], [x, 3.9, -0.45], mat(COLORS.brushedSteel, { roughness: 0.34, metalness: 0.72 }));
    rib.rotation.x = index % 2 ? 0.08 : -0.08;
    const lamp = box('rib amber practical', [0.055, 0.055, 6.8], [x, 3.76, -0.45], mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.8, transparent: true, opacity: 0.76 }));
    lamp.rotation.x = rib.rotation.x;
  });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2.15, 0.035, 10, 96), mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 1.1, transparent: true, opacity: 0.84 }));
  ring.position.set(0, 3.35, 0.45);
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

    const platform = box(`${room.label} platform`, [2.35, 0.18, 1.65], [0, 0.09, 0], mat(0x151d35, { roughness: 0.56, metalness: 0.12 }), group);
    platform.userData.mode = id;
    roomMeshes.push(platform);

    const glow = new THREE.Mesh(
      new THREE.PlaneGeometry(2.55, 1.85),
      mat(room.accent, { emissive: room.accent, emissiveIntensity: 0.9, transparent: true, opacity: 0.13, side: THREE.DoubleSide })
    );
    glow.rotation.x = -Math.PI / 2;
    glow.position.y = 0.195;
    group.add(glow);
    glow.userData.mode = id;
    roomMeshes.push(glow);

    const ring = new THREE.Mesh(new THREE.TorusGeometry(1.05, 0.018, 8, 72), mat(room.accent, { emissive: room.accent, emissiveIntensity: 1.2, transparent: true, opacity: 0.72 }));
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.28;
    group.add(ring);

    const label = makeTextSprite(room.label, `#${room.accent.toString(16).padStart(6, '0')}`, room.label.length > 7 ? 52 : 68);
    label.position.set(0, 0.62, -0.64);
    label.scale.set(room.label.length > 7 ? 1.55 : 1.28, 0.34, 1);
    group.add(label);

    buildWorkspaceProps(id, group, room.accent);

    const tower = box(`${room.label} beacon`, [0.08, 0.88, 0.08], [0.94, 0.66, 0.58], mat(room.accent, { emissive: room.accent, emissiveIntensity: 1.0, transparent: true, opacity: 0.82 }), group);
    animated.push((t) => {
      ring.rotation.z += 0.004;
      glow.material.opacity = 0.10 + Math.sin(t * 1.7 + x) * 0.035;
      tower.scale.y = 0.9 + Math.sin(t * 2.1 + z) * 0.14;
    });
  });
}

function buildWorkspaceProps(id, group, accent) {
  const screen = (x, z, w = 0.42, h = 0.32) => {
    const s = box('workspace screen', [w, h, 0.04], [x, 0.56, z], mat(accent, { emissive: accent, emissiveIntensity: 1.05, transparent: true, opacity: 0.58 }), group);
    s.rotation.x = -0.12;
    return s;
  };
  const consoleDesk = (x, z) => {
    box('console desk', [0.72, 0.18, 0.32], [x, 0.31, z], mat(COLORS.gunmetal, { roughness: 0.42, metalness: 0.52 }), group);
    screen(x, z - 0.18);
  };
  if (id === 'build') {
    consoleDesk(-0.42, 0.1);
    box('fabrication bench', [0.9, 0.18, 0.36], [0.38, 0.31, 0.2], mat(COLORS.brushedSteel, { roughness: 0.38, metalness: 0.68 }), group);
    [-0.05, 0.2, 0.48].forEach((x, i) => box('crate stack', [0.22, 0.18 + i * 0.07, 0.22], [x, 0.34 + i * 0.03, 0.58], mat(0x4b3a25, { roughness: 0.64, metalness: 0.12 }), group));
  } else if (id === 'review') {
    const chamber = new THREE.Mesh(new THREE.TorusGeometry(0.62, 0.018, 8, 72), mat(accent, { emissive: accent, emissiveIntensity: 1.25, transparent: true, opacity: 0.72 }));
    chamber.rotation.x = Math.PI / 2;
    chamber.position.y = 0.52;
    group.add(chamber);
    screen(-0.48, -0.1); screen(0.48, -0.1);
  } else if (id === 'deploy') {
    box('deploy rail left', [0.08, 0.08, 1.24], [-0.34, 0.29, 0.02], mat(accent, { emissive: accent, emissiveIntensity: 0.9, transparent: true, opacity: 0.66 }), group);
    box('deploy rail right', [0.08, 0.08, 1.24], [0.34, 0.29, 0.02], mat(accent, { emissive: accent, emissiveIntensity: 0.9, transparent: true, opacity: 0.66 }), group);
    box('dock door', [0.86, 0.62, 0.07], [0, 0.62, -0.72], mat(COLORS.blackMetal, { roughness: 0.38, metalness: 0.62 }), group);
  } else if (id === 'observatory') {
    screen(0, -0.26, 0.72, 0.38);
    const dish = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.28, 32, 1, true), mat(accent, { emissive: accent, emissiveIntensity: 0.55, transparent: true, opacity: 0.34, side: THREE.DoubleSide }));
    dish.position.set(-0.48, 0.58, 0.28);
    dish.rotation.z = -0.7;
    group.add(dish);
  } else if (id === 'command') {
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
    [[0, 0.025, 0.45], [-3.65, 0.025, 0.45], COLORS.gold],
    [[0, 0.025, 0.45], [3.65, 0.025, 0.25], COLORS.coral],
    [[0, 0.025, 0.45], [3.7, 0.025, -2.75], COLORS.green],
    [[0, 0.025, 0.45], [-3.7, 0.025, -2.75], COLORS.violet]
  ];
  lanes.forEach(([from, to, color], index) => {
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(...from),
      new THREE.Vector3((from[0] + to[0]) / 2, 0.03, (from[2] + to[2]) / 2),
      new THREE.Vector3(...to)
    ]);
    const tube = new THREE.Mesh(new THREE.TubeGeometry(curve, 32, 0.018, 8, false), mat(color, { emissive: color, emissiveIntensity: 1.1, transparent: true, opacity: 0.74 }));
    root.add(tube);
    animated.push((t) => { tube.material.opacity = 0.48 + Math.sin(t * 1.6 + index) * 0.2; });
  });
}

function buildRailingsAndCatwalks() {
  const railMat = mat(COLORS.brushedSteel, { roughness: 0.32, metalness: 0.76 });
  const glowMat = mat(COLORS.amber, { emissive: COLORS.amber, emissiveIntensity: 0.65, transparent: true, opacity: 0.64 });
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
  [[-5.4, 0.1], [5.4, 0.1], [-3.7, -2.75], [3.7, -2.75]].forEach(([x, z]) => {
    box('catwalk edge', [1.5, 0.08, 0.08], [x, 0.32, z + 0.86], railMat);
    box('catwalk edge', [1.5, 0.08, 0.08], [x, 0.32, z - 0.86], railMat);
  });
}

function buildCableConduits() {
  const paths = [
    [[-5.9, 3.2, -4.2], [-3.7, 3.45, -3.2], [-1.2, 3.55, -4.55]],
    [[5.9, 3.1, -4.0], [3.4, 3.38, -3.25], [1.2, 3.5, -4.55]],
    [[-6.1, 2.4, 1.8], [-3.9, 2.55, 0.2], [-1.8, 2.75, 0.1]],
    [[6.1, 2.4, 1.8], [3.9, 2.55, 0.2], [1.8, 2.75, 0.1]]
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
    [-2.9, 2.35, -4.35, COLORS.cyan],
    [0, 2.35, -4.35, COLORS.amber],
    [2.9, 2.35, -4.35, COLORS.cyan]
  ];
  beams.forEach(([x, y, z, color], i) => {
    const beam = new THREE.Mesh(
      new THREE.PlaneGeometry(1.7, 3.2),
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
    const tower = box(`${label} tower`, [0.26, height, 0.26], [0, 0.16 + height / 2, 0], mat(color, { emissive: color, emissiveIntensity: 0.75, transparent: true, opacity: 0.92 }), group);
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

    box('operator backpack', [0.18, 0.28, 0.08], [0, -0.08, -0.16], mat(COLORS.blackMetal, { roughness: 0.4, metalness: 0.5 }), group);
    box('left arm', [0.055, 0.28, 0.055], [-0.18, -0.12, 0.02], mat(0xd4d6da, { roughness: 0.42, metalness: 0.18 }), group);
    box('right arm', [0.055, 0.28, 0.055], [0.18, -0.12, 0.02], mat(0xd4d6da, { roughness: 0.42, metalness: 0.18 }), group);
    box('status light', [0.045, 0.045, 0.025], [0.11, 0.02, 0.14], mat(agent.color, { emissive: agent.color, emissiveIntensity: 1.4, transparent: true, opacity: 0.92 }), group);

    const tag = makeTextSprite(agent.name.toUpperCase(), '#dfe9ff', 40);
    tag.position.set(0, 0.72, 0);
    tag.scale.set(0.62, 0.16, 1);
    tag.material.opacity = 0.68;
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
  controls.autoRotate = modeName === 'overview';
  updateHud();
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
  renderer.domElement.style.cursor = hit ? 'pointer' : 'grab';
  if (click && hit?.object?.userData?.mode) setMode(hit.object.userData.mode);
}

function animate() {
  requestAnimationFrame(animate);
  const t = clock.getElapsedTime();
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

  const room = ROOMS[state.mode];
  camera.position.lerp(new THREE.Vector3(...room.camera), 0.03);
  controls.target.lerp(new THREE.Vector3(...room.target), 0.035);
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
document.querySelectorAll('.dock-button[data-mode]').forEach((button) => button.addEventListener('click', () => setMode(button.dataset.mode)));
document.getElementById('shuffle-btn').addEventListener('click', simulateShift);

buildOffice();
updateHud();
animate();
