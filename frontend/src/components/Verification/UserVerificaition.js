import { useState } from 'react';

export default function VerifyCode() {
  const [code, setCode] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verificationCode: code }),
      });

      if (!res.ok) throw new Error('Verification failed');
      alert('Your account has been verified! Please log in.');
      window.location = '/login';
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-[80vh] p-4">
      <div className="w-full max-w-md p-8">
        <h2 className="text-4xl text-pink-700 text-center font-semibold mb-6">Verify Your Email</h2>
        <form onSubmit={handleVerify}>
          <input
            type="text"
            maxLength={6}
            pattern="\d{6}"
            className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-md text-center tracking-widest text-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            placeholder="6-digit code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition"
          >
            Verify
          </button>
        </form>
        <div className="text-center mt-4">
          <a href="/login" className="text-pink-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
