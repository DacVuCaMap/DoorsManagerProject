
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

type fireTestGroup = {
  id:any,
  fireTest:FireTest[]
}
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

const getProductDefaultCommand = async () => {
  let url = process.env.NEXT_PUBLIC_API_URL + "/api/product-command/listCommandAndId";
  const response = await GetPattern(url, {});
  if (response && response.value && Array.isArray(response.value)) {
    const rs : any[] = response.value.map((item:any)=>{
      return {str:item.command.replace("-"," "),command:item.command,mainAcsId:item.mainAccessoryGroup.id};
    })
    return rs;
  }
  return [];
}

