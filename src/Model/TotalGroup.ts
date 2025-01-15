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
    const cpvc : TotalItem = new TotalItem(1,1,1,"Chi phí vận chuyển",0,"CPVC",0,"bộ",0);
    const cpkd : TotalItem = new TotalItem(1,1,1,"Chi phí hồ sơ kiểm định PCCC",0,"BCA",0,"bộ",-1);
    return [new TotalGroup(0,[cpvc,cpkd],"Chi chí chung")];
}