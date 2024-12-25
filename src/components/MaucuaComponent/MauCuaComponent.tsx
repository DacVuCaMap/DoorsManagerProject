"use client"
import React from 'react'
import MauCuaEditComponent from './MauCuaEditComponent'
import MauCuaListComponent from './MauCuaListComponent'

export default function MauCuaComponent() {
  return (
    <div className='text-white flex flex-row justify-center items-center space-x-4'>
        <MauCuaEditComponent/>
        <MauCuaListComponent/>
    </div>
  )
}
