const API_URL = '/api/state';
const LOCAL_STATE_KEY = 'artemishunts-mission-control-state';

const STATUSES = [
  { id: 'intake', label: 'Inbox', subtitle: 'New missions landing from humans or agents.' },
  { id: 'queued', label: 'Assigned', subtitle: 'Prioritized and waiting for execution.' },
  { id: 'active', label: 'In Progress', subtitle: 'Being worked right now.' },
  { id: 'review', label: 'Review', subtitle: 'Needs approval, QA, or merge eyes.' },
  { id: 'committed', label: 'Done', subtitle: 'Completed and logged.' }
];

const ROOM_LAYOUT = {
  'command-dome': { label: 'Command Dome', x: 780, y: 170, w: 240, h: 150, color: 0x143a74 },
  'forge-bay': { label: 'Forge Bay', x: 420, y: 180, w: 260, h: 180, color: 0x513089 },
  'cargo-spine': { label: 'Cargo Spine', x: 720, y: 360, w: 300, h: 150, color: 0x70522f },
  'dock-ring': { label: 'Dock Ring', x: 980, y: 290, w: 210, h: 220, color: 0x194f5c },
  'war-room': { label: 'War Room', x: 590, y: 550, w: 270, h: 150, color: 0x5e1f3e },
  'observatory': { label: 'Observatory', x: 250, y: 470, w: 240, h: 180, color: 0x224d61 }
};

const AGENT_COLORS = {
  artemis: 0x72e4ff,
  forge: 0x9d85ff,
  quartermaster: 0xffc667,
  sentinel: 0xff7f91,
  prospector: 0x7df0c0,
  navigator: 0xb0bcff
};

const DEFAULT_STATE = {
  meta: {
    title: 'Asteroid Campus',
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
      title: 'Rebuild Mission Control as a visual 2D campus',
      description: 'Move from dashboard-first UI to an actual world where agents are visible, spatial, and state-driven.',
      project: 'Mission Control',
      priority: 1,
      status: 'active',
      requester: 'Michael',
      assigneeId: 'artemis',
      room: 'command-dome',
      autoAssignable: true,
      tags: ['campus', 'phaser', 'world'],
      createdAt: '2026-04-19T20:30:00Z',
      updatedAt: '2026-04-19T20:32:00Z'
    },
    {
      id: 'task-world-render',
      title: 'Render rooms and agents inside the asteroid base',
      description: 'Build a spatial scene with rooms, paths, and agent avatars moving to work zones.',
      project: 'Mission Control',
      priority: 1,
      status: 'active',
      requester: 'Artemis',
      assigneeId: 'forge',
      room: 'forge-bay',
      autoAssignable: true,
      tags: ['phaser', 'rendering', 'agents'],
      createdAt: '2026-04-19T20:31:00Z',
      updatedAt: '2026-04-19T20:34:00Z'
    },
    {
      id: 'task-world-events',
      title: 'Map task states to visible agent behavior',
      description: 'Working, idle, review, and staged states should visibly change agent movement and effects.',
      project: 'Mission Control',
      priority: 1,
      status: 'review',
      requester: 'Artemis',
      assigneeId: 'sentinel',
      room: 'war-room',
      autoAssignable: true,
      tags: ['animation', 'state', 'review'],
      createdAt: '2026-04-19T20:32:00Z',
      updatedAt: '2026-04-19T20:36:00Z'
    },
    {
      id: 'task-activity-bridge',
      title: 'Wire event bridge for task and agent telemetry',
      description: 'The scene should eventually consume real OpenClaw state, not static demo data.',
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
      title: 'Visualize subagents as temporary workers and couriers',
      description: 'Short-lived child sessions should appear as helpers moving through the base.',
      project: 'Mission Control',
      priority: 2,
      status: 'queued',
      requester: 'Michael',
      assigneeId: null,
      room: 'cargo-spine',
      autoAssignable: true,
      tags: ['subagents', 'visualization'],
      createdAt: '2026-04-19T20:35:00Z',
      updatedAt: '2026-04-19T20:35:00Z'
    },
    {
      id: 'task-human-console',
      title: 'Keep a compact command board attached to the world',
      description: 'Spatial campus does not replace workflow management. It has to sit beside it.',
      project: 'Mission Control',
      priority: 2,
      status: 'intake',
      requester: 'Michael',
      assigneeId: null,
      room: 'command-dome',
      autoAssignable: true,
      tags: ['board', 'workflow'],
      createdAt: '2026-04-19T20:36:00Z',
      updatedAt: '2026-04-19T20:36:00Z'
    },
    {
      id: 'task-okr-layer',
      title: 'Map every mission to the autonomous dev OKR',
      description: 'The world should make it obvious which work matters and why.',
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
      message: 'Artemis redirected the frontend from dashboard theater into a real spatial campus prototype.',
      createdAt: '2026-04-19T20:32:00Z'
    },
    {
      id: 'evt-2',
      type: 'build',
      agentId: 'forge',
      taskId: 'task-world-render',
      message: 'Forge is laying out the asteroid rooms and visual agent positions in the scene.',
      createdAt: '2026-04-19T20:34:00Z'
    },
    {
      id: 'evt-3',
      type: 'review',
      agentId: 'sentinel',
      taskId: 'task-world-events',
      message: 'Sentinel is validating whether visible behavior actually reflects state instead of faking it.',
      createdAt: '2026-04-19T20:36:00Z'
    }
  ]
};

