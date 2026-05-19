'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/utils/axios'
import AdminOnly from '@/components/AdminOnly'

import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from 'react-hot-toast'


const ProductCreatePage = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock_quantity: '',
    category_ids: [],
    image: null,
  })

  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/api/products-category')
        setCategories(res.data)
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setError('Failed to load categories')
      }
    }
    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === 'file') {
      setFormData((prev) => ({ ...prev, image: files[0] }))
    } else if (name === 'category_ids') {
      const selected = Array.from(e.target.selectedOptions, (opt) =>
        parseInt(opt.value)
      )
      setFormData((prev) => ({ ...prev, category_ids: selected }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = new FormData() // when file upload then need to form submit with multipart
      payload.append('title', formData.title)
      payload.append('description', formData.description)
      payload.append('price', parseFloat(formData.price))
      payload.append('stock_quantity', parseInt(formData.stock_quantity))
      formData.category_ids.forEach((id) => payload.append('category_ids', id))
      
      if (formData.image) payload.append('image_url', formData.image)
  
      await api.post('/api/products', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      toast.success("Product added successfully.")
      setTimeout(function() {
        router.push('/user/product')
      }, 1000)
    } catch (err) {
      console.error('Failed to create product:', err)
      setError('Failed to create product. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminOnly>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-4"> <Plus className='inline' /> Add New Product</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Product Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            min={0}
            className="w-full border p-2 rounded"
          />

          <input
            type="number"
            name="stock_quantity"
            placeholder="Stock Quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            required
            min={0}
            className="w-full border p-2 rounded"
          />

          <select
            name="category_ids"
            multiple
            value={formData.category_ids}
            onChange={handleChange}
            className="w-full border p-2 rounded h-28"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          {formData.image && (
            <div className="relative w-40">
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="w-60 h-40 object-cover rounded-lg border"
              />

              <button
                type="button"
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    image: null,
                  }))
                }
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded"
              >
                Remove
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </form>
      </div>
    </AdminOnly>
  )
}

export default ProductCreatePage
