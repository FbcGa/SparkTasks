import React, { useRef, useState, useId } from "react";

export const Home = () => {
  const [posts, setPosts] = useState([]);
  const [postState, setPostState] = useState(false);
  const inputRef = useRef();
  const postID = useId();

  const handleSubmit = (event) => {
    event.preventDefault();
    setPosts([...posts, inputRef.current.value]);
    inputRef.current.value = "";
  };

  return (
    <div className="bg-secondary mt-5" style={{ width: "300px" }}>
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="m-0 mx-2 p-0">To Do</h5>
        <button className="btn btn-primary">
          <i className="fa-solid fa-ellipsis"></i>
        </button>
      </div>

      {postState === true ? (
        <form className="mx-1" onSubmit={handleSubmit}>
          <textarea
            className="form-control"
            id="exampleFormControlTextarea1"
            rows="2"
            ref={inputRef}
          ></textarea>
          <button type="submit">Save</button>
        </form>
      ) : null}

      {posts.length > 0 ? (
        posts.map((post, index) => (
          <h1 key={`${postID}-${index}`}>{post}</h1> // Generar una key única
        ))
      ) : (
        <div>
          <button
            className="btn btn-primary"
            onClick={() => setPostState(true)}
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add a card</span>
          </button>
        </div>
      )}
    </div>
  );
};
