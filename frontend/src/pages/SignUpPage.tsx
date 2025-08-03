import { useState } from "react";
import { Link, redirect, useFetcher } from "react-router-dom";
import { toast } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";

// Local import
import { BACKEND_URL } from "../config";

export const signUpAction = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  // converting value to string (only to make ts happy, in js don't need to do that)
  const values = Object.fromEntries(
    Array.from(formData.entries()).map(([key, value]) => [
      key,
      value.toString(),
    ])
  );
  try {
    const res = await fetch(`${BACKEND_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      toast.error(data.message);
      throw new Error(data.error);
    }
    toast.success(data.message);

    // setting {email,password} for autocomplete
    sessionStorage.setItem("email", values.email);
    sessionStorage.setItem("password", values.password);
    return redirect("/signin");
  } catch (error) {
    console.error("Error while reistering user: \n", error);
  }
};

export default function SignUpPage() {
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === "submitting";

  const [showPassword, setShowPassword] = useState(false); // password toggle state
  const [password, setPassword] = useState("");

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="min-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-orange-600 text-2xl md:text-4xl font-bold ">
            Create Account
          </h1>
          <p className="text-sm md:text-lg text-gray-700 mt-1">
            Sign up to get started
          </p>
        </div>
        <fetcher.Form method="post" action="/signup" className="space-y-4">
          {/* Name */}
          <div className="text-sm text-gray-800 font-medium">
            <label htmlFor="name">
              Name<span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              autoComplete="name"
              placeholder="Enter your name"
              required
              title="Name"
              className="mt-1 w-full px-3 py-2 border border-gray-400 rounded-lg shadow-sm focus:bg-orange-50 focus:outline-none focus:border-orange-500"
            />
          </div>
          {/* Email */}
          <div className="text-sm text-gray-800 font-medium">
            <label htmlFor="email">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Enter your email"
              required
              title="Email"
              className="mt-1 w-full px-3 py-2 border border-gray-400 rounded-lg shadow-sm focus:bg-orange-50 focus:outline-none focus:border-orange-500"
            />
          </div>
          {/* Password */}
          <div className="text-gray-800 text-sm font-medium">
            <label htmlFor="password">
              Password<span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="new-password"
                placeholder="Enter your password"
                required
                title="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pr-10 px-3 py-2 border border-gray-400 rounded-lg shadow-sm focus:bg-orange-50 focus:outline-none focus:border-orange-500"
              />
              {password.length > 0 && (
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute inset-y-0 right-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FiEyeOff size={25} /> : <FiEye size={25} />}
                </button>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            title="Sign Up Button"
            className="w-full rounded-2xl font-semibold px-3- py-2 bg-orange-200 hover:bg-orange-300 text-orange-600 border border-orange-500 shadow-sm disabled:opacity-65"
          >
            {!isSubmitting ? "Sign Up" : " Signing Up..."}
          </button>
        </fetcher.Form>
        <div className="text-sm text-gray-600 text-center">
          <Link to="/signin">
            Already have an account?{" "}
            <span className="text-blue-700 font-medium underline">Sign In</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
