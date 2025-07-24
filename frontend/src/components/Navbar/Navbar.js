import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-brand-cream m-0 mb-8 px-6 py-5">
      <Link to="/" className="text-pink-700 font-company text-2xl px-8">Zuno</Link>

      <div className="flex items-center space-x-7 px-8">
        <Link to="/signup" className="text-pink-700 font-company text-lg">Sign Up</Link>
        <Link to="/login" className="text-pink-700 font-company  text-lg">Log In</Link>
      </div>
    </nav>
  );
}
