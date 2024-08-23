import DoorNameSelect from '@/Model/DoorNameSelect';
import FireTest from '@/Model/FireTest';
import { PackageOpen, Trash2, TriangleAlert } from 'lucide-react';
import React, { useState } from 'react'
import { ScaleLoader } from 'react-spinners';

type Props = {
    selectData: DoorNameSelect[],
    selectGlass: any[],
    index: number,
    fireTestItemGroup: FireTestItemGroup,
    handleChangeFireTestItem: (fireTestItem: FireTestItem[], index: number) => void,
    colorHover: string
}
type command = {
    numberDoor: string,
    type: string,
    code: string,
    width: number,
    height: number,
    glass: string,
    glassW: number,
    glassH: number,
    glassT: number
}
type FireTestItem = {
    fireTest: FireTest,
    status: boolean,
    statusDetails: boolean
    showDetails: boolean,
    curSelect: DoorNameSelect,
    command: command
}
type FireTestItemGroup = {
    id: any
    fireTestItem: FireTestItem[],
    color: number
}
export default function KiemDinhItem(props: Props) {
    const newCmd: command = { numberDoor: "", type: "", code: "", width: 0, height: 0, glass: "", glassW: 0, glassH: 0, glassT: 0 };
    const newSelect = new DoorNameSelect("", "", [], [], [], "");
    const handleSelect = (e: any, key: string, index: number) => {
        let val = e.target.value;
        if (key === "width" || key === "height" || key === "glassW" || key === "glassH" || key === "glassT") {
            val = parseFloat(val);
        }
        if (key === "showDetails") {
            val = !props.fireTestItemGroup.fireTestItem[index].showDetails;
            // console.log(val)
        }

        if (key === "name") {
            let temp: DoorNameSelect = props.selectData.find(item => item.id === parseFloat(val)) || newSelect;
            // get panic don doi
            let flag = false;
            let tempType = temp.type.filter(item => {
                if (item === "thoát hiểm panic") {
                    flag = true
                    return false
                }
                return true
            })
            if (flag) {
                tempType.push("thoát hiểm panic đơn", "thoát hiểm panic đôi");
                temp.type = tempType;
            }
            let fireTestUpdated: FireTest = { ...props.fireTestItemGroup.fireTestItem[index].fireTest, doorNameSelectId: parseFloat(val) }
            let updatedItem: FireTestItem = { ...props.fireTestItemGroup.fireTestItem[index], curSelect: temp, command: newCmd, fireTest: fireTestUpdated };
            updatedItem = checkCmdAndAddCmd(updatedItem, index);
            updateToParent(updatedItem, index)
        }
        else if (key === "showDetails") {
            // update FireTestItem
            let updatedItem: FireTestItem = { ...props.fireTestItemGroup.fireTestItem[index], [key]: val };
            updatedItem = checkCmdAndAddCmd(updatedItem, index);
            updateToParent(updatedItem, index)
        }
        else if (key === "type") {
            let newFireTest: FireTest = { ...props.fireTestItemGroup.fireTestItem[index].fireTest, [key]: val };
            let updatedItem: FireTestItem = { ...props.fireTestItemGroup.fireTestItem[index], fireTest: newFireTest };
            updateToParent(updatedItem, index);
        }
        else {
            // chi update command
            key= key==="typeDoor" ? "type" : key;
            let oldItem: FireTestItem = { ...props.fireTestItemGroup.fireTestItem[index] }
            let updatedItem: FireTestItem = { ...oldItem, command: { ...oldItem.command, [key]: val } };
            updatedItem = checkCmdAndAddCmd(updatedItem, index);
            updateToParent(updatedItem, index)
        }

    }
    const handleAddNew = () => {
        let newItem: FireTestItem = { fireTest: new FireTest("", "", 0, 0, 0, 0, 0, 0, 0, 0, "", null), status: false, showDetails: true, curSelect: newSelect, command: newCmd, statusDetails: false }
        const updateItem: FireTestItem[] = [...props.fireTestItemGroup.fireTestItem, newItem];
        props.handleChangeFireTestItem(updateItem, props.index);
    }
    const updateToParent = (updatedItem: FireTestItem, index: number) => {
        let updatedParent: FireTestItem[] = [...props.fireTestItemGroup.fireTestItem];
        updatedParent[index] = updatedItem;
        props.handleChangeFireTestItem(updatedParent, props.index);
    }
    const checkCmdAndAddCmd = (updatedItem: FireTestItem, index: number): FireTestItem => {
        const checkCmd: command = updatedItem.command;
        const arrStr: string[] = addArrNotNullCommand(checkCmd);
        let newFireTest: FireTest = { ...updatedItem.fireTest, name: arrStr.join("./") }
        if (arrStr.length === 9) {
            return { ...updatedItem, status: true, fireTest: newFireTest };
        }
        return { ...updatedItem, fireTest: newFireTest };
    }
    const addArrNotNullCommand = (cmd: command): string[] => {
        const arr: string[] = [];
        Object.entries(cmd).forEach(([key, value]) => {
            if (typeof value === 'string' && value.trim() != '') {
                arr.push(value);
            } else if (typeof value === 'number' && value != 0) {
                arr.push(value.toString());
            }
        });

        return arr;
    };
    const writeFireTestName = (cmd: command): string => {
        return `Cửa ${cmd.numberDoor} ${cmd.type} ${cmd.code}; KT ${cmd.width}X${cmd.height} ${cmd.glass} ${cmd.glassW}X${cmd.glassH}mm, dày ${cmd.glassT}mm`;
    }
    const handleDel = (index: number) => {
        let updatedItem: FireTestItem[] = [...props.fireTestItemGroup.fireTestItem];
        updatedItem = updatedItem.filter((item: FireTestItem, ind: number) => ind != index)
        props.handleChangeFireTestItem(updatedItem, props.index);
    }
    const handleFireTest = (e: any, key: string, index: number) => {
        let val = e.target.value;
        val = val === '' ? 0 : val;
        if (key != "thickness" && val != 0) {
            val = parseFloat(val.replace(/\./g, ''));
        }
        else if (key === "thickness") {
            if (val === "") {
                val = 0;
            }
            else if (val != 0 && !val.includes(".")) {
                val = parseFloat(val);
            }
            else {
                if (val != 0) {
                    val = val.replace(/(\..*)\..*/g, '$1')
                }
            }
        }
        let newFireTest: FireTest = { ...props.fireTestItemGroup.fireTestItem[index].fireTest, [key]: val };
        let updatedItem: FireTestItem = { ...props.fireTestItemGroup.fireTestItem[index], fireTest: newFireTest };
        updateToParent(updatedItem, index);
    }
    const formatToThousandDot = (value: any) => {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    return (
        <div className='w-11/12 flex flex-col '>
            {props.fireTestItemGroup.fireTestItem.length === 0 && <div className='w-full py-10 flex flex-col justify-center items-center text-gray-300 space-y-2'>
                <PackageOpen size={70} />
                <span>Không tìm thấy kiểm định (Nhấn thêm kiểm định)</span>
            </div>}
            {props.fireTestItemGroup.fireTestItem.map((item: FireTestItem, index) => (
                <div key={index} className={`flex border- border-b hover:${props.colorHover} transition duration-200 ease-in-out`}>
                    <div className='w-3/12 p-2 space-x-2 space-y-2 '>
                        {item.showDetails ?
                            <div>
                                <span className='text-xs text-left ml-2'>
                                    Lựa chọn
                                </span>
                                <div className='flex flex-col space-x-2 space-y-2 w-full ml-2 border-b pb-4'>
                                    {props.selectData.length != 0 ?
                                        <select name="" id="" onChange={e => handleSelect(e, "name", index)} value={item.curSelect.id} className='ml-2'>
                                            <option value="" disabled hidden>--Chọn tên--</option>
                                            {props.selectData.map((item: any, ind) => (
                                                <option key={ind} value={item.id}>{item.name}</option>
                                            ))}
                                        </select>
                                        :
                                        <div className='py-2 w-full text-center'>
                                            <ScaleLoader height={20} color='white' />
                                        </div>
                                    }
                                    {item.curSelect.name != "" &&
                                        <select name="" id="" onChange={e => handleSelect(e, "numberDoor", index)} value={item.command.numberDoor}>
                                            <option value="" disabled hidden>--Chọn cánh--</option>
                                            {item.curSelect.numberDoor.map((item: any, ind: number) => (
                                                <option key={ind} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    }
                                    {item.curSelect.name != "" &&
                                        <select name="" id="" onChange={e => handleSelect(e, "typeDoor", index)} value={item.command.type}>
                                            <option value="" disabled hidden>--Chọn loại--</option>
                                            {item.curSelect.type.map((item: any, ind: number) => (
                                                <option key={ind} value={item}>{item}</option>
                                            ))}
                                        </select>
                                    }
                                    {item.curSelect.name != "" &&
                                        <div className='flex flex-row space-x-2'>
                                            <select name="" id="" onChange={e => handleSelect(e, "code", index)} value={item.command.code}>
                                                <option value="" disabled hidden>--Chọn Mã--</option>
                                                {item.curSelect.code.map((item: any, ind: number) => (
                                                    <option key={ind} value={item}>{item}</option>
                                                ))}
                                            </select>
                                            <div className='flex flex-col'>
                                                <select onChange={e => handleSelect(e, "type", index)} value={item.fireTest.type || ""}>
                                                    <option value="" disabled hidden>--Chọn A-B--</option>
                                                    <option value="A">A</option>
                                                    <option value="B">B</option>
                                                </select>
                                            </div>
                                        </div>
                                    }
                                </div>
                                {item.curSelect.name != "" &&
                                    <div className='w-full flex flex-row items-center space-x-2 border-b pb-4'>
                                        <div className='flex flex-col text-left w-36'>
                                            <span className='text-xs'>chiều rộng</span>
                                            <input value={item.command.width === 0 ? "" : item.command.width} onChange={e => handleSelect(e, "width", index)} type="number" className='py-2 text-black rounded-lg px-2' placeholder='nhập kích thước' />
                                        </div>
                                        <span className='pt-4'>X</span>
                                        <div className='flex flex-col text-left w-36'>
                                            <span className='text-xs'>chiều dài</span>
                                            <input value={item.command.height === 0 ? "" : item.command.height} onChange={e => handleSelect(e, "height", index)} type="number" className='py-2 text-black rounded-lg px-2' placeholder='nhập kích thước' />
                                        </div>

                                    </div>
                                }
                                {item.curSelect.name != "" &&
                                    <div className='border-b pb-4'>
                                        <div className='flex flex-col mb-2'>
                                            <span className='text-xs text-left'>
                                                Kính
                                            </span>
                                            <select value={item.command.glass} onChange={e => handleSelect(e, "glass", index)} name="" id="" className='text-sm text-gray-600 border border-black rounded p-2'>
                                                <option value="" disabled hidden>--Chọn nhóm kính--</option>
                                                {props.selectGlass.map((item: any, ind) => (<option value={item.name} key={ind}>{item.name}</option>))}
                                            </select>
                                        </div>
                                        <div className='flex flex-row space-x-2 items-center'>
                                            <div className='w-1/4'>
                                                <span className='text-left text-xs'>Rộng(mm)</span>
                                                <input value={item.command.glassW === 0 ? "" : item.command.glassW} onChange={e => handleSelect(e, "glassW", index)} type="number" className='w-full text-black rounded px-2' />
                                            </div>
                                            <span className='pt-4'>x</span>
                                            <div className='w-1/4'>
                                                <span className='text-left text-xs'>Dài(mm)</span>
                                                <input value={item.command.glassH === 0 ? "" : item.command.glassH} onChange={e => handleSelect(e, "glassH", index)} type="number" className='w-full text-black rounded px-2' />
                                            </div>
                                            <span className='pt-4'>-</span>
                                            <div className='w-1/4'>
                                                <span className='text-left text-xs'>Độ dày(mm)</span>
                                                <input value={item.command.glassT === 0 ? "" : item.command.glassT} onChange={e => handleSelect(e, "glassT", index)} type="number" className='w-full text-black rounded px-2' />
                                            </div>
                                        </div>
                                    </div>}
                            </div>
                            :
                            <div className='py-2 pb-4 border-b '>
                                <span className='font-bold text-base'>{writeFireTestName(item.command)}</span>
                            </div>
                        }
                        <div className='flex flex-row items-center space-x-4'>
                            <div className='relative'>
                                <button onClick={e => handleSelect(e, "showDetails", index)} className='bg-gray-800 px-8 py-2 hover:bg-gray-950'>{item.showDetails ? "Ẩn" : "Hiện"} chi tiết</button>
                                {!item.status && <div className='absolute top-[-5px] right-[-10px] text-white bg-red-500 p-1 rounded-full'>
                                    <TriangleAlert size={15} />
                                </div>}
                            </div>
                        </div>

                    </div>
                    <div className='w-1/12 p-2 text-center kd2-list'><input value={item.fireTest.thickness} onChange={e => handleFireTest(e, "thickness", index)} type="text" className='w-full h-full text-center hover:outline rounded-lg' placeholder='Nhập độ dày' /></div>
                    <div className='w-1/12 p-2 text-center kd2-list flex items-center justify-center'><span className=''>{index + 1}/{props.fireTestItemGroup.fireTestItem.length} mẫu</span></div>
                    <div className='w-1/12 p-2 text-center kd2-list'><input value={formatToThousandDot(item.fireTest.m1000)} onChange={e => handleFireTest(e, "m1000", index)} type="text" className='w-full h-full text-center hover:outline rounded-lg' placeholder='Nhập...' /></div>
                    <div className='w-1/12 p-2 text-center kd2-list'><input value={formatToThousandDot(item.fireTest.m100)} onChange={e => handleFireTest(e, "m100", index)} type="text" className='w-full h-full text-center hover:outline rounded-lg' placeholder='Nhập...' /></div>
                    <div className='w-1/12 p-2 text-center kd2-list'><input value={formatToThousandDot(item.fireTest.m50)} onChange={e => handleFireTest(e, "m50", index)} type="text" className='w-full h-full text-center hover:outline rounded-lg' placeholder='Nhập...' /></div>
                    <div className='w-1/12 p-2 text-center kd2-list'><input value={formatToThousandDot(item.fireTest.m30)} onChange={e => handleFireTest(e, "m30", index)} type="text" className='w-full h-full text-center hover:outline rounded-lg' placeholder='Nhập...' /></div>
                    <div className='w-1/12 p-2 text-center kd2-list'><input value={formatToThousandDot(item.fireTest.u30)} onChange={e => handleFireTest(e, "u30", index)} type="text" className='w-full h-full text-center hover:outline rounded-lg' placeholder='Nhập...' /></div>
                    <div className='w-1/12 p-2 text-center kd2-list'><input value={formatToThousandDot(item.fireTest.u10)} onChange={e => handleFireTest(e, "u10", index)} type="text" className='w-full h-full text-center hover:outline rounded-lg' placeholder='Nhập...' /></div>
                    <div className='w-1/12 p-2 text-center kd2-list flex items-center justify-center'>
                        <button onClick={e => handleDel(index)} className='bg-white p-2 rounded text-red-500 hover:bg-gray-300'><Trash2 /></button>
                    </div>
                </div>
            ))}
            <button onClick={e => handleAddNew()} type='button' className="inline-block w-full bg-gray-800 hover:bg-gray-900 text-gray-200 font-bold py-2 px-2 rounded"
            >+ Thêm kiểm định</button>
        </div>
    )
}
