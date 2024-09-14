import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
  const { store, actions } = useContext(Context);
  const [card, setCard] = useState([]);

  const addCard = () => {
    return (
      <div className="form-floating">
        <textarea
          className="form-control"
          placeholder="Leave a comment here"
          id="floatingTextarea"
        ></textarea>
        <label htmlFor="floatingTextarea">Comments</label>
      </div>
    );
  };
  return (
    <div className="bg-secondary mt-5" style={{ width: "200px" }}>
      <div className="d-flex">
        <h5>To Do</h5>
        <button className="btn btn-primary">
          <i className="fa-solid fa-ellipsis"></i>
        </button>
      </div>
      <div>
        <button className="btn btn-primary" onClick={addCard}>
          <i className="fa-solid fa-plus"></i>
        </button>
        <span>Add a card</span>
      </div>
    </div>
  );
};
