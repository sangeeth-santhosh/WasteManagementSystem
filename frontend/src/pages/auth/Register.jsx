import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import images from "../../assets/assets.js";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await authService.register({ name, email, password });
      navigate("/login");
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <div className="lg:w-4/5 relative text-white overflow-hidden">
        <img
          src={images.waste}
          alt="Waste Management Dashboard Visual"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-6 text-xs opacity-70 z-10">
          &copy; 2024. Made with a commitment to clean cities.
        </div>
      </div>

      <div className="lg:w-1/3 flex flex-col justify-center items-center p-6 md:p-8 bg-white">
        <div className="w-full max-w-xs">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">
            Create Account
          </h2>
          <p className="text-sm text-gray-500 mb-5">
            Enter your details to create a new account
          </p>

          {error && (
            <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 animate-fade-in">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-6 w-6 text-red-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-semibold text-red-800 mb-1">
                    Error
                  </h3>
                  <p className="text-sm text-red-700">{error}</p>
                </div>
                <button
                  onClick={() => setError("")}
                  className="flex-shrink-0 ml-4 text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out text-sm"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out text-sm"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out text-sm"
                required
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 transition duration-150 ease-in-out text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-400 text-white font-semibold rounded-xl shadow-md hover:bg-amber-500 transition duration-300 ease-in-out transform hover:scale-[1.01] text-sm"
            >
              SIGN UP
            </button>
          </form>

          <div className="text-center mt-6">
            <span className="text-sm text-gray-500">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="text-sm text-green-600 font-semibold hover:text-green-700 transition duration-150"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
