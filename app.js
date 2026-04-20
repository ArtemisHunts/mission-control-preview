const API_URL = '/api/state';
const LOCAL_STATE_KEY = 'artemishunts-mission-control-state';

const STATUSES = [
  { id: 'intake', label: 'Inbox' },
  { id: 'queued', label: 'Assigned' },
  { id: 'active', label: 'In Progress' },
  { id: 'review', label: 'Review' },
  { id: 'committed', label: 'Done' }
];

const STATUS_ORDER = ['active', 'review', 'queued', 'intake', 'committed'];

const ROOM_LAYOUT = {
  'command-dome': {
    label: 'Command Dome',
    note: 'routing · approvals · mission view',
    x: 332,
    y: 108,
    w: 236,
    h: 124,
    tone: '#64748b',
    accent: '#78dce8'
  },
  'forge-bay': {
    label: 'Forge Bay',
    note: 'build floor · UI fabrication · tools',
    x: 118,
    y: 186,
    w: 266,
    h: 136,
    tone: '#6b7280',
    accent: '#f59e0b'
  },
  'cargo-spine': {
    label: 'Cargo Spine',
    note: 'intake · assignment lanes · courier flow',
    x: 350,
    y: 266,
    w: 306,
    h: 108,
    tone: '#78716c',
    accent: '#facc15'
  },
  'dock-ring': {
    label: 'Dock Ring',
    note: 'deploy pipe · event bridge · external traffic',
    x: 624,
    y: 184,
    w: 228,
    h: 132,
    tone: '#475569',
    accent: '#38bdf8'
  },
  'war-room': {
    label: 'War Room',
    note: 'review · QA · conflict resolution',
    x: 584,
    y: 360,
    w: 232,
    h: 124,
    tone: '#57534e',
    accent: '#fb7185'
  },
  'observatory': {
    label: 'Observatory',
    note: 'research · memory scans · signals',
    x: 110,
    y: 364,
    w: 220,
    h: 126,
    tone: '#52525b',
    accent: '#a78bfa'
  }
};

const AGENT_VISUALS = {
  artemis: { suit: '#66738b', suitDark: '#374151', accent: '#78dce8', visor: '#a5f3fc' },
  forge: { suit: '#7c5e42', suitDark: '#422006', accent: '#f59e0b', visor: '#fde68a' },
  sentinel: { suit: '#7f1d1d', suitDark: '#450a0a', accent: '#fb7185', visor: '#fecdd3' },
  quartermaster: { suit: '#1e3a5f', suitDark: '#0f172a', accent: '#93c5fd', visor: '#dbeafe' },
  prospector: { suit: '#4c1d95', suitDark: '#2e1065', accent: '#a78bfa', visor: '#e9d5ff' },
  navigator: { suit: '#2f3a4a', suitDark: '#111827', accent: '#c4b5fd', visor: '#e0e7ff' },
  courier: { suit: '#7c2d12', suitDark: '#431407', accent: '#f97316', visor: '#fdba74' }
};

