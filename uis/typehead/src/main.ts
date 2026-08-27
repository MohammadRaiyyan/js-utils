import "./style.css";

const BASE_URL = "https://dummyjson.com/users/search";

// State
type User = {
  id: number;
  firstName: string;
  lastName: string;
};

interface State {
  users: Array<User>;
  isLoading: boolean;
  hasError: string | null;
  search: string;
}

let state: State = {
  users: [],
  isLoading: false,
  hasError: null,
  search: "",
};

type Action =
  | { type: "SET_LOADING"; payload: { isLoading: boolean } }
  | {
      type: "SET_USERS";
      payload: { users: State["users"] };
    }
  | {
      type: "SET_ERROR";
      payload: { hasError: State["hasError"] };
    }
  | {
      type: "SET_SEARCH";
      payload: { search: string };
    }
  | {
      type: "CLEAR_USERS";
    };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload.isLoading,
        hasError: null,
      };
    case "SET_USERS":
      return {
        ...state,
        users: action.payload.users,
        isLoading: false,
        hasError: null,
      };
    case "SET_ERROR":
      return {
        ...state,
        users: [],
        isLoading: false,
        hasError: action.payload.hasError,
      };
    case "SET_SEARCH":
      return {
        ...state,
        search: action.payload.search,
      };
    case "CLEAR_USERS":
      return {
        ...state,
        search: "",
        users: [],
        isLoading: false,
        hasError: null,
      };
    default:
      return state;
  }
}

function dispatch(action: Action) {
  state = reducer(state, action);
  render();
}

let timerId: number | undefined;

function scheduleSearch(query: string) {
  clearTimeout(timerId);
  if (!query.trim()) {
    dispatch({
      type: "CLEAR_USERS",
    });

    return;
  }
  timerId = window.setTimeout(() => {
    void fetchUsers(query);
  }, 500);
}

let controller: AbortController | null = null;

async function fetchUsers(query: string): Promise<void> {
  console.log("Query:", query);
  controller?.abort();
  controller = new AbortController();
  const currentController = controller;
  dispatch({
    type: "SET_LOADING",
    payload: { isLoading: true },
  });
  try {
    const response = await fetch(`${BASE_URL}?q=${query}`, {
      signal: currentController.signal,
    });
    const { users } = (await response.json()) as { users: Array<User> };
    dispatch({ type: "SET_USERS", payload: { users } });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return;
    }
    dispatch({
      type: "SET_ERROR",
      payload: { hasError: "Could not able to perform search" },
    });
  }
}

const root = document.querySelector<HTMLDivElement>("#app")!;

function render() {
  const menu = document.getElementById("menu-list");
  menu.innerHTML = state.isLoading
    ? `<span>Loading...</span>`
    : state.search === ""
      ? ""
      : !state.users.length
        ? `<span>No users</span>`
        : state.users
            .map((user) => {
              return `
              <span>${user.firstName + " " + user.lastName}</span>
            `;
            })
            .join("");
}
// events
function getSearchInput(event: Event): {
  value: string;
  element?: HTMLInputElement;
} {
  const target = event.target;
  if (!(target instanceof HTMLInputElement))
    return {
      value: "",
    };
  const targetElement = target.closest<HTMLInputElement>("[data-action]");
  if (!targetElement)
    return {
      value: "",
    };
  const targetAction = targetElement.dataset.action;
  if (targetAction === "SEARCH_USERS") {
    return {
      value: target.value,
      element: targetElement,
    };
  }
}
root.addEventListener("input", (event) => {
  const { element: targetElement, value } = getSearchInput(event);
  if (!targetElement) return;
  const targetAction = targetElement.dataset.action;
  if (targetAction === "SEARCH_USERS") {
    dispatch({
      type: "SET_SEARCH",
      payload: { search: value },
    });
    void scheduleSearch(value);
  }
});

root.addEventListener("focusin", (event) => {
  const { element: targetElement } = getSearchInput(event);
  if (!targetElement) return;
  const targetAction = targetElement.dataset.action;
  if (targetAction === "SEARCH_USERS") {
    const menu = document.getElementById("menu-list");
    if (menu) {
      menu.classList.add("show-menu");
    }
  }
});
root.addEventListener("focusout", (event) => {
  const { element: targetElement } = getSearchInput(event);
  if (!targetElement) return;
  const targetAction = targetElement.dataset.action;
  if (targetAction === "SEARCH_USERS") {
    const menu = document.getElementById("menu-list");
    if (menu) {
      menu.classList.remove("show-menu");
    }
  }
});

//render
root.innerHTML = `
  <article>
    <h2>Search User</h2>
    <input type="text" data-action="SEARCH_USERS" value="${state.search}"/>
    <div  id="menu-list">

    </div>
  </article>

`;
