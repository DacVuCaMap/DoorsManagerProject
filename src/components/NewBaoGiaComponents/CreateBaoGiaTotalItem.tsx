import DataReport from '@/data/DataReport';
import { formatDotToNumber, formatNumberFixed3, formatNumberToDot } from '@/data/FunctionAll';
import Accessories, { getNewAcs } from '@/Model/Accessories';
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
    const handleTotalQuantity = (itemIndex: number) : TotalItem => {
        let tot = 0;
        let tempAcs: Accessories = getNewAcs();
        const totalItem = props.totalGroup.totalItem[itemIndex];
        if (totalItem.typeTotal === "main") {
            // tong main acs
            tot = props.listReport.reduce((sum, item) => {
                if (item.mainAccessory) {
                    return sum + item.mainAccessory.totalQuantity
                }
                else { return sum }
            }, 0)
            tempAcs = { ...totalItem.acs, totalQuantity: tot };
        }
        else if (totalItem.typeTotal === "" || !totalItem.typeTotal) {
            //giu nguyen
            tempAcs = { ...totalItem.acs };
        }
        else {
            tot = props.listReport.reduce((sum, item) => {
                let check: Accessories | undefined = item.priceReport.accessories.find(acs => acs.code === totalItem.typeTotal);
                if (item.mainAccessory && check) {
                    return sum + item.mainAccessory.totalQuantity
                }
                else { return sum }

            }, 0)
            tempAcs = { ...totalItem.acs, totalQuantity: tot };
        }
        return { ...totalItem, acs: tempAcs };
    }

    const handleUpdateTotalItem = (totalItem: TotalItem, itemIndex: number) => {
        let temp: TotalItem[] = [...props.totalGroup.totalItem];
        temp[itemIndex] = totalItem;
        props.handleUpdateTotalList({ ...props.totalGroup, totalItem: temp }, props.totalGroupIndex);
    }
    const handleChangeInputInsideAcs = (value: any, key: string, totalItem: TotalItem, itemIndex: number) => {
        if (key === "totalQuantity" || key === "price") {
            value = value === "" ? 0 : value;
            value = key === "price" ? formatDotToNumber(value) : parseFloat(value);
        }
        let tempAcs: Accessories = { ...totalItem.acs, [key]: value }
        handleUpdateTotalItem({ ...totalItem, acs: tempAcs }, itemIndex);
    }

    //update totalQuantity
    useEffect(()=>{
        let totalItemList: TotalItem[] = [...props.totalGroup.totalItem];
        props.totalGroup.totalItem.forEach((item:TotalItem,index:number)=>{     
            totalItemList[index] = handleTotalQuantity(index);
        })
        props.handleUpdateTotalList({ ...props.totalGroup, totalItem: totalItemList },props.totalGroupIndex)
    },[props.listReport])
    return (
        <div className='text-sm'>
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
                                value={item.acs.name}
                                onChange={e => handleChangeInputInsideAcs(e.target.value, "name", item, index)}
                            />
                        </div>
                        <div className='w-1/12 p-2 text-center font-bold'>{item.acs.code}</div>
                        <div className='w-2/12 p-2 text-center font-bold flex flex-col '>
                        </div>
                        <div className='w-2/12 p-2 text-center font-bold flex flex-col '>
                            <div className='flex flex-row space-x-2'>
                                <span className='w-1/2'></span>
                                <span className='w-1/2'>
                                    {formatNumberFixed3(item.acs.totalQuantity)}
                                </span>
                            </div>
                        </div>
                        <div className='w-1/12 p-2 text-center font-bold'>
                            <input
                                type="text"
                                className='text-center outline-none py-1 w-full bg-transparent border-b border-gray-300'
                                value={formatNumberToDot(item.acs.price)}
                                onChange={e => handleChangeInputInsideAcs(e.target.value, "price", item, index)}
                            />
                        </div>
                        <div className='w-1/12 p-2 text-center font-bold'>
                            {formatNumberToDot(item.acs.price * item.acs.totalQuantity)}
                        </div>
                        <div className='w-1/12 p-2 text-center font-bold'></div>
                    </div>
                </div>
            )}
        </div>
    )
}
