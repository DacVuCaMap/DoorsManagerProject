"use client"
import React, { useState } from 'react'
import MauCuaEditComponent from './MauCuaEditComponent'
import MauCuaListComponent from './MauCuaListComponent'
import DoorModel, { newDoorModel } from '@/Model/DoorModel';
import { set } from 'lodash';
import AccessoryAndFeature from '@/Model/AccessoryAndFeature';
import Accessories from '@/Model/Accessories';
import GroupAccessory from '@/Model/GroupAccessory';
type Props = {
  acsGlass: Accessories[];
  acsGroup: GroupAccessory[];
  acsData: Accessories[];
}
export default function MauCuaComponent(props: Props) {
  const [curDoorModel, setCurDoorModel] = useState<DoorModel>(newDoorModel());
  const listAcsGroup = props.acsGroup;
  console.log(props.acsGroup);
  const handleClick = (doorItem: any) => {
    console.log(doorItem);
    const acsGroupAndFeatures: AccessoryAndFeature[] = [];
    const acsGroupCost: AccessoryAndFeature[] = [];
    if (doorItem.accessoryAndFeatures && Array.isArray(doorItem.accessoryAndFeatures)) {
      doorItem.accessoryAndFeatures.forEach((item: any) => {
        const tempAcsGroup: GroupAccessory | undefined = listAcsGroup.find(groupItem => groupItem.id === item.accessoryGroupId);
        if (tempAcsGroup) {
          const newAcsAndFeature: AccessoryAndFeature = new AccessoryAndFeature(tempAcsGroup, item.quantity, item.condition, item.acsType, item.id);
          if (newAcsAndFeature.acsType && newAcsAndFeature.acsType === "cost") {
            acsGroupCost.push(newAcsAndFeature);
          } else {
            acsGroupAndFeatures.push(newAcsAndFeature);
          }

        }
      })
    }
    const acsMain: Accessories | null = props.acsData.find(item => item.id === doorItem.accessoryMainId) || null;
    const acsGlass: Accessories | null = props.acsData.find(item => item.id === doorItem.accessoryGlassId) || null;
    const acsNep: Accessories | null = props.acsData.find(item => item.id === doorItem.glassBracketId) || null;
    setCurDoorModel(new DoorModel(doorItem.id, doorItem.name, doorItem.showName, doorItem.shortName, acsGroupAndFeatures
      , acsMain, acsGlass, acsNep, doorItem.fireTestCondition, doorItem.fireTestValue, doorItem.numberDoor,acsGroupCost,doorItem.wingType ?? 'cánh'));
  }
  return (
    <div className='text-white flex flex-row justify-center items-center space-x-4'>
      <MauCuaEditComponent curDoorModel={curDoorModel} acsGlass={props.acsGlass} acsGroup={props.acsGroup} />
      <MauCuaListComponent handleClick={handleClick} />
    </div>
  )
}
