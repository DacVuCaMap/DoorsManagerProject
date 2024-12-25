import { listTypeTotal } from "@/data/ListData";
import Accessories from "./Accessories"
import TotalItem from "./TotalItem";

class TotalGroup {
    id:any;
    totalItem:TotalItem[];
    name:string;
    constructor(id:any,totalItem:TotalItem[],name:string){
        this.id=id;
        this.totalItem=totalItem;
        this.name=name;
    }
   
}
export default TotalGroup;
export const createNewTotalGroupArray = (): TotalGroup[] =>{
    const mainAcs1 : TotalItem = new TotalItem(0,0,0,"Chi phí vữa nhét vào khung cửa thép chống cháy",0,"CPV");
    const mainAcs2 : TotalItem = new TotalItem(0,0,0,"Chi phí lắp đặt, hoàn thiện cửa thép chống cháy",0,"CPLD");
    const cpvc : TotalItem = new TotalItem(0,0,1,"Chi phí vận chuyển",0,"CPVC");
    const cpkd : TotalItem = new TotalItem(0,0,0,"Chi phí hồ sơ kiểm định PCCC",0,"BCA");
    return [new TotalGroup(0,[mainAcs1,mainAcs2,cpvc,cpkd],"Chi chí chung")];
}