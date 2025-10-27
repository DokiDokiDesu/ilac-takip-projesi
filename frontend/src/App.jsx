import React, { useState, useEffect, useCallback } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Homepage } from "./pages/homepage";
import { Profiles } from "./pages/profiles";
import { MedicinePage } from "./pages/medicine";
import { CalendarPage } from "./pages/CalendarPage";
import axios from "axios";

function App() {
  //backend test
  const [users, setUsers] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [medicineUsers, setMedicineUsers] = useState([]);

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
  //kullanıcı-ilaç ilişkisini getir
  const fetchMedicineUsers = useCallback(
    async (userId = null) => {
      try {
        // Eğer userId null ise veya kullanıcı listesinde yoksa, boş liste dön
        if (userId === null || !users.some((user) => user.id === userId)) {
          console.log(
            "No user selected or user not found, returning empty list"
          );
          setMedicineUsers([]);
          return;
        }

        const url = `http://localhost:5000/api/user-medicines/${userId}`;
        console.log("Fetching medicines for user:", userId);

        const response = await axios.get(url);
        console.log("Medicine-user relations received:", response.data);

        // Her bir ilişki için medicine_name ve medicine_dosage alanlarını kontrol et
        const formattedData = response.data.map((relation) => ({
          ...relation,
          medicine_name: relation.medicine_name || "İsimsiz İlaç",
          medicine_dosage: relation.medicine_dosage || "Doz bilgisi yok",
        }));

        console.log("Formatted medicine-user relations:", formattedData);
        setMedicineUsers(formattedData);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log(
            "User not found or has no medicines, returning empty list"
          );
          setMedicineUsers([]);
        } else {
          console.error("Fetch medicine-user relations error:", error);
          setMedicineUsers([]);
        }
      }
    },
    [users]
  );

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

  // Yeni kullanıcı-ilaç ilişkisi ekleme fonksiyonu
  const addMedicineUser = async (relationData) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/user-medicines",
        relationData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Added medicine-user relation:", response.data);

      // State'i güncelle
      setMedicineUsers((prevRelations) => [...prevRelations, response.data]);

      // İlişkileri yeniden çek
      await fetchMedicineUsers(relationData.user_id);

      return response.data;
    } catch (error) {
      console.error("Add medicine-user error:", error);
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

  //kullanıcı-ilaç ilişkisini silme methodu

  const deleteMedicineUser = useCallback(
    async (userId, medicineId) => {
      if (!userId || !medicineId) {
        console.error("userId or medicineId undefined!");
        return;
      }

      try {
        console.log(
          `Deleting medicine-user relation: userId=${userId}, medicineId=${medicineId}`
        );

        const response = await axios.delete(
          `http://localhost:5000/api/user-medicines/${userId}/${medicineId}`
        );

        console.log(
          "DELETE medicine-user response status:",
          response.status,
          "data:",
          response.data
        );

        // İlişkileri yeniden çek
        await fetchMedicineUsers(userId);

        return response.data;
      } catch (error) {
        console.error("Delete medicine-user error:", error);
        if (error.response?.status === 404) {
          // İlişki zaten silinmiş olabilir, listeyi yine de güncelle
          await fetchMedicineUsers(userId);
        }
        throw error;
      }
    },
    [fetchMedicineUsers]
  );

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchMedicineUsers(selectedUser?.id);
  }, [selectedUser, fetchMedicineUsers, users]);

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
              medicineUsers={medicineUsers}
              onAddUser={addUser}
              onDeleteUser={deleteUser}
              onAddMedicineUser={addMedicineUser}
              onDeleteMedicineUser={deleteMedicineUser}
              selectedUser={selectedUser}
              onSelectUser={setSelectedUser}
            />
          }
        />
        <Route
          path="/medicine"
          element={
            <MedicinePage
              medicines={medicines}
              users={users}
              medicineUsers={medicineUsers}
              onAddMedicine={addMedicine}
              onAddMedicineUser={addMedicineUser}
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
