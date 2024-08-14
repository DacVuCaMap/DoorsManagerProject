import FireTest from "@/Model/FireTest";

class FireTestGroupRequest {
    id:any;
    fireTestItemList:FireTest[];
    color:number;
    constructor(
        id:any,fireTestItemList:FireTest[],color:number
    ) {
        this.id = id;
        this.fireTestItemList=fireTestItemList;
        this.color=color;
    }
}
export default FireTestGroupRequest;