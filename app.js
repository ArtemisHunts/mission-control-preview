import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const COLORS = {
  bg: 0x050712,
  floor: 0x10182d,
  wall: 0x111936,
  wallDark: 0x0b1024,
  panel: 0x202844,
  metal: 0x303b5d,
  cyan: 0x59f1ff,
  gold: 0xffbf1f,
  green: 0x86f18a,
  coral: 0xff6f61,
  violet: 0x9d7cff,
  white: 0xf6f8ff
};

const MODES = {
  overview: {
    title: 'Command Deck',
    body: 'The whole office in motion: agents, mission towers, holo-map, and signal traffic in one spatial layer.',
    camera: [7.8, 5.2, 8.8],
    target: [0, 1.1, -0.4],
    accent: COLORS.cyan
  },
  build: {
    title: 'Build Floor',
    body: 'Forge and Artemis route implementation work through the central desk while active mission towers pulse gold.',
    camera: [-5.8, 3.6, 5.2],
    target: [-1.2, 0.9, -0.7],
    accent: COLORS.gold
  },
  review: {
    title: 'Review War Room',
    body: 'Sentinel owns the review cycle. Red/coral signal loops mark QA, blockers, and regression passes.',
    camera: [5.3, 3.5, 4.7],
    target: [1.7, 1.0, -1.2],
    accent: COLORS.coral
  },
  deploy: {
    title: 'Deploy Dock',
    body: 'Quartermaster watches release lanes and external traffic. Cyan orbs mark deploy-ready work.',
    camera: [4.5, 4.2, -5.8],
    target: [2.2, 1.1, -2.4],
    accent: COLORS.green
  }
};

const state = {
  mode: 'overview',
  tick: 0,
  metrics: {
    agents: 6,
    missions: 12,
    active: 4,
    review: 3
  },
  feed: [
    ['Artemis', 'split the office pass from Zoophoria and moved it home.'],
    ['Forge', 'stood up the procedural 3D command room.'],
    ['Sentinel', 'watching browser and deployment checks.'],
    ['Quartermaster', 'routing this through GitHub Pages.']
  ]
};

const container = document.getElementById('office-canvas');
const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.8));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(COLORS.bg);
scene.fog = new THREE.Fog(COLORS.bg, 10, 28);

const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 80);
camera.position.set(...MODES.overview.camera);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.08;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.18;
controls.minDistance = 6.5;
controls.maxDistance = 14;
controls.minPolarAngle = 0.72;
controls.maxPolarAngle = 1.34;
controls.target.set(...MODES.overview.target);

const root = new THREE.Group();
scene.add(root);

const clock = new THREE.Clock();
const animated = [];
const towers = [];
const operators = [];
const signalOrbs = [];

