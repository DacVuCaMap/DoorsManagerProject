import GetPattern from "@/ApiPattern/GetPattern";
import DoorNameSelect from "@/Model/DoorNameSelect";

export const genNumberByTime = () => {

    return Date.now();
}
export const formatNumberToDot = (number: any) => {
    if (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return 0;
}
export const formatNumberFixed4 = (number: number) => {
    return parseFloat(number.toFixed(4));
}

export const LoadSelectData = async () => {
    let url = process.env.NEXT_PUBLIC_API_URL + "/api/others/get-door-name-select";
    const response = await GetPattern(url, {});
    if (response && response.value && Array.isArray(response.value)) {
        let rs: DoorNameSelect[] = response.value.map((parentItem: any) => {
            let numberDoor = (parentItem.numberDoor || "").split('./').map((item: string) => item.trim());
            let type = (parentItem.type || "").split('./').map((item: string) => item.trim());
            let code = (parentItem.code || "").split('./').map((item: string) => item.trim());
            return {id:parentItem.id,name:parentItem.name,numberDoor:numberDoor,type:type,code:code,material:parentItem.material};
        })
        return rs;
    }
    return [];
}
