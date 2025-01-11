"use client"
import Accessories from '@/Model/Accessories';
import DataReport from '@/Model/DataReport';
import GroupAccessory from '@/Model/GroupAccessory';
import PriceReport, { createNewPriceReport } from '@/Model/PriceReport';
import { message } from 'antd';
import { Upload } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react'
import { json } from 'stream/consumers';
import * as XLSX from 'xlsx';
type Props = {
    doorModelData: any[];
    groupAcsData: GroupAccessory[];
    handlePushToDataReport(newDataReport: DataReport[]): void;
    acsData: Accessories[],
}
export default function BGreadExcel(props: Props) {
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = (event) => {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                const worksheet = workbook.Sheets["Thống kê"];

                // Kiểm tra xem sheet có tồn tại không
                if (worksheet && worksheet['!ref']) {
                    const range = XLSX.utils.decode_range(worksheet['!ref']);
                    range.s.r = 1;

                    // Chuyển dữ liệu trong sheet thành dạng JSON từ hàng 2
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { range: range, header: 1 }); // `header: 1` để lấy dữ liệu theo dạng mảng
                    if (Array.isArray(jsonData) && jsonData.length > 0) {
                        handleExcelToDataReprot(jsonData);
                    }
                } else {
                    message.error('Không tìm thấy sheet');
                }
            };

            // Đọc file dưới dạng ArrayBuffer
            reader.readAsArrayBuffer(file);
        }
    }
    const handleExcelToDataReprot = (jsonData: any) => {
        const dataReport: DataReport[] = [];
        console.log(jsonData);
        for (let i = 0; i < jsonData.length; i++) {

            if (jsonData[i].length > 9 && jsonData[i][7] && jsonData[i][4] && jsonData[i][6] && jsonData[i][8]) {
                let tempReport: PriceReport = createNewPriceReport();
                const doorModelItem = props.doorModelData.find((item: any) => item.shortName === jsonData[i][7]) ?? null;
                // console.log(jsonData[i][1],jsonData[i][3]);
                if (doorModelItem) {
                    const h = jsonData[i][10] ? parseFloat(jsonData[i][10]) : 0;
                    const w = jsonData[i][11] ? parseFloat(jsonData[i][11]) : 0;
                    const quanNep = jsonData[i][12] ? parseFloat(jsonData[i][12]) : 0;
                    const totalQuanItem = jsonData[i][6] ? parseFloat(jsonData[i][6]) : 0;
                    tempReport = updatePriceReport(doorModelItem, tempReport,w,h,quanNep,totalQuanItem);
                    tempReport = { ...tempReport, code: jsonData[i][2], width: parseFloat(jsonData[i][4]) * 1000, height: parseFloat(jsonData[i][5]) * 1000, totalQuantity: jsonData[i][6], EI: jsonData[i][8] };

                    let mainAcs = tempReport.mainAcs ? { ...tempReport.mainAcs, totalQuantity: ((tempReport.height / 1000) * (tempReport.width / 1000) * tempReport.totalQuantity) } : null;
                    tempReport = { ...tempReport, mainAcs: mainAcs }
                    const newDataReport: DataReport = { priceReport: tempReport, isShowDetails: false, status: false };
                    dataReport.push(newDataReport);
                }
            }
        }
        if (dataReport.length > 0) {
            props.handlePushToDataReport(dataReport);
        }
    }
    const updatePriceReport = (doorModelItem: any, newPriceReport: PriceReport,w:number,h:number,quanNep:number,totalQuanItem:number): PriceReport => {
        const acsList: Accessories[] = [];
        /// get list acs
        // console.log(doorModelItem);
        if (doorModelItem.accessoryAndFeatures && doorModelItem.accessoryAndFeatures.length > 0) {
            doorModelItem.accessoryAndFeatures.map((item: any) => {
                const acsExisted: GroupAccessory | null = props.groupAcsData.find((acsGroup: GroupAccessory) => acsGroup.id === item.accessoryGroupId) ?? null;
                if (acsExisted && acsExisted.accessoriesAndType.length > 0) {
                    acsList.push({ ...acsExisted.accessoriesAndType[0].accessories, quantity: item.quantity, condition: item.condition });
                }
            })
        }
        const mainAcs = props.acsData.find((item: Accessories) => item.id === doorModelItem.accessoryMainId) ?? null;

        //find glass
        const glassItem: Accessories | null = props.acsData.find(item => item.id === doorModelItem.accessoryGlassId) ?? null;
        //find nep
        const nepItem: Accessories | null = props.acsData.find(item => item.id === doorModelItem.glassBracketId) ?? null;
        const onGlass : boolean = (w && h) ? true : false; 
        newPriceReport = {
            ...newPriceReport,
            doorModel: doorModelItem,
            numberDoor: doorModelItem.numberDoor ? doorModelItem.numberDoor : 0,
            name: doorModelItem.name ? doorModelItem.name : newPriceReport.name,
            accessories: acsList,
            mainAcs: mainAcs,
            glassAcs:glassItem ? {...glassItem,width:w*1000,height:h*1000,quantity:w*h*quanNep,totalQuantity:w*h*quanNep*totalQuanItem} : null,
            nepAcs:nepItem ? {...nepItem,quantity:quanNep,totalQuantity:quanNep*totalQuanItem} : null,
            onGlass: onGlass
        };
        return newPriceReport;
    }
    return (
        <div className=''>
            <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                id="file-upload"
                className="hidden"
            />
            <label
                htmlFor="file-upload"
                className="bg-green-500 flex flex-row justify-center items-center text-white px-2 cursor-pointer rounded-r-lg hover:bg-green-600"
            >
                <Image
                    src="/Microsoft_Excel-Logo.svg"
                    alt="Upload icon"
                    width={120}
                    height={120}
                />
                <div className='px-2 font-bold font-mono flex flex-row space-x-2'><Upload /> <span>Upload Excel File</span></div>
            </label>
        </div>
    )
}
