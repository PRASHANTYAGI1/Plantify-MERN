import React, { useState, useContext } from "react";
import { TextField, Button, InputAdornment, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import toast, { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../api/authapi";
import AuthLayout from "../Components/AuthLayout";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Email and password required");
      return;
    }

    setLoading(true);

    try {
      const res = await loginUser(formData); // { user, token }

      // FIXED: AuthContext expects ONE OBJECT
      login(res);

      toast.success("Logged in successfully!");
      navigate("/home");
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to login, please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout className="animate-fadeIn page-fade">
      <Toaster />

      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-12 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-2">Welcome Back</h2>
        <p className="text-center text-gray-500 mb-10">
          Enter your email and password to login
        </p>

        {/* Email */}
        <div className="mb-8">
          <TextField
            label="Email Address"
            fullWidth
            variant="standard"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaEnvelope className="text-gray-400" />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* Password */}
        <div className="mb-10">
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="standard"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FaLock className="text-gray-400" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <IoEyeOffOutline className="text-gray-500" />
                    ) : (
                      <IoEyeOutline className="text-gray-500" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </div>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          className="bg-teal-700 hover:bg-teal-800 mb-6 py-3"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-center text-sm mt-6">
          New user?{" "}
          <span
            className="text-teal-700 cursor-pointer font-semibold hover:underline"
            onClick={() => navigate("/signup")}
          >
            Create an account
          </span>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Login;
