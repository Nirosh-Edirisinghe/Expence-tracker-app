import React, { useRef, useState } from 'react'
import { navbarStyles } from '../assets/dummyStyles'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, User } from "lucide-react";
import logo from '../assets/logo.png'

const Navbar = ({ user: propUser, onLogout }) => {
  const navigate = useNavigate();
  const menuRef = useRef();
  const [menuOpen, setMenuOpen] = useState(false)

  const user = propUser || {
    name: "",
    email: "",
  }

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <header className={navbarStyles.header}>
      <div className={navbarStyles.container}>

        {/* logo */}
        <div onClick={() => navigate("/")} className={navbarStyles.logoContainer}>
          <div className={navbarStyles.logoImage}>
            <img src={logo} alt="logo" />
            
          </div>
          <span className={navbarStyles.logoText}>Expences Tracker</span>
        </div>

        {/* if the user is present */}
        {user && (
          <div className={navbarStyles.userContainer} ref={menuRef}>
            <button onClick={toggleMenu} className={navbarStyles.userButton}>

              <div className='relative'>
                <div className={navbarStyles.userAvatar}>
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div className={navbarStyles.statusIndicator}></div>
              </div>

              <div className={navbarStyles.userTextContainer}>
                <p className={navbarStyles.userName}>{user?.name || "user"}</p>
                <p className={navbarStyles.userEmail}>
                  {user?.email || "user@expencetracker.com"}
                </p>
              </div>

              <ChevronDown className={navbarStyles.chevronIcon(menuOpen)} />
            </button>

            {/* dropdown menu */}
            {menuOpen && (
              <div className={navbarStyles.dropdownMenu}>
                <div className={navbarStyles.dropdownHeader}>
                  <div className='flex items-center gap-3'>

                    <div className={navbarStyles.dropdownAvatar}>
                      {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>

                    <div>
                      <div className={navbarStyles.dropdownName}>
                        {user?.name || "User"}
                      </div>
                      <div className={navbarStyles.dropdownEmail}>
                        {user?.email || "user@expencetracker.com"}
                      </div>
                    </div>

                  </div>
                </div>

                <div className={navbarStyles.menuItemContainer}>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      navigate("/profile")
                    }} className={navbarStyles.menuItem}
                  >
                    <User className='w-4 h-4' />
                    <span>My Profile</span>
                  </button>
                </div>

              </div>
            )}
          </div>
        )}

      </div>

    </header>
  )
}

export default Navbar
