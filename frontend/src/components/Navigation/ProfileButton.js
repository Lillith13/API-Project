/* BoilerPlate */
import React, { useState, useEffect, useRef } from "react";

/* Import Necessities */
import OpenModalMenuItem from "./OpenModalMenuItem";
import MenuModal from "./MenuModal";

/* Import Related CSS */

/* Build & Export Component --- Menu/Profile Button */
function ProfileButton() {
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const propData = {
    closeMenu,
  };

  return (
    <div>
      <OpenModalMenuItem
        onItemClick={closeMenu}
        modalComponent={<MenuModal propData={propData} />}
      />
    </div>
  );
}

export default ProfileButton;
