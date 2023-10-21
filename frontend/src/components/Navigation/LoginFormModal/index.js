import React, { useState } from "react";
import { useDispatch } from "react-redux";

import * as sessionActions from "../../../store/session";
import { useModal } from "../../../context/Modal";
import "./LoginForm.css";

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
        <div className="inputs">
          <label>Username or Email</label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        {errors.credential && <p className="errors">* {errors.credential}</p>}

        <div className="inputs">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="submitButton">
          <button type="submit">Log In</button>
        </div>
      </form>
    </div>
  );
}

export default LoginFormModal;
