document.addEventListener("DOMContentLoaded", () => {
    let currentMethod = "email";

    // Captura dos elementos do DOM
    const tabEmail = document.getElementById("tab-email");
    const tabPhone = document.getElementById("tab-phone");
    const fieldEmail = document.getElementById("field-email");
    const fieldPhone = document.getElementById("field-phone");
    const inputEmail = document.getElementById("email");
    const inputPhone = document.getElementById("phone");
    const btnSubmit = document.getElementById("submit-btn");
    const form = document.getElementById("request-form");
    const btnBackMethod = document.getElementById("btn-back-method");

    // ==========================================
    // INJEÇÃO DOS EVENTOS (Substitui o onclick do HTML)
    // ==========================================
    if (tabEmail && tabPhone) {
        tabEmail.addEventListener("click", () => selectMethod("email"));
        tabPhone.addEventListener("click", () => selectMethod("phone"));
    }

    if (inputEmail) inputEmail.addEventListener("input", validate);
    if (inputPhone) inputPhone.addEventListener("input", handlePhoneInput);
    if (form) form.addEventListener("submit", handleSubmit);
    if (btnBackMethod) btnBackMethod.addEventListener("click", goBack);

    // ==========================================
    // FUNÇÕES DE LÓGICA
    // ==========================================
    function selectMethod(method) {
        currentMethod = method;

        if (method === "email") {
            tabEmail.classList.add("active", "bg-white", "shadow-sm", "text-primary-custom");
            tabEmail.classList.remove("text-secondary");
            tabPhone.classList.remove("active", "bg-white", "shadow-sm", "text-primary-custom");
            tabPhone.classList.add("text-secondary");
            
            fieldEmail.classList.remove("d-none");
            fieldPhone.classList.add("d-none");
        } else {
            tabPhone.classList.add("active", "bg-white", "shadow-sm", "text-primary-custom");
            tabPhone.classList.remove("text-secondary");
            tabEmail.classList.remove("active", "bg-white", "shadow-sm", "text-primary-custom");
            tabEmail.classList.add("text-secondary");
            
            fieldPhone.classList.remove("d-none");
            fieldEmail.classList.add("d-none");
        }

        inputEmail.value = "";
        inputPhone.value = "";
        validate();
    }

    function handlePhoneInput(e) {
        let digits = e.target.value.replace(/\D/g, "").slice(0, 11);
        let masked = digits;
        
        if (digits.length > 2 && digits.length <= 7) {
            masked = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        } else if (digits.length > 7) {
            masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
        }
        
        e.target.value = masked;
        validate();
    }

    function validate() {
        let valid = false;

        if (currentMethod === "email") {
            const val = inputEmail.value;
            valid = val.includes("@") && val.split("@")[1]?.includes(".");
        } else {
            const digits = inputPhone.value.replace(/\D/g, "");
            valid = digits.length === 11;
        }

        if (btnSubmit) {
            btnSubmit.disabled = !valid;
        }
    }

    function maskEmailForDisplay(email) {
        const [user, domain] = email.split("@");
        if (!domain) return email;
        const visible = user.slice(0, 2);
        return `${visible}${"*".repeat(Math.max(user.length - 2, 1))}@${domain}`;
    }

    function maskPhoneForDisplay(phone) {
        const digits = phone.replace(/\D/g, "");
        return `(${digits.slice(0, 2)}) *****-${digits.slice(-4)}`;
    }

    function handleSubmit(e) {
        e.preventDefault();
        const label = document.getElementById("submit-label");
        const spinner = document.getElementById("submit-spinner");

        btnSubmit.disabled = true;
        label.textContent = 'Enviando...';
        spinner.classList.remove('d-none');

        setTimeout(() => {
            const destination = currentMethod === "email"
                ? maskEmailForDisplay(inputEmail.value)
                : maskPhoneForDisplay(inputPhone.value);

            document.getElementById("destination").textContent = destination;
            document.getElementById("step-request").classList.add("d-none");
            document.getElementById("step-sent").classList.remove("d-none");

            btnSubmit.disabled = false;
            label.textContent = "Enviar código de recuperação";
            spinner.classList.add('d-none');
        }, 900);
    }

    function goBack() {
        document.getElementById("step-sent").classList.add("d-none");
        document.getElementById("step-request").classList.remove("d-none");
        document.getElementById("code").value = "";
    }

    selectMethod("email");
});