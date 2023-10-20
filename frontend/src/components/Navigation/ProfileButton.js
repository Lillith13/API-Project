import React, { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";

export default function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      // if (!ulRef.current.contains(e.target)) {
      setShowMenu(false);
      // }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  // set hidden in css
  const ulClassName = "profile-dropdown" + (showMenu ? "" : "hidden");

  const { username, firstName, lastName, email } = user;

  return (
    <>
      <button onClick={openMenu}>
        <i className="fas fa-user-circle" />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <li>{username}</li>
        <li>
          {firstName} {lastName}
        </li>
        <li>{email}</li>
        <li>
          <button onClick={logout}>Log Out</button>
        </li>
      </ul>
    </>
  );
}
