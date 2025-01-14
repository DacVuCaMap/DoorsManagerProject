export const dynamic = 'force-dynamic';
import GetPattern from '@/ApiPattern/GetPattern';
import CreateBaoGia from '@/components/NewBaoGiaComponents/CreateBaoGia';
import { LoadAccesoryGroupNoAcs, LoadAccessoriesDataOffline, LoadFireTest, LoadListDoorModelData, LoadSelectData } from '@/data/FunctionAll';
import Accessories from '@/Model/Accessories';
import AcsAndType from '@/Model/AcsAndType';
import GroupAccessory from '@/Model/GroupAccessory';
import React from 'react'

export default async function page() {

  const LoadAccesoryGroupNoAcsTest = async () => {
    let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/get-list-group"
    const response = await GetPattern(url, {});
    if (response && response.value && Array.isArray(response.value)) {
      const rs: GroupAccessory[] = response.value.map((item: any, index: number) => {
        const acsAndType: AcsAndType[] = item.accessories.map((acs: any) => {
          return { accessories: acs, type: acs.type };
        })
        return { id: item.id, name: item.name, type: item.type, accessoriesAndType: acsAndType };
      })
      return rs;
    }
    return [];
  }
  const LoadAccessoriesDataOfflineTest = async () => {
    let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/list?page=0&size=1000&search";
    const response = await GetPattern(url, {});
    if (response && response.content && Array.isArray(response.content)) {
      const list: any[] = response.content;
      let newAcs: Accessories[] = list.map((item: any, index: number) => {
        return {
          id: item.id,
          code: item.code,
          name: item.name,
          supplier: item.supplier,
          totalQuantity: 0,
          quantity: 0,
          width: 0,
          height: 0,
          orgPrice: item.orgPrice,
          lowestPricePercent: item.lowestPricePercent,
          lowPercent: item.lowPercent,
          price: 0,
          unit: item.unit,
          status: false,
          type: item.type,
          isCommand: false,
          accessoryGroup: item.accessoryGroup ? item.accessoryGroup : null,
          acsDes: item.acsDes
        };
      });
      return newAcs;
    }
    return [];
  }
  const LoadListDoorModelDataTest = async () => {
    const url = process.env.NEXT_PUBLIC_API_URL + "/api/door-model/list";
    const response = await GetPattern(url, {});
    if (response && Array.isArray(response) && response.length > 0 && response[0].name) {
      return response;
    }
    return [];
  }

  const groupAcsData: GroupAccessory[] = await LoadAccesoryGroupNoAcsTest();
  const acsData: Accessories[] = await LoadAccessoriesDataOfflineTest();
  const doorModelData: any[] = await LoadListDoorModelDataTest();
  return (
    <div className='w-full'>
      {/* <AddBaoGia dataName={data}/> */}
      <CreateBaoGia groupAcsData={groupAcsData} acsData={acsData} doorModelData={doorModelData} />
    </div>
  )
}

