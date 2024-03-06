import React, { useState } from "react";
import "./App.css";
import {  Route, Routes,  } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./components/pages/Dashboard.jsx";
import Present from "./components/pages/Present.jsx";
import Absent from "./components/pages/Absent.jsx";
import Add from "./components/pages/Add.jsx";
import Delete from "./components/pages/Delete.jsx";
import LoginForm from "./components/pages/Login.jsx"; 

const App = () => {
  // State to track login status
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Function to handle successful login
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // If not logged in, render login form
  if (!isLoggedIn) {
    return <LoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  

  // If logged in, render the main application with routes
  return (
    // <BrowserRouter>      
      <Sidebar>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/present" element={<Present />} />
          <Route path="/absent" element={<Absent />} />
          <Route path="/add" element={<Add />} />
          <Route path="/delete" element={<Delete />} />
        </Routes>
      </Sidebar>
    // </BrowserRouter>
  );
};

export default App;