const state = { meta: {}, agents: [], tasks: [], activity: [] };
let selectedAgentId = null;
let game = null;
let sceneRef = null;

const els = {};

window.addEventListener('DOMContentLoaded', async () => {
  cacheElements();
  populateStaticSelects();
  bindEvents();
  await loadState();
  renderUI();
  bootGame();
});

function cacheElements() {
  els.metricGrid = document.getElementById('metric-grid');
  els.worldStatus = document.getElementById('world-status');
  els.selectedAgentCard = document.getElementById('selected-agent-card');
  els.selectedAgentStatus = document.getElementById('selected-agent-status');
  els.rosterList = document.getElementById('roster-list');
  els.taskCount = document.getElementById('task-count');
  els.fleetCount = document.getElementById('fleet-count');
  els.boardColumns = document.getElementById('board-columns');
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

  els.rosterList.addEventListener('click', event => {
    const row = event.target.closest('[data-agent-id]');
    if (!row) return;
    selectAgent(row.dataset.agentId);
  });

  els.boardColumns.addEventListener('click', event => {
    const card = event.target.closest('[data-task-id]');
    if (!card) return;
    openTaskModal(card.dataset.taskId);
  });

  els.boardColumns.addEventListener('change', async event => {
    const select = event.target.closest('[data-assign-id]');
    if (!select) return;
    const task = findTask(select.dataset.assignId);
    if (!task) return;
    task.assigneeId = select.value || null;
    task.updatedAt = new Date().toISOString();
    syncDerivedState();
    logActivity(`${task.assigneeId ? findAgent(task.assigneeId).name : 'Command'} reassigned “${task.title}”.`, 'assign', task.assigneeId, task.id);
    await saveState();
    renderUI();
    refreshGameWorld();
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
  } catch (error) {
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
    // local cache only in static mode
  }
}

function renderUI() {
  renderMetrics();
  renderSelectedAgent();
  renderRoster();
  renderBoard();
  renderFeed();
  els.worldStatus.textContent = 'live state';
  els.taskCount.textContent = `${state.tasks.length} missions`;
  els.fleetCount.textContent = `${state.agents.length} agents`;
}

function renderMetrics() {
  const active = state.agents.filter(agent => ['working', 'reviewing', 'staged'].includes(agent.status)).length;
  const queued = state.tasks.filter(task => ['intake', 'queued'].includes(task.status)).length;
  const review = state.tasks.filter(task => task.status === 'review').length;
  const shipped = state.tasks.filter(task => task.status === 'committed').length;
  const cards = [
    ['Agents active', active],
    ['Queued work', queued],
    ['In review', review],
    ['Done', shipped]
  ];

  els.metricGrid.innerHTML = cards.map(([label, value]) => `
    <div class="stat-card">
      <div class="stat-label">${escapeHtml(label)}</div>
      <div class="stat-value">${escapeHtml(String(value))}</div>
    </div>
  `).join('');
}

function renderSelectedAgent() {
  const agent = selectedAgentId ? findAgent(selectedAgentId) : null;
  if (!agent) {
    els.selectedAgentStatus.textContent = 'none';
    els.selectedAgentCard.className = 'selected-agent empty-card';
    els.selectedAgentCard.textContent = 'Click an agent in the world.';
    return;
  }

  const task = agent.currentTaskId ? findTask(agent.currentTaskId) : null;
  els.selectedAgentStatus.textContent = agent.status;
  els.selectedAgentCard.className = 'selected-agent';
  els.selectedAgentCard.innerHTML = `
    <h3>${escapeHtml(agent.name)}</h3>
    <div class="detail-list">
      <div class="detail-row"><span>Role</span>${escapeHtml(agent.role)}</div>
      <div class="detail-row"><span>Location</span>${escapeHtml(roomName(agent.location))}</div>
      <div class="detail-row"><span>Specialty</span>${escapeHtml(agent.specialty)}</div>
      <div class="detail-row"><span>Current mission</span>${task ? escapeHtml(task.title) : 'Awaiting assignment'}</div>
      <div class="detail-row"><span>Load</span>${agent.load}%</div>
    </div>
    <div class="tag-row">${agent.skills.map(skill => `<span class="tag">${escapeHtml(skill)}</span>`).join('')}</div>
  `;
}

function renderRoster() {
  els.rosterList.innerHTML = state.agents.map(agent => {
    const task = agent.currentTaskId ? findTask(agent.currentTaskId) : null;
    return `
      <div class="roster-item ${selectedAgentId === agent.id ? 'selected' : ''}" data-agent-id="${agent.id}">
        <div class="roster-name-row">
          <strong>${escapeHtml(agent.name)}</strong>
          <span class="badge">${escapeHtml(agent.status)}</span>
        </div>
        <div class="roster-role">${escapeHtml(agent.role)}</div>
        <div class="roster-meta">
          <div class="mini-stat">${escapeHtml(roomName(agent.location))}</div>
          <div class="mini-stat">${task ? escapeHtml(task.title) : 'No mission assigned'}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderBoard() {
  els.boardColumns.innerHTML = STATUSES.map(column => {
    const tasks = state.tasks.filter(task => task.status === column.id).sort((a, b) => a.priority - b.priority);
    return `
      <section class="column">
        <h3>${escapeHtml(column.label)}</h3>
        <p>${escapeHtml(column.subtitle)}</p>
        <div class="column-stack">
          ${tasks.length ? tasks.map(task => renderTaskCard(task)).join('') : '<div class="task-card">Empty</div>'}
        </div>
      </section>
    `;
  }).join('');
}

function renderTaskCard(task) {
  return `
    <div class="task-card" data-task-id="${task.id}">
      <div class="task-top">
        <span class="priority-dot priority-${task.priority}"></span>
        <span class="badge">P${task.priority}</span>
      </div>
      <div class="task-title">${escapeHtml(task.title)}</div>
      <div class="task-desc">${escapeHtml(task.description || '')}</div>
      <div class="task-footer">
        <span class="badge">${escapeHtml(task.project)}</span>
      </div>
      <div class="task-meta">
        <select class="task-select" data-assign-id="${task.id}">
          ${renderAssigneeOptions(task.assigneeId)}
        </select>
      </div>
    </div>
  `;
}

function renderAssigneeOptions(selectedId) {
  return ['<option value="">Unassigned</option>', ...state.agents.map(agent => `<option value="${agent.id}" ${selectedId === agent.id ? 'selected' : ''}>${escapeHtml(agent.name)}</option>`)].join('');
}

function renderFeed() {
  els.feedList.innerHTML = [...state.activity]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10)
    .map(item => `
      <div class="feed-item">
        <div class="feed-message">${escapeHtml(item.message)}</div>
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
    logActivity(`Mission “${task.title}” was updated from Mission Control.`, 'task', task.assigneeId, task.id);
  } else {
    const task = {
      id: makeId('task'),
      ...payload,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    state.tasks.unshift(task);
    logActivity(`New mission received: “${task.title}”.`, 'task', task.assigneeId, task.id);
  }

  syncDerivedState();
  await saveState();
  renderUI();
  refreshGameWorld();
  closeTaskModal();
}

async function deleteTask() {
  const id = els.taskId.value;
  if (!id) return;
  const task = findTask(id);
  state.tasks = state.tasks.filter(item => item.id !== id);
  logActivity(`Mission “${task?.title || id}” was deleted.`, 'task');
  syncDerivedState();
  await saveState();
  renderUI();
  refreshGameWorld();
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
    task.room = agent.location;
    task.updatedAt = new Date().toISOString();
    available.splice(available.findIndex(a => a.id === agent.id), 1);
    logActivity(`${agent.name} auto-picked “${task.title}”.`, 'assign', agent.id, task.id);
  }
  syncDerivedState();
  await saveState();
  renderUI();
  refreshGameWorld();
}

async function simulateShift() {
  const active = state.tasks.find(task => task.status === 'active');
  const review = state.tasks.find(task => task.status === 'review');
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
  await autoDispatch();
}

function chooseBestAgent(task, availableAgents) {
  const taskText = `${task.title} ${task.description} ${(task.tags || []).join(' ')}`.toLowerCase();
  const scored = availableAgents.map(agent => {
    let score = 0;
    for (const skill of agent.skills) {
      if (taskText.includes(skill.toLowerCase())) score += 3;
    }
    if (task.room === agent.location) score += 2;
    if (agent.status === 'idle') score += 1;
    return { agent, score };
  }).sort((a, b) => b.score - a.score);
  return scored[0]?.agent || null;
}

function syncDerivedState() {
  state.agents.forEach(agent => {
    agent.currentTaskId = null;
    if (!ROOM_LAYOUT[agent.location]) agent.location = 'command-dome';
    if (!agent.status) agent.status = 'idle';
  });

  state.tasks.forEach(task => {
    if (!task.assigneeId) return;
    const agent = findAgent(task.assigneeId);
    if (!agent) return;
    agent.currentTaskId = task.id;
    if (task.status === 'active') {
      agent.status = 'working';
      agent.location = task.room || agent.location;
      agent.load = 72 + task.priority * 4;
    } else if (task.status === 'review') {
      agent.status = 'reviewing';
      agent.location = 'war-room';
      agent.load = 60;
    } else if (task.status === 'queued' || task.status === 'intake') {
      agent.status = 'staged';
      agent.location = task.room || 'cargo-spine';
      agent.load = 42;
    } else if (task.status === 'committed' && agent.status === 'idle') {
      agent.location = task.room || agent.location;
    }
  });

  state.agents.forEach(agent => {
    if (!agent.currentTaskId && agent.status !== 'reviewing') {
      agent.status = 'idle';
      agent.load = agent.autoPick ? 18 : 12;
    }
  });

  if (!selectedAgentId && state.agents[0]) selectedAgentId = state.agents[0].id;
}

function bootGame() {
  if (game) game.destroy(true);
  sceneRef = null;
  game = new Phaser.Game({
    type: Phaser.AUTO,
    width: 1280,
    height: 580,
    parent: 'game-root',
    backgroundColor: '#050917',
    scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
    scene: {
      create,
      update
    }
  });
}

function create() {
  sceneRef = this;
  drawWorld(this);
  drawAgents(this);
}

function update(_time, delta) {
  if (!sceneRef?.agentSprites) return;
  for (const sprite of sceneRef.agentSprites) {
    if (!sprite.target) continue;
    const speed = sprite.speed * (delta / 1000);
    const dist = Phaser.Math.Distance.Between(sprite.x, sprite.y, sprite.target.x, sprite.target.y);
    if (dist > 2) {
      const angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, sprite.target.x, sprite.target.y);
      sprite.x += Math.cos(angle) * speed;
      sprite.y += Math.sin(angle) * speed;
      sprite.label.x = sprite.x;
      sprite.label.y = sprite.y - 26;
      sprite.effect.x = sprite.x;
      sprite.effect.y = sprite.y;
    }
  }
}

function drawWorld(scene) {
  scene.children.removeAll();
  scene.agentSprites = [];
  scene.add.rectangle(640, 290, 1280, 580, 0x060c1f);

  for (let i = 0; i < 220; i += 1) {
    const star = scene.add.circle(Math.random() * 1280, Math.random() * 580, Math.random() * 1.8 + 0.4, 0xffffff, Math.random() * 0.8 + 0.2);
    star.setAlpha(Math.random() * 0.7 + 0.2);
  }

  scene.add.ellipse(640, 296, 1040, 520, 0x0e1834, 0.95).setStrokeStyle(3, 0x223f7d, 0.8);
  scene.add.ellipse(640, 296, 980, 460, 0x09101f, 0.7).setStrokeStyle(2, 0x192d57, 0.4);
  scene.add.circle(1140, 110, 58, 0x6fd1ff, 0.08).setStrokeStyle(2, 0x6fd1ff, 0.15);
  scene.add.circle(120, 480, 42, 0xd48cff, 0.06).setStrokeStyle(2, 0xd48cff, 0.12);

  Object.entries(ROOM_LAYOUT).forEach(([id, room]) => {
    scene.add.rectangle(room.x, room.y, room.w, room.h, room.color, 0.82).setStrokeStyle(2, 0x8ebcff, 0.18);
    scene.add.text(room.x - room.w / 2 + 14, room.y - room.h / 2 + 12, room.label, {
      fontFamily: 'Inter', fontSize: '18px', color: '#eef4ff', fontStyle: '700'
    });
    scene.add.text(room.x - room.w / 2 + 14, room.y - room.h / 2 + 40, roomSubtitle(id), {
      fontFamily: 'Inter', fontSize: '12px', color: '#9ab0d7', wordWrap: { width: room.w - 24 }
    });
  });

  scene.add.text(52, 40, 'ASTEROID CAMPUS // Phaser spatial prototype', {
    fontFamily: 'Inter', fontSize: '18px', color: '#72e4ff', fontStyle: '700'
  });
}

function drawAgents(scene) {
  state.agents.forEach((agent, index) => {
    const room = ROOM_LAYOUT[agent.location] || ROOM_LAYOUT['command-dome'];
    const target = roomSlot(room, index);
    const color = AGENT_COLORS[agent.id] || 0xffffff;
    const sprite = scene.add.circle(target.x + Phaser.Math.Between(-20, 20), target.y + Phaser.Math.Between(-16, 16), 12, color, 1);
    sprite.setStrokeStyle(3, 0xffffff, 0.14);
    sprite.setInteractive({ useHandCursor: true });
    sprite.agentId = agent.id;
    sprite.target = target;
    sprite.speed = agent.status === 'working' ? 90 : agent.status === 'reviewing' ? 70 : 45;

    const label = scene.add.text(sprite.x, sprite.y - 26, agent.name, {
      fontFamily: 'Inter', fontSize: '12px', color: '#edf2ff', fontStyle: '700'
    }).setOrigin(0.5, 0.5);

    const effectColor = agent.status === 'working'
      ? 0x61e8a5
      : agent.status === 'reviewing'
        ? 0xffc667
        : agent.status === 'staged'
          ? 0x72e4ff
          : 0xb0bcff;

    const effect = scene.add.circle(sprite.x, sprite.y, 19, effectColor, 0.12).setStrokeStyle(1, effectColor, 0.24);
    scene.tweens.add({
      targets: effect,
      scale: 1.22,
      alpha: 0.05,
      duration: 1100 + index * 90,
      yoyo: true,
      repeat: -1
    });

    if (agent.status === 'working') {
      scene.tweens.add({ targets: sprite, y: sprite.y - 5, duration: 420, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    } else if (agent.status === 'idle') {
      scene.tweens.add({ targets: sprite, angle: 4, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    }

    sprite.on('pointerdown', () => selectAgent(agent.id));
    scene.agentSprites.push({ ...sprite, label, effect, target, speed: sprite.speed });
  });
}

function refreshGameWorld() {
  if (sceneRef) {
    drawWorld(sceneRef);
    drawAgents(sceneRef);
  }
}

function roomSlot(room, index) {
  return {
    x: room.x - room.w / 2 + 40 + (index % 3) * 62,
    y: room.y - room.h / 2 + 82 + (index % 2) * 52
  };
}

function roomSubtitle(id) {
  return {
    'command-dome': 'routing, oversight, mission-level coordination',
    'forge-bay': 'building interfaces, implementation, fabrication',
    'cargo-spine': 'task intake, assignment flow, logistics',
    'dock-ring': 'deploys, integrations, event bridge plumbing',
    'war-room': 'planning, QA, approvals, conflict resolution',
    'observatory': 'research, memory, scanning and signal watch'
  }[id] || 'operational zone';
}

function selectAgent(agentId) {
  selectedAgentId = agentId;
  renderSelectedAgent();
  renderRoster();
}

function findAgent(id) {
  return state.agents.find(agent => agent.id === id) || null;
}

function findTask(id) {
  return state.tasks.find(task => task.id === id) || null;
}

function roomName(id) {
  return ROOM_LAYOUT[id]?.label || id;
}

function logActivity(message, type = 'task', agentId = null, taskId = null) {
  state.activity.unshift({ id: makeId('evt'), type, agentId, taskId, message, createdAt: new Date().toISOString() });
  state.activity = state.activity.slice(0, 20);
}

function makeId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatTimeAgo(iso) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
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
