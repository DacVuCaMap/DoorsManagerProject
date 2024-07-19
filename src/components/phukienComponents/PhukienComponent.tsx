"use client"
import GetListData from '@/ApiPattern/GetListData';
import Accessories from '@/Model/Accessories';
import { notFound, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import PhukienUploadExcel from './PhukienUploadExcel';
import PhukienList from './PhukienList';
import { NotebookPen } from 'lucide-react';

export default function PhukienComponent() {
  const searchParam = useSearchParams();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  let page = searchParam?.get('page');
  let size = searchParam?.get('size');
  let search = searchParam?.get('search');
  useEffect(() => {
    const fecthData = async () => {
      try {
        const listData = await GetListData("accessories", page, size, search);
        console.log(listData);
        setData(listData);
        setLoading(false);
      } catch (error) {
        notFound();
      }
    }
    fecthData();
  }, [page, size, search])
  return (
    <div className='h-full w-full p-10 flex lg:flex-row'>
      <div className='h-96 w-96 p-4 flex flex-col space-y-4'>
        <div className='w-full bg-green-400 shadow-green-500 rounded-lg p-4 shadow-md hover:shadow-2xl transition duration-150 ease-out'>
          <PhukienUploadExcel />
        </div>
        <div className='flex flex-row items-center justify-center w-full py-2 space-x-2 bg-blue-500 rounded text-center shadow-blue-700 hover:cursor-pointer shadow-md hover:shadow-2xl transition duration-150 ease-out'>

          <h2 className='leading-10 text-white text-sm font-semibold text-center'>+ Thêm Thủ Công</h2>
          <NotebookPen size={40} className='text-gray-200' />
        </div>
      </div>
      <div className='lg:flex-1 p-4'>
        <div className='bg-white  w-full h-full rounded-lg shadow-md hover:shadow-2xl transition duration-150 ease-out'>
          <PhukienList />
        </div>
      </div>

    </div>
  )
}

