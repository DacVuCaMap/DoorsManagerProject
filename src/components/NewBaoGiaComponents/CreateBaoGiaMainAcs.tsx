import GetPattern from '@/ApiPattern/GetPattern';
import { changePriceAndTempPrice, formatNumberFixed3, formatNumberToDot, formatNumberVN } from '@/data/FunctionAll';
import Accessories from '@/Model/Accessories'
import DataReport from '@/Model/DataReport';
import GroupAccessory from '@/Model/GroupAccessory';
import PriceReport from '@/Model/PriceReport';
import { ChevronDown, Trash2 } from 'lucide-react'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { ScaleLoader } from 'react-spinners';
type Props = {
    parentIndex: number;
    ReportItem: DataReport;
    name: string;
    handleChangeReport: (mainAcs: any, key: string) => void
}
export default function CreateBaoGiaMainAcs(props: Props) {
    const [currentSelectItem, setCurrentSelectItem] = useState<Accessories[]>([]);
    const [isOpen, setOpen] = useState(false);
    const [isLoading, setLoading] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const dataFetchedRef = useRef(false);
    useEffect(() => {
        const fetchData = async () => {
            if (dataFetchedRef.current) return;
            dataFetchedRef.current = true;
            setLoading(1)
            let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/get-acs-by-type?type=main";
            const response = await GetPattern(url, {});
            setLoading(0)
            if (response && response.value && response.value.length > 0 && response.value[0].accessories) {
                const list: any[] = response.value[0].accessories;
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
                        isCommand: false,
                        acsDes:""
                    }
                });
                setCurrentSelectItem(temp);
            }
        }
        fetchData();
    }, [])
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
        props.handleChangeReport(acs, "mainAcs");
        setOpen(false)
    }
    const handleChangeInput = (e: any, key: string) => {
        let value = e.target.value;

        if (key === "price" && props.ReportItem.priceReport.mainAcs) {
            console.log(value);
            let newMainAcs : Accessories = changePriceAndTempPrice({...props.ReportItem.priceReport.mainAcs},value);
            props.handleChangeReport(newMainAcs,"mainAcs");
            return;
        }
        value = value === "" ? 0 : value;
        if (props.ReportItem.priceReport.mainAcs) {
            let newMainAcs: Accessories = { ...props.ReportItem.priceReport.mainAcs, [key]: parseFloat(value) };
            props.handleChangeReport(newMainAcs, "mainAcs");
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
                                {props.ReportItem.priceReport.mainAcs ? props.ReportItem.priceReport.mainAcs.name : "-- Chọn phụ kiện chính --"}</div>
                            {isOpen &&
                                <div className='absolute bg-gray-500 shadow-lg w-full z-20 h-40 overflow-auto'>
                                    {currentSelectItem.map((item: Accessories, index: number) => (
                                        <div key={index} onClick={e => handleSelect(item)}
                                            className='hover:cursor-pointer truncate flex flex-col text-left px-2 py-2 w-full hover:bg-gray-700'>
                                            <span>{item.name}</span>
                                            <span className='text-xs text-gray-300'>{item.code}</span>
                                        </div>
                                    ))}
                                </div>
                            }
                            <div className='absolute right-0 top-1 text-black'><ChevronDown /></div>
                        </div>
                    }
                    {isLoading === 1 && <div className='w-full text-center'>
                        <ScaleLoader height={20} color='gray' />
                    </div>}
                </div>
                <div className='w-1/12 p-2 text-center'>
                    <span>{props.ReportItem.priceReport.mainAcs ? props.ReportItem.priceReport.mainAcs.code : ""}</span>
                </div>
                <div className='w-2/12 p-2 text-center flex flex-col '>
                    <div className='flex flex-row space-x-2 items-center'>
                        <div className='w-1/2'>
                            <span>{formatNumberFixed3(props.ReportItem.priceReport.width/1000)}</span>
                        </div>
                        <span>X</span>
                        <div className='w-1/2'>
                            <span>{formatNumberFixed3(props.ReportItem.priceReport.height/1000)}</span>
                        </div>
                    </div>
                </div>
                <div className='w-2/12 p-2 text-center flex flex-col '>
                    <div className='flex flex-row space-x-2 items-center'>
                        <div className='w-1/2'>
                            <span>{formatNumberFixed3(props.ReportItem.priceReport.width/1000*props.ReportItem.priceReport.height/1000)}</span>
                        </div>
                        <div className='w-1/2'>
                            <span>{ (props.ReportItem.priceReport.mainAcs?.totalQuantity)?.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
                <div className='overflow-auto w-1/12 p-2 text-center'>
                    <input onChange={e => handleChangeInput(e, "price")} value={props.ReportItem.priceReport.mainAcs?.tempPrice ?? 0} type="text" className='rounded px-2 py-1 w-full' />
                </div>
                <div className='overflow-auto w-1/12 pl-4 text-center '>
                    {props.ReportItem.priceReport.mainAcs ?
                        <span className='w-full'>{formatNumberVN(props.ReportItem.priceReport.mainAcs.price * props.ReportItem.priceReport.mainAcs.totalQuantity)}</span>
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
