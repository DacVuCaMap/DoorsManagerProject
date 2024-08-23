import Accessories from "./Accessories";

class TotalItem {
    acs:Accessories
    typeTotal:string;
    constructor(acs:Accessories,typeTotal:string){
        this.acs = acs;
        this.typeTotal = typeTotal;
    }
   
}
export default TotalItem;