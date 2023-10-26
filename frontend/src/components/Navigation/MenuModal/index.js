/* BoilerPlate */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

/* Import Necessities */
import * as sessionActions from "../../../store/session";
import * as spotActions from "../../../store/spots";
import OpenModalMenuItem from "../OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignUpFormModal";
import { useModal } from "../../../context/Modal";

/* Import Related CSS */

/* Build and Export Modal --- Menu/Profile */
export default function MenuModal({ propData }) {
  const history = useHistory();
  const dispatch = useDispatch();
  const session = useSelector((state) => state.session);
  const spots = useSelector((state) => state.spots);
  const { closeModal } = useModal();
  const { closeMenu, user } = propData;
  const [demoUser, setDemoUser] = useState("");
  const [userSpots, setUserSpots] = useState([]);

  useEffect(() => {
    dispatch(spotActions.loadAllSpots()).then((spotsArr) => {
      if (session.user) {
        const uSpots = spotsArr.filter(
          (spot) => spot.ownerId === session.user.id
        );
        setUserSpots(uSpots);
      }
    });
  }, [dispatch]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout())
      .then(closeModal)
      .then(() => history.push("/"));
  };

  // ! work on attaching menu model directly beneath the menu/profile button instead of displaying in the middle of the screen

  return (
    <div>
      {user ? (
        <div className="dropdownmenu" style={{ textAlign: "center" }}>
          <div style={{ borderBottom: "1px solid black" }}>
            <p>Hello, {user.firstName}</p>
            <p>{user.email}</p>
          </div>
          <div style={{ borderBottom: "1px solid black", padding: "15px" }}>
            {userSpots.length > 0 && userSpots != "undefined" ? (
              <Link to="/mySpots">Manage Your Spots</Link>
            ) : (
              <Link to="/mySpots/new">Create A Spot</Link>
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
