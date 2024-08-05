import { Boxes, NotepadText, PackagePlus, SquareTerminal, TrendingUp, User } from "lucide-react";

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
        href:"/ganlenh",
        name:"Gán Lệnh",
        icon:SquareTerminal 
        ,select:"ganlenh"
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