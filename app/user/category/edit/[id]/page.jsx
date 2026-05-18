'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

import api from '@/utils/axios'
import AdminOnly from '@/components/AdminOnly'

import { Pencil } from "lucide-react";
import toast from 'react-hot-toast'

const UpdateCategoryPage = () => {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  const router = useRouter()
  const params = useParams()

  const categoryId = params.id

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await api.get('/api/products-category')

        const category = response.data.find(
          (item) => item.id === Number(categoryId)
        )

        if (category) {
          setName(category.name)
        }
      } catch (err) {
        console.error('Failed to fetch category:', err)

        toast.error(
          err.response?.data?.detail || 'Failed to fetch category'
        )
      } finally {
        setLoading(false)
      }
    }

    if (categoryId) {
      fetchCategory()
    }
  }, [categoryId])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await api.patch(`/api/products-category/${categoryId}`, {
        name
      })

      toast.success('Category updated successfully')

      router.push('/user/category')

    } catch (err) {
      console.error('Failed to update category:', err)

      toast.error(
        err.response?.data?.detail || 'Failed to update category'
      )
    }
  }

  if (loading) {
    return (
      <div className="text-center mt-10">
        Loading...
      </div>
    )
  }

  return (
    <AdminOnly>
      <div className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          <Pencil size={18} className="inline" /> Edit Category
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">
              Category Name *
            </label>

            <input
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Update
          </button>
        </form>
      </div>
    </AdminOnly>
  )
}

export default UpdateCategoryPage