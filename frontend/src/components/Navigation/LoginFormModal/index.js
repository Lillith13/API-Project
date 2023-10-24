/* BoilerPlate */
import React, { useState } from "react";
import { useDispatch } from "react-redux";

/* Import Necessities */
import * as sessionActions from "../../../store/session";
import { useModal } from "../../../context/Modal";

/* Import Related CSS */
import "./LoginForm.css";

/* Build & Export Modal --- LogIn Form */
function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
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
            type="text"
            value={credential}
            placeholder="Username or Email..."
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        {(!credential || credential.length < 4) && (
          <p className="errors">* Username or Email Required</p>
        )}

        <div className="inputs">
          <input
            type="password"
            value={password}
            placeholder="Password..."
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {(!password || password.length < 6) && (
          <p className="errors">* Password Required</p>
        )}

        <div className="submitButton">
          <button
            type="submit"
            disabled={!(credential && password) ? true : false}
          >
            Log In
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
