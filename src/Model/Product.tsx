import Accessories from "./Accessories";

class Product {
    id:any;
    name:string;
    supplier:string;
    selectId!: any;
    totalQuantity:number;
    doorCode:string;
    width:number;
    height:number;
    accessories:Accessories[];
    info1:number;
    info2:string;
    name1:string;
    name2:string;
    name3:string;
    name4:string;
    constructor(
        id: string,
        name: string,
        supplier: string,
        totalQuantity: number,
        doorCode: string,
        width: number,
        height: number,
        accessories: Accessories[],
        info1: number,
        info2: string,
        name1:string,
        name2:string,
        name3:string,
        name4:string
    ) {
        this.id = id;
        this.name = name;
        this.supplier = supplier;
        this.totalQuantity = totalQuantity;
        this.doorCode = doorCode;
        this.width = width;
        this.height = height;
        this.accessories = accessories;
        this.info1 = info1;
        this.info2 = info2;
        this.name1 = name1;
        this.name2 = name2;
        this.name3 = name3;
        this.name4 = name4;
    }

    
}
export default Product;