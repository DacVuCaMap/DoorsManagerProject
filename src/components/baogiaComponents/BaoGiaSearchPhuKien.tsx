import GetPattern from '@/ApiPattern/GetPattern';
import PostPattern from '@/ApiPattern/PostPattern';
import Accessories from '@/Model/Accessories';
import React, { useEffect, useRef, useState } from 'react'
type Props = {
    acsData: Accessories[],
    acs: Accessories,
    productId: any,
    selectAccessories: (acsId: any, newAcs: Accessories, productId: any) => void
}
export default function BaoGiaSearchPhuKien(props: Props) {
    const [list, setList] = useState<Accessories[]>([]);
    const [open, setOpen] = useState(false);
    const [inpVal,setInpVal] = useState("");
    const [status,setStatus] = useState(false);
    useEffect(()=>{
        setStatus(props.acs.status);
        setInpVal(props.acs.name);
    },[props.acs])
    const containerRef = useRef<HTMLDivElement>(null);
    const handleChange = async (e: any) => {
        // console.log("set false")
        setStatus(false);
        setOpen(true);
        const val = e.target.value;
        setInpVal(val);
        let newArray = props.acsData.filter(item => item.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().includes(val.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()));
        setList(newArray);
    }
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [containerRef]);
    const handleSelect = (item: Accessories) => {
        props.selectAccessories(props.acs.id, item, props.productId);
        setInpVal(item.name);
        setOpen(false);
    }
    return (
        <div ref={containerRef}>
            {!status && <span className='text-red-500 text-xs'>Chưa chọn phụ kiện</span>}
            <input onChange={e => handleChange(e)} type="text" placeholder='Nhập phụ kiện ...' value={inpVal} className={`h-10 px-2 outline-none w-full z-10 rounded border ${!status ? 'border-red-500' : ''}`} />
            <div className='w-full bg-white relative z-10' >
                {open &&
                    <div className='absolute top-0 bg-white shadow-2xl border border-gray-700 w-full z-20'>
                        <table className='w-full'>
                            <tbody>
                                {list.map((item: any, index) => {
                                    if (index < 10) {
                                        return (
                                            <tr key={index} className='text-center hover:bg-gray-300 hover:cursor-pointer' onClick={e => handleSelect(item)}>
                                                <td className='py-2'>
                                                    <div className='relative'>
                                                        <h1 className='font-bold text-sm'>{item.name}</h1>
                                                        <span className='absolute right-2 bottom-[1px] text-gray-500 text-xs'>{item.code}</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    }
                                })}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
        </div>
    )
}
