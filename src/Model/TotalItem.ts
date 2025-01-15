import Accessories from "./Accessories";

class TotalItem {
    id:any;
    quantity:number;
    totalQuantity:number;
    typeTotal:any;
    name:string;
    price:number;
    code:string;
    typeQuantity:any;
    orgPrice:number;
    unit:string;
    pricePercent:number;
    pricePercentTemp:any;
    totalItemIndex?:number[]
    constructor(id:any,quantity: number, totalQuantity: number, typeTotal: any, name: string, price: number, code: string,orgPrice:number,unit:string,typeQuantity?:any,pricePercent?:number) {
        this.id=id;
        this.quantity = quantity;
        this.totalQuantity = totalQuantity;
        this.typeTotal = typeTotal;
        this.name = name;
        this.price = price;
        this.code = code;
        this.typeQuantity = typeQuantity;
        this.orgPrice=orgPrice
        this.unit = unit;
        this.pricePercent = pricePercent ?? 0;
    }
}
export default TotalItem;
export function createTotalItem(name:string): TotalItem {
    return new TotalItem(0,0, 0, "a", name, 10, "COD",0,"bộ");
}
