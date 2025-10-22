import { useState } from "react";
import axios from "axios";

export function AddProfileModal({ onClose, onUserAdded }) {
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      alert("Lütfen isim giriniz!");
      return;
    }

    setIsLoading(true);

    try {
      // Parent component'e veri gönder ve işlenmesini bekle
      if (onUserAdded) {
        await onUserAdded({ name: name.trim() });
      }

      // Input'u temizle
      setName("");
    } catch (error) {
      console.error("Hata:", error);
      alert("Kullanıcı eklenirken bir hata oluştu!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-80">
        <h2 className="text-lg font-semibold mb-4">Yeni Profil Ekle</h2>

        <input
          type="text"
          placeholder="Ad Soyad"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
            disabled={isLoading || !name.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </div>
    </div>
  );
}
