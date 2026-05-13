'use client';

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const LoginPage = () => {
    const { login } = useAuth()
    const [form, setForm] = useState({email: '', password: ''})

    const handleCange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            await login(form)
            toast.success("Login successful!");
        } catch(err) {
            console.log(err)
            toast.error(
                err.response?.data?.detail || "Login failed!"
            );
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow mt-8">
            <h2 className="text-xl font-semibold mb-4">Login</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleCange} className="w-full p-2 border" required />
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleCange} className="w-full p-2 border" required />
                <button className="w-full bg-blue-600 text-white p-2 rounded">Login</button>
            </form>
        </div>
    )
}

export default LoginPage;