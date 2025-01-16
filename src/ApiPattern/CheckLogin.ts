"use server"
import { cookies } from 'next/headers'
import React from 'react'

export default async  function CheckLogin(data: any) {
    console.log(data);
    if (data.email === "novodoor1" && data.password === "123456") {
        // Tạo cookie với thời gian sống là 24 giờ
        cookies().set('auth-token', 'ckjkjs', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 // 24 hours
        })
        return { success: true, message: 'Login successful' }
    }
    return { success: false, message: 'Invalid credentials' }
}
