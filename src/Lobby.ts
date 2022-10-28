import { WebSocketServer } from 'ws';
import { Interview } from './Interview';


export class Lobby {
    private static port = parseInt(process.env.WS_PORT as string) || 8080;
    private static wss: WebSocketServer;

    public static listen() {
 
        // Creating a new websocket server
        this.wss = new WebSocketServer({ port: this.port })
        console.log(`WebSocket server is running on port ${this.port}`);
        
        // Creating connection using websocket
        this.wss.on("connection", (ws:any, req:any) => {
            const uid = req.url.replace('/', '');
            const interview = Interview.find(uid);
            ws.uid = uid;

            if(interview === undefined) {
                ws.close();
                console.error(`Unknown interview`, uid)
                return;
            }

            ws.send(JSON.stringify({event: 'diagUpdate', data: interview.data}))
            console.log(`[${uid}] New client connected, sending diagram`)

            // sending message
            ws.on("message", (msg:any) => {
                const {event, data} = JSON.parse(msg.toString())
                console.log(`[${uid}][${event}]`, typeof data)
                switch(event) {
                    case 'diagUpdate':
                        interview.updateDiagramFromClientJSON(data)
                        break;
                    default:
                        console.error(`[${uid}] Unknown event type: ${event}`);
                }
                
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
 
        
    }

    public static broadcast(uid:string, type:string, data:any) {
        if(!(this.wss instanceof WebSocketServer)) {
            throw new Error(`Unable to broadcast without valid WebSocketServer`);
        }
        
        console.log(`[broadcast] ${type}`)
        for(let client of this.wss.clients) {
            if((client as any).uid !== uid) continue;
            client.send(JSON.stringify({event: type, data}))
        }
    }
}
