import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormPage from "./pages/FormPage";
import DisplayPage from "./pages/DisplayPage";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 p-4">
        <nav className="mb-6 flex gap-4 text-blue-600 font-semibold">
          <Link to="/">Submit Form</Link>
          <Link to="/display">Display Users</Link>
        </nav>

        <Routes>
          <Route path="/" element={<FormPage />} />
          <Route path="/display" element={<DisplayPage />} />
        </Routes>

        {/* Toast container so toasts work from anywhere */}
        <ToastContainer
          position="bottom-left"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </div>
    </Router>
  );
}
