import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "motion/react";
import AnimatedList from "../components/AnimatedList";
import ProfileSection from "../components/ProfileSection";
import { useNavigate } from "react-router-dom";

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

export function Profiles({ users, medicines }) {
  const navigate = useNavigate();
  const [selectUser, setSelectedUser] = useState(null);

  // user seçimi handler'ı
  const handleUserSelect = (user, index) => {
    console.log("Selected medicine:", user, "at index:", index);
    setSelectedUser(user);
  };
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
      <div className="flex flex-row mt-12 justify-between">
        {" "}
        {/* mid-container */}
        <div className="">
          {" "}
          {/* profile-section */}
          <ProfileSection selectedUser={selectUser} medicines={medicines} />
        </div>
        <div className="mt-5">
          {" "}
          {/* list-section */}
          <input className="w-[350px] h-6 mb-2"></input> {/* search-bar */}
          <AnimatedList
            listItems={users}
            onItemSelect={handleUserSelect}
            showGradients={true}
            enableArrowNavigation={true}
            displayScrollbar={true}
          />
          <button className="mt-2">yeni profil ekle</button> {/* add-profile */}
        </div>
      </div>
    </div>
  );
}
