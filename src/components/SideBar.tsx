"use client"
import { AlignJustify, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import SideMenu from './SideMenu'

export default function SideBar() {
  const [openMenu, setOpenMenu] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenu &&
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openMenu]);

  return (
    <div>
      <button 
        ref={buttonRef}
        type="button" 
        className='h-14 w-14 rounded fixed z-50 top-12 left-4 bg-gray-200 hover:bg-gray-100 shadow-lg flex 
          items-center justify-center text-center hover:cursor-pointer opacity-50 hover:opacity-100' 
        onClick={() => setOpenMenu(!openMenu)}
      >
        {!openMenu ? <AlignJustify className='text-gray-800' size={40} /> : <X className='text-gray-800' size={40} />}
      </button>
      {openMenu && (
        <div ref={sidebarRef}>
          <SideMenu />
        </div>
      )}
    </div>
  )
}