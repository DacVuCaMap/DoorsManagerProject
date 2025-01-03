
import PriceReport from '@/Model/PriceReport';
import React, { useEffect, useRef, useState } from 'react'
import "./CreateBaoGiaItem.css"
import { ChevronDown, PackageOpen, Trash2 } from 'lucide-react';
import Accessories, { getNewAcs, TransRequestToAcs } from '@/Model/Accessories';
import InputSearchPDC from './InputSearchPDC';
import GroupAccessory from '@/Model/GroupAccessory';
import DataReport from '@/Model/DataReport';
import { listEI } from '@/data/ListData';
import CreateBaoGiaMainAcs from './CreateBaoGiaMainAcs';
import CreateBaoGiaSecondAcs from './CreateBaoGiaSecondAcs';
import { ScaleLoader } from 'react-spinners';
import { formatNumberFixed3, formatNumberToDot } from '@/data/FunctionAll';
type Props = {
    parentIndex: number;
    doorModelData: any[],
    ReportItem: DataReport;
    updateToParent: (childItem: DataReport, parentIndex: number) => void;
    groupAcsData: GroupAccessory[],
    acsData: Accessories[],
    deleteDataReport: (parentIndex: number) => void;
}
export default function CreateBaoGiaItem(props: Props) {
    const [loading, setLoading] = useState(0);

    useEffect(() => {
        const updateMainAcsItemTotalQuantity = () => {
            
            if (props.ReportItem.priceReport.mainAcs) {
                const tempMainAcs: Accessories = {
                    ...props.ReportItem.priceReport.mainAcs
                    , totalQuantity:formatNumberFixed3(props.ReportItem.priceReport.width / 1000 * props.ReportItem.priceReport.height / 1000 * props.ReportItem.priceReport.totalQuantity)
                };
                console.log("up", tempMainAcs);
                handleChangeReport(tempMainAcs,"mainAcs");
            }

        }
        updateMainAcsItemTotalQuantity();
    }, [props.ReportItem.priceReport.width, props.ReportItem.priceReport.height, props.ReportItem.priceReport.totalQuantity,props.ReportItem.priceReport.mainAcs?.name])


    const handleSelectDoorModel = (doorModelItem: any, newPriceReport: PriceReport) => {
        const acsList: Accessories[] = [];
        /// get list acs
        console.log(doorModelItem);
        if (doorModelItem.accessoryAndFeatures && doorModelItem.accessoryAndFeatures.length > 0) {
            doorModelItem.accessoryAndFeatures.map((item: any) => {
                const acsExisted: GroupAccessory | null = props.groupAcsData.find((acsGroup: GroupAccessory) => acsGroup.id === item.accessoryGroupId) ?? null;
                if (acsExisted && acsExisted.accessoriesAndType.length > 0) {
                    acsList.push({ ...acsExisted.accessoriesAndType[0].accessories, quantity: item.quantity });
                }
            })
        }
        newPriceReport = {
            ...newPriceReport,
            doorModel: doorModelItem,
            name: doorModelItem.name ? doorModelItem.name : newPriceReport.name,
            accessories: acsList
        };
        console.log(newPriceReport);
        updateWithPriceReport(newPriceReport);
    }

    const handleChangeReport = (value: any, key: string) => {
        let newPriceReport: PriceReport = { ...props.ReportItem.priceReport }
        if (key === "width" || key === "height" || key === "totalQuantity") {
            value = value === "" ? 0 : value;
            value = parseFloat(value);
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
            let newAcsList: Accessories[] = [...props.ReportItem.priceReport.accessories];
            newAcsList[acsIndex] = acs;
            handleChangeReport(newAcsList, "accessories");
        }

    }
    const handleCalTotalPrice = () : number => {
        let total = 0;
        props.ReportItem.priceReport.accessories.map((item: Accessories) => {
            total += item.price * (item.quantity * props.ReportItem.priceReport.totalQuantity);
        })
        if (props.ReportItem.priceReport.mainAcs) {
            total += props.ReportItem.priceReport.mainAcs.totalQuantity * props.ReportItem.priceReport.mainAcs.price;
            
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
    return (
        <div className='w-full px-4 transition-all ease-in-out duration-300 hover:px-0 create-bg text-sm text-gray-300 group'>
            <div className='ml-2 flex flex-row space-x-2 text-xs'>
                <span className='text-red-500 border-l border-red-500 px-2'>Chưa có mẫu kiểm định phù hợp</span>
                <span className='text-red-500 border-l border-red-500 px-2'>Thiếu dữ liệu nhập vào</span>
            </div>
            <div onClick={showDetails} className={`flex flex-row justify-center items-center py-2 bg-gray-800 transition-all ease-in-out duration-300 
                group-hover:rounded-none group-hover:py-4 hover:bg-gray-900 hover:cursor-pointer ${props.ReportItem.isShowDetails ? 'rounded-t-lg' : 'rounded-lg'}`}>
                <div className='w-1/12 text-center font-bold inline-block'>{props.parentIndex + 1}</div>
                <div className='w-11/12 flex flex-row items-center'>
                    <div className='w-4/12 p-2 text-center flex flex-row space-x-2 font-bold'>
                        <InputSearchPDC doorModelData={props.doorModelData} name={props.ReportItem.priceReport.name} handleChangeReport={handleChangeReport} />
                        <select className='rounded' name="" id="" onChange={e => handleChangeReport(e.target.value, "EI")} value={props.ReportItem.priceReport.EI}>
                            <option value="" disabled hidden>-chọn-</option>
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
                        <span className='w-full'>{props.ReportItem.priceReport.totalQuantity === 0 ? 0 :  formatNumberToDot(handleCalTotalPrice() /props.ReportItem.priceReport.totalQuantity)}</span>
                    </div>
                    <div className='overflow-auto w-1/12 p-2 text-center font-bold '>
                        <span className='w-full'>{formatNumberToDot(handleCalTotalPrice())}</span>
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
                    {props.ReportItem.priceReport.accessories.map((item: Accessories, index: number) =>
                        <div key={index} className='flex flex-row px-2'>
                            <div className='w-1/12 p-2 text-center font-bold'>{props.parentIndex + 1},{3 + index}</div>
                            <CreateBaoGiaSecondAcs ReportItem={props.ReportItem} acsIndex={index} handleChangeAcsList={handleChangeAcsList} acsData={props.acsData} />
                        </div>
                    )}

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
