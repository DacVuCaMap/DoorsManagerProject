"use client"
import PriceReport from '@/Model/PriceReport'
import React, { useEffect, useState } from 'react'
import CreateBaoGiaItem from './CreateBaoGiaItem';
import DoorNameSelect from '@/Model/DoorNameSelect';
import Accessories, { getNewAcsWithName } from '@/Model/Accessories';
import FireTest from '@/Model/FireTest';
import { DoorOpen } from 'lucide-react';
import { TransToFireTestCondition } from '@/data/BaoGiaFunction';
import DataReport from '@/data/DataReport';
import GroupAccessory from '@/Model/GroupAccessory';
import cmdData from '@/Model/cmdData';
import CreateBaoGiaTotalItem from './CreateBaoGiaTotalItem';
import { totalGroup } from '@/data/AddData';
import TotalGroup from '@/Model/TotalGroup';
import FireTestTotal from '@/Model/FireTestTotal';

type fireTestGroup = {
    id: any,
    fireTest: FireTest[]
}
type Props = {
    doorNameSelectData: DoorNameSelect[],
    commandData: cmdData[],
    fireTest: fireTestGroup[],
    groupAcsData: GroupAccessory[],
    acsData: Accessories[]
}
export default function CreateBaoGia(props: Props) {
    /// update in future
    // console.log(props.fireTest)
    const [totalGroupItem,setTotalGroupItem]= useState<TotalGroup[]>(totalGroup(props.acsData));
    const [fireTestGroupTotal,setFireTestGroupTotal] = useState<FireTestTotal>(new FireTestTotal("",getNewAcsWithName("Chi phí hồ sơ kiểm định"),[]));
    ///
    const listCondition = TransToFireTestCondition(props.fireTest);
    const [listReport, setListReport] = useState<DataReport[]>([]);
    const newPriceReport: PriceReport = new PriceReport("", 0, "", "", "", "", 0, 0, 1, 0, "Bộ", null, null, [], []);
    const handleAddNewReport = () => {
        let newReport: DataReport = {
            priceReport: newPriceReport, isShowDetails: true, status: false, fireTestCondition: {fireTestGroupId:"",fireTest:null,status:false},
            mainAccessory: null
        };
        setListReport([...listReport, newReport])
    }

    const updateToParent = (childItem: DataReport, parentIndex: number) => {
        setListReport(prevListReport => {
            let temp = [...prevListReport];
            temp[parentIndex] = childItem;
            return temp;
        });
    }
    const deleteDataReport = (parentIndex: number) => {
        let temp: DataReport[] = listReport.filter((item: any, index: number) => index != parentIndex);
        setListReport(temp);
    }
    const handleUpdateTotalList = (totalItem:TotalGroup,totalItemIndex:number) =>{
        // console.log(totalItem);
        setTotalGroupItem(prevList=>{
            let temp = [...totalGroupItem];
            temp[totalItemIndex] = totalItem;
            return temp
        })
    }
    return (
        <div className='flex flex-col space-y-4 py-2'>
            <div className='flex flex-row bg-slate-950 border-b px-2 border-gray-500 shadow-xl text-white sticky z-20 top-0'>
                <div className='w-1/12 p-2 text-center font-bold'>STT</div>
                <div className='w-11/12 flex flex-row'>
                    <div className='w-4/12 p-2 text-center font-bold'>Tên</div>
                    <div className='w-1/12 p-2 text-center font-bold'>Mã</div>
                    <div className='w-2/12 p-2 text-center font-bold flex flex-col '>
                        <span>Kích thước</span>
                        <div className='flex flex-row space-x-2'>
                            <span className='w-1/2'>Rộng</span>
                            <span className='w-1/2'>Dài</span>
                        </div>
                    </div>
                    <div className='w-2/12 p-2 text-center font-bold flex flex-col '>
                        <span>Kích thước</span>
                        <div className='flex flex-row space-x-2'>
                            <span className='w-1/2'>Sl/1 cấu kiện</span>
                            <span className='w-1/2'>Tổng KL</span>
                        </div>
                    </div>
                    <div className='w-1/12 p-2 text-center font-bold'>Đơn giá</div>
                    <div className='w-1/12 p-2 text-center font-bold'>Tổng giá</div>
                    <div className='w-1/12 p-2 text-center font-bold'></div>
                </div>
            </div >
            {listReport.map((item: DataReport, parentIndex: number) =>
                <div key={parentIndex}>
                    <CreateBaoGiaItem fireTest={props.fireTest} deleteDataReport={deleteDataReport} updateToParent={updateToParent} doorNameSelectData={props.doorNameSelectData}
                        parentIndex={parentIndex} ReportItem={item} commandData={props.commandData}
                        groupAcsData={props.groupAcsData} acsData={props.acsData} />
                </div>
            )}
            {listReport.length === 0 && <div className="flex flex-col items-center text-gray-500 justify-center">
                <DoorOpen size={150} className='' />
                <span>Trống chưa thêm dữ liệu</span>
            </div>}
            <div className='px-8 w-full'>
                <button type='button' className="inline-block w-full border-dashed border-2 border-gray-300 hover:bg-gray-700 text-gray-300 font-bold py-1 px-2 rounded"
                    onClick={(e) => handleAddNewReport()}>+ Thêm cửa</button>
            </div>
            <div className='w-full px-2 py-2 flex flex-col text-gray-300 space-y-4'>
                <span className='font-bold border-b'>PHẦN CHUNG</span>
                {totalGroupItem.map((item: TotalGroup, index: number) =>
                    <div key={index}>
                        <CreateBaoGiaTotalItem handleUpdateTotalList={handleUpdateTotalList} listReport={listReport} totalGroup={item} totalGroupIndex={index}/>
                    </div>
                )}
                <div>
                    
                </div>
            </div>

        </div>

    )
}
