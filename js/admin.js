document.addEventListener('DOMContentLoaded', () => {
    const btnInicio = document.getElementById('btnInicio');
    const btnCadastro = document.getElementById('btnCadastro');
    const btnFuncionarios = document.getElementById('btnFuncionarios');
    const conteudoVagas = document.getElementById('conteudoVagas');
    const conteudoCadastro = document.getElementById('conteudoCadastro');
    const conteudoFuncionarios = document.getElementById('conteudoFuncionarios');
    const todosBotoes = [btnInicio, btnCadastro, btnFuncionarios];
    const formCadastro = document.getElementById('formCadastro');
    const tabelaCorpo = document.getElementById('tabelaCorpo');
    const buscaFuncionario = document.getElementById('buscaFuncionario');
    const filtroStatus = document.getElementById('filtroStatus');
    const totalCadastrados = document.getElementById('totalCadastrados');
    const chaveFuncionarios = 'schollpark-funcionarios';
    let funcionarios = JSON.parse(localStorage.getItem(chaveFuncionarios) || '[]');

    function esconderTodosConteudos() {

        conteudoVagas.classList.add('d-none');
        conteudoCadastro.classList.add('d-none');
        conteudoFuncionarios.classList.add('d-none');

        todosBotoes.forEach(btn => btn.classList.remove('active'));
    }

    btnInicio.addEventListener('click', () => {
        esconderTodosConteudos();
        conteudoVagas.classList.remove('d-none');
        btnInicio.classList.add('active');
    });

    btnCadastro.addEventListener('click', () => {
        esconderTodosConteudos();
        conteudoCadastro.classList.remove('d-none');
        btnCadastro.classList.add('active');
    });

    btnFuncionarios.addEventListener('click', () => {
        esconderTodosConteudos();
        conteudoFuncionarios.classList.remove('d-none');
        btnFuncionarios.classList.add('active');
    });

    function renderizarFuncionarios() {
        const termo = buscaFuncionario.value.trim().toLowerCase();
        const statusSelecionado = filtroStatus.value;
        const filtrados = funcionarios.filter(funcionario => {
            const correspondeBusca = [funcionario.nome, funcionario.placa, funcionario.chapa]
                .some(valor => valor.toLowerCase().includes(termo));
            const correspondeStatus = statusSelecionado === 'todos' || funcionario.status === statusSelecionado;
            return correspondeBusca && correspondeStatus;
        });

        totalCadastrados.textContent = `Total: ${funcionarios.length} Cadastrado${funcionarios.length === 1 ? '' : 's'}`;
        tabelaCorpo.innerHTML = filtrados.length ? filtrados.map(funcionario => `
 <tr class="${funcionario.status === 'inativo' ? 'funcionario-inativo' : ''}">
 <td>${escaparHtml(funcionario.chapa)}</td>
 <td>${escaparHtml(funcionario.nome)}</td>
 <td>${escaparHtml(funcionario.cargo)}</td>
 <td>${escaparHtml(funcionario.telefone)}</td>
 <td>${escaparHtml(funcionario.tipoVeiculo)} - ${escaparHtml(funcionario.modelo)}</td>
 <td>${escaparHtml(funcionario.placa)}</td>
 <td><span class="badge ${funcionario.status === 'ativo' ? 'bg-success' : 'bg-secondary'}">${funcionario.status === 'ativo' ? 'Ativo' : 'Inativo'}</span></td>
 <td class="acoes-funcionario">
 <button type="button" class="btn btn-sm btn-outline-danger btn-status" data-id="${funcionario.id}" data-status="inativo" ${funcionario.status === 'inativo' ? 'disabled' : ''}>Desativar</button>
 <button type="button" class="btn btn-sm btn-outline-success btn-status" data-id="${funcionario.id}" data-status="ativo" ${funcionario.status === 'ativo' ? 'disabled' : ''}>Ativar</button>
 </td>
 </tr>
 `).join('') : '<tr><td colspan="8" class="text-center text-muted py-4">Nenhum funcionário encontrado.</td></tr>';
    }
    formCadastro.addEventListener('submit', evento => {
        evento.preventDefault();
        const funcionario = {
            id: Date.now().toString(),
            nome: document.getElementById('nome').value.trim(),
            telefone: document.getElementById('telefone').value.trim(),
            cargo: document.getElementById('cargo').value,
            chapa: document.getElementById('chapa').value.trim(),
            tipoVeiculo: document.getElementById('tipoVeiculo').value,
            modelo: document.getElementById('modelo').value.trim(),
            cor: document.getElementById('cor').value.trim(),
            ano: document.getElementById('ano').value,
            placa: document.getElementById('placa').value.trim().toUpperCase(),
            status: 'ativo'
        };

        funcionarios.push(funcionario);
        localStorage.setItem(chaveFuncionarios, JSON.stringify(funcionarios));
        formCadastro.reset();
        btnFuncionarios.click();
    });

    tabelaCorpo.addEventListener('click', evento => {
        const botao = evento.target.closest('.btn-status');
        if (!botao) return;

        const funcionario = funcionarios.find(item => item.id === botao.dataset.id);
        if (!funcionario) return;
        funcionario.status = botao.dataset.status;
        localStorage.setItem(chaveFuncionarios, JSON.stringify(funcionarios));
        renderizarFuncionarios();
    });

    buscaFuncionario.addEventListener('input', renderizarFuncionarios);
    filtroStatus.addEventListener('change', renderizarFuncionarios);
    renderizarFuncionarios();

});