import AnimatedList from "../components/AnimatedList";
import { useNavigate } from "react-router-dom";
import MedicineSection from "../components/MedicineSection";
import { useState } from "react";
import { AddMedicineModal } from "../components/AddMedicineModal";

export function MedicinePage({
  medicines,
  users,
  onAddMedicine,
  onDeleteMedicine,
  medicineUsers,
}) {
  const navigate = useNavigate();
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Medicine seçimi handler'ı
  const handleMedicineSelect = (medicine, index) => {
    console.log("Selected medicine:", medicine, "at index:", index);
    setSelectedMedicine(medicine);
  };

  // Yeni ilaç ekleme handler'ı
  const handleMedicineAdded = async (medicineData) => {
    try {
      const newMedicine = await onAddMedicine(medicineData);
      console.log("Yeni ilaç eklendi:", newMedicine);
      setShowModal(false);
    } catch (error) {
      console.error("İlaç ekleme hatası:", error);
      alert("İlaç eklenirken bir hata oluştu!");
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
      <div className="flex flex-row">
        {" "}
        {/* mid-container */}
        <MedicineSection
          selectedMedicine={selectedMedicine}
          onDeleteMedicine={onDeleteMedicine}
          medicineUsers={medicineUsers}
          users={users}
        />
        <div className="mt-5">
          {" "}
          {/* list-section */}
          <input className="w-[350px] h-6 mb-2 "></input> {/* search-bar */}
          <AnimatedList
            listItems={medicines}
            onItemSelect={handleMedicineSelect}
            showGradients={true}
            enableArrowNavigation={true}
            displayScrollbar={true}
          />
          <button
            className="mt-2 px-4 py-2 bg-green-400 border-2 border-green-500  text-white rounded-lg hover:bg-white hover:text-green-500 hover:border-green-500! transition-colors"
            onClick={() => setShowModal(true)}
          >
            yeni ilaç ekle
          </button>{" "}
          {/* add-medicine */}
        </div>
      </div>
      {/* Modal */}
      {showModal && (
        <AddMedicineModal
          onClose={() => setShowModal(false)}
          onMedicineAdded={handleMedicineAdded}
        />
      )}
    </div>
  );
}
