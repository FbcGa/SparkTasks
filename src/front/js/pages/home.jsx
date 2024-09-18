import React, { useContext, useEffect, useRef, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import "../../styles/home.css";

export const Home = () => {
  const [postState, setPostState] = useState(false);
  const { store, actions } = useContext(Context);
  const inputRef = useRef();
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const handleSubmit = async (event, id) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const resp = await actions.addTask(inputRef.current.value, id);
      inputRef.current.value = "";
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
    actions.allList();
  }, []);

  return (
    <main className="container">
      <ul className="row list-unstyled gap-4 mt-5">
        {store.list?.map((list) => (
          <li
            className="col-sm-6 col-md-4 col-lg-3"
            style={{ width: "300px", background: "rgb(91, 153, 194)" }}
            key={list.id}
          >
            <section className="m-0 p-0 d-flex justify-content-between align-items-center">
              <h5 className="m-0 mx-2 p-0 fs-2 fw-semibold font-monospace">
                {list.title}
              </h5>
              <button className="btn">
                <i className="fa-solid fa-ellipsis"></i>
              </button>
            </section>

            {list.tasks?.length > 0
              ? list.tasks.map((task) => (
                  <p
                    key={task.id}
                    className="fs-5 font-monospace mx-2 ps-2 border border-black"
                  >
                    {task.text}
                  </p> // Generar una key única
                ))
              : null}
            {postState === true ? (
              <form className="mx-1">
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="2"
                  ref={inputRef}
                  onKeyDown={() => handleSubmit(event, list.id)}
                ></textarea>
              </form>
            ) : null}

            <section className="ps-1">
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={() => setPostState(true)}
              >
                <i className="fa-solid fa-plus"></i>
                <span>Add a card</span>
              </button>
            </section>
          </li>
        ))}
      </ul>
    </main>
  );
};
