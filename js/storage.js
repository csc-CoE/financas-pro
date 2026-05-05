// =============================================
// FinançasPRO – Storage & Data Layer
// =============================================

const DB = {
  TRANSACOES_KEY: 'fp_transacoes',
  CONTAS_KEY: 'fp_contas',
  COMPROVANTES_KEY: 'fp_comprovantes',
  MONTH_KEY: 'fp_current_month',

  // ---- Transactions ----
  getTransacoes() {
    return JSON.parse(localStorage.getItem(this.TRANSACOES_KEY) || '[]');
  },
  saveTransacoes(list) {
    localStorage.setItem(this.TRANSACOES_KEY, JSON.stringify(list));
  },
  addTransacao(tx) {
    const list = this.getTransacoes();
    tx.id = Date.now().toString();
    tx.createdAt = new Date().toISOString();
    list.unshift(tx);
    this.saveTransacoes(list);
    return tx;
  },
  updateTransacao(id, updates) {
    const list = this.getTransacoes();
    const idx = list.findIndex(t => t.id === id);
    if (idx !== -1) { list[idx] = { ...list[idx], ...updates }; this.saveTransacoes(list); }
  },
  deleteTransacao(id) {
    const list = this.getTransacoes().filter(t => t.id !== id);
    this.saveTransacoes(list);
  },
  getTransacoesByMonth(year, month) {
    return this.getTransacoes().filter(t => {
      const d = new Date(t.data);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  },

  // ---- Contas ----
  getContas() {
    return JSON.parse(localStorage.getItem(this.CONTAS_KEY) || '[]');
  },
  saveContas(list) {
    localStorage.setItem(this.CONTAS_KEY, JSON.stringify(list));
  },
  addConta(conta) {
    const list = this.getContas();
    conta.id = Date.now().toString();
    list.push(conta);
    this.saveContas(list);
    return conta;
  },
  updateConta(id, updates) {
    const list = this.getContas();
    const idx = list.findIndex(c => c.id === id);
    if (idx !== -1) { list[idx] = { ...list[idx], ...updates }; this.saveContas(list); }
  },
  deleteConta(id) {
    const list = this.getContas().filter(c => c.id !== id);
    this.saveContas(list);
  },

  // ---- Comprovantes ----
  getComprovantes() {
    return JSON.parse(localStorage.getItem(this.COMPROVANTES_KEY) || '[]');
  },
  addComprovante(comp) {
    const list = this.getComprovantes();
    comp.id = Date.now().toString();
    comp.createdAt = new Date().toISOString();
    list.unshift(comp);
    localStorage.setItem(this.COMPROVANTES_KEY, JSON.stringify(list));
    return comp;
  },
  deleteComprovante(id) {
    const list = this.getComprovantes().filter(c => c.id !== id);
    localStorage.setItem(this.COMPROVANTES_KEY, JSON.stringify(list));
  },

  // ---- Month ----
  getCurrentMonth() {
    const saved = localStorage.getItem(this.MONTH_KEY);
    if (saved) return JSON.parse(saved);
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  },
  setCurrentMonth(year, month) {
    localStorage.setItem(this.MONTH_KEY, JSON.stringify({ year, month }));
  },
};

// ---- Utilities ----
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const MESES_SHORT = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

function formatCurrency(val) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);
}

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR');
}

function toast(msg, type = 'success') {
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span> ${msg}`;
  document.body.appendChild(el);
  setTimeout(() => el.classList.add('show'), 10);
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 300);
  }, 2800);
}

const CATEGORIAS = [
  { id: 'salario', label: 'Salário', icon: '💼', tipo: 'entrada' },
  { id: 'freelance', label: 'Freelance', icon: '💻', tipo: 'entrada' },
  { id: 'investimento', label: 'Investimento', icon: '📈', tipo: 'entrada' },
  { id: 'outros_entrada', label: 'Outros (entrada)', icon: '⬇️', tipo: 'entrada' },
  { id: 'alimentacao', label: 'Alimentação', icon: '🍽️', tipo: 'saida' },
  { id: 'moradia', label: 'Moradia', icon: '🏠', tipo: 'saida' },
  { id: 'transporte', label: 'Transporte', icon: '🚗', tipo: 'saida' },
  { id: 'saude', label: 'Saúde', icon: '💊', tipo: 'saida' },
  { id: 'lazer', label: 'Lazer', icon: '🎮', tipo: 'saida' },
  { id: 'educacao', label: 'Educação', icon: '📚', tipo: 'saida' },
  { id: 'vestuario', label: 'Vestuário', icon: '👗', tipo: 'saida' },
  { id: 'assinaturas', label: 'Assinaturas', icon: '📱', tipo: 'saida' },
  { id: 'pix', label: 'PIX', icon: '⚡', tipo: 'saida' },
  { id: 'outros_saida', label: 'Outros (saída)', icon: '⬆️', tipo: 'saida' },
];

function getCatLabel(id) {
  const c = CATEGORIAS.find(c => c.id === id);
  return c ? `${c.icon} ${c.label}` : id;
}

// Sidebar month navigation
function initMonthNav() {
  const label = document.getElementById('currentMonthLabel');
  const prev = document.getElementById('prevMonth');
  const next = document.getElementById('nextMonth');
  if (!label) return;

  function updateLabel() {
    const { year, month } = DB.getCurrentMonth();
    label.textContent = `${MESES_SHORT[month]} ${year}`;
  }

  prev && prev.addEventListener('click', () => {
    let { year, month } = DB.getCurrentMonth();
    month--;
    if (month < 0) { month = 11; year--; }
    DB.setCurrentMonth(year, month);
    updateLabel();
    if (typeof onMonthChange === 'function') onMonthChange(year, month);
  });

  next && next.addEventListener('click', () => {
    let { year, month } = DB.getCurrentMonth();
    month++;
    if (month > 11) { month = 0; year++; }
    DB.setCurrentMonth(year, month);
    updateLabel();
    if (typeof onMonthChange === 'function') onMonthChange(year, month);
  });

  updateLabel();
}

// Mobile sidebar toggle
function initMobileSidebar() {
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  if (!hamburger || !sidebar) return;
  hamburger.addEventListener('click', () => sidebar.classList.toggle('open'));
  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !hamburger.contains(e.target)) {
      sidebar.classList.remove('open');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initMonthNav();
  initMobileSidebar();
});
