"use client"
import Accessories from '@/Model/Accessories';
import React, { useState } from 'react'

export default function GanlenhFormAdd() {
  const [name, setName] = useState<string>();
  const [listAcsId, setListAcsId] = useState<number[]>([]);
  const [listAcs, setListAcs] = useState<any[]>([]);
  const handleAddList = () => {

  }
  const handleSubmit = (e: any) => {
    e.preventdefault();

  }

  return (
    <div className='w-full h-full'>
      <h2 className='font-bold text-lg mb-2'>Form gán mặc định</h2>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="" className='text-sm text-gray-400'>Tên Quy cách</label>
        <input type="text" onChange={(e) => setName(e.target.value)} className='w-full text-sm h-8 rounded-lg py-4 px-4 outline-blue-400 border border-gray-300 mb-10' />

        <button type='button' onClick={handleAddList} className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full mb-1'>+ Thêm vật liệu</button>
        <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'>Lưu</button>
        
        <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
          <div className="flow-root">
            <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
              <li className="py-3 sm:py-4">
                <div className="flex items-center">
                  <div className="flex-1 min-w-0 ms-4">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      Neil Sims
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      email@windster.com
                    </p>
                  </div>
                  <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                    $320
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  )
}
