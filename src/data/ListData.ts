import { Boxes, NotepadText, PackagePlus, ShieldCheck, SquareTerminal, TrendingUp, User } from "lucide-react";

export const listMenu = [
    {
        href:"/baogia/add",
        name:"Báo Giá",
        icon:NotepadText 
        ,select:"baogia"
    },
    {
        href:"/phukien/list?page=0&size=100&search",
        name:"Phụ kiện",
        icon:PackagePlus
        ,select:"phukien"
    },
    {
        href:"/maucua",
        name:"Mẫu cửa",
        icon:SquareTerminal 
        ,select:"maucua"
    },
    {
        href:"/gannhomphukien",
        name:"Nhóm phụ kiện",
        icon:Boxes
        ,select:"gannhomphukien"
    },
    {
        href:"#",
        name:"Tài Khoản",
        icon:User
        ,select:"#"
    },
    {
        href:"#",
        name:"Thống kê",
        icon:TrendingUp   
        ,select:"#"
    }
]
export const listColor = [
    {id:0,color:"bg-blue-600"},{id:1,color:"bg-violet-700"},{id:2,color:"bg-green-700"},{id:3,color:"bg-pink-700"}
]

export const listEI = ["15","30","45","60","70","90"]
export const listTypeTotal=[{value:0,des:"cannot change"},{value:1,des:"can change"}]
export const listBgUnit =["bộ","chuyến","gói","m²"] 