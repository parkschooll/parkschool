document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('formRegistro');
    const inputSenha = document.getElementById('senha');
    const inputConfirmarSenha = document.getElementById('confirmarSenha');
    const passwordFeedback = document.getElementById('passwordMismatchFeedback');
    const toggleButtons = document.querySelectorAll('.btn-toggle-password');

    const btnAceitarModal = document.getElementById("btn_aceitar_modal");
    const checkboxTermosPrincipal = document.getElementById("termos");

    if (btnAceitarModal && checkboxTermosPrincipal) {
        btnAceitarModal.addEventListener("click", function () {
            checkboxTermosPrincipal.checked = true;
            const modalElement = document.getElementById("modalTermos");
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
    }

    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const icon = button.querySelector('i');

            if (!targetInput || !icon) return;

            if (targetInput.type === 'password') {
                targetInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                targetInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    function validarSenhas() {
        const senha = inputSenha.value;
        const confirmar = inputConfirmarSenha.value;
        const inputGroup = inputConfirmarSenha.closest('.ds-input-group');

        if (confirmar.length > 0 && senha !== confirmar) {
            inputGroup?.classList.add('is-invalid');
            passwordFeedback?.classList.remove('d-none');
            passwordFeedback?.classList.add('d-block');
            return false;
        }

        inputGroup?.classList.remove('is-invalid');
        passwordFeedback?.classList.add('d-none');
        passwordFeedback?.classList.remove('d-block');
        return true;
    }

    inputSenha.addEventListener('input', validarSenhas);
    inputConfirmarSenha.addEventListener('input', validarSenhas);

    formRegistro.addEventListener('submit', (event) => {
        event.preventDefault();

        const senhasConferem = validarSenhas();

        if (!formRegistro.checkValidity() || !senhasConferem) {
            event.stopPropagation();
            formRegistro.classList.add('was-validated');
            return;
        }

        const dadosFormulario = {
            id: Date.now().toString(),
            nome: document.getElementById('nome').value.trim(),
            email: document.getElementById('email').value.trim(),
            perfil: document.getElementById('perfil').value,
            telefone: '',
            senha: inputSenha.value,
            status: 'pendente',
            criadoEm: new Date().toISOString()
        };

        const solicitacoes = JSON.parse(localStorage.getItem('park_solicitacoes') || '[]');
        solicitacoes.push(dadosFormulario);
        localStorage.setItem('park_solicitacoes', JSON.stringify(solicitacoes));

        const cadastroAtual = {
            nome: dadosFormulario.nome,
            email: dadosFormulario.email,
            perfil: dadosFormulario.perfil
        };
        sessionStorage.setItem('cadastroRecente', JSON.stringify(cadastroAtual));

        alert('Cadastro realizado. Continue preenchendo os dados do veículo.');
        window.location.href = 'cadastro_veiculo.html';
    });
});