import React, { useEffect, useState } from 'react';
import './Profile.css';
import { supabase } from '../config/supabase';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    avatar_url: '',
    telegram_username: '',
    default_currency: ''
  });

  // Predefined avatar options
  const avatarOptions = [
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face'
  ];

  const fetchProfile = async () => {
    const user_id = localStorage.getItem("user_id");

    const { data, error } = await supabase
      .schema('fintrack')
      .from('user_profiles')
      .select('*')
      .eq('id', user_id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    } else {
      setProfile(data);
      setFormData({
        avatar_url: data.avatar_url || '',
        telegram_username: data.telegram_username || '',
        default_currency: data.default_currency || ''
      });
    }
  };

  const updateProfile = async () => {
    const user_id = localStorage.getItem("user_id");

    const { error } = await supabase
      .schema('fintrack')
      .from('user_profiles')
      .update({
        avatar_url: formData.avatar_url,
        telegram_username: formData.telegram_username,
        default_currency: formData.default_currency
      })
      .eq('id', user_id);

    if (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    } else {
      alert("Profile updated successfully!");
      fetchProfile(); // Refresh view
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatarUrl) => {
    setFormData(prev => ({ ...prev, avatar_url: avatarUrl }));
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const user_mail = localStorage.getItem("user_mail")

  if (!profile) return <div>Loading...</div>;

  return (
    <div className="profile-container">
      {/* Current Avatar Display */}
      <div className="current-avatar-section">
        {formData.avatar_url ? (
          <img src={formData.avatar_url} alt="Avatar" className="profile-avatar" />
        ) : (
          <div className="profile-avatar-placeholder">
            👤
          </div>
        )}
        <h2>{profile.full_name}</h2>
        <p><strong>Email:</strong> {user_mail}</p>
      </div>

      {/* Avatar Selection */}
      <div className="avatar-selection-section">
        <h3>Choose Your Avatar</h3>
        <div className="avatar-grid">
          {avatarOptions.map((avatarUrl, index) => (
            <div
              key={index}
              className={`avatar-option ${formData.avatar_url === avatarUrl ? 'selected' : ''}`}
              onClick={() => handleAvatarSelect(avatarUrl)}
            >
              <img src={avatarUrl} alt={`Avatar option ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Profile Form */}
      <div className="profile-form">
        <label>Telegram Username:</label>
        <input
          type="text"
          name="telegram_username"
          value={formData.telegram_username}
          onChange={handleChange}
          placeholder="@username"
        />

        <label>Default Currency:</label>
        <select
          name="default_currency"
          value={formData.default_currency}
          onChange={handleChange}
        >
          <option value="">Select Currency</option>
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="INR">INR - Indian Rupee</option>
          <option value="JPY">JPY - Japanese Yen</option>
          <option value="CAD">CAD - Canadian Dollar</option>
          <option value="AUD">AUD - Australian Dollar</option>
        </select>



        <button onClick={updateProfile} className="save-button">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Profile;