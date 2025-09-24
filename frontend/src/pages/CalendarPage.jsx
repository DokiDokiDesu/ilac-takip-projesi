import { Calendar } from "../components/Calendar";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarInfoSection } from "../components/CalendarInfoSection";

export function CalendarPage() {
  const [date, setDate] = useState();
  const navigate = useNavigate();

  return (
    <div className="grid">
      {/*main-container*/}

      <div className="flex top-0 left-0 w-full fixed">
        {/*top container*/}
        <button
          className="inline-block h-12 text-sm ml-2 mt-2"
          onClick={() => navigate("/")}
        >
          {" "}
          {/* back */}
          geri dön
        </button>
      </div>
      <div className="flex gap-8">
        {/*mid container*/}

        <CalendarInfoSection />

        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-lg border"
        />
      </div>
    </div>
  );
}
