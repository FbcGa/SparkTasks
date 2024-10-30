import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useAuth } from "../hooks/authUser";
import { AddThings } from "../component/addThings.jsx";
import "../../styles/home.css";
import { DndContext } from "@dnd-kit/core";

export const Home = () => {
  const { store, actions } = useContext(Context);

  useAuth();

  const deleteList = async (id) => {
    await actions.deleteList(id);
  };

  const deleteTask = async (id, listId) => {
    await actions.deleteTask(id, listId);
  };

  return (
    <main className="home-container">
      <DndContext>
        <ul className="list-container">
          {store.list?.map((list) => (
            <li className="list-item" key={list.id}>
              <section className="list-header">
                <h5 className="list-title">{list.title}</h5>
                <div className="dropdown">
                  <button className="dropdown-button">
                    <i className="fa-solid fa-ellipsis"></i>
                  </button>
                  <div className="dropdown-menu">
                    <div className="dropdown-item">
                      <button
                        type="button"
                        onClick={() => deleteList(list.id)}
                        className="delete-button"
                      >
                        <i className="fa-solid fa-trash"></i>
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </section>

              {list.tasks?.length > 0 &&
                list.tasks.map((task) => (
                  <div className="task-item" key={task.id}>
                    <div className="task-text">{task.text}</div>
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id, list.id)}
                      className="task-delete-button"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                ))}

              <div className="add-task-container">
                <AddThings textItem="Task" id={list.id} />
              </div>
            </li>
          ))}
        </ul>
      </DndContext>

      <AddThings textItem="List" />
    </main>
  );
};
