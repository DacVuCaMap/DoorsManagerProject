"use client"
import GetPattern from '@/ApiPattern/GetPattern';
import { message } from 'antd';
import { error } from 'console';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { ScaleLoader } from 'react-spinners';

export default function MauCuaListComponent() {
    const [listDoorModel, setListDoorModel] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refresh, setRefresh] = useState(1);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const url = process.env.NEXT_PUBLIC_API_URL + "/api/door-model/list";
            const response = await GetPattern(url, {});
            setLoading(false);
            if (response && Array.isArray(response) && response.length > 0 && response[0].name) {
                console.log(response);
                setListDoorModel(response);
            }
            else {
                message.error("loading list fail")
            }
        }
        fetchData();
    }, [refresh])

    const handleDelete = async (id: any) => {
        const url = process.env.NEXT_PUBLIC_API_URL + "/api/door-model/delete/" + id;
        const response = await GetPattern(url, {});
        if (response && response.status === 200) {
            console.log(response);
            setRefresh(prev => prev + 1);
        }
        else if (response && response.status === 400 && response.message) {
            message.error(response.message)
        }
        else {
            message.error("server fail");
        }
    }
    return (
        <div className='bg-gray-800 w-[600px] h-[550px] rounded-lg'>
            <table className='w-full'>
                <thead>
                    <tr>
                        <th className='sticky top-0 bg-blue-800 text-white z-10'></th>
                        <th className='sticky top-0 bg-blue-800 text-white z-10 py-2'>Tên mẫu cửa</th>
                        <th className='sticky top-0 bg-blue-800 text-white z-10'></th>
                    </tr>
                </thead>
                <tbody>
                    {loading && <tr>
                        <td colSpan={3}>
                            <div className='py-20 text-center'>
                                <ScaleLoader color='gray' />
                            </div>
                        </td>
                    </tr>}
                    {listDoorModel?.map((item: any, index) => (
                        <tr key={index} className={`${index % 2 != 0 ? "bg-gray-800" : "bg-gray-700"} text-gray-300 hover:shadow-xl hover:bg-gray-200 hover:text-black`}>
                            <td className='text-center'>{index + 1}</td>
                            <td className=' text-center'>
                                <div className='hover:cursor-pointer py-4 flex flex-col px-2 h-full w-full'>

                                    <div className='flex flex-col'>
                                        <span className='font-semibold '>{item.name}</span>
                                        <span className='font-mono text-gray-400 '>{item.shortName ? item.shortName : "unknow"}</span>
                                    </div>
                                    <span className='leading-3 text-xs text-gray-400'>{item.type}</span>
                                </div>
                            </td>
                            <td className='text-center text-red-600 w-20'><button onClick={e => handleDelete(item.id)}><Trash2 /></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
