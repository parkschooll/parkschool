document.addEventListener('DOMContentLoaded', () => {
    const containerVagas = document.getElementById('containerVagas');

    // Configuração exata das 42 vagas mapeando setor, ícone e quantidade
    const distribuicaoVagas = [
        { tipo: 'Diretoria', icone: 'fa-car', qtd: 4 },
        { tipo: 'PCD', icone: 'fa-wheelchair', qtd: 3 },
        { tipo: 'Descarga', icone: 'fa-truck', qtd: 1 },
        { tipo: 'Funcionários', icone: 'fa-car', qtd: 20 },
        { tipo: 'Funcionários', icone: 'fa-motorcycle', qtd: 14 }
    ];

    let numeroVagaAtual = 1;

    distribuicaoVagas.forEach(bloco => {
        for (let i = 0; i < bloco.qtd; i++) {
            const vagaCard = document.createElement('div');
            vagaCard.className = 'vaga-card';
            
            const numeroFormatado = numeroVagaAtual.toString().padStart(2, '0');

            vagaCard.innerHTML = `
                <div class="vaga-titulo w-100">${bloco.tipo}</div>
                <i class="fa-solid ${bloco.icone} my-auto fs-3"></i>
                <div class="vaga-numero">Vaga ${numeroFormatado}</div>
            `;

            vagaCard.addEventListener('click', () => {
                const titulo = vagaCard.querySelector('.vaga-titulo');
                if (titulo) {
                    titulo.classList.toggle('bg-vermelho');
                }
            });

            containerVagas.appendChild(vagaCard);
            numeroVagaAtual++;
        }
    });
});