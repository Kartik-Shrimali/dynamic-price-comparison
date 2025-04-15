import { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { SignupUser } from "./pages/SignupUser";
import { SigninUser } from "./pages/SigninUser";
import { DashboardUser } from "./pages/DashboardUser";
import { SignupShop } from "./pages/SignupShop";
import { SigninShop } from "./pages/SigninShop";
import { DashboardStore } from "./pages/DashboardStore";
import { PriceAlertsUser } from "./pages/PriceAlertsUser";
import { Store_Update_Product } from "./pages/Store_Update_Product";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup/user" element={<SignupUser />} />
        <Route path="/dashboard/user" element={<DashboardUser />} />
        <Route path="/signin/user" element={<SigninUser />} />
        <Route path="/signup/store" element={<SignupShop />} />
        <Route path="/signin/store" element={<SigninShop />} />
        <Route path="/dashboard/store" element={<DashboardStore />} />
        <Route path="/price-alert" element={<PriceAlertsUser />} />
        <Route path="/update/:id" element={<Store_Update_Product />} />
      </Routes>
    </Router>
  );
}

export default App;
