import cmdData from '@/Model/cmdData';
import React, { useEffect, useRef, useState, useCallback } from 'react';

type Props = {
    handleSetCMD: (arr:string[],mainAcsId:any) => void;
    commandData: cmdData[];
    handleChangeReport: (e:any,key:string)=>void;
    name:string;
};

export default function InputSearchPDC(props: Props) {
    const [isOpen, setOpen] = useState<boolean>(false);
    const [list, setList] = useState<cmdData[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null); // Trạng thái chỉ số hiện tại
    const containerRef = useRef<HTMLDivElement>(null);
    const handleSearching = useCallback((e: any) => {
        setOpen(true);
        const value = e.target.value;
        props.handleChangeReport(value,"name");
        const temp = props.commandData.filter(item =>
            item.str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
            .includes(value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase())
        );
        setList(temp);
        setCurrentIndex(null); // Reset chỉ số khi tìm kiếm
    }, [props.commandData,props.name]);

    const selectKey = (item: cmdData) => {
        ///set
        let arr : string[] = item.command.split("-");
        props.handleSetCMD(arr,item.mainAcsId);
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
        <div onClick={e=>e.stopPropagation()} ref={containerRef} className='w-3/4 relative'>
            <input 
                onChange={handleSearching} 
                type="text" 
                className='rounded px-2 py-1 w-full' 
                value={props.name}
                placeholder='Nhập tên qui cách...'
            />
            {isOpen && 
                <div className='absolute bg-gray-400 shadow-lg w-full z-20'>
                    {list.map((cmd: cmdData, index: number) => (
                        <div 
                            key={index}
                            onClick={() => selectKey(cmd)} 
                            className={`text-sm truncate w-full hover:bg-gray-700 hover:text-gray-300 py-2 text-left px-2  ${index === currentIndex ? 'bg-gray-700 text-gray-300' : 'text-gray-800'}`}
                        >
                            {cmd.command}
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}
