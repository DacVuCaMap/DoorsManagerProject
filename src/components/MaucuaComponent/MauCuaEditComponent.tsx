import React, { useEffect, useState } from 'react'
import { Button, message } from 'antd';
import { Check, DoorClosed, Plus, Trash } from 'lucide-react';
import PostPattern from '@/ApiPattern/PostPattern';
import BaoGiaSearchPhuKien from '../baogiaComponents/BaoGiaSearchPhuKien';
import Accessories from '@/Model/Accessories';
import GetPattern from '@/ApiPattern/GetPattern';
import { genNumberByTime, LoadAccesoryGroupNoAcs } from '@/data/FunctionAll';
import InputSearchAcs from '../SearchingComponents/InputSearchAcs';
import '../MaucuaComponent/MauCuaEdit.css';
import InputSearchAccessoryGroup from '../SearchingComponents/InputSearchAccessoryGroup';
import GroupAccessory from '@/Model/GroupAccessory';
import DoorModel, { newDoorModel } from '@/Model/DoorModel';
import AccessoryAndFeature from '@/Model/AccessoryAndFeature';
import { BarLoader } from 'react-spinners';

type Props = {
    curDoorModel: DoorModel;
    acsGlass: Accessories[];
    acsGroup: GroupAccessory[];
}
export default function MauCuaEditComponent(props: Props) {
    const [curDoorModel, setDoorModel] = useState<DoorModel>(newDoorModel());
    const [listMainAcs, setListMainAcs] = useState<Accessories[]>([]);
    const [listAcsGroup, setListAcsGroup] = useState<GroupAccessory[]>(props.acsGroup);
    const [listMainGlass, setListMainGlass] = useState<Accessories[]>(props.acsGlass);
    const [curFireTestCondition, setCurFireTestCondition] = useState<string[]>([]);
    const [curFireTestValue, setCurFireTestValue] = useState<string[]>([]);
    let curAcs = new Accessories(genNumberByTime(), "", "", "", 0, 0, 0, 0, 0, 0, 0, "Bộ", false);
    const [success, setSuccess] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            const url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/get-acs-by-type?type=main";
            const response = await GetPattern(url, {});
            if (response && response.value && response.value[0] && response.value[0].accessories) {
                // console.log(response.value[0].accessories)
                setListMainAcs(response.value[0].accessories)
            }
            else {
                message.error("false");
            }
        }
        fetchData();
    }, [])
    useEffect(() => {

        setDoorModel(props.curDoorModel);
        const newFireTestCondition: string[] = props.curDoorModel.fireTestCondition.split("./");
        const newFireTestValue: string[] = props.curDoorModel.fireTestValue.split("./");
        setCurFireTestCondition(newFireTestCondition);
        setCurFireTestValue(newFireTestValue);
    }, [props.curDoorModel])

    const handleSetAcsGroup = (groupItem: GroupAccessory) => {
        const listTemp = [...curDoorModel.accessoryAndFeature];
        const tempGroup: AccessoryAndFeature = { id: groupItem.id, accessoryGroup: groupItem, quantity: 1, condition: "1", acsType: "normal" };
        const exist = listTemp.find(item => item.id === groupItem.id);
        if (exist) {
            message.error("Đã tồn tại");
            return;
        }
        listTemp.push(tempGroup);
        setDoorModel({ ...curDoorModel, accessoryAndFeature: listTemp });
    }
    const handleDelete = (index: number, key: string) => {
        if (key === "1") {
            const listTemp = curDoorModel.accessoryAndFeature.filter((item, ind) => ind != index);
            setDoorModel({ ...curDoorModel, accessoryAndFeature: listTemp });
        }
        else {
            const listTemp = curDoorModel.acsGroupCost.filter((item, ind) => ind != index);
            setDoorModel({ ...curDoorModel, acsGroupCost: listTemp });
        }
    }
    const handleChangeQuantity = (index: number, e: any, key: string) => {
        let value = e.target.value;
        const regex = /^[0-9wh\*\+\-\/]*$/;
        if (key === "quantity") {
            value = value ? value : 0;
            value = parseFloat(value);
            if (value < 0) {
                return;
            }
        }
        if (key === "condition" && !regex.test(value)) {
            return;
        }
        const listTemp = curDoorModel.accessoryAndFeature.map((item, ind) => {
            if (index === ind) {
                return { ...item, [key]: value }
            }
            return item;
        })
        // console.log(listTemp);
        setDoorModel({ ...curDoorModel, accessoryAndFeature: listTemp });
    }
    const handleChangeDoorModel = (key: string, e: any) => {
        const value = e.target.value;

        let temp: any = null;
        if (key === "accessoryMain") {
            temp = listMainAcs.find(item => item.id === parseFloat(value));
        }
        else if (key === "accessoryGlass") {
            temp = listMainGlass.find(item => item.id === parseFloat(value));
        }
        else if (key === "name" || key === "showName") {
            temp = value;
        }
        else if (key === "shortName") {
            temp = value;
        }
        else if (key === "numberDoor") {
            const finalVal = value < 10 ? value : value % 10;
            temp = parseFloat(finalVal);
        }
        else {
            temp = value;
        }
        setDoorModel({ ...curDoorModel, [key]: temp })
    }

    const handleAddFiretest = () => {
        const tempCondition = [...curFireTestCondition]
        const tempValue = [...curFireTestValue]
        tempCondition.push("");
        tempValue.push("");
        setCurFireTestCondition(tempCondition);
        setCurFireTestValue(tempValue);
    }
    const handleChangeFiretest = (key: string, e: any, index: number) => {
        if (key === "condition") {
            const value = e.target.value;
            const temp = [...curFireTestCondition].map((item, ind) => {
                if (ind === index) {
                    return value;
                }
                return item;
            });
            setCurFireTestCondition(temp);
        }
        if (key === "value") {
            const value = e.target.value;
            const temp = [...curFireTestValue].map((item, ind) => {
                if (ind === index) {
                    return value;
                }
                return item;
            });
            setCurFireTestValue(temp);
        }
        if (key === "delete") {
            const temp = [...curFireTestCondition].filter((item, ind) => ind != index);
            const temp2 = [...curFireTestValue].filter((item, ind) => ind != index);
            setCurFireTestCondition(temp);
            setCurFireTestValue(temp2);
        }
    }
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setLoadingSubmit(true);
        const accessoryAndFeatures = curDoorModel.accessoryAndFeature.map((item: AccessoryAndFeature, index) => {
            return { id: item.id, quantity: item.quantity, condition: item.condition, accessoryGroupId: item.accessoryGroup.id, doorModelId: 0, acsType: "normal" }
        });
        const acsGroupCostPost = curDoorModel.acsGroupCost.map((item: AccessoryAndFeature, index) => {
            return { id: item.id, quantity: item.quantity, condition: item.condition, accessoryGroupId: item.accessoryGroup.id, doorModelId: 0, acsType: "cost" }
        });

        const postData = {
            id: curDoorModel.id, name: curDoorModel.name,
            showName: curDoorModel.showName,
            shortName: curDoorModel.shortName,
            accessoryAndFeatures: [...accessoryAndFeatures, ...acsGroupCostPost],
            accessoryMainId: curDoorModel.accessoryMain?.id,
            accessoryGlassId: curDoorModel.accessoryGlass?.id,
            glassBracketId: null,
            fireTestCondition: curFireTestCondition.join("./"),
            fireTestValue: curFireTestValue.join("./"),
            numberDoor: curDoorModel.numberDoor,
            wingType: curDoorModel.wingType,

        }
        console.log(postData);
        const url = process.env.NEXT_PUBLIC_API_URL + "/api/door-model/add"
        const response = await PostPattern(url, postData, {});
        console.log(response);
        if (response && response.status === 200) {
            setSuccess(true);
        }
        else if (response && response.status === 400) {
            message.error(response.message);
        }
        else {
            message.error("fail");
        }
        setLoadingSubmit(false);
        setTimeout(() => {
            setSuccess(false);
        }, 5000);
    }
    const handleSetCost = (groupItem: GroupAccessory) => {
        const listTemp = [...curDoorModel.acsGroupCost];
        const tempGroup: AccessoryAndFeature = { id: groupItem.id, accessoryGroup: groupItem, quantity: 1, condition: "", acsType: "cost" };
        const exist = listTemp.find(item => item.id === groupItem.id);
        if (exist) {
            message.error("Đã tồn tại");
            return;
        }
        listTemp.push(tempGroup);
        setDoorModel({ ...curDoorModel, acsGroupCost: listTemp });
    }

    const handleChangeCostCondidtion = (index: number, e: any) => {
        let value = e.target.value;

        const regex = /^[0-9wh\*\+\-\/]*$/;

        if (regex.test(value)) {

            const listTemp = curDoorModel.acsGroupCost.map((item, ind) => {
                if (index === ind) {
                    return { ...item, condition: value }
                }
                return item;
            });

            setDoorModel({ ...curDoorModel, acsGroupCost: listTemp });
        } else {
            console.log('Invalid input');
        }
    }

    return (
        <div className='bg-gray-800 w-[600px] min-h-[550px] rounded-lg flex flex-col py-4 px-4 maucua-edit'>
            <div className='flex flex-row space-x-2 text-gray-300'>
                <DoorClosed />
                <h2 className='font-bold text-lg mb-2'>Form Mẫu cửa</h2>
            </div>
            <div>
                <form onSubmit={handleSubmit} className='flex flex-col space-y-2'>
                    <div>
                        <label htmlFor="" className='text-sm text-gray-400'>Tên Mẫu Cửa</label>
                        <input required value={curDoorModel.name} onChange={e => handleChangeDoorModel("name", e)} type="text" placeholder='Nhập tên mẫu cửa....' className='bg-gray-600 w-full pt-2 text-base text-gray-300 rounded px-2 mb-4 border-b outline-none border-gray-400' />
                    </div>
                    <div>
                        <label htmlFor="" className='text-sm text-gray-400'>Loại cửa (hiển thị trong excel)</label>
                        <input required value={curDoorModel.showName ? curDoorModel.showName : ""} onChange={e => handleChangeDoorModel("showName", e)} type="text" placeholder='Nhập tên loại cửa....' className='bg-gray-600 w-full pt-2 text-base text-gray-300 rounded px-2 mb-4 border-b outline-none border-gray-400' />
                    </div>

                    <div className='flex flex-row space-x-4 w-full'>
                        <div className='flex flex-col'>
                            <label htmlFor="" className='text-sm text-gray-400'>Tên viết tắt</label>
                            <input required value={curDoorModel.shortName ?? ''} onChange={e => handleChangeDoorModel("shortName", e)} type="text" placeholder='Nhập tên viết tắt....' className='rounded bg-gray-600 w-64 pt-2 text-base text-gray-300 px-2 mb-4 border-b outline-none border-gray-400' />
                        </div>
                        <div className='flex flex-col'>
                            <label htmlFor="" className='text-sm text-gray-400'>Số cánh</label>
                            <input required value={curDoorModel.numberDoor ?? 1} onChange={e => handleChangeDoorModel("numberDoor", e)} type="number" className='rounded bg-gray-600 w-20 pt-2 text-base text-gray-300 px-2 mb-4 border-b outline-none border-gray-400' />
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="" className='text-sm text-gray-400'>Loại cánh</label>
                            <select value={curDoorModel.wingType} onChange={e => handleChangeDoorModel("wingType", e)} required name="" id="" className='text-sm text-gray-300  bg-gray-600 rounded p-2'>
                                <option value="cánh">Cánh</option>
                                <option value="cánh lệch">Cánh lệch</option>
                            </select>
                        </div>


                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-sm text-gray-400'>Vật liệu chính </label>
                        <select required value={curDoorModel.accessoryMain?.id || ""} onChange={e => handleChangeDoorModel("accessoryMain", e)} name="" id="" className='text-sm text-gray-300  bg-gray-600 rounded p-2'>
                            <option value="" disabled>Chọn vật liệu chính</option>
                            {listMainAcs.map((list: any, index) => (
                                <option key={index} value={list.id}>{list.code}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-sm text-gray-400'>Nhóm phụ kiện</label>
                        <div className='flex flex-col border border-gray-600 space-y-2 px-4 py-2 rounded justify-center items-center'>
                            <InputSearchAccessoryGroup condition='normal doorsill' accessoryGroupData={listAcsGroup} handleSetAcsGroup={handleSetAcsGroup} index={0} />

                            {curDoorModel.accessoryAndFeature.map((item: AccessoryAndFeature, index) => (
                                <div key={index} className='flex flex-row justify-center items-center space-x-2 w-full border-t border-gray-500 text-gray-400'>
                                    <span className='w-full'>{item.accessoryGroup.name}</span>
                                    <div className='flex flex-row items-center space-x-2'>
                                        <span className='font-thin text-xs text-gray-500'>C.thức:</span>
                                        <input type="text" className='w-32 text-center rounded' value={item.condition} onChange={e => handleChangeQuantity(index, e, "condition")} />
                                    </div>
                                    <button type='button' onClick={e => handleDelete(index, "1")} className='hover:bg-gray-700 p-2'><Trash size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-sm text-gray-400'>Nhóm chi phí</label>
                        <div className='flex flex-col border border-gray-600 space-y-2 px-4 py-2 rounded justify-center items-center'>
                            <InputSearchAccessoryGroup condition='cost' accessoryGroupData={listAcsGroup} handleSetAcsGroup={handleSetCost} index={0} />

                            {curDoorModel.acsGroupCost.map((item: AccessoryAndFeature, index) => (
                                <div key={index} className='flex flex-row justify-center items-center space-x-2 w-full border-t border-gray-500 text-gray-400'>
                                    <span className='w-full'>{item.accessoryGroup.name}</span>
                                    <div className='flex flex-row  items-center space-x-2'>
                                        <span className='font-thin text-xs text-gray-500'>C.thức:</span>
                                        <input type="text" className='w-32 text-center rounded' value={item.condition} onChange={e => handleChangeCostCondidtion(index, e)} />
                                    </div>
                                    <button type='button' onClick={e => handleDelete(index, "0")} className='hover:bg-gray-700 p-2'><Trash size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-sm text-gray-400'>Vật liêu kính</label>
                        <select required value={curDoorModel.accessoryGlass?.id || ""} onChange={e => handleChangeDoorModel("accessoryGlass", e)} name="" id="" className='text-sm text-gray-300  bg-gray-600 rounded p-2'>
                            <option value="" disabled>Chọn vật liệu kính</option>
                            {listMainGlass.map((list: any, index) => (
                                <option key={index} value={list.id}>{list.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="" className='text-sm text-gray-400'>Kiểm định</label>
                        <div className='overflow-auto flex flex-row space-x-2'>
                            <table>
                                <tbody>
                                    <tr>
                                        <td className='px-2 text-left'>Đ.kiện</td>
                                        {curFireTestCondition.map((item, index) => (
                                            <td key={index} className='w-16'><input value={item} onChange={e => handleChangeFiretest("condition", e, index)} type="text" className='w-full' /></td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className='px-2'>S.tiền</td>
                                        {curFireTestValue.map((item, index) => (
                                            <td key={index} className='w-16'><input value={item} onChange={e => handleChangeFiretest("value", e, index)} type="text" className='w-full' /></td>
                                        ))}
                                    </tr>
                                    <tr>
                                        <td className='px-2'></td>
                                        {curFireTestValue.map((item, index) => (
                                            <td key={index} className='w-16'><button onClick={e => handleChangeFiretest("delete", e, index)} type='button' className='hover:bg-gray-900 w-full py-2 flex justify-center'><Trash size={20} /></button></td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                            <button onClick={e => handleAddFiretest()} type='button' className='h-14 hover:bg-gray-700 border flex justify-center items-center px-2'><Plus size={20} /></button>
                        </div>

                    </div>
                    <div className='flex justify-end items-end pt-10'>
                        {!success ?
                            <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full my-2 flex justify-center items-center'>
                                {loadingSubmit ? <BarLoader className='my-2' width={1000} /> : "Lưu"}
                            </button>
                            :
                            <div className='flex flex-col w-full justify-center items-center'><Check size={40} className=' p-2 bg-green-400 rounded-full text-white' /> <span className='text-gray-500 font-semibold'>success</span></div>
                        }

                    </div>
                </form>
            </div>
        </div>
    )
}
