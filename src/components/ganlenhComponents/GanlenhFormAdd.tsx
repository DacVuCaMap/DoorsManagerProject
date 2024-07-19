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
      <h2 className='font-bold text-lg mb-2'>Form gán mặc định mới</h2>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="" className='text-sm text-gray-400'>Tên Cửa</label>
        <input type="text" onChange={(e) => setName(e.target.value)} className='w-full text-sm h-8 rounded-lg py-4 px-4 outline-blue-400 border border-gray-300 mb-10' />

        <button type='button' onClick={handleAddList} className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full mb-1'>+ Thêm vật liệu</button>
        <div className='w-full h-52 rounded-lg bg-red-400'>
          <table className='table-auto w-full'>
            <thead>
              <tr>
                <th>Mã</th>
                <th>Tên vật tư</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {listAcs.map((item: Accessories, index) => (
                <tr key={index}>
                  <td className='text-center'>TH01</td>
                  <td><h2 className='text-center '>Thanh thoát hiểm panic đơn Sơn tĩnh điện 550</h2></td>
                  <td><button type='button'>Xóa</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded'>Lưu</button>
      </form>
    </div>
  )
}
