/* BoilerPlate */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Import Necessities */
import * as sessionActions from "../../../store/session";
import * as spotsActions from "../../../store/spots";
import { useModal } from "../../../context/Modal";

/* Import Related CSS */
import "./LoginForm.css";

/* Build & Export Modal --- LogIn Form */
function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [uProfile, setUProfile] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  return (
    <div className="logInModal">
      <h1 className="header">Log In</h1>
      <form onSubmit={handleSubmit}>
        {errors.credential && <p className="errors">* {errors.credential}</p>}
        <div className="inputs">
          <input
            id="credential"
            type="text"
            value={credential}
            placeholder="Username or Email..."
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        {credential && credential.length < 4 && (
          <p className="errors">* Username or Email Required</p>
        )}

        <div className="inputs">
          <input
            id="password"
            type="password"
            value={password}
            placeholder="Password..."
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {password && password.length < 6 && (
          <p className="errors">* Password Required</p>
        )}

        <select
          className="input"
          defaultValue="or Choose Demo User..."
          onChange={(e) => {
            setCredential(e.target.value);
            setPassword(`password${e.target.value[e.target.value.length - 1]}`);
          }}
        >
          <option disabled>or Choose Demo User...</option>
          <option value="demoUser1">demoUser1</option>
          <option value="demoUser2">demoUser2</option>
          <option value="demoUser3">demoUser3</option>
          <option value="demoUser4">demoUser4</option>
        </select>

        <div className="submitButtonDiv">
          <button
            className="submitButton"
            type="submit"
            disabled={
              !(credential && password) ||
              (credential.length < 4 && password.length < 6)
                ? true
                : false
            }
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
