import React, { useContext } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import { useState } from "react";
import Inputs from "../../components/Inputs/Inputs";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { UserContext } from "../../context/userContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    setError("");
    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      console.log("password", password);
      const { token, user } = response.data;
      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };
  return (
    <AuthLayout>
      <div className="lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Welcome back</h3>
        <p className="text-xs text-slate-700mt-[5px] mb-6">
          Please enter your details to login
        </p>

        <form onSubmit={handleSubmit}>
          <Inputs
            type="text"
            placeholder="jone@example.com"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Inputs
            type="password"
            placeholder="Min 8 characters"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            LOGIN{" "}
          </button>
          <p className="text-[13px] text-slate-800 mt-3">
            Don't have an account ?{" "}
            <Link to="/signUp" className="text-primary font-medium underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
