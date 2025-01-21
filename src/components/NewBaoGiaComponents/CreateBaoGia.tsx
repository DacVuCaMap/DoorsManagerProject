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
import { formatNumberToDot, LoadAccesoryGroupNoAcs, LoadAccessoriesDataOffline, LoadBaoGia, LoadListDoorModelData } from '@/data/FunctionAll';
import { message } from 'antd';
import PostPattern from '@/ApiPattern/PostPattern';
import { access } from 'fs';
import BGreadExcel from '../handleExcelComponent/BGreadExcel';
import { set } from 'lodash';
import FilterBaoGia from './FilterBaoGia';
import { motion } from 'framer-motion';
import axios from 'axios';
import { ScaleLoader } from 'react-spinners';

type Props = {
    groupAcsData: GroupAccessory[],
    acsData: Accessories[],
    doorModelData: any[]
}

export default function CreateBaoGia(props: Props) {
    // console.log(props.groupAcsData,3);
    // console.log(props.acsData,4);
    // console.log(props.doorModelData, 5);
    const [groupAcsData, setGroupAcsData] = useState<GroupAccessory[]>([]);
    const [acsData, setAcsData] = useState<Accessories[]>([]);
    const [doorModelData, setDoorModelData] = useState<any[]>([]);
    const [loadData, setLoadData] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            setLoadData(true); // Set loading state là true

            // try {
            //     // // Sử dụng Promise.all để chạy song song 3 API calls
            //     const [groupData, acsDataOffline, doorData] = await Promise.all([
            //         LoadAccesoryGroupNoAcs(),
            //         LoadAccessoriesDataOffline(),
            //         LoadListDoorModelData()
            //     ]);
            //     // Cập nhật state sau khi nhận dữ liệu
            //     setGroupAcsData(groupData);
            //     setAcsData(acsDataOffline);
            //     setDoorModelData(doorData);
            // } catch (error) {
            //     console.error('Error fetching data:', error);
            //     message.error('Lỗi kết nối server');
            // } finally {
            //     setLoadData(false);
            // }
            const response: any[] = await LoadBaoGia();
            setGroupAcsData(response[0]);
            setAcsData(response[1]);
            setDoorModelData(response[2]);
            setLoadData(false);
        }

        fetchData(); // Gọi fetchData khi component mount
    }, []);



    const [openFilter, setOpenFilter] = useState(false);
    const [listReport, setListReport] = useState<DataReport[]>([]);
    const [totalGroupItem, setTotalGroupItem] = useState<TotalGroup[]>(createNewTotalGroupArray());
    const [finalTotalArray, setFinalTotal] = useState<number[]>([0, 0, 0]);
    const [listAcsExist, setListAcsExist] = useState<Accessories[]>([]);
    const [loadingExportExcel, setLoadingExportExcel] = useState(false);
    const listGlassAcs: Accessories[] = groupAcsData.find(item => item.type === "glass")?.accessoriesAndType.map(acsAndType => {
        return acsAndType.accessories
    }) ?? [];
    const listNepAcs: Accessories[] = groupAcsData.find(item => item.type === "nep")?.accessoriesAndType.map(acsAndType => {
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
            if (item.priceReport.onGlass && item.priceReport.glassAcs) {
                total += item.priceReport.glassAcs.totalQuantity * item.priceReport.glassAcs.price;
            }
            if (item.priceReport.onGlass && item.priceReport.nepAcs) {
                total += item.priceReport.nepAcs.totalQuantity * item.priceReport.nepAcs.price;
            }
        })
        totalGroupItem.map((item: TotalGroup) => {
            item.totalItem.map((childItem: TotalItem) => {
                total += childItem.price * childItem.totalQuantity;
            })
        })
        let tot1 = 0;
        let tot2 = 0;
        listReport.map((item: DataReport) => {
            item.priceReport.accessories.map((childItem: Accessories) => {
                tot1 += childItem.price * (childItem.quantity * item.priceReport.totalQuantity);
            })
            if (item.priceReport.mainAcs) {
                tot1 += item.priceReport.mainAcs.totalQuantity * item.priceReport.mainAcs.price;
            }
            if (item.priceReport.onGlass && item.priceReport.glassAcs) {
                tot1 += item.priceReport.glassAcs.totalQuantity * item.priceReport.glassAcs.price;
            }
            if (item.priceReport.onGlass && item.priceReport.nepAcs) {
                tot1 += item.priceReport.nepAcs.totalQuantity * item.priceReport.nepAcs.price;
            }
        })
        totalGroupItem.map((item: TotalGroup) => {
            item.totalItem.map((childItem: TotalItem) => {
                tot2 += childItem.price * childItem.totalQuantity;
                tot1 += childItem.price * childItem.totalQuantity;
            })
        })
        if (num === 0) {
            return total;
        }
        if (num === 1) {

            return tot1 * 0.1 - tot2 * 0.02;
        }
        return total + tot1 * 0.1 - tot2 * 0.02;
    }
    const handleSaveReport = async () => {
        setLoadingExportExcel(true);
        if (listReport.length === 0) {
            message.error("Chưa có dữ liệu để lưu");
            setLoadingExportExcel(false);
            return
        }
        let tempTotal: TotalItem[] = totalGroupItem[0].totalItem;
        const priceReports: any[] = [];
        const reportTotals: any[] = [];
        listReport.map((item: DataReport, index) => {

            tempTotal = tempTotal.map(total => {
                if (total.typeQuantity != 0 && total.typeQuantity != -1) {
                    const checkTotal = item.priceReport.accessories.find(acsItem => acsItem.id === parseFloat(total.typeQuantity));
                    if (checkTotal) {
                        const tempTotalIndex = total.totalItemIndex ?? [];
                        tempTotalIndex.push(index)
                        return { ...total, totalItemIndex: tempTotalIndex }
                    }
                }
                return total;
            })

            const newAcs: Accessories[] = { ...item.priceReport }.accessories.filter(acs => acs.type != "cost")
            if (item.priceReport.onGlass && item.priceReport.glassAcs && item.priceReport.nepAcs) {
                newAcs.push(item.priceReport.glassAcs, item.priceReport.nepAcs);
            }
            const tempPriceReport: PriceReport = { ...item.priceReport, accessories: newAcs, eiString: item.priceReport.EI ?? "" };
            const acsId = item.priceReport.accessories.map((childItem: Accessories) => childItem.id);
            const temp = {
                ...tempPriceReport
                , doorModelId: item.priceReport.doorModel.id
                , mainAcsId: item.priceReport.mainAcs?.id
                , accessoriesId: acsId
            };
            priceReports.push(temp);
        })
        tempTotal.map((item: TotalItem) => {
            const temp = { ...item, id: 0, groupName: totalGroupItem[0].name };
            reportTotals.push(temp);
        })
        const postData: any = {
            priceReports: priceReports,
            reportTotals: reportTotals
        }
        console.log(postData);
        const url = process.env.NEXT_PUBLIC_API_URL + "/api/excel/export";
        const response = await axios.post(url, postData, {
            responseType: 'blob'
        });
        setLoadingExportExcel(false);
        if (response && response.data) {
            const blob = response.data;  // response.data chứa Blob

            // Tạo URL cho file Blob
            const fileURL = window.URL.createObjectURL(blob);

            // Tạo một thẻ <a> để kích hoạt download
            const a = document.createElement("a");
            a.href = fileURL;
            a.download = "example_output.xlsx";  // Đặt tên file muốn tải về
            document.body.appendChild(a);
            a.click();  // Kích hoạt tải về

            // Xoá thẻ <a> sau khi tải về
            document.body.removeChild(a);
            window.URL.revokeObjectURL(fileURL);  // Giải phóng URL tạm thời
        } else {
            console.error("Error: No file data found in the response");
            message.error("Lỗi xuất excel");
        }
    }
    const handlePushToDataReport = (newDataReport: DataReport[]) => {
        const tempReport = [...listReport];
        tempReport.push(...newDataReport);
        setListReport(tempReport);
    }
    return (
        <div className='flex flex-col space-y-4 py-2'>
            {/* <button className='bg-red-100 fixed top-64 right-4 p-10 bg-opacity-50' onClick={e => { console.log(listReport); console.log(totalGroupItem) }}>
                check gia tri</button> */}
            {loadingExportExcel &&
                <div className='fixed h-screen w-screen bg-black bg-opacity-50 z-50 top-0 flex justify-center items-center flex-col'>
                    <ScaleLoader color='white' width={20} />
                    <span className='text-white font-mono'>Đang xuất excel...</span>
                </div>
            }
            {loadData &&
                <div className='fixed h-20 w-64 bg-black bg-opacity-50 z-50 top-20 right-10 flex justify-center items-center flex-col'>
                    <ScaleLoader color='white' width={12} />
                    <span className='text-white font-mono'>Tải dữ liệu...</span>
                </div>
            }
            <div className='w-[300px]'>
                {openFilter && <FilterBaoGia handleUpdateTotalList={handleUpdateTotalList} totalGroup={totalGroupItem[0]} setDataReport={setListReport} acsData={acsData} setOpenFilter={setOpenFilter} openFilter={openFilter} listReport={listReport} />}
                <BGreadExcel acsData={acsData} doorModelData={doorModelData} groupAcsData={groupAcsData} handlePushToDataReport={handlePushToDataReport} />
            </div>
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
                            onClick={e => { setOpenFilter(true); document.body.style.overflow = 'hidden'; }}>
                            <Filter />
                            <span>T.Quát</span>
                        </button>
                    </div>
                </div>
            </div >
            {listReport.map((item: DataReport, parentIndex: number) =>
                <div key={parentIndex}>
                    <CreateBaoGiaItem listNepAcs={listNepAcs} listGlassAcs={listGlassAcs} doorModelData={doorModelData} deleteDataReport={deleteDataReport} updateToParent={updateToParent}
                        parentIndex={parentIndex} ReportItem={item}
                        groupAcsData={groupAcsData} acsData={acsData} />
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
