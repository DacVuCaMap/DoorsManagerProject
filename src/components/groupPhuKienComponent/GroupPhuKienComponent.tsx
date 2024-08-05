"use client"
import React, { useState } from 'react'
import FormNhomPhuKien from './FormNhomPhuKien'
import ListNhomPhuKien from './ListNhomPhuKien';

export default function GroupPhukienComponent() {
    const [cmd, setCmd] = useState("");
    const selectCommand = (command: string) => {
        setCmd(command);
    }
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    return (
        <div className='w-full flex lg:flex-row flex-col justify-center'>
            {/* left */}
            <div className='w-[500px] p-4 flex flex-col space-y-4'>
                <div className='w-full bg-white rounded-lg p-4 shadow-md hover:shadow-2xl transition duration-150 ease-out'>
                    <FormNhomPhuKien cmdMain={cmd} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />
                </div>
            </div>

            {/* right */}
            <div className='w-96 p-4'>
                <div className='bg-white w-full rounded-lg shadow-md hover:shadow-2xl transition duration-150 ease-out'>
                    <ListNhomPhuKien selectCommand={selectCommand} refreshTrigger={refreshTrigger} setRefreshTrigger={setRefreshTrigger} />
                </div>
            </div>
        </div>
    )
}
