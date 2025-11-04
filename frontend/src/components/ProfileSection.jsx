import { useState } from "react";
import { AddMedicineUserModal } from "./AddMedicineUserModal";

export default function ProfileSection({
  selectedUser,
  medicines = [],
  userMedicines = [],
  onDeleteUser,
  onAddMedicineUser,
  onDeleteMedicineUser,
  onFetchMedicineUsers,
  setIsVisible,
}) {
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);

  return (
    <>
      <div className="flex flex-row h-[500px] mt-5">
        <div className="w-[300px] border border-gray-500 mr-4 p-4 flex flex-col">
          <div className="flex justify-center items-center w-full mb-4">
            <img
              className="w-16 h-16 rounded-full object-cover"
              src="/icons8-test-account-48.png"
              alt="Profile"
            />
          </div>
          <div className="text-center flex-grow">
            <p className="text-lg font-semibold mb-2">
              {selectedUser ? selectedUser.name : "Kullanıcı seçiniz"}
            </p>
          </div>
          <div className="mt-auto">
            <button
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                if (selectedUser) {
                  onDeleteUser(selectedUser.id);
                }
              }}
              disabled={!selectedUser}
            >
              kullanıcıyı sil
            </button>
          </div>
        </div>

        <div className="w-[300px] border border-gray-500 mr-4 p-4 flex flex-col">
          <p className="text-lg font-semibold mb-4">Kullandığı ilaçlar</p>
          <div className="flex-grow overflow-y-auto">
            {userMedicines.length > 0 ? (
              <ul className="space-y-2">
                {userMedicines.map((userMedicine) => (
                  <li
                    key={`${userMedicine.user_id}-${userMedicine.medicine_id}`}
                    className="p-2 border border-gray-200 rounded"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {userMedicine.medicine_name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Günlük doz: {userMedicine.daily_dosage}
                          <span className="ml-2">
                            ({userMedicine.medicine_dosage})
                          </span>
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(
                            userMedicine.start_date
                          ).toLocaleDateString()}{" "}
                          -{" "}
                          {new Date(userMedicine.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          console.log("İlaç silme detayları:", {
                            userMedicine,
                            userId: userMedicine.user_id,
                            medicineId: userMedicine.medicine_id,
                          });
                          onDeleteMedicineUser(
                            userMedicine.user_id,
                            userMedicine.medicine_id
                          );
                        }}
                        className="text-red-500 hover:text-red-700"
                        title="İlacı kaldır"
                      >
                        &#x2715;
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center italic">
                Henüz ilaç eklenmemiş
              </p>
            )}
          </div>
          <div className="mt-auto space-x-5">
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => {
                setShowAddMedicineModal(true);
                setIsVisible(false);
              }}
              disabled={!selectedUser}
            >
              ekle
            </button>
          </div>
        </div>
      </div>

      {showAddMedicineModal && (
        <AddMedicineUserModal
          onClose={() => {
            setShowAddMedicineModal(false);
            setIsVisible(true);
          }}
          onMedicineUserAdded={async (data) => {
            try {
              await onAddMedicineUser(data);
              setShowAddMedicineModal(false);
            } catch (error) {
              console.error("İlaç-kullanıcı ilişkisi eklenirken hata:", error);
              alert("İlaç-kullanıcı ilişkisi eklenirken bir hata oluştu!");
            }
          }}
          selectedUser={selectedUser}
          medicines={medicines}
        />
      )}
    </>
  );
}
