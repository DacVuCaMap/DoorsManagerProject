import GetPattern from '@/ApiPattern/GetPattern'
import PostPattern from '@/ApiPattern/PostPattern'
import DoorNameSelect from '@/Model/DoorNameSelect'
import { Check, PackageOpen, Settings, Trash2, TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { BarLoader, ScaleLoader } from 'react-spinners'

type Props = {
  setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  data: DoorNameSelect[],
  setReFreshData:React.Dispatch<React.SetStateAction<number>>,
  reFreshData:number
}

export default function DoorSelectNameComponent(props: Props) {
  const [curSelect, setCurSelect] = useState<DoorNameSelect>(new DoorNameSelect("", "", [], [], [], ""));
  const [liveList, setLiveList] = useState<DoorNameSelect[]>([]);
  const [loading, setLoading] = useState(0);
  const [success, setSuccess] = useState(false);
  const [selectExist, setSelectExist] = useState(false);
  const handleChangeInputName = (e: any) => {
    const value = e.target.value;
    console.log(props.data)
    console.log(value)
    //live search
    setLiveList(props.data.filter(item => item.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())))
    let temp: DoorNameSelect | undefined = props.data.find(item => item.name === value)
    if (temp) {
      setCurSelect(temp);
      setSelectExist(true);
    }
    else {
      setSelectExist(false);
      setCurSelect({ ...curSelect, name: value });
    }
  }
  const handleChangeChild = (e: any, key: string, index: number, items: string[]) => {

    let value = e.target.value;

    const updated = [...items];
    updated[index] = value;
    setCurSelect({ ...curSelect, [key]: updated })

  }
  const AddNewItem = (key: string, items: string[]) => {
    let updated = [...items];
    updated.push("")
    setCurSelect({ ...curSelect, [key]: updated });
  }
  const handleDelChild = (key: string, index: number, items: string[]) => {
    let updated = [...items];
    updated = updated.filter((item: string, ind) => ind != index);
    setCurSelect({ ...curSelect, [key]: updated })
  }
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (curSelect.numberDoor.length < 1 || curSelect.type.length < 1 || curSelect.code.length < 1) {
      return;
    }
    let numberDoor: string = curSelect.numberDoor.join('./');
    let type: string = curSelect.type.join('./');
    let code: string = curSelect.code.join('./');
    const dataPost = { id: curSelect.id, name: curSelect.name, numberDoor: numberDoor, type: type, code: code, material: curSelect.material };
    console.log(dataPost);
    let url = process.env.NEXT_PUBLIC_API_URL + "/api/others/add-door-name-select";
    setLoading(1);
    const response = await PostPattern(url, dataPost, {});
    console.log(response);
    console.log(url);
    setLoading(0);
    if (response && response.value) {
      setSuccess(true)
    }
    setTimeout(() => {
      setSuccess(false);
    }, 5000); // 5000 milliseconds = 5 seconds

  }
  const handleClickOut = (e: any) => {
    e.stopPropagation()
    setLiveList([])
  }
  const handleSelectFromLive = (item: DoorNameSelect) => {
    setCurSelect(item);
    setSelectExist(true);
  }
  const handleDelete = async () => {
    setLoading(2)
    let url = process.env.NEXT_PUBLIC_API_URL + "/api/others/delete-door-name-select?id="+curSelect.id;
    const response = await GetPattern(url,{});
    setCurSelect(new DoorNameSelect("", "", [], [], [], ""));
    setSelectExist(false);
    setLoading(0)
    props.setReFreshData(props.reFreshData+1);
  }
  return (
    <div onClick={e => props.setOpen(false)} className='w-screen h-screen fixed bg-black bg-opacity-70 top-0 left-0 z-50 flex items-center justify-center'>
      <form action="" onSubmit={handleSubmit}>
        <div onClick={e => handleClickOut(e)} className='bg-gray-900 px-8 py-6 rounded-xl flex flex-col space-y-4 items-center'>
          <div className='text-gray-400 text-left text-lg w-full flex flex-row space-x-2'><Settings /> <span> Thiết lập qui cách cửa</span></div>
          <div className='flex flex-col text-white w-1/2'>
            <span className='text-xs text-gray-400'>Tên cánh cửa</span>
            <div className='relative w-full'>
              <input required value={curSelect.name} placeholder='Nhập tên cánh cửa mới hoặc đã tạo' onChange={e => handleChangeInputName(e)} type="text" className='py-2 px-2 border bg-gray-600 border-gray-500 outline-none rounded w-full' />
              {liveList.length > 0 &&
                <div className='absolute bg-gray-800 shadow-2xl h-64 w-full top-10'>
                  {liveList.map((item: DoorNameSelect, index) => (
                    <div onClick={e => handleSelectFromLive(item)} className='px-2 py-2 text-center hover:bg-gray-500 hover:cursor-pointer' key={index}>
                      <h2>{item.name}</h2>
                    </div>
                  ))}
                </div>
              }
              {(selectExist && loading != 2) && <button onClick={e => handleDelete()} className='bg-red-600 hover:shadow-lg transition ease-in duration-300 hover:shadow-red-500 px-4 py-2 absolute right-0 top-0 h-full rounded-r flex items-center'>
                <span className='mr-2'>Xóa</span>
                <TriangleAlert />
              </button>}
              {loading === 2 && <button className='bg-red-600 hover:shadow-lg transition ease-in duration-300 hover:shadow-red-500 px-4 py-2 absolute right-0 top-0 h-full rounded-r flex items-center'>
                <ScaleLoader height={14} color='white' />
              </button>}

            </div>
          </div>

          <div className='flex flex-row space-x-4'>
            <div className='flex flex-col'>
              <span className='text-xs text-gray-400'>Loại cửa</span>
              <div className="rounded-lg min-w-64 bg-gray-700 h-72 overflow-auto text-white">
                {curSelect.type.map((item: string, index) => (
                  <div key={index}>
                    <div className='flex flex-row hover:bg-gray-600 items-center border-b border-gray-500 text-gray-200 '>
                      <span className='text-gray-300 px-2 text-xs'>{index + 1}</span>
                      <input placeholder='Nhập loại cửa' required value={item} onChange={e => handleChangeChild(e, "type", index, curSelect.type)} type="text" className='bg-transparent focus:outline-none flex-1 py-4 px-2' />
                      <button onClick={e => handleDelChild("type", index, curSelect.type)} type='button' className='px-1'><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
                <button type='button' onClick={e => AddNewItem("type", curSelect.type)} className='inline-block w-full hover:bg-blue-600 font-bold py-1 px-2 rounded-lg"'>
                  + Thêm
                </button>
                {curSelect.type.length < 1 && <div className='flex-1 flex flex-col py-20 justify-center items-center text-gray-400'>
                  <PackageOpen size={60} />
                  <span>Chưa có dữ liệu</span>
                </div>}
              </div>
            </div>

            <div className='flex flex-col'>
              <span className='text-xs text-gray-400'>Loại cánh</span>
              <div className="rounded-lg min-w-64 bg-gray-700 h-72 overflow-auto text-white">
                {curSelect.numberDoor.map((item: string, index) => (
                  <div key={index}>
                    <div className='flex flex-row hover:bg-gray-600 items-center border-b border-gray-500 text-gray-200 '>
                      <span className='text-gray-300 px-2 text-xs'>{index + 1}</span>
                      <input placeholder='Nhập loại cánh' required value={item} onChange={e => handleChangeChild(e, "numberDoor", index, curSelect.numberDoor)} type="text" className='bg-transparent focus:outline-none flex-1 py-4 px-2' />
                      <button onClick={e => handleDelChild("numberDoor", index, curSelect.numberDoor)} type='button' className='px-1'><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
                <button type='button' onClick={e => AddNewItem("numberDoor", curSelect.numberDoor)} className='inline-block w-full hover:bg-blue-600 font-bold py-1 px-2 rounded-lg"'>
                  + Thêm
                </button>
                {curSelect.numberDoor.length < 1 && <div className='flex-1 flex flex-col py-20 justify-center items-center text-gray-400'>
                  <PackageOpen size={60} />
                  <span>Chưa có dữ liệu</span>
                </div>}
              </div>
            </div>

            <div className='flex flex-col'>
              <span className='text-xs text-gray-400'>Mã</span>
              <div className="rounded-lg min-w-64 bg-gray-700 h-72 overflow-auto text-white">
                {curSelect.code.map((item: string, index) => (
                  <div key={index}>
                    <div className='flex flex-row hover:bg-gray-600 items-center border-b border-gray-500 text-gray-200 '>
                      <span className='text-gray-300 px-2 text-xs'>{index + 1}</span>
                      <input placeholder='Nhập mã' required value={item} onChange={e => handleChangeChild(e, "code", index, curSelect.code)} type="text" className=' bg-transparent focus:outline-none text-center flex-1 py-4 px-2' />
                      <button onClick={e => handleDelChild("code", index, curSelect.code)} type='button' className='px-1'><Trash2 size={20} /></button>
                    </div>
                  </div>
                ))}
                <button type='button' onClick={e => AddNewItem("code", curSelect.code)} className='inline-block w-full hover:bg-blue-600 font-bold py-1 px-2 rounded-lg"'>
                  + Thêm
                </button>
                {curSelect.code.length < 1 && <div className='flex-1 flex flex-col py-20 justify-center items-center text-gray-400'>
                  <PackageOpen size={60} />
                  <span>Chưa có dữ liệu</span>
                </div>}
              </div>
            </div>

          </div>

          <div className='w-full flex flex-col'>
            <span className='text-xs text-gray-400'>Tên vật liệu bên trong</span>
            <input value={curSelect.material} onChange={e => setCurSelect({ ...curSelect, material: e.target.value })} required placeholder='Nhập vật liệu bên trong' type="text" className='py-1 px-2 border bg-gray-700 border-gray-500 outline-none rounded w-1/3 text-white' />
          </div>

          {(loading!=1 && !success) && <button className='px-8 py-2 font-semibold bg-blue-600 text-white rounded-xl w-full hover:bg-blue-900'>Lưu</button>}
          {(loading === 1 && !success) && <button type='button' className='px-8 py-4 bg-blue-600 text-white rounded-xl w-full flex items-center justify-center '>
            <BarLoader width={500} />
          </button>}
          {success && <div className='flex flex-col justify-center items-center'><Check size={40} className=' p-2 bg-green-400 rounded-full text-white' /> <span className='text-gray-500 font-semibold'>success</span></div>}


        </div>
      </form>
    </div>
  )
}
