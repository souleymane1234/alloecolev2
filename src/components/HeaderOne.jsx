import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { checkAuthStatus, logout } from '../helper/auth';

// Icons
import HomeIcon from '@mui/icons-material/Home';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import LoginIcon from '@mui/icons-material/Login';
import LiveTvIcon from '@mui/icons-material/LiveTv';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SchoolIcon from '@mui/icons-material/School';
import ExploreIcon from '@mui/icons-material/Explore';
import BusinessIcon from '@mui/icons-material/Business';
import PersonIcon from '@mui/icons-material/Person';
import CloseIcon from '@mui/icons-material/Close';

const HeaderOne = () => {
  const location = useLocation();
  const [scroll, setScroll] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Vérifie et rafraîchit automatiquement le token
  useEffect(() => {
    const verifyAuth = async () => {
      const status = await checkAuthStatus();
      setIsAuthenticated(status);
    };
    verifyAuth();

    // Recheck toutes les 5 minutes
    const interval = setInterval(verifyAuth, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    window.onscroll = () => {
      if (window.pageYOffset < 10) {
        setScroll(false);
      } else if (window.pageYOffset > 10) {
        setScroll(true);
      }
      return () => (window.onscroll = null);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
    if (!isMenuActive) {
      document.body.classList.add("scroll-hide-sm");
    } else {
      document.body.classList.remove("scroll-hide-sm");
    }
  };

  const closeMenu = () => {
    setIsMenuActive(false);
    document.body.classList.remove("scroll-hide-sm");
  };

  const handleSubmenuClick = (index) => {
    setActiveSubmenu((prevIndex) => (prevIndex === index ? null : index));
  };

  const menuItems = [
    // { 
    //   href: "/", 
    //   label: "Accueil",
    //   icon: HomeIcon
    // },
    {
      label: "Études",
      icon: SchoolIcon,
      links: [
        { href: "/bourses", label: "Bourses d'étude" },
        { href: "/etudes-etranger", label: "Études à l'étranger" },
        { href: "/permutation", label: "Permutations" },
      ],
    },
    {
      label: "Orientation",
      icon: ExploreIcon,
      links: [
        { href: "/questionnaires-interactifs", label: "Questionnaires Intéractifs" },
        { href: "/fiches-metiers", label: "Fiches Métiers" },
      ],
    },
    { 
      href: "/schools", 
      label: "Écoles",
      icon: BusinessIcon
    },
    { 
      href: "/webtv", 
      label: "WebTV",
      icon: LiveTvIcon
    },
    {
      label: "Play",
      icon: LiveTvIcon,
      links: [
        { href: "/quiz", label: "Quiz" },
        { href: "/emissions-telerealite", label: "Émissions de téléréalités" },
        { href: "/toon", label: "Toon" },
        { href: "/magazine", label: "Magazine" },
      ],
    },
  ];

  return (
    <>
      <style>{`
        /* Header LinkedIn Style */
        .header-linkedin {
          background: #fff;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          position: sticky;
          top: 0;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .header-linkedin.scrolled {
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08), 
                      0 2px 4px rgba(0, 0, 0, 0.08);
        }

        .header-container {
          max-width: 1128px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 52px;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .header-logo {
          display: flex;
          align-items: center;
          margin-right: 8px;
        }

        .header-logo img {
          height: 44px;
          width: auto;
        }

        .header-search {
          position: relative;
          max-width: 280px;
          flex: 1;
        }

        .header-search input {
          width: 100%;
          height: 34px;
          padding: 0 8px 0 38px;
          border: none;
          background: #eef3f8;
          border-radius: 4px;
          font-size: 14px;
          color: rgba(0, 0, 0, 0.9);
          transition: background 0.2s ease;
        }

        .header-search input:focus {
          background: #e0e7ed;
          outline: none;
        }

        .header-search input::placeholder {
          color: rgba(0, 0, 0, 0.6);
        }

        .search-icon {
          position: absolute;
          left: 8px;
          top: 50%;
          transform: translateY(-50%);
          color: rgba(0, 0, 0, 0.6);
          font-size: 20px;
          pointer-events: none;
        }

        .header-nav {
          display: flex;
          align-items: center;
          gap: 4px;
          flex: 1;
          justify-content: flex-end;
        }

        .nav-item {
          position: relative;
        }

        .nav-link {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 0 12px;
          height: 52px;
          justify-content: center;
          text-decoration: none;
          color: rgba(0, 0, 0, 0.6);
          transition: color 0.2s ease;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          min-width: 100px;
        }

        .nav-link:hover {
          color: rgba(0, 0, 0, 0.9);
        }

        .nav-link.active {
          color: rgba(0, 0, 0, 0.9);
          border-bottom-color: rgba(0, 0, 0, 0.9);
        }

        .nav-icon {
          font-size: 20px;
          margin-bottom: 2px;
        }

        .nav-label {
          font-size: 12px;
          font-weight: 400;
          line-height: 1;
        }

        .nav-dropdown {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          border-radius: 8px;
          box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08),
                      0 2px 8px rgba(0, 0, 0, 0.15);
          padding: 8px 0;
          min-width: 200px;
          opacity: 0;
          visibility: hidden;
          transition: all 0.2s ease;
          margin-top: 8px;
        }

        .nav-item:hover .nav-dropdown {
          opacity: 1;
          visibility: visible;
          margin-top: 0;
        }

        .dropdown-item {
          display: block;
          padding: 12px 16px;
          color: rgba(0, 0, 0, 0.9);
          text-decoration: none;
          font-size: 14px;
          transition: background 0.2s ease;
        }

        .dropdown-item:hover {
          background: rgba(0, 0, 0, 0.08);
        }

        .header-divider {
          width: 1px;
          height: 40px;
          background: rgba(0, 0, 0, 0.08);
          margin: 0 4px;
        }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          color: rgba(0, 0, 0, 0.6);
          cursor: pointer;
          padding: 8px;
        }

        /* Mobile Menu */
        .mobile-menu {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: white;
          z-index: 2000;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
          overflow-y: auto;
        }

        .mobile-menu.active {
          transform: translateX(0);
        }

        .mobile-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .mobile-logo img {
          height: 28px;
        }

        .close-button {
          background: none;
          border: none;
          color: rgba(0, 0, 0, 0.6);
          cursor: pointer;
          padding: 8px;
        }

        .mobile-nav {
          padding: 16px 0;
        }

        .mobile-nav-item {
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
        }

        .mobile-nav-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 24px;
          color: rgba(0, 0, 0, 0.9);
          text-decoration: none;
          font-size: 16px;
          font-weight: 500;
        }

        .mobile-nav-content {
          display: flex;
          align-items: center;
        }

        .mobile-nav-icon {
          font-size: 20px;
          margin-right: 12px;
        }

        .mobile-submenu {
          background: #f3f2f0;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .mobile-nav-item.active .mobile-submenu {
          max-height: 500px;
        }

        .mobile-submenu-item {
          display: block;
          padding: 12px 24px 12px 56px;
          color: rgba(0, 0, 0, 0.6);
          text-decoration: none;
          font-size: 14px;
        }

        .mobile-submenu-item:hover {
          color: rgba(0, 0, 0, 0.9);
          background: rgba(0, 0, 0, 0.04);
        }

        .chevron-icon {
          transition: transform 0.3s ease;
        }

        .mobile-nav-item.active .chevron-icon {
          transform: rotate(180deg);
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .header-search {
            max-width: 200px;
          }

          .nav-link {
            min-width: 70px;
            padding: 0 8px;
          }

          .nav-label {
            font-size: 11px;
          }
        }

        @media (max-width: 768px) {
          .header-container {
            padding: 0 16px;
          }

          .header-search {
            display: none;
          }

          .header-nav {
            display: none;
          }

          .mobile-toggle {
            display: block;
          }
        }

        /* Orange Accent for AlloEcole */
        .nav-link.active {
          border-bottom-color: #f05623;
        }

        .nav-link:hover {
          color: #f05623;
        }
      `}</style>

      <header className={`header-linkedin ${scroll ? 'scrolled' : ''}`}>
        <div className='header-container'>
          <div className='header-content'>
            {/* Left Section */}
            <div className='header-left'>
              <Link to='/' className='header-logo'>
                <img src='images/logo/logo-black.png' alt='AlloEcole' />
              </Link>

              {/* <div className='header-search'>
                <SearchIcon className='search-icon' />
                <input 
                  type='text' 
                  placeholder='Rechercher' 
                />
              </div> */}
            </div>

            {/* Navigation Desktop */}
            <nav className='header-nav'>
              {menuItems.map((item, index) =>
                item.links ? (
                  <div key={`nav-${index}`} className='nav-item'>
                    <div className={`nav-link ${location.pathname.includes(item.links[0].href.split('/')[1]) ? 'active' : ''}`}>
                      <item.icon className='nav-icon' />
                      <span className='nav-label'>{item.label}</span>
                    </div>
                    <div className='nav-dropdown'>
                      {item.links.map((link, linkIndex) => (
                        <Link
                          key={`dropdown-${linkIndex}`}
                          to={link.href}
                          className='dropdown-item'
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    key={`nav-${index}`}
                    to={item.href}
                    className={`nav-link ${location.pathname === item.href ? 'active' : ''}`}
                  >
                    <item.icon className='nav-icon' />
                    <span className='nav-label'>{item.label}</span>
                  </Link>
                )
              )}

              <div className='header-divider' />

              <Link to='/notifications' className='nav-link'>
                <NotificationsIcon className='nav-icon' />
                <span className='nav-label'>Notifications</span>
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/profil" className="nav-link">
                    <PersonIcon className="nav-icon" />
                    <span className="nav-label">Vous</span>
                  </Link>

                  {/* 🔴 Bouton Déconnexion */}
                  <button onClick={logout} className="nav-link" style={{ background: 'none', border: 'none' }}>
                    <LoginIcon className="nav-icon" />
                    <span className="nav-label">Déconnexion</span>
                  </button>
                </>
              ) : (
                <Link to="/login" className="nav-link">
                  <LoginIcon className="nav-icon" />
                  <span className="nav-label">Connexion</span>
                </Link>
              )}
            </nav>

            {/* Mobile Toggle */}
            <button 
              type='button' 
              className='mobile-toggle'
              onClick={toggleMenu}
            >
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMenuActive ? 'active' : ''}`}>
        <div className='mobile-header'>
          <Link to='/' className='mobile-logo' onClick={closeMenu}>
            <img src='assets/images/logo/logo-black.png' alt='AlloEcole' />
          </Link>
          <button type='button' className='close-button' onClick={closeMenu}>
            <CloseIcon />
          </button>
        </div>

        <div className='mobile-nav'>
          {menuItems.map((item, index) =>
            item.links ? (
              <div 
                key={`mobile-${index}`} 
                className={`mobile-nav-item ${activeSubmenu === index ? 'active' : ''}`}
              >
                <div 
                  className='mobile-nav-link'
                  onClick={() => handleSubmenuClick(index)}
                >
                  <div className='mobile-nav-content'>
                    <item.icon className='mobile-nav-icon' />
                    {item.label}
                  </div>
                  <KeyboardArrowDownIcon className='chevron-icon' />
                </div>
                <div className='mobile-submenu'>
                  {item.links.map((link, linkIndex) => (
                    <Link
                      key={`mobile-sub-${linkIndex}`}
                      to={link.href}
                      className='mobile-submenu-item'
                      onClick={closeMenu}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={`mobile-${index}`}
                to={item.href}
                className='mobile-nav-link'
                onClick={closeMenu}
              >
                <div className='mobile-nav-content'>
                  <item.icon className='mobile-nav-icon' />
                  {item.label}
                </div>
              </Link>
            )
          )}

          <div className='mobile-nav-item'>
            <Link to='/notifications' className='mobile-nav-link' onClick={closeMenu}>
              <div className='mobile-nav-content'>
                <NotificationsIcon className='mobile-nav-icon' />
                Notifications
              </div>
            </Link>
          </div>

          <div className='mobile-nav-item'>
            <Link to='/login' className='mobile-nav-link' onClick={closeMenu}>
              <div className='mobile-nav-content'>
                <LoginIcon className='mobile-nav-icon' />
                Connexion
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeaderOne;