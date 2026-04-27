import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full border border-taupe/30 px-3 py-4 text-base rounded-md focus:outline-none focus:border-ink bg-transparent"
            />
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