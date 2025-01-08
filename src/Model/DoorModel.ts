import Accessories from "./Accessories";
import AccessoryAndFeature from "./AccessoryAndFeature";

class DoorModel{
    id:any;
    name:string;
    shortName:string;
    accessoryAndFeature:AccessoryAndFeature[];
    accessoryMain:Accessories | null;
    accessoryGlass:Accessories | null;
    glassBracket:Accessories | null;
    fireTestCondition:string;
    fireTestValue:string;
    numberDoor:number;
    constructor(
        id: any,
        name: string,
        shortName:string,
        accessoryAndFeature: AccessoryAndFeature[],
        accessoryMain: Accessories | null,
        accessoryGlass: Accessories | null,
        glassBracket: Accessories | null,
        fireTestCondition: string,
        fireTestValue:string,
        numberDoor:number
    ) {
        this.id = id;
        this.name = name;
        this.shortName = shortName;
        this.accessoryAndFeature = accessoryAndFeature;
        this.accessoryMain = accessoryMain;
        this.accessoryGlass = accessoryGlass;
        this.glassBracket = glassBracket;
        this.fireTestCondition = fireTestCondition;
        this.fireTestValue = fireTestValue;
        this.numberDoor = numberDoor;
    }
}
export default DoorModel;

export const newDoorModel=()=>{
    return new DoorModel(null,"","",[],null,null,null,"","",1);
}