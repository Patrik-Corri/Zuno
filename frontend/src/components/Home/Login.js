import { useState } from 'react';
import { Link, } from 'react-router-dom';
import Loading from '../MyItems/Loading';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const error = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) throw new Error('Login failed');

    const data = await res.json();
    const token = data.token;

    if (!token) throw new Error('Token not found in response');

    localStorage.setItem('token', token);
    window.location = '/market-homepage';
  } catch (err) {
    alert(err.message);
  }finally {
    setLoading(false);
  }
};

if (loading) {
    return <Loading />;
  }


  return (
    <div className=" p-4 m-5 mt-8 flex justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="max-w-md w-full mx-auto mt-12 p-8 flex flex-col gap-1"
      >
        <h2 className="text-center text-pink-700 text-4xl p-4 font-semibold mx-auto">
          Log In
        </h2>

        <input
          className="block w-[90%] mx-auto px-4 py-2 mb-4 border border-gray-300 rounded-md"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="block w-[90%] mx-auto px-4 py-2 mb-4 border border-gray-300 rounded-md"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <Link to="/forgot-password" className="p-2 px-5 text-pink-700 hover:underline">
          Forgot Password?
        </Link>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          className="text-center block w-[90%] mx-auto px-6 py-2 bg-pink-700 text-white rounded-md hover:bg-pink-900 transition"
        >
          Log In
        </button>

        <div className="text-center mx-auto p-2">
          <span>Don't have an account? </span>
          <Link to="/signup" className="text-pink-700 hover:underline">
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
}
