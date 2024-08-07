"use server"
import axios, { AxiosError } from 'axios'
import React from 'react'

export default async function PostPattern(url: any, data: any, thirdValue: any) {

    try {
        const response = await axios.post(url, data, thirdValue)
        console.log(response)
        return response.data;
    } catch (error) {
        const axiosError = error as AxiosError;
        console.error('Axios Error:', axiosError.message);
        console.error('Response data:', axiosError.response?.data);
        console.error('Response status:', axiosError.response?.status);
        return null;
    }
}
