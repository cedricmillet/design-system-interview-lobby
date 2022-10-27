const UID = window.location.toString().split('/').pop(); // TODO : from server
const WS_SERVER = `ws://localhost:8080/${UID}`; //  TODO : env variable

const Lobby = {
    socket: null,

    /**
     * Join lobby
     */
    init: function() {
        this.status(`Connecting to ${WS_SERVER}...`)
        this.socket = new WebSocket(WS_SERVER);
        this.socket.onerror = (err) => {
            console.error(err)
            Lobby.status(`Unable to join socket server ${WS_SERVER}`, 'err')
            window.location = `/?error=SocketServerConnectionLost`
        };
        this.socket.onopen = () => {
            Lobby.status(`Successfully connected to ${WS_SERVER}`);
        };
        this.socket.addEventListener('message', (event) => {
            Lobby.log('receiving from server')
            console.log('Message from server ', event.data);
        });
    },
    /**
     * Send event/data to server
     * @param {string} event 
     * @param {*} data 
     */
    send: function(event, data) {
        this.socket.send(JSON.stringify({event, data}))
    },
    /**
     * Send diagram update to server
     */
    updateDiagram: function() {
        this.send('diagUpdate', diagram.toJSON());
        Lobby.log('sending update to server')
    },
    /**
     * Set lobby status (informative)
     * @param {*} msg 
     * @param {*} type 
     */
    status: (msg, type="ok") => {
        const footer = document.querySelector('footer')
        footer.innerHTML = msg
        footer.style.color = type=='ok' ? '#fff' : 'red'
        Lobby.log(msg)
    },
    /**
     * Log message into lobby
     * @param {*} msg 
     */
    log: (msg) => {
        const li = document.createElement('li');
        li.innerHTML = msg;
        document.querySelector('console').children[0].appendChild(li)
    }
}

Lobby.init()

