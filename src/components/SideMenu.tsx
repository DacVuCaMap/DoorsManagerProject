"use client"
import { listMenu } from '@/data/ListData'
import { NotepadText } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

export default function SideMenu() {
    const list = listMenu;
    const pathName = usePathname();
    const parts = pathName.split('/');  // Split the URL by '/'
    const keyword = parts[1];  // Get the part you need
    return (
        <div className='fixed top-24 left-4 z-50'>
            <div className="max-w-2xl mx-auto">
                <aside className="w-64" aria-label="Sidebar">
                    <div className="px-3 py-4 overflow-y-auto rounded bg-gray-200 ">
                        <ul className="space-y-2">
                            {list.map((item: any, index) => (
                                <li key={index}>
                                    <Link target='_top' href={item.href}
                                        className={`flex items-center p-2 text-base font-normal rounded-lg ${item.select===keyword ? "bg-gray-900 text-gray-200 font-bold" : " hover:bg-gray-900 text-gray-500 "}`}>
                                        {item.icon && <item.icon className='font-bold text-gray-500' />}
                                        <span className="ml-3">{item.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>

    )
}
