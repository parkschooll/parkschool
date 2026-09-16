document.addEventListener("DOMContentLoaded", () => {
    // Captura dos elementos do DOM
    const inputEmail = document.getElementById("email");
    const btnSubmit = document.getElementById("submit-btn");
    const form = document.getElementById("request-form");
    
    // Instância do Toast do Bootstrap
    const toastElement = document.getElementById("recoveryToast");
    const toast = new bootstrap.Toast(toastElement, { delay: 5000 });

    // Eventos
    if (inputEmail) inputEmail.addEventListener("input", validate);
    if (form) form.addEventListener("submit", handleSubmit);

    // Valida se o email digitado tem um formato minimamente aceitável
    function validate() {
        const val = inputEmail.value.trim();
        const valid = val.includes("@") && val.split("@")[1]?.includes(".");
        
        if (btnSubmit) {
            btnSubmit.disabled = !valid;
        }
    }

    // Ação ao enviar o formulário
    function handleSubmit(e) {
        e.preventDefault();
        
        const label = document.getElementById("submit-label");
        const spinner = document.getElementById("submit-spinner");

        // Estado de "Carregando"
        btnSubmit.disabled = true;
        label.textContent = 'Registrando...';
        spinner.classList.remove('d-none');

        // Simula uma requisição (900ms)
        setTimeout(() => {
            // Restaura o botão
            label.textContent = "Solicitar recuperação";
            spinner.classList.add('d-none');

            // Exibe o Toast com a mensagem
            toast.show();

            // Limpa o input e desabilita o botão novamente
            inputEmail.value = "";
            validate();
        }, 900);
    }
});