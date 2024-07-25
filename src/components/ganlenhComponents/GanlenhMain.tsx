"use client"
import React from 'react'
import GanlenhFormAdd from './GanlenhFormAdd'
import GanlenhList from './GanlenhList'

export default function GanlenhMain() {
  return (
    <div className='w-full flex lg:flex-row flex-col justify-center'>
        {/* left */}
      <div className='w-[500px] p-4 flex flex-col space-y-4 mt-6'>
        <div className='w-full bg-white rounded-lg p-4 shadow-md hover:shadow-2xl transition duration-150 ease-out'>
          <GanlenhFormAdd/>
        </div>
      </div>

      
      {/* right */}
      <div className='w-96 p-4'>
        <div className='bg-white  w-full h-full rounded-lg shadow-md hover:shadow-2xl transition duration-150 ease-out'>
          <GanlenhList />
        </div>
      </div>

    </div>
  )
}
