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
          <input
            type="email"
            value={email}
            placeholder="Email..."
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        {errors.email && <p className="errors">* {errors.email}</p>}

        <div className="inputs">
          <input
            type="text"
            value={username}
            placeholder="Username..."
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        {errors.username && <p className="errors">* {errors.username}</p>}

        <div className="inputs">
          <input
            type="text"
            value={firstName}
            placeholder="First Name..."
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        {errors.firstName && <p className="errors">* {errors.firstName}</p>}

        <div className="inputs">
          <input
            type="text"
            value={lastName}
            placeholder="Last Name..."
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        {errors.lastName && <p className="errors">* {errors.lastName}</p>}

        <div className="inputs">
          <input
            type="password"
            value={password}
            placeholder="Password..."
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {password && password.length < 6 && (
          <p className="errors">* Password must be 6+ characters</p>
        )}
        {errors.password && <p className="errors">* {errors.password}</p>}

        <div className="inputs">
          <input
            type="password"
            value={confirmPassword}
            placeholder="Confirm Password..."
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {password !== confirmPassword && (
          <p className="errors">* Must match Paswsword</p>
        )}
        {errors.confirmPassword && (
          <p className="errors">* {errors.confirmPassword}</p>
        )}

        <div className="submitButton">
          <button
            type="submit"
            disabled={
              email.length > 0 &&
              username.length >= 4 &&
              firstName.length > 0 &&
              lastName.length > 0 &&
              password === confirmPassword
                ? false
                : true
            }
          >
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;
