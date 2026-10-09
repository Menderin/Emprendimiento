'use strict';

// Both perspectives operate on the same persisted demo data.
const STORAGE_KEY = 'tasku-demo-v1';
const providers = [
  { id: 'provider-001', name: 'Camila R.', specialty: 'Ingeniería · Soporte técnico', skills: ['Hardware', 'Instalación de componentes', 'Soporte técnico'], rating: '4,9', completedJobs: 14, verified: true, availability: 'Disponible por las tardes', comment: '“Muy cuidadosa y clara al explicar. Mi notebook quedó funcionando perfecto.”' },
  { id: 'provider-002', name: 'Matías P.', specialty: 'Informática · Mantenimiento', skills: ['Mantenimiento', 'Software', 'Informática'], rating: '4,6', completedJobs: 6, verified: true, availability: 'Disponible después de clases', comment: '“Puntual y atento. Resolvió el problema y me explicó cómo evitarlo.”' }
];
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const money = value => new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(value);
const dateLabel = value => new Intl.DateTimeFormat('es-CL', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(value));
function tomorrow() {
  const date = new Date(); date.setDate(date.getDate() + 1); date.setHours(16, 0, 0, 0);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}T16:00`;
}
function initialData() {
  return { providers, tasks: [{ id: 'task-001', title: 'Instalar SSD en notebook', description: 'Necesito ayuda para instalar un SSD en mi notebook. Tengo el componente y me gustaría recibir orientación para dejar todo funcionando.', category: 'Tecnología', location: 'Campus Guayacán', budget: 10000, dueDate: tomorrow(), status: 'publicada', applicants: [], selectedProviderId: null }] };
}
function loadData() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && Array.isArray(saved.tasks) && Array.isArray(saved.providers) && saved.tasks.every(task => task.id && task.title && Array.isArray(task.applicants) && Number.isFinite(task.budget) && !Number.isNaN(Date.parse(task.dueDate)) && ['publicada', 'contratada', 'completada'].includes(task.status))) return saved;
  } catch { /* Missing or invalid demo data falls back to the initial example. */ }
  return initialData();
}
let data = loadData();
let role = 'requester';
let view = 'all';
let selectedTaskId = null;
let toastTimer;
function notify(message) {
  clearTimeout(toastTimer); $('#toast').textContent = message; $('#toast').hidden = false;
  toastTimer = setTimeout(() => { $('#toast').hidden = true; }, 4500);
}
function saveData(nextData) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData)); data = nextData; return true; }
  catch { notify('No se pudo guardar. Revisa que el navegador permita almacenamiento local.'); return false; }
}
function updateTask(taskId, mutate) {
  const next = JSON.parse(JSON.stringify(data));
  const task = next.tasks.find(item => item.id === taskId);
  if (!task) return false;
  mutate(task);
  if (!saveData(next)) return false;
  render(); renderDetail(); return true;
}
function activeProvider() { return data.providers.find(provider => provider.id === $('#provider-select').value); }
function taskStatus(task) {
  if (role === 'provider' && task.status === 'contratada' && task.selectedProviderId === activeProvider()?.id) return 'Trabajo asignado';
  return { publicada: 'Publicada', contratada: 'Contratada', completada: 'Completada' }[task.status];
}
function render() {
  const requester = role === 'requester';
  document.querySelectorAll('[data-role]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.role === role)));
  $('#hero-title').innerHTML = requester ? 'Una mano cerca.<br><span>Una tarea menos.</span>' : 'Lo que sabes hacer.<br><span>Una oportunidad más.</span>';
  $('#hero-description').textContent = requester ? 'Conecta con estudiantes de tu campus y encuentra ayuda para eso que necesitas resolver.' : 'Descubre tareas de tu comunidad, comparte tus habilidades y postula a tu próximo trabajo.';
  $('#publish-open').hidden = !requester; $('#provider-control').hidden = requester;
  $('#list-title').textContent = requester ? 'Mis publicaciones' : 'Explorar tareas';
  $('#list-description').textContent = requester ? 'Sigue tus tareas y encuentra a la persona indicada.' : 'Encuentra algo que puedas resolver. Tu talento tiene un lugar aquí.';
  const counts = [data.tasks.filter(t => t.status === 'publicada').length, data.tasks.reduce((count, task) => count + task.applicants.length, 0), data.tasks.filter(t => t.status !== 'publicada').length];
  $('#stats').innerHTML = ['Tareas publicadas', 'Postulaciones recibidas', 'Conexiones realizadas'].map((label, index) => `<div class="stat"><span class="stat-icon">${['▤', '↗', '✓'][index]}</span><div><strong>${counts[index]}</strong><small>${label}</small></div></div>`).join('');
  const list = data.tasks.filter(task => {
    const statusMatches = view === 'all' || task.status === ({ published: 'publicada', assigned: 'contratada', completed: 'completada' }[view]);
    const visible = requester || task.status === 'publicada' || task.selectedProviderId === activeProvider()?.id;
    return visible && statusMatches && (!$('#category-filter').value || task.category === $('#category-filter').value);
  });
  $('#tasks').innerHTML = list.map(task => `<article class="task-card"><div class="card-top"><span class="category">${escapeHTML(task.category)}</span><span class="status ${task.status}">${taskStatus(task)}</span></div><h3>${escapeHTML(task.title)}</h3><p class="description">${escapeHTML(task.description)}</p><div class="meta"><span>⌖ ${escapeHTML(task.location)}</span><span>◷ ${escapeHTML(dateLabel(task.dueDate))}</span></div><div class="card-bottom"><span class="price">${money(task.budget)} <small>CLP</small></span><button class="card-link" data-detail="${escapeHTML(task.id)}">Ver detalle →</button></div><div class="applicant-note">${requester ? `${task.applicants.length} ${task.applicants.length === 1 ? 'postulación' : 'postulaciones'}` : task.applicants.includes(activeProvider()?.id) ? '✓ Ya postulaste a esta tarea' : task.status === 'publicada' ? 'Abierta a postulaciones' : 'Asignada a tu perfil'}</div></article>`).join('') || '<div class="empty">No hay tareas en esta vista. Prueba otra categoría o publica una nueva tarea.</div>';
}
function profileHTML(provider, task) {
  return `<article class="profile"><div class="profile-heading"><span class="avatar">${escapeHTML(provider.name[0])}</span><div><h3>${escapeHTML(provider.name)}</h3><p style="margin:4px 0">${escapeHTML(provider.specialty)}</p></div></div><p>★ ${escapeHTML(provider.rating)}/5 · ${provider.completedJobs} trabajos realizados</p><span class="verified">✓ Identidad universitaria UCN verificada (simulada)</span><p><strong>Habilidades:</strong> ${escapeHTML(provider.skills.join(' · '))}<br><strong>Disponibilidad:</strong> ${escapeHTML(provider.availability)}</p><blockquote>${escapeHTML(provider.comment)}</blockquote>${role === 'requester' && task.status === 'publicada' ? `<button class="primary" data-hire="${provider.id}">Contratar a ${escapeHTML(provider.name)}</button>` : ''}</article>`;
}
function renderDetail() {
  const task = data.tasks.find(item => item.id === selectedTaskId); if (!task) return;
  let actions = '';
  if (role === 'requester') {
    actions = task.status === 'publicada' ? `<h3>Compara los perfiles</h3><p class="form-note">Reputación, comentarios y verificación son datos simulados.</p>${task.applicants.map(id => data.providers.find(p => p.id === id)).filter(Boolean).map(p => profileHTML(p, task)).join('') || '<p class="description">Todavía no hay postulaciones. Cambia a «Ofrecer mis habilidades» para simular una.</p>'}` : `<h3>Prestador seleccionado</h3>${profileHTML(data.providers.find(p => p.id === task.selectedProviderId), task)}${task.status === 'contratada' ? '<button class="primary" data-complete>Marcar como completada</button>' : '<p class="verified">✓ Tarea completada</p>'}`;
  } else if (task.status === 'publicada') {
    const applied = task.applicants.includes(activeProvider().id);
    actions = `${profileHTML(activeProvider(), task)}<p class="form-note">Estás simulando el perfil de ${escapeHTML(activeProvider().name)}.</p><button class="primary" data-apply ${applied ? 'disabled' : ''}>${applied ? '✓ Ya postulaste' : 'Postular al trabajo'}</button>`;
  } else {
    actions = `<p class="verified">✓ ${task.status === 'completada' ? 'Trabajo completado' : 'Trabajo asignado'} a ${escapeHTML(data.providers.find(p => p.id === task.selectedProviderId).name)}</p>`;
  }
  $('#detail').innerHTML = `<div class="dialog-heading"><div><span class="category">${escapeHTML(task.category)}</span><h2>${escapeHTML(task.title)}</h2></div><button class="close" data-close="detail-dialog" aria-label="Cerrar">×</button></div><span class="status ${task.status}">${taskStatus(task)}</span><p class="description">${escapeHTML(task.description)}</p><div class="detail-meta"><span>⌖ ${escapeHTML(task.location)}</span><span>◷ ${escapeHTML(dateLabel(task.dueDate))}</span><strong>${money(task.budget)} CLP</strong></div>${actions}`;
}
$('#provider-select').innerHTML = data.providers.map(p => `<option value="${p.id}">${escapeHTML(p.name)}</option>`).join('');
document.addEventListener('click', event => {
  const button = event.target.closest('button'); if (!button) return;
  if (button.dataset.role) { role = button.dataset.role; $('#detail-dialog').close(); render(); }
  if (button.dataset.view) { view = button.dataset.view; document.querySelectorAll('[data-view]').forEach(item => item.classList.toggle('active', item === button)); render(); }
  if (button.dataset.close) $(`#${button.dataset.close}`).close();
  if (button.dataset.detail) { selectedTaskId = button.dataset.detail; renderDetail(); $('#detail-dialog').showModal(); }
  if (button.hasAttribute('data-apply')) {
    const task = data.tasks.find(item => item.id === selectedTaskId); const provider = activeProvider();
    if (role === 'provider' && task.status === 'publicada' && !task.applicants.includes(provider.id) && updateTask(task.id, item => item.applicants.push(provider.id))) notify('Postulación enviada. Vuelve a «Necesito ayuda» para revisarla.');
  }
  if (button.dataset.hire) {
    const task = data.tasks.find(item => item.id === selectedTaskId);
    if (role === 'requester' && task.status === 'publicada' && task.applicants.includes(button.dataset.hire) && updateTask(task.id, item => { item.selectedProviderId = button.dataset.hire; item.status = 'contratada'; })) notify('¡Contratación confirmada! El prestador ya tiene el trabajo asignado.');
  }
  if (button.hasAttribute('data-complete') && role === 'requester' && updateTask(selectedTaskId, item => { if (item.status === 'contratada') item.status = 'completada'; })) notify('Tarea marcada como completada.');
});
$('#provider-select').addEventListener('change', () => { render(); renderDetail(); });
$('#category-filter').addEventListener('change', render);
$('#publish-open').addEventListener('click', () => { $('#publish-form').elements.dueDate.value = tomorrow(); $('#publish-dialog').showModal(); });
$('#publish-form').addEventListener('submit', event => {
  event.preventDefault(); const form = event.currentTarget; const fields = new FormData(form);
  const title = fields.get('title').trim(), description = fields.get('description').trim(), location = fields.get('location').trim();
  if (!title || !description || !location) { notify('Completa los campos con texto válido.'); return; }
  const task = { id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, title, description, category: fields.get('category'), location, budget: Number(fields.get('budget')), dueDate: fields.get('dueDate'), status: 'publicada', applicants: [], selectedProviderId: null };
  if (!saveData({ ...data, tasks: [task, ...data.tasks] })) return;
  view = 'all'; $('#category-filter').value = ''; document.querySelectorAll('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === 'all'));
  form.reset(); $('#publish-dialog').close(); render(); notify('¡Tarea publicada! Cambia de perspectiva para postular.');
});
$('#reset').addEventListener('click', () => $('#reset-dialog').showModal());
$('#confirm-reset').addEventListener('click', () => {
  if (!saveData(initialData())) return;
  role = 'requester'; view = 'all'; selectedTaskId = null; $('#category-filter').value = ''; $('#provider-select').selectedIndex = 0;
  document.querySelectorAll('[data-view]').forEach(button => button.classList.toggle('active', button.dataset.view === 'all'));
  $('#reset-dialog').close(); render(); notify('Demo restablecida. Lista para comenzar de nuevo.');
});
render();
