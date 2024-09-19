import React, { useState, useRef, useContext } from "react";
import { Context } from "../store/appContext";

export function AddThings({ textItem, id }) {
  const { actions } = useContext(Context);
  const [item, setItem] = useState(false);
  const addRef = useRef();

  const addItem = async () => {
    if (id) {
      const text = addRef.current.value;
      await actions.addTask(text, id);
    } else {
      const title = addRef.current.value;
      await actions.addList(title);
    }
    addRef.current.value = "";
    setItem(false);
  };

  return (
    <section style={{ width: "280px" }}>
      {item ? (
        <div className="form-floating">
          <textarea
            className="form-control"
            id="floatingTextarea"
            ref={addRef}
          ></textarea>
          <label htmlFor="floatingTextarea">Write a title</label>
          <button onClick={addItem}>
            <i className="fa-solid fa-plus"></i>
            <span>Add a {textItem} </span>
          </button>
        </div>
      ) : (
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => setItem(true)}
        >
          <i className="fa-solid fa-plus"></i>
          <span>Add a {textItem}</span>
        </button>
      )}
    </section>
  );
}
