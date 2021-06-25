const socket = io('http://localhost:8000')

//get DOM elements in respective js variables
const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
//play audio on notifications
var audio = new Audio('ting.mp3');


//if form gets submitted, send msg to server
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right')
    socket.emit('send',message);
    messageInput.value=' '
});

//function which will append event info to the container    
const append= (message, position)=>{
    const messageElement = document.createElement('div');
    messageElement.innerText = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left'){
        audio.play();
    }
}

//Ask user name and send to server
const name = prompt('Hey there! Please Enter Your Name to Join the Chat..');
socket.emit('new-user-joined',name);

//if new user joins receive event from the server
socket.on('user-joined', name => {
    append(`${name} joined the chat`, 'right');
    })

//if server sends message, receive the message
socket.on('receive',data=>{
    append(`${data.name}:${data.message}`,'left')
})

//if user leaves the chat, append the info to container
socket.on('leave',name=>{
    append(`${name} left the chat`,'right');
})
