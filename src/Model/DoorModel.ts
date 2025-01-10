import Accessories from "./Accessories";
import AccessoryAndFeature from "./AccessoryAndFeature";

class DoorModel{
    id:any;
    name:string;
    showName:string;
    shortName:string;
    accessoryAndFeature:AccessoryAndFeature[];
    accessoryMain:Accessories | null;
    accessoryGlass:Accessories | null;
    glassBracket:Accessories | null;
    fireTestCondition:string;
    fireTestValue:string;
    numberDoor:number;
    acsGroupCost:AccessoryAndFeature[];
    wingType?:string;
    constructor(
        id: any,
        name: string,
        showName:string,
        shortName:string,
        accessoryAndFeature: AccessoryAndFeature[],
        accessoryMain: Accessories | null,
        accessoryGlass: Accessories | null,
        glassBracket: Accessories | null,
        fireTestCondition: string,
        fireTestValue:string,
        numberDoor:number,
        acsGroupCost?:AccessoryAndFeature[],
        wingType?:string,
    ) {
        this.id = id;
        this.name = name;
        this.showName=showName
        this.shortName = shortName;
        this.accessoryAndFeature = accessoryAndFeature;
        this.accessoryMain = accessoryMain;
        this.accessoryGlass = accessoryGlass;
        this.glassBracket = glassBracket;
        this.fireTestCondition = fireTestCondition;
        this.fireTestValue = fireTestValue;
        this.numberDoor = numberDoor;
        this.acsGroupCost = acsGroupCost ? acsGroupCost : [];
        this.wingType=wingType;
    }
}
export default DoorModel;

export const newDoorModel=()=>{
    return new DoorModel(0,"","","",[],null,null,null,"","",1,[],"cánh");
}