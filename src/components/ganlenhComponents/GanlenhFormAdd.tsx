"use client"
import { dataSelect } from '@/data/AddData';
import Accessories from '@/Model/Accessories';
import React, { useEffect, useState } from 'react'
import './GanlenhMain.css'
import BaoGiaSearchPhuKien from '../baogiaComponents/BaoGiaSearchPhuKien';
import GetPattern from '@/ApiPattern/GetPattern';
import { genNumberByTime } from '@/data/FunctionAll';
import { Check, SquareTerminal, Trash2 } from 'lucide-react';
import { BarLoader, ScaleLoader } from 'react-spinners';
import PostPattern from '@/ApiPattern/PostPattern';
import DoorNameSelect from '@/Model/DoorNameSelect';
import AccessoryGroupRequest from '@/Request/AccessoryGroupRequest';
import InputSearchAccessoryGroup from '../SearchingComponents/InputSearchAccessoryGroup';
import GroupAccessory from '@/Model/GroupAccessory';

type GroupAccessoriesAndQuantity = {
  groupAcs: GroupAccessory,
  quantity: number,

}
type DefaultCommand = {
  command: string,
  groupAcsAndQuan: GroupAccessoriesAndQuantity[],
  doorNameSelectId: any,
  accessoryGroupId: any,
}
type Props = {
  cmdMain: { name1: string, name2: string, name3: string };
  refreshTrigger: number
  setRefreshTrigger: (trigger: number) => void;
  selectDoorName: DoorNameSelect[],
  acsGroupData: GroupAccessory[]
}
export default function GanlenhFormAdd(props: Props) {
  //data select
  const [selectName, setSelectName] = useState(props.selectDoorName);
  const [curSelectName, setCurSelectName] = useState<DoorNameSelect>(new DoorNameSelect("", "", [], [], [], ""));
  useEffect(() => {
    setSelectName(props.selectDoorName);
  }, [props.selectDoorName])
  const newDefaultCommand : DefaultCommand = { command: "", groupAcsAndQuan: [], doorNameSelectId: "", accessoryGroupId: "" }
  const [curCmd, setCurCmd] = useState<DefaultCommand>(newDefaultCommand);
  const [command, setCommand] = useState<{ name1: string, name2: string, name3: string }>({ name1: "", name2: "", name3: "" });
  const [loading, setLoading] = useState(0);
  const [isSuccess, setSuccess] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(0);
  const [mainAcs, setMainAcs] = useState([]);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    let listGroupAcsId: number[] = [];
    let quantityList: number[] = [];
    for (let i = 0; i < curCmd.groupAcsAndQuan.length; i++) {
      listGroupAcsId.push(curCmd.groupAcsAndQuan[i].groupAcs.id);
      quantityList.push(curCmd.groupAcsAndQuan[i].quantity);
    }
    let cmd = command.name1 + "-" + command.name2 + "-" + command.name3;
    const dataPost = { command: cmd, listGroupAcsId: listGroupAcsId, quantityList: quantityList, doorNameSelectId: curCmd.doorNameSelectId, mainAccessoryGroupId: curCmd.accessoryGroupId };
    // console.log(dataPost)
    // console.log(command);
    setLoadingSubmit(true);
    let url = process.env.NEXT_PUBLIC_API_URL + "/api/product-command/add"
    const response = await PostPattern(url, dataPost, {});
    setLoadingSubmit(false);
    setSuccess(true)
    setTimeout(() => { setSuccess(false) }, 3000)
    if (response && response.success) {
      props.setRefreshTrigger(props.refreshTrigger + 1);
      return;
    }

  }
  const handleSelect = (e: any, key: string) => {
    let val = e.target.value;
    if (key === "main") {
      val = parseFloat(val)
      let temp: any = mainAcs.find((item: any) => item.id === val);
      setCurCmd({ ...curCmd, accessoryGroupId: temp.id });
      return;
    }
    setCommand({ ...command, [key]: val });
    if (key === "name1") {
      let temp: DoorNameSelect = selectName.find((item: DoorNameSelect) => item.name === val) ?? curSelectName;
      setCurSelectName(temp)
      setCurCmd({ ...curCmd, doorNameSelectId: temp.id })
    }

  }
  useEffect(() => {
    setCommand(props.cmdMain)
    setCurCmd({ ...newDefaultCommand, command: props.cmdMain.name1 + props.cmdMain.name2 + props.cmdMain.name3 })
    // curselect
    let temp: DoorNameSelect = selectName.find((item: DoorNameSelect) => item.name === props.cmdMain.name1) ?? curSelectName;
    setCurSelectName(temp)
  }, [props.cmdMain])

  useEffect(() => {
    const fetchData = async () => {
      let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/get-list-group?type=main";
      try {
        const response = await GetPattern(url, {});
        if (response && response.value && Array.isArray(response.value)) {
          setMainAcs(response.value);
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
  }, [])

  // search to loading by command , update command 
  useEffect(() => {
    let cmd = command.name1 + "-" + command.name2 + "-" + command.name3;
    // console.log(cmd)
    if (command.name1 != "" && command.name2 != "" && command.name3 != "") {
      const fetchData = async () => {
        setLoading(1)
        let url = process.env.NEXT_PUBLIC_API_URL + "/api/product-command/get-command?command=" + cmd
        const response = await GetPattern(url, {});
        setLoading(0);
        // console.log(response)
        if (response && response.value && Array.isArray(response.value) && response.value.length > 0) {
          let newArr: GroupAccessoriesAndQuantity[] = response.value.map((item: any, index: number) => {

            return { groupAcs: {id:item.id,name:item.accessoryGroup.name,accesoriesAndType:[],type:item.accessoryGroup.type}
            , quantity: item.quantity };
          });
          setCurCmd({
            command: cmd, groupAcsAndQuan: newArr
            , accessoryGroupId: response.value[0].accessoryGroupId
            , doorNameSelectId: response.value[0].doorNameSelectId
          })
        }else{
          setCurCmd({ ...curCmd, command: cmd,  groupAcsAndQuan:[],accessoryGroupId:""  })
        }
      }
      fetchData()
    }
    else {
      setCurCmd({ ...curCmd, command: cmd  })
    }
  }, [command])
  const handleChangeQuantity = (e: any, index: number) => {
    let val = e.target.value;
    let updatedAcsAndQuan = curCmd.groupAcsAndQuan;
    if (val >= 0) {
      val = parseInt(val);
      updatedAcsAndQuan = updatedAcsAndQuan.map((item: GroupAccessoriesAndQuantity, ind) => {
        if (index === ind) {
          return { groupAcs: item.groupAcs, quantity: val };
        }
        return item;
      })
      setCurCmd({ ...curCmd, groupAcsAndQuan: updatedAcsAndQuan });
    }
  }
  const handleDel = (index: number) => {
    let updatedAcsAndQuan = curCmd.groupAcsAndQuan.filter((item: GroupAccessoriesAndQuantity, ind) => ind != index);
    setCurCmd({ ...curCmd, groupAcsAndQuan: updatedAcsAndQuan });
  }
  const handleSetAcsGroup = (acsGroup: GroupAccessory, index: number) => {
    let flag = curCmd.groupAcsAndQuan.find(item => item.groupAcs.id === acsGroup.id);
    if (!flag) {
      setError(0);
      let quan = acsGroup.type != "normal" ? -1 : 1;
      let temp: GroupAccessoriesAndQuantity[] = [...curCmd.groupAcsAndQuan, { groupAcs: acsGroup, quantity: quan }];
      setCurCmd({ ...curCmd, groupAcsAndQuan: temp });
    }
    else { setError(1) }
  }
  const handleKeyDown = (event:any) => {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  };
  return (
    <div className='w-full h-full ganlenh relative'>
      <div className='flex flex-row text-gray-300 space-x-2'>
        <SquareTerminal />
        <h2 className='font-bold text-lg mb-2'>Form nhập mẫu cửa</h2>
      </div>
      <form action="" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
        <label htmlFor="" className='text-sm text-gray-400'>Tên qui cách</label>
        <div className='flex flex-row space-x-2 bg-gray-800 pt-4 pb-2 mb-4 border-b border-gray-400'>

          {selectName.length != 0 ? <select required name="" id="" value={command.name1} onChange={e => handleSelect(e, "name1")}>
            <option value="" disabled hidden>--Chọn loại--</option>
            {selectName.map((item: any, index) => (
              <option key={index} value={item.name}>{item.name}</option>
            ))}
          </select>
            :
            <div className='py-2 w-full text-center'>
              <ScaleLoader height={20} color='gray' />
            </div>
          }

          {curSelectName.name != "" &&
            <select required name="" id="" value={command.name2} onChange={e => handleSelect(e, "name2")}>
              <option value="" disabled hidden>--Chọn loại--</option>
              {curSelectName.type.map((item: any, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </select>

          }
          {curSelectName.name != "" &&
            <select required name="" id="" onChange={e => handleSelect(e, "name3")} value={command.name3}>
              <option value="" disabled hidden>--Chọn cánh--</option>
              {curSelectName.numberDoor.map((item: any, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </select>
          }
        </div>
        <div className='flex flex-col mb-2'>
          <span className='text-xs text-gray-400'>
            Nhóm phụ kiện chính
          </span>
          {loading > 0 ? <div className='w-full text-center'>
            <ScaleLoader color='gray' />
          </div>
            :
            <select required onChange={e => handleSelect(e, "main")} value={curCmd.accessoryGroupId} name="" id="" className='text-sm text-gray-600 rounded p-2'>
              <option value="" disabled hidden>--Chọn nhóm--</option>
              {mainAcs.map((item: any, index) => (<option value={item.id} key={index}>
                {item.name}
              </option>))}
            </select>}
        </div>
        <div className='flex flex-col mb-2'>
          <span className='text-gray-400 text-xs'>Nhóm phụ kiện thường</span>
          <InputSearchAccessoryGroup condition='normal doorsill' accessoryGroupData={props.acsGroupData} handleSetAcsGroup={handleSetAcsGroup} index={0} />
          {error === 1 && <span className='text-red-500'>Đã tồn tại</span>}
        </div>


        {curCmd.groupAcsAndQuan.length > 0 &&
          <div className="w-full p-2 bg-gray-600 rounded-lg shadow">
            <div className="flow-root">
              <ul role="list" className="divide-y divide-gray-200">
                <li className="py-3">
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-base font-semibold text-black truncate">Thông tin</p>
                    </div>
                    <div className="inline-flex items-center w-20 text-base font-semibold text-black">Số bộ</div>
                  </div>
                </li>
                {curCmd.groupAcsAndQuan.map((item: GroupAccessoriesAndQuantity, index) => (
                  <li key={index} className="py-3 sm:py-4 relative group">
                    <div className="flex items-center">
                      <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm truncate font-bold text-gray-300">{item.groupAcs.name}</p>
                        <p className="text-xs truncate font-bold text-gray-400">{item.groupAcs.type}</p>
                      </div>
                      <div className="w-20 items-center text-base font-semibold text-gray-900 flex flex-row space-x-2">
                        <div className='w-16 flex justify-center'>
                          {item.quantity != -1 ?
                            <input
                              type="number"
                              required
                              value={item.quantity}
                              onChange={e => handleChangeQuantity(e, index)}
                              className="bg-gray-400 border rounded w-12 text-center"
                            />
                            :
                            "Khác"
                          }
                        </div>
                        <button type='button' className='text-red-600' onClick={e => handleDel(index)}><Trash2 /></button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        }
        {loading > 0 && <div className='w-full text-center py-20'>
          <ScaleLoader color='gray' />
        </div>}
        {(curCmd.groupAcsAndQuan.length > 0 && !isSuccess) ? <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full my-2'>{loadingSubmit ? <BarLoader className='w-full' /> : "Lưu"}</button>
          : <div className='h-14'></div>}
        {isSuccess && <div className='flex flex-col justify-center items-center'><Check size={40} className=' p-2 bg-green-400 rounded-full text-white' /> <span className='text-gray-500 font-semibold'>success</span></div>}
      </form>
      {command.name1 == "" && command.name2 == "" ?
        <div className='bg-gray-800 absolute h-40 w-full top-32 justify-center flex items-center'>
          <h2 className='text-gray-400 font-bold text-lg' >Chọn tên qui cách</h2>
        </div>
        : ""
      }
    </div>
  )
}
