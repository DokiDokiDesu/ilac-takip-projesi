import AnimatedList from "../components/AnimatedList";
import { useNavigate } from "react-router-dom";
import MedicineSection from "../components/MedicineSection";

const items = [
  "Item 1",
  "Item 2",
  "Item 3",
  "Item 4",
  "Item 5",
  "Item 6",
  "Item 7",
  "Item 8",
  "Item 9",
  "Item 10",
];

export function MedicinePage() {
  const navigate = useNavigate();
  return (
    <div className="grid">
      {" "}
      {/* main-container */}
      <div className="fixed top-0 left-0 h-[70px] w-full flex">
        {" "}
        {/* top-container */}
        <button
          className="inline-block h-12 text-sm ml-2 mt-2"
          onClick={() => navigate("/")}
        >
          {" "}
          {/* back */}
          geri dön
        </button>
      </div>
      <div className="flex flex-row">
        {" "}
        {/* mid-container */}
        <MedicineSection />
        <div className="mt-5">
          {" "}
          {/* list-section */}
          <input className="w-[350px] h-6 mb-2 "></input> {/* search-bar */}
          <AnimatedList
            items={items}
            onItemSelect={(item, index) => console.log(item, index)}
            showGradients={true}
            enableArrowNavigation={true}
            displayScrollbar={true}
          />
          <button className="mt-2">yeni ilaç ekle</button> {/* add-profile */}
        </div>
      </div>
    </div>
  );
}
