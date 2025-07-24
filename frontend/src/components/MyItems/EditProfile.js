import { useState, useEffect } from "react";
import {Link} from 'react-router-dom';
import Loading from "./Loading";
import axios from 'axios';

export default function EditProfile() {
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsername(response.data.username);
        setBio(response.data.bio);

      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/users/me`,
        { username, bio },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };


  if (loading) {
    return <Loading/>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-1/4 border-r px-6 py-8">
        <div className="flex flex-col space-y-4 font-medium text-black">
          <Link to="/edit-profile" className="text-purple-700 border-l-4 border-purple-700 pl-2">
            Edit Profile
          </Link>
          <Link to="/edit-account" className="hover:text-purple-700 hover:pl-2 transition-all">
            Edit Account
          </Link>
          <button
            onClick={() => {
                localStorage.removeItem('token');
                window.location.href = '/login';
            }}
            className="text-left text-black hover:text-purple-700 hover:pl-2 transition-all"
            >
            Log out
        </button>

        </div>
      </div>

      <div className="flex-1 px-10 py-8">
        <h1 className="text-3xl font-semibold mb-6">Edit Profile</h1>

        <form onSubmit={handleUpdate} className="space-y-6 max-w-lg">
          <div>
            <label className="block font-medium mb-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded px-4 py-2"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows="4"
              className="w-full border rounded px-4 py-2"
              placeholder="Tell others a little bit about yourself"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </form>
      </div>
    </div>
  );
}