import GanlenhMain from '@/components/ganlenhComponents/GanlenhMain'
import { LoadAccesoryGroupNoAcs } from '@/data/FunctionAll'
import React from 'react'

export default async function page() {
  const acsGroupData = await LoadAccesoryGroupNoAcs();
  return (
    <GanlenhMain acsGroupData={acsGroupData}/>
  )
}
