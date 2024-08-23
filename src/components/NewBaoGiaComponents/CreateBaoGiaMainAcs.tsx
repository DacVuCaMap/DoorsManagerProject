import GetPattern from '@/ApiPattern/GetPattern';
import DataReport from '@/data/DataReport';
import { formatNumberFixed3, formatNumberToDot } from '@/data/FunctionAll';
import Accessories from '@/Model/Accessories'
import GroupAccessory from '@/Model/GroupAccessory';
import PriceReport from '@/Model/PriceReport';
import { ChevronDown, Trash2 } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ScaleLoader } from 'react-spinners';
type Props = {
    parentIndex: number;
    ReportItem: DataReport;
    name: string;
    handleSetAcsMain: (mainAcs: Accessories, key: string) => void
}
export default function CreateBaoGiaMainAcs(props: Props) {
    const [currentSelectItem, setCurrentSelectItem] = useState<Accessories[]>([]);
    const [isOpen, setOpen] = useState(false)
    const [isLoading, setLoading] = useState(0);
    const MainKey = "mainAccessory";
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(1)
            let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/get-list-group?name=" + props.name;
            const response = await GetPattern(url, {});
            setLoading(0)
            if (response && response.value && response.value.accessories) {
                const list: any[] = response.value.accessories;
                let temp: Accessories[] = list.map((item: any) => {
                    return {
                        id: item.id,
                        code: item.code,
                        name: item.name,
                        supplier: item.supplier,
                        totalQuantity: 0,
                        quantity: 0,
                        width: 0,
                        height: 0,
                        orgPrice: item.orgPrice,
                        lowestPricePercent: item.lowestPricePercent,
                        lowPercent: item.lowPercent.split(",").map(Number),
                        price: 0,
                        unit: item.unit,
                        status: false,
                        type: item.type,
                        isCommand: false
                    }
                });
                setCurrentSelectItem(temp);
            }
        }
        fetchData();
    }, [props.name])
    //ui ux
    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    }, []);
    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [handleClickOutside]);

    //select main acs
    const handleSelect = (acs: Accessories) => {
        props.handleSetAcsMain(acs, MainKey);
        setOpen(false)
    }
    const handleChangeInput = (e: any, key: string) => {
        let value = e.target.value;
        value = value === "" ? 0 : value;
        if (key==="price" && value!=0) {
            value = value.replace(/\./g, '');
        }
        if (props.ReportItem.mainAccessory) {
            let newMainAcs: Accessories = { ...props.ReportItem.mainAccessory, [key]: parseFloat(value) };
            props.handleSetAcsMain(newMainAcs, MainKey);
        }
    }
    return (
        <div className='flex flex-row px-2'>
            <div className='w-1/12 p-2 text-center font-bold'>{props.parentIndex + 1},1</div>
            <div className='w-11/12 flex flex-row items-center py-1 bg-gray-600'>
                <div className='w-4/12 p-2 text-center flex flex-row justify-center space-x-4'>
                    {(currentSelectItem.length > 0 && isLoading != 1) &&
                        <div className='w-3/4 relative' ref={containerRef}>
                            <div onClick={e => setOpen(true)} className='hover:cursor-pointer rounded px-2 py-1 w-full bg-gray-400 text-gray-800 text-left'>
                                {props.ReportItem.mainAccessory ? props.ReportItem.mainAccessory.name : "-- Chọn phụ kiện chính --"}</div>
                            {isOpen && <div className='absolute bg-gray-500 shadow-lg w-full z-20'>
                                {currentSelectItem.map((item: Accessories, index: number) => (
                                    <div key={index} onClick={e => handleSelect(item)}
                                        className='hover:cursor-pointer truncate flex flex-col text-left px-2 py-2 w-full hover:bg-gray-700'>
                                        <span>{item.name}</span>
                                        <span className='text-xs text-gray-300'>{item.code}</span>
                                    </div>

                                ))}
                            </div>}
                            <div className='absolute right-0 top-1 text-black'><ChevronDown /></div>
                        </div>
                    }
                    {isLoading === 1 && <div className='w-full text-center'>
                        <ScaleLoader height={20} color='gray' />
                    </div>}
                </div>
                <div className='w-1/12 p-2 text-center'>
                    <span>{props.ReportItem.mainAccessory ? props.ReportItem.mainAccessory.code : ""}</span>
                </div>
                <div className='w-2/12 p-2 text-center flex flex-col '>
                    <div className='flex flex-row space-x-2 items-center'>
                        <div className='w-1/2'>
                            <span>{formatNumberFixed3(props.ReportItem.mainAccessory?.width)}</span>
                        </div>
                        <span>X</span>
                        <div className='w-1/2'>
                            <span>{formatNumberFixed3(props.ReportItem.mainAccessory?.height)}</span>
                        </div>
                    </div>
                </div>
                <div className='w-2/12 p-2 text-center flex flex-col '>
                    <div className='flex flex-row space-x-2 items-center'>
                        <div className='w-1/2'>
                            <span>{formatNumberFixed3(props.ReportItem.mainAccessory?.quantity)}</span>
                        </div>
                        <div className='w-1/2'>
                            <span>{formatNumberFixed3(props.ReportItem.mainAccessory?.totalQuantity)}</span>
                        </div>
                    </div>
                </div>
                <div className='overflow-auto w-1/12 p-2 text-center'>
                    <input onChange={e => handleChangeInput(e, "price")} value={formatNumberToDot(props.ReportItem.mainAccessory?.price)} type="text" className='rounded px-2 py-1 w-full' />
                </div>
                <div className='overflow-auto w-1/12 pl-4 text-center '>
                    {props.ReportItem.mainAccessory ?
                        <span className='w-full'>{formatNumberToDot(props.ReportItem.mainAccessory.price * props.ReportItem.mainAccessory.totalQuantity)}</span>
                        :
                        <span className='w-full'>0</span>
                    }

                </div>
                <div className='w-1/12 p-2 flex flex-row justify-center space-x-2'>
                </div>
            </div>
        </div>
    )
}
