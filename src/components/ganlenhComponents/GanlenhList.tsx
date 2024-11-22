import GetPattern from '@/ApiPattern/GetPattern';
import { Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { ScaleLoader } from 'react-spinners';

type Props = {
  selectCommand:(command:string) => void,
  refreshTrigger:number
  setRefreshTrigger: (trigger: number) => void;
}
export default function GanlenhList(props:Props) {
  const [list, setList] = useState<string[]>();
  const [loading,setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      let url = process.env.NEXT_PUBLIC_API_URL + "/api/product-command/listCommand";
      try {
        setLoading(true)
        const response = await GetPattern(url, {});
        if (response.value && Array.isArray(response.value)) {
          setList(response.value);
        }
      } catch (error) {
        console.log(error)
      }
      setLoading(false)
    }
    fetchData();
  },[props.refreshTrigger])
  const handleDelete = async(command : string) =>{
    let url = process.env.NEXT_PUBLIC_API_URL + "/api/product-command/delByCommand?command="+command;
    const response = await GetPattern(url,{});
    props.setRefreshTrigger(props.refreshTrigger + 1 );
  }
  return (
    <div className='overflow-auto h-[450px] bg-gray-800'>
      <table className='w-full'>
        <thead>
          <tr>
            <th className='sticky top-0 bg-blue-900 text-white z-10'></th>
            <th className='sticky top-0 bg-blue-900 text-white z-10 py-2'>Danh sách Mẫu cửa</th>
            <th className='sticky top-0 bg-blue-900 text-white z-10'></th>
          </tr>
        </thead>
        <tbody>
          {list?.map((command: string, index) => (
            <tr key={index} className={`${index % 2 != 0 ? "bg-gray-600" : "bg-gray-700"} text-gray-300 hover:shadow-xl hover:bg-gray-800 hover:text-white`}>
              <td className='text-center'>{index + 1}</td>
              <td className=' text-center'>
                <div className='hover:cursor-pointer py-4 px-2 h-full w-full' onClick={e=>props.selectCommand(command)}>
                  {command}
                </div>
              </td>
              <td className='text-center text-red-600'><button className='bg-white p-2 rounded' onClick={e=>handleDelete(command)}><Trash2 /></button></td>
            </tr>
          ))}
          {loading && <tr>
            <td colSpan={3}>
              <div className='py-20 text-center'>
                <ScaleLoader color='gray'/>
              </div>
            </td>
          </tr>}
        </tbody>
      </table>
    </div>
  )
}
