/* BoilerPlate */
import React, { useState } from "react";
import { useDispatch } from "react-redux";

/* Import Necessities */
import { useModal } from "../../../context/Modal";
import * as sessionActions from "../../../store/session";
import "./SignupForm.css";

/* Import Related CSS */

/* Build & Export Modal - SignUp Form */
function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword:
        "Confirm Password field must be the same as the Password field",
    });
  };

  return (
    <div className="signUpModal">
      <h1 className="header">Sign Up</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="inputs">
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {errors.email && <p className="errors">* {errors.email}</p>}

        <div className="inputs">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {errors.username && <p className="errors">* {errors.username}</p>}

        <div className="inputs">
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        {errors.firstName && <p className="errors">* {errors.firstName}</p>}

        <div className="inputs">
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        {errors.lastName && <p className="errors">* {errors.lastName}</p>}

        <div className="inputs">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {errors.password && <p className="errors">* {errors.password}</p>}

        <div className="inputs">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {errors.confirmPassword && (
          <p className="errors">* {errors.confirmPassword}</p>
        )}

        <div className="submitButton">
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;
