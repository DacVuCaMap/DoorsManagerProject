"use client"
import Accessories from '@/Model/Accessories';
import DataReport from '@/Model/DataReport';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import InputSearchAcs from '../SearchingComponents/InputSearchAcs';
import PriceReport from '@/Model/PriceReport';
import "./CreateBaoGiaItem.css"
import { RefreshCw, Trash2 } from 'lucide-react';
import { changePriceAndTempPrice, formatNumberToDot, formatNumberVN, parseVnToNumber } from '@/data/FunctionAll';
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
                /// glass and nep acs
                if (item.priceReport.onGlass && item.priceReport.glassAcs && item.priceReport.nepAcs) {
                    const check = temp.find(itemSelect => itemSelect.acs.id === item.priceReport.glassAcs?.id);
                    const totalQuantity = item.priceReport.glassAcs.totalQuantity
                    if (check) {
                        check.numberIndex.push(index);
                        check.acs.totalQuantity += totalQuantity;
                    }
                    else {
                        temp.push({ numberIndex: [index], acs: { ...item.priceReport.glassAcs, totalQuantity: totalQuantity } });
                    }

                    const check2 = temp.find(itemSelect => itemSelect.acs.id === item.priceReport.nepAcs?.id);
                    const totalQuantityNep = item.priceReport.nepAcs.totalQuantity
                    if (check2) {
                        check2.numberIndex.push(index);
                        check2.acs.totalQuantity += totalQuantityNep;
                    }
                    else {
                        temp.push({ numberIndex: [index], acs: { ...item.priceReport.nepAcs, totalQuantity: totalQuantityNep } });
                    }
                }
                item.priceReport.accessories.forEach((acs: Accessories) => {
                    if (acs.type != "cost") {
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
    const handleUpdatePrice = (itemSelect: ListSelect, e: any, indexSelect: number) => {
        let value = e.target.value;

        const newListSelect: ListSelect[] = [...listSelect].map((item, index) => {
            if (index === indexSelect) {
                let newAcs: Accessories = { ...item.acs, tempPrice: value };
                if (value && !value.endsWith(",")) {
                    newAcs = { ...newAcs, price: parseVnToNumber(value) };
                }
                return { ...item, acs: newAcs };
            }
            return item;
        })
        setListSelect(newListSelect);

        const tempReport: DataReport[] = [...props.listReport].map((report: DataReport, index) => {
            if (itemSelect.numberIndex.includes(index)) {
                let tempChildReport: PriceReport = report.priceReport;
                if (tempChildReport.mainAcs && itemSelect.acs.id === tempChildReport.mainAcs.id) {
                    // let mainAcs: Accessories = { ...tempChildReport.mainAcs, price: value };
                    let mainAcs: Accessories = changePriceAndTempPrice({ ...tempChildReport.mainAcs }, value);
                    tempChildReport = { ...tempChildReport, mainAcs: mainAcs };
                }
                else {
                    const tempAcsList: Accessories[] = tempChildReport.accessories.map((acs: Accessories, childInd) => {
                        if (acs.id === itemSelect.acs.id) {
                            return changePriceAndTempPrice({ ...acs }, value);
                        }
                        return acs;
                    })
                    tempChildReport = { ...tempChildReport, accessories: tempAcsList };
                }

                //glass
                if (tempChildReport.onGlass && tempChildReport.glassAcs && tempChildReport.nepAcs) {
                    if (itemSelect.acs.id === tempChildReport.glassAcs.id) {
                        let newGlassAcs: Accessories = changePriceAndTempPrice({ ...tempChildReport.glassAcs }, value);
                        tempChildReport = { ...tempChildReport, glassAcs: newGlassAcs };
                    }

                    if (tempChildReport.nepAcs && itemSelect.acs.id === tempChildReport.nepAcs.id) {
                        let newNepAcs: Accessories = changePriceAndTempPrice({ ...tempChildReport.nepAcs }, value);
                        tempChildReport = { ...tempChildReport, nepAcs: newNepAcs };
                    }

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
    const updateAllPrice = () => {
        const tempReport: DataReport[] = [...props.listReport].map((report: DataReport, index) => {
            let tempChildReport: PriceReport = report.priceReport;
            /// search main
            const mainSelect: ListSelect | undefined = listSelect.find(itemSelect => itemSelect.acs.id === tempChildReport.mainAcs?.id);
            if (mainSelect && tempChildReport.mainAcs && mainSelect.acs.id === tempChildReport.mainAcs.id) {
                let mainAcs: Accessories = changePriceAndTempPrice({ ...tempChildReport.mainAcs }, mainSelect.acs.price.toString());
                tempChildReport = { ...tempChildReport, mainAcs: mainAcs };
            }

            const tempAcsList: Accessories[] = tempChildReport.accessories.map((acs: Accessories, childInd) => {
                const itemSelect: ListSelect | undefined = listSelect.find(item => item.acs.id === acs.id);
                if (itemSelect && acs.id === itemSelect.acs.id) {
                    return changePriceAndTempPrice({ ...acs }, itemSelect.acs.price.toString())
                }
                return acs;
            })
            tempChildReport = { ...tempChildReport, accessories: tempAcsList };

            //glass
            if (tempChildReport.onGlass && tempChildReport.glassAcs && tempChildReport.nepAcs) {
                const glassSelect: ListSelect | undefined = listSelect.find(itemSelect => itemSelect.acs.id === tempChildReport.glassAcs?.id);
                if (glassSelect && glassSelect.acs.id === tempChildReport.glassAcs.id) {
                    let newGlassAcs: Accessories = changePriceAndTempPrice({ ...tempChildReport.glassAcs }, glassSelect.acs.price.toString())
                    tempChildReport = { ...tempChildReport, glassAcs: newGlassAcs };
                }
                const nepSelect: ListSelect | undefined = listSelect.find(itemSelect => itemSelect.acs.id === tempChildReport.nepAcs?.id);
                if (nepSelect && tempChildReport.nepAcs && nepSelect.acs.id === tempChildReport.nepAcs.id) {
                    let newNepAcs: Accessories = changePriceAndTempPrice({ ...tempChildReport.nepAcs }, nepSelect.acs.price.toString());
                    tempChildReport = { ...tempChildReport, nepAcs: newNepAcs };
                }

            }
            return { ...report, priceReport: tempChildReport };
        })
        props.setDataReport(tempReport);
    }
    const handleClostFilter = () => {
        document.body.style.overflow = 'auto';
        props.setOpenFilter(false)
    }

    return (
        <div >
            <AnimatePresence>
                {props.openFilter && (
                    <div onClick={handleClostFilter} className='fixed top-0 left-0 bg-black bg-opacity-50 w-full h-full z-50'>
                        <motion.div
                            className="h-screen w-[800px] z-50 bg-gray-800 fixed top-0 right-0 p-10"
                            initial={{ x: '50%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'tween', duration: 0.2, ease: 'easeOut' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {listSelect.length > 0 &&
                                <div>
                                    <button onClick={updateAllPrice} className='border border-gray-400 text-white rounded-full flex flex-row space-x-2 font-mono py-2 px-4 hover:bg-gray-700'>
                                        <RefreshCw /><span>Cập nhập giá trị</span>
                                    </button>
                                </div>
                            }
                            <div className='overflow-auto max-h-[500px] border-b-2'>

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
                                                    <input
                                                        tabIndex={1}
                                                        onChange={e => handleUpdatePrice(item, e, index)}
                                                        value={item.acs.tempPrice ?? 0}
                                                        type="text"
                                                        className='rounded px-2 py-1 w-full'
                                                    />
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
