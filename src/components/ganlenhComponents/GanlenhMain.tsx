"use client"
import React, { useEffect, useState } from 'react'
import GanlenhFormAdd from './GanlenhFormAdd'
import GanlenhList from './GanlenhList'
import DoorSelectNameComponent from '../DoorSelectNameComponents/DoorSelectNameComponent';
import { Settings } from 'lucide-react';
import DoorNameSelect from '@/Model/DoorNameSelect';
import { LoadSelectData } from '@/data/FunctionAll';
import GroupAccessory from '@/Model/GroupAccessory';
type Props = {
  acsGroupData : GroupAccessory[]
}
export default function GanlenhMain(props:Props) {
  const [cmd, setCmd] = useState({ name1: "", name2: "",name3:"" });
  const [openDoorSelect,setOpenDoorSelect] = useState(false);
  const [reFreshData,setReFreshData] = useState(0);
  const selectCommand = (command: string) => {
    console.log(command);
    const parts = command.split('-');
    console.log(parts)
    if (parts[0] && parts[1] && parts[2]) {
      setCmd({ name1: parts[0], name2: parts[1],name3:parts[2] })
    }
  }
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  /// load dataSelect 
  const [doorNameSelect,setDoorNameSelect] = useState<DoorNameSelect[]>([]);
  useEffect(()=>{
    const fetchData = async()=>{
      setDoorNameSelect(await LoadSelectData());
    }
    fetchData();
  },[openDoorSelect,reFreshData])
  return (
    <div className='w-full flex lg:flex-row flex-col justify-center space-x-4'>
      {openDoorSelect && <DoorSelectNameComponent reFreshData={reFreshData} setReFreshData={setReFreshData} data={doorNameSelect} setOpen={setOpenDoorSelect}/>}
      {/* left */}
      <div className='min-w-[500px] flex flex-col space-y-4'>
        <div className='w-full bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-2xl transition duration-150 ease-out'>
          <GanlenhFormAdd selectDoorName={doorNameSelect} cmdMain={cmd} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} acsGroupData={props.acsGroupData} />
        </div>
      </div>


      {/* right */}
      <div className='w-[500px]'>
        <div className='w-full rounded-lg  space-y-4'>
          <button onClick={e=>setOpenDoorSelect(true)} className='w-full flex flex-row space-x-2 text-blue-400 font-bold hover:bg-gray-600 hover:text-white p-2 bg-gray-800 rounded shadow-md hover:shadow-2xl transition duration-150 ease-out'>
            <Settings /> <span>Thiết lập tên mẫu cửa</span>
          </button>
          <div className='shadow-md hover:shadow-2xl transition duration-150 ease-out'>
            <GanlenhList selectCommand={selectCommand} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />
          </div>

        </div>
      </div>

    </div>
  )
}