function mat(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.55,
    metalness: options.metalness ?? 0.08,
    emissive: options.emissive ?? 0x000000,
    emissiveIntensity: options.emissiveIntensity ?? 0,
    transparent: options.transparent ?? false,
    opacity: options.opacity ?? 1
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

function makeTextSprite(text, color = '#f6f8ff', size = 128) {
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
  sprite.scale.set(4.2, 1.05, 1);
  return sprite;
}

function buildOffice() {
  scene.add(new THREE.AmbientLight(0xffffff, 0.38));

  const sun = new THREE.DirectionalLight(0xffffff, 2.25);
  sun.position.set(4, 7, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);

  scene.add(new THREE.PointLight(COLORS.cyan, 18, 12).position.set(-4, 3.5, -3));
  scene.add(new THREE.PointLight(COLORS.coral, 13, 10).position.set(3.5, 2.4, 3.2));

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(13, 11), mat(COLORS.floor, { roughness: 0.78 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  root.add(floor);

  box('rear wall', [13, 4.4, 0.22], [0, 2.15, -4.6], mat(COLORS.wall, { roughness: 0.7 }));
  const leftWall = box('left wall', [9.2, 4.15, 0.18], [-6.2, 2.05, 0], mat(COLORS.wallDark, { roughness: 0.82 }));
  leftWall.rotation.y = Math.PI / 2;
  const rightWall = box('right wall', [9.2, 4.15, 0.18], [6.2, 2.05, 0], mat(COLORS.wallDark, { roughness: 0.82 }));
  rightWall.rotation.y = Math.PI / 2;

  [-4.8, -2.4, 0, 2.4, 4.8].forEach((x) => {
    const strip = new THREE.Mesh(
      new THREE.PlaneGeometry(0.035, 11),
      mat(0x263d66, { emissive: 0x13294d, emissiveIntensity: 0.28 })
    );
    strip.rotation.x = -Math.PI / 2;
    strip.position.set(x, 0.014, 0);
    root.add(strip);
  });

  [-3.1, -1.55, 0, 1.55, 3.1].forEach((x) => {
    box('wall monitor', [1.05, 0.46, 0.08], [x, 2.85, -4.45], mat(0x182742, { emissive: 0x183f60, emissiveIntensity: 0.52 }));
  });

  buildDesk();
  buildHoloZoo();
  buildTowers();
  buildOperators();
  buildSignalOrbs();

  const title = makeTextSprite('MISSION CONTROL', '#f8fbff', 104);
  title.position.set(0, 3.32, -4.32);
  root.add(title);
  const sub = makeTextSprite('ARTEMISHUNTS 3D OFFICE', '#9fb5e7', 54);
  sub.position.set(0, 2.92, -4.32);
  sub.scale.set(3.2, 0.8, 1);
  root.add(sub);
}

function buildDesk() {
  const group = new THREE.Group();
  group.position.set(0, 0.62, -1.1);
  root.add(group);

  box('command desk base', [4.7, 0.42, 1.45], [0, 0, 0], mat(COLORS.panel, { roughness: 0.42, metalness: 0.18 }), group);
  box('command desk top', [4.95, 0.08, 1.55], [0, 0.26, 0.08], mat(COLORS.metal, { roughness: 0.34, metalness: 0.22 }), group);
  box('left desk leg', [0.34, 1.1, 0.22], [-1.85, -0.55, 0.28], mat(0x151b30, { roughness: 0.7 }), group);
  box('right desk leg', [0.34, 1.1, 0.22], [1.85, -0.55, 0.28], mat(0x151b30, { roughness: 0.7 }), group);

  [-1.45, 0, 1.45].forEach((x, i) => buildMonitor(group, x, [COLORS.cyan, COLORS.gold, COLORS.coral][i], i));
}

function buildMonitor(parent, x, color, index) {
  const group = new THREE.Group();
  group.position.set(x, 0.72, -0.35);
  group.rotation.x = -0.14;
  parent.add(group);

  box('monitor shell', [1.08, 0.66, 0.08], [0, 0, 0], mat(0x080b16, { roughness: 0.35, metalness: 0.3 }), group);
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.92, 0.5), mat(color, { emissive: color, emissiveIntensity: 1.6, transparent: true, opacity: 0.34 }));
  screen.position.set(0, 0, 0.048);
  group.add(screen);
  const scan = box('scanline', [0.12, 0.42, 0.012], [0, 0.05, 0.052], mat(0xffffff, { emissive: 0xffffff, emissiveIntensity: 1.2, transparent: true, opacity: 0.72 }), group);
  animated.push((t) => { scan.position.x = Math.sin(t * (0.8 + index * 0.22)) * 0.23; });
}

function buildHoloZoo() {
  const group = new THREE.Group();
  group.position.set(0, 0.18, 1.35);
  root.add(group);

  const disk = new THREE.Mesh(
    new THREE.CircleGeometry(2.05, 56),
    mat(0x113b50, { emissive: 0x0c8fb3, emissiveIntensity: 0.35, transparent: true, opacity: 0.48 })
  );
  disk.rotation.x = -Math.PI / 2;
  disk.position.y = 0.08;
  group.add(disk);

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.82, 0.014, 8, 90),
    mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 1.4, transparent: true, opacity: 0.72 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.58;
  group.add(ring);

  const pads = [
    [-1.3, 1.3, COLORS.green],
    [0.1, 1.6, COLORS.cyan],
    [1.25, 1.15, COLORS.gold],
    [-0.2, 0.35, COLORS.violet]
  ];
  pads.forEach(([x, z, color], index) => buildHabitat(group, x, z, color, index));

  animated.push((t) => {
    group.rotation.y = Math.sin(t * 0.22) * 0.08;
    group.position.y = 0.18 + Math.sin(t * 1.2) * 0.025;
    ring.rotation.z += 0.004;
  });
}

function buildHabitat(parent, x, z, color, index) {
  const group = new THREE.Group();
  group.position.set(x, 0.08, z);
  parent.add(group);

  const pad = new THREE.Mesh(new THREE.CircleGeometry(0.42, 28), mat(color, { emissive: color, emissiveIntensity: 0.5, transparent: true, opacity: 0.82 }));
  pad.rotation.x = -Math.PI / 2;
  group.add(pad);

  const animal = new THREE.Group();
  animal.position.y = 0.3;
  group.add(animal);
  box('animal body', [0.34, 0.22, 0.22], [0, 0, 0], mat(color, { roughness: 0.45 }), animal);
  box('animal head', [0.16, 0.16, 0.16], [0.2, 0.08, 0], mat(color, { roughness: 0.45 }), animal);
  const tree = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.44, 5), mat(0x3cd070, { roughness: 0.6 }));
  tree.position.set(-0.3, 0.23, -0.2);
  tree.castShadow = true;
  group.add(tree);

  animated.push((t) => {
    animal.position.y = 0.3 + Math.sin(t * 1.8 + index) * 0.035;
    animal.rotation.y = Math.sin(t * 0.8 + index) * 0.35;
  });
}

