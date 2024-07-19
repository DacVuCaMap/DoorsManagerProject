"use client"
import { AlignJustify, X } from 'lucide-react'
import React, { useState } from 'react'
import SideMenu from './SideMenu'

export default function SideBar() {
  const [openMenu,setOpenMenu] = useState(false);
  return (
    <div>
      <button typeof='button' className='h-14 w-14 rounded fixed top-4 left-4 bg-gray-800 hover:bg-gray-900 shadow-lg flex 
        items-center justify-center text-center hover:cursor-pointer' onClick={e=>setOpenMenu(!openMenu)}>
        {!openMenu ? <AlignJustify className='text-white' size={40} /> : <X className='text-white' size={40}/>}
        
      </button>
      {openMenu && <SideMenu/>}
    </div>
  )
}
