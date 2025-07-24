import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="max-w-2xl bg-white bg-opacity-90 p-8 rounded-2xl text-center">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to <span className="text-pink-700 font-extrabold">Zuno</span>!
        </h1>
        <p className="text-lg mb-8">
          The ultimate marketplace for students at UNF.
        </p>

        <section className="p-4 mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-pink-600">What is Zuno?</h2>
          <p>
            Zuno is your community marketplace for students. Whether you're trying to buy or sell, Zuno connects you with fellow UNF students.
          </p>
        </section>

        <section className="p-4 mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-pink-600">Who is Zuno for?</h2>
          <p>
            If you’re a student at UNF, Zuno is for you! All you need is your school email to join the marketplace and start connecting with your peers.
          </p>
        </section>

        <section className="p-4 mb-6">
          <h2 className="text-2xl font-semibold mb-2 text-pink-600">How to Join</h2>
          <p className="mb-4">
            Signing up is easy! Click the button below to create your account with your university email and start exploring Zuno today.
          </p>
          <Link to="/signup">
            <button className="px-6 py-3 bg-pink-700 text-white rounded-lg shadow-md hover:bg-pink-900 transition text-lg font-semibold">
              Join the Community
            </button>
          </Link>
        </section>
      </div>
    </div>
  );
}
