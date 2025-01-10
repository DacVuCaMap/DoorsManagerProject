class Accessories {
    id: any;
    code: string;
    name: string;
    supplier: string;
    totalQuantity: number;
    quantity: number;
    width: number;
    height: number;
    orgPrice: number;
    lowestPricePercent: number;
    lowPercent: number[];
    price: number;
    unit: string;
    status: boolean;
    type?: string;
    isCommand?: boolean;
    accessoryGroup?:any;
    supplierShow?:string;
    condition?:string;
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
        status: boolean,
        isCommand?: boolean,
        supplierShow?:string
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
        this.lowPercent = [];
        this.price = price;
        this.unit = unit;
        this.status = status;
        this.isCommand = isCommand ?? false
        this.supplierShow = supplierShow;
    }
}
export default Accessories;

export const getNewAcs = (): Accessories => {
    return new Accessories("", "", "", "", 0, 0, 0, 0, 0, 0, 0, "", false, false,"");
}
export const TransRequestToAcs = (item: any): Accessories => {
    return {
        id: item?.id,
        code: item?.code,
        name: item?.name,
        supplier: item?.supplier,
        totalQuantity: 0,
        quantity: 0,
        width: 0,
        height: 0,
        orgPrice: item?.orgPrice,
        lowestPricePercent: item?.lowestPricePercent,
        lowPercent: item?.lowPercent?.split(",").map(Number),
        price: 0,
        unit: item?.unit,
        status: false,
        type: item?.type,
        isCommand: true
    }
}
export const getNewAcsWithName = (str:string): Accessories => {
    return {
        id: "",
        code: "",
        name: str,
        supplier: "",
        totalQuantity: 0,
        quantity: 0,
        width: 0,
        height: 0,
        orgPrice: 0,
        lowestPricePercent: 0,
        lowPercent: [],
        price: 0,
        unit: "",
        status: false,
        type: "",
        isCommand: false
    }

}