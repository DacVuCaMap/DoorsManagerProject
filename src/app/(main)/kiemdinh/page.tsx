import GetPattern from '@/ApiPattern/GetPattern';
import KiemDinhMain from '@/components/KiemDinhComponents/KiemDinhMain'
import { LoadSelectData } from '@/data/FunctionAll'
import DoorNameSelect from '@/Model/DoorNameSelect'
import React from 'react'

export default async function page() {
  let selectData = await LoadSelectData();
  let selectGlass: any[] = []
  let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/get-list-group?type=glass";
  const response = await GetPattern(url, {});
  if (response && response.value && Array.isArray(response.value)) {
    selectGlass = response.value;
  }
  return (
    <KiemDinhMain selectData={selectData} selectGlass={selectGlass} />
  )
}
