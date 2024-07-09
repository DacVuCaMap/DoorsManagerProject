import SideBar from '@/components/SideBar';
import React from 'react'

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <div className="flex bg-white text-black">
            <div className='w-full'>
                {children}
            </div>
        </div>
    )
}
