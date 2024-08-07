class DoorNameSelect {
    id:any;
    name:string;
    numberDoor:string[];
    type:string[];
    code:string[];
    material:string;
    constructor (id:any,name:string,numberDoor:string[],type:string[],code:string[],material:string){
        this.id=id;
        this.name=name;
        this.numberDoor=numberDoor;
        this.type=type;
        this.code=code;
        this.material=material;
    }
}
export default DoorNameSelect;