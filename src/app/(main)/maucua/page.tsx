
import GetPattern from '@/ApiPattern/GetPattern';
import MauCuaComponent from '@/components/MaucuaComponent/MauCuaComponent'
import { LoadAccesoryGroupNoAcs, LoadAccessoriesDataOffline } from '@/data/FunctionAll';
import Accessories from '@/Model/Accessories';
import GroupAccessory from '@/Model/GroupAccessory';
import React from 'react'

export default async function page() {
  let acsGlass: Accessories[] = [];
  let acsGroup: GroupAccessory[] = [];
  const url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/get-acs-by-type?type=glass";
  const response = await GetPattern(url, {});
  if (response && response.value && response.value[0] && response.value[0].accessories) {
    acsGlass = response.value[0].accessories;
  }
  
  const result: GroupAccessory[] = await LoadAccesoryGroupNoAcs();
  acsGroup = result;
  const acsData: Accessories[] = await LoadAccessoriesDataOffline();
  return (  
    <MauCuaComponent acsGlass={acsGlass} acsGroup={acsGroup} acsData={acsData} />
  )
}
