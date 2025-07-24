import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

export default function MarketHomepage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const searchResults = location.state?.results;
  const searchQuery = location.state?.query;

 useEffect(() => {
    const fetchProductsAndImages = async () => {
      try {
        setLoading(true);
        let productList;
        if (searchQuery && !searchResults) {
          const searchRes = await axios.get(
            `${process.env.REACT_APP_API_URL}/api/products/search?title=${encodeURIComponent(searchQuery)}`
          );
          productList = searchRes.data;
        } else if (searchResults && searchResults.length > 0) {
          productList = searchResults;
        } else {
          const productRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/products`);
          productList = productRes.data;
        }
        if (!productList || productList.length === 0) {
          setProducts([]);
          setLoading(false);
          return;
        }
        
        const updatedProducts = await Promise.all(
          productList.map(async (product) => {
            try {
              const imageRes = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/product/${product.id}/image`,
                { responseType: "blob" }
              );
              const imageUrl = URL.createObjectURL(imageRes.data);
              return { ...product, imageUrl };
            } catch (err) {
              console.error("Error loading image for product:", product.id, err);
              return { ...product, imageUrl: null };
            }
          })
        );

        setProducts(updatedProducts);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProductsAndImages();
  }, [searchResults, searchQuery]);

  return (
    <div className="min-h-screen relative px-2 sm:px-4">
      <h1 className="text-3xl font-company text-pink-700 font-bold text-center mb-8">
        {searchQuery ? `Search Results for "${searchQuery}"` : 'Marketplace'}
      </h1>
      {searchQuery && products.length === 0 && !loading && (
        <div className="text-center text-gray-600 mt-8">
          <p>No products found for "{searchQuery}"</p>
          <Link
            to="/market-homepage"
            className="text-pink-700 hover:text-pink-900 underline mt-2 inline-block"
          >
            View all products
          </Link>
        </div>
      )}
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-4 justify-items-center">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-full max-w-[250px] p-4 border rounded shadow animate-pulse">
              <div className="w-full h-40 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-4 justify-items-center">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="w-full max-w-[250px] p-4 border rounded shadow hover:shadow-lg transition"
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-cover mb-2"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-2">
                  <span>No Image</span>
                </div>
              )}
              <p className="text-md font-semibold truncate overflow-hidden whitespace-nowrap w-full">{product.title}</p>
              <h3 className="text-md font-semibold">${product.price}</h3>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}