import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Loading from './Loading';

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/${id}`);
        setProduct(res.data);

        const imgRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/product/${id}/image`, {
          responseType: 'blob',
        });
        setImageUrl(URL.createObjectURL(imgRes.data));
      } catch (err) {
        console.error('Error fetching product details:', err);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <Loading/>;

 return (
  <div className="flex justify-center py-10 px-4 m-5">
    <div className="flex flex-col lg:flex-row gap-12 justify-center w-full max-w-[1400px]">
      <div className="w-full lg:w-[700px]">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-[500px] object-contain rounded"
        />
      </div>
      <div className="flex-1 space-y-4 max-w-xl">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <div className="text-2xl font-semibold">${product.price}</div>
        <p className="text-sm text-gray-600">
          Condition: <span className="font-medium">{product.condition}</span>
        </p>
        <p className="text-sm text-gray-600">
          Category: <span className="font-medium">{product.category}</span>
        </p>
        <p className="text-gray-700 break-words whitespace-pre-wrap">{product.description}</p>
        <p className="text-sm text-gray-600">
          Seller: <span className="font-semibold">{product.username}</span>
        </p>

        <div className="flex gap-4 pt-4">
          <button className="border border-gray-400 px-5 py-2 rounded hover:bg-gray-100">
            Offer
          </button>
        </div>
      </div>
    </div>
  </div>
);

}
