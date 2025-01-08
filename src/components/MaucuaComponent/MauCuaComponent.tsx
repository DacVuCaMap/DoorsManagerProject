"use client"
import React, { useState } from 'react'
import MauCuaEditComponent from './MauCuaEditComponent'
import MauCuaListComponent from './MauCuaListComponent'
import DoorModel, { newDoorModel } from '@/Model/DoorModel';
import { set } from 'lodash';

export default function MauCuaComponent() {
  const [curDoorModel, setCurDoorModel] = useState<DoorModel>(newDoorModel());
  const handleClick = (item:any) => {
    console.log(item);
    setCurDoorModel(new DoorModel(null,"","",[],null,null,null,"","",1));
  }
  return (
    <div className='text-white flex flex-row justify-center items-center space-x-4'>
        <MauCuaEditComponent curDoorModel={curDoorModel}/>
        <MauCuaListComponent handleClick={handleClick}/>
    </div>
  )
}
