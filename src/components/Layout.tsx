import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import DrawerAppBar from "./DrawerAppBar";
import Footer from "./Footer";
import { Box, Toolbar } from '@mui/material';

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login"; 
  const isRegisterPage = location.pathname === "/register";

  return (
    <div className="app">
      <div className="main-content">
      {!isLoginPage && !isRegisterPage && <DrawerAppBar />}
          <div className="content">
            <Outlet />
          </div>
        {!isLoginPage && !isRegisterPage  && <Footer />}
      </div>
    </div>
  );
};

export default Layout;