// Telegram.jsx
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import "./Telegram.css";
import { supabase } from "../config/supabase";

function Telegram() {
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Calculate QR code size based on screen width
  const getQRSize = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 480) return 180; // Small phones
      if (width < 768) return 200; // Large phones
      return 256; // Tablets and desktop
    }
    return 256; // Default
  };

  const [qrSize, setQrSize] = useState(getQRSize());

  // Update QR size on resize
  useEffect(() => {
    const handleResize = () => {
      setQrSize(getQRSize());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch user profile on load
  useEffect(() => {
    const fetchUserProfile = async () => {
      setIsLoading(true);
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .schema('fintrack')
          .from("user_profiles")
          .select("telegram_username")
          .eq("id", userId)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
        } else if (data) {
          setUsername(data.telegram_username || "");
          setUserId(userId);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    let value = e.target.value;
    
    // Auto-add @ if user doesn't include it
    if (value && !value.startsWith('@')) {
      value = '@' + value;
    }
    
    setUsername(value);
  };

  // Save updated username to Supabase
  const handleSave = async () => {
    if (!username.trim()) {
      alert("Please enter a Telegram username");
      return;
    }

    setIsSaving(true);
    
    try {
      const { error } = await supabase
        .schema('fintrack')
        .from("user_profiles") // Changed from "profiles" to match the fetch query
        .update({ telegram_username: username })
        .eq("id", userId);

      if (error) {
        console.error("Error updating Telegram username:", error);
        alert("Error updating username. Please try again.");
      } else {
        alert("Telegram username updated successfully!");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Error updating username. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    }
  };

  if (isLoading) {
    return (
      <div className="telegram-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="telegram-container">
      <div className="input-section">
        <label htmlFor="telegram">Your Telegram Username</label>
        <input
          id="telegram"
          value={username}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="@your_username"
          disabled={isSaving}
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck="false"
        />
        <button 
          onClick={handleSave} 
          disabled={isSaving || !username.trim()}
          style={{
            opacity: isSaving || !username.trim() ? 0.6 : 1,
            cursor: isSaving || !username.trim() ? 'not-allowed' : 'pointer'
          }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="qr-section">
        <h3>Scan to contact @fintrackautoBot</h3>
        <div className="qr-code-wrapper">
          <QRCode 
            value="https://t.me/fintrackautoBot" 
            size={qrSize}
            style={{
              height: "auto",
              maxWidth: "100%",
              width: "100%"
            }}
            viewBox="0 0 256 256"
          />
        </div>
      </div>
    </div>
  );
}

export default Telegram;