const DEFAULT_STATE = {
  meta: {
    title: 'Asteroid Operations Deck',
    goal: 'Deliver autonomous and continuous development',
    updatedAt: new Date().toISOString()
  },
  agents: [
    {
      id: 'artemis',
      name: 'Artemis',
      role: 'Orchestrator',
      specialty: 'Delegation, triage, sequencing, approvals',
      skills: ['orchestration', 'planning', 'review', 'shipping'],
      location: 'command-dome',
      status: 'working',
      autoPick: true,
      load: 87,
      currentTaskId: 'task-campus-rebuild'
    },
    {
      id: 'forge',
      name: 'Forge',
      role: 'Builder',
      specialty: 'Frontend systems, simulation UI, interaction work',
      skills: ['frontend', 'phaser', 'ui', 'interaction'],
      location: 'forge-bay',
      status: 'working',
      autoPick: true,
      load: 73,
      currentTaskId: 'task-world-render'
    },
    {
      id: 'sentinel',
      name: 'Sentinel',
      role: 'Reviewer',
      specialty: 'QA, safety gates, regression checks',
      skills: ['review', 'qa', 'testing'],
      location: 'war-room',
      status: 'reviewing',
      autoPick: true,
      load: 61,
      currentTaskId: 'task-world-events'
    },
    {
      id: 'quartermaster',
      name: 'Quartermaster',
      role: 'Ops Engineer',
      specialty: 'Pipelines, event bridge, data plumbing',
      skills: ['api', 'events', 'infra', 'deploy'],
      location: 'dock-ring',
      status: 'staged',
      autoPick: true,
      load: 42,
      currentTaskId: 'task-activity-bridge'
    },
    {
      id: 'prospector',
      name: 'Prospector',
      role: 'Research Miner',
      specialty: 'Signals, memory, requirement extraction',
      skills: ['research', 'memory', 'requirements'],
      location: 'observatory',
      status: 'idle',
      autoPick: true,
      load: 18,
      currentTaskId: null
    },
    {
      id: 'navigator',
      name: 'Navigator',
      role: 'Strategist',
      specialty: 'OKRs, dependency mapping, roadmap',
      skills: ['strategy', 'okr', 'planning'],
      location: 'war-room',
      status: 'idle',
      autoPick: false,
      load: 14,
      currentTaskId: null
    }
  ],
  tasks: [
    {
      id: 'task-campus-rebuild',
      title: 'Rebuild Mission Control as a visual isometric ops deck',
      description: 'Move from dashboard theater into a world-first interface where rooms and operators actually matter.',
      project: 'Mission Control',
      priority: 1,
      status: 'active',
      requester: 'Michael',
      assigneeId: 'artemis',
      room: 'command-dome',
      autoAssignable: true,
      tags: ['campus', 'isometric', 'world'],
      createdAt: '2026-04-19T20:30:00Z',
      updatedAt: '2026-04-19T20:32:00Z'
    },
    {
      id: 'task-world-render',
      title: 'Render rugged rooms and operator positions',
      description: 'Build the asteroid facility silhouette, room modules, and embedded industrial framing.',
      project: 'Mission Control',
      priority: 1,
      status: 'active',
      requester: 'Artemis',
      assigneeId: 'forge',
      room: 'forge-bay',
      autoAssignable: true,
      tags: ['rendering', 'rooms', 'pixel-art'],
      createdAt: '2026-04-19T20:31:00Z',
      updatedAt: '2026-04-19T20:34:00Z'
    },
    {
      id: 'task-world-events',
      title: 'Map task state to visible room behavior',
      description: 'Review, work, queue, and idle need to read at a glance in the world and the mission deck.',
      project: 'Mission Control',
      priority: 1,
      status: 'review',
      requester: 'Artemis',
      assigneeId: 'sentinel',
      room: 'war-room',
      autoAssignable: true,
      tags: ['state', 'review', 'behavior'],
      createdAt: '2026-04-19T20:32:00Z',
      updatedAt: '2026-04-19T20:36:00Z'
    },
    {
      id: 'task-activity-bridge',
      title: 'Wire event bridge for agent telemetry',
      description: 'Eventually replace demo state with real OpenClaw activity and session flow.',
      project: 'Mission Control',
      priority: 2,
      status: 'queued',
      requester: 'Michael',
      assigneeId: 'quartermaster',
      room: 'dock-ring',
      autoAssignable: true,
      tags: ['events', 'telemetry', 'backend'],
      createdAt: '2026-04-19T20:33:00Z',
      updatedAt: '2026-04-19T20:33:00Z'
    },
    {
      id: 'task-subagent-lanes',
      title: 'Visualize subagents as temporary couriers',
      description: 'Short-lived workers should appear as couriers moving through the cargo lanes.',
      project: 'Mission Control',
      priority: 2,
      status: 'queued',
      requester: 'Michael',
      assigneeId: null,
      room: 'cargo-spine',
      autoAssignable: true,
      tags: ['subagents', 'visualization', 'couriers'],
      createdAt: '2026-04-19T20:35:00Z',
      updatedAt: '2026-04-19T20:35:00Z'
    },
    {
      id: 'task-human-console',
      title: 'Keep the mission deck functional and compact',
      description: 'The world should dominate, but the workflow controls still need to be real and useful.',
      project: 'Mission Control',
      priority: 2,
      status: 'intake',
      requester: 'Michael',
      assigneeId: null,
      room: 'command-dome',
      autoAssignable: true,
      tags: ['board', 'workflow', 'console'],
      createdAt: '2026-04-19T20:36:00Z',
      updatedAt: '2026-04-19T20:36:00Z'
    },
    {
      id: 'task-okr-layer',
      title: 'Map every mission to the autonomous dev OKR',
      description: 'The base should still make it obvious what matters and what is just noise.',
      project: 'Mission Control',
      priority: 3,
      status: 'committed',
      requester: 'Navigator',
      assigneeId: 'navigator',
      room: 'war-room',
      autoAssignable: false,
      tags: ['okr', 'alignment'],
      createdAt: '2026-04-19T20:10:00Z',
      updatedAt: '2026-04-19T20:20:00Z'
    }
  ],
  activity: [
    {
      id: 'evt-1',
      type: 'shift',
      agentId: 'artemis',
      taskId: 'task-campus-rebuild',
      message: 'Artemis pivoted the frontend into a world-first industrial ops layout.',
      createdAt: '2026-04-19T20:32:00Z'
    },
    {
      id: 'evt-2',
      type: 'build',
      agentId: 'forge',
      taskId: 'task-world-render',
      message: 'Forge is fabricating the asteroid rooms, terminal framing, and operator positions.',
      createdAt: '2026-04-19T20:34:00Z'
    },
    {
      id: 'evt-3',
      type: 'review',
      agentId: 'sentinel',
      taskId: 'task-world-events',
      message: 'Sentinel is checking whether room behavior actually tracks task state instead of faking it.',
      createdAt: '2026-04-19T20:36:00Z'
    }
  ]
};

