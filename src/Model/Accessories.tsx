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
    unit:string;
    status:boolean;
    isCommand?: boolean;
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
        price: number,
        unit: string,
        status:boolean,
        isCommand?: boolean
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
        this.unit = unit;
        this.status = status;
        this.isCommand = isCommand ?? false
    }
}
export default Accessories;