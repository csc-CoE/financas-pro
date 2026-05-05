// =============================================
// FinançasPRO – Dashboard
// =============================================

let fluxoChart, catChart;

function buildDashboard(year, month) {
  const txs = DB.getTransacoesByMonth(year, month);

  const entradas = txs.filter(t => t.tipo === 'entrada').reduce((s, t) => s + Number(t.valor), 0);
  const saidas = txs.filter(t => t.tipo === 'saida').reduce((s, t) => s + Number(t.valor), 0);
  const saldo = entradas - saidas;
  const maxVal = Math.max(entradas, saidas, 1);

  // KPIs
  document.getElementById('totalEntradas').textContent = formatCurrency(entradas);
  document.getElementById('totalSaidas').textContent = formatCurrency(saidas);
  document.getElementById('saldoMes').textContent = formatCurrency(saldo);
  document.getElementById('totalTx').textContent = txs.length;

  document.querySelector('.entrada-fill').style.width = `${(entradas / maxVal) * 100}%`;
  document.querySelector('.saida-fill').style.width = `${(saidas / maxVal) * 100}%`;

  const badge = document.getElementById('saldoBadge');
  if (saldo > 0) { badge.textContent = '▲ positivo'; badge.className = 'kpi-badge positivo'; }
  else if (saldo < 0) { badge.textContent = '▼ negativo'; badge.className = 'kpi-badge negativo'; }
  else { badge.textContent = '—'; badge.className = 'kpi-badge neutral'; }

  const dashSub = document.getElementById('dashSubtitle');
  if (dashSub) dashSub.textContent = `${MESES[month]} de ${year}`;

  buildFluxoChart(year, month);
  buildCatChart(txs);
  buildRecentList(txs.slice(0, 8));
}

function buildFluxoChart(year, month) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const labels = [];
  const entData = [];
  const saiData = [];

  for (let d = 1; d <= daysInMonth; d++) {
    labels.push(d);
    const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayTxs = DB.getTransacoes().filter(t => t.data === dayStr);
    entData.push(dayTxs.filter(t => t.tipo === 'entrada').reduce((s, t) => s + Number(t.valor), 0));
    saiData.push(dayTxs.filter(t => t.tipo === 'saida').reduce((s, t) => s + Number(t.valor), 0));
  }

  const ctx = document.getElementById('fluxoChart').getContext('2d');
  if (fluxoChart) fluxoChart.destroy();
  fluxoChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label: 'Entradas', data: entData, backgroundColor: 'rgba(0,229,160,0.5)', borderColor: '#00e5a0', borderWidth: 1.5, borderRadius: 4 },
        { label: 'Saídas', data: saiData, backgroundColor: 'rgba(255,79,110,0.5)', borderColor: '#ff4f6e', borderWidth: 1.5, borderRadius: 4 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { labels: { color: '#8a94a6', font: { family: 'DM Sans', size: 12 } } } },
      scales: {
        x: { ticks: { color: '#4d5768', maxTicksLimit: 10, font: { size: 11 } }, grid: { color: '#252b35' } },
        y: { ticks: { color: '#4d5768', callback: v => `R$${v}`, font: { size: 11 } }, grid: { color: '#252b35' } }
      }
    }
  });
}

function buildCatChart(txs) {
  const saidas = txs.filter(t => t.tipo === 'saida');
  const catMap = {};
  saidas.forEach(t => {
    catMap[t.categoria] = (catMap[t.categoria] || 0) + Number(t.valor);
  });

  const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  const labels = sorted.map(([id]) => getCatLabel(id));
  const data = sorted.map(([, v]) => v);
  const colors = ['#ff4f6e','#f5c842','#00e5a0','#7c8cff','#ff9b43','#e056e0','#38e0d4','#ff6b6b'];

  const ctx = document.getElementById('catChart').getContext('2d');
  if (catChart) catChart.destroy();

  if (data.length === 0) {
    document.getElementById('catLegend').innerHTML = '<div style="color:var(--text3);font-size:13px;text-align:center;padding:20px">Nenhuma saída</div>';
    catChart = new Chart(ctx, { type: 'doughnut', data: { labels: ['Vazio'], datasets: [{ data: [1], backgroundColor: ['#252b35'], borderWidth: 0 }] }, options: { responsive: true, plugins: { legend: { display: false } } } });
    return;
  }

  catChart = new Chart(ctx, {
    type: 'doughnut',
    data: { labels, datasets: [{ data, backgroundColor: colors, borderWidth: 0, hoverOffset: 6 }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '68%',
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => ` ${formatCurrency(ctx.raw)}` } }
      }
    }
  });

  const legend = document.getElementById('catLegend');
  legend.innerHTML = sorted.slice(0, 6).map(([id, val], i) =>
    `<div class="legend-item">
      <span class="legend-dot" style="background:${colors[i]}"></span>
      <span class="legend-label">${getCatLabel(id)}</span>
      <span class="legend-val">${formatCurrency(val)}</span>
    </div>`
  ).join('');
}

function buildRecentList(txs) {
  const list = document.getElementById('recentList');
  if (txs.length === 0) {
    list.innerHTML = `<div class="empty-state">Nenhuma transação ainda. <a href="pages/transacoes.html?new=1">Adicionar</a></div>`;
    return;
  }
  list.innerHTML = txs.map(t => `
    <div class="tx-item">
      <div class="tx-dot ${t.tipo}">${t.tipo === 'entrada' ? '↓' : '↑'}</div>
      <div class="tx-info">
        <div class="tx-desc">${t.descricao}</div>
        <div class="tx-meta">${getCatLabel(t.categoria)} · ${formatDate(t.data)}</div>
      </div>
      <div class="tx-valor ${t.tipo}">${t.tipo === 'saida' ? '-' : '+'}${formatCurrency(t.valor)}</div>
    </div>
  `).join('');
}

function onMonthChange(year, month) { buildDashboard(year, month); }

document.addEventListener('DOMContentLoaded', () => {
  const { year, month } = DB.getCurrentMonth();
  buildDashboard(year, month);
});
