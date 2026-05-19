'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api from '@/utils/axios'
import AdminOnly from '@/components/AdminOnly'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2 } from "lucide-react";

const ProductEditPage = () => {
  const router = useRouter()
  const params = useParams()
  const { slug } = params

  const [product, setProduct] = useState(null)
  const [productId, setProductId] = useState(null)

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    stock_quantity: '',
    categories: [],
    image: null,
  })

  const [allCategories, setAllCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/api/products/${slug}`)
      const data = res.data

      setProduct(data)
      setProductId(data.id)

      setForm({
        title: data.title || '',
        description: data.description || '',
        price: data.price || '',
        stock_quantity: data.stock_quantity || '',
        categories: data.categories?.map((c) => c.id) || [],
        image: null,
      })
    } catch (err) {
      console.error('Failed to fetch product:', err)
      toast.error('Failed to load product')
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await api.get('/api/products-category')
      setAllCategories(res.data)
    } catch (err) {
      console.error('Failed to fetch categories:', err)
      toast.error('Failed to load categories')
    }
  }

  useEffect(() => {
    fetchProduct()
    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]

    if (file) {
      setForm((prev) => ({
        ...prev,
        image: file,
      }))
    }
  }

  const removeSelectedImage = () => {
    setForm((prev) => ({
      ...prev,
      image: null,
    }))
  }

  const handleCategoryChange = (e) => {
    const values = Array.from(
      e.target.selectedOptions,
      (option) => Number(option.value)
    )

    setForm((prev) => ({
      ...prev,
      categories: values,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!productId) return

    setLoading(true)

    try {
      const formData = new FormData()

      formData.append('title', form.title)
      formData.append('description', form.description)
      formData.append('price', Number(form.price))
      formData.append('stock_quantity', Number(form.stock_quantity))

      form.categories.forEach((catId) => {
        formData.append('category_ids', catId)
      })

      if (form.image) {
        formData.append('image', form.image)
      }

      await api.patch(`/api/products/${productId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      toast.success('Product updated successfully')

      setTimeout(() => {
        router.push('/user/product')
      }, 1000)

    } catch (err) {
      console.error('Failed to update product:', err)

      toast.error(
        err?.response?.data?.detail || 'Failed to update product'
      )
    } finally {
      setLoading(false)
    }
  }

  const imageUrl = form.image
    ? URL.createObjectURL(form.image)
    : product?.image_url
      ? `http://127.0.0.1:8000/${product.image_url.replace(/^\/+/, '')}`
      : null

  if (!product) {
    return (
      <p className="p-6 text-center text-gray-500">
        Loading product...
      </p>
    )
  }

  return (
    <AdminOnly>
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">
          <Pencil className='inline'/> Edit Product
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">
              Product Title *
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">
              Description *
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              required
              className="w-full border p-3 rounded-lg resize-none"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block mb-1 font-medium">
              Price *
            </label>

            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              required
              min={0}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="block mb-1 font-medium">
              Stock Quantity *
            </label>

            <input
              type="number"
              name="stock_quantity"
              value={form.stock_quantity}
              onChange={handleChange}
              required
              min={0}
              className="w-full border p-3 rounded-lg"
            />
          </div>

          {/* Categories */}
          <div>
            <label className="block mb-1 font-medium">
              Categories
            </label>

            <select
              multiple
              value={form.categories.map(String)}
              onChange={handleCategoryChange}
              className="w-full border p-3 rounded-lg h-28"
            >
              {allCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <p className="text-sm text-gray-500 mt-2">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple categories.
            </p>
          </div>

          {/* Product Image */}
          <div>
            <label className="block mb-1 font-medium">
              Product Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border p-2 rounded-lg"
            />

            <div className="mt-4">
              {imageUrl && (
                <div className="relative w-fit">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-64 h-44 object-cover rounded-xl border"
                  />

                  {form.image && (
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="absolute top-2 right-2 bg-red-500 text-white text-xs px-3 py-1 rounded"
                    >
                      Remove
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition ${
              loading
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </form>
      </div>
    </AdminOnly>
  )
}

export default ProductEditPage