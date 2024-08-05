import GetPattern from '@/ApiPattern/GetPattern';
import { Trash2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { ScaleLoader } from 'react-spinners';

type Props = {
  selectCommand:(command:string) => void,
  refreshTrigger:number
  setRefreshTrigger: (trigger: number) => void;
}
export default function ListNhomPhuKien(props:Props) {
  const [list, setList] = useState<string[]>();
  const [loading,setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/get-list-group";
      try {
        setLoading(true)
        const response = await GetPattern(url, {});
        console.log(response);
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
    // let url = process.env.NEXT_PUBLIC_API_URL + "/api/product-command/delByCommand?command="+command;
    // const response = await GetPattern(url,{});
    // props.setRefreshTrigger(props.refreshTrigger + 1 );
  }
  const handleClickItem = (item:any) =>{
    props.selectCommand(item.name);
  }
  return (
    <div className='overflow-auto h-[500px]'>
      <table className='w-full'>
        <thead>
          <tr>
            <th className='sticky top-0 bg-blue-700 text-white z-10'></th>
            <th className='sticky top-0 bg-blue-700 text-white z-10 py-2'>Tên nhóm cửa</th>
            <th className='sticky top-0 bg-blue-700 text-white z-10'></th>
          </tr>
        </thead>
        <tbody>
          {list?.map((item: any, index) => (
            <tr key={index} className={`${index % 2 != 0 ? "bg-gray-200" : "bg-white"} text-gray-700 hover:shadow-xl hover:bg-gray-800 hover:text-white`}>
              <td className='text-center'>{index + 1}</td>
              <td className=' text-center'>
                <div className='hover:cursor-pointer py-4 px-2 h-full w-full' onClick={e=>handleClickItem(item)}>
                  {item.name}
                </div>
              </td>
              <td className='text-center text-red-600'><button ><Trash2 /></button></td>
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
