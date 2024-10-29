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
    <section className="d-flex flex-column m-auto align-items-center p-5 mt-5">
      <form onSubmit={handleSubmit} className="text-black">
        <div className="mb-3">
          <h1 className="text-center text-black fw-bold">Register</h1>
          <label htmlFor="exampleInputEmail1" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            ref={emailRef}
            placeholder="Enter your email"
          />
          <div id="emailHelp" className="form-text">
            We'll never share your email with anyone else.
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            ref={passwordRef}
            placeholder="Enter your password"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Submit
        </button>
      </form>
      <button type="button" className="btn btn-secondary w-100 mt-3">
        <Link className="text-white" to={"/login"}>
          If you have an account, click here!!
        </Link>
      </button>
    </section>
  );
}
