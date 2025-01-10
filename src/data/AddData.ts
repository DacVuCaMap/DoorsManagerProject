import Accessories, { getNewAcsWithName } from "@/Model/Accessories";
import DoorNameSelect from "@/Model/DoorNameSelect";
import TotalGroup from "@/Model/TotalGroup";
import TotalItem from "@/Model/TotalItem";

export const dataSelect : DoorNameSelect[] = [
    {
      id: 0,
      name: "Cửa thép chống cháy",
      numberDoor: [
        "1 cánh",
        "2 cánh",
        "2 cánh lệch"
      ],
      type: [
        "khóa tay gạt",
        "thoát hiểm panic",
        "bản lề sàn"
      ],
      code: [
        "EI15",
        "EI30",
        "EI45",
        "EI60",
        "EI90"
      ],
      material: "MgO"
    },
    {
      id: 1,
      name: "Cửa thép an toàn",
      numberDoor: [
        "1 cánh",
        "2 cánh",
        "2 cánh lệch"
      ],
      type: [
        "bản lề sàn"
      ],
      code: [
        "EI15",
        "EI30",
      ],
      material: "giấy tổ ong"
    }
  ];
export const dataAcs : any[] = [
  {
    id:"BL01",
    code:"BL01",
    name:"Bản lề lá âm dương Inox 304",
    supplier:"Novodoor",
  },
  {
    id:"BL02",
    code:"BL02",
    name:"Bản lề lá âm dương Inox 201",
    supplier:"Novodoor2",
  }
]



export const info1Select : string[] = ["0.8","1.0"];
export const info2Select : string[] = ["Sơn tĩnh điện 1 màu ","Sơn vân gỗ"];
const listToGetTotalGroup: any[] =[{name:"",code:"CPV",typeTotal:"main"},{name:"",code:"CPLD",typeTotal:"main"},{name:"",code:"CPLDPN",typeTotal:"PND"}
  ,{name:"",code:"CPLDBLS",typeTotal:"BLS"},{name:"Chi phí vận chuyển",code:"",typeTotal:""},{name:"Chi phí lắp đặt cửa thép an toàn",code:"",typeTotal:""}] 

export const totalGroup = (acsData:Accessories[]): TotalGroup[]   =>{
  let totalItemList : any[] = listToGetTotalGroup.map((item:any,index:number)=>{
    let acs : Accessories | undefined= acsData.find(child=>child.code===item.code);
    if (!acs) {
      acs=getNewAcsWithName(item.name);
    }
    return {acs:acs,typeTotal:item.typeTotal};
  })
  return [{id:"",totalItem:totalItemList,name:"Chi phí lắp đặt vận chuyển"}];
} 
  