
import AddBaoGia from '@/components/baogiaComponents/AddBaoGia'
import { dataSelect } from '@/data/AddData'
import DoorNameSelect from '@/Model/DoorNameSelect';
import React from 'react'

export default function page() {
    const data : DoorNameSelect[] = dataSelect;

  return (
    <div className='min-h-screen  w-full'>
        <AddBaoGia dataName={data}/>
    </div>
  )
}