import "./style.css";

const BASE_URL = "https://dummyjson.com/users";
const LIMIT = 10;
// state
interface User {
  id: number;
  firstName: string;
  lastName: string;
}
interface State {
  users: User[];
  isLoading: boolean;
  hasError: string | null;
  total: number;
  page: number;
  limit: number;
}

type Action =
  | { type: "SET_LOADING"; payload: { isLoading: boolean } }
  | { type: "SET_ERROR"; payload: { error: string | null } }
  | {
      type: "SET_USERS";
      payload: { users: User[]; total: number; page: number };
    };

let state: State = {
  users: [],
  hasError: null,
  total: 0,
  isLoading: false,
  limit: LIMIT,
  page: 1,
};

function hasMore(total: State["total"], users: State["users"]) {
  return total > users.length;
}

function reducer(state: State, action: Action): State {
  const { type, payload } = action;
  switch (type) {
    case "SET_LOADING":
      return {
        ...state,
        isLoading: payload.isLoading,
      };
    case "SET_ERROR":
      return {
        ...state,
        hasError: payload.error,
      };
    case "SET_USERS":
      return {
        ...state,
        users: [...state.users, ...payload.users],
        isLoading: false,
        hasError: null,
        total: payload.total,
        page: payload.page,
      };
    default:
      return state;
  }
}

function dispatch(action: Action) {
  state = reducer(state, action);
  render();
}

//render
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <article class="page">
    <ul class="users_container"></ul>
    <div class="loading_container"></div>
     <div class="error_container"></div>
     <div class="scroll_trigger"></div>
  </article>
`;
const loadingContainer = document.querySelector(".loading_container")!;
const errorContainer = document.querySelector(".error_container")!;
const usersContainer = document.querySelector(".users_container")!;
const scrollTrigger = document.querySelector(".scroll_trigger")!;

function render() {
  if (state.isLoading) {
    loadingContainer.innerHTML = `<span>Loading...</span>`;
  } else {
    loadingContainer.innerHTML = "";
  }

  if (state.hasError) {
    errorContainer.innerHTML = `<span>Something went wrong.</span>`;
  } else {
    errorContainer.innerHTML = "";
  }
  if (state.users.length) {
    usersContainer.innerHTML = state.users
      .map((user) => {
        return `
        <li>${user.firstName}</li>
      `;
      })
      .join("");
  } else {
    usersContainer.innerHTML = `<span>No users fond</span>`;
  }
}
// events
async function fetchUsers() {
  if (state.isLoading) return;
  if (state.total > 0 && !hasMore(state.total, state.users)) return;
  dispatch({ type: "SET_LOADING", payload: { isLoading: true } });
  try {
    const skip = (state.page - 1) * state.limit;
    const response = await fetch(
      `${BASE_URL}?limit=${state.limit}&skip=${skip}`,
    );
    const { users, total } = (await response.json()) as {
      users: User[];
      total: number;
    };
    dispatch({
      type: "SET_USERS",
      payload: { users, total, page: state.page + 1 },
    });
  } catch (e) {
    dispatch({ type: "SET_ERROR", payload: { error: "Something went wrong" } });
  } finally {
    dispatch({ type: "SET_LOADING", payload: { isLoading: false } });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  // On intersection of the trigger we will dispatch of page change and call fetchUsers
  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (entry.isIntersecting) {
      void fetchUsers();
    }
  });
  observer.observe(scrollTrigger);
});
