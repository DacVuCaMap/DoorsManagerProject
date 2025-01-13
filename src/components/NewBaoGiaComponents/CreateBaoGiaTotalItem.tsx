
import { totalGroup } from '@/data/AddData';
import { changeObjectPriceAndTempPrice, formatDotToNumber, formatNumberFixed3, formatNumberToDot, formatNumberVN } from '@/data/FunctionAll';
import { listBgUnit } from '@/data/ListData';
import Accessories, { getNewAcs } from '@/Model/Accessories';
import DataReport from '@/Model/DataReport';
import FireTestCondition from '@/Model/FireTestCondition';
import TotalGroup from '@/Model/TotalGroup'
import TotalItem from '@/Model/TotalItem';
import { checkCondition } from '@/utils/bgFunction';
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
type Props = {
    totalGroup: TotalGroup,
    totalGroupIndex: number,
    listReport: DataReport[];
    handleUpdateTotalList: (totalItem: TotalGroup, totalGroupIndex: number) => void;
    listAcsExist: Accessories[];
}
type FireTestCount = {
    doorModelId: any,
    count: number,
    fireTestCondition: string,
    fireTestValue: string,

}
export default function CreateBaoGiaTotalItem(props: Props) {
    const [refreshSelect, setRefreshSelect] = useState(1);
    useEffect(() => {
        const updateTotalQuanity = () => {
            let tempTotalGroup: TotalGroup = { ...props.totalGroup };
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
                        // //tot quan add glass
                        // if (item.priceReport.onGlass && item.priceReport.glassAcs && item.priceReport.nepAcs) {
                        //     totalQuan+=item.priceReport.glassAcs.totalQuantity+item.priceReport.nepAcs.totalQuantity;
                        // }
                    })
                    return { ...totalItem, totalQuantity: totalQuan };

                }
                // cal by doormodel // kiem dinh
                else if (value == "-1") {
                    const countDoorModel: FireTestCount[] = [];
                    props.listReport.forEach((item: DataReport) => {
                        if (item.priceReport.doorModel) {
                            const checkExist = countDoorModel.find(childItem => childItem.doorModelId === item.priceReport.doorModel.id);
                            if (checkExist) {
                                checkExist.count += item.priceReport.totalQuantity;
                            } else {
                                countDoorModel.push({
                                    doorModelId: item.priceReport.doorModel.id, count: item.priceReport.totalQuantity
                                    , fireTestCondition: item.priceReport.doorModel.fireTestCondition, fireTestValue: item.priceReport.doorModel.fireTestValue
                                })
                            }
                        }
                    })
                    /// done get countDoorModel

                    let orgPriceFireTest = 0;
                    countDoorModel.forEach((item: FireTestCount) => {
                        const fireTestConditionArr = item.fireTestCondition.split("./");
                        const fireTestValueArr = item.fireTestValue.split("./");
                        let i = 0;
                        let flag = false;
                        while (!flag && i < fireTestConditionArr.length) {
                            flag = checkCondition(item.count, fireTestConditionArr[i]);
                            i++;
                        }
                        if (flag == true) {
                            orgPriceFireTest += (parseFloat(fireTestValueArr[i - 1]) * item.count);
                        }
                    })

                    return { ...totalItem, orgPrice: orgPriceFireTest, totalQuantity: 1 };
                }
                else {
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
        if (key === "price" || key === "orgPrice") {
            value = value ?? 0
            value = value.replace(/\./g, "");
            value = parseFloat(value);
            if (value >= 1000000000) {
                return;
            }

        }
        if (key === "pricePercent" && parseFloat(value) > 0) {

            let tempTotalGroup: TotalGroup = { ...props.totalGroup };
            let tempTotalItemm: TotalItem[] = tempTotalGroup.totalItem.map((item: TotalItem, ind) => {
                if (index === ind) {
                    return changeObjectPriceAndTempPrice(item, value, "pricePercent", "pricePercentTemp");
                }
                return item;
            });
            tempTotalGroup = { ...tempTotalGroup, totalItem: tempTotalItemm };
            props.handleUpdateTotalList(tempTotalGroup, props.totalGroupIndex);

            return;
        }
        /// update orgPrice
        if (key === "code") {
            let tempTotalGroup: TotalGroup = { ...props.totalGroup };
            let tempTotalItemm: TotalItem[] = tempTotalGroup.totalItem.map((item: TotalItem, ind) => {
                if (index === ind) {
                    const acsCostExist: Accessories | null = props.listAcsExist.find(acs => (acs.code === value && acs.type === "cost")) ?? null;
                    console.log(acsCostExist, value);
                    if (acsCostExist) {
                        return { ...item, orgPrice: acsCostExist.orgPrice, pricePercent: acsCostExist.lowestPricePercent * 100,pricePercentTemp:(acsCostExist.lowestPricePercent * 100).toString(), [key]: value };
                    } else {
                        return { ...item, [key]: value };
                    }

                }
                return item;
            });

            tempTotalGroup = { ...tempTotalGroup, totalItem: tempTotalItemm };
            props.handleUpdateTotalList(tempTotalGroup, props.totalGroupIndex);
            return;
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
        const newTotalItem: TotalItem = new TotalItem(0, 0, 1, "", 0, "", 0, "bộ");
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
        const acs: Accessories | null = props.listAcsExist.find(item => item.id === parseFloat(value)) ?? null;
        if (acs) {
            let tempTotalGroup: TotalGroup = { ...props.totalGroup };
            let tempTotalItemm: TotalItem[] = tempTotalGroup.totalItem.map((item: TotalItem, ind) => {
                if (index === ind) {
                    return { ...item, typeQuantity: value, code: acs.code, name: acs.name, orgPrice: acs.orgPrice, pricePercent: acs.lowestPricePercent * 100,pricePercentTemp:(acs.lowestPricePercent*100).toString() };
                }
                return item;
            });
            tempTotalGroup = { ...tempTotalGroup, totalItem: tempTotalItemm };
            props.handleUpdateTotalList(tempTotalGroup, props.totalGroupIndex);
            setRefreshSelect(prev => prev + 1);
        }
        else {
            let tempTotalGroup: TotalGroup = { ...props.totalGroup };
            let tempTotalItemm: TotalItem[] = tempTotalGroup.totalItem.map((item: TotalItem, ind) => {
                if (index === ind) {
                    return { ...item,typeQuantity:value };
                }
                return item;
            });
            tempTotalGroup = { ...tempTotalGroup, totalItem: tempTotalItemm };
            props.handleUpdateTotalList(tempTotalGroup, props.totalGroupIndex);
            setRefreshSelect(prev => prev + 1);
        }

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
                        <div className='w-4/12 p-2 text-center font-bold flex flex-col justify-center space-y-6 h-28'>
                            <div className='flex flex-row items-center justify-center space-x-2'>
                                <input
                                    type="text"
                                    className='outline-none  px-2 py-1 w-full bg-transparent border-b border-gray-300'
                                    value={item.name}
                                    onChange={e => handleUpdate(e, "name", index)}
                                />
                            </div>
                            <div className='flex flex-row space-x-4'>
                                <div className='flex flex-row space-x-2'>
                                    <span className='text-gray-400'>Giá gốc</span>
                                    <input
                                        type="text"
                                        className='outline-none  px-2 py-1 w-28 bg-transparent border-b border-gray-300'
                                        value={formatNumberToDot(item.orgPrice)}
                                        onChange={e => handleUpdate(e, "orgPrice", index)}
                                    />
                                </div>
                                <div className='flex flex-row space-x-2'>
                                    <span className='text-gray-400'>H.số (%)</span>
                                    <input
                                        type="text"
                                        className='outline-none  px-2 py-1 w-14 bg-transparent border-b border-gray-300'
                                        value={item.pricePercentTemp ?? 0}
                                        onChange={e => handleUpdate(e, "pricePercent", index)}
                                    />
                                </div>
                                <div className='flex flex-row space-x-2 create-bg'>
                                    <select value={item.unit} onChange={e => handleUpdate(e, "unit", index)} name="" id="" className='h-7 w-32'>
                                        {listBgUnit.map((str: string, index) => (
                                            <option value={str} key={index}>{str}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
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
                                <select value={item.typeQuantity} onChange={e => handleSelectTypeQuan(e, index)} name="" id="" className='h-7 w-full'>
                                    <option value="">tắt</option>
                                    <option value={-1}>kiểm định</option>
                                    {props.listAcsExist.map((acs: Accessories, index) => (
                                        <option value={acs.id} key={index}>{acs.name}</option>
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
                            {formatNumberVN(item.totalQuantity * item.price) ?? 0}
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
