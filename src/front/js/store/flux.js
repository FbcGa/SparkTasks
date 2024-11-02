import { arrayMove } from "@dnd-kit/sortable";
const getState = ({ getStore, getActions, setStore }) => {
  return {
    store: {
      message: null,
      demo: [
        {
          title: "FIRST",
          background: "white",
          initial: "white",
        },
        {
          title: "SECOND",
          background: "white",
          initial: "white",
        },
      ],
      user: [],
      list: [],
    },
    actions: {
      // Use getActions to call a function within a fuction
      exampleFunction: () => {
        getActions().changeColor(0, "green");
      },

      getMessage: async () => {
        try {
          // fetching data from the backend
          const resp = await fetch(process.env.BACKEND_URL + "/api/hello");
          const data = await resp.json();
          setStore({ message: data.message });
          // don't forget to return something, that is how the async resolves
          return data;
        } catch (error) {
          console.log("Error loading message from backend", error);
        }
      },
      changeColor: (index, color) => {
        //get the store
        const store = getStore();

        //we have to loop the entire demo array to look for the respective index
        //and change its color
        const demo = store.demo.map((elm, i) => {
          if (i === index) elm.background = color;
          return elm;
        });

        //reset the global store
        setStore({ demo: demo });
      },
      register: async (email, password) => {
        const resp = await fetch(process.env.BACKEND_URL + "/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        if (!resp.ok) {
          return false;
        }
        const data = await resp.json();
        setStore({ user: data.user });
        localStorage.setItem("token", data.auth);
        return data;
      },
      login: async (email, password) => {
        const resp = await fetch(process.env.BACKEND_URL + "/api/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!resp.ok) {
          return false;
        }
        const data = await resp.json();

        setStore({ user: data.user });
        localStorage.setItem("token", data.auth);
        return data;
      },
      //functions list
      allList: async () => {
        const token = localStorage.getItem("token");
        const resp = await fetch(process.env.BACKEND_URL + "/api/list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!resp.ok) {
          return false;
        }
        const data = await resp.json();
        setStore({ list: data.lists });
      },
      addList: async (title) => {
        const store = getStore();
        const token = localStorage.getItem("token");
        const resp = await fetch(process.env.BACKEND_URL + "/api/list", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title }),
        });
        if (resp.status === 401) {
          return null;
        }
        if (!resp.ok) {
          return false;
        }

        const data = await resp.json();
        setStore({
          list: [
            ...store.list,
            {
              ...data.list,
            },
          ],
        });
        return data;
      },
      deleteList: async (id) => {
        const token = localStorage.getItem("token");
        const store = getStore();
        const resp = await fetch(process.env.BACKEND_URL + "/api/list/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id }),
        });
        if (!resp.ok) {
          return false;
        }
        const data = await resp.json();
        const filterList = store.list.filter((list) => list.id !== id);
        setStore({ list: filterList });
        return data;
      },
      changeListTitle: async (title, listId) => {
        const store = getStore();
        const token = localStorage.getItem("token");

        const resp = await fetch(process.env.BACKEND_URL + "/api/list/change", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, list_id: listId }),
        });

        if (!resp.ok) {
          console.error("Failed to update list title");
          return false;
        }

        const data = await resp.json();

        const updatedLists = store.list.map((list) =>
          list.id === listId ? { ...list, title: data.list.title } : list
        );

        setStore({ list: updatedLists });
      },

      addTask: async (text, listId) => {
        const store = getStore();
        const token = localStorage.getItem("token");
        const resp = await fetch(process.env.BACKEND_URL + "/api/task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: text, list_id: listId }),
        });
        if (!resp.ok) {
          return false;
        }
        const data = await resp.json();

        const newTask = store.list.map((list) =>
          list.id === data.task.list_id
            ? { ...list, tasks: [...list.tasks, { ...data.task }] }
            : list
        );
        setStore({ list: newTask });
        return data;
      },
      deleteTask: async (id, listId) => {
        const token = localStorage.getItem("token");
        const store = getStore();
        const resp = await fetch(process.env.BACKEND_URL + "/api/task/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id, listId }),
        });
        if (!resp.ok) {
          return false;
        }
        const data = await resp.json();
        const deleteTask = store.list.map((list) => {
          if (list.id === listId) {
            return {
              ...list,
              tasks: list.tasks.filter((task) => task.id !== id),
            };
          }
          return list;
        });
        setStore({ list: deleteTask });
        return data;
      },
      /*----sort list---------------*/
      sortLists: async (newOrder) => {
        setStore({ list: newOrder });
        const token = localStorage.getItem("token");

        // Obtener solo los IDs de lista en el nuevo orden
        const listOrder = newOrder.map((list) => list.id);

        try {
          const resp = await fetch(
            process.env.BACKEND_URL + "/api/list/reorder",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ new_order: listOrder }),
            }
          );

          if (!resp.ok) {
            console.error("Error al reordenar las listas en el backend");
            return false;
          }
        } catch (error) {
          console.error("Error al reordenar listas:", error);
        }
      },

      sortTasks: (fromListId, toListId, oldIndexTask, newIndexTask) => {
        const store = getStore();
        const updatedLists = structuredClone(store.list);

        // Encontrar las listas de origen y destino
        const fromList = updatedLists.find((list) => list.id === fromListId);
        const toList = updatedLists.find((list) => list.id === toListId);

        // Validar que ambas listas existan
        if (!fromList || !toList) {
          console.error("No se encontró la lista de origen o destino");
          return;
        }

        if (fromListId === toListId) {
          // Reordenamiento dentro de la misma lista
          fromList.tasks = arrayMove(
            fromList.tasks,
            oldIndexTask,
            newIndexTask
          );
        } else {
          // Mover la tarea a otra lista
          const [movedTask] = fromList.tasks.splice(oldIndexTask, 1); // Remover de origen
          toList.tasks.splice(newIndexTask, 0, movedTask); // Insertar en el destino
        }

        setStore({ list: updatedLists });
      },
    },
  };
};

export default getState;
