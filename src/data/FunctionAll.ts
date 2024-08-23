import GetPattern from "@/ApiPattern/GetPattern";
import Accessories from "@/Model/Accessories";
import DoorNameSelect from "@/Model/DoorNameSelect";
import FireTest from "@/Model/FireTest";
import GroupAccessory from "@/Model/GroupAccessory";
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
export const extractFirstNumber = (str:any)=> {
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
    let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/list?page=0&size=150&search";
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
                isCommand: false
            };
        });
        return newAcs;
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
            return { id: item.id, name: item.name, type: item.type, accessoriesAndType: [] };
        })
        return rs;
    }
    return [];
}