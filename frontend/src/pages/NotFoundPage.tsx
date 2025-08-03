import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="text-center max-w-max">
        <h1 className="text-6xl font-bold mb-6">404 Page Not Found</h1>
        <p className="mb-6 text-gray-400">
          Oops !!! The page you are looking for does't exist or has been moved.
        </p>
        <Link
          to="/home"
          className="inline-block bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Go To Home
        </Link>
      </div>
    </main>
  );
}
