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
    constructor(
        id: string,
        name: string,
        supplier: string,
        totalQuantity: number,
        doorCode: string,
        width: number,
        height: number,
        accessories: Accessories[]
    ) {
        this.id = id;
        this.name = name;
        this.supplier = supplier;
        this.totalQuantity = totalQuantity;
        this.doorCode = doorCode;
        this.width = width;
        this.height = height;
        this.accessories = accessories;
    }
}
export default Product;