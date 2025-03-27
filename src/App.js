import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import InputPage from "./pages/InputPage";
import ExpenseListPage from "./pages/ExpenseListPage";
// import TablePage from "./pages/TablePage";
import ChartPage from "./pages/ChartPage";
import Login from "./pages/LoginPage";
// import "./styles.css";

function App() {
  return (
    <Router>
      <div className="container">
        <nav>
          <ul>
            <li><Link to="/">Input</Link></li>
            <li><Link to="/table">Tabel</Link></li>
            <li><Link to="/chart">Grafik</Link></li>
          </ul>
        </nav>
        <Routes>
          <Route path="/" element={<InputPage />} />
          <Route path="/table" element={<ExpenseListPage />} />
          <Route path="/chart" element={<ChartPage />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
