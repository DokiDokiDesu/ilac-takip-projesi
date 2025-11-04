export default function MedicineSection({
  selectedMedicine,
  onDeleteMedicine,
}) {
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
          <button className="h-[40px]  ml-2 mb-2 border-solid border-2">
            kullanıcıları gör
          </button>
        </div>
      </div>
    </div>
  );
}
