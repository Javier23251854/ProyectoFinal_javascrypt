document.addEventListener('DOMContentLoaded', () => {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formRegister = document.getElementById('form-register');

    // Cambiar entre Iniciar Sesión y Registro
    if (tabLogin && tabRegister) {
        tabLogin.addEventListener('click', () => {
            tabLogin.classList.add('active');
            tabRegister.classList.remove('active');
            formLogin.classList.add('active');
            formRegister.classList.remove('active');
        });

        tabRegister.addEventListener('click', () => {
            tabRegister.classList.add('active');
            tabLogin.classList.remove('active');
            formRegister.classList.add('active');
            formLogin.classList.remove('active');
        });
    }

    // Ocultar / Mostrar contraseña con el icono del ojo
    const setupPasswordToggle = (toggleId, inputId) => {
        const toggleBtn = document.getElementById(toggleId);
        const passInput = document.getElementById(inputId);

        if (toggleBtn && passInput) {
            toggleBtn.addEventListener('click', () => {
                const isPassword = passInput.type === 'password';
                passInput.type = isPassword ? 'text' : 'password';
                toggleBtn.classList.toggle('fa-eye', !isPassword);
                toggleBtn.classList.toggle('fa-eye-slash', isPassword);
            });
        }
    };

    setupPasswordToggle('toggle-pass-login', 'login-password');
    setupPasswordToggle('toggle-pass-reg', 'reg-password');

    // Envíos de formulario
    if (formLogin) {
        formLogin.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Inicio de sesión exitoso!');
            window.location.href = '../HTML/index.html';
        });
    }

    if (formRegister) {
        formRegister.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('¡Cuenta creada correctamente!');
            window.location.href = '../HTML/index.html';
        });
    }
});