import { useState, useEffect } from "react";
import reactLogo from "../assets/react.svg";
import viteLogo from "/vite.svg";
import "../App.css";
import CardNav from "../components/CardNav";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const items = [
  {
    label: "Profiller",
    bgColor: "#0D0716",
    textColor: "#fff",
    icon: "/icons8-test-account-48.png",
  },
  {
    label: "İlaçlar",
    bgColor: "#170D27",
    textColor: "#fff",
  },
  {
    label: "Takvim",
    bgColor: "#271E37",
    textColor: "#fff",
  },
];

export function Homepage({ medicineUsers = [], medicines = [], users = [] }) {
  const location = useLocation();

  useEffect(() => {
    // Sayfa yüklendiğinde ve rota değiştiğinde kontrol et
    if (location.pathname === "/") {
      // Sayfayı yenile
      const needsRefresh = sessionStorage.getItem("needsRefresh");
      if (needsRefresh === "true") {
        sessionStorage.removeItem("needsRefresh");
        window.location.reload();
      }
    } else {
      // Başka sayfaya gidildiğinde flag'i set et
      sessionStorage.setItem("needsRefresh", "true");
    }
  }, [location]);

  // Bugün işaretlenen ilaçları tutmak için state
  const [markedMedicines, setMarkedMedicines] = useState([]);
  // Bugünün tarihini tutmak için state
  const [today, setToday] = useState(new Date().toISOString().split("T")[0]);

  // Backend'den bugün alınan ilaçları getir
  useEffect(() => {
    const fetchTakenMedicines = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/medicine-taken/${today}`
        );
        if (!response.ok) throw new Error("Veri getirilemedi");
        const data = await response.json();
        setMarkedMedicines(data);
      } catch (error) {
        console.error("Alınan ilaçlar getirilemedi:", error);
      }
    };

    fetchTakenMedicines();
  }, [today]);

  // Bugün ilaç alması gereken kişileri ve ilaçlarını grupla
  const getTodaysUsersAndMedicines = () => {
    try {
      console.log("Gelen medicineUsers:", medicineUsers);
      console.log("Gelen medicines:", medicines);
      console.log("Gelen users:", users);

      // Önce bugün ilaç alması gereken kayıtları filtrele
      const todaysMedicineUsers = medicineUsers.filter((mu) => {
        try {
          // Geçersiz tarih kontrolü
          if (
            !mu.start_date ||
            !mu.end_date ||
            !Date.parse(mu.start_date) ||
            !Date.parse(mu.end_date)
          ) {
            console.log("Geçersiz tarih:", mu);
            return false;
          }

          const startDate = new Date(mu.start_date);
          const endDate = new Date(mu.end_date);
          const today = new Date();

          // Yıl kontrolü - mantıksız yılları filtrele
          if (startDate.getFullYear() > 2100 || endDate.getFullYear() > 2100) {
            console.log("Mantıksız tarih aralığı:", mu);
            return false;
          }

          const isInRange = today >= startDate && today <= endDate;
          const isNotMarked = !markedMedicines.includes(mu.id);
          const medicineExists = medicines.some((m) => m.id === mu.medicine_id);

          console.log("İlaç kontrolü:", {
            id: mu.id,
            user_id: mu.user_id,
            medicine_id: mu.medicine_id,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            isInRange,
            isNotMarked,
            medicineExists,
          });

          return isInRange && isNotMarked && medicineExists;
        } catch (error) {
          console.error("Tarih işleme hatası:", error, mu);
          return false;
        }
      });

      // Kullanıcıları ve ilaçlarını grupla
      console.log("Filtrelenmiş todaysMedicineUsers:", todaysMedicineUsers);

      const userMedicineMap = todaysMedicineUsers.reduce((acc, mu) => {
        const user = users.find((u) => u.id === mu.user_id);
        if (!user) {
          console.log("Kullanıcı bulunamadı:", mu.user_id);
          return acc;
        }

        if (!acc[user.id]) {
          acc[user.id] = {
            user: user,
            medicines: [],
          };
        }

        const medicine = medicines.find((m) => m.id === mu.medicine_id);
        if (medicine) {
          acc[user.id].medicines.push({
            ...medicine,
            relationId: mu.id,
            dosage: mu.medicine_dosage,
            dailyDosage: mu.daily_dosage,
          });
          console.log(
            `${user.name} kullanıcısına ${medicine.name} ilacı eklendi`
          );
        } else {
          console.log("İlaç bulunamadı:", mu.medicine_id);
        }

        return acc;
      }, {});

      const result = Object.values(userMedicineMap);
      console.log("Son oluşturulan liste:", result);
      return result;
    } catch (error) {
      console.error("Error processing users and medicines:", error);
      return [];
    }
  };

  // Her gün gece yarısında listeyi otomatik güncelle
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow - now;

    const timer = setTimeout(() => {
      setToday(new Date().toISOString().split("T")[0]);
    }, timeUntilMidnight);

    return () => clearTimeout(timer);
  }, [today]);

  // İlaç alındı işaretle
  const handleMarkMedicine = async (medicineUserId) => {
    try {
      console.log("İlaç işaretleme isteği gönderiliyor:", { medicineUserId });

      const response = await fetch("http://localhost:5000/api/medicine-taken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ medicine_user_id: medicineUserId }),
      });

      console.log("Sunucu yanıtı:", {
        status: response.status,
        statusText: response.statusText,
      });

      const responseData = await response.json();
      console.log("Yanıt verisi:", responseData);

      if (!response.ok) {
        throw new Error(responseData.error || "İşlem başarısız");
      }

      // State'i güncelle
      setMarkedMedicines((prev) => [...prev, medicineUserId]);
    } catch (error) {
      console.error("İlaç alındı işaretlenemedi:", error);
      alert(
        error.message || "İlaç alındı olarak işaretlenirken bir hata oluştu!"
      );
    }
  };

  // Filtrelenmiş kullanıcı ve ilaç listesi
  const todaysUsersAndMedicines = getTodaysUsersAndMedicines();

  return (
    <div className="grid">
      <CardNav items={items} />
      <div className="mt-4 px-4">
        <p className="text-[30px] text-gray-100 mb-[10px]">
          Bugün İlaç Alacak Kişiler
        </p>
        <div className="bg-gray-500 w-full max-w-4xl">
          <ScrollMenu className="flex flex-row overflow-x-auto whitespace-nowrap">
            {todaysUsersAndMedicines.map(({ user, medicines }) => (
              <div
                key={user.id}
                className="px-4 py-2 m-2 bg-gray-200 rounded-lg whitespace-nowrap h-auto w-64 inline-block relative"
              >
                <h3 className="font-bold text-xl mb-3 text-black">
                  {user.name}
                </h3>
                <div className="space-y-3 text-black">
                  {medicines.map((medicine) => (
                    <div
                      key={medicine.relationId}
                      className="bg-white p-2 rounded shadow"
                    >
                      <p className="font-semibold">{medicine.name}</p>
                      <p className="text-sm">
                        Günlük Doz: {medicine.dailyDosage}
                      </p>
                      <p className="text-sm">Doz: {medicine.dosage}</p>
                      <button
                        onClick={() => handleMarkMedicine(medicine.relationId)}
                        className="mt-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm w-full"
                      >
                        ✓ Alındı
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {todaysUsersAndMedicines.length === 0 && (
              <div className="px-4 py-2 m-2 bg-gray-200 rounded-lg">
                Bugün için ilaç alacak kimse yok
              </div>
            )}
          </ScrollMenu>
        </div>
      </div>
    </div>
  );
}
