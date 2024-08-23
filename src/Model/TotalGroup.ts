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