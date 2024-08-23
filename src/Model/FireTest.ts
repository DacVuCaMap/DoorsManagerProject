class FireTest {
    id:any;
    name:string;
    thickness:number;
    m1000:number;
    m100:number;
    m50:number;
    m30:number;
    u30:number;
    u10:number;
    index:number;
    type:string;
    doorNameSelectId:any;
    constructor(
        id: any,
        name: string,
        thickness: number,
        m1000: number,
        m100: number,
        m50: number,
        m30:number,
        u30: number,
        u10: number,
        index: number,
        type:string,
        doorNameSelectId: any
    ) {
        this.id = id;
        this.name = name;
        this.thickness = thickness;
        this.m1000 = m1000;
        this.m100 = m100;
        this.m50 = m50;
        this.m30 = m30;
        this.u30 = u30;
        this.u10 = u10;
        this.index = index;
        this.type = type;
        this.doorNameSelectId = doorNameSelectId;
    }
}
export default FireTest;