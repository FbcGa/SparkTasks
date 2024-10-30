import React, { useState, useRef, useContext } from "react";
import { Context } from "../store/appContext";

export function AddThings({ textItem, id }) {
  const { actions } = useContext(Context);
  const [item, setItem] = useState(false);
  const addRef = useRef();

  const addItem = async () => {
    const inputValue = addRef.current.value.trim();
    if (!inputValue) return;

    if (id) {
      await actions.addTask(inputValue, id);
    } else {
      await actions.addList(inputValue);
    }
    addRef.current.value = "";
    setItem(false);
  };

  return (
    <section className="add-things-container">
      {item ? (
        <div className="input-container">
          <textarea
            className="text-input"
            ref={addRef}
            placeholder="Write a title"
          ></textarea>
          <button onClick={addItem} className="add-button">
            <i className="fa-solid fa-plus"></i>
            <span>Add a {textItem}</span>
          </button>
        </div>
      ) : (
        <button className="toggle-button" onClick={() => setItem(true)}>
          <i className="fa-solid fa-plus"></i>
          <span>Add a {textItem}</span>
        </button>
      )}
    </section>
  );
}
