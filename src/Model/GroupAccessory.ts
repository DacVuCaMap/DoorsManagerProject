import Accessories from "./Accessories";
import AcsAndType from "./AcsAndType";
class GroupAccessory {
    id:any;
    name:string;
    accessoriesAndType:AcsAndType[];
    constructor(
        id: any,
        name: string,
        accessoriesAndType:AcsAndType[]
    ) {
        this.id = id;
        this.name = name;
        this.accessoriesAndType = accessoriesAndType;
    }
}
export default GroupAccessory;