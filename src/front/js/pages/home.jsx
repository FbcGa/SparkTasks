import React, { useContext, useMemo, useState } from "react";
import { Context } from "../store/appContext";
import { useAuth } from "../hooks/authUser";
import { AddThings } from "../component/addThings.jsx";
import "../../styles/home.css";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext } from "@dnd-kit/sortable";
import { SortableList } from "../component/sortableList.jsx";
import { createPortal } from "react-dom";

export const Home = () => {
  const { store, actions } = useContext(Context);
  const [activeList, setActiveList] = useState([]);

  const ColumnList = useMemo(
    () => store.list.map((list) => list.id),
    [store.list]
  );

  const onDragStart = (event) => {
    if (event.active.data.current?.list) {
      setActiveList(event.active.data.current.list);
    }
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeListId = active.id;
    const overListId = over.id;

    if (activeListId === overListId) return;

    const oldListIndex = store.list.findIndex(
      (list) => list.id === activeListId
    );
    const newListIndex = store.list.findIndex((list) => list.id === overListId);
    actions.sortLists(arrayMove(store.list, oldListIndex, newListIndex));
  };
  useAuth();
  return (
    <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
      <main className="home-container">
        <SortableContext items={ColumnList}>
          <ul className="list-container">
            {store.list?.map((list) => (
              <SortableList list={list} key={list.id} />
            ))}
          </ul>
        </SortableContext>

        <AddThings textItem="List" />

        {createPortal(
          <DragOverlay>
            {activeList && <SortableList list={activeList} />}
          </DragOverlay>,
          document.body
        )}
      </main>
    </DndContext>
  );
};
