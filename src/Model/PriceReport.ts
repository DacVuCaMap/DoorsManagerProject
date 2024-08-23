import Accessories from "./Accessories";
import FireTest from "./FireTest";

class PriceReport {
    id: any;
    index: number;
    name:string;
    fireTestCode:string;
    code: string;
    supplier: string;
    width: number;
    height: number;
    quantity: number;
    totalQuantity: number;
    unit: string;
    doorNameSelectId: any;
    fireTest: FireTest| null;
    listTypeAcs: any[];
    accessories:Accessories[];
    constructor(
        id: any,
        index: number,
        name:string,
        fireTestCode:string,
        code: string,
        supplier: string,
        width: number,
        height: number,
        quantity: number,
        totalQuantity: number,
        unit: string,
        doorNameSelectId: any,
        fireTest: FireTest | null,
        listTypeAcs: any[],
        accessories:Accessories[]
    ) {
        this.id = id;
        this.index = index;
        this.name = name;
        this.fireTestCode = fireTestCode;
        this.code = code;
        this.supplier = supplier;
        this.width = width;
        this.height = height;
        this.quantity = quantity;
        this.totalQuantity = totalQuantity;
        this.unit = unit;
        this.doorNameSelectId = doorNameSelectId;
        this.fireTest = fireTest;
        this.listTypeAcs = listTypeAcs;
        this.accessories = accessories
    }
}
export default PriceReport