import React from "react";

export function Tasks() {
  return list.tasks?.length > 0
    ? list.tasks.map((task) => (
        <div
          key={task.id}
          className="d-flex justify-content-between align-items-center p-2"
        >
          <div className="flex-grow-1 fs-5 font-monospace border border-black ps-2">
            {task.text}
          </div>
          <button
            type="button"
            onClick={() => deleteTask(task.id, list.id)}
            className="btn btn-danger btn-sm m-0"
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        </div>
      ))
    : null;
}
