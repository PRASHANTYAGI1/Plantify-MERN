import React, { useState } from "react";
import {
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { registerUser } from "../api/authapi";
import AuthLayout from "../Components/AuthLayout";

const Signup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    const payload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    setLoading(true);
    try {
      await registerUser(payload);
      toast.success("Registered successfully!");
      navigate("/login");
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Registration failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout className="animate-fadeIn page-fade">
      <Toaster />

      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white p-12 rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center mb-10">Sign up</h2>

        {/* Role Selector (UI only, logical value always 'user') */}
        <FormControl component="fieldset" className="mb-8 w-full">
          <FormLabel component="legend" className="mb-3 text-gray-700">
            Select Account Type
          </FormLabel>

          <RadioGroup
            row
            value="user"          // Always selected
            onChange={() => {}}   // Disabled
            className="gap-4"
          >
            {/* ACTIVE USER OPTION */}
            <FormControlLabel
              value="user"
              control={<Radio />}
              label="User"
            />

            {/* ADMIN OPTION - disabled visually + functionally */}
            <FormControlLabel
              value="admin"
              control={<Radio disabled />}
              label={
                <span className="opacity-40 cursor-not-allowed">
                  Admin
                </span>
              }
              className="opacity-40 pointer-events-none"
            />
          </RadioGroup>
        </FormControl>

        {/* Name */}
        <div className="mb-8">
          <TextField
            label="Name"
            fullWidth
            variant="standard"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        {/* Email */}
        <div className="mb-8">
          <TextField
            label="Email"
            fullWidth
            variant="standard"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>

        {/* Password */}
        <div className="mb-10">
          <TextField
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
        </div>

        {/* Button */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          className="bg-teal-700 hover:bg-teal-800 mb-6 py-3"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Create an Account"}
        </Button>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <span
            className="text-teal-700 cursor-pointer font-semibold hover:underline"
            onClick={() => navigate("/login")}
          >
            Sign In
          </span>
        </p>
      </form>
    </AuthLayout>
  );
};

export default Signup;
