import Accessories from '@/Model/Accessories';
import { debounce } from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react'
type Props = {
    acsData: Accessories[];
    itemSelect?:any;
    handleSelectAcs: (acs: Accessories,itemSelect?:any) => void,
    curAcs:Accessories,
}
export default function InputSearchAcs(props: Props) {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [list, setList] = useState<Accessories[]>([]);
    const [key, setKey] = useState("");
    const [currentIndex, setCurrentIndex] = useState<number | null>(null); // Trạng thái chỉ số hiện tại
    const containerRef = useRef<HTMLDivElement>(null);
    const handleSearching = useCallback((e: any) => {
        setOpen(true);
        const value = e.target.value;
        setKey(value);
        let temp: Accessories[] = props.acsData.filter(item => (item.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
            .includes(value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()) && item.type!="main" ||
            item.code.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
                .includes(value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()) && item.type!="main"
        )).slice(0, 5);
        setList(temp)
        setCurrentIndex(null); // Reset chỉ số khi tìm kiếm
    }, [key]);

    const selectKey = (acs: Accessories) => {
        ///set
        if(props.itemSelect){props.handleSelectAcs(acs,props.itemSelect)}
        else{props.handleSelectAcs(acs);}

        setKey(acs.name);
        //close window
        setOpen(false);
    };

    const handleClickOutside = useCallback((event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
            setOpen(false);
        }
    }, []);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'ArrowDown') {
            setCurrentIndex(prevIndex => {
                if (list.length === 0) return null;
                const nextIndex = (prevIndex === null ? 0 : Math.min(prevIndex + 1, list.length - 1));
                return nextIndex;
            });
        } else if (event.key === 'ArrowUp') {
            setCurrentIndex(prevIndex => {
                if (list.length === 0) return null;
                const prevIndexValue = prevIndex === null ? list.length - 1 : Math.max(prevIndex - 1, 0);
                return prevIndexValue;
            });
        } else if (event.key === 'Enter') {
            if (currentIndex !== null && list[currentIndex]) {
                selectKey(list[currentIndex]);
            }
        }
    }, [list, currentIndex]);

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyDown); // Thêm sự kiện keydown
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleKeyDown); // Xóa sự kiện keydown
        };
    }, [handleClickOutside, handleKeyDown]);
    useEffect(()=>{
        setKey(props.curAcs.name)
    },[props.curAcs.name])
    return (
        <div ref={containerRef} className='w-full relative'>
            <input
                onChange={handleSearching}
                type="text"
                className='rounded px-2 py-1 w-full'
                value={key}
                placeholder='Nhập tên phụ kiện...'
            />
            {isOpen &&
                <div className='absolute bg-gray-400 shadow-lg w-full z-20'>
                    {list.map((item: Accessories, index: number) => (
                        <div key={index} onClick={e=>selectKey(item)} className={`relative w-full hover:cursor-pointer py-2 px-2 hover:bg-gray-700  ${index === currentIndex ? 'bg-gray-700 text-gray-300' : 'text-gray-800'}`}>
                            <h1 className='text-sm text-white text-left'>{item.name}</h1>
                            <span className='absolute right-2 bottom-[1px] text-gray-300 text-xs'>{item.code}</span>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}
