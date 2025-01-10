import GroupAccessory from "./GroupAccessory";

class AccessoryAndFeature {
    id:any;
    accessoryGroup:GroupAccessory;
    quantity:number;
    condition:string;
    acsType:string;
    constructor(accessoryGroup:GroupAccessory,quantity:number,condition:string,type:string,id?:any){
        this.accessoryGroup=accessoryGroup;
        this.condition=condition;
        this.quantity=quantity;
        this.acsType =type ? type : "normal"; 
        this.id = id;
    }
}
export default AccessoryAndFeature;