import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const getname = async (userId) => {
  const { data, error } = await supabase
    .schema("fintrack")
    .from("user_profiles")
    .select("full_name")
    .eq("id", userId) // assuming 'id' matches auth user id
    .single(); // expect one result

  if (error) {
    console.error("Error fetching user name:", error);
    return;
  }

  localStorage.setItem("user_name", data.full_name);
};


  const handleLogin = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login failed: " + error.message);
      return;
    }
localStorage.setItem("user_id", data.user.id);
localStorage.setItem("user_mail",data.user.email);
await getname(data.user.id);
navigate("/dashboard");

  } catch (err) {
    console.error("Unexpected login error:", err);
    alert("An unexpected error occurred. Please try again.");
  }
};

  const handleCreateAccount = () => {
    navigate("/signup")
  };


  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Header */}
        <div className="login-header">
          <h1 className="welcome-title">Welcome back</h1>
          <p className="welcome-subtitle">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="login-card">
          <div className="login-form">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="form-input"
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="form-input"
              />
            </div>

            {/* Login Button */}
            <button 
              className="login-button"
              onClick={handleLogin}
            >
              Sign In
            </button>
          </div>

          {/* Divider */}
          <div className="divider">
            <span className="divider-text">or</span>
          </div>

          {/* Create Account Button */}
          <button 
            className="create-account-button"
            onClick={handleCreateAccount}
          >
            Create new account
          </button>
        </div>

      </div>
    </div>
  );
}

export default Login;