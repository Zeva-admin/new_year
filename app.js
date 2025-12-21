const params = new URLSearchParams(location.search);
const room = params.get('room');


if (room) {
document.getElementById('roomCode').innerText = room;
}


function createRoom() {
const code = Math.floor(100000 + Math.random() * 900000);
location.href = `room.html?room=${code}`;
}


function joinRoom() {
const code = document.getElementById('roomInput').value;
if (code) location.href = `room.html?room=${code}`;
}


function loadVideo() {
const url = document.getElementById('videoUrl').value;
document.getElementById('videoFrame').src = url;
}


function toggleTheme() {
document.body.classList.toggle('dark');
document.body.classList.toggle('light');
}


function sendMsg() {
const msg = document.getElementById('msg').value;
const div = document.createElement('div');
div.innerText = msg;
document.getElementById('messages').appendChild(div);
document.getElementById('msg').value = '';
}