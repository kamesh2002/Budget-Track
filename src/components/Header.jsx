import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Menu, 
  X,
  BarChart3,
  CreditCard,
  MessageSquare,
  FileText
} from 'lucide-react';
import './Header.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../config/supabase';

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const name = localStorage.getItem("user_name");
  const mail = localStorage.getItem("user_mail");
  const user_id = localStorage.getItem("user_id");
  const navigate = useNavigate();
  const location = useLocation();

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/transactions', label: 'Transactions', icon: CreditCard },
    { path: '/telegram', label: 'Telegram', icon: MessageSquare },
    { path: '/reports', label: 'Reports', icon: FileText }
  ];

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
    closeMobileMenu();
  };

  const handleSettingsClick = () => {
    setIsDropdownOpen(false);
    closeMobileMenu();
  };

  const handleLogoutClick = () => {
    setIsDropdownOpen(false);
    closeMobileMenu();
    // Add your logout logic here
  };

  const handleNavClick = (path) => {
    navigate(path);
    closeMobileMenu();
  };

  const fetchProfileUrl = async () => {
    try {
      const { data, error } = await supabase
        .schema('fintrack')
        .from('user_profiles')
        .select('avatar_url')
        .eq('id', user_id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
      } else {
        setAvatarUrl(data.avatar_url);
      }
    } catch (err) {
      console.error("Unexpected error fetching profile:", err);
    }
  };

  useEffect(() => {
    if (user_id) {
      fetchProfileUrl();
    }
  }, [user_id]);

  useEffect(() => {
    // Close mobile menu when clicking outside
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-nav-menu') && !event.target.closest('.mobile-menu-button')) {
        closeMobileMenu();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="header">
        <div className="header-container">
          <div className="header-left">
            <button 
              className="mobile-menu-button" 
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              <Menu size={20} />
            </button>
            <div className="logo">
              <div className="logo-icon">≡</div>
              <span className="logo-text">FinTrack</span>
            </div>
          </div>

          <nav className="header-nav">
            {navigationItems.map((item) => (
              <a 
                key={item.path}
                href={item.path} 
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="header-right">
            <div className="notification-icon">
              <Bell size={20} />
            </div>
            <div className="user-dropdown">
              <div className="user-avatar-container" onClick={toggleDropdown}>
                <div className="user-avatar">
                  <img
                    src={avatarUrl || "https://via.placeholder.com/40"}
                    alt="User Avatar"
                  />
                </div>
                <ChevronDown size={16} className={`dropdown-chevron ${isDropdownOpen ? 'rotated' : ''}`} />
              </div>

              {isDropdownOpen && (
                <div className="dropdown-menu">
                  <div className="dropdown-header">
                    <div className="dropdown-user-info">
                      <div className="dropdown-avatar">
                        <img
                          src={avatarUrl || "https://via.placeholder.com/40"}
                          alt="User Avatar"
                        />
                      </div>
                      <div className="dropdown-user-details">
                        <span className="user-name">{name}</span>
                        <span className="user-email">{mail}</span>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-divider"></div>
                  <div className="dropdown-items">
                    <button className="dropdown-item" onClick={handleProfileClick}>
                      <User size={16} />
                      <span>Profile</span>
                    </button>
                    <button className="dropdown-item" onClick={handleSettingsClick}>
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout" onClick={handleLogoutClick}>
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-nav-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      />

      {/* Mobile Navigation Menu */}
      <div className={`mobile-nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-nav-header">
          <div className="mobile-nav-logo">
            <div className="mobile-nav-logo-icon">≡</div>
            <span>FinTrack</span>
          </div>
          <button 
            className="mobile-nav-close" 
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mobile-nav-links">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.path}
                className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleNavClick(item.path)}
              >
                <IconComponent size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="mobile-nav-user-section">
          <div className="mobile-nav-user-info">
            <div className="mobile-nav-avatar">
              <img
                src={avatarUrl || "https://via.placeholder.com/40"}
                alt="User Avatar"
              />
            </div>
            <div className="mobile-nav-user-details">
              <span className="mobile-nav-user-name">{name}</span>
              <span className="mobile-nav-user-email">{mail}</span>
            </div>
          </div>

          <div className="mobile-nav-actions">
            <button className="mobile-nav-action" onClick={handleProfileClick}>
              <User size={14} />
              <span>Profile</span>
            </button>
            <button className="mobile-nav-action" onClick={handleSettingsClick}>
              <Settings size={14} />
              <span>Settings</span>
            </button>
            <button className="mobile-nav-action logout" onClick={handleLogoutClick}>
              <LogOut size={14} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;