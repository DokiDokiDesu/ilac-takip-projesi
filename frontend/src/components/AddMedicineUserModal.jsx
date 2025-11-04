import { useState } from "react";

export function AddMedicineUserModal({
  onClose,
  onMedicineUserAdded,
  users,
  medicines,
  selectedUser,
}) {
  const [formData, setFormData] = useState({
    user_id: selectedUser ? selectedUser.id : "",
    medicine_id: "",
    start_date: "",
    end_date: "",
    daily_dosage: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Veri doğrulama
    if (
      !formData.user_id ||
      !formData.medicine_id ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.daily_dosage
    ) {
      alert("Lütfen tüm alanları doldurunuz!");
      return;
    }

    try {
      // Form verilerini sayısal değerlere dönüştür
      const medicineUserData = {
        ...formData,
        user_id: parseInt(formData.user_id),
        medicine_id: parseInt(formData.medicine_id),
        daily_dosage: parseInt(formData.daily_dosage),
      };

      await onMedicineUserAdded(medicineUserData);
      onClose();
    } catch (error) {
      console.error("İlaç-kullanıcı ilişkisi eklenirken hata:", error);
      alert("İlaç-kullanıcı ilişkisi eklenirken bir hata oluştu!");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-semibold mb-4">
          Yeni İlaç-Kullanıcı İlişkisi Ekle
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Kullanıcı seçimi yerine seçili kullanıcı gösterimi */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Kullanıcı
            </label>
            <input
              type="text"
              value={selectedUser ? selectedUser.name : "Kullanıcı seçilmedi"}
              readOnly
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 text-gray-700 shadow-sm"
            />
            {/* form gönderiminde user_id kullanılabilmesi için hidden alan */}
            <input
              type="hidden"
              name="user_id"
              value={selectedUser ? selectedUser.id : ""}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              İlaç
            </label>
            <select
              name="medicine_id"
              value={formData.medicine_id}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
              text-black"
            >
              <option value="">İlaç seçiniz</option>
              {medicines.map((medicine) => (
                <option key={medicine.id} value={medicine.id}>
                  {medicine.name}
                </option>
              ))}
            </select>
          </div>

          {/* Başlangıç Tarihi */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Başlangıç Tarihi
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
              text-black"
            />
          </div>

          {/* Bitiş Tarihi */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Bitiş Tarihi
            </label>
            <input
              type="date"
              name="end_date"
              value={formData.end_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
              text-black"
            />
          </div>

          {/* Günlük Doz */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Günlük Doz
            </label>
            <input
              type="number"
              name="daily_dosage"
              value={formData.daily_dosage}
              onChange={handleChange}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500
              text-black"
            />
          </div>

          {/* Butonlar */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Ekle
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
