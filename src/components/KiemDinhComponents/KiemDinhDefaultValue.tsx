"use client"
import GetPattern from '@/ApiPattern/GetPattern';
import PostPattern from '@/ApiPattern/PostPattern';
import { formatNumberToDot } from '@/data/FunctionAll';
import { ChevronDown, Settings } from 'lucide-react'
import React, { useEffect, useState } from 'react'

type maxMin = {
    id:any,
    value1:number,
    value2:number,
    value3:number,
    value4:number
}
export default function KiemDinhDefaultValue() {
    const [isOpen, setIsOpen] = useState(false);
    let newMaxMin : maxMin = {id:"",value1:0,value2:0,value3:0,value4:0}
    const [maxMin,setMaxMin] = useState<maxMin[]>([newMaxMin,newMaxMin]);
    const [price,setPrice] = useState<number>(0);
    useEffect(()=>{
        const fetchData= async()=>{
            let url = process.env.NEXT_PUBLIC_API_URL + "/api/fireTest/getFireTestDefaultValue"
            const response = await GetPattern(url,{});
            // console.log(response);
            if (response.value && Array.isArray(response.value)) {
                let temp : maxMin[] =  response.value.map((item:any,index:number)=>{
                    if (index<2) {
                        let arr:string[] = item.value.split("./");
                        // console.log(arr);
                        if (arr.length==4) {
                            return {id:item.id,value1:arr[0],value2:arr[1],value3:arr[2],value4:arr[3]}
                        }
                        return newMaxMin;
                    }
                    else{
                        setPrice(parseFloat(item.value));
                    }
                })
                setMaxMin(temp);
            }
        }        
        fetchData();
    },[])
    const handleChange = (e:any,key:string,index:number) =>{
        let value = e.target.value;
        value = value==="" ? 0 : parseFloat(value);
        let temp = [...maxMin];
        temp[index] = {...temp[index],[key]:value}
        console.log(temp);
        setMaxMin(temp);
    }
    const handlePrice = (e:any) =>{
        let value = e.target.value;
        value = parseFloat(value.replace(/\./g, ''));
        setPrice(value);
    }
    const handleSubmit = async () =>{
        let postData : any[] = [];
        let maxMinArr = maxMin.map((item:maxMin,index)=>{
            let name = index===0 ? "A" : "B";
            let str : string = item.value1+"./"+item.value2+"./"+item.value3+"./"+item.value4;
            return {id:item.id,name:name,value:str,type:"AB"}
        }) 
        let third : any = {id:2,name:"license fee",value:price.toString(),type:"bonus"};
        postData = [...maxMinArr,third];
        console.log(postData);
        let url = process.env.NEXT_PUBLIC_API_URL + "/api/fireTest/updateFireTestDefaultValue"
        const response = await PostPattern(url,postData,{})
        console.log(response)
    }
    return (
        <div className='flex flex-col bg-gray-800 rounded text-gray-300 max-w-fit'>
            <button 
                className='text-sm hover:bg-gray-950 border-b border-gray-500 flex flex-row items-center justify-between w-[500px] p-4 bg-gray-900 shadow-lg'
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className='flex items-center space-x-2'>
                    <Settings />
                    <span>Thiết lập giá trị</span>
                </div>
                <ChevronDown />
            </button>
            {/* Dropdown content */}
            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <div className='flex flex-col p-4 space-y-2'>
                    <div className='flex flex-row space-x-2 items-center py-2'>
                        <span className='text-xl border-r border-white p-4'>A</span>
                        <div className='flex flex-col'>
                            <span className='text-xs'>WMax(%)</span>
                            <input value={maxMin[0].value1} type="text" className='w-20 text-center bg-gray-500 text-gray-300' onChange={e=>handleChange(e,"value1",0)}/>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs'>HMax(%)</span>
                            <input value={maxMin[0].value2} type="text" className='w-20 text-center bg-gray-500 text-gray-300' onChange={e=>handleChange(e,"value2",0)}/>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs'>WMin(%)</span>
                            <input value={maxMin[0].value3} type="text" className='w-20 text-center bg-gray-500 text-gray-300' onChange={e=>handleChange(e,"value3",0)}/>
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs'>HMin(%)</span>
                            <input value={maxMin[0].value4} type="text" className='w-20 text-center bg-gray-500 text-gray-300' onChange={e=>handleChange(e,"value4",0)}/>
                        </div>
                    </div>
                    <div className='flex flex-row space-x-2 items-center py-2'>
                        <span className='text-xl border-r border-white p-4'>B</span>
                        <div className='flex flex-col'>
                            <span className='text-xs'>WMax(%)</span>
                            <input value={maxMin[1].value1} type="text" className='w-20 text-center bg-gray-500 text-gray-300' onChange={e=>handleChange(e,"value1",1)} />
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs'>HMax(%)</span>
                            <input value={maxMin[1].value2} type="text" className='w-20 text-center bg-gray-500 text-gray-300' onChange={e=>handleChange(e,"value2",1)} />
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs'>WMin(%)</span>
                            <input value={maxMin[1].value3} type="text" className='w-20 text-center bg-gray-500 text-gray-300' onChange={e=>handleChange(e,"value3",1)} />
                        </div>
                        <div className='flex flex-col'>
                            <span className='text-xs'>HMin(%)</span>
                            <input value={maxMin[1].value4} type="text" className='w-20 text-center bg-gray-500 text-gray-300' onChange={e=>handleChange(e,"value4",1)} />
                        </div>
                    </div>
                    <div className='space-x-2'>
                        <span className='text-xs'>Tiền cấp giấy</span>
                        <input value={formatNumberToDot(price)} onChange={e=>handlePrice(e)} type="text" className='bg-gray-500 text-gray-300 px-4 w-32' />
                    </div>
                    <div>
                        <button onClick={e=>handleSubmit()} className='w-full bg-gray-200 py-2 rounded text-gray-600 hover:shadow hover:bg-gray-300'>Lưu</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
