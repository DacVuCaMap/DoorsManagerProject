
import AddBaoGia from '@/components/baogiaComponents/AddBaoGia'
import { dataSelect } from '@/data/AddData'
import { LoadSelectData } from '@/data/FunctionAll';
import DoorNameSelect from '@/Model/DoorNameSelect';
import React from 'react'

export default async function page() {
    
    const data : DoorNameSelect[] = await LoadSelectData();

  return (
    <div className='min-h-screen  w-full'>
        <AddBaoGia dataName={data}/>
    </div>
  )
}