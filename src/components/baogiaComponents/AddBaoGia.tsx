"use client"
import React, { useEffect, useState } from 'react'
import "./AddBaoGia.css";
import Product from '@/Model/Product';
import DoorNameSelect from '@/Model/DoorNameSelect';
import { genNumberByTime } from '@/data/FunctionAll';
import Accessories from '@/Model/Accessories';
import { dataAcs, info1Select, info2Select } from '@/data/AddData';
import GetPattern from '@/ApiPattern/GetPattern';

type Props = {
  dataName: DoorNameSelect[]
}
export default function AddBaoGia(props: Props) {
  // nhap
  const acsSelect: any[] = dataAcs;
  // end nhap
  const [products, setProducts] = useState<Product[]>([]);
  const dataSelect: DoorNameSelect[] = props.dataName;
  const if1Select: number[] = info1Select;
  const if2Select: string[] = info2Select;
  const handleAddDoor = () => {
    let description = `- Vật liêu chính: Thép mạ kẽm khung chế tạo 56x112 mm
+ Chiều dày cánh 50 mm
+ Thép mạ kẽm làm cánh dày 0.8 mm
+ Thép mạ kẽm làm khung dày 1.4 mm
- Vật liệu bên trong: 
- Gioăng cao su chống cháy, cách âm
- Sơn tĩnh điện 1 màu 
- Kích thước báo giá là kích thước cả khung`
    let accessory = new Accessories(1, "CC0.8/1.4", description, "Novodor", 0, 0, 0, 0, 0, 0, 0, "Bộ", false);
    const newItem: Product = {
      id: genNumberByTime(),
      name: "",
      supplier: "",
      totalQuantity: 0,
      doorCode: "",
      width: 0,
      height: 0,
      accessories: [accessory],
      selectId: null,
      info1: 0.8,
      info2: "Sơn tĩnh điện 1 màu",
      name1: '',
      name2: '',
      name3: '',
      name4: ''
    }
    setProducts([...products, newItem]);
  }
  const handleSelectName = (e: React.ChangeEvent<HTMLSelectElement>, id: any) => {
    let val: any = e.target.value;
    console.log(val)
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
      let newAccessory = new Accessories(1, "CC0.8/1.4", description, "Novodor", 0, 0, door.width, door.height, 0, 0, 0, "Bộ", false);
      const updatedProducts = products.map((item) => {
        if (item.id === id) {
          let updatedAccessories = [newAccessory, ...item.accessories.slice(1)];
          return { ...item, selectId: val, accessories: updatedAccessories, name1: dataSelect[val].name };
        }
        return item;
      });
      setProducts(updatedProducts);
      console.log(dataSelect[val].name)
    }
  }

  const handleChangeDesName = (e: React.ChangeEvent<HTMLTextAreaElement>, productId: any) => {

  }
  const handleChangeProduct = (e: any, id: any, key: any) => {
    let value = e.target.value;
    if (key === "height" || key === "width") {
      let accessoriesProduct = products.find(item => item.id === id)?.accessories;
      if (accessoriesProduct) {
        let updateAccessories = accessoriesProduct.map((item: Accessories, index) => {
          if (index === 0) {
            return { ...item, [key]: value }
          }
          return item;
        })
        const updatedProduct = products.map((item: Product) => item.id === id ? { ...item, [key]: value, accessories: updateAccessories } : item);
        setProducts(updatedProduct);
      }
    }
    else {
      const updatedProduct = products.map((item: Product) => item.id === id ? { ...item, [key]: value } : item);
      setProducts(updatedProduct);
    }
  }
  const handleChangeProductNameInfo = async (e: any, id: any, key: any) => {
    let product = products.find(item => item.id === id)
    let value = e.target.value;
    if (product?.name2 && product?.name3) {
      // get default command
      let url = process.env.NEXT_PUBLIC_API_URL + "/api/product-command/get-command?command=" + product.name3 + product.name1;
      const response = await GetPattern(url, {});
      console.log(response);
    }
    const updatedProduct = products.map((item: Product) => item.id === id ? { ...item, [key]: value } : item);
    setProducts(updatedProduct);
  }
  const handleAddAccessory = (id: any) => {
    let newAcs = new Accessories(genNumberByTime(), "", "", "", 0, 0, 0, 0, 0, 0, 0, "Bộ", false);
    setProducts((preProducts: Product[]) => {
      return preProducts.map((product: Product) => {
        if (product.id === id) {
          const updatedAcs = [...product.accessories, newAcs];
          return { ...product, accessories: updatedAcs };
        }
        return product;
      })
    })
  }
  const selectAcsName = (e: React.ChangeEvent<HTMLSelectElement>, id: any, parentId: any) => {
    let valueAcs = e.target.value;
    let acsChange = acsSelect.find(item => item.id === valueAcs);
    setProducts((preProducts: Product[]) => {
      return preProducts.map((product: Product) => {
        if (product.id === parentId) {
          const updateAccessories = product.accessories.map((accessory: Accessories) => {
            if (accessory.id === id) {
              return { ...accessory, name: acsChange.name, code: acsChange.code, supplier: acsChange.supplier }
            }
            return accessory;
          })
          return { ...product, accessories: updateAccessories };
        }
        return product;
      })
    })

  }
  const handleDelAcs = (productId: any, acsId: any) => {
    setProducts((preProducts: Product[]) => {
      return preProducts.map((product: Product) => {
        if (product.id === productId) {
          const updateAccessories = product.accessories.filter(acs => acs.id != acsId);
          return { ...product, accessories: updateAccessories }
        }
        return product;
      })
    })
  }
  const handleDelProduct = (productId: any) => {
    let updatedProducts = products.filter(item => item.id != productId);
    setProducts(updatedProducts);
  }
  const calQuantityProduct = (parent: Product) => {
    let total = ((parent.width / 1000) * (parent.height / 1000)) * parent.totalQuantity;
    // setProducts((preProducts: Product[]) => {
    //   return preProducts.map((product: Product) => {
    //     if (product.id === parent.id) {
    //       const updateAccessories = product.accessories.map((accessory: Accessories) => {
    //         if (accessory.id === 0) {
    //           return { ...accessory, totalQuantity: total }
    //         }
    //         return accessory;
    //       })
    //       return { ...product, accessories: updateAccessories };
    //     }
    //     return product;
    //   })
    // })
    return total;
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
                <th rowSpan={2}></th>
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
                            <select defaultValue="" onChange={(e) => handleChangeProductNameInfo(e, parentItem.id, "name2")}>
                              {dataSelect[parentItem.selectId].numberDoor.map((item, selectIndex) => (
                                <option value={selectIndex} key={selectIndex}>{item}</option>
                              ))}
                            </select>
                            <select defaultValue="" onChange={(e) => handleChangeProductNameInfo(e, parentItem.id, "name3")}>
                              {dataSelect[parentItem.selectId].type.map((item, selectIndex) => (
                                <option value={selectIndex} key={selectIndex}>{item}</option>
                              ))}
                            </select>
                            <select defaultValue="" onChange={(e) => handleChangeProductNameInfo(e, parentItem.id, "name4")}>
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
                        <input onChange={(e) => handleChangeProduct(e, parentItem.id, "total")} type="text" className='w-full text-center h-8' />
                      </td>
                      <td>
                        <input onChange={(e) => handleChangeProduct(e, parentItem.id, "totalQuantity")} type="text" className='h-8 w-40' />
                      </td>
                      <td>
                        <button type='button' onClick={(e) => handleDelProduct(parentItem.id)}>Xóa</button>

                      </td>
                    </tr>
                    {parentItem.accessories[0] && (
                      <tr>
                        <td className='text-center'>{index + 1},1</td>
                        {/* <td><textarea
                          value={parentItem.accessories[0].name}
                          style={{ width: '100%', minHeight: '170px', resize: 'none' }}
                          onChange={(e) => handleChangeDesName(e, parentItem.id)}
                        /></td> */}
                        <td>
                          <label htmlFor="">...</label>
                          <br />
                          <label htmlFor="">+ Thép mạ kẽm làm cánh dày</label>
                          <select name="" id="" defaultValue={parentItem.info1}>
                            {info1Select.map((info: number) => (
                              <option key={info} value={info}>{info}</option>
                            ))}
                          </select> mm
                          <br />
                          <label htmlFor="">...</label>
                          <br />
                          +
                          <select name="" id="" defaultValue={parentItem.info1}>
                            {info2Select.map((info: string) => (
                              <option key={info} value={info}>{info}</option>
                            ))}
                          </select>
                        </td>
                        <td className='text-center'>{parentItem.accessories[0].width}</td>
                        <td className='text-center'>{parentItem.accessories[0].height}</td>
                        <td className='text-center'>{parentItem.accessories[0].code}</td>
                        <td className='text-center'>{calQuantityProduct(parentItem)}</td>
                        <td>{parentItem.accessories[0].price}</td>
                      </tr>
                    )
                    }
                    <tr>
                      <td className='text-center'>{index + 1},2</td>
                      <td>Phụ kiện & chi phí đi kèm theo</td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                    {parentItem.accessories.map((item, childIndex) => {
                      if (childIndex > 0) {
                        return (
                          <tr key={childIndex} className='border-b-2 border-gray-400'>
                            <td className='text-center'>{index + 1},{childIndex + 2}</td>
                            <td>
                              <select name="" id="" defaultValue={""} onChange={(e) => selectAcsName(e, item.id, parentItem.id)}>
                                <option value="" disabled hidden>--Chọn một tùy chọn--</option>
                                {acsSelect.map((acsItem, acsIndex) => (
                                  <option value={acsItem.id} key={acsIndex}>{acsItem.name}</option>
                                ))}
                              </select>
                            </td>
                            <td className='text-center'>{item.width === 0 ? "" : item.width}</td>
                            <td className='text-center'>{item.height === 0 ? "" : item.height}</td>
                            <td className='text-center'>{item.code}</td>
                            <td className='text-center'><input type="number" value={item.quantity} /></td>
                            <td>{item.price}</td>
                            <td><button type='button' onClick={(e) => handleDelAcs(parentItem.id, item.id)}>Xóa</button></td>
                          </tr>
                        );
                      }
                      return null;
                    })}
                    <tr>
                      <td></td>
                      <td className='px-2 py-2 border-none'>
                        <button type='button' className="inline-block w-full border-dashed border-2 border-black hover:bg-gray-300  font-bold py-1 px-2 rounded"
                          onClick={(e) => handleAddAccessory(parentItem.id)}>+ Thêm phụ kiện</button>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
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
