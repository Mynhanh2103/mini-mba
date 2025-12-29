import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import LoginPage from "./LoginPage";
import Dashboard from "./Dashboard";
import ResearchPage from "./ResearchPage";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/research" element={<ResearchPage />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="text-center mt-20">404 - Không tìm thấy trang</div>
          }
        />
      </Routes>
    </Router>
  );
}
