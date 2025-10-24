import { Outlet, useLocation } from "react-router-dom";
import HeaderOne from './HeaderOne';

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login"; 
  const isRegisterPage = location.pathname === "/register";

  return (
    <div className="app">
      <div className="main-content">
      {!isLoginPage && !isRegisterPage && <HeaderOne />}
          <div className="content">
            <Outlet />
          </div>
      </div>
    </div>
  );
};

export default Layout;