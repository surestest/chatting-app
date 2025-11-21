const socket = io();

function joinChat() {
    const username = document.getElementById('username').value;
    if(!username) return alert("Enter username");

    socket.emit('setUsername', username);
    document.getElementById('chat-container').style.display = 'block';
}

// Room full alert
socket.on('roomFull', () => {
    alert("Room is full! Only 2 members allowed.");
});

// Update online users
socket.on('onlineUsers', (users) => {
    const ul = document.getElementById('users');
    ul.innerHTML = '';
    users.forEach(u => {
        const li = document.createElement('li');
        li.textContent = u;
        ul.appendChild(li);
    });
});

// Send message
function sendMessage() {
    const msg = document.getElementById('message').value;
    if(!msg) return;

    const ul = document.getElementById('messages');
    const li = document.createElement('li');
    li.textContent = `You: ${msg}`;
    li.classList.add('self'); // self message styling
    ul.appendChild(li);

    socket.emit('chatMessage', msg);
    document.getElementById('message').value = '';
}


// Receive message from other user
socket.on('chatMessage', (data) => {
    const ul = document.getElementById('messages');
    const li = document.createElement('li');
    li.textContent = `${data.username}: ${data.message}`;
    li.classList.add('other'); // other user styling
    ul.appendChild(li);
});

