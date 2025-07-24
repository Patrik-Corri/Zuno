import { useState } from 'react';
import { Link} from 'react-router-dom';


export default function SignUp() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, password, username}),
      });

      if (!res.ok) throw new Error('Registration failed');
      alert('Registered successfully! Please log in.');
      window.location = '/verify-user';
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4 m-5 mt-8 flex justify-center items-center">
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full mx-auto p-8 rounded-lg text-center"
    >
      <h2 className="text-pink-700 text-4xl pb-2 font-semibold mb-6">Sign Up Now</h2>
      <input
        className="block w-[90%] mx-auto mb-4 px-4 py-2 border border-gray-300 rounded-md"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
      />
      <input
        className="block w-[90%] mx-auto mb-4 px-4 py-2 border border-gray-300 rounded-md"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
      />
      <input
        type="email"
        className="block w-[90%] mx-auto mb-4 px-4 py-2 border border-gray-300 rounded-md"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="username"
        className="block w-[90%] mx-auto mb-4 px-4 py-2 border border-gray-300 rounded-md"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      
      <input
        type="password"
        className="block w-[90%] mx-auto mb-4 px-4 py-2 border border-gray-300 rounded-md"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="block w-[90%] mx-auto  px-6 py-2 bg-pink-700 text-white rounded-md hover:bg-pink-900 transition"
      >
        Sign Up
      </button>
      <div className="mx-auto p-2 " >
        <span>Already have an account? </span>
        <Link to="/login" className="text-pink-700 hover:underline">
        Log in</Link>
      </div>
    </form>
    </div>
  );
}
