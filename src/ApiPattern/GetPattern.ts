"use server"
import axios, { AxiosError } from 'axios'
import React from 'react'

export default async function GetPattern(url:any,thirdValue:any) {
  
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
            console.error('Axios Error:', axiosError.message);
            console.error('Response data:', axiosError.response?.data);
            console.error('Response status:', axiosError.response?.status);
        return null;
    }
}
