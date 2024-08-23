import FireTest from "@/Model/FireTest"
import FireTestCondition from "@/Model/FireTestCondition"

type fireTestGroup = {
    id: any,
    fireTest: FireTest[]
}
// export const TransToFireTestCondition = (fireTestGroup: fireTestGroup[]): FireTestCondition[] => {
//     const rs: FireTestCondition[] = fireTestGroup.flatMap((parentItem: fireTestGroup) => 
//         parentItem.fireTest.map((item: FireTest) => {
//             let arr: string[] = item.name.split("./");
//             return new FireTestCondition();
//         })
//     );
//     return rs;
// }