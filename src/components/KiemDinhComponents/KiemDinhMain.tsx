"use client"
import React from 'react'
import KiemDinhList from './KiemDinhList'
import DoorNameSelect from '@/Model/DoorNameSelect';
type Props = {
    selectData:DoorNameSelect[];
    selectGlass:any[];
}
export default function KiemDinhMain(props:Props) {

    return (
        <div className='w-full flex flex-col px-2'>
            <div className='border-b border-gray-500 text-gray-200 flex text-sm sticky top-0 z-10 bg-gray-950'>
                <div className='w-1/12 p-2 text-center font-bold'>STT</div>
                <div className='w-11/12 flex flex-row'>
                    <div className='w-4/12 p-2 text-center font-bold'>Mẫu cửa</div>
                    <div className='w-1/12 p-2 text-center font-bold'>Độ dày thép cánh</div>
                    <div className='w-1/12 p-2 text-center font-bold'>Dự án {'>'} 1000 bộ</div>
                    <div className='w-1/12 p-2 text-center font-bold'>Dự án {'>'} 100 bộ</div>
                    <div className='w-1/12 p-2 text-center font-bold'>Dự án {'>'} 50 bộ</div>
                    <div className='w-1/12 p-2 text-center font-bold'>Dự án 30-50 bộ</div>
                    <div className='w-1/12 p-2 text-center font-bold'>Dự án {'<'} 30 bộ</div>
                    <div className='w-1/12 p-2 text-center font-bold'>Dự án {'<'} 10 bộ</div>
                    <div className='w-1/12 p-2 text-center font-bold'>Xóa</div>
                </div>
            </div>
            <div className=''>
                <KiemDinhList selectData={props.selectData} selectGlass={props.selectGlass} />
            </div>
        </div>
    )
}
