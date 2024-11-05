import React, { useRef, useContext, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const { actions } = useContext(Context);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const resp = await actions.login(email, password);

    if (resp) {
      navigate("/");
    } else {
      setError("The provided credentials are incorrect..");
    }
  };

  return (
    <section className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <h1 className="form-title">Login</h1>
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            id="email"
            ref={emailRef}
            className="input-field"
            placeholder="Enter your email"
            required
          />

          {error ? (
            <div className="error">
              <p>{error}</p>
            </div>
          ) : (
            <div className="form-text">
              We'll never share your email with anyone else.
            </div>
          )}
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
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Submit
        </button>
      </form>

      <button type="button" className="register-button">
        <Link to={"/register"} className="register-link">
          If you don't have an account, click here!!
        </Link>
      </button>
    </section>
  );
}
