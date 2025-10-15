import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/homepage";
import { Profiles } from "./pages/profiles";
import { MedicinePage } from "./pages/medicine";
import { CalendarPage } from "./pages/CalendarPage";
import { useEffect } from "react";
import axios from "axios";

function App() {
  //backend test
  const [users, setUsers] = useState([]);
  const [medicines, setMedicines] = useState([]);

  // Kullanıcıları getir - async/await
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/users");
      console.log("Users API response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Users data received:", data);
      setUsers(data);
    } catch (error) {
      console.error("Users API error:", error);
    }
  };

  // İlaçları getir - async/await
  const fetchMedicines = async () => {
    try {
      const response = await fetch("http://localhost:5000/medicines");
      console.log("Medicines API response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Medicines data received:", data);
      setMedicines(data);
    } catch (error) {
      console.error("Medicines API error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, []);

  console.log("Current users state:", users);
  console.log("Current medicines state:", medicines);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/profiles"
          element={<Profiles users={users} medicines={medicines} />}
        />
        <Route
          path="/medicine"
          element={<MedicinePage medicines={medicines} users={users} />}
        />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
}
export default App;
