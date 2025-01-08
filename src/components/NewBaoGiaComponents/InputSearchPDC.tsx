import cmdData from '@/Model/cmdData';
import React, { useEffect, useRef, useState, useCallback } from 'react';

type Props = {
    handleChangeReport: (e: any, key: string) => void;
    name: string;
    doorModelData: any
};

export default function InputSearchPDC(props: Props) {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [list, setList] = useState<cmdData[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null); // Trạng thái chỉ số hiện tại
    const containerRef = useRef<HTMLDivElement>(null);
    // const handleSearching = useCallback((e: any) => {

    //     setOpen(true);
    //     const value = e.target.value;
    //     // props.handleChangeReport(value,"name");
    //     const temp = props.doorModelData.filter((item:any) =>
    //         item.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    //         .includes(value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
    //     );
    //     setList(temp);
    //     console.log(temp);
    //     setCurrentIndex(null);
    // }, [props.doorModelData,props.name]);
    const handleSearching = (e: any) => {
        setOpen(true);
        const value = e.target.value;
        // change Price report
        props.handleChangeReport(value, "name");
        const temp = props.doorModelData.filter((item: any) => {
            const normalizedValue = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            const normalizedName = item.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
            let checkShortName = false
            if (item.shortName) {
                const normalizedShortName = item.shortName.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                checkShortName = normalizedShortName.includes(normalizedValue)
            }
            // Kiểm tra nếu name hoặc shortName chứa value
            return normalizedName.includes(normalizedValue) || checkShortName;
        });
        setList(temp);
        setCurrentIndex(null);
    }

    const selectKey = (item: any) => {
        props.handleChangeReport(item, "doorModel");
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

    return (
        <div onClick={e => e.stopPropagation()} ref={containerRef} className='w-3/4 relative'>
            <input
                onChange={handleSearching}
                type="text"
                className='rounded px-2 py-1 w-full'
                value={props.name}
                placeholder='Nhập tên mẫu cửa...'
            />
            {isOpen &&
                <div className='absolute bg-gray-400 shadow-lg w-full z-20'>
                    {list.map((item: any, index: number) => (
                        <div
                            key={index}
                            onClick={() => selectKey(item)}
                            className={`flex flex-row justify-between text-sm truncate w-full hover:bg-gray-700 hover:text-gray-300 py-2 px-2  ${index === currentIndex ? 'bg-gray-700 text-gray-300' : 'text-gray-800'}`}
                        >
                            <div className='space-x-1'>
                                <span>{item.name}</span>
                                {item.numberDoor && <span className='text-xs'>({item.numberDoor} cánh)</span>}
                            </div>
                            <span className='text-xs'>{item.shortName}</span>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}
