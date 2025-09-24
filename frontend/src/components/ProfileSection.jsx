export default function ProfileSection() {
  return (
    <div className="flex flex-row h-[500px] mt-5">
      {" "}
      {/* profile-section-main-container */}
      <div className="w-[300px] border border-gray-500 mr-4">
        {" "}
        {/* profile-section-container */}
        {/* image-container */}
        <div className="">
          {/* profile-image */}
          <img className="h-25 mt-5" src="/icons8-test-account-48.png"></img>
        </div>
        {/* info-container */}
        <div className="">
          {/* p */}
          <p className="text-lg">isim-soyisim</p>
          <p className="text-lg">yaş</p>
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
