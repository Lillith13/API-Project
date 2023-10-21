/* BoilerPlate */
import React from "react";
import { useDispatch } from "react-redux";

/* Import Necessities */
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "./LoginFormModal";
import SignupFormModal from "./SignUpFormModal";
import { useModal } from "../../context/Modal";

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

  return (
    <div>
      {user ? (
        <div className="userInfo">
          <li>{user.username}</li>
          <li>
            {user.firstName} {user.lastName}
          </li>
          <li>{user.email}</li>
          <button onClick={logout}>Log Out</button>
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
