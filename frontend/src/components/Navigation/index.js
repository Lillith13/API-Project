/* BoilerPlate */
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

/* Import Necssities */
import ProfileButton from "./ProfileButton";

/* Import Related CSS */
import "./Navigation.css";

/* Build & Export Component */
function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [position, setPosition] = useState("relative");

  window.addEventListener("scroll", () => {
    if (window.scrollY >= 5) {
      setPosition("fixed");
    } else {
      setPosition("relative");
    }
  });

  return (
    <nav
      className="navigationBar"
      style={
        position === "relative" ? { position } : { position, width: "96.2%" }
      }
    >
      <a href="/">
        <h1 className="logo">
          <i className="fa-brands fa-airbnb"></i>
          AirBurbs
        </h1>
      </a>
      {isLoaded && (
        <div className="navLinksDiv">
          {sessionUser && (
            <NavLink to="/mySpots/new">Create a New Spot</NavLink>
          )}
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
