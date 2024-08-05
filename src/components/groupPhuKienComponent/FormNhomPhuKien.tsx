"use client"
import { dataSelect } from '@/data/AddData';
import Accessories from '@/Model/Accessories';
import React, { use, useEffect, useState } from 'react'
import BaoGiaSearchPhuKien from '../baogiaComponents/BaoGiaSearchPhuKien';
import GetPattern from '@/ApiPattern/GetPattern';
import { genNumberByTime } from '@/data/FunctionAll';
import { Boxes, Trash2 } from 'lucide-react';
import { ScaleLoader } from 'react-spinners';
import PostPattern from '@/ApiPattern/PostPattern';
import GroupAccessory from '@/Model/GroupAccessory';
import AcsAndType from '@/Model/AcsAndType';
import AccessoryGroupRequest from '@/Request/AccessoryGroupRequest';

type Props = {
    cmdMain: string;
    refreshTrigger: number
    setRefreshTrigger: (trigger: number) => void;
}
export default function GanlenhFormAdd(props: Props) {
    const [curGroup, setCurGroup] = useState<GroupAccessory>(new GroupAccessory("", "", []));
    const [acsData, setAcsData] = useState<Accessories[]>([]);
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        let postArrays: any = curGroup.accessoriesAndType.map((item: AcsAndType, index) => {
            return { id: item.accessories.id, type: item.type };
        });
        let postData: AccessoryGroupRequest = { name: curGroup.name, accessoriesAndType:postArrays}
        try {
            let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/add-group";
            const response = await PostPattern(url,postData,{})
            console.log(postData);
            console.log(response);
        } catch (error) {
            console.log(error)
        }
    }
    // update when select item in list
    useEffect(()=>{
        console.log(props.cmdMain)
        if (props.cmdMain!="" && props.cmdMain.length>0) {
            const fetchData = async () =>{
                setCurGroup({...curGroup,accessoriesAndType:[]})
                setLoading(true);
                let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/get-list-group?name="+props.cmdMain;
                const response = await GetPattern(url,{});
                if (response && response.value ) {
                    const arr : AcsAndType[] = response.value.relations.map((item:any,index:number)=>{
                        return {type:item.type,accessories:acsData.find(acs=>acs.id===item.accessoriesId)}
                    })
                    let newItem = new GroupAccessory(response.value.id,response.value.name,arr)
                    console.log(newItem);
                    setLoading(false);
                    setCurGroup(newItem);
                }
            }
            
            fetchData();
           
        }

    },[props.cmdMain])
    //cap nhap data accessories có sẵn
    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/list?page=0&size=100&search";
                const response = await GetPattern(url, {});
                if (response.content && Array.isArray(response.content)) {
                    const list: any[] = response.content;
                    let newAcs: Accessories[] = list.map((item: any, index: number) => {
                        return new Accessories(
                            item.id,
                            item.code,
                            item.name,
                            item.supplier,
                            0,
                            0,
                            0,
                            0,
                            item.orgPrice,
                            item.lowestPricePercent,
                            0,
                            item.unit,
                            true
                        );
                    });
                    // Kiểm tra kết quả
                    setAcsData(newAcs);
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchData();
        // Thiết lập interval
        const intervalId = setInterval(fetchData, 5 * 60 * 1000);
        // Trả về hàm clean up
        return () => {
            clearInterval(intervalId);
        };
    }, [])
    let tempAcs = new Accessories(genNumberByTime(), "", "", "", 0, 0, 0, 0, 0, 0, 0, "Bộ", false);
    const selectAccessories = (acsId: any, newAcs: Accessories, productId: any) => {
        const accessoriesAndType = curGroup.accessoriesAndType;
        const newItem: AcsAndType = { accessories: newAcs, type: "s" };
        accessoriesAndType.push(newItem);
        setCurGroup({ ...curGroup, accessoriesAndType: accessoriesAndType });
    }
    const handleDel = (index: number) => {
        const accessoriesAndTypeUpdate = curGroup.accessoriesAndType.filter((item: AcsAndType, ind) => ind != index);
        setCurGroup({ ...curGroup, accessoriesAndType: accessoriesAndTypeUpdate })
    }
    const handleSelectType = (e: any, index: number) => {
        let val = e.target.value;
        let acsAndTypeUpdated = curGroup.accessoriesAndType[index];
        acsAndTypeUpdated = { ...acsAndTypeUpdated, type: val };
        setCurGroup((parentItem: GroupAccessory) => {
            return {
                ...parentItem, accessoriesAndType: parentItem.accessoriesAndType.map((item: AcsAndType, ind) => {
                    if (ind === index) {
                        return acsAndTypeUpdated;
                    }
                    return item;
                })
            }
        })
    }
    const handleChangeInputName = async(e:any)=>{
        const value = e.target.value;
        setCurGroup({...curGroup,name:value});
        setLoading(true)
        let url = process.env.NEXT_PUBLIC_API_URL+"/api/accessories/get-list-group?name="+value;
        const response = await GetPattern(url,{});
        setLoading(false)
        console.log(response)
        if (response && response.value && response.value.relations) {
            const arr : AcsAndType[] = response.value.relations.map((item:any,index:number)=>{
                return {type:item.type,accessories:acsData.find(acs=>acs.id===item.accessoriesId)}
            })
            setCurGroup({name:value,id:response.value.id,accessoriesAndType:arr})
        }
    }
    return (
        <div className='w-full h-full ganlenh relative'>
            <div className='flex flex-row space-x-2 text-gray-600'>
                <Boxes />
                <h2 className='font-bold text-lg mb-2'>Form gán nhóm phụ kiện</h2>
            </div>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="" className='text-sm text-gray-400'>Tên nhóm cửa</label>
                <input value={curGroup.name} onChange={e => handleChangeInputName(e)} type="text" className='bg-white w-full pt-2 text-base text-gray-600 mb-4 border-b outline-none border-gray-400' />
                <div className='flex flex-col mb-2'>
                    <BaoGiaSearchPhuKien acsData={acsData} acs={tempAcs} productId={0} selectAccessories={selectAccessories} />
                </div>


                {curGroup.accessoriesAndType.length > 0 &&
                    <div className="w-full max-w-md p-2 bg-white border border-gray-200 rounded-lg shadow">
                        <div className="flow-root">
                            <ul role="list" className="divide-y divide-gray-200">
                                <li className="py-3">
                                    <div className="flex items-center">
                                        <div className="flex-1 min-w-0 ms-4">
                                            <p className="text-base font-semibold text-gray-900 truncate">Thông tin</p>
                                        </div>
                                        <div className="inline-flex items-center w-20 text-base font-semibold text-gray-900">Loại</div>
                                    </div>
                                </li>
                                {curGroup.accessoriesAndType.map((item: AcsAndType, index) => (
                                    <li key={index} className="py-3 sm:py-4 relative group">
                                        <div className="flex items-center">
                                            <div className="flex-1 min-w-0 ms-4">
                                                <p className="text-sm truncate font-bold">{item.accessories.code}</p>
                                                <p className="text-xs text-gray-600 truncate pr-2">{item.accessories.name}</p>
                                            </div>
                                            <div className="w-20 items-center text-base font-semibold text-gray-900 flex flex-row space-x-2">
                                                <select onChange={e => handleSelectType(e, index)} value={item.type} name="" id="" className='text-sm text-gray-600'>
                                                    <option value="s">Hiện</option>
                                                    <option value="h">Ẩn</option>
                                                </select>
                                                <button type='button' className='text-red-600' onClick={e => handleDel(index)}><Trash2 /></button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                }
                
                {loading && <div className='w-full text-center py-20'>
                    <ScaleLoader color='gray' />
                </div>}
                {curGroup.accessoriesAndType.length > 0 ? <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full my-2'>Lưu</button>
                    : <div className='h-14'></div>}
            </form>
            {(curGroup.name == "" && curGroup.accessoriesAndType.length==0) ?
                <div className='bg-white absolute h-32 w-full top-24 justify-center flex items-center'>
                    <h2 className='text-gray-600 font-bold text-lg' >Nhập tên nhóm phụ kiện</h2>
                </div>
                : ""
            }
        </div>
    )
}
