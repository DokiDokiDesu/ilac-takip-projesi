import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import AnimatedList from "../components/AnimatedList";
import ProfileSection from "../components/ProfileSection";
import { useNavigate } from "react-router-dom";
import { AddProfileModal } from "../components/AddProfileModal";
import { AddMedicineUserModal } from "../components/AddMedicineUserModal";

export function Profiles({
  users,
  medicines,
  medicineUsers,
  onAddUser,
  onDeleteUser,
  onAddMedicineUser,
  onDeleteMedicineUser,
  selectedUser,
  onSelectUser,
}) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [userMedicines, setUserMedicines] = useState([]);

  // user seçimi handler'ı
  const handleUserSelect = (user, index) => {
    console.log("Selected user:", user, "at index:", index);
    onSelectUser(user);
  };

  // Yeni kullanıcı ekleme handler'ı
  const handleUserAdded = async (userData) => {
    try {
      const newUser = await onAddUser(userData);
      console.log("Yeni kullanıcı eklendi:", newUser);
      setShowModal(false);
    } catch (error) {
      console.error("Kullanıcı ekleme hatası:", error);
      alert("Kullanıcı eklenirken bir hata oluştu!");
    }
  };

  // Kullanıcı silme handler'ı
  const handleUserDelete = async (userId) => {
    console.log("handleUserDelete çağrıldı, userId:", userId);

    if (!userId) {
      alert("Lütfen silmek istediğiniz kullanıcıyı seçin!");
      return;
    }

    const confirmDelete = window.confirm(
      "Bu kullanıcıyı silmek istediğinizden emin misiniz?"
    );

    console.log("Kullanıcı onayı:", confirmDelete);

    if (!confirmDelete) return;

    try {
      console.log("onDeleteUser çağrılıyor...");
      await onDeleteUser(userId);
      console.log("Kullanıcı silindi:", userId);

      // Eğer silinen kullanıcı seçili ise seçimi temizle
      if (selectedUser && selectedUser.id === userId) {
        onSelectUser(null);
        console.log("Seçilen kullanıcı temizlendi");
      }
    } catch (error) {
      console.error("Kullanıcı silme hatası:", error);
      alert("Kullanıcı silinirken bir hata oluştu!");
    }
  };

  return (
    <div className="grid">
      {" "}
      {/* main-container */}
      <div className="fixed top-0 left-0 h-[70px] w-full flex">
        {" "}
        {/* top-container */}
        <button
          className="inline-block h-12 text-sm ml-2 mt-2"
          onClick={() => navigate("/")}
        >
          {" "}
          {/* back */}
          geri dön
        </button>
      </div>
      <div className="flex flex-row mt-12 justify-between">
        {" "}
        {/* mid-container */}
        <div className="">
          {" "}
          {/* profile-section */}
          <ProfileSection
            selectedUser={selectedUser}
            medicines={medicines}
            userMedicines={
              selectedUser
                ? medicineUsers.filter((mu) => mu.user_id === selectedUser.id)
                : []
            }
            onDeleteUser={handleUserDelete}
            onAddMedicineUser={onAddMedicineUser}
            onDeleteMedicineUser={onDeleteMedicineUser}
          />
        </div>
        <div className="mt-5">
          {" "}
          {/* list-section */}
          <input className="w-[350px] h-6 mb-2"></input> {/* search-bar */}
          <AnimatedList
            listItems={users}
            onItemSelect={handleUserSelect}
            showGradients={true}
            enableArrowNavigation={true}
            displayScrollbar={true}
          />
          <button className="mt-2" onClick={() => setShowModal(true)}>
            yeni profil ekle
          </button>{" "}
          {/* add-profile */}
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <AddProfileModal
          onClose={() => setShowModal(false)}
          onUserAdded={handleUserAdded}
        />
      )}
    </div>
  );
}
