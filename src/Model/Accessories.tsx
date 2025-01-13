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
    tempPrice?:any;
    acsDes:string;
    constructor(
        id: any,
        type:any,
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
        supplierShow?:string,
        acsDes?:string
    ) {
        this.id = id;
        this.type=type ?? "normal";
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
        this.acsDes=acsDes ?? "";
    }
}
export default Accessories;

export const getNewAcs = (): Accessories => {
    return new Accessories("","normal","", "", "", 0, 0, 0, 0, 0, 0, 0, "", false, false,"");
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
        isCommand: true,
        acsDes:""
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
        isCommand: false,
        acsDes:""
    }

}