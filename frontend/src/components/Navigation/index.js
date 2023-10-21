/* BoilerPlate */
import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

/* Import Necssities */
import ProfileButton from "./ProfileButton";

/* Import Related CSS */
import "./Navigation.css";

/* Build & Export Component */
function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="navigationBar">
      <NavLink exact to="/">
        <h1 className="logo">
          <i className="fa-brands fa-airbnb"></i>
          AirBurbs
        </h1>
      </NavLink>
      {isLoaded && <ProfileButton user={sessionUser} />}
    </nav>
  );
}

export default Navigation;
