"use client"
import Link from 'next/link';
import React from 'react'
type HomeSelect = {
    title: string,
    url: string,
    content:string
}
export default function HomeComponent() {
    const listHome: HomeSelect[] = [{ title: "Báo giá", url: "/baogia/add",content:"Triển khai báo giá dễ dàng sử dụng." }
        , { title: "Phụ kiện", url: "/phukien/list?page=0&size=100", content:"Make your React component async and await your data. Next.js supports both server and client data fetching."}
        , { title: "Mẫu cửa", url: "/maucua",content:"Make your React component async and await your data. Next.js supports both server and client data fetching." }
        , { title: "Nhóm phụ kiện", url: "/gannhomphukien",content:"Make your React component async and await your data. Next.js supports both server and client data fetching." }];

    return (
        <div className='text-gray-200 font-mono flex flex-col justify-center items-center py-16'>
            <div className='mb-10'>
                <p className=' font-bold text-6xl'>SOLUTION FOR NOVODOOR</p>
            </div>
            <div className='grid grid-cols-2 gap-x-10 gap-y-6'>
                {listHome.map((item, index) => (
                    <Link key={index} href={item.url}>
                        <div className='w-[500px] border text-gray-400 border-gray-400 rounded-xl py-4 px-4 h-40 hover:text-gray-200 hover:border-gray-200'>
                            <p className='text-2xl'>{item.title}</p>
                            <p className='text-gray-400'>{item.content}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}
