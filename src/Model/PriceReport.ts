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
        mainAcs:Accessories | null
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
    }
}
export default PriceReport

export const createNewPriceReport = () : PriceReport=>{
    return new PriceReport("",0,"","","","",0,0,1,0,"",null,[],null);
}