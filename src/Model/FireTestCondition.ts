import FireTestGroupRequest from "@/Request/FireTestGroupRequest";
import FireTest from "./FireTest";

class FireTestCondition {
    fireTestGroupId: any;
    fireTest: FireTest | null;
    status:boolean;
    constructor(
        fireTestGroupId: any,
        fireTest: FireTest | null,
        status:boolean
    ) {
        this.fireTestGroupId = fireTestGroupId;
        this.fireTest = fireTest;
        this.status = status;
    }
}
export default FireTestCondition