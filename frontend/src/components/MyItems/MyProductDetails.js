import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';

const categories = [
  "Men", "Women", "Kids", "Shoes", "Accessories", "Kitchen",
  "Appliances", "Electronics", "Phones", "Computers", "Gaming",
  "Garden", "Outdoor", "Furniture", "Art", "Office Supplies",
  "Books", "Toys", "Health", "Beauty", "Automotive", "Sports",
  "Musical Instruments", "Pet Supplies", "Collectibles", "Tools",
  "Lighting", "Baby", "Storage", "Seasonal Decor", "Jewelry"
];

export default function MyProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    condition: '',
  });
  const [images, setImages] = useState([]);
  const [existingImageUrl, setExistingImageUrl] = useState('');

  
  const fetchProduct = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const productData = res.data;
      setProduct(productData);
      setForm({
        title: productData.title,
        description: productData.description,
        price: productData.price,
        category: productData.category,
        condition: productData.condition,
      });

      const imgRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/${id}/image`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });

      setExistingImageUrl(URL.createObjectURL(imgRes.data));
    } catch (err) {
      console.error('Failed to fetch product:', err);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [id, fetchProduct]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const productData = {
        ...form,
        price: parseFloat(form.price),
      };

      const formData = new FormData();
      formData.append('product', new Blob([JSON.stringify(productData)], { type: 'application/json' }));
      images.forEach((img) => formData.append('images', img));

      await axios.put(`${process.env.REACT_APP_API_URL}/api/product/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Product updated successfully');
      fetchProduct();
      navigate('/my-listings')
    } catch (err) {
      console.error('Failed to update:', err);
      alert('Failed to update product');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate('/my-listings');
    } catch (err) {
      console.error('Failed to delete:', err);
      alert('Failed to delete product');
    }
  };

   if (!product) return <Loading />;

  return (
  <div className="min-h-screen bg-white px-6 py-10">
    <h1 className="text-3xl font-company text-pink-700 text-center mb-10">Edit Product</h1>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[1400px] mx-auto">
      
      {existingImageUrl && (
        <div className="w-full flex items-start justify-center">
          <img
            src={existingImageUrl}
            alt={product.title}
            className="w-full max-w-[600px] h-auto object-contain rounded-lg shadow "
          />
        </div>
      )}

      <div className="w-full space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-1">Title *</label>
          <input
            name="title"
            value={form.title}
            onChange={handleInputChange}
            required
            className="w-full border border-gray-300 p-3 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Description *</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleInputChange}
            required
            rows="4"
            className="w-full border border-gray-300 p-3 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Category *</label>
          <select
            name="category"
            value={form.category}
            onChange={handleInputChange}
            className="w-full border border-gray-300 p-3 rounded"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Condition *</label>
          <div className="flex gap-6">
            {['New', 'Used', 'Poor'].map((cond) => (
              <label key={cond} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="condition"
                  value={cond}
                  checked={form.condition === cond}
                  onChange={handleInputChange}
                  required
                />
                <span>{cond}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1">Price *</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleInputChange}
            min="1"
            max="2000"
            required
            className="w-full border border-gray-300 p-3 rounded"
          />
        </div>
        <div>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="hidden"
            id="fileUpload"
          />
          <label
            htmlFor="fileUpload"
            className="inline-block px-4 py-2 bg-pink-700 text-white text-sm rounded cursor-pointer hover:bg-pink-800 transition"
          >
            Upload Photo
          </label>
        </div>
        {images.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {images.map((img, i) => (
              <div key={i} className="relative">
                <img
                  src={URL.createObjectURL(img)}
                  className="w-20 h-20 object-cover rounded border"
                  alt="preview"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute -top-2 -right-2 w-5 h-5 text-xs bg-red-600 text-white rounded-full flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow"
          >
            Save
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded shadow"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
);
}
