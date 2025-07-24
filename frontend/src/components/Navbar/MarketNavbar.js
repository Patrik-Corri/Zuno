import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProfileMenu from '../MyItems/ProfileMenu';
import axios from 'axios';

const MarketNavbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [product, setProduct] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!product.trim()) return;

    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/products/search?title=${encodeURIComponent(product.trim())}`);
      let results;
      if (Array.isArray(response.data)) {
        results = response.data;
      } else if (response.data && typeof response.data === 'object') {
        results = [response.data];
      } else {
        results = [];
      }
      navigate('/market-homepage', {
        state: { results, query: product.trim() },
        replace: false
      });
      
    } catch (err) {
      console.error('Search error:', err);
      navigate('/market-homepage', {
        state: { results: [], query: product.trim() },
        replace: false 
      });
    }
  }

  const clearSearch = () => {
    setProduct('');
    navigate('/market-homepage', { replace: false });
  }


  return (
    <>
      <nav className="flex justify-between bg-brand-cream m-0 mb-8 px-6 p-5">
        <Link to="/market-homepage" className="text-pink-700 font-company text-2xl px-6" onClick={clearSearch}>
          Zuno
        </Link>
        <div className="relative max-w-lg w-[90%]">
          <button
            onClick={handleSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 cursor-pointer hover:opacity-70"
          >
            <img
              src={"/assets/mag-glass.png"}
              alt="Search"
              className="w-5 h-5"
            />
          </button>
          <input
            type="text"
            placeholder="Search for anything"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="border border-gray-300 w-full px-4 py-2 pr-12 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-700"
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <div className="flex items-center gap-6 relative">
          <Link
            to="/post"
            className="block w-[90%] font-company px-4 py-1 bg-pink-700 text-white rounded-md hover:bg-pink-900 transition"
          >
            List Item
          </Link>
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-full border hover:bg-gray-100 overflow-hidden"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </button>
            <div className="absolute right-0 mt-2">
              <ProfileMenu isOpen={profileOpen} setIsOpen={setProfileOpen} />
            </div>
          </div>
          
        </div>
      </nav>
    </>
  );
};

export default MarketNavbar;