import Accessories from "@/Model/Accessories";
import DoorNameSelect from "@/Model/DoorNameSelect";

export const dataSelect : DoorNameSelect[] = [
    {
      id: 0,
      name: "Cửa thép chống cháy",
      numberDoor: [
        "1 cánh",
        "2 cánh"
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
        "2 cánh"
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

export const info1Select : number[] = [0.8,1.0];
export const info2Select : string[] = ["Sơn tĩnh điện 1 màu ","Sơn vân gỗ"];
  