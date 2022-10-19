
import uniqid from 'uniqid';

export const interviews : Interview[] = []

export class Interview {

    public uid: string;

    constructor(uid:string) {
        this.uid = uid;
    }

    /**
     * Create new
     * @returns UID
     */
    public static create() : string {
        const uid = uniqid();
        interviews.push(new Interview(uid))
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


}