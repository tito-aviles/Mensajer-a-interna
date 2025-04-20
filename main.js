const postsContainer = document.getElementById('posts');
const postForm = document.getElementById('postForm');
const fixedNameElement = document.getElementById('fixedName');
const nameFormContainer = document.getElementById('nameFormContainer');
const nameForm = document.getElementById('nameForm');
const nameInput = document.getElementById('nameInput');
const content = document.querySelector('.content');
const joinChatContainer = document.getElementById('joinChatContainer');
const joinChatForm = document.getElementById('joinChatForm');
const chatNameInput = document.getElementById('chatNameInput');
const chatRoomInput = document.getElementById('chatRoomInput');
const header = document.querySelector('.header');
const chatRoomElement = document.getElementById('chatRoom');
let posts = [];

// Manejar el envío del formulario
function handleFormSubmit(event) {
    event.preventDefault();

    const fixedName = fixedNameElement.textContent.replace('Usuario: ', '').trim(); // Obtener el nombre fijo
    const postInput = document.getElementById('postInput');
    const postText = postInput.value.trim();

    if (!fixedName || !postText) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    const post = {
        id: Date.now(),
        name: fixedName, // Usar el nombre fijo
        text: postText,
        likes: 0,
        replies: [] // Array para almacenar las respuestas
    };

    posts.unshift(post);
    postForm.reset();
    renderPosts();
    savePosts();

    // Ocultar el formulario de publicación después de la primera publicación
    const postFormContainer = document.getElementById('postForm');
    postFormContainer.style.display = 'none';
}

