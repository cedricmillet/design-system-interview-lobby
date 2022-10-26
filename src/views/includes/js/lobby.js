const WS_SERVER = 'ws://localhost:8080';

const Lobby = {
    socket: null,
    /**
     * Join lobby
     */
    init: function() {
        this.status(`Connecting to ${WS_SERVER}...`)
        this.socket = new WebSocket(WS_SERVER);
        this.socket.onerror = this.onSocketError;
        this.socket.onopen = this.onSocketOpen;
        this.socket.addEventListener('message', (event) => {
            console.log('Message from server ', event.data);
        });        
    },
    onSocketOpen: () => {
        Lobby.status(`Successfully connected to ${WS_SERVER}`)
        Lobby.socket.send('Hello Server!');
    },
    onSocketError: (err) => {
        console.error(">>>>>> ERROR SOCKET == > ", err)
        Lobby.status(`Unable to join socket server ${WS_SERVER}`, 'err')
    },
    /**
     * Log message
     * @param {*} msg 
     * @param {*} type 
     */
    status: (msg, type="ok") => {
        const footer = document.querySelector('footer')
        footer.innerHTML = msg
        footer.style.color = type=='ok' ? '#fff' : 'red'
    }
}

Lobby.init()

