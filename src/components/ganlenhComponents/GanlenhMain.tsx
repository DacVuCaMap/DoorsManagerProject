"use client"
import React, { useEffect, useState } from 'react'
import GanlenhFormAdd from './GanlenhFormAdd'
import GanlenhList from './GanlenhList'
import DoorSelectNameComponent from '../DoorSelectNameComponents/DoorSelectNameComponent';
import { Settings } from 'lucide-react';
import DoorNameSelect from '@/Model/DoorNameSelect';
import { LoadSelectData } from '@/data/FunctionAll';

export default function GanlenhMain() {
  const [cmd, setCmd] = useState({ name1: "", name2: "",name3:"" });
  const [openDoorSelect,setOpenDoorSelect] = useState(false);
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
  },[openDoorSelect])
  return (
    <div className='w-full flex lg:flex-row flex-col justify-center space-x-4'>
      {openDoorSelect && <DoorSelectNameComponent data={doorNameSelect} setOpen={setOpenDoorSelect}/>}
      {/* left */}
      <div className='w-[500px] flex flex-col space-y-4'>
        <div className='w-full bg-white rounded-lg p-4 shadow-md hover:shadow-2xl transition duration-150 ease-out'>
          <GanlenhFormAdd selectDoorName={doorNameSelect} cmdMain={cmd} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />
        </div>
      </div>


      {/* right */}
      <div className='w-[500px]'>
        <div className='w-full rounded-lg  space-y-4'>
          <button onClick={e=>setOpenDoorSelect(true)} className='w-full flex flex-row space-x-2 text-blue-500 font-bold hover:bg-blue-500 hover:text-white p-2 bg-white rounded shadow-md hover:shadow-2xl transition duration-150 ease-out'>
            <Settings /> <span>Thiết lập tên qui cách</span>
          </button>
          <div className='shadow-md hover:shadow-2xl transition duration-150 ease-out'>
            <GanlenhList selectCommand={selectCommand} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />
          </div>

        </div>
      </div>

    </div>
  )
}
