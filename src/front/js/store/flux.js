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
      addTask: async (text, listId) => {
        console.log(text, listId);
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
        return data;
      },
    },
  };
};

export default getState;
