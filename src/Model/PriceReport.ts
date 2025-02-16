import Accessories from "./Accessories";
import DoorModel from "./DoorModel";
import FireTest from "./FireTest";

class PriceReport {
    id: any;
    index: number;
    name:string;
    code: string;
    EI:string;
    supplier: string;
    width: number;
    height: number;
    quantity: number;
    totalQuantity: number;
    unit: string;
    doorModel:any;
    accessories:Accessories[];
    mainAcs:Accessories | null;
    glassAcs:Accessories | null;
    nepAcs:Accessories | null;
    onGlass:boolean;
    numberDoor?:number;
    showName?:string;
    eiString?:string;
    constructor(
        id: any,
        index: number,
        name:string,
        code: string,
        EI:string,
        supplier: string,
        width: number,
        height: number,
        quantity: number,
        totalQuantity: number,
        unit: string,
        doorModel:any,
        accessories:Accessories[],
        mainAcs:Accessories | null,
        numberDoor?:number,
        glassAcs?:Accessories|null,
        nepAcs?:Accessories|null,
        onGlass?:boolean
    ) {
        this.id = id;
        this.index = index;
        this.name = name;
        this.code = code;
        this.EI = EI;
        this.supplier = supplier;
        this.width = width;
        this.height = height;
        this.quantity = quantity;
        this.totalQuantity = totalQuantity;
        this.unit = unit;
        this.doorModel = doorModel;
        this.accessories = accessories;
        this.mainAcs = mainAcs;
        this.numberDoor = numberDoor;
        this.glassAcs = glassAcs ?? null;
        this.nepAcs = nepAcs ?? null;
        this.onGlass = onGlass ?? true;

    }
}
export default PriceReport

export const createNewPriceReport = () : PriceReport=>{
    return new PriceReport("",0,"","","","",0,0,1,0,"",null,[],null,0);
}