import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const categories = [
  "Men", "Women", "Kids", "Shoes", "Accessories", "Kitchen",
  "Appliances", "Electronics", "Phones", "Computers", "Gaming",
  "Garden", "Outdoor", "Furniture", "Art", "Office Supplies",
  "Books", "Toys", "Health", "Beauty", "Automotive", "Sports",
  "Musical Instruments", "Pet Supplies", "Collectibles", "Tools",
  "Lighting", "Baby", "Storage", "Seasonal Decor", "Jewelry"
];

export default function PostItem() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [images, setImages] = useState([]);
  const [category, setCategory] = useState('');
  const [condition, setCondition] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

   const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).slice(0, 1);
    setImages(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files).slice(0, 1);
    setImages(files);
    e.target.value = '';
  };

  const handleRemoveImage = () => {
    setImages([]);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setPrice(value);
    if (parseFloat(value) < 1) {
      setError('Price must be at least $1');
    } else if (parseFloat(value) > 2000) {
      setError('Price cannot exceed $2000');
    } else {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const product = {
        title,
        description,
        price: parseFloat(price),
        category,
        condition
      };

      const formData = new FormData();
      formData.append('product', new Blob([JSON.stringify(product)], { type: 'application/json' }));
      if (images.length > 0) {
        formData.append('images', images[0]);
      }

      const token = localStorage.getItem('token');

      await axios.post(`${process.env.REACT_APP_API_URL}/api/create`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      alert('Item listed successfully!');
      navigate('/market-homepage');
    } catch (err) {
      console.error('Error creating listing:', err);
      setError(err?.response?.data || 'Failed to create listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen m-0 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="max-w-[70%] w-full mx-auto mt-12 p-8 flex flex-col gap-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div
          className="w-full h-60 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center text-gray-600 hover:border-pink-500 transition cursor-pointer"
          onClick={() => document.getElementById('fileInput').click()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 mb-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 15a4 4 0 014-4h14M7 10V6a4 4 0 118 0v4m-4 4v6"
            />
          </svg>
          <p className="font-semibold">Add up to 1 photo</p>
          <p className="text-sm text-gray-400">Or drag and drop</p>
          <input
            id="fileInput"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={URL.createObjectURL(img)}
                alt="preview"
                className="h-20 w-20 object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold">Product Info</h3>

        <div>
          <p className="text-sm py-1">Title</p>
          <input
            type="text"
            placeholder="What are you selling?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            required
          />
        </div>

        <div>
          <p className="text-sm py-1">Description</p>
          <textarea
            placeholder="Describe your item"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            required
          />
        </div>

        <div>
          <p className="text-sm py-1">Category</p>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-gray-300 px-4 py-2 rounded-md w-full"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <p className="text-sm px-1">Condition</p>
          <div className="flex gap-6 px-1">
            {['New', 'Used', 'Poor'].map((cond) => (
              <label key={cond} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="condition"
                  value={cond}
                  checked={condition === cond}
                  onChange={(e) => setCondition(e.target.value)}
                  required
                />
                {cond}
              </label>
            ))}
          </div>
        </div>

        <div className="relative w-full">
          <p className="text-sm px-1">Price</p>
          <span className="absolute inset-y-0 top-7 left-0 pl-3 items-center text-gray-500">$</span>
          <input
            type="number"
            placeholder="0.00"
            value={price}
            onChange={handleChange}
            className="pl-8 pr-20 py-2 border border-gray-300 rounded-md w-full"
            min="1"
            max="2000"
            step="0.01"
            required
          />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-gray-400 text-sm px-1">(min $1/max $2000)</span>
          {error && <p className="text-red-500 text-sm px-1">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-pink-700 text-white px-6 py-2 rounded-md hover:bg-pink-900 transition disabled:bg-gray-400"
        >
          {loading ? 'Posting...' : 'Post Item'}
        </button>
        <div className="spacing mb-8"></div>
      </form>
    </div>
  );
}