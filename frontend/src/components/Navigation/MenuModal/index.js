/* BoilerPlate */
import React from "react";
import { useDispatch } from "react-redux";

/* Import Necessities */
import * as sessionActions from "../../../store/session";
import OpenModalMenuItem from "../OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignUpFormModal";
import { useModal } from "../../../context/Modal";

/* Import Related CSS */

/* Build and Export Modal --- Menu/Profile */
export default function MenuModal({ propData }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const { closeMenu, user } = propData;

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout()).then(closeModal);
  };

  // ! work on attaching menu model directionly beneath the menu/profile button instead of displaying in the middle of the screen

  return (
    <div>
      {user ? (
        <div className="dropdownmenu" style={{ textAlign: "center" }}>
          <p id="menuText">{user.username}</p>
          <p id="menuText">
            {user.firstName} {user.lastName}
          </p>
          <p id="menuText">{user.email}</p>
          <button onClick={logout} id="logoutButton" style={{ width: "100%" }}>
            Log Out
          </button>
        </div>
      ) : (
        <div>
          <OpenModalMenuItem
            itemText="Log In"
            onItemClick={closeMenu}
            modalComponent={<LoginFormModal />}
          />
          <OpenModalMenuItem
            itemText="Sign Up"
            onItemClick={closeMenu}
            modalComponent={<SignupFormModal />}
          />
        </div>
      )}
    </div>
  );
}
