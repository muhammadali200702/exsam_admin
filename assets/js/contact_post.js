const APIContact = "https://api.39ortomekteb.info/api/contact";
const APIContactCreate = "https://api.39ortomekteb.info/api/contact/create";
const APIContactDelete = "https://api.39ortomekteb.info/api/contact/delete";
const APIContactUpdate = "https://api.39ortomekteb.info/api/contact/update";
const ulContact = document.querySelector(".inp_list");
const token = localStorage.getItem('token');
const modal = document.querySelector('.modal');
const modalYesBtn = document.querySelector('.modal_btn2');
const modalNoBtn = document.querySelector('.modal_btn');
const modalUpdate = document.querySelector('.modal_update');
const updateForm = document.getElementById('updateForm');
const updateName = document.getElementById('updateName');
const updateMessage = document.getElementById('updateMessage');
const modalCancelBtn = modalUpdate.querySelector('.modal_btns');
const createForm = document.getElementById('createForm');
const createName = document.getElementById('createName');
const createMessage = document.getElementById('createMessage');
let currentContactId = null;

fetch(APIContact, {
    headers: {
        'Authorization': `Bearer ${token}`
    }
})
    .then((response) => {
        if (response.status === 401) {
            alert("Unauthorized access. Please log in.");
            window.location.href = './index.html';
            return;
        }
        return response.json();
    })
    .then((comment) => {
        if (!comment) return;
        comment = comment.data;
        comment.forEach((contacts) => {
            const li = document.createElement('li');
            li.classList.add('inp_li');
            li.innerHTML = `
            <div class="inp_texts">
                <h4 class="inp_title">${contacts.name}</h4>
                <p class="inp_suptitle">${contacts.message}</p>
            </div>
            <div class="inp_btns">
                <button class="inp_btn_update"><i class="fa-solid fa-pen"></i></button>
                <button class="inp_btn_delete" data-id="${contacts._id}"><i class="fa-solid fa-trash-can"></i></button>
            </div>
            `;
            ulContact.appendChild(li);

            li.querySelector(".inp_btn_update").addEventListener("click", () => {
                currentContactId = contacts._id;
                updateName.value = contacts.name;
                updateMessage.value = contacts.message;
                modalUpdate.style.display = 'flex';
            });

            li.querySelector(".inp_btn_delete").addEventListener("click", (event) => {
                const contactId = event.target.closest('button').getAttribute('data-id');
                modal.style.display = 'flex';

                modalYesBtn.onclick = () => {
                    DeleteContact(contactId, li);
                    modal.style.display = 'none';
                };

                modalNoBtn.onclick = () => {
                    modal.style.display = 'none';
                };
            });
        });

        updateForm.addEventListener('submit', (event) => {
            event.preventDefault();
            UpdateContact(currentContactId, updateName.value, updateMessage.value);
        });

        modalCancelBtn.addEventListener('click', () => {
            modalUpdate.style.display = 'none';
        });

        createForm.addEventListener('submit', (event) => {
            event.preventDefault();
            CreateContact(createName.value, createMessage.value);
        });
        function DeleteContact(contactId, liElement) {
            fetch(`${APIContactDelete}/${contactId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then((res) => {
                if (res.status === 401) {
                    alert("Unauthorized access. Please log in.");
                    window.location.href = './index.html';
                    return;
                }
                return res.json();
            })
            .then((data) => {
                console.log(data); 
                if (data.success) {
                    liElement.remove();
                } else {
                    alert(data.message || "Failed to delete contact");
                }
            })
            .catch((error) => {
                console.error("Error deleting contact:", error);
                alert("An error occurred while deleting the contact");
            });
        }
        

        function UpdateContact(contactId, name, message) {
            fetch(`${APIContactUpdate}/${contactId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, message })
            })
            .then((res) => {
                if (res.status === 401) {
                    alert("Unauthorized access. Please log in.");
                    window.location.href = './index.html';
                    return;
                }
                return res.json();
            })
            .then((data) => {
                if (data.success) {
                    const li = ulContact.querySelector(`button[data-id="${contactId}"]`).closest('li');
                    li.querySelector('.inp_title').textContent = name;
                    li.querySelector('.inp_suptitle').textContent = message;
                    modalUpdate.style.display = 'none';
                } else {
                    alert(data.message || "Failed to update contact");
                }
            })
            .catch((error) => {
                console.error("Error updating contact:", error);
                alert("An error occurred while updating the contact");
            });
        }

        function CreateContact(name, message) {
            fetch(APIContactCreate, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name, message })
            })
            .then((res) => {
                if (res.status === 401) {
                    alert("Unauthorized access. Please log in.");
                    window.location.href = './index.html';
                    return;
                }
                return res.json();
            })
            .then((data) => {
                if (data.success) {
                    const contacts = data.contact;
                    const li = document.createElement('li');
                    li.classList.add('inp_li');
                    li.innerHTML = `
                    <div class="inp_texts">
                        <h4 class="inp_title">${contacts.name}</h4>
                        <p class="inp_suptitle">${contacts.message}</p>
                    </div>
                    <div class="inp_btns">
                        <button class="inp_btn_update"><i class="fa-solid fa-pen"></i></button>
                        <button class="inp_btn_delete" data-id="${contacts._id}"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                    `;
                    ulContact.appendChild(li);

                    li.querySelector(".inp_btn_update").addEventListener("click", () => {
                        currentContactId = contacts._id;
                        updateName.value = contacts.name;
                        updateMessage.value = contacts.message;
                        modalUpdate.style.display = 'flex';
                    });

                    li.querySelector(".inp_btn_delete").addEventListener("click", (event) => {
                        const contactId = event.target.closest('button').getAttribute('data-id');
                        modal.style.display = 'flex';

                        modalYesBtn.onclick = () => {
                            DeleteContact(contactId, li);
                            modal.style.display = 'none';
                        };

                        modalNoBtn.onclick = () => {
                            modal.style.display = 'none';
                        };
                    });
                } else {
                    alert(data.message || "Failed to create contact");
                }
            })
            .catch((error) => {
                console.error("Error creating contact:", error);
                alert("An error occurred while creating the contact");
            });
        }
    })
    .catch((error) => {
        console.error('Error:', error);
    });

