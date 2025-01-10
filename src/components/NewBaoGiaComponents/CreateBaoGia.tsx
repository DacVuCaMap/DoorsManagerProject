"use client"
import PriceReport, { createNewPriceReport } from '@/Model/PriceReport'
import React, { useEffect, useState } from 'react'
import CreateBaoGiaItem from './CreateBaoGiaItem';
import DoorNameSelect from '@/Model/DoorNameSelect';
import Accessories, { getNewAcsWithName } from '@/Model/Accessories';
import FireTest from '@/Model/FireTest';
import { DoorOpen, Filter, Save } from 'lucide-react';
import GroupAccessory from '@/Model/GroupAccessory';
import cmdData from '@/Model/cmdData';
import CreateBaoGiaTotalItem from './CreateBaoGiaTotalItem';
import { totalGroup } from '@/data/AddData';
import TotalGroup, { createNewTotalGroupArray } from '@/Model/TotalGroup';
import FireTestTotal from '@/Model/FireTestTotal';
import DataReport from '@/Model/DataReport';
import TotalItem, { createTotalItem } from '@/Model/TotalItem';
import { formatNumberToDot } from '@/data/FunctionAll';
import { message } from 'antd';
import PostPattern from '@/ApiPattern/PostPattern';
import { access } from 'fs';
import BGreadExcel from '../handleExcelComponent/BGreadExcel';
import { set } from 'lodash';
import FilterBaoGia from './FilterBaoGia';
import { motion } from 'framer-motion';

type Props = {
    groupAcsData: GroupAccessory[],
    acsData: Accessories[],
    doorModelData: any[]
}

export default function CreateBaoGia(props: Props) {
    // console.log(props.groupAcsData,3);
    // console.log(props.acsData,4);
    // console.log(props.doorModelData, 5);
    const [openFilter, setOpenFilter] = useState(false);
    const [listReport, setListReport] = useState<DataReport[]>([]);
    const [totalGroupItem, setTotalGroupItem] = useState<TotalGroup[]>(createNewTotalGroupArray());
    const [finalTotalArray, setFinalTotal] = useState<number[]>([0, 0, 0]);
    const [listAcsExist, setListAcsExist] = useState<Accessories[]>([]);
    const listGlassAcs: Accessories[] = props.groupAcsData.find(item => item.type === "glass")?.accessoriesAndType.map(acsAndType => {
        return acsAndType.accessories
    }) ?? [];
    const listNepAcs: Accessories[] = props.groupAcsData.find(item => item.type === "nep")?.accessoriesAndType.map(acsAndType => {
        return acsAndType.accessories
    }) ?? [];

    /// create total
    useEffect(() => {
        const getListAcsExist = () => {
            const tempAcsList: Accessories[] = [];
            listReport.forEach((item: DataReport, index) => {
                item.priceReport.accessories.forEach((acs: Accessories, childIndex) => {
                    const temp: Accessories | undefined = tempAcsList.find(acsChild => acsChild.id === acs.id);
                    if (!temp) {
                        tempAcsList.push(acs);
                    }
                })
            })
            setListAcsExist(tempAcsList);
        }
        getListAcsExist();
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
            let tot1 = 0;
            let tot2 = 0;
            listReport.map((item: DataReport) => {
                item.priceReport.accessories.map((childItem: Accessories) => {
                    tot1 += childItem.price * (childItem.quantity * item.priceReport.totalQuantity);
                })
                if (item.priceReport.mainAcs) {
                    tot1 += item.priceReport.mainAcs.totalQuantity * item.priceReport.mainAcs.price;
                }
            })
            totalGroupItem.map((item: TotalGroup) => {
                item.totalItem.map((childItem: TotalItem) => {
                    tot2 += childItem.price * childItem.totalQuantity;
                })
            })
            return tot1 * 0.1 + tot2 * 0.08;
        }
        return total + total * 0.1;
    }
    const handleSaveReport = async () => {
        if (listReport.length === 0) {
            message.error("Chưa có dữ liệu để lưu");
            return
        }
        const priceReports: any[] = [];
        const reportTotals: any[] = [];
        listReport.map((item: DataReport) => {
            const acsId = item.priceReport.accessories.map((childItem: Accessories) => childItem.id);
            const temp = {
                ...item.priceReport
                , doorModelId: item.priceReport.doorModel.id
                , mainAcsId: item.priceReport.mainAcs?.id
                , accessoriesId: acsId
            };
            priceReports.push(temp);
        })
        totalGroupItem[0].totalItem.map((item: TotalItem) => {
            const temp = { ...item, id: 0, groupName: totalGroupItem[0].name };
            reportTotals.push(temp);
        })
        const postData: any = {
            priceReports: priceReports,
            reportTotals: reportTotals
        }
        console.log(postData);
        const url = process.env.NEXT_PUBLIC_API_URL + "/api/excel/export";
        const response = await PostPattern(url, postData, {});
        console.log(response);
    }
    const handlePushToDataReport = (newDataReport: DataReport[]) => {
        const tempReport = [...listReport];
        tempReport.push(...newDataReport);
        setListReport(tempReport);
    }
    return (
        <div className='flex flex-col space-y-4 py-2'>



            <div className='w-[300px]'>
                {openFilter && <FilterBaoGia setDataReport={setListReport} acsData={props.acsData} setOpenFilter={setOpenFilter} openFilter={openFilter} listReport={listReport} />}
                <BGreadExcel acsData={props.acsData} doorModelData={props.doorModelData} groupAcsData={props.groupAcsData} handlePushToDataReport={handlePushToDataReport} />
            </div>
            <button className='bg-red-100 fixed top-64 right-4 p-10 bg-opacity-50' onClick={e => {console.log(listReport);console.log(totalGroupItem)}}>check gia tri</button>
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
                    <div className='w-1/12 p-2 text-center font-bold'>
                        <button className='py-2 font-semibold bg-blue-600 text-white rounded-xl w-full hover:bg-blue-900 flex flex-row space-x-2 justify-center items-center'
                            onClick={e => setOpenFilter(true)}>
                            <Filter />
                            <span>T.Quát</span>
                        </button>
                    </div>
                </div>
            </div >
            {listReport.map((item: DataReport, parentIndex: number) =>
                <div key={parentIndex}>
                    <CreateBaoGiaItem listNepAcs={listNepAcs} listGlassAcs={listGlassAcs} doorModelData={props.doorModelData} deleteDataReport={deleteDataReport} updateToParent={updateToParent}
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
                        <CreateBaoGiaTotalItem listAcsExist={listAcsExist} handleUpdateTotalList={handleUpdateTotalList} listReport={listReport} totalGroup={item} totalGroupIndex={index} />
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
                                {formatNumberToDot(handleUpdateFinalTotal(0).toFixed(0))}
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
                                {formatNumberToDot(handleUpdateFinalTotal(1).toFixed(0))}
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
                                {formatNumberToDot(handleUpdateFinalTotal(2).toFixed(0))}
                            </div>
                            <div className='w-1/12 p-2 text-center font-bold'></div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='px-2'>
                <button className='px-4 py-2 font-semibold bg-blue-600 text-white rounded-xl w-full hover:bg-blue-900 flex flex-row space-x-2 justify-center items-center' onClick={e => handleSaveReport()}>
                    <Save size={20} />
                    <span>Lưu</span>
                </button>
            </div>

        </div>

    )
}
