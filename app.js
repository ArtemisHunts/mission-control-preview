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
  scene.add(new THREE.AmbientLight(0xffffff, 0.36));
  addLight('directional', 0xffffff, 2.15, [4, 7, 5]);
  addLight('point', COLORS.cyan, 18, [-4.5, 3.2, -3.1], 12);
  addLight('point', COLORS.coral, 12, [4.2, 2.4, 2.4], 10);
  addLight('point', COLORS.gold, 8, [-2.9, 2.3, 1.2], 8);

  buildShell();
  buildRooms();
  buildHoloTable();
  buildSignalLanes();
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
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.035, 11), mat(0x263d66, { emissive: 0x13294d, emissiveIntensity: 0.28 }));
    strip.rotation.x = -Math.PI / 2;
    strip.position.set(x, 0.014, 0);
    root.add(strip);
  });

  [-3.1, -1.55, 0, 1.55, 3.1].forEach((x) => {
    box('wall monitor', [1.05, 0.46, 0.08], [x, 2.85, -4.45], mat(0x182742, { emissive: 0x183f60, emissiveIntensity: 0.52 }));
  });
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

    const tower = box(`${room.label} beacon`, [0.08, 0.88, 0.08], [0.94, 0.66, 0.58], mat(room.accent, { emissive: room.accent, emissiveIntensity: 1.0, transparent: true, opacity: 0.82 }), group);
    animated.push((t) => {
      ring.rotation.z += 0.004;
      glow.material.opacity = 0.10 + Math.sin(t * 1.7 + x) * 0.035;
      tower.scale.y = 0.9 + Math.sin(t * 2.1 + z) * 0.14;
    });
  });
}

function buildHoloTable() {
  const group = new THREE.Group();
  group.position.set(0, 0.48, 0.45);
  root.add(group);

  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.22, 1.42, 0.38, 8), mat(0x1a2440, { roughness: 0.38, metalness: 0.22 }));
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const glass = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.04, 64), mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 0.65, transparent: true, opacity: 0.32 }));
  glass.position.y = 0.26;
  group.add(glass);

  const map = new THREE.Group();
  map.position.y = 0.72;
  group.add(map);

  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.08, 0.012, 8, 96), mat(COLORS.cyan, { emissive: COLORS.cyan, emissiveIntensity: 1.45, transparent: true, opacity: 0.78 }));
  ring.rotation.x = Math.PI / 2;
  map.add(ring);

  const nodePositions = [[0, 0], [-0.56, 0.36], [0.6, 0.28], [-0.4, -0.46], [0.42, -0.5]];
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
    map.rotation.y += 0.005;
    glass.material.opacity = 0.28 + Math.sin(t * 1.25) * 0.05;
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

    const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 18, 18), mat(agent.color, { roughness: 0.44 }));
    head.position.y = 0.18;
    head.castShadow = true;
    group.add(head);

    const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.14, 0.34, 6, 12), mat(0x27314f, { roughness: 0.55 }));
    body.position.y = -0.1;
    body.castShadow = true;
    group.add(body);

    box('visor', [0.18, 0.03, 0.02], [0, 0.23, 0.16], mat(0x05070f, { emissive: 0xffffff, emissiveIntensity: 0.18 }), group);

    const tag = makeTextSprite(agent.name.toUpperCase(), '#dfe9ff', 48);
    tag.position.set(0, 0.7, 0);
    tag.scale.set(0.78, 0.2, 1);
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
  document.getElementById('metric-agents').textContent = state.metrics.agents;
  document.getElementById('metric-missions').textContent = state.metrics.missions;
  document.getElementById('metric-active').textContent = state.metrics.active;
  document.getElementById('metric-review').textContent = state.metrics.review;

  const room = ROOMS[state.mode];
  document.getElementById('focus-title').textContent = room.title;
  document.getElementById('focus-body').textContent = room.body;

  const feed = document.getElementById('feed-list');
  feed.innerHTML = state.feed.slice(0, 5).map(([who, what]) => `<div class="feed-item"><strong>${who}</strong> ${what}</div>`).join('');
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
