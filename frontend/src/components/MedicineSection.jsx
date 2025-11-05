import { useState } from "react";

export default function MedicineSection({
  selectedMedicine,
  onDeleteMedicine,
  medicineUsers,
  users,
}) {
  const [showUserPopup, setShowUserPopup] = useState(false);
  const handleDelete = async () => {
    if (!selectedMedicine || !selectedMedicine.id) {
      console.error("No medicine selected or invalid ID");
      return;
    }

    try {
      await onDeleteMedicine(selectedMedicine.id);
    } catch (error) {
      console.error("Error deleting medicine:", error);
      alert("İlaç silinirken bir hata oluştu!");
    }
  };

  return (
    <div className="rounded-lg flex flex-col  bg-[rgb(229,231,235)] h-[390px] mt-[60px] w-[450px] mr-10 ">
      {" "}
      {/* medicine-section-container */}
      <div className="flex flex-col items-center justify-center p-4">
        {" "}
        {/* medicine-section-top */}
        <img className="w-16 h-16 mb-4" src="/icons8-medicine-48.png" />{" "}
        {/* medicine-img */}
        <p className="text-black text-center font-medium">
          {selectedMedicine ? selectedMedicine.name : "İlaç seçiniz"}
        </p>
      </div>
      <div className="flex-1 p-4">
        {" "}
        {/* medicine-section-mid */}
        <div className="mb-4">
          <p className="text-black text-center font-semibold mb-2">
            Doz Bilgisi
          </p>
          <p className="text-black text-center">
            {selectedMedicine
              ? selectedMedicine.dosage
              : "Doz bilgisi mevcut değil"}
          </p>
        </div>
        <div className="mb-4">
          <p className="text-black text-center font-semibold mb-2">İlaç ID</p>
          <p className="text-black text-center">
            {selectedMedicine ? `#${selectedMedicine.id}` : "ID mevcut değil"}
          </p>
        </div>
        <div className="">
          <button
            className="rounded-lg border-2 border-red-500 text-white mt-4 h-[40px] w-[70px] px-4 py-2 font-medium transition-colors duration-200 focus:outline-none focus:ring focus:ring-offset-2 hover:opacity-90 bg-red-600 hover:bg-white hover:text-red-600 hover:border-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleDelete}
            disabled={!selectedMedicine}
          >
            Sil
          </button>
          <button
            className="h-[40px] ml-2 mb-2 border-solid border-2 bg-blue-500 text-white px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => setShowUserPopup(true)}
            disabled={!selectedMedicine}
          >
            Kullanıcıları Gör
          </button>
        </div>
      </div>
      {/* Popup */}
      {showUserPopup && selectedMedicine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {selectedMedicine.name} İlacını Kullanan Kişiler
              </h3>
              <button
                onClick={() => setShowUserPopup(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-4 max-h-[400px] overflow-y-auto">
              {medicineUsers
                .filter((mu) => mu.medicine_id === selectedMedicine.id)
                .map((mu) => {
                  const user = users.find((u) => u.id === mu.user_id);
                  return (
                    <div key={mu.id} className="bg-gray-50 p-4 mb-2 rounded">
                      <p className="font-medium text-gray-900">
                        {user?.name || "Bilinmeyen Kullanıcı"}
                      </p>
                      <div className="text-sm text-gray-600 mt-1">
                        <p>Günlük Doz: {mu.daily_dosage}</p>
                        <p>
                          Başlangıç:{" "}
                          {new Date(mu.start_date).toLocaleDateString("tr-TR")}
                        </p>
                        <p>
                          Bitiş:{" "}
                          {new Date(mu.end_date).toLocaleDateString("tr-TR")}
                        </p>
                      </div>
                    </div>
                  );
                })}
              {medicineUsers.filter(
                (mu) => mu.medicine_id === selectedMedicine.id
              ).length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  Bu ilacı kullanan kimse yok
                </p>
              )}
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowUserPopup(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
