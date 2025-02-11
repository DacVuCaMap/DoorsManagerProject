import GetListData from '@/ApiPattern/GetListData';
import { formatNumberToDot, formatNumberVN } from '@/data/FunctionAll';
import { notFound, usePathname, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import PaginationComponent from '../PaginationComponent';
import { ScaleLoader } from 'react-spinners';
import { Trash2 } from 'lucide-react';
import { Button, message, Popconfirm } from 'antd';
import DeleteMapping from '@/ApiPattern/DeleteMapping';
export default function PhukienList() {
    const pathName = usePathname();
    const searchParam = useSearchParams();
    const [data, setData] = useState<any[]>([]);
    const [maxPage, setMaxPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [refresh,setRefresh] = useState(1);
    let page = searchParam?.get('page') || '0';
    let size = searchParam?.get('size') || '15';
    let search = searchParam?.get('search') || '';
    useEffect(() => {
        const fecthData = async () => {
            setLoading(true);
            try {
                const response: any = await GetListData("accessories", page, size, search);
                if (response?.list && response?.maxPage) {
                    setData(response.list);
                    setMaxPage(response.maxPage);
                }
                setLoading(false);
            } catch (error) {
                notFound();
            }
        }
        fecthData();
    }, [page, size, search,refresh])
    const getLowPercent = (str: string, index: number) => {
        let arr = str.split(',');
        let numArr = arr.map(parseFloat);
        return (numArr[index] * 100).toFixed(2);
    }
    const handleDeleteAcs = async (item:any)=>{
        console.log(item);
        const url = process.env.NEXT_PUBLIC_API_URL+`/api/accessories/delete/${item.id}`;
        const response =  await DeleteMapping(url,{});
        console.log(response);
        if (response && response.status && response.status===200) {
            message.success(response.message);
            setRefresh(prev=>prev+1);
        }
        else{
            message.error("Xóa không thành công")
        }

    }
    return (
        <div className="max-h-[500px] overflow-auto phukien-list bg-gray-800">
            <table className="table-auto w-full">
                <thead className='bg-blue-700 border-b-2 text-white border-black'>
                    <tr>
                        <th scope="col" className="sticky top-0 bg-gray-900 text-gray-300 text-sm z-10 border-black">Mã</th>
                        <th scope="col" className="sticky top-0 bg-gray-900 text-gray-300 text-sm z-10 border-black">Tên vật tư</th>
                        <th scope="col" className="sticky top-0 bg-gray-900 text-gray-300 text-sm z-10 border-black">Đơn vị</th>
                        <th scope="col" className="sticky top-0 bg-gray-900 text-gray-300 text-sm z-10 border-black">Đơn giá</th>
                        <th scope="col" className="sticky top-0 bg-gray-900 text-gray-300 text-sm z-10 border-black">HSCP</th>
                        <th scope="col" className="sticky top-0 bg-gray-900 text-gray-300 text-sm z-10 border-black">HSCP&lt;10</th>
                        <th scope="col" className="sticky top-0 bg-gray-900 text-gray-300 text-sm z-10 border-black">HSCP&lt;20</th>
                        <th scope="col" className="sticky top-0 bg-gray-900 text-gray-300 text-sm z-10 border-black">HSCP&lt;30</th>
                        <th scope="col" className="sticky top-0 bg-gray-900 text-gray-300 text-sm z-10 border-black">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ?
                        <tr>
                            <td colSpan={8}>
                                <div className='w-full h-full text-center py-20'>
                                    <ScaleLoader className='text-2xl' color='gray' />
                                </div>
                            </td>
                        </tr>
                        :
                        (
                            data.map((item: any, index) => (
                                <tr key={index} className={`${index % 2 === 0 ? "odd:bg-gray-500 even:bg-gray-700 h-16" : "odd:bg-white even:bg-gray-700 h-16"} text-gray-300`}>
                                    <td className='px-4 py-2 text-center font-bold'>{item.code}</td>
                                    <td className='py-2'>{item.name}</td>
                                    <td className='px-4 py-2 text-center'>{item.unit}</td>
                                    <td>{formatNumberVN(item.orgPrice)}</td>
                                    <td className='px-4 py-2 text-center'>{item.lowestPricePercent * 100}%</td>
                                    <td className='px-4 py-2 text-center'>{getLowPercent(item.lowPercent, 0)}%</td>
                                    <td className='px-4 py-2 text-center'>{getLowPercent(item.lowPercent, 1)}%</td>
                                    <td className='px-4 py-2 text-center'>{getLowPercent(item.lowPercent, 2)}%</td>
                                    <td className='px-4 py-2 text-center'>
                                        {/* <button className='p-2'><Trash2 /></button> */}
                                        <Popconfirm
                                            title="Xóa phụ kiện"
                                            description={`Bạn có chắc muốn xóa `}
                                            icon={<Trash2 color='red' size={20}/>}
                                            onConfirm={e=>handleDeleteAcs(item)}
                                        >
                                            <Button danger>xóa</Button>
                                        </Popconfirm>
                                    </td>
                                </tr>

                            ))
                        )}
                </tbody>
            </table>
        </div>

    )
}
