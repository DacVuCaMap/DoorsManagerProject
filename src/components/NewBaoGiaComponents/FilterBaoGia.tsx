"use client"
import Accessories from '@/Model/Accessories';
import DataReport from '@/Model/DataReport';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import InputSearchAcs from '../SearchingComponents/InputSearchAcs';
import PriceReport from '@/Model/PriceReport';
import "./CreateBaoGiaItem.css"
import { Trash2 } from 'lucide-react';
import { formatNumberVN } from '@/data/FunctionAll';
type Props = {
    setOpenFilter(flag: boolean): any;
    openFilter: boolean;
    listReport: DataReport[];
    acsData: Accessories[];
    setDataReport(item: DataReport[]): any;

}
type ListSelect = {
    numberIndex: number[];
    acs: Accessories;
}
export default function FilterBaoGia(props: Props) {
    const [listSelect, setListSelect] = useState<ListSelect[]>([]);

    useEffect(() => {
        const filterListReport = () => {
            let temp: ListSelect[] = [];
            props.listReport.forEach((item: DataReport, index) => {
                // main Acs 
                if (item.priceReport.mainAcs) {
                    const check = temp.find(itemSelect => itemSelect.acs.id === item.priceReport.mainAcs?.id);
                    const quantity = (item.priceReport.width / 1000 * item.priceReport.height / 1000) * item.priceReport.totalQuantity;
                    if (check) {
                        check.numberIndex.push(index);
                        check.acs.totalQuantity += quantity;
                    }
                    else {
                        temp.push({ numberIndex: [index], acs: { ...item.priceReport.mainAcs, totalQuantity: quantity } });
                    }
                }
                item.priceReport.accessories.forEach((acs: Accessories) => {
                    if (acs.type!="cost") {
                        const check = temp.find(itemSelect => itemSelect.acs.id === acs.id);
                        const quantity = acs.quantity * item.priceReport.totalQuantity
                        if (check) {
                            check.numberIndex.push(index);
                            check.acs.totalQuantity += quantity;
                        }
                        else {
                            temp.push({ numberIndex: [index], acs: { ...acs, totalQuantity: quantity } });
                        }
                    }
                    
                });
            });
            setListSelect(temp);
        }
        filterListReport();
    }, [props.listReport])
    const handleUpdateToParent = (acs: Accessories, itemSelect: ListSelect) => {
        const tempReport: DataReport[] = [...props.listReport].map((report: DataReport, index) => {
            if (itemSelect.numberIndex.includes(index)) {
                let tempChildReport: PriceReport = report.priceReport;
                const checkAcs: Accessories | undefined = tempChildReport.accessories.find(item => item.id === acs.id);
                if (tempChildReport.mainAcs && itemSelect.acs === tempChildReport.mainAcs.id) {
                    tempChildReport = { ...tempChildReport, mainAcs: acs };
                }
                else if (checkAcs && itemSelect.acs.id != checkAcs.id) {
                    const tempAcsList: Accessories[] = tempChildReport.accessories.filter(item => item.id != checkAcs.id);
                    tempChildReport = { ...tempChildReport, accessories: tempAcsList };
                }
                else {
                    const tempAcsList: Accessories[] = tempChildReport.accessories.map((acsItem: Accessories, childInd) => {
                        if (acsItem.id === itemSelect.acs.id) {
                            return { ...acs, price: acsItem.price, quantity: acsItem.quantity }
                        }
                        return acsItem;
                    })
                    tempChildReport = { ...tempChildReport, accessories: tempAcsList };
                }
                return { ...report, priceReport: tempChildReport };
            }
            return report;
        })
        props.setDataReport(tempReport);

    }
    const handleUpdatePrice = (itemSelect: ListSelect, e: any) => {
        let value = e.target.value;


        value = parseFloat(value.replace(/\./g, ''));
        value = !value ? 0 : value;
        const tempReport: DataReport[] = [...props.listReport].map((report: DataReport, index) => {
            if (itemSelect.numberIndex.includes(index)) {
                let tempChildReport: PriceReport = report.priceReport;
                if (tempChildReport.mainAcs && itemSelect.acs.id === tempChildReport.mainAcs.id) {
                    let mainAcs: Accessories = { ...tempChildReport.mainAcs, price: value };
                    tempChildReport = { ...tempChildReport, mainAcs: mainAcs };
                }
                else {
                    const tempAcsList: Accessories[] = tempChildReport.accessories.map((acs: Accessories, childInd) => {
                        if (acs.id === itemSelect.acs.id) {
                            console.log(acs);
                            return { ...acs, price: value }
                        }
                        return acs;
                    })
                    console.log(tempAcsList);
                    tempChildReport = { ...tempChildReport, accessories: tempAcsList };
                }
                return { ...report, priceReport: tempChildReport };

            }
            return report;
        })
        props.setDataReport(tempReport);
    }
    const handleDeleteFilter = (item: ListSelect) => {
        const tempReport: DataReport[] = [...props.listReport].map((report: DataReport, index) => {
            // main
            if (report.priceReport.mainAcs?.id === item.acs.id) {
                const newPriceReport: PriceReport = { ...report.priceReport, mainAcs: null };
                return { ...report, priceReport: newPriceReport };
            }
            const newAcs: Accessories[] = report.priceReport.accessories.filter(acs => acs.id != item.acs.id);
            const newPriceReport: PriceReport = { ...report.priceReport, accessories: newAcs };
            return { ...report, priceReport: newPriceReport };
        })
        props.setDataReport(tempReport);
    }
    return (
        <div >
            <AnimatePresence>
                {props.openFilter && (
                    <div onClick={e => props.setOpenFilter(false)} className='fixed top-0 left-0 bg-black bg-opacity-50 w-full h-full z-50'>
                        <motion.div
                            className="h-screen w-[800px] z-50 bg-gray-800 fixed top-0 right-0 p-10"
                            initial={{ x: '50%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className='overflow-auto'>
                                <table className='text-white w-full table-auto'>
                                    <thead>
                                        <tr>
                                            <th className='w-1/12'>STT</th>
                                            <th className='w-4/12'>Tên</th>
                                            <th className='w-2/12'>Mã</th>
                                            <th className='w-1/12'>Tổng KL</th>
                                            <th className='w-3/12'>Giá</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {listSelect.map((item: ListSelect, index) => (
                                            <tr key={index} className='create-bg border-b border-gray-500'>
                                                <td className='py-4 text-center'>{index + 1}</td>
                                                <td className='text-gray-700'><InputSearchAcs itemSelect={item} curAcs={item.acs} handleSelectAcs={handleUpdateToParent} acsData={props.acsData} /></td>
                                                <td className='text-center'>{item.acs.code}</td>
                                                <td className='text-center'>{formatNumberVN(item.acs.totalQuantity)}</td>
                                                <td className='text-gray-700 px-10'>
                                                    <input onChange={e => handleUpdatePrice(item, e)} value={item.acs.price} type="text" className='rounded px-2 py-1 w-full' />
                                                </td>
                                                <td>
                                                    <button onClick={e => handleDeleteFilter(item)} className='hover:bg-gray-700 p-2'><Trash2 /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>






                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
