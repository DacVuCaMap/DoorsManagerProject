import Accessories from "@/Model/Accessories";
import Product from "@/Model/Product";
import { genNumberByTime } from "./FunctionAll";

export const CalTotalInforProduct = (products: Product[]) => {
    let tot = products.reduce((total, item: Product) => {
        return total + item.accessories[0].quantity * item.totalQuantity;
    }, 0)
    return parseFloat(tot.toFixed(4));
}
export const CalTotalMoreInforProduct = (products: Product[], key: string) => {
    let acsKey = key === "CPLDPN" ? "PND0" : "BLS01";

    let tot = products.reduce((parentTotal, item: Product) => {
        let childTot = item.accessories.reduce((total, acs: Accessories) => {

            if (acs.code.includes(acsKey)) {
                console.log(acsKey, acs.code, item.accessories[0].totalQuantity);
                return total + (item.accessories[0].quantity * item.totalQuantity || 0)
            }
            return total;
        }, 0)
        return childTot + parentTotal;
    }, 0)
    return tot;
}

export const ConstructorAcs = (id:any,code: string, name: string) => {
    return new Accessories(
        id,
        code,
        name,
        "",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        "",
        false
    )
}