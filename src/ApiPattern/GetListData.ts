"use server"
import React from 'react'
import GetPattern from './GetPattern';

export default async function GetListData(key: string, page: any, size: any, search: any) {
    let url = process.env.NEXT_PUBLIC_API_URL + `/api/${key}/list?page=${page}&size=${size}&search=${search}`;
    const data : any = await GetPattern(url, {});
    console.log(url)
    console.log(data)
    if (data===null) {
        return [];
    }
    let arrData: any[] = [];
    arrData =data.content;
    let maxPage = data.totalPages;
    return {list: arrData,maxPage:maxPage};
}
