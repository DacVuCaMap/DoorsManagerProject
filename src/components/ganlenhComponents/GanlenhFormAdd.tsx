"use client"
import { dataSelect } from '@/data/AddData';
import Accessories from '@/Model/Accessories';
import React, { useEffect, useState } from 'react'
import './GanlenhMain.css'
import BaoGiaSearchPhuKien from '../baogiaComponents/BaoGiaSearchPhuKien';
import GetPattern from '@/ApiPattern/GetPattern';
import { genNumberByTime } from '@/data/FunctionAll';
import { Trash2 } from 'lucide-react';
import { ScaleLoader } from 'react-spinners';
import PostPattern from '@/ApiPattern/PostPattern';
import DoorNameSelect from '@/Model/DoorNameSelect';
import AccessoryGroupRequest from '@/Request/AccessoryGroupRequest';

type AccessoriesAndQuantity = {
  accessories: Accessories,
  quantity: number,

}
type DefaultCommand = {
  command: string,
  acsAndQuantity: AccessoriesAndQuantity[],
  doorNameSelectId: any,
  accessoryGroupId: any,
  accessoryGroupType: string
}
type Props = {
  cmdMain: { name1: string, name2: string, name3: string };
  refreshTrigger: number
  setRefreshTrigger: (trigger: number) => void;
  selectDoorName: DoorNameSelect[]
}
export default function GanlenhFormAdd(props: Props) {
  //data select
  const [selectName, setSelectName] = useState(props.selectDoorName);
  const [curSelectName, setCurSelectName] = useState<DoorNameSelect>(new DoorNameSelect("", "", [], [], [], ""));
  useEffect(() => {
    setSelectName(props.selectDoorName);
  }, [props.selectDoorName])
  const [curCmd, setCurCmd] = useState<DefaultCommand>({ command: "", acsAndQuantity: [], doorNameSelectId: "", accessoryGroupId: "", accessoryGroupType: "" });
  const [command, setCommand] = useState<{ name1: string, name2: string, name3: string }>({ name1: "", name2: "", name3: "" });
  const [acsData, setAcsData] = useState<Accessories[]>([]);
  const [loading, setLoading] = useState(0);
  const [isSuccess, setSuccess] = useState("");
  const [mainAcs, setMainAcs] = useState([]);
  let tempAcs = new Accessories(genNumberByTime(), "", "", "", 0, 0, 0, 0, 0, 0, 0, "Bộ", false);
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (curCmd.command === "" || curCmd.acsAndQuantity.length < 0 || curCmd.doorNameSelectId === "" || curCmd.accessoryGroupId === "") {
      //error
      // console.log("error")
      // console.log(curCmd)
      return;
    }
    let listAcsId: number[] = [];
    let quantityList: number[] = [];
    for (let i = 0; i < curCmd.acsAndQuantity.length; i++) {
      listAcsId.push(curCmd.acsAndQuantity[i].accessories.id);
      quantityList.push(curCmd.acsAndQuantity[i].quantity);
    }
    const dataPost = { command: curCmd.command, listAcsId: listAcsId, quantityList: quantityList, doorNameSelectId: curCmd.doorNameSelectId, accessoryGroupId: curCmd.accessoryGroupId };
    console.log(dataPost)
    try {
      let url = process.env.NEXT_PUBLIC_API_URL + "/api/product-command/add"
      const response = await PostPattern(url, dataPost, {});
      if (response && response.success) {
        console.log(response.message);
        props.setRefreshTrigger(props.refreshTrigger + 1);
        return;
      }
    } catch (error) {
      console.log(error);
      return;
    }

  }
  const handleSelect = (e: any, key: string) => {
    let val = e.target.value;
    if (key === "main") {
      val = parseFloat(val)
      let temp: any = mainAcs.find((item: any) => item.id === val);
      setCurCmd({ ...curCmd, accessoryGroupId: temp.id, accessoryGroupType: temp.type });
      return;
    }
    setCommand({ ...command, [key]: val });
    if (key === "name1") {
      let temp: DoorNameSelect = selectName.find((item: DoorNameSelect) => item.name === val) ?? curSelectName;
      setCurSelectName(temp)
      console.log(temp.id)
      setCurCmd({ ...curCmd, doorNameSelectId: temp.id })
    }

  }
  useEffect(() => {
    setCommand(props.cmdMain)
    setCurCmd({ ...curCmd, command: props.cmdMain.name1 + props.cmdMain.name2 + props.cmdMain.name3 })
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

  //cap nhap data accessories có sẵn
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/list?page=0&size=100&search";
        const response = await GetPattern(url, {});
        if (response.content && Array.isArray(response.content)) {
          const list: any[] = response.content;
          let newAcs: Accessories[] = list.map((item: any, index: number) => {
            return new Accessories(
              item.id,
              item.code,
              item.name,
              item.supplier,
              0,
              0,
              0,
              0,
              item.orgPrice,
              item.lowestPricePercent,
              0,
              item.unit,
              true
            );
          });
          // Kiểm tra kết quả
          setAcsData(newAcs);
          // add main list
        }
      } catch (error) {
        console.log(error)
      }
    }
    fetchData();
    // Thiết lập interval
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    // Trả về hàm clean up
    return () => {
      clearInterval(intervalId);
    };
  }, [])

  // search to loading by command , update command 
  useEffect(() => {
    let cmd = command.name1 + "-" + command.name2 + "-" + command.name3;
    if (command.name1 != "" && command.name2 != "" && command.name3 != "") {
      const fecthData = async () => {
        let url = process.env.NEXT_PUBLIC_API_URL + `/api/product-command/get-command?command=${cmd}`;
        try {
          setLoading(1)
          const response = await GetPattern(url, {});
          setLoading(0);
          console.log(response)
          let newArr: AccessoriesAndQuantity[] = response.value.map((item: any, index: number) => {
            return {
              accessories: new Accessories(
                item.accessories.id,
                item.accessories.code,
                item.accessories.name,
                item.accessories.supplier,
                0,
                0,
                0,
                0,
                item.accessories.orgPrice,
                item.accessories.lowestPricePercent,
                0,
                item.accessories.unit,
                false
              ), quantity: item.quantity
            };
          });
          setCurCmd({
            command: cmd, acsAndQuantity: newArr
            , accessoryGroupId: response.value[0].accessoryGroupId
            , accessoryGroupType: response.value[0].accessoryGroupType
            , doorNameSelectId: response.value[0].doorNameSelectId
          })
        } catch (error) {
          return;
        }
      }
      fecthData();
    }
  }, [command])
  const selectAccessories = (acsId: any, newAcs: Accessories, productId: any) => {
    const accessoriesAndQuantity = curCmd.acsAndQuantity;
    let quan = newAcs.name.includes("Doorsill") ? -1 : 1;
    const newItem: AccessoriesAndQuantity = { accessories: newAcs, quantity: quan };
    accessoriesAndQuantity.push(newItem);
    setCurCmd({ ...curCmd, acsAndQuantity: accessoriesAndQuantity });
  }
  const handleChangeQuantity = (e: any, index: number) => {
    let val = e.target.value;
    let updatedAcsAndQuan = curCmd.acsAndQuantity;
    if (val >= 0) {
      val = parseInt(val);
      updatedAcsAndQuan = updatedAcsAndQuan.map((item: AccessoriesAndQuantity, ind) => {
        if (index === ind) {
          return { accessories: item.accessories, quantity: val };
        }
        return item;
      })
      setCurCmd({ ...curCmd, acsAndQuantity: updatedAcsAndQuan });
    }
  }
  const handleDel = (index: number) => {
    let updatedAcsAndQuan = curCmd.acsAndQuantity.filter((item: AccessoriesAndQuantity, ind) => ind != index);
    setCurCmd({ ...curCmd, acsAndQuantity: updatedAcsAndQuan });
  }
  useEffect(() => {
    console.log(curCmd)
  }, [curCmd])
  return (
    <div className='w-full h-full ganlenh relative'>
      <h2 className='font-bold text-lg mb-2'>Form gán mặc định</h2>
      <form action="" onSubmit={handleSubmit}>
        <label htmlFor="" className='text-sm text-gray-400'>Tên qui cách</label>
        <div className='flex flex-row space-x-2 bg-white pt-4 pb-2 mb-4 border-b border-gray-400'>

          {selectName.length != 0 ? <select name="" id="" value={command.name1} onChange={e => handleSelect(e, "name1")}>
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
            <select name="" id="" value={command.name2} onChange={e => handleSelect(e, "name2")}>
              <option value="" disabled hidden>--Chọn loại--</option>
              {curSelectName.type.map((item: any, index) => (
                <option key={index} value={item}>{item}</option>
              ))}
            </select>

          }
          {curSelectName.name != "" &&
            <select name="" id="" onChange={e => handleSelect(e, "name3")} value={command.name3}>
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
            <select onChange={e => handleSelect(e, "main")} value={curCmd.accessoryGroupId} name="" id="" className='text-sm text-gray-600 border border-black rounded p-2'>
              <option value="" disabled hidden>--Chọn nhóm--</option>
              {mainAcs.map((item: any, index) => (<option value={item.id} key={index}>{item.name}</option>))}
            </select>}
        </div>
        <div className='flex flex-col mb-2'>
          <BaoGiaSearchPhuKien acsData={acsData} acs={tempAcs} productId={0} selectAccessories={selectAccessories} />
        </div>


        {curCmd.acsAndQuantity.length > 0 &&
          <div className="w-full max-w-md p-2 bg-white border border-gray-200 rounded-lg shadow">
            <div className="flow-root">
              <ul role="list" className="divide-y divide-gray-200">
                <li className="py-3">
                  <div className="flex items-center">
                    <div className="flex-1 min-w-0 ms-4">
                      <p className="text-base font-semibold text-gray-900 truncate">Thông tin</p>
                    </div>
                    <div className="inline-flex items-center w-20 text-base font-semibold text-gray-900">Số bộ</div>
                  </div>
                </li>
                {curCmd.acsAndQuantity.map((item: AccessoriesAndQuantity, index) => (
                  <li key={index} className="py-3 sm:py-4 relative group">
                    <div className="flex items-center">
                      <div className="flex-1 min-w-0 ms-4">
                        <p className="text-sm truncate font-bold">{item.accessories.code}</p>
                        <p className="text-xs text-gray-600 truncate pr-2">{item.accessories.name}</p>
                      </div>
                      <div className="w-20 items-center text-base font-semibold text-gray-900 flex flex-row space-x-2">
                        {item.accessories.name.includes("Doorsill") ?
                          <div className='w-20'>
                            Width
                          </div>
                          :
                          <input
                            type="number"
                            required
                            value={item.quantity}
                            onChange={e => handleChangeQuantity(e, index)}
                            className="border-gray-400 border rounded w-12 text-center"
                          />}
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
        {curCmd.acsAndQuantity.length > 0 ? <button className='bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded w-full my-2'>Lưu</button>
          : <div className='h-14'></div>}
      </form>
      {command.name1 == "" && command.name2 == "" ?
        <div className='bg-white absolute h-40 w-full top-32 justify-center flex items-center'>
          <h2 className='text-gray-600 font-bold text-lg' >Chọn tên qui cách</h2>
        </div>
        : ""
      }
    </div>
  )
}
