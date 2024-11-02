import React, { useContext, useRef, useState } from "react";
import { Context } from "../store/appContext";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function SortableTask({ task, listId }) {
  const { store, actions } = useContext(Context);
  const [editMode, setEditMode] = useState(false);
  const refTask = useRef();

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
    id: task.id,
    data: {
      task,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const changeTitleTask = (e) => {
    if (e.key !== "Enter") return;
    setEditMode(false);
    const titleTask = refTask.current.value;
    //acaaaaa va ir la funcion para cambiar el titulo del task
  };

  if (editMode) {
    return (
      <div
        className="task-item"
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
      >
        <input
          type="text"
          onKeyDown={changeTitleTask}
          autoFocus
          onBlur={() => setEditMode(false)}
          ref={refTask}
        />

        <button
          type="button"
          onClick={() => deleteTask(task.id, listId)}
          className="task-delete-button"
        >
          <i className="fa-solid fa-trash"></i>
        </button>
      </div>
    );
  }

  if (isDragging)
    return (
      <div className="task-item drag" ref={setNodeRef} style={style}></div>
    );

  return (
    <div
      className="task-item"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => setEditMode(true)}
    >
      <p className="task-text">
        {task.text} - {task.id}{" "}
      </p>

      <button
        type="button"
        onClick={() => deleteTask(task.id, listId)}
        className="task-delete-button"
      >
        <i className="fa-solid fa-trash"></i>
      </button>
    </div>
  );
}