import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Loading from '../MyItems/Loading';

export default function MyListings() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/my-listings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const updatedProducts = await Promise.all(
          res.data.map(async (product) => {
            try {
              const imageRes = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/product/${product.id}/image`,
                { responseType: 'blob' }
              );
              const imageUrl = URL.createObjectURL(imageRes.data);
              return { ...product, imageUrl };
            } catch (err) {
              console.error('Image load error:', product.id, err);
              return { ...product, imageUrl: null };
            }
          })
        );

        setProducts(updatedProducts);
      } catch (err) {
        console.error('Failed to fetch user listings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-company text-pink-700 text-center font-bold mb-4">My Listings</h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-600 text-lg mt-12">No items listed.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 px-4 justify-items-center">
          {products.map((product) => (
            <Link 
              key={product.id}
              to={`/myproduct/${product.id}`}
              className="w-full max-w-[250px] p-4 border rounded shadow hover:shadow-lg transition"
            >
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-40 object-cover mb-2 rounded"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center mb-2 rounded">
                  <span>No Image</span>
                </div>
              )}
              <h2 className="text-xl font-semibold truncate overflow-hidden whitespace-nowrap w-full">{product.title}</h2>
              <p className="text-gray-600">${product.price}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
