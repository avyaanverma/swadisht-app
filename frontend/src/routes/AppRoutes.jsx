import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeReels from '../pages/general/HomeReels';
import UserRegister from '../pages/auth/UserRegister';
import UserSignIn from '../pages/auth/UserSignIn';
import PartnerRegister from '../pages/auth/PartnerRegister';
import PartnerSignIn from '../pages/auth/PartnerSignIn';
import CreateFoodPartner from '../pages/food-partner/CreateFoodPartner';
import StorePage from '../pages/store/StorePage';

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomeReels/>} />
        <Route path="/user/register" element={<UserRegister />} />
        <Route path="/user/login" element={<UserSignIn />} />
        <Route path="/partner/register" element={<PartnerRegister />} />
        <Route path="/partner/login" element={<PartnerSignIn />} />
        <Route path="/create-food" element={<CreateFoodPartner/>} />
        <Route path="/store/:storeId" element={<StorePage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;