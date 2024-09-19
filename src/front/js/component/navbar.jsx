import React from "react";
import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  const isLogged = (token) => {
    if (token) {
      return (
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <button className="btn btn-link nav-link" onClick={handleSignIn}>
              <i className="fa-solid fa-right-to-bracket"></i>
            </button>
          </li>
        </ul>
      );
    }
    return;
  };

  const handleSignIn = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-md navbar-light bg-light">
      <Link className="navbar-brand ms-3" to="/">
        <span>Trello</span>
      </Link>
      <button
        className="navbar-toggler "
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      {isLogged(localStorage.getItem("token"))}
    </nav>
  );
};
