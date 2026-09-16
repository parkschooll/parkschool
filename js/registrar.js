document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('formRegistro');
    const inputSenha = document.getElementById('senha');
    const inputConfirmarSenha = document.getElementById('confirmarSenha');
    const passwordFeedback = document.getElementById('passwordMismatchFeedback');
    const toggleButtons = document.querySelectorAll('.btn-toggle-password');

    // 1. Alternar Visibilidade da Senha
    toggleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetInput = document.getElementById(targetId);
            const icon = button.querySelector('i');

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

    // 2. Validação de Igualdade de Senhas
    function validarSenhas() {
        const senha = inputSenha.value;
        const confirmar = inputConfirmarSenha.value;
        const inputGroup = inputConfirmarSenha.closest('.ds-input-group');

        if (confirmar.length > 0 && senha !== confirmar) {
            inputGroup.classList.add('is-invalid');
            passwordFeedback.classList.remove('d-none');
            passwordFeedback.classList.add('d-block');
            return false;
        } else {
            inputGroup.classList.remove('is-invalid');
            passwordFeedback.classList.add('d-none');
            passwordFeedback.classList.remove('d-block');
            return true;
        }
    }

    inputSenha.addEventListener('input', validarSenhas);
    inputConfirmarSenha.addEventListener('input', validarSenhas);

    // 3. Submit do Formulário
    formRegistro.addEventListener('submit', (event) => {
        event.preventDefault();

        const senhasConferem = validarSenhas();
        
        if (!formRegistro.checkValidity() || !senhasConferem) {
            event.stopPropagation();
            formRegistro.classList.add('was-validated');
            return;
        }

        // Se passar na validação:
        const dadosFormulario = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            perfil: document.getElementById('perfil').value,
            senha: inputSenha.value
        };

        console.log('Dados prontos para envio:', dadosFormulario);
        alert('Conta cadastrada com sucesso!');
    });
});