const state = { meta: {}, agents: [], tasks: [], activity: [] };
let selectedAgentId = null;
let selectedRoomId = null;
let selectedTaskId = null;
const agentMotionCache = new Map();

const els = {};

window.addEventListener('DOMContentLoaded', async () => {
  cacheElements();
  populateStaticSelects();
  bindEvents();
  await loadState();
  render();
});

function cacheElements() {
  els.metricGrid = document.getElementById('metric-grid');
  els.worldStatus = document.getElementById('world-status');
  els.roomLayer = document.getElementById('room-layer');
  els.agentLayer = document.getElementById('agent-layer');
  els.courierLayer = document.getElementById('courier-layer');
  els.focusTitle = document.getElementById('focus-title');
  els.focusCard = document.getElementById('focus-card');
  els.rosterList = document.getElementById('roster-list');
  els.taskCount = document.getElementById('task-count');
  els.fleetCount = document.getElementById('fleet-count');
  els.missionDeck = document.getElementById('mission-deck');
  els.feedList = document.getElementById('feed-list');
  els.dispatchBtn = document.getElementById('dispatch-btn');
  els.simulateBtn = document.getElementById('simulate-btn');
  els.newTaskBtn = document.getElementById('new-task-btn');
  els.modal = document.getElementById('task-modal');
  els.modalTitle = document.getElementById('modal-title');
  els.closeModalBtn = document.getElementById('close-modal-btn');
  els.cancelTaskBtn = document.getElementById('cancel-task-btn');
  els.deleteTaskBtn = document.getElementById('delete-task-btn');
  els.taskForm = document.getElementById('task-form');
  els.taskId = document.getElementById('task-id');
  els.taskTitle = document.getElementById('task-title');
  els.taskDescription = document.getElementById('task-description');
  els.taskProject = document.getElementById('task-project');
  els.taskPriority = document.getElementById('task-priority');
  els.taskStatus = document.getElementById('task-status');
  els.taskAssignee = document.getElementById('task-assignee');
  els.taskRequester = document.getElementById('task-requester');
  els.taskRoom = document.getElementById('task-room');
  els.taskTags = document.getElementById('task-tags');
}

function populateStaticSelects() {
  els.taskStatus.innerHTML = STATUSES.map(status => `<option value="${status.id}">${status.label}</option>`).join('');
  els.taskRoom.innerHTML = Object.entries(ROOM_LAYOUT).map(([id, room]) => `<option value="${id}">${room.label}</option>`).join('');
}

function bindEvents() {
  els.dispatchBtn.addEventListener('click', autoDispatch);
  els.simulateBtn.addEventListener('click', simulateShift);
  els.newTaskBtn.addEventListener('click', () => openTaskModal());
  els.closeModalBtn.addEventListener('click', closeTaskModal);
  els.cancelTaskBtn.addEventListener('click', closeTaskModal);
  els.deleteTaskBtn.addEventListener('click', deleteTask);
  els.taskForm.addEventListener('submit', saveTask);

  els.roomLayer.addEventListener('click', event => {
    const room = event.target.closest('[data-room-id]');
    if (!room) return;
    selectedRoomId = room.dataset.roomId;
    selectedAgentId = null;
    selectedTaskId = null;
    render();
  });

  els.agentLayer.addEventListener('click', event => {
    const agent = event.target.closest('[data-agent-id]');
    if (!agent) return;
    selectedAgentId = agent.dataset.agentId;
    selectedRoomId = findAgent(selectedAgentId)?.location || null;
    selectedTaskId = findAgent(selectedAgentId)?.currentTaskId || null;
    render();
  });

  els.rosterList.addEventListener('click', event => {
    const row = event.target.closest('[data-agent-id]');
    if (!row) return;
    selectedAgentId = row.dataset.agentId;
    selectedRoomId = findAgent(selectedAgentId)?.location || null;
    selectedTaskId = findAgent(selectedAgentId)?.currentTaskId || null;
    render();
  });

  els.missionDeck.addEventListener('click', event => {
    const editBtn = event.target.closest('[data-edit-task]');
    if (editBtn) {
      openTaskModal(editBtn.dataset.editTask);
      return;
    }
    const card = event.target.closest('[data-task-id]');
    if (!card) return;
    selectedTaskId = card.dataset.taskId;
    const task = findTask(selectedTaskId);
    selectedAgentId = task?.assigneeId || null;
    selectedRoomId = task?.room || null;
    render();
  });

  els.missionDeck.addEventListener('change', async event => {
    const assign = event.target.closest('[data-task-assign]');
    const status = event.target.closest('[data-task-status]');

    if (assign) {
      const task = findTask(assign.dataset.taskAssign);
      if (!task) return;
      task.assigneeId = assign.value || null;
      task.updatedAt = new Date().toISOString();
      syncDerivedState();
      logActivity(`${task.assigneeId ? findAgent(task.assigneeId)?.name || 'Command' : 'Command'} reassigned “${task.title}”.`, 'assign', task.assigneeId, task.id);
      await saveState();
      render();
      return;
    }

    if (status) {
      const task = findTask(status.dataset.taskStatus);
      if (!task) return;
      task.status = status.value;
      task.updatedAt = new Date().toISOString();
      syncDerivedState();
      logActivity(`Mission “${task.title}” moved to ${statusLabel(task.status).toLowerCase()}.`, 'status', task.assigneeId, task.id);
      await saveState();
      render();
    }
  });

  els.focusCard.addEventListener('click', event => {
    const editBtn = event.target.closest('[data-edit-task]');
    if (editBtn) openTaskModal(editBtn.dataset.editTask);
  });

  els.modal.addEventListener('click', event => {
    if (event.target === els.modal) closeTaskModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !els.modal.classList.contains('hidden')) closeTaskModal();
  });
}

