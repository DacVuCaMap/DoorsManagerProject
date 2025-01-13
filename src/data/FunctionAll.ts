import GetPattern from "@/ApiPattern/GetPattern";
import Accessories from "@/Model/Accessories";
import AccessoryAndFeature from "@/Model/AccessoryAndFeature";
import AcsAndType from "@/Model/AcsAndType";
import DoorModel from "@/Model/DoorModel";
import DoorNameSelect from "@/Model/DoorNameSelect";
import FireTest from "@/Model/FireTest";
import GroupAccessory from "@/Model/GroupAccessory";
import PriceReport from "@/Model/PriceReport";
type fireTestGroup = {
    id: any,
    fireTest: FireTest[]
}
export const extractNumber = (inputString: any) => {
    // Sử dụng regex để tìm số
    const regex = /\d+/g;
    const match = inputString.match(regex);

    // Trả về số đầu tiên tìm được hoặc null nếu không tìm thấy
    return match ? match[0] : null;
};
export const extractFirstNumber = (str: any) => {
    const match = str.match(/\d+(\.\d+)?/);
    return match ? match[0] : null;
}
export const genNumberByTime = () => {
    return Date.now();
}
export const formatNumberToDot = (number: any) => {
    if (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return 0;
}
export const formatDotToNumber = (str: string) => {
    if (str) {
        return parseFloat(str.replace(/\./g, ''));
    }
    return 0;
}
export const formatNumberFixed4 = (number: number) => {
    return parseFloat(number.toFixed(4));
}
export const formatNumberFixed3 = (number: any) => {
    if (number) {
        number = parseFloat(number);
        return parseFloat(number.toFixed(4));
    }
    return number;
}

export const LoadSelectData = async () => {
    let url = process.env.NEXT_PUBLIC_API_URL + "/api/others/get-door-name-select";
    const response = await GetPattern(url, {});
    if (response && response.value && Array.isArray(response.value)) {
        let rs: DoorNameSelect[] = response.value.map((parentItem: any) => {
            let numberDoor = (parentItem.numberDoor || "").split('./').map((item: string) => item.trim());
            let type = (parentItem.type || "").split('./').map((item: string) => item.trim());
            let code = (parentItem.code || "").split('./').map((item: string) => item.trim());
            return { id: parentItem.id, name: parentItem.name, numberDoor: numberDoor, type: type, code: code, material: parentItem.material };
        })
        return rs;
    }
    return [];
}
export const LoadAccessoriesDataOffline = async () => {
    let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/list?page=0&size=1000&search";
    const response = await GetPattern(url, {});
    if (response && response.content && Array.isArray(response.content)) {
        const list: any[] = response.content;
        let newAcs: Accessories[] = list.map((item: any, index: number) => {
            return {
                id: item.id,
                code: item.code,
                name: item.name,
                supplier: item.supplier,
                totalQuantity: 0,
                quantity: 0,
                width: 0,
                height: 0,
                orgPrice: item.orgPrice,
                lowestPricePercent: item.lowestPricePercent,
                lowPercent: item.lowPercent,
                price: 0,
                unit: item.unit,
                status: false,
                type: item.type,
                isCommand: false,
                accessoryGroup: item.accessoryGroup ? item.accessoryGroup : null,
                acsDes:""
            };
        });
        return newAcs;
    }
    return [];
}

export const LoadListDoorModelData = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/api/door-model/list";
    const response = await GetPattern(url, {});
    if (response && Array.isArray(response) && response.length > 0 && response[0].name) {
        return response;
    }
    return [];
}

export const LoadFireTest = async () => {
    let url = process.env.NEXT_PUBLIC_API_URL + "/api/fireTest/getAllGroup"
    const response = await GetPattern(url, {});
    if (response && response.value) {
        const rs: fireTestGroup[] = response.value.map((item: any, index: number) => {
            return { id: item.id, fireTest: item.fireTestItemList }
        })
        return rs;
    }
    return [];
}

export const LoadAccesoryGroupNoAcs = async () => {
    let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/get-list-group"
    const response = await GetPattern(url, {});
    if (response && response.value && Array.isArray(response.value)) {
        const rs: GroupAccessory[] = response.value.map((item: any, index: number) => {
            const acsAndType: AcsAndType[] = item.accessories.map((acs: any) => {
                return { accessories: acs, type: acs.type };
            })
            return { id: item.id, name: item.name, type: item.type, accessoriesAndType: acsAndType };
        })
        return rs;
    }
    return [];
}
export function formatNumberVN(num: number) {
    num = Math.floor(num * 100) / 100;
    // Định dạng số theo chuẩn địa phương là "vi-VN" (Việt Nam)
    let formattedNumber = num.toLocaleString('vi-VN');

    // Trả về kết quả đã định dạng
    return formattedNumber;
}
export function parseVnToNumber(formattedNumber: string): number {
    let numberString = formattedNumber.replace(/\./g, '');
    numberString = numberString.replace(',', '.');
    const number = parseFloat(numberString);
    return isNaN(number) ? 0 : number;
}
export const changePriceAndTempPrice = (acs: Accessories, value: string): Accessories => {
    if (value && !(/^\d*([.,]?\d*)$/).test(value)) {
        return acs; // Prevent invalid input
    }

    if (value.length > 1) {
        value = value.charAt(0) === "0" ? value.replace(/^0+/, '') : value;
    }
    else {
        value = value ? value : "0";
    }
    let newAcs: Accessories = { ...acs, tempPrice: value };
    if (value && !value.endsWith(",") && !value.endsWith(".")) {
        newAcs = { ...newAcs, price: parseVnToNumber(value) };
    }
    return newAcs;
}

export const changeObjectPriceAndTempPrice = (obj:any,value: string,key:string,tempKey:string) => {
    if (value && !(/^\d*([.,]?\d*)$/).test(value)) {
        return obj; // Prevent invalid input
    }
    if (value.length > 1) {
        value = value.charAt(0) === "0" ? value.replace(/^0+/, '') : value;
    }
    else {
        value = value ? value : "0";
    }
    let newObj : any ={...obj,[tempKey]:value}; 
    if (value && !value.endsWith(",") && !value.endsWith(".")) {
        newObj = { ...newObj, [key]: parseVnToNumber(value) };
    }
    return newObj;
}