function buildTowers() {
  const metrics = [
    ['AGENTS', 6, COLORS.cyan, -4.35],
    ['MISSIONS', 12, COLORS.gold, -3.65],
    ['ACTIVE', 4, COLORS.green, 3.65],
    ['REVIEW', 3, COLORS.coral, 4.35]
  ];
  metrics.forEach(([label, value, color, x]) => {
    const group = new THREE.Group();
    group.position.set(x, 0.05, -3.25);
    root.add(group);
    box(`${label} pedestal`, [0.42, 0.16, 0.42], [0, 0.08, 0], mat(0x18213a, { roughness: 0.55 }), group);
    const height = 0.55 + Math.min(value, 14) * 0.105;
    const tower = box(`${label} tower`, [0.26, height, 0.26], [0, 0.16 + height / 2, 0], mat(color, { emissive: color, emissiveIntensity: 0.75, transparent: true, opacity: 0.92 }), group);
    towers.push({ mesh: tower, value, base: height, color });
  });
}

function buildOperators() {
  const roster = [
    ['Artemis', COLORS.cyan, -2.6, -0.05],
    ['Forge', COLORS.gold, -1.35, 0.55],
    ['Sentinel', COLORS.coral, 1.35, 0.55],
    ['Quartermaster', COLORS.green, 2.55, -0.1],
    ['Prospector', COLORS.violet, -0.75, -2.35],
    ['Navigator', 0xffffff, 0.8, -2.35]
  ];
  roster.forEach(([name, color, x, z], index) => {
    const group = new THREE.Group();
    group.position.set(x, 0.55, z);
    root.add(group);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 18), mat(color, { roughness: 0.44 }));
    head.position.y = 0.18;
    head.castShadow = true;
    group.add(head);
    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.32, 6, 12), mat(0x27314f, { roughness: 0.55 }));
    body.position.y = -0.1;
    body.castShadow = true;
    group.add(body);
    box('visor', [0.18, 0.03, 0.02], [0, 0.23, 0.16], mat(0x05070f, { emissive: 0xffffff, emissiveIntensity: 0.18 }), group);
    operators.push({ group, baseY: 0.55, index, name });
  });
}

function buildSignalOrbs() {
  const points = [
    [-3.6, 2.55, -2.75, COLORS.cyan],
    [-1.4, 3.05, -3.2, COLORS.gold],
    [1.35, 3.15, -3.05, COLORS.green],
    [3.65, 2.45, -2.7, COLORS.coral]
  ];
  points.forEach(([x, y, z, color], index) => {
    const orb = new THREE.Mesh(new THREE.IcosahedronGeometry(0.18, 1), mat(color, { emissive: color, emissiveIntensity: 1.9, roughness: 0.25, transparent: true, opacity: 0.86 }));
    orb.position.set(x, y, z);
    root.add(orb);
    signalOrbs.push({ mesh: orb, index, base: 0.85 + index * 0.05 });
  });
}

function updateHud() {
  document.getElementById('metric-agents').textContent = state.metrics.agents;
  document.getElementById('metric-missions').textContent = state.metrics.missions;
  document.getElementById('metric-active').textContent = state.metrics.active;
  document.getElementById('metric-review').textContent = state.metrics.review;

  const mode = MODES[state.mode];
  document.getElementById('focus-title').textContent = mode.title;
  document.getElementById('focus-body').textContent = mode.body;

  const feed = document.getElementById('feed-list');
  feed.innerHTML = state.feed.slice(0, 5).map(([who, what]) => `<div class="feed-item"><strong>${who}</strong> ${what}</div>`).join('');
}

function setMode(modeName) {
  state.mode = modeName;
  document.querySelectorAll('.dock-button[data-mode]').forEach((button) => {
    button.classList.toggle('active', button.dataset.mode === modeName);
  });
  updateHud();
}

function simulateShift() {
  state.tick += 1;
  state.metrics.missions = 10 + Math.floor(Math.random() * 8);
  state.metrics.active = 2 + Math.floor(Math.random() * 5);
  state.metrics.review = 1 + Math.floor(Math.random() * 4);
  const events = [
    ['Artemis', 'rebalanced the queue and pulled a blocker into focus.'],
    ['Forge', 'spun up a new interaction pass on the build floor.'],
    ['Sentinel', 'flagged a review loop before it hit deploy.'],
    ['Quartermaster', 'staged a Pages update and checked release lanes.'],
    ['Prospector', 'found a cleaner visual language for the next asset pass.']
  ];
  state.feed.unshift(events[Math.floor(Math.random() * events.length)]);
  updateHud();
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
    operator.group.rotation.y = Math.sin(t * 0.58 + operator.index) * 0.18;
  });
  signalOrbs.forEach((orb) => {
    const pulse = orb.base + Math.sin(t * (0.9 + orb.index * 0.18)) * 0.1;
    orb.mesh.scale.setScalar(pulse);
    orb.mesh.rotation.x += 0.01;
    orb.mesh.rotation.y += 0.008;
  });

  const mode = MODES[state.mode];
  camera.position.lerp(new THREE.Vector3(...mode.camera), 0.026);
  controls.target.lerp(new THREE.Vector3(...mode.target), 0.03);
  controls.update();
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

document.querySelectorAll('.dock-button[data-mode]').forEach((button) => {
  button.addEventListener('click', () => setMode(button.dataset.mode));
});
document.getElementById('shuffle-btn').addEventListener('click', simulateShift);

buildOffice();
updateHud();
animate();