async function loadState() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('bad response');
    applyState(await response.json());
    saveStateToLocalCache();
  } catch {
    const cached = loadStateFromLocalCache();
    applyState(cached || DEFAULT_STATE);
    saveStateToLocalCache();
    if (!cached) await saveState();
  }
  syncDerivedState();
}

function applyState(payload) {
  const clone = JSON.parse(JSON.stringify(payload || DEFAULT_STATE));
  state.meta = clone.meta || {};
  state.agents = clone.agents || [];
  state.tasks = clone.tasks || [];
  state.activity = clone.activity || [];
}

function loadStateFromLocalCache() {
  try {
    const raw = window.localStorage.getItem(LOCAL_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveStateToLocalCache() {
  try {
    window.localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(state));
  } catch {
    // noop
  }
}

async function saveState() {
  state.meta.updatedAt = new Date().toISOString();
  saveStateToLocalCache();
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
  } catch {
    // local only in static mode
  }
}

function syncDerivedState() {
  state.agents.forEach(agent => {
    agent.homeLocation = agent.homeLocation || agent.location || 'command-dome';
    agent.currentTaskId = null;
    agent.status = 'idle';
    agent.load = agent.autoPick ? 18 : 12;
    agent.location = agent.homeLocation;
  });

  const assigned = [...state.tasks]
    .filter(task => task.assigneeId)
    .sort((a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status) || a.priority - b.priority);

  assigned.forEach(task => {
    const agent = findAgent(task.assigneeId);
    if (!agent || agent.currentTaskId) return;
    agent.currentTaskId = task.id;

    if (task.status === 'active') {
      agent.status = 'working';
      agent.location = task.room || agent.homeLocation;
      agent.load = 70 + task.priority * 6;
    } else if (task.status === 'review') {
      agent.status = 'reviewing';
      agent.location = 'war-room';
      agent.load = 58;
    } else if (task.status === 'queued' || task.status === 'intake') {
      agent.status = 'staged';
      agent.location = task.room || 'cargo-spine';
      agent.load = 42;
    }
  });

  if (selectedAgentId && !findAgent(selectedAgentId)) selectedAgentId = null;
  if (selectedTaskId && !findTask(selectedTaskId)) selectedTaskId = null;
  if (selectedRoomId && !ROOM_LAYOUT[selectedRoomId]) selectedRoomId = null;

  if (!selectedTaskId && !selectedAgentId && !selectedRoomId) {
    selectedAgentId = state.agents[0]?.id || null;
    selectedRoomId = state.agents[0]?.location || Object.keys(ROOM_LAYOUT)[0];
    selectedTaskId = state.agents[0]?.currentTaskId || null;
  }
}

function render() {
  renderMetrics();
  renderWorld();
  renderFocus();
  renderRoster();
  renderMissionDeck();
  renderFeed();
  els.taskCount.textContent = `${state.tasks.length} missions`;
  els.fleetCount.textContent = `${state.agents.length} agents`;
  els.worldStatus.textContent = `updated ${formatTimeAgo(state.meta.updatedAt || new Date().toISOString())}`;
}

function renderMetrics() {
  const metrics = [
    ['Agents active', state.agents.filter(agent => ['working', 'reviewing', 'staged'].includes(agent.status)).length],
    ['Waiting missions', state.tasks.filter(task => ['intake', 'queued'].includes(task.status)).length],
    ['Review queue', state.tasks.filter(task => task.status === 'review').length],
    ['Completed', state.tasks.filter(task => task.status === 'committed').length]
  ];

  els.metricGrid.innerHTML = metrics.map(([label, value]) => `
    <div class="metric-card">
      <div class="metric-label">${escapeHtml(label)}</div>
      <div class="metric-value">${value}</div>
    </div>
  `).join('');
}

function renderWorld() {
  renderRooms();
  renderAgents();
  renderCouriers();
}

function renderRooms() {
  els.roomLayer.innerHTML = Object.entries(ROOM_LAYOUT).map(([id, room]) => {
    const tasks = getTasksByRoom(id);
    const agents = getAgentsByRoom(id);
    const roomStatus = deriveRoomStatus(tasks);

    return `
      <div class="room-card status-${roomStatus} ${selectedRoomId === id ? 'selected' : ''}" data-room-id="${id}" style="--x:${room.x}px; --y:${room.y}px; --w:${room.w}px; --h:${room.h}px; --tone:${room.tone}; --accent:${room.accent};">
        <div class="room-inner">
          <div class="room-head">
            <div class="room-name">${escapeHtml(room.label)}</div>
            <div class="status-badge status-${roomStatus}">${escapeHtml(statusLabel(roomStatus))}</div>
          </div>
          <div class="room-note">${escapeHtml(room.note)}</div>
          <div class="room-stats">
            <span class="room-stat">${agents.length} ops</span>
            <span class="room-stat">${tasks.length} missions</span>
            <span class="room-stat room-stat-active">${tasks.filter(task => task.status === 'active').length} hot</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderAgents() {
  const activeIds = new Set();
  const roomBuckets = Object.keys(ROOM_LAYOUT).reduce((acc, roomId) => {
    acc[roomId] = getAgentsByRoom(roomId);
    return acc;
  }, {});

  Object.entries(roomBuckets).forEach(([roomId, agents]) => {
    const room = ROOM_LAYOUT[roomId];
    agents.forEach((agent, index) => {
      const point = roomSlot(room, index);
      const node = ensureAgentNode(agent);
      updateAgentNode(node, agent, point);
      activeIds.add(agent.id);
    });
  });

  [...els.agentLayer.querySelectorAll('[data-agent-id]')].forEach(node => {
    if (!activeIds.has(node.dataset.agentId)) node.remove();
  });
}

function ensureAgentNode(agent) {
  let node = els.agentLayer.querySelector(`[data-agent-id="${agent.id}"]`);
  if (node) return node;

  node = document.createElement('button');
  node.type = 'button';
  node.className = 'agent-node';
  node.dataset.agentId = agent.id;
  node.innerHTML = `
    <span class="agent-nameplate"></span>
    <span class="agent-status-tag"></span>
    <span class="agent-shadow"></span>
    <span class="agent-sprite-wrap">
      <span class="pixel-operator"></span>
    </span>
  `;
  els.agentLayer.appendChild(node);
  return node;
}

function updateAgentNode(node, agent, point) {
  const visual = AGENT_VISUALS[agent.id] || AGENT_VISUALS.artemis;
  const previous = agentMotionCache.get(agent.id);
  const moved = !!previous && (previous.x !== point.x || previous.y !== point.y);

  node.className = `agent-node state-${normalizeAgentStatus(agent.status)} ${selectedAgentId === agent.id ? 'selected' : ''} ${moved ? 'moving' : ''}`.trim();
  node.style.setProperty('--x', `${point.x}px`);
  node.style.setProperty('--y', `${point.y}px`);
  node.style.setProperty('--suit', visual.suit);
  node.style.setProperty('--suit-dark', visual.suitDark);
  node.style.setProperty('--accent', visual.accent);
  node.style.setProperty('--visor', visual.visor);
  node.style.setProperty('--skin', '#f1d7b6');
  node.style.transform = `translate(${point.x}px, ${point.y}px)`;

  node.querySelector('.agent-nameplate').textContent = agent.name;
  node.querySelector('.agent-status-tag').textContent = shortAgentStatus(agent.status);

  if (moved) {
    window.clearTimeout(Number(node.dataset.moveTimer || 0));
    const timer = window.setTimeout(() => node.classList.remove('moving'), 1100);
    node.dataset.moveTimer = String(timer);
  }

  agentMotionCache.set(agent.id, { x: point.x, y: point.y, roomId: agent.location, status: agent.status });
}

function renderCouriers() {
  const courierCount = Math.min(2, state.tasks.filter(task => !task.assigneeId && ['intake', 'queued'].includes(task.status)).length);
  els.courierLayer.innerHTML = Array.from({ length: courierCount }, (_, index) => `
    <div class="courier-node courier-path-${(index % 2) + 1}" style="--delay:${index * 1.4}s; --suit:${AGENT_VISUALS.courier.suit}; --suit-dark:${AGENT_VISUALS.courier.suitDark}; --accent:${AGENT_VISUALS.courier.accent}; --visor:${AGENT_VISUALS.courier.visor}; --skin:#f1d7b6;">
      <span class="courier-label">SUBAGENT</span>
      <span class="courier-shadow"></span>
      <span class="courier-sprite pixel-operator"></span>
    </div>
  `).join('');
}

function renderFocus() {
  const task = selectedTaskId ? findTask(selectedTaskId) : null;
  const agent = selectedAgentId ? findAgent(selectedAgentId) : null;
  const roomId = selectedRoomId || agent?.location || task?.room || null;
  const room = roomId ? ROOM_LAYOUT[roomId] : null;

  if (task) {
    const assignee = task.assigneeId ? findAgent(task.assigneeId) : null;
    els.focusTitle.textContent = task.title;
    els.focusCard.className = 'focus-card';
    els.focusCard.innerHTML = `
      <div class="focus-title-row">
        <span class="priority-pill priority-${task.priority}">P${task.priority}</span>
        <span class="status-badge status-${task.status}">${escapeHtml(statusLabel(task.status))}</span>
      </div>
      <div class="focus-blurb">${escapeHtml(task.description || '')}</div>
      <div class="detail-stack">
        <div class="detail-row"><span>Room</span>${escapeHtml(roomName(task.room))}</div>
        <div class="detail-row"><span>Assignee</span>${assignee ? escapeHtml(assignee.name) : 'Unassigned'}</div>
        <div class="detail-row"><span>Requester</span>${escapeHtml(task.requester || 'Unknown')}</div>
      </div>
      <div class="tag-row">${(task.tags || []).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}</div>
      <div class="action-row"><button class="btn" data-edit-task="${task.id}">Edit mission</button></div>
    `;
    return;
  }

  if (agent) {
    const currentTask = agent.currentTaskId ? findTask(agent.currentTaskId) : null;
    els.focusTitle.textContent = agent.name;
    els.focusCard.className = 'focus-card';
    els.focusCard.innerHTML = `
      <div class="focus-title-row">
        <span class="badge">${escapeHtml(agent.role)}</span>
        <span class="status-badge status-${normalizeAgentStatus(agent.status)}">${escapeHtml(readableAgentStatus(agent.status))}</span>
      </div>
      <div class="focus-blurb">${escapeHtml(agent.specialty)}</div>
      <div class="detail-stack">
        <div class="detail-row"><span>Location</span>${escapeHtml(roomName(agent.location))}</div>
        <div class="detail-row"><span>Load</span>${agent.load}%</div>
        <div class="detail-row"><span>Current mission</span>${currentTask ? escapeHtml(currentTask.title) : 'Awaiting assignment'}</div>
      </div>
      <div class="tag-row">${(agent.skills || []).map(skill => `<span class="tag">${escapeHtml(skill)}</span>`).join('')}</div>
    `;
    return;
  }

  if (room) {
    const roomTasks = getTasksByRoom(roomId);
    const roomAgents = getAgentsByRoom(roomId);
    const roomStatus = deriveRoomStatus(roomTasks);
    els.focusTitle.textContent = room.label;
    els.focusCard.className = 'focus-card';
    els.focusCard.innerHTML = `
      <div class="focus-title-row">
        <span class="status-badge status-${roomStatus}">${escapeHtml(statusLabel(roomStatus))}</span>
        <span class="badge">${roomAgents.length} operators</span>
      </div>
      <div class="focus-blurb">${escapeHtml(room.note)}</div>
      <div class="detail-stack">
        <div class="detail-row"><span>Operators</span>${roomAgents.length ? roomAgents.map(item => escapeHtml(item.name)).join(', ') : 'No one stationed here'}</div>
        <div class="detail-row"><span>Active work</span>${roomTasks.filter(item => item.status === 'active').length}</div>
        <div class="detail-row"><span>Review</span>${roomTasks.filter(item => item.status === 'review').length}</div>
      </div>
    `;
    return;
  }

  els.focusTitle.textContent = 'Nothing selected';
  els.focusCard.className = 'focus-card empty-card';
  els.focusCard.textContent = 'Click a room, agent, or mission.';
}

function renderRoster() {
  els.rosterList.innerHTML = state.agents.map(agent => {
    const currentTask = agent.currentTaskId ? findTask(agent.currentTaskId) : null;
    return `
      <div class="roster-row ${selectedAgentId === agent.id ? 'selected' : ''}" data-agent-id="${agent.id}">
        <div class="roster-top">
          <div class="roster-name">${escapeHtml(agent.name)}</div>
          <div class="status-badge status-${normalizeAgentStatus(agent.status)}">${escapeHtml(shortAgentStatus(agent.status))}</div>
        </div>
        <div class="roster-meta">${escapeHtml(agent.role)} · ${escapeHtml(roomName(agent.location))}</div>
        <div class="roster-meta">${currentTask ? escapeHtml(currentTask.title) : 'No mission assigned'}</div>
      </div>
    `;
  }).join('');
}

function renderMissionDeck() {
  els.missionDeck.innerHTML = STATUSES.map(status => {
    const tasks = state.tasks
      .filter(task => task.status === status.id)
      .sort((a, b) => a.priority - b.priority || new Date(a.createdAt) - new Date(b.createdAt));

    return `
      <section class="lane-card status-${status.id}">
        <div class="lane-head">
          <h3>${escapeHtml(status.label)}</h3>
          <span class="lane-chip">${tasks.length} queued</span>
        </div>
        <div class="mission-lane">
          ${tasks.length ? tasks.map(renderTaskCard).join('') : '<div class="empty-card">No missions here.</div>'}
        </div>
      </section>
    `;
  }).join('');
}

function renderTaskCard(task) {
  return `
    <div class="task-card status-${task.status} ${selectedTaskId === task.id ? 'selected' : ''}" data-task-id="${task.id}">
      <div class="task-status-line status-${task.status}"></div>
      <div class="task-top">
        <span class="priority-pill priority-${task.priority}">P${task.priority}</span>
        <span class="status-badge status-${task.status}">${escapeHtml(statusLabel(task.status))}</span>
      </div>
      <div class="task-title">${escapeHtml(task.title)}</div>
      <div class="task-desc">${escapeHtml(task.description || '')}</div>
      <div class="task-meta">
        <span class="task-mini">${escapeHtml(roomName(task.room))}</span>
        <span class="task-mini">${escapeHtml(task.requester || 'Unknown')}</span>
      </div>
      <div class="task-controls">
        <select class="task-select" data-task-assign="${task.id}">${renderAssigneeOptions(task.assigneeId)}</select>
        <select class="task-select" data-task-status="${task.id}">${renderStatusOptions(task.status)}</select>
        <button class="btn" type="button" data-edit-task="${task.id}">Edit</button>
      </div>
    </div>
  `;
}

function renderFeed() {
  els.feedList.innerHTML = [...state.activity]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 12)
    .map(item => `
      <div class="feed-item">
        <div>${escapeHtml(item.message)}</div>
        <div class="feed-time">${formatTimeAgo(item.createdAt)}</div>
      </div>
    `).join('');
}

function openTaskModal(taskId = null) {
  els.taskForm.reset();
  els.taskAssignee.innerHTML = renderAssigneeOptions('');
  els.deleteTaskBtn.style.display = taskId ? 'inline-flex' : 'none';

  if (taskId) {
    const task = findTask(taskId);
    els.modalTitle.textContent = 'Edit mission';
    els.taskId.value = task.id;
    els.taskTitle.value = task.title;
    els.taskDescription.value = task.description || '';
    els.taskProject.value = task.project || '';
    els.taskPriority.value = String(task.priority);
    els.taskStatus.value = task.status;
    els.taskAssignee.value = task.assigneeId || '';
    els.taskRequester.value = task.requester || '';
    els.taskRoom.value = task.room || 'command-dome';
    els.taskTags.value = (task.tags || []).join(', ');
  } else {
    els.modalTitle.textContent = 'New mission';
    els.taskStatus.value = 'intake';
    els.taskPriority.value = '2';
    els.taskRoom.value = 'cargo-spine';
  }

  els.modal.classList.remove('hidden');
}

function closeTaskModal() {
  els.modal.classList.add('hidden');
}

async function saveTask(event) {
  event.preventDefault();

  const payload = {
    title: els.taskTitle.value.trim(),
    description: els.taskDescription.value.trim(),
    project: els.taskProject.value.trim() || 'Mission Control',
    priority: Number(els.taskPriority.value),
    status: els.taskStatus.value,
    assigneeId: els.taskAssignee.value || null,
    requester: els.taskRequester.value.trim() || 'Michael',
    room: els.taskRoom.value,
    tags: els.taskTags.value.split(',').map(tag => tag.trim()).filter(Boolean),
    autoAssignable: true
  };

  if (!payload.title) return;

  if (els.taskId.value) {
    const task = findTask(els.taskId.value);
    Object.assign(task, payload, { updatedAt: new Date().toISOString() });
    selectedTaskId = task.id;
    selectedRoomId = task.room;
    selectedAgentId = task.assigneeId;
    logActivity(`Mission “${task.title}” was updated from the command terminal.`, 'task', task.assigneeId, task.id);
  } else {
    const task = {
      id: makeId('task'),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    state.tasks.unshift(task);
    selectedTaskId = task.id;
    selectedRoomId = task.room;
    selectedAgentId = task.assigneeId;
    logActivity(`New mission received: “${task.title}”.`, 'task', task.assigneeId, task.id);
  }

  syncDerivedState();
  await saveState();
  render();
  closeTaskModal();
}

async function deleteTask() {
  const id = els.taskId.value;
  if (!id) return;
  const task = findTask(id);
  state.tasks = state.tasks.filter(item => item.id !== id);
  if (selectedTaskId === id) selectedTaskId = null;
  logActivity(`Mission “${task?.title || id}” was deleted.`, 'task');
  syncDerivedState();
  await saveState();
  render();
  closeTaskModal();
}

async function autoDispatch() {
  const available = state.agents.filter(agent => agent.autoPick && !agent.currentTaskId);
  const queued = state.tasks.filter(task => ['intake', 'queued'].includes(task.status)).sort((a, b) => a.priority - b.priority);

  for (const task of queued) {
    const agent = chooseBestAgent(task, available);
    if (!agent) continue;
    task.assigneeId = agent.id;
    task.status = 'active';
    task.updatedAt = new Date().toISOString();
    available.splice(available.findIndex(item => item.id === agent.id), 1);
    logActivity(`${agent.name} auto-picked “${task.title}”.`, 'assign', agent.id, task.id);
  }

  syncDerivedState();
  await saveState();
  render();
}

async function simulateShift() {
  const review = [...state.tasks].sort((a, b) => a.priority - b.priority).find(task => task.status === 'review');
  const active = [...state.tasks].sort((a, b) => a.priority - b.priority).find(task => task.status === 'active');

  if (review) {
    review.status = 'committed';
    review.updatedAt = new Date().toISOString();
    logActivity(`Review cleared for “${review.title}”.`, 'ship', review.assigneeId, review.id);
  }

  if (active) {
    active.status = 'review';
    active.updatedAt = new Date().toISOString();
    logActivity(`“${active.title}” moved into review.`, 'review', active.assigneeId, active.id);
  }

  syncDerivedState();
  await autoDispatch();
}

function chooseBestAgent(task, availableAgents) {
  const taskText = `${task.title} ${task.description || ''} ${(task.tags || []).join(' ')}`.toLowerCase();
  const scored = availableAgents.map(agent => {
    let score = 0;
    for (const skill of agent.skills || []) {
      if (taskText.includes(skill.toLowerCase())) score += 3;
    }
    if (agent.location === task.room || agent.homeLocation === task.room) score += 2;
    if (agent.status === 'idle') score += 1;
    return { agent, score };
  }).sort((a, b) => b.score - a.score);

  return scored[0]?.agent || null;
}

function deriveRoomStatus(tasks) {
  if (tasks.some(task => task.status === 'review')) return 'review';
  if (tasks.some(task => task.status === 'active')) return 'active';
  if (tasks.some(task => ['intake', 'queued'].includes(task.status))) return 'queued';
  if (tasks.some(task => task.status === 'committed')) return 'committed';
  return 'idle';
}

function roomSlot(room, index) {
  const cols = room.w >= 260 ? 3 : 2;
  return {
    x: room.x + 42 + (index % cols) * 58,
    y: room.y + 88 + Math.floor(index / cols) * 44
  };
}

function getTasksByRoom(roomId) {
  return state.tasks.filter(task => task.room === roomId);
}

function getAgentsByRoom(roomId) {
  return state.agents.filter(agent => agent.location === roomId);
}

function normalizeAgentStatus(status) {
  if (status === 'reviewing') return 'review';
  if (status === 'staged') return 'queued';
  if (status === 'working') return 'active';
  return 'idle';
}

function readableAgentStatus(status) {
  return {
    working: 'Working',
    reviewing: 'Review',
    staged: 'Queued',
    idle: 'Idle'
  }[status] || status;
}

function shortAgentStatus(status) {
  return {
    working: 'WORK',
    reviewing: 'REVIEW',
    staged: 'QUEUE',
    idle: 'IDLE'
  }[status] || status.toUpperCase();
}

function renderAssigneeOptions(selectedId) {
  return ['<option value="">Unassigned</option>', ...state.agents.map(agent => `<option value="${agent.id}" ${selectedId === agent.id ? 'selected' : ''}>${escapeHtml(agent.name)}</option>`)].join('');
}

function renderStatusOptions(selectedId) {
  return STATUSES.map(status => `<option value="${status.id}" ${selectedId === status.id ? 'selected' : ''}>${escapeHtml(status.label)}</option>`).join('');
}

function findAgent(id) {
  return state.agents.find(agent => agent.id === id) || null;
}

function findTask(id) {
  return state.tasks.find(task => task.id === id) || null;
}

function roomName(id) {
  return ROOM_LAYOUT[id]?.label || id || 'Unknown';
}

function statusLabel(id) {
  return STATUSES.find(status => status.id === id)?.label || {
    idle: 'Idle',
    queued: 'Assigned',
    active: 'In Progress',
    review: 'Review',
    committed: 'Done'
  }[id] || id;
}

function logActivity(message, type = 'task', agentId = null, taskId = null) {
  state.activity.unshift({
    id: makeId('evt'),
    type,
    agentId,
    taskId,
    message,
    createdAt: new Date().toISOString()
  });
  state.activity = state.activity.slice(0, 24);
}

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatTimeAgo(iso) {
  const diff = Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
