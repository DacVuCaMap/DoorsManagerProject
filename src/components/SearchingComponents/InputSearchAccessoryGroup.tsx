import GroupAccessory from '@/Model/GroupAccessory';
import React, { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
    accessoryGroupData: GroupAccessory[],
    handleSetAcsGroup: (groupItem: GroupAccessory, index: number) => void
    index: number,
    condition?: string,
}
export default function InputSearchAccessoryGroup(props: Props) {
    const newGroupAcs = new GroupAccessory("", "", [], "");
    const [current, setCurrent] = useState<GroupAccessory>(newGroupAcs);

    const [isOpen, setOpen] = useState<boolean>(false);
    const [list, setList] = useState<GroupAccessory[]>([]);
    const [currentIndex, setCurrentIndex] = useState<number | null>(null); // Trạng thái chỉ số hiện tại
    const containerRef = useRef<HTMLDivElement>(null);
    const handleSearching = useCallback((e: any) => {
        setOpen(true);
        const value = e.target.value;
        setCurrent({ ...current, name: value })
        let temp : GroupAccessory[]= [];
        if (props.condition) {
            temp = props.accessoryGroupData.filter(item => item.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
                .includes(value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()) && props.condition?.includes(item.type));
        }
        else{
            temp = props.accessoryGroupData.filter(item => item.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
            .includes(value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()));
        }
        setList(temp);
        setCurrentIndex(null); // Reset chỉ số khi tìm kiếm
        if (temp.length === 1 && temp[0].name === value) {
            selectKey(temp[0]);
        }
    }, [props.accessoryGroupData]);

    const selectKey = (item: GroupAccessory) => {
        ///set
        props.handleSetAcsGroup(item, props.index);
        //reset
        setCurrent(newGroupAcs);
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
        <div ref={containerRef} className='w-full relative'>
            <input
                onChange={handleSearching}
                type="text"
                className='rounded px-2 py-1 w-full bg-gray-400 outline-none'
                value={current.name}
                placeholder='Nhập nhóm phụ kiện'
            />
            {isOpen &&
                <div className='absolute bg-gray-400 shadow-lg w-full z-50'>
                    {list.map((item: GroupAccessory, index: number) => (
                        <div
                            key={index}
                            onClick={() => selectKey(item)}
                            className={`flex flex-col hover:bg-gray-700 hover:text-gray-300 py-2 text-left px-2  ${index === currentIndex ? 'bg-gray-700 text-gray-300' : 'text-gray-800'}`}
                        >
                            <span>{item.name}</span>
                            <span className='text-xs'>{item.type}</span>
                        </div>
                    ))}
                </div>
            }
        </div>
    );
}
