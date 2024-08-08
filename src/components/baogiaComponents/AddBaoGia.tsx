"use client"
import React, { use, useEffect, useState } from 'react'
import "./AddBaoGia.css";
import Product from '@/Model/Product';
import DoorNameSelect from '@/Model/DoorNameSelect';
import { genNumberByTime } from '@/data/FunctionAll';
import Accessories from '@/Model/Accessories';
import { dataAcs, info1Select, info2Select } from '@/data/AddData';
import GetPattern from '@/ApiPattern/GetPattern';
import HeaderComponent from '../HeaderComponent';
import { DoorClosed, DoorOpen, MoveRight, Plus, Trash2 } from 'lucide-react';
import { ScaleLoader } from 'react-spinners';
import BaoGiaSearchPhuKien from './BaoGiaSearchPhuKien';
import { parse } from 'path';
import { CalTotalInforProduct, CalTotalMoreInforProduct, ConstructorAcs } from '@/data/AddBaoGiaFunction';
import AddBaoGiaTool from './AddBaoGiaTool';

type Props = {
  dataName: DoorNameSelect[]
}
export default function AddBaoGia(props: Props) {
  // nhap
  const acsSelect: any[] = dataAcs;
  //loading data accessories
  const [acsData, setAcsData] = useState<Accessories[]>([]);
  //check form lưu chưa
  const [isFormDirty, setFormDirty] = useState(false);
  
  console.log(props.dataName);
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isFormDirty) {
        // Cảnh báo người dùng khi có thay đổi chưa được lưu
        event.preventDefault();
        event.returnValue = ''; // Phải có thuộc tính này để hiển thị cảnh báo trên một số trình duyệt
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup event listener
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isFormDirty]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/list?page=0&size=100&search";
        const response = await GetPattern(url, {});
        if (response.content && Array.isArray(response.content)) {
          const list: any[] = response.content;
          let newAcs: Accessories[] = list.map((item: any, index: number) => {
            return new Accessories(
              genNumberByTime() + "" + index,
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
              false
            );
          });
          let newLastAcs: Accessories[] = list
            .filter((item: any) => listLastCodeItem.includes(item.code))
            .map((item: any, index) =>
              new Accessories(
                genNumberByTime() + "" + index,
                item.code,
                item.name,
                "",
                0,
                0,
                0,
                0,
                item.orgPrice,
                item.lowestPricePercent,
                0,
                item.unit,
                false
              )
            ).sort((a, b) => {
              const indexA = listLastCodeItem.indexOf(a.code);
              const indexB = listLastCodeItem.indexOf(b.code);
              return indexA - indexB;
            });
          newLastAcs.push(ConstructorAcs(genNumberByTime() + "" + newLastAcs.length, "", "Chi phí vận chuyển đến Ngô Quyền - Hải Phòng"))
          setLastItem(newLastAcs);
          // Kiểm tra kết quả
          setAcsData(newAcs);
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
  // end nhap
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState<any>();
  const dataSelect: DoorNameSelect[] = props.dataName;
  const if1Select: string[] = info1Select;
  const if2Select: string[] = info2Select;
  const handleAddDoor = () => {
    setFormDirty(true);
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
      // let newAccessory = new Accessories(1, "CC0.8/1.4", description, "Novodor", 0, 0, door.width, door.height, 0, 0, 0, "Bộ", false);
      const updatedProducts = products.map((item) => {
        if (item.id === id) {
          // let updatedAccessories = [newAccessory, ...item.accessories.slice(1)];
          return { ...item, selectId: val, name1: dataSelect[val].name };
        }
        return item;
      });
      setProducts(updatedProducts);
    }
  }

  const handleChangeProduct = (e: any, id: any, key: any) => {
    let value = e.target.value;
    if (value && key === "totalQuantity") {
      value = parseFloat(value);
    }
    if (key === "height" || key === "width") {
      let accessoriesProduct = products.find(item => item.id === id)?.accessories;
      if (accessoriesProduct) {
        let updateAccessories = accessoriesProduct.map((item: Accessories, index) => {
          if (index === 0) {
            let num1 = value;
            let num2 = key === "height" ? item.width : item.height;
            let quan: number = (item.width > 0 && item.height > 0) ? (num1 / 1000) * (num2 / 1000) : 0;
            quan = parseFloat(quan.toFixed(4))
            return { ...item, [key]: value, quantity: quan }
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

    let value = e.target.value;
    let updatedProduct = products.map((item: Product) => item.id === id ? { ...item, [key]: value } : item);
    let product = updatedProduct.find(item => item.id === id);
    let flag = key === "name2" || key === "name3";
    if (product?.name2 && product?.name3 && flag) {
      setLocationLoading(id);
      setLoading(true);


      // get default command
      console.log("loading");
      let url = process.env.NEXT_PUBLIC_API_URL + `/api/product-command/get-command?command=${product.name3}-${product.name2}`;
      const response = await GetPattern(url, {});
      setLoading(false);
      if (response) {
        //delete before add command  
        const list: any[] = response.value;
        let newAcs: Accessories[] = list.map((item: any, index) => {
          const acs = item.accessories
          return new Accessories(
            genNumberByTime() + "" + index, acs.code, acs.name, acs.supplier,
            0,
            item.quantity,
            0,
            0,
            acs.orgPrice,
            acs.lowestPricePercent,
            0,
            acs.unit,
            true,
            true
          )
        });
        if (newAcs.length > 0) {
          updatedProduct = updatedProduct.map((item: Product) => {
            if (item.id === id) {
              let filterAcs: Accessories[] = item.accessories.filter(item => !item.isCommand);
              let updatedAcs: Accessories[] = [...filterAcs, ...newAcs];
              return { ...item, accessories: updatedAcs };
            }
            return item;
          });
        }
      }

      // console.log(response);
      // console.log(url)
    }
    console.log(updatedProduct)
    setProducts(updatedProduct)

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
    let total = parent.accessories[0].quantity * parent.totalQuantity;
    return parseFloat(total.toFixed(4));
  }
  const selectAccessories = (acsId: any, newAcs: Accessories, productId: any) => {
    console.log(acsId, newAcs, productId);
    // console.log(products);

    //check quantity
    let quan = newAcs.name.includes("Door") ? -1 : 1;
    setProducts((preProducts: Product[]) => {
      return preProducts.map((product: Product) => {
        if (product.id === productId) {
          const updatedAccessories = product.accessories.map((accessories: Accessories) => {
            if (accessories.id === acsId) {
              return {
                ...accessories, code: newAcs.code, name: newAcs.name, supplier: newAcs.supplier
                , width: newAcs.width, height: newAcs.height, unit: newAcs.unit, status: true, quantity: quan
              }
            }

            return accessories;
          })
          return { ...product, accessories: updatedAccessories };
        }
        return product;
      })
    })
  }
  const handleChangeInfo = (e: any, parentItem: Product, key: string) => {
    const value = e.target.value;
    setProducts((preProduct: Product[]) => {
      return preProduct.map((product: Product, index) => {
        if (product.id === parentItem.id) {
          let tmp = product;
          tmp = { ...tmp, [key]: value };
          let tmpInfo2 = tmp.info2 === "Sơn vân gỗ" ? "VG" : "";
          tmp.accessories[0].code = "CC" + tmp.info1 + "/1.4" + tmpInfo2;
          let tmpAcs: Accessories | undefined = acsData.find((acs: Accessories) => acs.code === tmp.accessories[0].code);
          if (tmpAcs) {
            tmp.accessories[0].orgPrice = tmpAcs.orgPrice;
          }
          return tmp;
        }
        return product;
      })
    })
  }
  const handleChangeAccessories = (e: any, parentItem: Product, item: Accessories, key: string) => {
    const value = e.target.value;
    if (key === "quantity" && value < 0) {
      return;
    }
    setProducts((preProducts: Product[]) => {
      return preProducts.map((product: Product, index) => {
        if (product.id === parentItem.id) {
          return {
            ...product, accessories: product.accessories.map((acs: Accessories, ind) => {
              if (item.id === acs.id) {
                let temp = acs;
                temp = { ...temp, [key]: value };
                return temp;
              }
              return acs;
            })
          }
        }
        return product;
      })
    })
  }

  /// total last
  const listLastCodeItem = ["CPV", "CPLD", "CPLDPN", "CPLDBLS"];
  const [lastItem, setLastItem] = useState<Accessories[]>([]);

  const handleChangeLastItem = (e: any, item: Accessories, key: string) => {
    let value = e.target.value;
    setLastItem((preItem: Accessories[]) => {
      return preItem.map((acs: Accessories, index) => {
        if (acs.id === item.id) {
          let temp = acs;
          temp = { ...acs, [key]: value }
          return temp;
        }
        return acs;
      })
    })
  }
  return (
    <div className='px-20 pb-10 relative'>
      <AddBaoGiaTool/>
      <div className='bg-white shadow-2xl rounded-lg mb-4 pb-4'>
        <form action="">
          <table className='add-tbl w-full table-auto text-sm'>
            <thead className='bg-blue-700 border-b-2 text-white border-black'>
              <tr>
                <th rowSpan={2}>STT</th>
                <th rowSpan={2} className='min-w-[400px]'>Quy cách nhà cung cấp đề xuất</th>
                <th className='' colSpan={2}>Kích thước</th>
                <th className='' rowSpan={2}>Mã</th>
                <th colSpan={2}>Khối lượng</th>
                <th rowSpan={2}>Đơn giá</th>
                <th rowSpan={2}></th>
              </tr>
              <tr>
                <th>Rộng</th>
                <th>Dài</th>
                <th className='max-w-20'>SL/1 cấu kiện</th>
                <th>Tổng KL</th>
              </tr>
            </thead>
            <tbody>
              {
                products.map((parentItem, index) => (
                  <React.Fragment key={index}>
                    <tr key={index} className='bg-gray-300 font-bold rounded-2xl'>
                      <td className='text-center'>{index + 1}</td>
                      <td className='py-2 flex flex-row space-x-4 px-2'>
                        <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  ' defaultValue="" onChange={e => handleSelectName(e, parentItem.id)}>
                          <option value="" disabled hidden>--Chọn một tùy chọn--</option>
                          {dataSelect.map((sel, selectIndex) => (
                            <option key={selectIndex} value={selectIndex}>{sel.name}</option>
                          ))}
                        </select>
                        {parentItem.selectId &&
                          <>
                            <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  ' defaultValue="" onChange={(e) => handleChangeProductNameInfo(e, parentItem.id, "name2")}>
                              <option value="" disabled hidden>--cánh--</option>
                              {dataSelect[parentItem.selectId].numberDoor.map((item, selectIndex) => (
                                <option value={item} key={selectIndex}>{item}</option>
                              ))}
                            </select>
                            <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  ' defaultValue="" onChange={(e) => handleChangeProductNameInfo(e, parentItem.id, "name3")}>
                              <option value="" disabled hidden>--loại--</option>
                              {dataSelect[parentItem.selectId].type.map((item, selectIndex) => (
                                <option value={item} key={selectIndex}>{item}</option>
                              ))}
                            </select>
                            <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5  ' defaultValue="" onChange={(e) => handleChangeProductNameInfo(e, parentItem.id, "name4")}>
                              <option value="" disabled hidden>--chỉ số--</option>
                              {dataSelect[parentItem.selectId].code.map((item, selectIndex) => (
                                <option value={item} key={selectIndex}>{item}</option>
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
                      <td className='text-center'>
                        1
                      </td>
                      <td className='max-w-20'>
                        <input onChange={(e) => handleChangeProduct(e, parentItem.id, "totalQuantity")} type="number" className='w-full text-center h-8' />
                      </td>
                      <td>
                        {/* <input onChange={(e) => handleChangeProduct(e, parentItem.id, "price")} type="text" className='h-8 w-40' />
                         */}
                      </td>
                      <td>
                        <button type='button' className='bg-red-500 p-2 rounded text-white' onClick={(e) => handleDelProduct(parentItem.id)}><Trash2 /></button>

                      </td>
                    </tr>
                    {parentItem.accessories[0] && (
                      <tr className='border-b border-gray-400'>
                        <td className='text-center'>{index + 1},1</td>
                        {/* <td><textarea
                          value={parentItem.accessories[0].name}
                          style={{ width: '100%', minHeight: '170px', resize: 'none' }}
                          onChange={(e) => handleChangeDesName(e, parentItem.id)}
                        /></td> */}
                        <td className='py-4 px-2 lg:min-w-[500px]'>
                          <div className='flex flex-row space-x-2'>
                            <div className='pr-2 border-r border-black'>
                              <label htmlFor="">Thép mạ kẽm làm cánh dày</label>
                              <select className='font-bold' name="" id="" defaultValue={parentItem.info1} onChange={e => handleChangeInfo(e, parentItem, "info1")}>
                                {info1Select.map((info: string) => (
                                  <option key={info} value={info}>{info}</option>
                                ))}
                              </select> mm
                            </div>
                            <div className='pl-2'>
                              <select className='font-bold' name="" id="" defaultValue={parentItem.info2} onChange={e => handleChangeInfo(e, parentItem, "info2")}>
                                {info2Select.map((info: string) => (
                                  <option key={info} value={info}>{info}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </td>
                        <td className='text-center'>{parentItem.accessories[0].width}</td>
                        <td className='text-center'>{parentItem.accessories[0].height}</td>
                        <td className='text-center'>{parentItem.accessories[0].code}</td>
                        <td className='max-w-20 text-center'>{parentItem.accessories[0].quantity}</td>
                        <td className='text-center'>{calQuantityProduct(parentItem)}</td>
                        <td className='text-center'>{parentItem.accessories[0].price}</td>
                      </tr>
                    )
                    }
                    <tr className='border-b border-gray-400 font-bold'>
                      <td className='text-center border-none'>{index + 1},2</td>
                      <td colSpan={8} className='py-2'>Phụ kiện & chi phí đi kèm theo</td>
                    </tr>
                    {parentItem.accessories.map((item, childIndex) => {
                      if (childIndex > 0) {
                        return (
                          <tr key={childIndex} className='border-b-2 border-gray-400'>
                            <td className='text-center'>{index + 1},{childIndex + 2}</td>
                            <td className='px-2 py-2'>

                              <BaoGiaSearchPhuKien acs={item} productId={parentItem.id} selectAccessories={selectAccessories} acsData={acsData} />

                            </td>
                            <td className='text-center'>{item.width === 0 ? "" : item.width}</td>
                            <td className='text-center'>{item.height === 0 ? "" : item.height}</td>
                            <td className='text-center'>{item.code}</td>
                            <td >
                              {
                                item.quantity != -1 ?
                                  <input type="number" className='text-center' value={item.quantity} onChange={e => handleChangeAccessories(e, parentItem, item, "quantity")} />
                                  :
                                  <p className='text-center'>{parentItem.width / 1000}</p>
                              }

                            </td>
                            <td>
                              {
                                item.quantity != -1 ?
                                  <p className='text-center'>{parseFloat((item.quantity * parentItem.totalQuantity).toFixed(4))}</p>
                                  :
                                  <p className='text-center'>{parseFloat((parentItem.width * parentItem.totalQuantity / 1000).toFixed(4))}</p>
                              }
                            </td>
                            <td><input type="number" className='text-center' value={item.price} onChange={e => handleChangeAccessories(e, parentItem, item, "price")} /></td>
                            <td><button type='button' className='bg-red-500 p-2 rounded text-white' onClick={(e) => handleDelAcs(parentItem.id, item.id)}><Trash2 /></button></td>
                          </tr>
                        );
                      }
                      return null;
                    })}
                    {loading && locationLoading === parentItem.id ? <tr className='border-b broder-gray-400'>
                      <td colSpan={8} className='text-center py-2'>
                        <div>
                          <ScaleLoader color='gray' />
                        </div>
                      </td>
                    </tr> : ""}
                    <tr className='border-b border-gray-400'>
                      <td></td>
                      <td className='px-2 py-2'>
                        <button type='button' className="inline-block w-full border-dashed border-2 border-gray-700 hover:bg-gray-300 text-gray-700 font-bold py-1 px-2 rounded"
                          onClick={(e) => handleAddAccessory(parentItem.id)}>+ Thêm phụ kiện</button>
                      </td>
                      <td colSpan={7}></td>
                    </tr>
                  </React.Fragment>
                ))
              }

              {products.length == 0 && <tr>
                <td colSpan={9} className='font-bold text-gray-300 py-10'>
                  <div className="flex flex-col items-center justify-center">
                    <DoorOpen size={150} className='' />
                    <span>Trống chưa thêm dữ liệu</span>
                  </div>
                </td>
              </tr>}
              <tr>
                <td colSpan={9} className='px-2 py-2 border-none'>
                  {products.length > 0 ? <button type='button' className="bg-gray-800 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded-l w-full"
                    onClick={handleAddDoor}>+ Click để thêm cửa mới</button>
                    :
                    <button type='button' className="text-gray-700 border-dashed border-gray-700 border-2 flex items-center justify-center hover:bg-gray-200 font-bold py-2 px-4 rounded-l w-full" onClick={handleAddDoor}>
                      <span className="mr-2">+ Click để thêm cửa mới</span>
                      <Plus />
                    </button>
                  }

                </td>
              </tr>
            </tbody>
            {products.length > 0 &&
              <tfoot>
                {(() => {
                  const totalInfo = CalTotalInforProduct(products);
                  return lastItem.map((item: Accessories, index) => (
                    <tr key={index} className='font-bold'>
                      <td className='text-center'>{products.length + index + 1}</td>
                      <td className='px-2'>{item.name}</td>
                      <td></td>
                      <td></td>
                      <td><p className='text-center'>{item.code}</p></td>
                      <td></td>
                      <td>
                        {(item.code === "CPV" || item.code === "CPLD") && totalInfo !== 0 && (
                          <h2 className='text-center'>{CalTotalInforProduct(products)}</h2>
                        )}
                        {(item.code === "CPLDPN" || item.code === "CPLDBLS") && (
                          <h2 className='text-center'>{CalTotalMoreInforProduct(products, item.code)}</h2>
                        )}
                      </td>
                      <td>
                        <input type="number" className='text-center' value={item.price} onChange={e => handleChangeLastItem(e, item, "price")} />
                      </td>
                    </tr>
                  ));
                })()}
              </tfoot>
            }
          </table>
        </form>
      </div>
      <div className='flex space-x-4'>
        <button className='inline-block w-64 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'> Xem chi tiết</button>
        <button className='flex flex-row space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded'><span>Xuất bảng file Excel</span> <MoveRight /></button>
      </div>
    </div>
  )
}
