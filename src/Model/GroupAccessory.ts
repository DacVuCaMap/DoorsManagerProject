import Accessories from "./Accessories";
import AcsAndType from "./AcsAndType";
class GroupAccessory {
    id:any;
    name:string;
    accessoriesAndType:AcsAndType[];
    type:string;
    quantity?:number;
    constructor(
        id: any,
        name: string,
        accessoriesAndType:AcsAndType[],
        type:string
    ) {
        this.id = id;
        this.name = name;
        this.accessoriesAndType = accessoriesAndType;
        this.type = type;
    }
}
export default GroupAccessory;