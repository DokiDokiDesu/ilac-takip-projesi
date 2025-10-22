import { useState } from "react";

export function AddMedicineModal({ onClose, onMedicineAdded }) {
  const [name, setName] = useState("");
  const [dosage, setDosage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Lütfen ilaç adını giriniz!");
      return;
    }

    if (!dosage.trim()) {
      alert("Lütfen dozaj bilgisini giriniz!");
      return;
    }

    setIsLoading(true);

    try {
      // Parent component'e veri gönder ve işlenmesini bekle
      if (onMedicineAdded) {
        await onMedicineAdded({
          name: name.trim(),
          dosage: dosage.trim(),
        });
      }

      // Input'ları temizle
      setName("");
      setDosage("");
    } catch (error) {
      console.error("Hata:", error);
      alert("İlaç eklenirken bir hata oluştu!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Yeni İlaç Ekle</h2>

        <input
          type="text"
          placeholder="İlaç Adı"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full mb-3 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />

        <input
          type="text"
          placeholder="Dozaj"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          className="border p-2 w-full mb-3 rounded text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-3 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:opacity-50"
          >
            İptal
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading || !name.trim() || !dosage.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
