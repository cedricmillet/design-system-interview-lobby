const WS = require('ws');


export class WebSocketServer {
    private static port = process.env.WS_PORT || 8090;
    private static wss: any;

    public static listen() {
 
        // Creating a new websocket server
        this.wss = new WS.Server({ port: this.port })
        
        // Creating connection using websocket
        this.wss.on("connection", (ws:any) => {
            console.log("new client connected");
            // sending message
            ws.on("message", (data:any) => {
                console.log(`Client has sent us: ${data}`)
            });
            // handling what to do when clients disconnects from server
            ws.on("close", () => {
                console.log("the client has connected");
            });
            // handling client connection error
            ws.onerror = function () {
                console.log("Some Error occurred")
            }
        });

        console.log(`WebSocket server is running on port ${this.port}`);
    }
}
