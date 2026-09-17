document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('listaVeiculos');
  const formVeiculos = document.getElementById('formVeiculos');
  if (!container || !formVeiculos) return;

  const getRecentCadastro = () => {
    try {
      const raw = sessionStorage.getItem('cadastroRecente');
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  };

  const getVeiculosArmazenados = () => {
    try {
      const raw = localStorage.getItem('park_veiculos');
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  };

  const salvarVeiculos = (veiculos) => {
    localStorage.setItem('park_veiculos', JSON.stringify(veiculos));
  };

  const criarFormularioVeiculo = (index) => {
    const card = document.createElement('div');
    card.className = 'card-vehicle';
    card.dataset.index = String(index);
    card.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-2">
        <div class="vehicle-number">Veículo ${index + 1}</div>
        ${index > 0 ? '<button type="button" class="btn btn-sm btn-outline-danger remover-veiculo" aria-label="Remover veículo"><i class="fa-solid fa-trash"></i></button>' : ''}
      </div>
      <div class="row g-3">
        <div class="col-md-6">
          <label class="form-label fw-semibold">Modelo</label>
          <input type="text" class="form-control campo-modelo" placeholder="Ex.: Corolla, CG 160" required>
        </div>
        <div class="col-md-3">
          <label class="form-label fw-semibold">Tipo</label>
          <select class="form-select campo-tipo" required>
            <option value="carro" selected>Carro</option>
            <option value="moto">Moto</option>
          </select>
        </div>
        <div class="col-md-3">
          <label class="form-label fw-semibold">Ano</label>
          <input type="number" class="form-control campo-ano" min="2000" max="2100" placeholder="2024" required>
        </div>
        <div class="col-md-6">
          <label class="form-label fw-semibold">Cor</label>
          <input type="text" class="form-control campo-cor" placeholder="Ex.: Prata" required>
        </div>
        <div class="col-md-6">
          <label class="form-label fw-semibold">Placa</label>
          <input type="text" class="form-control campo-placa" placeholder="ABC1D23" maxlength="8" required>
        </div>
      </div>
    `;

    const remover = card.querySelector('.remover-veiculo');
    if (remover) {
      remover.addEventListener('click', () => {
        const forms = [...container.querySelectorAll('.card-vehicle')];
        const idx = forms.indexOf(card);
        if (idx >= 0) {
          card.remove();
          const remaining = [...container.querySelectorAll('.card-vehicle')];
          remaining.forEach((item, i) => {
            const numero = item.querySelector('.vehicle-number');
            if (numero) numero.textContent = `Veículo ${i + 1}`;
            item.dataset.index = String(i);
            const removeBtn = item.querySelector('.remover-veiculo');
            if (removeBtn && remaining.length === 1) removeBtn.remove();
          });
        }
      });
    }

    return card;
  };

  const adicionarFormulario = () => {
    const forms = container.querySelectorAll('.card-vehicle');
    const nextIndex = forms.length;
    container.appendChild(criarFormularioVeiculo(nextIndex));
  };

  document.getElementById('btnAdicionarVeiculo')?.addEventListener('click', adicionarFormulario);

  adicionarFormulario();

  formVeiculos.addEventListener('submit', (event) => {
    event.preventDefault();

    const cadastroRecente = getRecentCadastro();
    if (!cadastroRecente) {
      alert('Nenhum cadastro recente foi encontrado. Volte para a etapa anterior.');
      return;
    }

    const cards = [...container.querySelectorAll('.card-vehicle')];
    const veiculos = [];

    for (const card of cards) {
      const modelo = card.querySelector('.campo-modelo').value.trim();
      const tipo = card.querySelector('.campo-tipo').value;
      const ano = card.querySelector('.campo-ano').value.trim();
      const cor = card.querySelector('.campo-cor').value.trim();
      const placa = card.querySelector('.campo-placa').value.trim().replace(/[^A-Z0-9]/gi, '').toUpperCase();

      if (!modelo || !ano || !cor || !placa) {
        alert('Preencha todos os campos do veículo antes de continuar.');
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const placaMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
      const placaAntiga = /^[A-Z]{3}[0-9]{4}$/;
      if (!placaMercosul.test(placa) && !placaAntiga.test(placa)) {
        alert(`A placa ${placa} não é válida. Use o formato ABC1D23 ou ABC1234.`);
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      veiculos.push({
        id: Date.now() + Math.random(),
        usuario: cadastroRecente.email || 'usuario@empresa.com',
        nomeUsuario: cadastroRecente.nome || 'Usuário',
        perfil: cadastroRecente.perfil || 'funcionario',
        modelo,
        tipo,
        ano: Number(ano),
        cor,
        placa
      });
    }

    const atuais = getVeiculosArmazenados();
    salvarVeiculos([...atuais, ...veiculos]);

    sessionStorage.removeItem('cadastroRecente');
    alert('Veículos cadastrados com sucesso!');
    window.location.href = 'login.html';
  });
});