// Renderizar las publicaciones
function renderPosts() {
    postsContainer.innerHTML = '';
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <p><strong>${post.name}:</strong></p>
            <p>${post.text}</p>
            <div class="post-actions">
                <button onclick="likePost(${post.id})">👍 Me gusta (${post.likes})</button>
                <button onclick="deletePost(${post.id})">🗑️ Eliminar</button>
            </div>
            <p><strong>Likes:</strong> ${post.likers ? post.likers.join(', ') : 'Nadie ha dado like aún.'}</p>
            <div class="replies">
                ${post.replies.map(reply => `
                    <div class="reply">
                        <p><strong>${reply.name}:</strong> ${reply.text}</p>
                        <div class="reply-actions">
                            <button onclick="likeReply(${post.id}, ${reply.id})">👍 Me gusta (${reply.likes})</button>
                        </div>
                        <p><strong>Likes:</strong> ${reply.likers ? reply.likers.join(', ') : 'Nadie ha dado like aún.'}</p>
                    </div>
                `).join('')}
            </div>
            <input type="text" class="reply-name" placeholder="Tu nombre" />
            <textarea class="reply-input" placeholder="Escribe una respuesta..."></textarea>
            <button class="reply-button" onclick="addReply(${post.id})">Responder</button>
        `;
        postsContainer.appendChild(postElement);
    });
}

// Agregar una respuesta a una publicación
function addReply(postId) {
    const postElement = document.querySelector(`.post:nth-child(${posts.findIndex(post => post.id === postId) + 1})`);
    const replyNameInput = postElement.querySelector('.reply-name');
    const replyInput = postElement.querySelector('.reply-input');
    const replyName = replyNameInput.value.trim();
    const replyText = replyInput.value.trim();

    if (replyName === '') {
        alert('Por favor, ingresa tu nombre antes de responder.');
        return;
    }

    if (replyText === '') {
        alert('Por favor, escribe algo antes de responder.');
        return;
    }

    const reply = {
        id: Date.now(),
        name: replyName,
        text: replyText,
        likes: 0
    };

    posts = posts.map(post =>
        post.id === postId ? { ...post, replies: [...post.replies, reply] } : post
    );

    replyNameInput.value = '';
    replyInput.value = '';
    renderPosts();
    savePosts();
}

// Dar "Me gusta" a una publicación
function likePost(postId) {
    const likerName = prompt('Ingresa tu nombre para dar like:');
    if (!likerName) {
        alert('Debes ingresar tu nombre para dar like.');
        return;
    }

    posts = posts.map(post => {
        if (post.id === postId) {
            // Evitar duplicados en la lista de likes
            if (!post.likers) post.likers = [];
            if (!post.likers.includes(likerName)) {
                post.likes += 1;
                post.likers.push(likerName);
            } else {
                alert('Ya diste like a esta publicación.');
            }
        }
        return post;
    });

    renderPosts();
    savePosts();
}

// Dar "Me gusta" a una respuesta
function likeReply(postId, replyId) {
    const likerName = prompt('Ingresa tu nombre para dar like:');
    if (!likerName) {
        alert('Debes ingresar tu nombre para dar like.');
        return;
    }

    posts = posts.map(post => {
        if (post.id === postId) {
            post.replies = post.replies.map(reply => {
                if (reply.id === replyId) {
                    // Evitar duplicados en la lista de likes
                    if (!reply.likers) reply.likers = [];
                    if (!reply.likers.includes(likerName)) {
                        reply.likes += 1;
                        reply.likers.push(likerName);
                    } else {
                        alert('Ya diste like a esta respuesta.');
                    }
                }
                return reply;
            });
        }
        return post;
    });

    renderPosts();
    savePosts();
}

// Eliminar una publicación
function deletePost(postId) {
    posts = posts.filter(post => post.id !== postId);
    renderPosts();
    savePosts();
}

// Guardar publicaciones en Local Storage
function savePosts() {
    localStorage.setItem('posts', JSON.stringify(posts));
}

// Cargar publicaciones desde Local Storage
function loadPosts() {
    const savedPosts = localStorage.getItem('posts');
    if (savedPosts) {
        posts = JSON.parse(savedPosts);
    }
    renderPosts();
}

// Manejar el envío del formulario de nombre
function handleNameSubmit(event) {
    event.preventDefault();

    const userName = nameInput.value.trim();
    if (userName) {
        fixedNameElement.textContent = `Usuario: ${userName}`;
        nameFormContainer.style.display = 'none'; // Ocultar el formulario de nombre
        content.style.display = 'block'; // Mostrar el contenido principal
    } else {
        alert('Por favor, ingresa un nombre válido.');
    }
}

// Manejar el formulario de unirse al chat
function handleJoinChat(event) {
    event.preventDefault();

    const userName = chatNameInput.value.trim();
    const chatRoom = chatRoomInput.value.trim();

    if (userName) {
        fixedNameElement.textContent = `Usuario: ${userName}`;
        chatRoomElement.textContent = chatRoom ? `Sala: ${chatRoom}` : '';
        joinChatContainer.style.display = 'none'; // Ocultar el formulario de unirse al chat
        header.style.display = 'block'; // Mostrar el encabezado
        content.style.display = 'block'; // Mostrar el contenido principal
    } else {
        alert('Por favor, ingresa un nombre válido.');
    }
}

// Llamar a la función de carga inicial
window.onload = () => {
    loadPosts();
};

// Estilos para el campo de nombre de respuesta
const style = document.createElement('style');
style.textContent = `
.reply-name {
    width: 100%;
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 0.9rem;
}

.reply-name:focus {
    border-color: #007BFF;
    outline: none;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
}

/* Estilo mejorado para el botón "Responder" */
button.reply-button {
    background-color: #007BFF; /* Azul profesional */
    color: #fff; /* Texto blanco */
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
}

button.reply-button:hover {
    background-color: #0056b3; /* Azul más oscuro al pasar el cursor */
    transform: scale(1.05); /* Efecto de agrandamiento */
}

button.reply-button:active {
    background-color: #003f7f; /* Azul aún más oscuro al hacer clic */
    transform: scale(0.95); /* Efecto de reducción */
}
`;
document.head.appendChild(style);