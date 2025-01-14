import { Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import BaoGiaSearchPhuKien from '../baogiaComponents/BaoGiaSearchPhuKien'
import Accessories from '@/Model/Accessories'
import InputSearchAcs from '../SearchingComponents/InputSearchAcs'
import { changePriceAndTempPrice, formatNumberFixed3, formatNumberFixed4, formatNumberToDot, formatNumberVN } from '@/data/FunctionAll'
import DataReport from '@/Model/DataReport'
import { readConditionAndCal } from '@/utils/bgFunction'
type Props = {
    acsData: Accessories[],
    acsIndex: number,
    handleChangeAcsList: (acs: Accessories, acsIndex: number) => void,
    ReportItem: DataReport
}
export default function CreateBaoGiaSecondAcs(props: Props) {
    const [curAcs, setCurAcs] = useState(props.ReportItem.priceReport.accessories[props.acsIndex]);
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => {
        setIsFocused(true);
    };

    const handleBlur = () => {
        setIsFocused(false);
    };
    const handleUpdateToParent = (acs: Accessories) => {
        props.handleChangeAcsList(acs, props.acsIndex);
    }
    const handleUpdateToParentSearchKey = (acs: Accessories) => {
        const newAcs: Accessories = { ...acs, type: curAcs.type, quantity: curAcs.quantity, totalQuantity: curAcs.totalQuantity, condition: curAcs.condition, price: curAcs.price }

        props.handleChangeAcsList(newAcs, props.acsIndex);
    }
    const handleChangeInput = (value: any, key: string) => {
        if (key === "quantity") {
            /// check condition
            // console.log(value);
            const quantity = readConditionAndCal(value.toString(),props.ReportItem.priceReport.width,props.ReportItem.priceReport.height);
            // console.log(quantity)
            let condition = value;
            if (quantity===-411) {
                condition="";
            }
            let newAcs : Accessories = {...curAcs,condition:condition,quantity:condition==="" ? 0 : quantity }
            setCurAcs(newAcs);
            handleUpdateToParent(newAcs);
            return;
        }

        value = value === "" ? 0 : value;
        let newAcs: Accessories = { ...curAcs, [key]: parseFloat(value) }
        if (key === "price") {
            newAcs = changePriceAndTempPrice({ ...curAcs }, value);
        }
        setCurAcs(newAcs);
        handleUpdateToParent(newAcs);
    }
    const handleDelete = () => {
        let newAcs: Accessories = { ...curAcs, name: "del-0411" }
        handleUpdateToParent(newAcs);
    }
    // update curAcs
    useEffect(() => {
        setCurAcs(props.ReportItem.priceReport.accessories[props.acsIndex]);
    }, [props.ReportItem.priceReport.accessories[props.acsIndex]])

    //update totalQuan
    useEffect(() => {

        if (curAcs.type != "glass" && curAcs.type != "nep" && curAcs.condition) {

            const quan = readConditionAndCal(curAcs.condition, props.ReportItem.priceReport.width / 1000, props.ReportItem.priceReport.height / 1000);
            if (curAcs.quantity == quan) {
                const totalQuan = quan * props.ReportItem.priceReport.totalQuantity;
                const newAcs: Accessories = { ...curAcs, totalQuantity: totalQuan, quantity: quan };
                handleUpdateToParent(newAcs);
            }
        }
        else {
            handleChangeInput(props.ReportItem.priceReport.totalQuantity * curAcs.quantity, "totalQuantity");
        }
    }, [props.ReportItem.priceReport.totalQuantity, curAcs.quantity, props.ReportItem.priceReport.width, props.ReportItem.priceReport.height])

    return (
        <div className='w-11/12 flex flex-row items-center py-1 bg-gray-600'>
            <div className='w-4/12 p-2 text-center flex flex-row justify-center space-x-4'>
                <InputSearchAcs curAcs={curAcs} handleSelectAcs={handleUpdateToParentSearchKey} acsData={props.acsData} />
            </div>
            <div className='w-1/12 p-2 text-center'>
                <span>{curAcs.code}</span>
            </div>
            <div className='w-2/12 p-2 text-center flex flex-col '>
            </div>
            <div className='w-2/12 p-2 text-center flex flex-col '>
                <div className='flex flex-row space-x-2'>
                    <div className='w-1/2'>
                        {curAcs.type === "normal" &&
                            <input
                                onChange={e => handleChangeInput(e.target.value, "quantity")}
                                value={isFocused ? curAcs.condition : curAcs.quantity}
                                type="text"
                                className='text-center rounded px-2 py-1 w-full'
                                onFocus={handleFocus}
                                onBlur={handleBlur}
                            />
                        }
                        {curAcs.type === "doorsill" &&
                            <span>{curAcs.quantity}</span>
                        }
                    </div>
                    <div className='w-1/2'>
                        <span>{formatNumberFixed3(curAcs.totalQuantity)}</span>
                    </div>
                </div>
            </div>
            <div className='overflow-auto w-1/12 p-2 text-center'>
                <input onChange={e => handleChangeInput(e.target.value, "price")} value={curAcs.tempPrice ?? 0} type="text" className='rounded px-2 py-1 w-full' />
            </div>
            <div className='overflow-auto w-1/12 pl-4 text-center '>
                <span className='w-full'>{formatNumberVN(curAcs.totalQuantity * curAcs.price)}</span>
            </div>
            <div className='w-1/12 p-2 flex flex-row justify-center space-x-2 '>
                <div onClick={e => handleDelete()} className='cursor-pointer'> <Trash2 /> </div>
            </div>
        </div>
    )
}
