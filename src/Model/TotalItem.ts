import Accessories from "./Accessories";

class TotalItem {
    quantity:number;
    totalQuantity:number;
    typeTotal:any;
    name:string;
    price:number;
    code:string;
    typeQuantity:any;
    orgPrice:number;
    unit:string;
    constructor(quantity: number, totalQuantity: number, typeTotal: any, name: string, price: number, code: string,orgPrice:number,unit:string,typeQuantity?:any) {
        this.quantity = quantity;
        this.totalQuantity = totalQuantity;
        this.typeTotal = typeTotal;
        this.name = name;
        this.price = price;
        this.code = code;
        this.typeQuantity = typeQuantity;
        this.orgPrice=orgPrice
        this.unit = unit;
    }
    
   
}
export default TotalItem;
export function createTotalItem(name:string): TotalItem {
    return new TotalItem(0, 0, "a", name, 10, "COD",0,"bộ");
}
