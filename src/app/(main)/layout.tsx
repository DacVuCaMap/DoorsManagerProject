import HeaderComponent from '@/components/HeaderComponent';
import SideBar from '@/components/SideBar';
import React from 'react'

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {

    return (
        <div className="flex text-black">
            <div className='w-full min-h-screen bg-gray-950 relative'>
                <div className=' h-20 mb-10 mx-32'>
                    <HeaderComponent />
                </div>
                <SideBar />
                {children}
            </div>
        </div>
    )
}
