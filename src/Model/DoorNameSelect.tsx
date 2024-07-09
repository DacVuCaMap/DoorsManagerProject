class DoorNameSelect {
    id: number;
    name!: string;
    numberDoor!: any[];
    type!: any[];
    code!: any[];
    material!: string;
    constructor(id:number,name:string,numberDoor:any[],type:any[],code:any[],material:string) {
        this.id=id;
        this.name=name;
        this.numberDoor=numberDoor;
        this.type=type;
        this.code=code;
        this.material=material;
    }
}
export default DoorNameSelect