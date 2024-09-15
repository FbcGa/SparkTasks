import React, { useRef, useState, useId } from "react";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [postState, setPostState] = useState(false);
  const inputRef = useRef();
  const postID = useId();

  const handleSubmit = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setPosts([...posts, inputRef.current.value]);
      inputRef.current.value = "";
    }
  };

  return (
    <main
      className="mt-5 p-1"
      style={{ width: "300px", background: "rgb(91, 153, 194)" }}
    >
      <div className="d-flex flex-column">
        <section className="m-0 p-0 d-flex justify-content-between align-items-center">
          <h5 className="m-0 mx-2 p-0 fs-2 fw-semibold font-monospace">
            To Do
          </h5>
          <button className="btn">
            <i className="fa-solid fa-ellipsis"></i>
          </button>
        </section>

        {posts.length > 0
          ? posts.map((post, index) => (
              <p
                key={`${postID}-${index}`}
                className="fs-5 font-monospace mx-2 ps-2 border border-black"
              >
                {post}
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
    </main>
  );
};
