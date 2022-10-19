const socket = new WebSocket('ws://localhost:8080');

// Connection opened
socket.onopen = (event) => {
    socket.send('Hello Server!');
};

socket.onerror = (err) => {
    console.error(">>>>>>", err)
};

// Listen for messages
socket.addEventListener('message', (event) => {
    console.log('Message from server ', event.data);
});

const Lobby = {
    socket: null,
    /**
     * Join lobby
     */
    join: () => {

    }
}