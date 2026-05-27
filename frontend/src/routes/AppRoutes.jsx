import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router";
import Navbar from "../components/Navbar";
import HomeReels from "../pages/general/HomeReels";
import StoresPage from "../pages/store/StoresPage";
import StorePage from "../pages/store/StorePage";
import CreateFoodPartner from "../pages/food-partner/CreateFoodPartner";
import UserRegister from "../pages/auth/UserRegister";
import UserSignIn from "../pages/auth/UserSignIn";
import PartnerRegister from "../pages/auth/PartnerRegister";
import PartnerSignIn from "../pages/auth/PartnerSignIn";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Navigate to="/reels" replace />} />
          <Route path="reels" element={<HomeReels />} />
          <Route path="stores" element={<StoresPage />} />
          <Route path="store/:storeId" element={<StorePage />} />
        </Route>

        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserSignIn />} />
        <Route path="/partner/register" element={<PartnerRegister />} />
        <Route path="/partner/login" element={<PartnerSignIn />} />

        <Route path="/partner/upload" element={<CreateFoodPartner />} />

        <Route path="*" element={<Navigate to="/reels" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
