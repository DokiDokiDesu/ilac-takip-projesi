export default function ProfileSection() {
  return (
    <div className="flex flex-row h-[500px] mt-5">
      {" "}
      {/* profile-section-main-container */}
      <div className="w-[300px] border border-gray-500 mr-4 p-4">
        {" "}
        {/* profile-section-container */}
        {/* image-container */}
        <div className="flex justify-center items-center w-full mb-4">
          {/* profile-image */}
          <img
            className="w-16 h-16 rounded-full object-cover"
            src="/icons8-test-account-48.png"
          ></img>
        </div>
        {/* info-container */}
        <div className="text-center">
          {/* p */}
          <p className="text-lg font-semibold mb-2">isim-soyisim</p>
          <p className="text-lg text-gray-600">yaş</p>
        </div>
      </div>
      <div className="w-[300px] border border-gray-500 mr-4">
        {" "}
        {/* medicine-main-container */}
        <p className="text-lg">Kullandığı ilaçlar</p> {/* p */}
        <div>
          <p className="text-lg">ilaç örnek 1</p> {/* p */}
          <p className="text-lg">ilaç örnek 2</p> {/* p */}
          <p className="text-lg">ilaç örnek 3</p> {/* p */}
          <button>düzenle</button>
        </div>
      </div>
    </div>
  );
}
