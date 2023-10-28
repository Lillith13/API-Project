/* BoilerPlate */
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

/* Import Necessities */
import * as sessionActions from "../../../store/session";
import OpenModalMenuItem from "../OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignUpFormModal";
import { useModal } from "../../../context/Modal";

/* Import Related CSS */
import "./MenuModal.css";

/* Build and Export Modal --- Menu/Profile */
export default function MenuModal({ propData }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.session);
  const { closeModal } = useModal();
  const { closeMenu } = propData;
  const [demoUser, setDemoUser] = useState("");
  const [userSpots, setUserSpots] = useState([]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout())
      .then(closeModal)
      .then(() => history.push("/"));
  };

  // ! work on attaching menu model directly beneath the menu/profile button instead of displaying in the middle of the screen

  return (
    <div className="dropdownmenu">
      {user ? (
        <div style={{ textAlign: "center" }}>
          <div style={{ borderBottom: "1px solid black" }}>
            <p>Hello, {user.firstName}</p>
            <p>{user.email}</p>
          </div>
          <div
            className="manageORcreateDiv"
            style={{
              borderBottom: "1px solid black",
              padding: "15px",
              fontSize: "20px",
            }}
          >
            {user.ownsSpots ? (
              <div className="userTools">
                <Link to="/mySpots" onClick={closeModal}>
                  Manage Spots
                </Link>
                <Link to="/myReviews" onClick={closeModal}>
                  Manage Reviews
                </Link>
              </div>
            ) : (
              <Link to="/mySpots/new" onClick={closeModal}>
                Create A Spot
              </Link>
            )}
          </div>
          <button
            onClick={logout}
            id="logoutButton"
            style={{ width: "100%", marginTop: "15px" }}
          >
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
