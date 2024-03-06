import React from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Dashboard from "./components/pages/Dashboard.jsx";
import Present from "./components/pages/Present.jsx";
import Absent from "./components/pages/Absent.jsx";
import Add from "./components/pages/Add.jsx";
import Delete from "./components/pages/Delete.jsx";
import Upload from "./components/pages/Upload.jsx";

const App = () => {
  return (
    <BrowserRouter>      
      <Sidebar>
        <Routes>
        <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/present" element={<Present />} />
          <Route path="/absent" element={<Absent />} />
          <Route path="/add" element={<Add />} />
          <Route path="/delete" element={<Delete />} />
          <Route path="/upload" element={<Upload />} />
        </Routes>
      </Sidebar>
    </BrowserRouter>
  );
};

export default App;
