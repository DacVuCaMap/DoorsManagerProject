import PostPattern from '@/ApiPattern/PostPattern';
import { Check } from 'lucide-react';
import Image from 'next/image';
import React, { useState } from 'react'
import { BarLoader } from 'react-spinners';

export default function PhukienUploadExcel() {
    const [file, setFile] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const [itemErr, setItemErr] = useState<String[]>([]);
    const [success, setSuccess] = useState(false);
    const handleUpload = async () => {
        const formData = new FormData();
        setLoading(true)
        formData.append('file', file);
        let url = process.env.NEXT_PUBLIC_API_URL + "/api/accessories/update-data-xlsx";
        console.log(url);
        const response = await PostPattern(url, formData, {});
        setLoading(false);
        if (!response) {
            setErr("Lỗi upload file");
            return;
        }
        console.log(response);
        setSuccess(true)
        setTimeout(() => {
            setFile(null);
            setSuccess(false);
        }, 3000);
        return;
    }
    const handleFile = (e: any) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }
    return (
        <div>
            <div className="flex items-center w-full flex-col space-y-4">
                {err && <span className=' text-white px-2 bg-red-600'>{err}</span>}
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer">

                    {file ?
                        <label htmlFor='file-upload' className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-green-500">
                            <div className='flex flex-col items-center justify-center pt-5 pb-6 '>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="w-10 h-10 mb-3 text-gray-400 lucide lucide-folder-check"><path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
                                    <path d="m9 13 2 2 4-4" />
                                </svg>
                                <p className="text-sm max-w-64 text-gray-500 truncate font-semibold">
                                    File đã chọn: {file.name}
                                </p>
                                <p className="text-xs text-gray-500">Nhấn để chọn lại</p>

                            </div>

                        </label>

                        :
                        <label htmlFor='file-upload' className="flex flex-col items-center justify-center w-full h-ful rounded-lg cursor-pointer ">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <p className='font-semibold text-sm text-gray-500'>+ Thêm bằng file excel</p>
                                <Image
                                    src="/Microsoft_Excel-Logo.svg"
                                    alt="Upload icon"
                                    width={100}
                                    height={100}
                                    className="mb-3 text-gray-400"
                                />
                                <p className="mb-2 text-sm text-gray-500 truncate">
                                    <span className="font-semibold">Nhấn vào đây để chọn file</span> hoặc kéo thả
                                </p>
                                <p className="text-xs text-gray-500">file excel.xlsx</p>

                            </div>
                        </label>

                    }
                    <input id="file-upload" name="file-upload" accept='.xlsx' type="file" className="hidden" onChange={(e) => handleFile(e)} />
                </label>
                {file && !loading && !success
                    ?
                    <button onClick={handleUpload} type='button' className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-1/2'>Tải lên </button>
                    : ""
                }
                {loading &&
                    <button disabled type='button' className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded'>
                        <BarLoader className='w-full' />
                    </button>}
                {success &&
                    <button disabled type='button' className='flex space-y-1 flex-col items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8 rounded'>
                        <Check size={25} className='bg-green-500 p-1 rounded-full' />
                        <p className='text-xs'>Hoàn thành</p>
                    </button>
                }

            </div>
        </div>
    )
}
