
import PriceReport from '@/Model/PriceReport';
import React, { useEffect, useRef, useState } from 'react'
import "./CreateBaoGiaItem.css"
import { ChevronDown, PackageOpen, Trash2, X } from 'lucide-react';
import Accessories, { getNewAcs, TransRequestToAcs } from '@/Model/Accessories';
import InputSearchPDC from './InputSearchPDC';
import GroupAccessory from '@/Model/GroupAccessory';
import DataReport from '@/Model/DataReport';
import { listEI } from '@/data/ListData';
import CreateBaoGiaMainAcs from './CreateBaoGiaMainAcs';
import CreateBaoGiaSecondAcs from './CreateBaoGiaSecondAcs';
import { ScaleLoader } from 'react-spinners';
import { changePriceAndTempPrice, formatNumberFixed3, formatNumberToDot, formatNumberVN } from '@/data/FunctionAll';
import { Switch } from 'antd';
import { readConditionAndCal } from '@/utils/bgFunction';
type Props = {
    parentIndex: number;
    doorModelData: any[],
    ReportItem: DataReport;
    updateToParent: (childItem: DataReport, parentIndex: number) => void;
    groupAcsData: GroupAccessory[],
    acsData: Accessories[],
    deleteDataReport: (parentIndex: number) => void;
    listGlassAcs: Accessories[],
    listNepAcs: Accessories[],
}
export default function CreateBaoGiaItem(props: Props) {
    const [loading, setLoading] = useState(0);

    const updateMainAcsItemTotalQuantity = () => {
        if (props.ReportItem.priceReport.mainAcs) {
            const tempMainAcs: Accessories = {
                ...props.ReportItem.priceReport.mainAcs
                , totalQuantity: formatNumberFixed3(props.ReportItem.priceReport.width / 1000 * props.ReportItem.priceReport.height / 1000 * props.ReportItem.priceReport.totalQuantity)
            };
            // console.log(tempMainAcs)
            handleChangeReport(tempMainAcs, "mainAcs");
        }

    }
    useEffect(() => {
        updateMainAcsItemTotalQuantity();
    }, [props.ReportItem.priceReport.width, props.ReportItem.priceReport.height, props.ReportItem.priceReport.totalQuantity, props.ReportItem.priceReport.mainAcs?.name])

    /// update quantity
    //update quantity with doorsill
    useEffect(() => {
        const tempAcsList: Accessories[] = [...props.ReportItem.priceReport.accessories].map(acs => {
            if (acs.condition) {
                const quan = readConditionAndCal(acs.condition, props.ReportItem.priceReport.width / 1000, props.ReportItem.priceReport.height / 1000);
                return { ...acs, quantity: quan }
            }
            return acs;
        });
        const tempReport: PriceReport = { ...props.ReportItem.priceReport, accessories: tempAcsList };
        updateWithPriceReport(tempReport);

    }, [props.ReportItem.priceReport.width, props.ReportItem.priceReport.height])

    /// update glass value
    useEffect(() => {
        let tempGlass: Accessories | null = props.ReportItem.priceReport.glassAcs;
        if (tempGlass && props.ReportItem.priceReport.nepAcs) {
            const quan = (tempGlass.width / 1000) * (tempGlass.height / 1000) * props.ReportItem.priceReport.nepAcs.quantity;
            tempGlass = { ...tempGlass, quantity: quan, totalQuantity: props.ReportItem.priceReport.totalQuantity * quan };
            let tempMainAcs: Accessories | null = props.ReportItem.priceReport.mainAcs ?? null;
            if (props.ReportItem.priceReport.mainAcs) {
                tempMainAcs = {
                    ...props.ReportItem.priceReport.mainAcs
                    , totalQuantity: formatNumberFixed3(props.ReportItem.priceReport.width / 1000 * props.ReportItem.priceReport.height / 1000 * props.ReportItem.priceReport.totalQuantity)
                };
            }
            const newPriceReport: PriceReport = { ...props.ReportItem.priceReport, glassAcs: tempGlass,mainAcs:tempMainAcs }
            updateWithPriceReport(newPriceReport);
        }
    }, [props.ReportItem.priceReport.glassAcs?.width, props.ReportItem.priceReport.glassAcs?.height])

    useEffect(() => {
        let tempNep: Accessories | null = props.ReportItem.priceReport.nepAcs;
        if (tempNep) {
            tempNep = { ...tempNep, totalQuantity: tempNep.quantity * props.ReportItem.priceReport.totalQuantity };
            let tempGlass: Accessories | null = props.ReportItem.priceReport.glassAcs;
            if (tempGlass && props.ReportItem.priceReport.nepAcs) {
                const quan = (tempGlass.width / 1000) * (tempGlass.height / 1000) * props.ReportItem.priceReport.nepAcs.quantity;
                tempGlass = { ...tempGlass, quantity: quan, totalQuantity: props.ReportItem.priceReport.totalQuantity * quan };
            }
            let tempMainAcs: Accessories | null = props.ReportItem.priceReport.mainAcs ?? null;
            if (props.ReportItem.priceReport.mainAcs) {
                tempMainAcs = {
                    ...props.ReportItem.priceReport.mainAcs
                    , totalQuantity: formatNumberFixed3(props.ReportItem.priceReport.width / 1000 * props.ReportItem.priceReport.height / 1000 * props.ReportItem.priceReport.totalQuantity)
                };
            }
            const newPriceReport: PriceReport = { ...props.ReportItem.priceReport, nepAcs: tempNep, glassAcs: tempGlass, mainAcs: tempMainAcs ?? null };
            updateWithPriceReport(newPriceReport);
        }
    }, [props.ReportItem.priceReport.nepAcs?.quantity, props.ReportItem.priceReport.totalQuantity])


    const handleSelectDoorModel = (doorModelItem: any, newPriceReport: PriceReport) => {
        const acsList: Accessories[] = [];
        //input acs
        /// get list acs
        // console.log(doorModelItem);
        // console.log(doorModelItem);
        if (doorModelItem.accessoryAndFeatures && doorModelItem.accessoryAndFeatures.length > 0) {
            doorModelItem.accessoryAndFeatures.map((item: any) => {
                const acsExisted: GroupAccessory | null = props.groupAcsData.find((acsGroup: GroupAccessory) => acsGroup.id === item.accessoryGroupId) ?? null;
                if (acsExisted && acsExisted.accessoriesAndType.length > 0) {
                    acsList.push({ ...acsExisted.accessoriesAndType[0].accessories, quantity: readConditionAndCal(item.condition, newPriceReport.width, newPriceReport.height), condition: item.condition, totalQuantity: 0 });
                }
            })
        }
        //find glass
        const glassItem: Accessories | null = props.acsData.find(item => item.id === doorModelItem.accessoryGlassId) ?? null;
        //find nep
        const nepItem: Accessories | null = props.acsData.find(item => item.id === doorModelItem.glassBracketId) ?? null;
        const mainAcs = props.acsData.find((item: Accessories) => item.id === doorModelItem.accessoryMainId) ?? null;
        newPriceReport = {
            ...newPriceReport,
            doorModel: doorModelItem,
            numberDoor: doorModelItem.numberDoor ? doorModelItem.numberDoor : 0,
            name: doorModelItem.name ? doorModelItem.name : newPriceReport.name,
            accessories: acsList,
            mainAcs: mainAcs,
            glassAcs: glassItem,
            nepAcs: nepItem,
            onGlass:false
        };
        updateWithPriceReport(newPriceReport);
    }

    const handleChangeReport = (value: any, key: string) => {
        let newPriceReport: PriceReport = { ...props.ReportItem.priceReport }
        if (key === "width" || key === "height") {
            value = value === "" ? 0 : value;
            value = parseFloat(value);
        }
        if (key === "totalQuantity") {
            value = value === "" ? 0 : value;
            value = parseFloat(value);
            let newAcs: Accessories[] = newPriceReport.accessories.map(acs => {
                if (acs.type != "cost") {
                    return { ...acs, totalQuantity: acs.quantity * value }
                }
                return acs;
            })
            newPriceReport = { ...newPriceReport, [key]: value, accessories: newAcs };
            updateWithPriceReport(newPriceReport);
            return;
        }
        if (key === "doorModel") {
            handleSelectDoorModel(value, newPriceReport);
            return;
        }
        newPriceReport = { ...newPriceReport, [key]: value };

        updateWithPriceReport(newPriceReport);
    }
    const handleChangeDataReport = (value: any, key: string) => {
        let newReportItem: DataReport = { ...props.ReportItem, [key]: value }
        props.updateToParent(newReportItem, props.parentIndex);
    }
    const updateWithPriceReport = (priceReport: PriceReport) => {
        let newDataReport: DataReport = { ...props.ReportItem, priceReport: priceReport }
        props.updateToParent(newDataReport, props.parentIndex);
    }
    //update acs list
    const handleChangeAcsList = (acs: Accessories, acsIndex: number) => {
        if (acs.name === "del-0411") {
            let newAcsList: Accessories[] = props.ReportItem.priceReport.accessories
                .filter((item: Accessories, index: number) => index != acsIndex);
            handleChangeReport(newAcsList, "accessories");
        }
        else {
            let newAcsList: Accessories[] = [...props.ReportItem.priceReport.accessories].map((item, index) => {
                if (index === acsIndex) {
                    // console.log(acs.quantity,"xoa")
                    return acs
                }
                return item;
            });
            handleChangeReport(newAcsList, "accessories");
        }

    }
    const handleCalTotalPrice = (): number => {
        let total = 0;
        props.ReportItem.priceReport.accessories.map((item: Accessories) => {
            total += item.price * (item.quantity * props.ReportItem.priceReport.totalQuantity);
        })
        // add main
        if (props.ReportItem.priceReport.mainAcs) {
            total += props.ReportItem.priceReport.mainAcs.totalQuantity * props.ReportItem.priceReport.mainAcs.price;
        }
        //add glass
        if (props.ReportItem.priceReport.onGlass && props.ReportItem.priceReport.glassAcs && props.ReportItem.priceReport.nepAcs) {
            total += props.ReportItem.priceReport.glassAcs.totalQuantity * props.ReportItem.priceReport.glassAcs.price + props.ReportItem.priceReport.nepAcs.totalQuantity * props.ReportItem.priceReport.nepAcs.price;
        }

        return total;
    }
    const showDetails = (e: any) => {
        // Kiểm tra nếu sự kiện xảy ra trên chính thẻ cha hoặc không phải là thẻ con
        if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.target instanceof HTMLButtonElement) {
            e.stopPropagation();
        } else {
            // console.log('Parent div clicked');
            handleChangeDataReport(!props.ReportItem.isShowDetails, "isShowDetails");
        }
    }

    //glass area

    const handleSelectGlass = (e: any, key: keyof PriceReport, childKey?: string) => {
        let value = e.target.value;
        /// update value
        if (childKey) {
            if (childKey === "price") {
                let tempReport: PriceReport = { ...props.ReportItem.priceReport };
                const newAcs: Accessories = changePriceAndTempPrice({ ...tempReport[key] }, value)
                tempReport = { ...tempReport, [key]: newAcs };
                updateWithPriceReport(tempReport);
                return;
            }

            value = value.replace(/\./g, '');
            value = value ? value : 0;

            let tempReport: PriceReport = { ...props.ReportItem.priceReport };
            const newAcs: Accessories = { ...tempReport[key], [childKey]: parseFloat(value) };
            tempReport = { ...tempReport, [key]: newAcs };
            updateWithPriceReport(tempReport);
            return;
        }
        const checkAcs: Accessories | undefined = props.acsData.find(item => item.id === parseFloat(value));
        if (checkAcs) {
            let tempReport: PriceReport = { ...props.ReportItem.priceReport };
            const newAcs: Accessories = {
                ...checkAcs, condition: tempReport[key].condition, price: tempReport[key].price
                , width: tempReport[key].width, height: tempReport[key].height, quantity: tempReport[key].quantity
                , totalQuantity: tempReport[key].totalQuantity
            };
            tempReport = { ...tempReport, [key]: newAcs };
            updateWithPriceReport(tempReport);
            return;
        }
    }
    const turnOnGlass = (flag: boolean) => {
        let tempReport: PriceReport = { ...props.ReportItem.priceReport, onGlass: flag };
        updateWithPriceReport(tempReport);
    }
    return (
        <div className='w-full px-4 transition-all ease-in-out duration-300 hover:px-0 create-bg text-sm text-gray-300 group'>
            {/* <div className='ml-2 flex flex-row space-x-2 text-xs'>
                <span className='text-red-500 border-l border-red-500 px-2'>Chưa có mẫu kiểm định phù hợp</span>
                <span className='text-red-500 border-l border-red-500 px-2'>Thiếu dữ liệu nhập vào</span>
            </div> */}
            <div onClick={showDetails} className={`flex flex-row justify-center items-center py-2 bg-gray-800 transition-all ease-in-out duration-300 
                group-hover:rounded-none group-hover:py-4 hover:bg-gray-900 hover:cursor-pointer ${props.ReportItem.isShowDetails ? 'rounded-t-lg' : 'rounded-lg'}`}>
                <div className='w-1/12 text-center font-bold inline-block'>{props.parentIndex + 1}</div>
                <div className='w-11/12 flex flex-row items-center'>
                    <div className='w-4/12 p-2 text-center flex flex-row space-x-2 font-bold'>
                        <InputSearchPDC doorModelData={props.doorModelData} name={props.ReportItem.priceReport.name} handleChangeReport={handleChangeReport} />
                        {(props.ReportItem.priceReport.doorModel && props.ReportItem.priceReport.numberDoor != 0) && <span className='text-xs text-gray-400'>{props.ReportItem.priceReport.doorModel.numberDoor} cánh</span>}
                        <select className='rounded' name="" id="" onChange={e => handleChangeReport(e.target.value, "EI")} value={props.ReportItem.priceReport.EI}>
                            <option value="" >tắt</option>

                            {listEI.map((item: string, ind: number) => (
                                <option key={ind} value={"EI" + item}>EI{item}</option>
                            ))}
                        </select>
                    </div>

                    <div className='w-1/12 p-2 text-center font-bold'>
                        <input onChange={e => handleChangeReport(e.target.value, "code")} value={props.ReportItem.priceReport.code} type="text" className='text-center rounded px-2 py-1 w-full' />
                    </div>
                    <div className='w-2/12 p-2 text-center font-bold flex flex-col '>
                        <div className='flex flex-row space-x-2 items-center'>
                            <div className='w-1/2'>
                                <input onChange={e => handleChangeReport(e.target.value, "width")} value={props.ReportItem.priceReport.width} type="text" className='rounded text-center px-2 py-1 w-full' />
                            </div>
                            <span>X</span>
                            <div className='w-1/2'>
                                <input onChange={e => handleChangeReport(e.target.value, "height")} value={props.ReportItem.priceReport.height} type="text" className='rounded text-center px-2 py-1 w-full' />
                            </div>
                        </div>
                    </div>
                    <div className='w-2/12 p-2 text-center font-bold flex flex-col '>
                        <div className='flex flex-row space-x-2 items-center'>
                            <div className='w-1/2'>
                                {/* <input onChange={e=>handleChangeReport(e.target.value,"quantity")} type="text" value={props.ReportItem.priceReport.quantity} className='rounded px-2 py-1 w-full' /> */}
                                <span className='w-full'>{props.ReportItem.priceReport.quantity}</span>
                            </div>
                            <div className='w-1/2'>
                                <input onChange={e => handleChangeReport(e.target.value, "totalQuantity")}
                                    value={props.ReportItem.priceReport.totalQuantity}
                                    type="text" className='rounded text-center px-2 py-1 w-full' />
                            </div>
                        </div>
                    </div>
                    <div className='overflow-auto w-1/12 p-2 font-bold text-center border-r border-gray-300'>
                        <span className='w-full'>{props.ReportItem.priceReport.totalQuantity === 0 ? 0 : formatNumberVN((handleCalTotalPrice() / props.ReportItem.priceReport.totalQuantity))}</span>
                    </div>
                    <div className='overflow-auto w-1/12 p-2 text-center font-bold '>
                        <span className='w-full'>{formatNumberVN(handleCalTotalPrice())}</span>
                    </div>
                    <div className='w-1/12 flex flex-row justify-center space-x-2 items-center'>
                        <div className=''>
                            <button className='hover:bg-gray-700 p-2' onClick={e => { e.stopPropagation(); props.deleteDataReport(props.parentIndex) }}><Trash2 /></button>
                        </div>
                        <div className=''>
                            <ChevronDown />
                        </div>
                    </div>
                </div>
            </div>


            <div className={`bg-gray-800 w-full flex flex-col space-y-2 transition-all duration-300 ease-in-out 
                overflow-hidden ${props.ReportItem.isShowDetails ? 'max-h-[1000px] py-4' : 'max-h-0 py-0'}`}>
                <span className='border-b border-gray-400 ml-4 text-gray-400 text-xs'>Vật liệu chính</span>
                {props.ReportItem.priceReport.doorModel ?
                    <CreateBaoGiaMainAcs handleChangeReport={handleChangeReport} parentIndex={props.parentIndex} ReportItem={props.ReportItem} name={props.ReportItem.priceReport.name} />
                    :
                    <div className='flex flex-row px-2'>
                        <div className='w-1/12 p-2 text-center font-bold'></div>
                        <div className='w-11/12 flex flex-row items-center py-1 bg-gray-600'>
                            <div className='w-full flex flex-row font-bold text-gray-400 items-center justify-center space-x-2'>
                                <PackageOpen />
                                <span>Chọn mẫu cửa</span>
                            </div>
                        </div>
                    </div>
                }


                <span className='border-b border-gray-400 ml-4 text-gray-400 text-xs'>Phụ kiện và chi phí kèm theo</span>
                <div className='pb-10'>
                    {props.ReportItem.priceReport.accessories.map((item: Accessories, index: number) => {
                        if (item.type != "cost") {
                            return (<div key={index} className='flex flex-row px-2'>
                                <div className='w-1/12 p-2 text-center font-bold'>{props.parentIndex + 1},{3 + index}</div>
                                <CreateBaoGiaSecondAcs ReportItem={props.ReportItem} acsIndex={index} handleChangeAcsList={handleChangeAcsList} acsData={props.acsData} />
                            </div>)
                        }
                        return ('')
                    }
                    )}
                    {(props.ReportItem.priceReport.glassAcs!=null) &&
                        (<div className='flex flex-row px-2'>
                            <div className='w-1/12 p-2 text-center font-bold'><Switch value={props.ReportItem.priceReport.onGlass} onChange={turnOnGlass} /></div>
                            <div className='w-11/12 flex flex-row items-center py-1 h-10 bg-gray-600'></div>
                        </div>)

                    }

                    {(props.ReportItem.priceReport.glassAcs!=null && props.ReportItem.priceReport.onGlass) &&
                        <div className='flex flex-row px-2'>
                            <div className='w-1/12 p-2 text-center font-bold'>Kính</div>
                            <div className='w-11/12 flex flex-row items-center py-1 bg-gray-600'>
                                <div className='w-4/12 p-2 text-center flex flex-row justify-center space-x-4'>
                                    <select onChange={e => handleSelectGlass(e, "glassAcs")} className='w-full h-7 rounded' name="" id="" value={props.ReportItem.priceReport.glassAcs.id}>
                                        {props.listGlassAcs.map((item: Accessories, ind: number) => (
                                            <option key={ind} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='w-1/12 p-2 text-center'>
                                    <span>{props.ReportItem.priceReport.glassAcs?.code}</span>
                                </div>
                                <div className='w-2/12 p-2 text-center flex flex-row space-x-2 '>
                                    <div className='w-1/2'>
                                        <input value={props.ReportItem.priceReport.glassAcs.width} onChange={e => handleSelectGlass(e, "glassAcs", "width")} type="text" className='rounded px-2 text-center py-1 w-full' />
                                    </div>
                                    <X />
                                    <div className='w-1/2'>
                                        <input value={props.ReportItem.priceReport.glassAcs.height} onChange={e => handleSelectGlass(e, "glassAcs", "height")} type="text" className='rounded px-2 text-center py-1 w-full' />
                                    </div>
                                </div>
                                <div className='w-2/12 p-2 text-center flex flex-col '>
                                    <div className='flex flex-row space-x-2'>
                                        <div className='w-1/2'>
                                            {formatNumberVN(props.ReportItem.priceReport.glassAcs?.quantity)}
                                        </div>
                                        <div className='w-1/2'>
                                            <span>{formatNumberVN(props.ReportItem.priceReport.glassAcs?.totalQuantity)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='overflow-auto w-1/12 p-2 text-center'>
                                    <input value={props.ReportItem.priceReport.glassAcs?.tempPrice ?? 0} onChange={e => handleSelectGlass(e, "glassAcs", "price")} type="text" className='rounded px-2 py-1 w-full' />
                                </div>
                                <div className='overflow-auto w-1/12 pl-4 text-center '>
                                    <span className='w-full'>{props.ReportItem.priceReport.glassAcs && formatNumberVN(props.ReportItem.priceReport.glassAcs.totalQuantity * props.ReportItem.priceReport.glassAcs.price)}</span>
                                </div>
                                <div className='w-1/12 p-2 flex flex-row justify-center space-x-2 '>
                                    {/* <div className='cursor-pointer'> <Trash2 /> </div> */}
                                </div>
                            </div>
                        </div>
                    }

                    {(props.ReportItem.priceReport.nepAcs && props.ReportItem.priceReport.onGlass) &&
                        <div className='flex flex-row px-2'>
                            <div className='w-1/12 p-2 text-center font-bold'>Nẹp kính</div>
                            <div className='w-11/12 flex flex-row items-center py-1 bg-gray-600'>
                                <div className='w-4/12 p-2 text-center flex flex-row justify-center space-x-4'>
                                    <select onChange={e => handleSelectGlass(e, "nepAcs")} className='w-full h-7 rounded' name="" id="" value={props.ReportItem.priceReport.nepAcs.id}>
                                        {props.listNepAcs.map((item: Accessories, ind: number) => (
                                            <option key={ind} value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className='w-1/12 p-2 text-center'>
                                    <span>{props.ReportItem.priceReport.nepAcs?.code}</span>
                                </div>
                                <div className='w-2/12 p-2 text-center flex flex-col '>
                                </div>
                                <div className='w-2/12 p-2 text-center flex flex-col '>
                                    <div className='flex flex-row space-x-2'>
                                        <div className='w-1/2'>
                                            <input value={props.ReportItem.priceReport.nepAcs.quantity} onChange={e => handleSelectGlass(e, "nepAcs", "quantity")} type="text" className='rounded text-center px-2 py-1 w-full' />
                                        </div>
                                        <div className='w-1/2'>
                                            <span>{formatNumberFixed3(props.ReportItem.priceReport.nepAcs?.totalQuantity)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className='overflow-auto w-1/12 p-2 text-center'>
                                    <input value={props.ReportItem.priceReport.nepAcs?.tempPrice ?? 0} onChange={e => handleSelectGlass(e, "nepAcs", "price")} type="text" className='rounded px-2 py-1 w-full' />
                                </div>
                                <div className='overflow-auto w-1/12 pl-4 text-center '>
                                    <span className='w-full'>{props.ReportItem.priceReport.nepAcs && formatNumberVN(props.ReportItem.priceReport.nepAcs.totalQuantity * props.ReportItem.priceReport.nepAcs.price)}</span>
                                </div>
                                <div className='w-1/12 p-2 flex flex-row justify-center space-x-2 '>
                                    {/* <div className='cursor-pointer'> <Trash2 /> </div> */}
                                </div>
                            </div>
                        </div>
                    }


                    <div className='flex flex-row px-2'>
                        <div className='w-1/12 p-2 text-center font-bold'></div>
                        <div className='w-11/12 flex flex-row items-center bg-gray-600'>
                            {props.ReportItem.priceReport.doorModel ?
                                <div className='px-2 py-2 w-full flex flex-col'>
                                    {(props.ReportItem.priceReport.accessories.length === 0 && loading != 1) &&
                                        <div className='flex flex-col space-y-2 justify-center items-center py-4 text-gray-400'>
                                            <PackageOpen size={40} />
                                            <span className='font-bold text-base'>Trống phụ kiện</span>
                                        </div>
                                    }
                                    {loading === 1 &&
                                        <div className='flex flex-col space-y-2 justify-center items-center py-4 text-gray-400'>
                                            <ScaleLoader height={40} color='gray' />
                                            <span className='font-bold text-base'>Loading</span>
                                        </div>
                                    }
                                    <button onClick={e => handleChangeReport([...props.ReportItem.priceReport.accessories, getNewAcs()], "accessories")}
                                        className='inline-block w-full border-dashed border-2 border-gray-300 hover:bg-gray-900 text-gray-300 font-bold py-1 px-2 rounded'>
                                        + Thêm phụ kiện</button>
                                </div>
                                :
                                <div className='w-full py-10 flex flex-row font-bold text-gray-400 items-center justify-center space-x-2'>
                                    <PackageOpen />
                                    <span>Chọn mẫu cửa</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
