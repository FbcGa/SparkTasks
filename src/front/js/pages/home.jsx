import React, { useContext, useMemo, useState } from "react";
import { Context } from "../store/appContext";
import { useAuth } from "../hooks/authUser";
import { AddThings } from "../component/addThings.jsx";
import "../../styles/home.css";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  KeyboardSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { SortableList } from "../component/sortableList.jsx";
import { createPortal } from "react-dom";

// Presentational Component for Task to use within DragOverlay
const TaskOverlay = ({ task }) => (
  <div className="task-overlay">
    {/* Render your task details here */}
    {task.text}
  </div>
);

export const Home = () => {
  const { store, actions } = useContext(Context);
  const [activeList, setActiveList] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const ColumnList = useMemo(
    () => store.list.map((list) => list.id),
    [store.list]
  );

  const onDragStart = (event) => {
    const activeData = event.active.data.current;

    if (activeData?.list) {
      setActiveList(activeData.list);
    } else if (activeData?.task) {
      setActiveTask({
        ...activeData.task,
        listId: activeData.listId,
      });
    }
  };

  const onDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeListId = active.id;
    const overListId = over.id;

    if (activeListId !== overListId) {
      const oldListIndex = store.list.findIndex(
        (list) => list.id === activeListId
      );

      const newListIndex = store.list.findIndex(
        (list) => list.id === overListId
      );
      actions.sortLists(arrayMove(store.list, oldListIndex, newListIndex));
    }

    setActiveList(null);
    setActiveTask(null);
  };

  const onDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeTaskId = active.id;
    const overTaskId = over.id;

    if (activeTaskId === overTaskId) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    if (!activeData || !activeData.task || !overData || !overData.task) return;

    const copyTasks = structuredClone(store.list);
    const fromList = copyTasks.find(
      (list) => list.id === activeData.task.list_id
    );
    const toList = copyTasks.find((list) => list.id === overData.task.list_id);

    if (fromList && fromList.id === toList.id) {
      const oldIndexTask = fromList.tasks.findIndex(
        (task) => task.id === activeTaskId
      );
      const newIndexTask = fromList.tasks.findIndex(
        (task) => task.id === overTaskId
      );

      const updatedTasks = arrayMove(
        fromList.tasks,
        oldIndexTask,
        newIndexTask
      );
      actions.sortTaskWithinList(fromList.id, updatedTasks);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 3 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useAuth();

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
    >
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
            {activeTask && <TaskOverlay task={activeTask} />}
          </DragOverlay>,
          document.body
        )}
      </main>
    </DndContext>
  );
};
