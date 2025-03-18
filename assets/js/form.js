document.addEventListener('DOMContentLoaded', () => {
    let form = document.querySelector('.form');

    if (!form) {
        console.error('Форма входа не найдена!');
        return;
    }

    form.addEventListener('submit', (evt) => {
        evt.preventDefault();

        let loginInput = document.querySelector('.form .loginInput');
        let passwordInput = document.querySelector('.form .passwordInput');
        let errorMessage = document.querySelector('.form .err');

        if (!loginInput || !passwordInput) {
            console.error('Поля логина или пароля не найдены!');
            return;
        }

        let login = loginInput.value.trim();
        let password = passwordInput.value.trim();

        if (!login || !password) {
            if (errorMessage) {
                errorMessage.textContent = 'Введите логин и пароль!';
                errorMessage.style.color = 'red';
            }
            return;
        }

        if (errorMessage) {
            errorMessage.textContent = '';
        }

        fetch('https://api.39ortomekteb.info/api/admin/login', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ login, password })
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Ошибка авторизации. Проверьте логин и пароль.');
            }
            return res.json();
        })
        .then((data) => {
            if (data.accessToken) {
                localStorage.setItem('token', data.accessToken);
                window.location.href = 'assets/pages/single.html';
            } else {
                throw new Error('Неверные учетные данные.');
            }
        })
        .catch((error) => {
            console.error('Ошибка запроса:', error);
            if (errorMessage) {
                errorMessage.textContent = error.message;
                errorMessage.style.color = 'red';
            } else {
                alert(error.message);
            }
        });
    });    
});



