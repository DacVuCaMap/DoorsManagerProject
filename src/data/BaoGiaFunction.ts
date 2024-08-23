import FireTest from "@/Model/FireTest"
import FireTestCondition from "@/Model/FireTestCondition"

type fireTestGroup = {
    id: any,
    fireTest: FireTest[]
}
export const TransToFireTestCondition = (fireTestGroup: fireTestGroup[]): FireTestCondition[] => {
    const rs: FireTestCondition[] = fireTestGroup.flatMap((parentItem: fireTestGroup) => 
        parentItem.fireTest.map((item: FireTest) => {
            let arr: string[] = item.name.split("./");
            return new FireTestCondition(
                item.doorNameSelectId, 
                arr[0], 
                arr[1], 
                arr[2],
                item.thickness, 
                parseFloat(arr[3]), 
                parseFloat(arr[4]), 
                item.type, 
                parentItem.id, 
                item.id
            );
        })
    );
    return rs;
}