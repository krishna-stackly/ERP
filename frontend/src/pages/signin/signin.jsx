import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import ApiClient from "../../network/api-client";
import { login } from "../../redux/authSlice";
import "./signin.css";
import siteLogo from "../../assets/signin/sitelogo.png";
import EyeToggle from "../../components/reuseComponents";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, { message: "Please enter a valid Password" }),
});

export default function Signin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const showErrorToast = (msg) => {
    if (toast.isActive("login-error")) {
      toast.update("login-error", { render: msg, type: "error", autoClose: 7000 });
    } else {
      toast.error(msg, { toastId: "login-error", autoClose: 7000 });
    }
  };

  const onSubmit = async (values) => {
    setLoading(true);
    setServerError("");
    try {
      const response = await ApiClient.post("/login/", {
        email: values.email,
        password: values.password,
      });

      const data = response.data;

      if (data?.token) {
        const cleanToken = data.token.replace(/^token\s+/i, "");

        localStorage.setItem("token", cleanToken);
        localStorage.setItem("user", JSON.stringify(data.user || { email: values.email }));

        ApiClient.defaults.headers.common["Authorization"] = `Token ${cleanToken}`;

        dispatch(login({ user: data.user || { email: values.email } }));

          reset();

          // Give the toast time to render before unmounting
          setTimeout(() => {
            navigate("/dashboard", { replace: true, state: { justLoggedIn: true } });
       }, 300);
      } else if (data?.error) {
        setServerError(data.error);
        showErrorToast(data.error);
      } else {
        setServerError("Invalid email or password");
        showErrorToast("Invalid email or password");
      }
    } catch (error) {
      const backendMsg =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        null;

      const msg =
        backendMsg ||
        (error?.response?.status === 400 || error?.response?.status === 401
          ? "Invalid email or password"
          : "Something went wrong. Please try again later.");

      setServerError(msg);
      showErrorToast(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page">
      <div className="signin-img">
        <img src={siteLogo} alt="Site Logo" />
        <p>Think the design, design the thinking</p>
      </div>

      <div className="signin-form">
        <div className="signin-cointained">
          <div className="welcome">Sign In</div>
          <p>Welcome back! Let's make work smarter, not harder.</p>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="input-wrapper">
              <div className={`username-cointainer ${errors.email ? "input-error" : ""}`}>
                <input
                  type="email"
                  placeholder="Email"
                  className="username"
                  {...register("email")}
                />
              </div>
              {errors.email && <p className="error-text">{errors.email.message}</p>}
            </div>

            <div className="input-wrapper">
              <div className={`password-cointainer ${errors.password && !errors.email ? "input-error" : ""}`}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="password"
                  {...register("password")}
                  onCopy={(e) => e.preventDefault()}
                  onCut={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                />
                <EyeToggle
                  show={showPassword}
                  onToggle={() => setShowPassword(!showPassword)}
                />
              </div>
              {errors.password && !errors.email && (
                <p className="error-text">{errors.password.message}</p>
              )}
            </div>

            {serverError && (
              <p className="error-text server-error">{serverError}</p>
            )}

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}