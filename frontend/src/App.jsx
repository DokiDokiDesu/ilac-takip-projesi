import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/homepage";
import { Profiles } from "./pages/profiles";
import { MedicinePage } from "./pages/medicine";
import { CalendarPage } from "./pages/CalendarPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/profiles" element={<Profiles />} />
        <Route path="/medicine" element={<MedicinePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
}
export default App;
