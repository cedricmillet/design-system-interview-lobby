
import uniqid from 'uniqid';
import { Lobby } from './Lobby';

export const interviews : Interview[] = []

export class Interview {
    
    /**
     * Interview uniqID
     */
    public uid: string;

    /**
     * JSON diagram
     */
    public data: any[] = []

    constructor(uid:string) {
        this.uid = uid;
    }

    /**
     * Create new one
     * @returns UID
     */
    public static create() : string {
        const uid = uniqid();
        interviews.push(new Interview(uid));
        console.log(`Interview created ${uid}`)
        return uid;
    }

    /**
     * Find one by uid
     * @param uid 
     * @returns 
     */
    public static find(uid:string) {
        return interviews.find(l => l.uid === uid);
    }

    /**
     * Receive update from one client
     * @param json 
     */
    public updateDiagramFromClientJSON(json:any[]) {
        if(!Array.isArray(json)) {
            throw new Error(`Provide an array`)
        }

        this.data = json; // TEST /!\
        this.broadcastDiagram()
    }

    /**
     * Broadcast update to all clients
     */
    private broadcastDiagram() {
        Lobby.broadcast(this.uid, 'diagUpdate', this.data);
    }


}