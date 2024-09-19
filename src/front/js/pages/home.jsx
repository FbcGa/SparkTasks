import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useAuth } from "../hooks/authUser";
import { AddThings } from "../component/addThings.jsx";
import "../../styles/home.css";

export const Home = () => {
  const { store, actions } = useContext(Context);

  useAuth();

  const deleteList = async (id) => {
    await actions.deleteList(id);
  };

  const deleteTask = async (id, listId) => {
    const resp = await actions.deleteTask(id, listId);
    console.log(resp);
  };
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
              <div className="dropdown">
                <button
                  className="btn"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fa-solid fa-ellipsis"></i>
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <button onClick={() => deleteList(list.id)}>
                      <i className="fa-solid fa-trash"></i>
                      <span>Delete</span>
                    </button>
                  </li>
                </ul>
              </div>
            </section>

            {list.tasks?.length > 0
              ? list.tasks.map((task) => (
                  <div key={task.id} className="d-flex">
                    <p className="flex-grow-1 fs-5 font-monospace mx-2 ps-2 border border-black span-3">
                      {task.text}
                    </p>
                    <button
                      onClick={() => deleteTask(task.id, list.id)}
                      className="m-0"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                ))
              : null}
            <AddThings textItem="Task" id={list.id} />
          </li>
        ))}
      </ul>

      <AddThings textItem="List" />
    </main>
  );
};
