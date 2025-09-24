export default function MedicineSection() {
  return (
    <div className="flex flex-col  bg-[rgb(229,231,235)] h-[390px] mt-[60px] w-[450px] mr-10 ">
      {" "}
      {/* medicine-section-container */}
      <div className="flex flex-col items-center justify-center p-4">
        {" "}
        {/* medicine-section-top */}
        <img className="w-16 h-16 mb-4" src="/icons8-medicine-48.png" />{" "}
        {/* medicine-img */}
        <p className="text-black text-center font-medium">Ilaç isim</p>
      </div>
      <div className="flex-1 p-4">
        {" "}
        {/* medicine-section-mid */}
        <p className="text-black  text-center">Acıklama</p>
        <p className="text-black">kullanıcıları gör</p>
      </div>
    </div>
  );
}
