export default function MedicineSection({ selectedMedicine }) {
  return (
    <div className="flex flex-col  bg-[rgb(229,231,235)] h-[390px] mt-[60px] w-[450px] mr-10 ">
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
        <p className="text-black mt-4">kullanıcıları gör</p>
        <button
          className="text-white mt-4 h-[40px] w-[70px] rounded px-4 py-2 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:opacity-90"
          style={{
            backgroundColor: "#dc2626",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#b91c1c")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#dc2626")}
        >
          Sil
        </button>
      </div>
    </div>
  );
}
