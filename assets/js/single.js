

document.querySelector('#imgClick').addEventListener('click', () => {
    document.querySelector('#proffil').click()
});
document.querySelector("#pdf2").addEventListener('click', ()=> {
    document.querySelector("#pdf").click()
});

let token = localStorage.getItem("token")
document.querySelector("#close").addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = "../../index.html";
});
if (!token) {
    localStorage.clear
    window.location.href = "../../index.html"
}

const baseUrl = 'https://api.39ortomekteb.info/api';

if (!token) {
    console.error('Нет токена авторизации!');
}

const imgClick = document.querySelector('#imgClick');
const photoInput = document.querySelector('#proffil');

if (document.querySelector(".profile")) {
    document.querySelector(".profile").addEventListener('click', () => {
        photoInput.click();
    });
}

photoInput.addEventListener('change', async function () {
    const file = this.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        console.error('Неверный формат файла! Разрешены только JPG, PNG, GIF.');
        return;
    }

    let formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${baseUrl}/upload`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();
        console.log('Ответ API загрузки:', data);

        if (response.ok && data.file) {
            imgClick.setAttribute('src', data.file);
        } else {
            console.error('Ошибка загрузки файла:', data.message || 'Неизвестная ошибка');
        }
    } catch (err) {
        console.error('Ошибка при загрузке файла:', err);
    }
});

const inputForm = document.querySelector('.main-content');
if (inputForm) {
    inputForm.addEventListener('submit', async (evt) => {
        evt.preventDefault();

        const imgElement = document.querySelector('#imgClick');
        const imageUrl = imgElement ? imgElement.getAttribute('src') : '';
        let date = document.querySelector('#date').value.trim();
        let title = document.querySelector('#title').value.trim();

        if (!title || !date || !imageUrl) {
            console.error('Все поля должны быть заполнены!');
            return;
        }

        let requestBody = {
            title: title,
            date: date,
            image: imageUrl
        };
  
        try {
            const response = await fetch(`${baseUrl}/blog/create`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            console.log('Ответ API создания блога:', data);

            if (response.ok) {
                console.log('Блог успешно создан:', data);
                addToList([data]); 
            } else {
                console.error('Ошибка создания блога:', data.message || 'Неизвестная ошибка');
            }
        } catch (err) {
            console.error('Ошибка при отправке данных:', err);
        }
    });
}


