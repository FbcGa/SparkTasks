import React, { useContext, useRef, useState } from "react";
import { Context } from "../store/appContext";
import { useAuth } from "../hooks/authUser";
import "../../styles/home.css";

export const Home = () => {
  const [postState, setPostState] = useState(false);
  const [createList, setCreateList] = useState(false);
  const { store, actions } = useContext(Context);
  const addTaskRef = useRef();
  const addListRef = useRef();

  useAuth();

  const addTasks = async (id) => {
    const text = addTaskRef.current.value;
    console.log(text);
    await actions.addTask(text, id);
  };

  const addLists = async () => {
    const title = addListRef.current.value;
    await actions.addList(title);
    setCreateList(false);
  };

  return (
    <main className="container d-flex gap-5">
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
                  </p>
                ))
              : null}
            {postState === true ? (
              <div className="form-floating">
                <textarea
                  className="form-control"
                  id="floatingTextarea1"
                  ref={addTaskRef}
                ></textarea>
                <label htmlFor="floatingTextarea1">Write a task</label>
                <button onClick={() => addTasks(list.id)}>
                  <i className="fa-solid fa-plus"></i>
                  <span>Add a taks</span>
                </button>
              </div>
            ) : null}

            <section className="ps-1">
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={() => setPostState(true)}
              >
                <i className="fa-solid fa-plus"></i>
                <span>Add a Task</span>
              </button>
            </section>
          </li>
        ))}
      </ul>

      <section className="ps-1 mt-5">
        {createList ? (
          <div className="form-floating">
            <textarea
              className="form-control"
              id="floatingTextarea"
              ref={addListRef}
            ></textarea>
            <label htmlFor="floatingTextarea">Write a title</label>
            <button onClick={addLists}>
              <i className="fa-solid fa-plus"></i>
              <span>Add a List</span>
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => setCreateList(true)}
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add a List</span>
          </button>
        )}
      </section>
    </main>
  );
};
