"use client"
import React, { useState } from 'react'
import "./AddBaoGia.css";
import Product from '@/Model/Product';
import DoorNameSelect from '@/Model/DoorNameSelect';
import { genNumberByTime } from '@/data/FunctionAll';
import Accessories from '@/Model/Accessories';

type Props = {
  dataName: DoorNameSelect[]
}
export default function AddBaoGia(props: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const dataSelect: DoorNameSelect[] = props.dataName;
  const handleAddDoor = () => {
    let description = `- Vật liêu chính: Thép mạ kẽm khung chế tạo 56x112 mm
+ Chiều dày cánh 50 mm
+ Thép mạ kẽm làm cánh dày 0.8 mm
+ Thép mạ kẽm làm khung dày 1.4 mm
- Vật liệu bên trong: 
- Gioăng cao su chống cháy, cách âm
- Sơn tĩnh điện 1 màu 
- Kích thước báo giá là kích thước cả khung`
    let accessory = new Accessories(1, "CC0.8/1.4", description, "Novodor", 0, 0, 0, 0, 0, 0, 0);
    const newItem: Product = {
      id: genNumberByTime(),
      name: "",
      supplier: "",
      totalQuantity: 0,
      doorCode: "",
      width: 0,
      height: 0,
      accessories: [accessory],
      selectId: null
    }
    setProducts([...products, newItem]);
  }
  const handleSelectName = (e: React.ChangeEvent<HTMLSelectElement>, id: any) => {
    let val: any = e.target.value;
    let door: Product | undefined = products.find(item => item.id === id);
    if (door) {
      let description = `- Vật liêu chính: Thép mạ kẽm khung chế tạo 56x112 mm
+ Chiều dày cánh 50 mm
+ Thép mạ kẽm làm cánh dày 0.8 mm
+ Thép mạ kẽm làm khung dày 1.4 mm
- Vật liệu bên trong: ${dataSelect[val].material}
- Gioăng cao su chống cháy, cách âm
- Sơn tĩnh điện 1 màu 
- Kích thước báo giá là kích thước cả khung`
      let accessory = new Accessories(1, "CC0.8/1.4", description, "Novodor", 0, 0, door.width, door.height, 0, 0, 0);
      const updateProduct = products.map((item) => item.id === id ? { ...item, selectId: val, accessories: [accessory] } : item);
      setProducts(updateProduct);
    }
  }
  const hanleChangeDesName = (e: React.ChangeEvent<HTMLTextAreaElement>, productId: any) => {

  }
  const handleChangeProduct = (e: any, id: any, key: any) => {
    let value = e.target.value;
    if (key === "height" || key === "width") {
      let accessoriesProduct = products.find(item => item.id === id)?.accessories;
      if (accessoriesProduct) {
        let updateAccessories =  accessoriesProduct.map((item : Accessories,index)=>{
          if (index===0) {
            return {...item,[key]:value}
          }
          return item;
        })
        const updatedProduct = products.map((item: Product) => item.id === id ? { ...item, [key]: value,accessories:updateAccessories } : item);
        setProducts(updatedProduct);
      }
    }
    else {
      const updatedProduct = products.map((item: Product) => item.id === id ? { ...item, [key]: value } : item);
      setProducts(updatedProduct);
    }

  }
  return (
    <div className='px-32 py-5'>
      <div className='bg-white p-10 shadow-2xl rounded-lg'>
        <form action="">
          <table className='w-full table-auto text-sm'>
            <thead className='bg-green-300 border-b-2 border-black'>
              <tr>
                <th rowSpan={2}>STT</th>
                <th rowSpan={2} className='min-w-[400px]'>Quy cách nhà cung cấp đề xuất</th>
                <th className='' colSpan={2}>Kích thước</th>
                <th className='' rowSpan={2}>Mã</th>
                <th rowSpan={2}>Tổng KL</th>
                <th rowSpan={2}>Đơn giá</th>
              </tr>
              <tr>
                <th>Rộng</th>
                <th>Dài</th>
              </tr>
            </thead>
            <tbody>
              {
                products.map((parentItem, index) => (
                  <React.Fragment key={index}>
                    <tr key={index} className='h-10 bg-gray-200'>
                      <td className='text-center'>{index + 1}</td>
                      <td>
                        <select defaultValue="" onChange={e => handleSelectName(e, parentItem.id)}>
                          <option value="" disabled hidden>--Chọn một tùy chọn--</option>
                          {dataSelect.map((sel, selectIndex) => (
                            <option key={selectIndex} value={sel.id}>{sel.name}</option>
                          ))}
                        </select>
                        {parentItem.selectId &&
                          <>
                            <select>
                              {dataSelect[parentItem.selectId].numberDoor.map((item, selectIndex) => (
                                <option value={selectIndex} key={selectIndex}>{item}</option>
                              ))}
                            </select>
                            <select>
                              {dataSelect[parentItem.selectId].type.map((item, selectIndex) => (
                                <option value={selectIndex} key={selectIndex}>{item}</option>
                              ))}
                            </select>
                            <select>
                              {dataSelect[parentItem.selectId].code.map((item, selectIndex) => (
                                <option value={selectIndex} key={selectIndex}>{item}</option>
                              ))}
                            </select>
                          </>
                        }
                      </td>
                      <td>
                        <input onChange={(e) => handleChangeProduct(e, parentItem.id, "width")} type="number" className='w-20 text-center h-8' />
                      </td>
                      <td>
                        <input onChange={(e) => handleChangeProduct(e, parentItem.id, "height")} type="number" className='w-20 text-center h-8' />
                      </td>
                      <td>
                        <input onChange={(e) => handleChangeProduct(e, parentItem.id, "doorCode")} type="text" className='w-20 text-center h-8' />
                      </td>
                      <td>
                        <input onChange={(e) => handleChangeProduct(e, parentItem.id, "total")} type="text" className='w-20 text-center h-8' />
                      </td>
                      <td>
                        <input onChange={(e) => handleChangeProduct(e, parentItem.id, "totalQuantity")} type="text" className='h-8 pl-2' />
                      </td>
                    </tr>
                    {parentItem.accessories.map((item, childIndex) => (
                      <tr>
                        <td className='text-center'>{index + 1},{childIndex + 1}</td>
                        <td><textarea
                          value={item.name}
                          style={{ width: '100%', minHeight: '170px', resize: 'none' }}
                          onChange={(e) => hanleChangeDesName(e, parentItem.id)}
                        /></td>
                        <td>{item.width}</td>
                        <td>{item.height}</td>
                        <td>{item.code}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              }
              <tr>
                <td colSpan={7} className='px-2 py-2 border-none'>
                  <button type='button' className="inline-block w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    onClick={handleAddDoor}>+ Thêm cửa mới</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      </div>
    </div>
  )
}
