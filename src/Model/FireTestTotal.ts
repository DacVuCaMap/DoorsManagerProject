import FireTestGroupRequest from "@/Request/FireTestGroupRequest";
import Accessories from "./Accessories";

class FireTestTotal{
    id:any;
    acs:Accessories;
    fireTestGroup:FireTestGroupRequest[];
    constructor(id:any,acs:Accessories,fireTestGroup:FireTestGroupRequest[]){
        this.id = id;
        this.acs = acs;
        this.fireTestGroup = fireTestGroup;
    }
}
export default FireTestTotal