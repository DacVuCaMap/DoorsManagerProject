import GroupAccessory from "./GroupAccessory";

class AccessoryAndFeature {
    id:any;
    accessoryGroup:GroupAccessory;
    quantity:number;
    condition:string;
    constructor(accessoryGroup:GroupAccessory,quantity:number,condition:string){
        this.accessoryGroup=accessoryGroup;
        this.condition=condition;
        this.quantity=quantity;
    }
}
export default AccessoryAndFeature;