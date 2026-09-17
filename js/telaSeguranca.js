document.addEventListener('DOMContentLoaded', () => {
  const totalVagas = 42;

  const criarVagasPadrao = () => {
    const lista = [];

    for (let i = 1; i <= totalVagas; i++) {
      let tipo = 'Funcionários';

      if (i <= 3) tipo = 'Diretoria';
      else if (i <= 6) tipo = 'PCD';
      else if (i <= 9) tipo = 'Visitantes';

      lista.push({
        numero: i,
        tipo,
        status: 'available',
        placa: ''
      });
    }

    return lista;
  };

  const vagas = criarVagasPadrao();
  const visitas = [];

  const toast = document.getElementById('toast');
  const container = document.getElementById('containerVagas');
  const tipoIcon = {
    Diretoria: 'fa-building',
    PCD: 'fa-wheelchair',
    Visitantes: 'fa-user',
    Funcionários: 'fa-car'
  };

  const showToast = (message) => {
    if (!toast) return;
    const span = toast.querySelector('span');
    if (span) span.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  };

  const label = status => status === 'occupied' ? 'Ocupada' : status === 'reserved' ? 'Reservada' : 'Disponível';

  const updateMetrics = () => {
    const ocupadas = vagas.filter(v => v.status === 'occupied' || v.status === 'reserved').length;
    const disponiveis = vagas.filter(v => v.status === 'available').length;
    const pendentes = visitas.filter(v => v.status === 'pending').length;

    const totalEl = document.getElementById('totalVagas');
    const vagasDisponiveis = document.getElementById('vagasDisponiveis');
    const vagasOcupadas = document.getElementById('vagasOcupadas');
    const visitasPendentes = document.getElementById('visitasPendentes');
    const badgeNotificacoes = document.getElementById('badgeNotificacoes');

    if (totalEl) totalEl.textContent = totalVagas;
    if (vagasDisponiveis) vagasDisponiveis.textContent = disponiveis;
    if (vagasOcupadas) vagasOcupadas.textContent = ocupadas;
    if (visitasPendentes) visitasPendentes.textContent = pendentes;
    if (badgeNotificacoes) badgeNotificacoes.textContent = pendentes;
  };

  const renderVagas = () => {
    if (!container) return;

    const busca = document.getElementById('buscaVaga')?.value.trim() || '';
    const filtro = document.getElementById('filtroTipo')?.value || 'todos';
    container.innerHTML = '';

    vagas.filter(v => {
      const numeroMatches = !busca || String(v.numero).includes(busca);
      const tipoMatches = filtro === 'todos' || v.tipo === filtro;
      return numeroMatches && tipoMatches;
    }).forEach(v => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = `vaga-card ${v.status}`;
      card.innerHTML = `
        <div class="vaga-card-top">
          <span class="vaga-type">${v.tipo}</span>
          <i class="fa-solid ${tipoIcon[v.tipo] || 'fa-car'}"></i>
        </div>
        <strong>${String(v.numero).padStart(2, '0')}</strong>
        <span class="vaga-status">
          <i class="fa-solid ${v.status === 'available' ? 'fa-check' : v.status === 'reserved' ? 'fa-calendar-check' : 'fa-car'}"></i>
          ${label(v.status)}
        </span>
        ${v.placa ? `<small>${v.placa}</small>` : ''}
      `;

      card.addEventListener('click', () => {
        if (v.status === 'available') {
          v.status = 'occupied';
          v.placa = 'MANUAL';
          showToast(`Vaga ${String(v.numero).padStart(2, '0')} ocupada.`);
        } else if (v.status === 'occupied') {
          v.status = 'available';
          v.placa = '';
          showToast(`Vaga ${String(v.numero).padStart(2, '0')} liberada.`);
        } else if (v.status === 'reserved') {
          v.status = 'available';
          v.placa = '';
          showToast(`Reserva da vaga ${String(v.numero).padStart(2, '0')} liberada.`);
        }

        renderVagas();
        updateMetrics();
      });

      container.appendChild(card);
    });
  };

  const renderNotificacoes = () => {
    const list = document.getElementById('listaNotificacoes');
    if (!list) return;

    if (!visitas.length) {
      list.innerHTML = '<div class="empty-state"><i class="fa-solid fa-check-double"></i><p>Sem visitas pendentes.</p></div>';
      updateMetrics();
      return;
    }

    const pendentes = visitas.filter(v => v.status === 'pending');

    if (!pendentes.length) {
      list.innerHTML = '<div class="empty-state"><i class="fa-solid fa-check-double"></i><p>Sem visitas pendentes.</p></div>';
      updateMetrics();
      return;
    }

    list.innerHTML = pendentes.map(v => `
      <div class="notification-item">
        <div class="notification-avatar">${(v.nome || 'V').split(' ').map(p => p[0]).slice(0, 2).join('').toUpperCase()}</div>
        <div class="notification-content">
          <div>
            <b>${v.nome}</b>
            <span class="time">${v.entrada || 'Hoje'}</span>
          </div>
          <p>${v.motivo}</p>
          <small><i class="fa-solid fa-car"></i> ${v.placa}</small>
          <div class="notification-actions">
            <button class="accept-btn" data-id="${v.id}"><i class="fa-solid fa-check"></i> Confirmar</button>
            <button class="deny-btn" data-id="${v.id}">Recusar</button>
          </div>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.accept-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const item = visitas.find(v => v.id === id);
        if (!item) return;

        item.status = 'confirmed';
        const vaga = vagas.find(v => v.numero === item.vaga);
        if (vaga) {
          vaga.status = 'reserved';
          vaga.placa = item.placa;
        }

        renderVagas();
        renderNotificacoes();
        updateMetrics();
        showToast('Visita confirmada.');
      });
    });

    list.querySelectorAll('.deny-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = Number(btn.dataset.id);
        const item = visitas.find(v => v.id === id);
        if (!item) return;

        item.status = 'rejected';
        renderNotificacoes();
        updateMetrics();
        showToast('Visita recusada.');
      });
    });
  };

  const abrirQuickAction = (tipo) => {
    if (tipo === 'liberar') {
      const vaga = vagas.find(v => v.status === 'occupied' || v.status === 'reserved');
      if (vaga) {
        vaga.status = 'available';
        vaga.placa = '';
        renderVagas();
        updateMetrics();
        showToast(`Vaga ${String(vaga.numero).padStart(2, '0')} liberada.`);
      } else {
        showToast('Nenhuma vaga ocupada no momento.');
      }
      return;
    }

    if (tipo === 'ocupar') {
      const vaga = vagas.find(v => v.status === 'available');
      if (vaga) {
        vaga.status = 'occupied';
        vaga.placa = 'MANUAL';
        renderVagas();
        updateMetrics();
        showToast(`Vaga ${String(vaga.numero).padStart(2, '0')} ocupada.`);
      } else {
        showToast('Nenhuma vaga disponível para ocupar.');
      }
      return;
    }

    const filtro = document.getElementById('filtroTipo');
    if (filtro) filtro.value = 'Visitantes';
    renderVagas();
    showToast('Exibindo vagas reservadas para visitantes.');
  };

  const btnLiberar = document.getElementById('btnLiberar');
  const btnOcupar = document.getElementById('btnOcupar');
  const btnVerReservas = document.getElementById('btnVerReservas');

  if (btnLiberar) btnLiberar.addEventListener('click', () => abrirQuickAction('liberar'));
  if (btnOcupar) btnOcupar.addEventListener('click', () => abrirQuickAction('ocupar'));
  if (btnVerReservas) btnVerReservas.addEventListener('click', () => abrirQuickAction('reservas'));

  const buscaVaga = document.getElementById('buscaVaga');
  const filtroTipo = document.getElementById('filtroTipo');

  if (buscaVaga) buscaVaga.addEventListener('input', renderVagas);
  if (filtroTipo) filtroTipo.addEventListener('change', renderVagas);

  document.getElementById('btnSair')?.addEventListener('click', () => showToast('Sessão encerrada apenas nesta demonstração.'));

  renderVagas();
  renderNotificacoes();
  updateMetrics();
});
