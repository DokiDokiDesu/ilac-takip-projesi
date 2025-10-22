export default function ProfileSection({
  selectedUser,
  medicines = [],
  onDeleteUser,
}) {
  return (
    <div className="flex flex-row h-[500px] mt-5">
      {" "}
      {/* profile-section-main-container */}
      <div className="w-[300px] border border-gray-500 mr-4 p-4 flex flex-col">
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
        <div className="text-center flex-grow">
          {/* p */}
          <p className="text-lg font-semibold mb-2">
            {selectedUser ? selectedUser.name : "Kullanıcı seçiniz"}
          </p>
          <p className="text-lg text-gray-600">
            {selectedUser ? `ID: ${selectedUser.id}` : "Kullanıcı bilgisi yok"}
          </p>
        </div>
        {/* Sil butonu en altta */}
        <div className="mt-auto">
          <button
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => {
              console.log("Sil butonu tıklandı, selectedUser:", selectedUser);
              if (selectedUser) {
                console.log(
                  "onDeleteUser çağrılıyor, userId:",
                  selectedUser.id
                );
                onDeleteUser(selectedUser.id);
              } else {
                console.log("Kullanıcı seçili değil");
              }
            }}
            disabled={!selectedUser}
          >
            kullanıcıyı sil
          </button>
        </div>
      </div>
      <div className="w-[300px] border border-gray-500 mr-4 p-4 flex flex-col">
        {" "}
        {/* medicine-main-container */}
        <p className="text-lg font-semibold mb-4">Kullandığı ilaçlar</p>{" "}
        {/* p */}
        <div className="flex-grow">{/* İlaç listesi burada olacak */}</div>
        {/* Düzenle butonu en altta */}
        <div className="mt-auto">
          <button className=" px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
            düzenle
          </button>
        </div>
      </div>
    </div>
  );
}
