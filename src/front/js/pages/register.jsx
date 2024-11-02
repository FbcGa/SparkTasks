import React, { useRef, useContext } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export function Register() {
  const { actions } = useContext(Context);
  const emailRef = useRef();
  const passwordRef = useRef();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const resp = await actions.register(email, password);
    if (resp) {
      navigate("/");
    }
  };
  return (
    <section className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <h1 className="form-title">Register</h1>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            className="input-field"
            placeholder="Enter your email"
          />
          <div className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            ref={passwordRef}
            className="input-field"
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>

      <button type="button" className="register-button">
        <Link to={"/login"} className="register-link">
          If you have an account, click here!!
        </Link>
      </button>
    </section>
  );
}
