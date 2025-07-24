import React, { useEffect, useRef, useState } from "react";
import {Link} from 'react-router-dom';

export default function ProfileMenu({ isOpen, setIsOpen }) {
  const menuRef = useRef();
  const [username, setUsername] = useState("");

  
    useEffect(() => {
      fetchUserProfile();
    }, []);
  
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.ok) {
        const text = await response.text();
        if (text) {
          const user = JSON.parse(text);
          setUsername(user?.username ?? "");
        }
  } else {
    console.error('Non-OK response', response.status);
  }
  
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
  

  useEffect(() => {
    const closeOnClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", closeOnClickOutside);
    return () => {
      document.removeEventListener("mousedown", closeOnClickOutside);
    };
  }, [setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-64 bg-white border rounded-xl shadow-lg z-50 text-sm" ref={menuRef}>
      <div className="p-4 border-b">
        <div></div>
        <div className="font-medium text-gray-800">{username}</div>
        <Link to="/edit-profile" className="text-blue-500 hover:underline text-sm">
          View profile
        </Link>
      </div>

      <div className="py-2 border-b">
        <div className="px-4 py-1 text-gray-400 text-xs">SELLING</div>
        <Link to="/my-listings" className="block px-4 py-2 hover:bg-gray-100">My listings</Link>
        <Link to="/post" className="block px-4 py-2 hover:bg-gray-100">List an item</Link>
      </div>

      <div className="py-2 border-b">
        <div className="px-4 py-1 text-gray-400 text-xs">BUYING</div>
        <button to="/purchases" className="block px-4 py-2 hover:bg-gray-100">My purchases</button>
        <button to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</button>
      </div>

      <div className="py-2">
        <button
         onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }}
        className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600">Log out</button>
      </div>
    </div>
  );
}
