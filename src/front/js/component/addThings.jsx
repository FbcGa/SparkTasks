import React, { useState, useRef, useContext } from "react";
import { Context } from "../store/appContext";
import { Plus } from "lucide-react";

export function AddThings({ textItem, id }) {
  const { actions } = useContext(Context);
  const [item, setItem] = useState(false);
  const addRef = useRef();

  const handleAddItem = async () => {
    const inputValue = addRef.current?.value.trim();
    if (!inputValue) return;

    if (id) {
      await actions.addTask(inputValue, id);
    } else {
      await actions.addList(inputValue);
    }

    addRef.current.value = "";
    setItem(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddItem();
    }
  };

  return (
    <section className="add-things-container">
      {item ? (
        <div className="input-container">
          <textarea
            className="text-input"
            ref={addRef}
            placeholder={`Write a ${textItem} title`}
            onKeyDown={handleKeyDown}
            autoFocus
          ></textarea>
          <button onClick={handleAddItem} className="add-button">
            <i className="fa-solid fa-plus"></i>
            <span>Add a {textItem}</span>
          </button>
        </div>
      ) : (
        <button className="toggle-button" onClick={() => setItem(true)}>
          <Plus />
          <span>Add a {textItem}</span>
        </button>
      )}
    </section>
  );
}
