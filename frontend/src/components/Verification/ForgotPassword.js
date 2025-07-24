import { useState } from 'react';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      if (res.ok) {
        alert('Password reset code has been sent to your email.');
        window.location.href = '/reset-password';
      } else {
        throw new Error('Failed to send reset code');
      }
    } catch (err) {
      alert('Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-[80vh] p-4">
      <div className="w-full max-w-md p-8"> 
        <h2 className="text-4xl text-pink-700 text-center font-semibold mb-6">Forgot Password?</h2>
        <div>
          <input
            className="block w-full mb-4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="w-full bg-pink-600 text-white py-2 rounded-md hover:bg-pink-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Code'}
          </button>
        </div>
        <div className="text-center mt-4">
          <a href="/login" className="text-pink-600 hover:underline">
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;