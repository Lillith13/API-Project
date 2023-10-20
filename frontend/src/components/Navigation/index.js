import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <>
      <div>
        <h1>
          <i class="fa-brands fa-airbnb"></i>
          AirBurbs
        </h1>
      </div>
      <div>
        <ul>
          <li>
            <NavLink exact to="/">
              {/* <button onClick={}></button> */}
              Home
            </NavLink>
          </li>
          {isLoaded && (
            <li>
              <ProfileButton user={sessionUser} />
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

export default Navigation;
