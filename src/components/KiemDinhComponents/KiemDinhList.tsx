import { LoadSelectData } from '@/data/FunctionAll';
import DoorNameSelect from '@/Model/DoorNameSelect';
import React, { useEffect, useState } from 'react'
import { BarLoader, ScaleLoader } from 'react-spinners';
import "./KiemDinhList.css"
import Accessories from '@/Model/Accessories';
import GetPattern from '@/ApiPattern/GetPattern';
import { Check, Save, TriangleAlert } from 'lucide-react';
import FireTest from '@/Model/FireTest';
import KiemDinhItem from './KiemDinhItem';
import { listColor } from '@/data/ListData';
import FireTestGroupRequest from '@/Request/FireTestGroupRequest';
import PostPattern from '@/ApiPattern/PostPattern';

type FireTestItem = {
    fireTest: FireTest,
    status: boolean,
    statusDetails: boolean,
    showDetails: boolean,
    curSelect: DoorNameSelect,
    command: command
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
type FireTestItemGroup = {
    id: any
    fireTestItem: FireTestItem[],
    color: number
}
type Props = {
    selectData:DoorNameSelect[];
    selectGlass:any[];
}
export default function KiemDinhList(props:Props) {
    const selectData = props.selectData;
    const selectGlass = props.selectGlass;
    const [listFireTest, setListFireTest] = useState<FireTestItemGroup[]>([]);
    const [selectColor, setSelectColor] = useState(0);
    const [loading, setLoading] = useState(0);
    const [success,setSuccess] = useState(0);
    const [refresh,setRefresh] = useState(0);
    const colorsHoverData = ["bg-blue-800", "bg-violet-900", "bg-green-900", "bg-pink-900"];
    const colorsData = ["bg-blue-600", "bg-violet-700", "bg-green-700", "bg-pink-700"];
    // load data listFireTest
    useEffect(() => {
        const fetchData = async () => {
            let url = process.env.NEXT_PUBLIC_API_URL + "/api/fireTest/getAllGroup";
            setLoading(1)
            const response = await GetPattern(url, {});
            if (response && response.value && Array.isArray(response.value)) {
                const newList: FireTestItemGroup[] = response.value.map((item: any, ind: number) => {
                    let fireTestItem: FireTestItem[] = [];
                    fireTestItem = item.fireTestItemList.map((childItem: any, childInd: number) => {
                        let fireTest: FireTest = childItem;
                        let curSelect: DoorNameSelect = selectData.find(doorName => doorName.id === childItem.doorNameSelectId) || new DoorNameSelect("", "", [], [], [], "");
                        let str: string[] = childItem.name.split('./');
                        let cmd: command = changeStrToCmd(str);
                        return { fireTest: fireTest, status: true, statusDetail: true, showDetails: false, curSelect: curSelect, command: cmd };
                    })
                    return { id: item.id, fireTestItem: fireTestItem, color: item.color }
                })
                console.log(newList)
                setListFireTest(newList);
                setLoading(0)
            }
        }
        if (selectData.length > 0) {
            fetchData();
        }
    }, [refresh])
    const handleAddNewTest = () => {
        setListFireTest(prevList => [...prevList, { fireTestItem: [], color: selectColor, id: "" }]);
    }
    const handleChangeFireTestItem = (fireTestItem: FireTestItem[], index: number) => {
        const updatedListFireTest = [...listFireTest];
        updatedListFireTest[index] = {
            ...updatedListFireTest[index],
            fireTestItem: fireTestItem,
        };
        setListFireTest(updatedListFireTest);
    }
    const handleSubmit = async () => {
        let postData: FireTestGroupRequest[] = listFireTest.map((item: FireTestItemGroup, index: number) => {
            const fireTestList: FireTest[] = item.fireTestItem.map((item: FireTestItem, ind) => {
                return { ...item.fireTest, thickness: parseFloat(item.fireTest.thickness.toString()) }
            })
            return { id: item.id, fireTestItemList: fireTestList, color: item.color };
        })
        setLoading(2)
        let url = process.env.NEXT_PUBLIC_API_URL + "/api/fireTest/updateFireTest";
        const response = await PostPattern(url, postData, {});
        setSuccess(1)
        setRefresh(refresh+1);
        setListFireTest([]);
        setTimeout(() => {
            setSuccess(0);
        }, 5000);
        // console.log(response);
        console.log(postData);
    }
    const changeStrToCmd = (arr: string[]): command => {
        if (arr.length === 9) {
            return {
                numberDoor: arr[0],
                type: arr[1],
                code: arr[2],
                width: parseFloat(arr[3]),
                height: parseFloat(arr[4]),
                glass: arr[5],
                glassW: parseFloat(arr[6]),
                glassH: parseFloat(arr[7]),
                glassT: parseFloat(arr[8])
            };
        }
        else {
            return { numberDoor: "", type: "", code: "", width: 0, height: 0, glass: "", glassW: 0, glassH: 0, glassT: 0 };
        }
    }
    return (
        <div className='w-full h-full py-4 kd-list flex flex-col space-y-4'>
            {listFireTest.map((item: FireTestItemGroup, index) =>
            (
                <div key={index} className={`text-gray-200 text-sm flex flex-col ${listColor[item.color].color} rounded-xl items-center pb-2`}>
                    <div className='flex w-full h-full flex-row items-center relative'>
                        <div className='w-1/12 p-2 text-center text-lg font-bold flex flex-col h-full items-center justify-center'>
                            <span>{index + 1}</span>
                            <button onClick={e => setListFireTest(prevList => prevList.filter((prev, ind) => ind != index))} className='bg-red-500 p-1 text-xs rounded hover:bg-red-700 absolute bottom-0'>Xóa nhóm</button>
                        </div>
                        <KiemDinhItem colorHover={colorsHoverData[item.color]} handleChangeFireTestItem={handleChangeFireTestItem} index={index} fireTestItemGroup={item} selectData={selectData} selectGlass={selectGlass} />
                    </div>
                </div>
            )
            )}
            {loading === 1 && <div className='w-full flex items-center justify-center py-10'>
                <ScaleLoader color='gray' />
            </div>}

            <button type='button' className="inline-block w-full border-dashed border-2 border-gray-300 hover:bg-gray-700 text-gray-300 font-bold py-1 px-2 rounded"
                onClick={(e) => handleAddNewTest()}>+ Thêm nhóm kiểm định</button>

            <div className='flex flex-row justify-center space-x-2'>
                {colorsData.map((item: any, index) =>
                    <div key={index} onClick={e => setSelectColor(index)} className={`hover:bg-white hover:cursor-pointer p-2 ${index === selectColor ? 'border-b' : ""}`}>
                        <div className={`w-8 h-8 rounded-full ${item} flex items-center`}>
                            <div className={`w-4 h-4 rounded-full ${colorsHoverData[index]}`}></div>
                        </div>
                    </div>)}
            </div>
            {loading === 0 && <button onClick={e => handleSubmit()} className={`flex flex-row rounded-lg justify-center py-2 text-gray-300 font-semibold ${colorsData[selectColor]} hover:${colorsHoverData[selectColor]}`}><Save /> <span>Lưu</span></button>}
            {loading===2 && <button className={`flex flex-row rounded-lg justify-center py-4 text-gray-300 font-semibold ${colorsData[selectColor]} hover:${colorsHoverData[selectColor]}`}><BarLoader width={500}/></button>}
            {success === 1 && <div className='flex flex-col justify-center items-center'><Check size={40} className=' p-2 bg-green-400 rounded-full text-white' /> <span className='text-gray-500 font-semibold'>success</span></div>}
        </div>
    )
}
