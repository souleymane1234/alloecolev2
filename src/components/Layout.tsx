import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import DrawerAppBar from "./DrawerAppBar";

const Layout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login"; 

  return (
    <div className="app">
      {/* {!isLoginPage && <Sidebar />} */}
      <div className="main-content">
        {!isLoginPage && <DrawerAppBar />}
        <div className="content">
          <Outlet /> {/* Affiche la page en cours */}
        </div>
        {/* {!isLoginPage && <Footer />} */}
      </div>
    </div>
  );
};

export default Layout;
