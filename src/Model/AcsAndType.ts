import Accessories from "./Accessories";
class AcsAndType {
    accessories:Accessories;
    type : string;
    constructor(
        accessories:Accessories,
        type: string,
    ) {
        this.accessories = accessories;
        this.type = type;
    }
}
export default AcsAndType;