"use client"
import React, { useState } from 'react'
import GanlenhFormAdd from './GanlenhFormAdd'
import GanlenhList from './GanlenhList'

export default function GanlenhMain() {
  const [cmd, setCmd] = useState({ name1: "", name2: "" });
  const selectCommand = (command: string) => {
    let parts = command.split(/-(.+)/);
    console.log(parts)
    if (parts[0] && parts[1]) {
      setCmd({ name1: parts[0], name2: parts[1] })
    }
  }
  const [refreshTrigger,setRefreshTrigger] = useState(0);
  return (
    <div className='w-full flex lg:flex-row flex-col justify-center'>
      {/* left */}
      <div className='w-[500px] p-4 flex flex-col space-y-4'>
        <div className='w-full bg-white rounded-lg p-4 shadow-md hover:shadow-2xl transition duration-150 ease-out'>
          <GanlenhFormAdd cmdMain={cmd} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger}/>
        </div>
      </div>


      {/* right */}
      <div className='w-96 p-4'>
        <div className='bg-white w-full rounded-lg shadow-md hover:shadow-2xl transition duration-150 ease-out'>
          <GanlenhList selectCommand={selectCommand} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger}/>
        </div>
      </div>

    </div>
  )
}
