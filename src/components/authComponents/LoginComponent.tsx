
"use client"
import React, { useState } from 'react';
import { Mail, Lock, Loader2 } from 'lucide-react';
import CheckLogin from '@/ApiPattern/CheckLogin';
import { useRouter } from 'next/navigation';
type LoginEntity = {
    email: string,
    password: string,
    name?: string
}
export default function LoginComponent() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<LoginEntity>({ email: "", password: "", name: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [loginError, setLoginError] = useState('');

    const validateForm = () => {
        const newErrors: LoginEntity = { email: "", password: "" };
        if (!formData.email) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.password) {
            newErrors.password = 'Mật khẩu là bắt buộc';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        setIsLoading(false);
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const result = await CheckLogin(formData)
            if (result.success) {
                // Redirect sau khi login thành công
                router.push('/')
                // Refresh để cập nhật client-side
                router.refresh()
            } else {
                // Hiển thị thông báo lỗi
                alert(result.message)
            }
        } catch (error) {
            console.error('Login error:', error)
            alert('An error occurred during login')
        } finally {
            setIsLoading(false)
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (errors.name) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <div className="max-w-md w-full mx-4 p-8 bg-gray-800 rounded-2xl shadow-2xl space-y-8 backdrop-blur-lg border border-gray-700">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center mb-6">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-gray-400">Vui lòng đăng nhập để tiếp tục</p>
                </div>

                {loginError && (
                    <div className="p-4 rounded-lg bg-red-900/50 border border-red-800 text-red-200 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        {loginError}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                Name
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="text"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 px-4 py-3 bg-gray-700 border ${errors.email ? 'border-red-500' : 'border-gray-600'
                                        } rounded-xl text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                                    placeholder="Enter your email"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="mt-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`block w-full pl-10 px-4 py-3 bg-gray-700 border ${errors.password ? 'border-red-500' : 'border-gray-600'
                                        } rounded-xl text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200`}
                                    placeholder="Enter your password"
                                />
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-400">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        {/* <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                Ghi nhớ đăng nhập
                            </label>
                        </div> */}

                        <div className="text-sm">
                            <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition duration-200">
                                Quên mật khẩu?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                'Đăng nhập'
                            )}
                        </button>
                    </div>

                    {/* <div className="text-center text-sm">
                        <span className="text-gray-400">Chưa có tài khoản? </span>
                        <a href="#" className="font-medium text-blue-400 hover:text-blue-300 transition duration-200">
                            Đăng ký ngay
                        </a>
                    </div> */}
                </form>
            </div>
        </div>
    );
}