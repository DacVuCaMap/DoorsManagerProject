import SideBar from '@/components/SideBar';
import React from 'react'

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <div className="flex text-black">
            <div className='w-full min-h-screen bg-gray-300 relative'>
                <SideBar/>
                {children}
            </div>
        </div>
    )
}
