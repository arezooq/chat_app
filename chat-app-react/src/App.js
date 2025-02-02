import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Signin from "./pages/Login";
import Signup from "./pages/Register";
import Dashboard from "./pages/Dashbord"; // نام را تصحیح کردم

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signin />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
