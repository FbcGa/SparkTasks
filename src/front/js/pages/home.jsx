import React, { useRef, useState } from "react";
import ListFromUser from "../mocks/lists.json";

export const Home = () => {
  const [postState, setPostState] = useState(false);
  const inputRef = useRef();

  const handleSubmit = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      inputRef.current.value = "";
    }
  };
  const renderList = ListFromUser.lists;
  return (
    <main>
      {renderList?.map((list) => (
        <div
          className="mt-5 p-1"
          style={{ width: "300px", background: "rgb(91, 153, 194)" }}
          key={list.id}
        >
          <div className="d-flex flex-column">
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
                  </p> // Generar una key única
                ))
              : null}
            {postState === true ? (
              <form className="mx-1">
                <textarea
                  className="form-control"
                  id="exampleFormControlTextarea1"
                  rows="2"
                  ref={inputRef}
                  onKeyDown={handleSubmit}
                ></textarea>
              </form>
            ) : null}

            <div className="ps-1">
              <button
                className="btn btn-primary d-flex align-items-center gap-2"
                onClick={() => setPostState(true)}
              >
                <i className="fa-solid fa-plus"></i>
                <span>Add a card</span>
              </button>
            </div>
          </div>
        </div>
      ))}
    </main>
  );
};
