class AccessoryGroupRequest {
    name:string;
    accessoriesAndType:{ id: any; type: string; } | undefined;
    constructor(
        name:string,accessoriesAndType:{ id: any; type: string; }
    ) {
        this.name=name;
        this.accessoriesAndType=accessoriesAndType;
    }
}
export default AccessoryGroupRequest;