
import GetPattern from '@/ApiPattern/GetPattern';
import AddBaoGia from '@/components/baogiaComponents/AddBaoGia'
import CreateBaoGia from '@/components/NewBaoGiaComponents/CreateBaoGia';
import { dataSelect } from '@/data/AddData'
import { LoadAccesoryGroupNoAcs, LoadAccessoriesDataOffline, LoadFireTest, LoadListDoorModelData, LoadSelectData } from '@/data/FunctionAll';
import Accessories from '@/Model/Accessories';
import cmdData from '@/Model/cmdData';
import DoorModel from '@/Model/DoorModel';
import DoorNameSelect from '@/Model/DoorNameSelect';
import FireTest from '@/Model/FireTest';
import GroupAccessory from '@/Model/GroupAccessory';
import React from 'react'

export default async function page() {
  const groupAcsData : GroupAccessory[] = await LoadAccesoryGroupNoAcs();
  const acsData : Accessories[] = await LoadAccessoriesDataOffline();
  const doorModelData : any[] = await LoadListDoorModelData();
  return (
    <div className='w-full'>
      {/* <AddBaoGia dataName={data}/> */} 
      <CreateBaoGia groupAcsData={groupAcsData} acsData={acsData} doorModelData={doorModelData} />
    </div>
  )
}

