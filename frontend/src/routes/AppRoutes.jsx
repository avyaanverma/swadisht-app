import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import PublicLayout from "../layouts/PublicLayout";
import UserLayout from "../layouts/UserLayout";
import PartnerLayout from "../layouts/PartnerLayout";
import HomeReels from "../pages/general/HomeReels";
import StoresPage from "../pages/store/StoresPage";
import StorePage from "../pages/store/StorePage";
import CreateFoodPartner from "../pages/food-partner/CreateFoodPartner";
import UserRegister from "../pages/auth/UserRegister";
import UserSignIn from "../pages/auth/UserSignIn";
import PartnerRegister from "../pages/auth/PartnerRegister";
import PartnerSignIn from "../pages/auth/PartnerSignIn";
import CartPage from "../pages/user/CartPage";
import ProfilePage from "../pages/user/ProfilePage";
import CheckoutPage from "../pages/user/CheckoutPage";
import PartnerDashboard from "../pages/partner/PartnerDashboard";
import PartnerFoods from "../pages/partner/PartnerFoods";
import PartnerReels from "../pages/partner/PartnerReels";
import CreateFoodItem from "../pages/partner/CreateFoodItem";

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

        {/* Private level 1: user */}
        <Route path="/u" element={<UserLayout />}>
          <Route path="cart" element={<CartPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="checkout" element={<CheckoutPage />} />
        </Route>

        {/* Private level 2: food partner */}
        <Route path="/p" element={<PartnerLayout />}>
          <Route index element={<PartnerDashboard />} />
          <Route path="reels" element={<PartnerReels />} />
          <Route path="foods" element={<PartnerFoods />} />
          <Route path="foods/new" element={<CreateFoodItem />} />
          <Route path="reels/new" element={<CreateFoodPartner />} />
        </Route>

        {/* Backward-compat */}
        <Route path="/partner/upload" element={<CreateFoodPartner />} />

        <Route path="*" element={<Navigate to="/reels" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
