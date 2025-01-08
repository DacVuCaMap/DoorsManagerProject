
import { totalGroup } from '@/data/AddData';
import { formatDotToNumber, formatNumberFixed3, formatNumberToDot } from '@/data/FunctionAll';
import Accessories, { getNewAcs } from '@/Model/Accessories';
import DataReport from '@/Model/DataReport';
import TotalGroup from '@/Model/TotalGroup'
import TotalItem from '@/Model/TotalItem';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
type Props = {
    totalGroup: TotalGroup,
    totalGroupIndex: number,
    listReport: DataReport[];
    handleUpdateTotalList: (totalItem: TotalGroup, totalGroupIndex: number) => void;
    listAcsExist: Accessories[];
}
export default function CreateBaoGiaTotalItem(props: Props) {
    const [refreshSelect, setRefreshSelect] = useState(1);
    useEffect(() => {
        const updateTotalQuanity = () => {
            let tempTotalGroup: TotalGroup = {...props.totalGroup};
            /// SUM mainAcs
            const totalMainQuantity = props.listReport.reduce((total: number, item: DataReport) => {
                if (item.priceReport.mainAcs) {
                    return total + item.priceReport.mainAcs.totalQuantity;
                }
                return total;
            }, 0)
            const tempTotalItem: TotalItem[] = props.totalGroup.totalItem.map((totalItem: TotalItem, index) => {
                const value = totalItem.typeQuantity;
                // cal main
                if (totalItem.code === "CPV" || totalItem.code === "CPLD") {
                    return { ...totalItem, totalQuantity: totalMainQuantity };
                }
                // cal count by acs
                else if (value && value != "-1") {
                    let totalQuan = 0;
                    props.listReport.forEach((item: DataReport) => {
                        if (item.priceReport.mainAcs) {
                            const totQuan = item.priceReport.mainAcs.totalQuantity;
                            item.priceReport.accessories.forEach((acs: Accessories) => {
                                if (acs.id === parseFloat(value)) {
                                    totalQuan += totQuan;
                                }
                            })
                        }
                    })
                    return { ...totalItem, totalQuantity: totalQuan };

                }
                // cal by doormodel
                else if(value=="-1"){

                    
                    return totalItem;
                }
                else{
                    return totalItem;
                }
            })
            tempTotalGroup = { ...tempTotalGroup, totalItem: tempTotalItem };
            props.handleUpdateTotalList(tempTotalGroup, props.totalGroupIndex);
        }
        updateTotalQuanity();
    }, [props.listReport, refreshSelect])

    const handleUpdate = (e: any, key: string, index: number) => {
        let value = e.target.value;
        if (key === "price") {
            value = value.replace(/\./g, "");
            value = parseFloat(value);
            if (value >= 1000000000) {
                return;
            }
        }
        if (key === "totalQuantity") {
            value = value ? parseFloat(value) : 0;
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

    const handleAddCost = () => {
        const tempTotalGroup: TotalGroup = { ...props.totalGroup };
        const newTotalItem: TotalItem = new TotalItem(0, 0, 1, "", 0, "");
        tempTotalGroup.totalItem.push(newTotalItem);
        props.handleUpdateTotalList(tempTotalGroup, props.totalGroupIndex);
    }
    const handleDelete = (loc: number) => {
        const tempTotalGroup: TotalGroup = { ...props.totalGroup };
        const newTotalItem: TotalItem[] = tempTotalGroup.totalItem.filter((item, index) => index != loc);
        const temp: TotalGroup = { ...props.totalGroup, totalItem: newTotalItem };
        props.handleUpdateTotalList(temp, props.totalGroupIndex);
    }
    const handleSelectTypeQuan = (e: any, index: number) => {
        const value = e.target.value;
        let tempTotalGroup: TotalGroup = { ...props.totalGroup };
        let tempTotalItemm: TotalItem[] = tempTotalGroup.totalItem.map((item: TotalItem, ind) => {
            if (index === ind) {
                return { ...item, typeQuantity: value };
            }
            return item;
        });
        tempTotalGroup = { ...tempTotalGroup, totalItem: tempTotalItemm };
        props.handleUpdateTotalList(tempTotalGroup, props.totalGroupIndex);
        setRefreshSelect(prev => prev + 1);
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
                        <div className='w-1/12 p-2 text-center font-bold px-6'>
                            {item.typeTotal === 1 ?
                                <input
                                    type="text"
                                    className='outline-none text-center px-2 py-1 w-full bg-transparent border-b border-gray-300'
                                    value={item.code}
                                    onChange={e => handleUpdate(e, "code", index)}
                                />
                                :
                                item.code
                            }
                        </div>
                        <div className='w-3/12 p-2 text-center font-bold flex flex-row create-bg  '>
                            {item.typeTotal != 0 && <div className='flex flex-row w-full space-x-2 items-center'>
                                <span>Kiểu:</span>
                                <select value={item.typeQuantity} onChange={e => handleSelectTypeQuan(e, index)} name="" id="" className='h-7'>
                                    <option value="">tắt</option>
                                    <option value={-1}>kiểm định</option>
                                    {props.listAcsExist.map((acs: Accessories, index) => (
                                        <option value={acs.id} key={index}>Đếm: {acs.name}</option>
                                    ))}
                                </select>
                            </div>}
                        </div>
                        <div className='w-1/12 p-2 text-center font-bold flex flex-col '>
                            <div className='flex flex-row space-x-2'>
                                <span className='text-center w-full'>
                                    {(item.typeTotal === 1 && !item.typeQuantity) ?
                                        <input
                                            type="text"
                                            className='text-center outline-none py-1 w-full bg-transparent border-b border-gray-300'
                                            value={formatNumberFixed3(item.totalQuantity)}
                                            onChange={e => handleUpdate(e, "totalQuantity", index)}
                                        />
                                        :
                                        formatNumberFixed3(item.totalQuantity)
                                    }
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
                            {formatNumberToDot((Number((item.totalQuantity * item.price).toFixed(2))).toFixed(0))}
                        </div>
                        <div className='w-1/12 p-2 text-center font-bold'>
                            {item.typeTotal != 0 && <button onClick={e => handleDelete(index)} className='hover:bg-gray-700 p-2'><Trash2 /></button>}
                        </div>
                    </div>
                </div>
            )}
            <div className='bg-gray-900 w-full flex flex-row p-6'>
                <button type='button' className="inline-block w-full border-2 border-gray-300 hover:bg-gray-700 text-gray-300 font-bold py-1 px-2 rounded" onClick={e => handleAddCost()}
                >+ Thêm chi phí</button>
            </div>

        </div>
    )
}
