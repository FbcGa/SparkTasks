import React, { useContext } from "react";
import { AddThings } from "./addThings.jsx";
import { Context } from "../store/appContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableList({ list }) {
  const { actions } = useContext(Context);

  const deleteList = async (id) => {
    await actions.deleteList(id);
  };

  const deleteTask = async (id, listId) => {
    await actions.deleteTask(id, listId);
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: list.id,
    data: {
      list,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <li className="list-item dragging" ref={setNodeRef} style={style}></li>
    );
  }
  return (
    <li className="list-item" ref={setNodeRef} style={style}>
      <section className="list-header" {...attributes} {...listeners}>
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
  );
}
