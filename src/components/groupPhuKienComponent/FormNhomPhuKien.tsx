"use client"
import { dataSelect } from '@/data/AddData';
import Accessories from '@/Model/Accessories';
import React, { use, useCallback, useEffect, useState } from 'react'
import BaoGiaSearchPhuKien from '../baogiaComponents/BaoGiaSearchPhuKien';
import GetPattern from '@/ApiPattern/GetPattern';
import { genNumberByTime } from '@/data/FunctionAll';
import { Boxes, Check, CircleAlert, Trash2 } from 'lucide-react';
import { BarLoader, ScaleLoader } from 'react-spinners';
import PostPattern from '@/ApiPattern/PostPattern';
import GroupAccessory from '@/Model/GroupAccessory';
import AcsAndType from '@/Model/AcsAndType';
import AccessoryGroupRequest from '@/Request/AccessoryGroupRequest';
import { debounce } from 'lodash';
type Props = {
    cmdMain: string;
    refreshTrigger: number
    setRefreshTrigger: (trigger: number) => void;
}
export default function GanlenhFormAdd(props: Props) {
    const [curGroup, setCurGroup] = useState<GroupAccessory>(new GroupAccessory("", "", [], "normal"));
    const [acsData, setAcsData] = useState<Accessories[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [failed, setFailed] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        let postArrays: number[] = curGroup.accessoriesAndType.map((item: AcsAndType) => {
            return parseFloat(item.accessories.id);
        });
        let postData: any = { id: curGroup.id, name: curGroup.name, type: curGroup.type, accessoriesIdLong: postArrays }
        try {
            let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/add-group";
            setLoadingSubmit(true)
            const response = await PostPattern(url, postData, {})
            props.setRefreshTrigger(props.refreshTrigger + 1);
            console.log(postData);
            console.log(response);
            setLoadingSubmit(false);
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
            }, 5000); // 5000 milliseconds = 5 seconds
        } catch (error) {
            console.log(error)
        }
    }
    // update when select item in list
    useEffect(() => {
        console.log(props.cmdMain)
        if (props.cmdMain != "" && props.cmdMain.length > 0) {
            const fetchData = async () => {
                setCurGroup({ ...curGroup, name: props.cmdMain, accessoriesAndType: [] })
                setLoading(true);
                let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/get-list-group?name=" + props.cmdMain;
                const response = await GetPattern(url, {});
                if (response && response.value) {
                    const arr: AcsAndType[] = response.value.accessories.map((item: any, index: number) => {
                        return { type: "", accessories: acsData.find(acs => acs.id === item.id) }
                    })
                    let newItem = new GroupAccessory(response.value.id, response.value.name, arr, response.value.type)
                    // console.log(newItem)
                    setLoading(false);
                    setCurGroup(newItem);
                }
            }
            fetchData();

        }

    }, [props.cmdMain])
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
    const handleSelectType = (e: any) => {
        let val = e.target.value;
        setCurGroup({ ...curGroup, type: val })
    }
    const handleChangeInputName = async (e: any) => {

        const value = e.target.value;
        setCurGroup({ ...curGroup, accessoriesAndType: [], name: value });
        debouncedSearch(value,acsData);
    }
    const debouncedSearch = useCallback(
        debounce(async (value: string,listAcs:Accessories[]) => {
            setLoading(true)
            let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/get-list-group?name=" + value;
            const response = await GetPattern(url, {});
            console.log(response)
            setLoading(false)
            if (response && response.value && response.value.accessories) {
                const arr: AcsAndType[] = response.value.accessories.map((item: any, index: number) => {
                    return { type: item.type, accessories: listAcs.find(acs => acs.id === item.id) }
                })
                setCurGroup({ type: response.value.type, name: value, id: response.value.id, accessoriesAndType: arr })
            }
        }, 300),
        []
    );
    return (
        <div className='w-full h-full ganlenh relative'>
            <div className='flex flex-row space-x-2 text-gray-300'>
                <Boxes />
                <h2 className='font-bold text-lg mb-2'>Form gán nhóm phụ kiện</h2>
            </div>
            <form action="" onSubmit={handleSubmit}>
                <label htmlFor="" className='text-sm text-gray-400'>Tên nhóm phụ kiện</label>
                <input value={curGroup.name} onChange={e => handleChangeInputName(e)} type="text" placeholder='Nhập tên nhóm cửa....' className='bg-gray-600 w-full pt-2 text-base text-gray-300 px-2 mb-4 border-b outline-none border-gray-400' />
                <div className='flex flex-col mb-2'>
                    <BaoGiaSearchPhuKien acsData={acsData} acs={tempAcs} productId={0} selectAccessories={selectAccessories} />
                </div>
                <div className='flex flex-col mb-2'>
                    <span className='text-xs text-gray-400'>
                        Kiểu
                    </span>
                    {!loading ? <select value={curGroup.type} onChange={e => handleSelectType(e)} name="" id="" className='text-sm text-gray-300  bg-gray-600 rounded p-2'>
                        <option value="normal">Phụ kiện thường (normal)</option>
                        <option value="main">Phụ kiện chính (main)</option>
                        <option value="glass">Kính (glass)</option>
                        <option value="nep">Nẹp kính (nep)</option>
                        <option value="doorsill">DoorSill</option>
                        <option value="cost">Chi phí</option>
                    </select>
                        :
                        <div className='w-full text-center'>
                            <ScaleLoader color='gray' />
                        </div>
                    }
                </div>

                {curGroup.accessoriesAndType.length > 0 &&
                    <div className="w-full max-w-md p-2 bg-gray-600 rounded-lg shadow">
                        <div className="flow-root">
                            <ul role="list" className="divide-y divide-gray-200">
                                <li className="py-3">
                                    <div className="flex items-center">
                                        <div className="flex-1 min-w-0 ms-4">
                                            <p className="text-base font-semibold text-black truncate">Thông tin</p>
                                        </div>
                                        <div className="inline-flex items-center w-20 text-base font-semibold text-gray-900"></div>
                                    </div>
                                </li>
                                {curGroup.accessoriesAndType.map((item: AcsAndType, index) => (
                                    <li key={index} className="py-3 sm:py-4 relative group">
                                        <div className="flex items-center">
                                            <div className="flex-1 min-w-0 ms-4">
                                                <p className="text-sm truncate text-gray-300">{item.accessories.name}</p>
                                                <p className="text-xs text-gray-400 truncate pr-2">{item.accessories.code}</p>
                                            </div>
                                            <div className="w-20 items-center text-base font-semibold text-gray-900 flex flex-row space-x-2">
                                                <button type='button' className='text-red-600 bg-white p-2 rounded' onClick={e => handleDel(index)}><Trash2 /></button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                }

                {loading && <div className='w-full text-center py-14'>
                    <ScaleLoader color='gray' />
                </div>}
                {(curGroup.accessoriesAndType.length > 0 && !success) ? <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full my-2'>{loadingSubmit ? <BarLoader className='w-full' /> : "Lưu"}</button>
                    : <div className='h-14'></div>}
                {success && <div className='flex flex-col justify-center items-center'><Check size={40} className=' p-2 bg-green-400 rounded-full text-white' /> <span className='text-gray-500 font-semibold'>success</span></div>}
            </form>
            {(curGroup.name == "" && curGroup.accessoriesAndType.length == 0) ?
                <div className='bg-gray-800 absolute h-40 w-full top-24 justify-center flex items-center'>
                    <h2 className='text-gray-500 font-bold text-lg' >Nhập tên nhóm phụ kiện</h2>
                </div>
                : ""
            }
        </div>
    )
}
