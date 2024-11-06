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
        <div className="input-container" onClick={handleAddItem}>
          <textarea
            className="text-input"
            ref={addRef}
            placeholder={`Write a new ${textItem}`}
            onKeyDown={handleKeyDown}
            autoFocus
            onBlur={() => setItem(false)}
          ></textarea>
        </div>
      ) : (
        <button className="toggle-button" onClick={() => setItem(true)}>
          <Plus />
          <span>Add</span>
        </button>
      )}
    </section>
  );
}
