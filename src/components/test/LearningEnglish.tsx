"use client"
import React, { useState } from 'react'

export default function LearningEnglish() {
    const [rs, setRs] = useState<string>("ket qua");
    const [rsArr, setRsArr] = useState<string[]>([]);
    const handleRandom = () => {
        if (rsArr.length > 0) {
            const randomIndex = Math.floor(Math.random() * rsArr.length);
            setRs(rsArr[randomIndex]);
        }
        else {
            setRs("khong co du lieu");
        }
    }
    const handleChange = (e: any) => {
        const value = e.target.value;
        const wordsArray = value.split("\n").filter((word: string) => word.trim() !== "");
        setRsArr(wordsArray);
    }
    return (
        <div >
            <textarea onChange={e => handleChange(e)} name="" id="" className='text-black h-64'>

            </textarea>
            <button className='bg-blue-400 p-2' onClick={e => handleRandom()}>Random</button>
            <br />
            <p>{rs}</p>
        </div>
    )
}
