import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <>
      <div
        className="w-full h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('/landing-page.jpg')` }}
      >
        <div className="h-screen flex flex-col justify-center items-center text-black ">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Take Control of Your Budget Effortlessly
          </h1>
          <p className="text-lg md:text-2xl font-medium max-w-4xl mb-4">
            Our expense tracker app simplifies budgeting, allowing you to
            allocate expense and track your spending with ease. Experience
            financial clarity and make informed decisions with every
            transaction.
          </p>
          <Link
            to={"signup"}
            className="bg-gray-300 font-medium rounded-lg px-6 py-2 border-2 border-black hover:bg-gray-400 transition-all hover:text-red-800"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </>
  );
}
