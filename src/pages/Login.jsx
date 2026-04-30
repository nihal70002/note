import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const success = await login(email, password);

    if (!success) {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center bg-cream/30 px-5 sm:px-6">

      {/* LOGO */}
      <div className="flex justify-center mb-6">
        <img
          src="/logo.png"
          alt="Papercues logo"
          className="h-28 sm:h-32 w-auto"
        />
      </div>

      {/* TITLE */}
      <div className="text-center mb-6">
        <h2 className="text-3xl sm:text-4xl font-serif text-ink">
          Sign in to your account
        </h2>

        <p className="mt-2 text-sm text-taupe">
          Or{" "}
          <Link
            to="/register"
            className="font-medium text-ink uppercase tracking-widest border-b border-ink/30"
          >
            create a new account
          </Link>
        </p>
      </div>

      {/* LOGIN CARD */}
      <div className="w-full max-w-lg mx-auto bg-paper shadow-lg rounded-xl p-6 sm:p-10">

        <form className="space-y-6" onSubmit={handleSubmit}>

          {error && (
            <div className="text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-taupe">
              Email address
            </label>

            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full border border-taupe/30 px-3 py-4 text-base rounded-md focus:outline-none focus:border-ink bg-transparent"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-taupe">
              Password
            </label>

            <div className="relative mt-2">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-taupe/30 px-3 py-4 text-base rounded-md focus:outline-none focus:border-ink bg-transparent pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-taupe hover:text-ink transition"
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-ink text-paper py-4 text-base rounded-md uppercase tracking-widest hover:bg-ink/90 transition"
          >
            Sign In
          </button>

        </form>

      </div>

    </div>
  );
};

export default Login;