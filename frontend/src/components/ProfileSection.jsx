export default function ProfileSection({ selectedUser, medicines = [] }) {
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
          <p className="text-lg font-semibold mb-2">
            {selectedUser ? selectedUser.name : "Kullanıcı seçiniz"}
          </p>
          <p className="text-lg text-gray-600">
            {selectedUser ? `ID: ${selectedUser.id}` : "Kullanıcı bilgisi yok"}
          </p>
        </div>
      </div>
      <div className="w-[300px] border border-gray-500 mr-4 p-4">
        {" "}
        {/* medicine-main-container */}
        <p className="text-lg font-semibold mb-4">Kullandığı ilaçlar</p>{" "}
        {/* p */}
        <div>
          <button className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            düzenle
          </button>
        </div>
      </div>
    </div>
  );
}
