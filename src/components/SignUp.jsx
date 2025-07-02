import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../config/supabase";
import "./Login.css";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [telegram, setTelegram] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const handleSignUp = async () => {
    setError(null);
    setLoading(true);

    try {
      // Step 1: Create user account
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      const userId = data?.user?.id;
      if (!userId) {
        setError("Sign-up succeeded, but no user ID returned.");
        return;
      }

      // Step 2: Create user profile
      const { error: profileError } = await supabase
        .schema('fintrack')
        .from('user_profiles')
        .insert([
          {
            id: userId,
            full_name: name,
            telegram_username:telegram,
            default_currency: "INR",
            timezone: "Asia/Kolkata",  
          },
        ]);

      if (profileError) {
        // If profile creation fails, we should ideally clean up the user account
        // but Supabase doesn't allow deleting users from client side
        console.error("Profile creation failed:", profileError);
        setError("Account created but profile setup failed. Please contact support.");
        return;
      }

      // Success - redirect to login
      navigate("/", { 
        state: { message: "Account created successfully! Please log in." }
      });

    } catch (err) {
      console.error("Unexpected error during sign up:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignUp();
    }
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Header */}
        <div className="login-header">
          <h1 className="welcome-title">Create Account</h1>
          <p className="welcome-subtitle">Sign up to get started</p>
        </div>

        {/* SignUp Card */}
        <div className="login-card">
          <div className="login-form">
            {/* Full Name Field */}
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="John Doe"
                className="form-input"
                disabled={loading}
              />
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="john@example.com"
                className="form-input"
                disabled={loading}
              />
            </div>

             {/* Full Name Field */}
            <div className="form-group">
              <label className="form-label">Telegram Username</label>
              <input
                type="text"
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="@John Doe"
                className="form-input"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="••••••••"
                className="form-input"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="error-message" style={{ 
                color: "red", 
                marginBottom: "1rem",
                padding: "0.5rem",
                backgroundColor: "#ffeaea",
                border: "1px solid #ffcdd2",
                borderRadius: "4px"
              }}>
                {error}
              </div>
            )}

            {/* Sign Up Button */}
            <button 
              className="login-button" 
              onClick={handleSignUp}
              disabled={loading}
              style={{
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>
          </div>

          {/* Divider */}
          <div className="divider">
            <span className="divider-text">or</span>
          </div>

          {/* Go to Login Button */}
          <button
            className="create-account-button"
            onClick={() => navigate("/login")}
            disabled={loading}
          >
            Already have an account? Log in
          </button>
        </div>
      </div>
    </div>
  );
}

export default SignUp;