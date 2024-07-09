class Accessories {
    id:any;
    code:string;
    name:string;
    supplier:string;
    totalQuantity:number;
    quantity:number;
    width:number;
    height:number;
    orgPrice:number;
    lowestPricePercent:number;
    price:number;

    constructor(
        id: any,
        code: string,
        name: string,
        supplier: string,
        totalQuantity: number,
        quantity: number,
        width: number,
        height: number,
        orgPrice: number,
        lowestPricePercent: number,
        price: number
    ) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.supplier = supplier;
        this.totalQuantity = totalQuantity;
        this.quantity = quantity;
        this.width = width;
        this.height = height;
        this.orgPrice = orgPrice;
        this.lowestPricePercent = lowestPricePercent;
        this.price = price;
    }
}
export default Accessories;