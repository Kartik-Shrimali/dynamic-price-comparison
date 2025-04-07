import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter as Router , Routes , Route}  from "react-router-dom"; 
import {LandingPage} from "./pages/LandingPage" 
import {SignupUser} from "./pages/SignupUser"
import {SigninUser} from "./pages/SigninUser"
import {DashboardUser} from "./pages/DashboardUser"
import {SignupShop} from "./pages/SignupShop"
import {SigninShop} from "./pages/SigninShop"
import {DashboardStore} from "./pages/DashboardStore"

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
           <Route path = "/signup/user" element={<SignupUser/>}/>
          <Route path = "/dashboard/user" element={<DashboardUser/>}/>
          <Route path = "/signin/user" element={<SigninUser/>}/>
          <Route path = "/signup/store" element={<SignupShop/>}/>
            <Route path = "/signin/store" element={<SigninShop/>}/>
          <Route path = "/dashboard/store" element={<DashboardStore/>}/>

        </Routes>
      </Router>
    </>
  )
}

export default App
