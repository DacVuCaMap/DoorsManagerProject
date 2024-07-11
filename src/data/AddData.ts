import Accessories from "@/Model/Accessories";
import DoorNameSelect from "@/Model/DoorNameSelect";

export const dataSelect : DoorNameSelect[] = [
    {
      id: 0,
      name: "Cửa thép chống cháy",
      numberDoor: [
        "1 cánh",
        "2 cánh"
      ],
      type: [
        "Khóa tay gạt",
        "Thoát hiểm Panic",
        "Bản lề sàn"
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
        "2 cánh"
      ],
      type: [
        "Bản lề sàn"
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
  