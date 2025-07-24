import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import Loading from "./Loading";

export default function EditAccount() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");


  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });

        setEmail(response.data.email);
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
      if (newPassword !== confirmPassword) {
        alert("New passwords do not match!");
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.put(`${process.env.REACT_APP_API_URL}/users/update-password`,
          {
            currentPassword,
            newPassword,
            confirmPassword,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          alert("Password updated successfully!");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }
      } catch (error) {
        console.error("Error updating profile:", error);
        alert("Failed to update password: " + (error.response?.data || "Unknown error"));
      } finally {
        setLoading(false);
      }
    };



  if (loading) {
    return <Loading />;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-1/4 border-r px-6 py-8">
        <div className="flex flex-col space-y-4 font-medium text-black">
          <Link to="/edit-profile" className="hover:text-purple-700 hover:pl-2 transition-all">
            Edit Profile
          </Link>
          <Link to="/edit-account" className="text-purple-700 border-l-4 border-purple-700 pl-2">
            Edit Account
          </Link>
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="text-left text-black hover:text-purple-700 hover:pl-2 transition-all"
          >
            Log out
          </button>
        </div>
      </div>

      <div className="flex-1 px-10 py-8">
        <h1 className="text-3xl font-semibold mb-6">Edit Account</h1>

        <form onSubmit={handleUpdate} className="space-y-6 max-w-lg">
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="text"
              value={email}
              disabled
              className="w-full border rounded px-4 py-2 bg-gray-100 text-gray-600"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Current password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full border rounded px-4 py-2"
              placeholder="Enter your current password"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">New password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border rounded px-4 py-2"
              placeholder="Enter new password"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border rounded px-4 py-2"
              placeholder="Confirm your new password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              !currentPassword ||
              !newPassword ||
              !confirmPassword ||
              newPassword !== confirmPassword
            }
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded font-semibold disabled:opacity-50"
          >
            {loading ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
