
import { formatDotToNumber, formatNumberFixed3, formatNumberToDot } from '@/data/FunctionAll';
import Accessories, { getNewAcs } from '@/Model/Accessories';
import DataReport from '@/Model/DataReport';
import TotalGroup from '@/Model/TotalGroup'
import TotalItem from '@/Model/TotalItem';
import React, { useEffect } from 'react'
type Props = {
    totalGroup: TotalGroup,
    totalGroupIndex: number,
    listReport: DataReport[];
    handleUpdateTotalList: (totalItem: TotalGroup, totalGroupIndex: number) => void
}
export default function CreateBaoGiaTotalItem(props: Props) {
    const handleUpdate = (e: any, key: string, index: number) => {
        let value = e.target.value;
        if (key === "price") {
            value = value.replace(/\./g, "");
            value = parseFloat(value);
            if (value >= 1000000000) {
                return;
            }
        }
        let tempTotalGroup: TotalGroup = { ...props.totalGroup };
        let tempTotalItemm: TotalItem[] = tempTotalGroup.totalItem.map((item: TotalItem, ind) => {
            if (index === ind) {
                return { ...item, [key]: value };
            }
            return item;
        });
        tempTotalGroup = { ...tempTotalGroup, totalItem: tempTotalItemm };
        props.handleUpdateTotalList(tempTotalGroup, props.totalGroupIndex);
    }
    return (
        <div className='text-sm create-bg-total'>
            <div className='mb-2'>
                <span className='border-b border-gray-500 text-gray-400'>{props.totalGroup.name}</span>
            </div>
            {props.totalGroup.totalItem.map((item: TotalItem, index: number) =>
                <div key={index} className='bg-gray-900 w-full flex flex-row hover:bg-gray-800'>
                    <div className='w-1/12 p-2 flex text-center font-bold justify-center items-center'>{props.listReport.length + 1 + index}</div>
                    <div className='w-11/12 flex flex-row items-center py-1'>
                        <div className='w-4/12 p-2 text-center font-bold'>
                            <input
                                type="text"
                                className='outline-none  px-2 py-1 w-full bg-transparent border-b border-gray-300'
                                value={item.name}
                                onChange={e => handleUpdate(e, "name", index)}
                            />
                        </div>
                        <div className='w-1/12 p-2 text-center font-bold'>{item.code}</div>
                        <div className='w-2/12 p-2 text-center font-bold flex flex-col '>
                        </div>
                        <div className='w-2/12 p-2 text-center font-bold flex flex-col '>
                            <div className='flex flex-row space-x-2'>
                                <span className='w-1/2'></span>
                                <span className='w-1/2'>
                                    {formatNumberFixed3(item.totalQuantity)}
                                </span>
                            </div>
                        </div>
                        <div className='w-1/12 p-2 text-center font-bold'>
                            <input
                                type="text"
                                className='text-center outline-none py-1 w-full bg-transparent border-b border-gray-300'
                                value={formatNumberToDot(item.price)}
                                onChange={e => handleUpdate(e, "price", index)}
                            />
                        </div>
                        <div className='w-1/12 p-2 text-center font-bold'>
                            {formatNumberToDot(item.price * item.totalQuantity)}
                        </div>
                        <div className='w-1/12 p-2 text-center font-bold'></div>
                    </div>
                </div>
            )}

        </div>
    )
}
