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

  // Yeni kullanıcı ekleme fonksiyonu
  const addUser = async (userData) => {
    try {
      const response = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newUser = await response.json();
      setUsers((prevUsers) => [...prevUsers, newUser]);
      return newUser;
    } catch (error) {
      console.error("Add user error:", error);
      throw error;
    }
  };

  //İlaç silme fonksyonu

  const deleteMedicine = async (medicineId) => {
    if (!medicineId) {
      console.error("medicineId undefined!");
      return;
    }

    try {
      console.log("Deleting medicine with ID:", medicineId);

      const response = await fetch(
        `http://localhost:5000/medicines/${medicineId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("DELETE response status:", response.status);

      if (!response.ok) {
        const errorData = await response.text();
        console.error("Server error response:", errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("DELETE response:", result);

      // State'ten ilacı kaldır
      setMedicines((prev) => prev.filter((m) => m.id !== Number(medicineId)));
      console.log(`İlaç silindi: ${medicineId}`);
    } catch (error) {
      console.error("Delete medicine error:", error);
      throw error;
    }
  };

  // Kullanıcı silme fonksiyonu
  const deleteUser = async (userId) => {
    console.log("deleteUser çağrıldı, userId:", userId);
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}`, {
        method: "DELETE",
      });

      console.log("DELETE response status:", response.status);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("DELETE response:", result);

      // State'ten kullanıcıyı kaldır
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      console.log(`Kullanıcı silindi: ${userId}`);
    } catch (error) {
      console.error("Delete user error:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, []);

  console.log("Current users state:", users);
  // Yeni ilaç ekleme fonksiyonu
  const addMedicine = async (medicineData) => {
    try {
      const response = await fetch("http://localhost:5000/medicines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(medicineData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newMedicine = await response.json();
      setMedicines((prevMedicines) => [...prevMedicines, newMedicine]);
      return newMedicine;
    } catch (error) {
      console.error("Add medicine error:", error);
      throw error;
    }
  };

  console.log("Current medicines state:", medicines);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route
          path="/profiles"
          element={
            <Profiles
              users={users}
              medicines={medicines}
              onAddUser={addUser}
              onDeleteUser={deleteUser}
            />
          }
        />
        <Route
          path="/medicine"
          element={
            <MedicinePage
              medicines={medicines}
              users={users}
              onAddMedicine={addMedicine}
              onDeleteMedicine={deleteMedicine}
            />
          }
        />
        <Route path="/calendar" element={<CalendarPage />} />
      </Routes>
    </Router>
  );
}
export default App;
