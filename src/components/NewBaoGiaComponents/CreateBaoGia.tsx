"use client"
import PriceReport, { createNewPriceReport } from '@/Model/PriceReport'
import React, { useEffect, useState } from 'react'
import CreateBaoGiaItem from './CreateBaoGiaItem';
import DoorNameSelect from '@/Model/DoorNameSelect';
import Accessories, { getNewAcsWithName } from '@/Model/Accessories';
import FireTest from '@/Model/FireTest';
import { DoorOpen } from 'lucide-react';
import GroupAccessory from '@/Model/GroupAccessory';
import cmdData from '@/Model/cmdData';
import CreateBaoGiaTotalItem from './CreateBaoGiaTotalItem';
import { totalGroup } from '@/data/AddData';
import TotalGroup, { createNewTotalGroupArray } from '@/Model/TotalGroup';
import FireTestTotal from '@/Model/FireTestTotal';
import DataReport from '@/Model/DataReport';
import TotalItem, { createTotalItem } from '@/Model/TotalItem';
import { formatNumberToDot } from '@/data/FunctionAll';

type Props = {
    groupAcsData: GroupAccessory[],
    acsData: Accessories[],
    doorModelData: any[]
}

export default function CreateBaoGia(props: Props) {
    // console.log(props.groupAcsData,3);
    // console.log(props.acsData,4);
    // console.log(props.doorModelData,5);
    const [listReport, setListReport] = useState<DataReport[]>([]);
    const [totalGroupItem, setTotalGroupItem] = useState<TotalGroup[]>(createNewTotalGroupArray());
    const [finalTotalArray, setFinalTotal] = useState<number[]>([0, 0, 0]);
    /// create total
    useEffect(() => {
        const updateTotal = () => {
            console.log("update total");
            let tempTotalGroup: TotalGroup[] = [...totalGroupItem];
            if (tempTotalGroup.length === 0) {
                tempTotalGroup = [new TotalGroup(0, [], "Chi chí chung")]
            }
            /// SUM mainAcs
            const totalMainQuantity = listReport.reduce((total: number, item: DataReport) => {
                if (item.priceReport.mainAcs) {
                    return total + item.priceReport.mainAcs.totalQuantity;
                }
                return total;
            }, 0)

            let newTotalItemList: TotalItem[] = tempTotalGroup[0].totalItem.map((item: TotalItem) => {
                if (item.code === "CPV" || item.code === "CPLD") {
                    return { ...item, totalQuantity: totalMainQuantity };
                }
                return item;
            });
            tempTotalGroup = tempTotalGroup.map((item: TotalGroup, index) => {
                if (index === 0) {
                    return { ...item, totalItem: newTotalItemList };
                }
                return item;
            })
            setTotalGroupItem(tempTotalGroup);
        }
        updateTotal();
    }, [listReport])

    const handleAddNewReport = () => {
        const tempReport: PriceReport = createNewPriceReport();
        const newReport: DataReport = { priceReport: tempReport, isShowDetails: false, status: false }
        const tempList: DataReport[] = [...listReport];
        tempList.push(newReport);
        setListReport(tempList);
    }
    const deleteDataReport = (delIndex: number) => {
        const newDataReport: DataReport[] = listReport.filter((item: DataReport, index) => index !== delIndex);
        setListReport(newDataReport);
    }
    const handleUpdateTotalList = (totalGroup: TotalGroup, totalGroupIndex: number) => {
        const newTotalGroup: TotalGroup[] = totalGroupItem.map((item: TotalGroup, index) => {
            if (index === totalGroupIndex) {
                return totalGroup;
            }
            return item;
        })
        setTotalGroupItem(newTotalGroup);
    }
    const updateToParent = (newItem: DataReport, childIndex: number) => {
        const newDataReport: DataReport[] = listReport.map((item: DataReport, index) => {
            if (index === childIndex) {
                return newItem;
            }
            return item;
        })
        setListReport(newDataReport);
    }
    const handleUpdateFinalTotal = (num: number) => {
        let total = 0;
        listReport.map((item: DataReport) => {
            item.priceReport.accessories.map((childItem: Accessories) => {
                total += childItem.price * (childItem.quantity * item.priceReport.totalQuantity);
            })
            if (item.priceReport.mainAcs) {
                total += item.priceReport.mainAcs.totalQuantity * item.priceReport.mainAcs.price;
            }
        })
        totalGroupItem.map((item: TotalGroup) => {
            item.totalItem.map((childItem: TotalItem) => {
                total += childItem.price * childItem.totalQuantity;
            })
        })
        if (num === 0) {
            return total;
        }
        if (num === 1) {
            return total * 0.08;
        }
        return total + total * 0.08;
    }
    return (
        <div className='flex flex-col space-y-4 py-2'>
            <button className='bg-red-100 fixed top-4 right-4 p-10' onClick={e => console.log(listReport)}>check gia tri</button>
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
                    <CreateBaoGiaItem doorModelData={props.doorModelData} deleteDataReport={deleteDataReport} updateToParent={updateToParent}
                        parentIndex={parentIndex} ReportItem={item}
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
            <div className='h-10'></div>

            <div className='w-full px-2 py-2 flex flex-col text-gray-300 space-y-4'>
                <span className='font-bold border-b'>PHẦN CHUNG</span>
                {totalGroupItem.map((item: TotalGroup, index: number) =>
                    <div key={index}>
                        <CreateBaoGiaTotalItem handleUpdateTotalList={handleUpdateTotalList} listReport={listReport} totalGroup={item} totalGroupIndex={index} />
                    </div>
                )}

                <div className='create-bg-total font-bold'>
                    <div className='mb-2'>
                        <span className='border-b border-gray-500 text-gray-400'>Tổng Báo Giá</span>
                    </div>
                    <div className='bg-gray-900 w-full flex flex-row hover:bg-gray-800'>
                        <div className='w-1/12 p-2 flex text-center font-bold justify-center items-center'>I</div>
                        <div className='w-11/12 flex flex-row items-center py-1'>
                            <div className='w-4/12 p-2 font-bold'>TỔNG HÀNG HÓA</div>
                            <div className='w-6/12 p-2 text-center font-bold'></div>
                            <div className='w-1/12 p-2 text-center font-bold'>
                                {formatNumberToDot(handleUpdateFinalTotal(0))}
                            </div>
                            <div className='w-1/12 p-2 text-center font-bold'></div>
                        </div>
                    </div>
                    <div className='bg-gray-900 w-full flex flex-row hover:bg-gray-800'>
                        <div className='w-1/12 p-2 flex text-center font-bold justify-center items-center'>II</div>
                        <div className='w-11/12 flex flex-row items-center py-1'>
                            <div className='w-4/12 p-2 font-bold'>THUẾ VAT</div>
                            <div className='w-6/12 p-2 text-center font-bold'></div>
                            <div className='w-1/12 p-2 text-center font-bold'>
                                {formatNumberToDot(handleUpdateFinalTotal(1))}
                            </div>
                            <div className='w-1/12 p-2 text-center font-bold'></div>
                        </div>
                    </div>
                    <div className='bg-gray-900 w-full flex flex-row hover:bg-gray-800'>
                        <div className='w-1/12 p-2 flex text-center font-bold justify-center items-center'>III</div>
                        <div className='w-11/12 flex flex-row items-center py-1'>
                            <div className='w-4/12 p-2 font-bold'>TỔNG CỘNG (ĐÃ BAO GỒM THUẾ VAT)</div>
                            <div className='w-6/12 p-2 text-center font-bold'></div>
                            <div className='w-1/12 p-2 text-center font-bold'>
                                {formatNumberToDot(handleUpdateFinalTotal(2))}
                            </div>
                            <div className='w-1/12 p-2 text-center font-bold'></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>

    )
}
