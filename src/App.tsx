import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login/Index";
import Register from "./Pages/Register/Index";
import Polls from "./Pages/Polls/Index";
import RegisterPoll from "./Pages/RegisterPoll/Index";
import ProtectedRoute from "./components/ProtectedRoute";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/Polls"
          element={
            <ProtectedRoute>
              <Polls />
            </ProtectedRoute>
          }
        />
        <Route
          path="/RegisterPoll"
          element={
            <ProtectedRoute>
              <RegisterPoll />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
