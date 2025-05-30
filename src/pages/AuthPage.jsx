import { useState } from "react";
import AuthService from "@/services/authServices.js";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import UserStore from "@/store/userStore";
import { useNavigate } from "react-router-dom";


const AuthPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const setUser = UserStore((state) => state.setUser);
  const navigate = useNavigate();


  useEffect(() => {

    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleButton"),
        { theme: "outline", size: "large" }
      );
    }
  }, []);

  const handleCredentialResponse = async (response) => {
    try {
      const res = await AuthService.googleLogin({ credential: response.credential });
  
      setUser({ user: res.data.user, token: res.data.token });
  
      console.log("Logged in via Google:", res.data);
  
      navigate("/home");
      // TODO: redirect or set state as needed
    } catch (error) {
      console.error("Google login failed:", error);
      setError("Google login failed. Please try again.");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = isLogin
        ? await AuthService.login(form)
        : await AuthService.register(form);


      setUser({ user: res.data.user, token: res.data.token });
      console.log("Success:", res.data);
      navigate("/home");
      
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

        <Input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="mb-4"
          required
        />

        <Input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="mb-4"
          required
        />

        <Button type="submit" className="w-full mb-2 bg-black text-white hover:bg-zinc-800">
          {isLogin ? "Login" : "Create Account"}
        </Button>

        <div className="flex items-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <div id="googleButton" className="w-full mb-4"></div>

        <p className="text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
};

export default AuthPage;
