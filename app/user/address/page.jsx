"use client";

import { useEffect, useState } from 'react'
import api from '@/utils/axios'
import { useRouter } from 'next/navigation'
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

const  AddressPage = () => {
    const [addresses, setAddresses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const response = await api.get('/api/shippings/addresses')
                setAddresses(response.data)
            } catch(error) {
                setError("Failed to load addresses")
            } finally {
                setLoading(false)
            }
        }

        fetchAddresses();
    }, [])
    
    const handleDelete = async (id) => {
        if(!confirm("Are you sure you want to delete this address?")) return;
        try {
            await api.delete(`/api/shippings/addresses/${id}`)
            // refresh by filtering locally (better UX than re-fetching everything)
            setAddresses(addresses.filter(addr => addr.id != id))
        } catch (error) {
            toast.error("Failed to delete address");
        }
    }

    if (loading) return <div className="p-6">Loading addresses...</div>
    if (error) return <div className="p-6 text-red-600">{error}</div>

    return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">🏠 Shipping Addresses</h1>
      <button
        onClick={() => router.push('/user/address/create')}
        className="bg-indigo-600 text-white px-4 py-2 rounded mb-6 cursor-pointer"
      >
        <Plus size={18} className="inline"/> Add Address
      </button>
      {addresses.length === 0 ? (
        <p>No addresses found. Add one to continue.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div key={addr.id} className="border p-4 rounded shadow">
              <p><strong>Name:</strong> {addr.name}</p>
              <p><strong>Address 1:</strong> {addr.address_line1}</p>
              <p><strong>Address 2:</strong> {addr.address_line2}</p>
              <p><strong>City:</strong> {addr.city}</p>
              <p><strong>State:</strong> {addr.state}</p>
              <p><strong>Pin Code:</strong> {addr.pin_code}</p>
              <p><strong>Country:</strong> {addr.country}</p>
              <div className="mt-4 space-x-2">
                <button
                  onClick={() => router.push(`/user/address/edit/${addr.id}`)}
                  className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer"
                >
                   <Pencil size={16} className='inline' /> Edit
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="px-3 py-1 bg-red-500 hover:bg-red-700 text-white rounded-md transition cursor-pointer"
                >
                  <Trash2 size={16} className='inline' /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddressPage