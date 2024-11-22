import React, { useEffect, useState } from 'react'
import { Button, message } from 'antd';
import { DoorClosed, Plus, Trash } from 'lucide-react';
import PostPattern from '@/ApiPattern/PostPattern';
import BaoGiaSearchPhuKien from '../baogiaComponents/BaoGiaSearchPhuKien';
import Accessories from '@/Model/Accessories';
import GetPattern from '@/ApiPattern/GetPattern';
import { genNumberByTime, LoadAccesoryGroupNoAcs } from '@/data/FunctionAll';
import InputSearchAcs from '../SearchingComponents/InputSearchAcs';
import '../MaucuaComponent/MauCuaEdit.css';
import InputSearchAccessoryGroup from '../SearchingComponents/InputSearchAccessoryGroup';
import GroupAccessory from '@/Model/GroupAccessory';

export default function MauCuaEditComponent() {
    const [listMainAcs, setListMianAcs] = useState([]);
    const [listAcsGroup, setListAcsGroup] = useState<GroupAccessory[]>([]);
    const [curAcsGroup, setCurAcsGroup] = useState<GroupAccessory[]>([]);
    const [listMainGlass,setListMainGlass] =  useState([]);
    let curAcs = new Accessories(genNumberByTime(), "", "", "", 0, 0, 0, 0, 0, 0, 0, "Bộ", false);
    useEffect(() => {
        const fetchData = async () => {
            const url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/get-accessories-with-list-group-id";
            const response = await PostPattern(url, [1], {});
            if (response.value && response.value[0] && response.value[0].accessories) {
                console.log(response.value[0].accessories)
                setListMianAcs(response.value[0].accessories)
            }
            else {
                message.error("false");
            }
        }
        fetchData();
        const fetchAcsGlass = async () =>{
            const url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/get-accessories-with-list-group-id";
            const response = await PostPattern(url, [4], {});
            if (response.value && response.value[0] && response.value[0].accessories) {
                console.log(response.value[0].accessories)
                setListMainGlass(response.value[0].accessories)
            }
            else {
                message.error("false");
            }
        }
        fetchAcsGlass();
    }, [])
    useEffect(() => {
        const fetchAcsGroup = async () => {
            const result: GroupAccessory[] = await LoadAccesoryGroupNoAcs();
            setListAcsGroup(result); // Set the resolved result to the state
        };
        fetchAcsGroup();
    }, [])
    const handleSetAcsGroup = (groupItem: GroupAccessory) => {
        console.log(groupItem);
        const listTemp = [...curAcsGroup];
        const tempGroup : GroupAccessory= {...groupItem,quantity:1};
        const exist = listTemp.find(item=>item.id===groupItem.id);
        if (exist) {
            message.error("Đã tồn tại");
            return;
        }
        listTemp.push(tempGroup);
        setCurAcsGroup(listTemp);
    }
    const handleDelete = (index:number)=>{
        const listTemp = curAcsGroup.filter((item,ind)=>ind!=index);
        setCurAcsGroup(listTemp);
    }
    const handleChangeQuantity = (index:number,e:any)=>{
        let value = e.target.value;
        console.log(value);
        value = value ? value : 0;
        if (value<0) {
            return;
        }
        console.log(value);

        const listTemp = curAcsGroup.map((item,ind)=>{
            if (index===ind) {
                return {...item,quantity:parseFloat(value)}
            }
            return item;
        })
        console.log(listTemp);
        setCurAcsGroup(listTemp);
    }
    return (
        <div className='bg-gray-800 w-[500px] h-[500px] rounded-lg flex flex-col py-4 px-4 maucua-edit'>
            <div className='flex flex-row space-x-2 text-gray-300'>
                <DoorClosed />
                <h2 className='font-bold text-lg mb-2'>Form Mẫu cửa</h2>
            </div>
            <div>
                <form className='flex flex-col space-y-2'>
                    <div>
                        <label htmlFor="" className='text-sm text-gray-400'>Tên Mẫu Cửa</label>
                        <input value={""} type="text" placeholder='Nhập tên mẫu cửa....' className='bg-gray-600 w-full pt-2 text-base text-gray-300 px-2 mb-4 border-b outline-none border-gray-400' />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-sm text-gray-400'>Vật liệu chính</label>
                        <select name="" id="" className='text-sm text-gray-300  bg-gray-600 rounded p-2'>
                            {listMainAcs.map((list: any, index) => (
                                <option key={index} value="normal">{list.code}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-sm text-gray-400'>Nhóm phụ kiện</label>
                        <div className='flex flex-col border border-gray-600 space-y-2 px-4 py-2 rounded justify-center items-center'>
                            <InputSearchAccessoryGroup condition='normal doorsill' accessoryGroupData={listAcsGroup} handleSetAcsGroup={handleSetAcsGroup} index={0} />

                            {curAcsGroup.map((acsGroup: GroupAccessory, index) => (
                                <div key={index} className='flex flex-row justify-center items-center space-x-2 w-full border-t border-gray-500 text-gray-400'>
                                    <span className='w-full'>{acsGroup.name}</span>
                                    <input type="number" className='w-16 text-center rounded' value={acsGroup.quantity===0 ? "" : acsGroup.quantity} onChange={e=>handleChangeQuantity(index,e)}/>
                                    <button type='button' onClick={e=>handleDelete(index)} className='hover:bg-gray-700 p-2'><Trash size={18} /></button>
                                </div>
                            ))}
                        </div>

                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-sm text-gray-400'>Vật liêu kính</label>
                        <select name="" id="" className='text-sm text-gray-300  bg-gray-600 rounded p-2'>
                            {listMainGlass.map((list: any, index) => (
                                <option key={index} value="normal">{list.name}</option>
                            ))}
                        </select>
                    </div>
                </form>
            </div>
        </div>
    )
}
