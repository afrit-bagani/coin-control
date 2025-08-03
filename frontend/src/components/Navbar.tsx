import { Link, NavLink, redirect } from "react-router-dom";
import { TiThMenu } from "react-icons/ti";
import { useContext } from "react";
import { Context } from "../context/ContextProvider";

export default function Navbar() {
  const { user, logout } = useContext(Context);
  function handleLogout() {
    logout();
    redirect("/signin");
  }
  return (
    <nav className="flex justify-between items-center bg-blue-500 px-6 py-2">
      {/* Segement 1 */}
      <div className="flex justify-center items-center gap-4">
        <Link
          to="/"
          className="rounded-lg font-medium md: flex justify-center items-center gap-1"
        >
          <img src="/logo.png" width={40} />
          <span className="hidden md:inline-block">Coin Control</span>
        </Link>
        {user && (
          <NavLink
            to="/home"
            className="hidden md:inline-block px-3 py-1.5 bg-blue-300 text-black font-bold rounded-lg shadow-sm border border-black hover:bg-blue-400"
          >
            Home
          </NavLink>
        )}
      </div>
      {/* Segement 2 */}
      {!user ? (
        <div className="hidden md:flex gap-2">
          <NavLink
            to="/signup"
            className="bg-blue-200 rounded-lg font-medium px-3 py-1.5  text-blue-900 border-2 border-blue-900"
          >
            Sign Up
          </NavLink>
          <NavLink
            to="/signin"
            className="bg-blue-700 rounded-lg font-medium px-3 py-1.5 text-black"
          >
            Log In
          </NavLink>
        </div>
      ) : (
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-black bg-blue-100 border border-black rounded-lg font-medium hover:bg-blue-300"
        >
          Log Out
        </button>
      )}

      <TiThMenu width={40} className="md:hidden inline-block" />
    </nav>
  );
}
