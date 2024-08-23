import DoorNameSelect from '@/Model/DoorNameSelect';
import PriceReport from '@/Model/PriceReport';
import React, { useEffect, useRef, useState } from 'react'
import "./CreateBaoGiaItem.css"
import { ChevronDown, PackageOpen, Trash2 } from 'lucide-react';
import Accessories, { getNewAcs, TransRequestToAcs } from '@/Model/Accessories';
import InputSearchPDC from './InputSearchPDC';
import FireTest from '@/Model/FireTest';
import CreateBaoGiaMainAcs from './CreateBaoGiaMainAcs';
import DataReport from '@/data/DataReport';
import GroupAccessory from '@/Model/GroupAccessory';
import cmdData from '@/Model/cmdData';
import CreateBaoGiaSecondAcs from './CreateBaoGiaSecondAcs';
import GetPattern from '@/ApiPattern/GetPattern';
import PostPattern from '@/ApiPattern/PostPattern';
import { ScaleLoader } from 'react-spinners';
import { extractFirstNumber, extractNumber, formatNumberFixed3, formatNumberToDot } from '@/data/FunctionAll';
import FireTestCondition from '@/Model/FireTestCondition';
type fireTestGroup = {
    id: any,
    fireTest: FireTest[]
}
type Props = {
    parentIndex: number;
    ReportItem: DataReport;
    doorNameSelectData: DoorNameSelect[];
    fireTest: fireTestGroup[];
    commandData: cmdData[];
    updateToParent: (childItem: DataReport, parentIndex: number) => void;
    groupAcsData: GroupAccessory[],
    acsData: Accessories[],
    deleteDataReport: (parentIndex: number) => void;
}
export default function CreateBaoGiaItem(props: Props) {
    const [curSelectDoorName, setCurSelectDoorName] = useState<DoorNameSelect>(new DoorNameSelect("", "", [], [], [], ""));
    const [mainAcsName, setMainAcsName] = useState("");
    const [cmdToLoad, setCmdToLoad] = useState<string[]>([]);
    const [loading, setLoading] = useState(0);

    const handleSetCmd = (cmd: string[], mainAcsId: any) => {
        //set doorNameSelectId
        let doorNameSelect: DoorNameSelect | undefined = props.doorNameSelectData.find(item => item.name === cmd[0]);
        //set name
        if (doorNameSelect) {
            let name = props.groupAcsData.find(item => item.id === mainAcsId)?.name ?? "";
            setMainAcsName(name);
            setCurSelectDoorName(doorNameSelect);
            handleChangeReport("", "fireTestCode");
            let newPriceReport: PriceReport = { ...props.ReportItem.priceReport, name: cmd.join(" "), doorNameSelectId: doorNameSelect.id }
            let newReportItem : DataReport  = {...props.ReportItem,priceReport:newPriceReport,fireTestCondition:handleSetFireTest(newPriceReport)}
            // updateWithPriceReport(newPriceReport);
            console.log(newReportItem)
            props.updateToParent(newReportItem,props.parentIndex); 
            setCmdToLoad(cmd);
        }
    }

    const handleChangeReport = (value: any, key: string) => {
        let newPriceReport: PriceReport = { ...props.ReportItem.priceReport }
        if (key === "width" || key === "height" || key === "totalQuantity") {
            value = value === "" ? 0 : value;
            value = parseFloat(value);
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
    const handleCalTotalPrice = (reportItem: DataReport) => {
        if (reportItem.mainAccessory) {
            let totMain = reportItem.mainAccessory.price * reportItem.mainAccessory.totalQuantity;
            let totAcs = reportItem.priceReport.accessories.reduce((tot, acs) => {
                return tot + (acs.price * acs.totalQuantity);
            }, 0);
            return formatNumberFixed3(formatNumberToDot(totMain + totAcs));
        }
        else {
            return 0;
        }
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
   
    /////FIRETEST SET VALUE
    const handleSetFireTest = (priceReport: PriceReport) : FireTestCondition => {
        let newFireTestCondition: FireTestCondition = {...props.ReportItem.fireTestCondition };
        if (priceReport.doorNameSelectId) {
            for (const item of props.fireTest) {
                const fireTest = item.fireTest.find(childItem => {
                    const arrStr = childItem.name.split('./');
                    return (
                        childItem.doorNameSelectId === priceReport.doorNameSelectId &&
                        priceReport.name.includes(`${arrStr[1]} ${arrStr[0]}`)
                    );
                });
                if (fireTest) {
                    newFireTestCondition = {fireTestGroupId: item.id,fireTest: fireTest,status: false};
                    break;
                }
            }
        }
        return newFireTestCondition;
    }
    /// check width, height and thickness
    const handleCheckValueFireTestCondition = ()=>{
        ///panic đôi and panic đơn
        
        //other
        if (props.ReportItem.mainAccessory) {
            let thisThickness = extractFirstNumber(props.ReportItem.mainAccessory.code);
            if (thisThickness) {
                
            }
        }
    }

    //update width height mainAcs
    useEffect(() => {
        if (props.ReportItem.mainAccessory) {
            let quan = (props.ReportItem.priceReport.width / 1000) * (props.ReportItem.priceReport.height / 1000);
            let newMainAcs: Accessories = {
                ...props.ReportItem.mainAccessory, width: props.ReportItem.priceReport.width,
                height: props.ReportItem.priceReport.height,
                quantity: quan,
                totalQuantity: quan * props.ReportItem.priceReport.totalQuantity
            }
            handleChangeDataReport(newMainAcs, "mainAccessory");
        }
    }, [props.ReportItem.priceReport.width, props.ReportItem.priceReport.height, props.ReportItem.priceReport.totalQuantity, props.ReportItem.mainAccessory?.name])
    useEffect(() => {
        //add phu kien
        const fetchData = async () => {
            let acs: Accessories[] = [];
            const command = cmdToLoad.join("-")
            let url = process.env.NEXT_PUBLIC_API_URL + "/api/product-command/get-command?command=" + command;
            setLoading(1);
            const response = await GetPattern(url, {});
            if (response && response.value) {

                acs = response.value.map((item: any) => {
                    return { ...TransRequestToAcs(item.accessoryGroup.accessories[0]), quantity: item.quantity };
                })
                let oldAcs: Accessories[] = [...props.ReportItem.priceReport.accessories];
                oldAcs = oldAcs.filter(item => !item.isCommand);
                let newPriceReport: PriceReport = { ...props.ReportItem.priceReport, accessories: [...oldAcs, ...acs] }
                updateWithPriceReport(newPriceReport);
                setLoading(0);
            }
        }
        if (cmdToLoad.length > 0) {
            fetchData();
        }
    }, [cmdToLoad])
    
    ///update fireTestCondition
    useEffect(()=>{

    },[props.ReportItem.priceReport.width,props.ReportItem.priceReport.height,props.ReportItem.mainAccessory?.name])


    ///check fireTestCondition to set status
    useEffect(()=>{
        let status=false;
        if (props.ReportItem.fireTestCondition.fireTest && props.ReportItem.fireTestCondition.fireTestGroupId!="") {
            status=true;
        }
        let newFireTestCondition : FireTestCondition = {...props.ReportItem.fireTestCondition,status:status};
        console.log(newFireTestCondition);
        handleChangeDataReport(newFireTestCondition,"fireTestCondition");
    },[props.ReportItem.fireTestCondition.fireTest,props.ReportItem.fireTestCondition.fireTestGroupId])

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
                        <InputSearchPDC name={props.ReportItem.priceReport.name} handleChangeReport={handleChangeReport} commandData={props.commandData} handleSetCMD={handleSetCmd} />
                        {curSelectDoorName.code.length > 0 &&
                            <select className='rounded' name="" id="" onChange={e => handleChangeReport(e.target.value, "fireTestCode")} value={props.ReportItem.priceReport.fireTestCode}>
                                <option value="" disabled hidden>-chọn-</option>
                                {curSelectDoorName.code.map((item: string, ind: number) => (
                                    <option key={ind} value={item}>{item}</option>
                                ))}
                            </select>
                        }
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
                        <span className='w-full'>{props.ReportItem.priceReport.totalQuantity === 0 ? 0 : handleCalTotalPrice(props.ReportItem) / props.ReportItem.priceReport.totalQuantity}</span>
                    </div>
                    <div className='overflow-auto w-1/12 p-2 text-center font-bold '>
                        <span className='w-full'>{handleCalTotalPrice(props.ReportItem)}</span>
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
                {props.ReportItem.priceReport.doorNameSelectId ?
                    <CreateBaoGiaMainAcs handleSetAcsMain={handleChangeDataReport} parentIndex={props.parentIndex} ReportItem={props.ReportItem} name={mainAcsName} />
                    :
                    <div className='flex flex-row px-2'>
                        <div className='w-1/12 p-2 text-center font-bold'></div>
                        <div className='w-11/12 flex flex-row items-center py-1 bg-gray-600'>
                            <div className='w-full flex flex-row font-bold text-gray-400 items-center justify-center space-x-2'>
                                <PackageOpen />
                                <span>Chọn tên qui cách cửa</span>
                            </div>
                        </div>
                    </div>
                }



                <span className='border-b border-gray-400 ml-4 text-gray-400 text-xs'>Phụ kiện và chi phí kèm theo</span>
                <div>
                    {props.ReportItem.priceReport.accessories.map((item: Accessories, index: number) =>
                        <div key={index} className='flex flex-row px-2'>
                            <div className='w-1/12 p-2 text-center font-bold'>{props.parentIndex + 1},{3 + index}</div>
                            <CreateBaoGiaSecondAcs ReportItem={props.ReportItem} acsIndex={index} handleChangeAcsList={handleChangeAcsList} acsData={props.acsData} />
                        </div>
                    )}

                    <div className='flex flex-row px-2'>
                        <div className='w-1/12 p-2 text-center font-bold'></div>
                        <div className='w-11/12 flex flex-row items-center bg-gray-600'>
                            {props.ReportItem.priceReport.doorNameSelectId ?
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
                                <div className='w-full py-1 flex flex-row font-bold text-gray-400 items-center justify-center space-x-2'>
                                    <PackageOpen />
                                    <span>Chọn tên qui cách cửa</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
