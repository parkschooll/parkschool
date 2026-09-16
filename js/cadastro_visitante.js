document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("formCadastro");

    const dataVaga = document.getElementById("data_vaga");
    const horaEntrada = document.getElementById("hora_entrada");
    const horaSaida = document.getElementById("hora_saida");
    const placa = document.getElementById("placaVeiculo_visitante");

    // Define a data mínima como hoje
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");

    dataVaga.min = `${ano}-${mes}-${dia}`;


   // Formatação da placa
    placa.addEventListener("input", function () {

    let valor = placa.value.toUpperCase();

    // Remove tudo que não seja letra ou número
    valor = valor.replace(/[^A-Z0-9]/g, "");

    // Limita a 7 caracteres
    valor = valor.substring(0, 7);

    // Adiciona hífen somente para o modelo antigo
    // ABC1234 -> ABC-1234
    if (
        valor.length === 7 &&
        /^[A-Z]{3}[0-9]{4}$/.test(valor)
    ) {
        valor = valor.substring(0, 3) + "-" + valor.substring(3);
    }

    placa.value = valor;
    });



    // Validação do formulário
    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const nome = document.getElementById("nome_visitante").value.trim();
        const telefone = document.getElementById("telefone_visitante").value.trim();
        const evento = document.getElementById("evento_visitante").value.trim();

        const modelo = document.getElementById("modeloVeiculo_visitante").value.trim();
        const tipoVeiculo = document.getElementById("tipoVeiculo_visitante").value;
        const anoVeiculo = document.getElementById("anoVeiculo_visitante").value;
        const cor = document.getElementById("corVeiculo_visitante").value.trim();

        const vaga = document.getElementById("n_vaga").value.trim();
        const tipoVaga = document.getElementById("tipo_vaga").value;

        const data = dataVaga.value;
        const entrada = horaEntrada.value;
        const saida = horaSaida.value;


        // Verifica se a hora de saída é maior que a entrada
        if (entrada >= saida) {
            alert("O horário de saída deve ser maior que o horário de entrada.");
            return;
        }


        // Verifica se a data foi preenchida
        if (!data) {
            alert("Selecione a data da reserva.");
            return;
        }


       // Validação da placa
    const placaValor = placa.value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    // Placa antiga: ABC1234
    const placaAntiga = /^[A-Z]{3}[0-9]{4}$/;

    // Placa Mercosul: ABC1D23
    const placaMercosul = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

    if (
    !placaAntiga.test(placaValor) &&
    !placaMercosul.test(placaValor)
    ) {
    alert(
        "Digite uma placa válida.\n\n" +
        "Exemplos:\n" +
        "ABC-1234\n" +
        "ABC1D23"
    );

    placa.focus();
    return;
}



        // Cria objeto com os dados
        const cadastro = {

            visitante: {
                nome: nome,
                telefone: telefone,
                evento: evento
            },

            veiculo: {
                modelo: modelo,
                tipo: tipoVeiculo,
                ano: anoVeiculo,
                cor: cor,
                placa: placa.value
            },

            reserva: {
                vaga: vaga,
                tipo: tipoVaga,
                data: data,
                horaEntrada: entrada,
                horaSaida: saida
            }

        };


        // Busca cadastros existentes
        let cadastros = JSON.parse(localStorage.getItem("cadastrosVisitantes")) || [];


        // Verifica se a vaga já está reservada
        const vagaOcupada = cadastros.some(function (item) {

            return (
                item.reserva.vaga === vaga &&
                item.reserva.data === data &&
                (
                    entrada < item.reserva.horaSaida &&
                    saida > item.reserva.horaEntrada
                )
            );

        });


        if (vagaOcupada) {

            alert(
                `A vaga ${vaga} já está reservada nesse horário.`
            );

            return;
        }


        // Adiciona novo cadastro
        cadastros.push(cadastro);


        // Salva no navegador
        localStorage.setItem(
            "cadastrosVisitantes",
            JSON.stringify(cadastros)
        );


        // Mensagem de sucesso
        alert("Visitante cadastrado com sucesso!");


        // Limpa formulário
        form.reset();

    });

});
