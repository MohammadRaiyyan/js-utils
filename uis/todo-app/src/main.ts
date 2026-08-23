import "./style.css";

// State
interface Todo {
  id: string;
  title: string;
  completed: boolean;
}
const FILTERS = ["all", "completed", "active"] as const;

type FilterType = (typeof FILTERS)[number];

const ACTIONS = [
  "ADD_TODO",
  "DELETE_TODO",
  "TOGGLE_TODO",
  "SET_FILTER",
] as const;
type ActionType = (typeof ACTIONS)[number];

interface State {
  todos: Array<Todo>;
  filter: FilterType;
}

let state: State = {
  todos: [],
  filter: FILTERS[0],
};

// actions

export type Action =
  | { type: "ADD_TODO"; title: string }
  | { type: "DELETE_TODO"; id: string }
  | { type: "TOGGLE_TODO"; id: string }
  | { type: "SET_FILTER"; filter: FilterType };

const action = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            id: crypto.randomUUID(),
            title: action.title,
            completed: false,
          },
        ],
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) => {
          return todo.id === action.id
            ? { ...todo, completed: !todo.completed }
            : todo;
        }),
      };
    case "DELETE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.id),
      };
    case "SET_FILTER":
      return {
        ...state,
        filter: action.filter,
      };
  }
  return state;
};

// dispatch

const dispatch = (payload: Action): void => {
  state = action(state, payload);
  render();
};

// derived state
const getFilterTodos = (data: State) => {
  switch (data.filter) {
    case "active":
      console.log("Applying active filter", state.todos, state.filter);
      return data.todos.filter((todo) => !todo.completed);
    case "completed":
      return data.todos.filter((todo) => todo.completed);
    default:
      return data.todos;
  }
};

// render

function render() {
  const todoListContainer =
    document.querySelector<HTMLDivElement>("#todo-list")!;
  const todos = getFilterTodos(state);
  console.log("todoListContainer", todoListContainer);
  if (todos.length === 0) {
    todoListContainer.innerHTML = `<span class="zero-state">No Todos! Please add some todos</span>`;
    return;
  }
  todoListContainer.innerHTML = todos
    .map((todo) => {
      return `<li data-id=${todo.id}>
                <input type="checkbox" data-action=${ACTIONS[2]} data-id=${todo.id} ${todo.completed ? "checked=true" : ""}/>
                <span>${todo.title}</span>
                <button type="button" data-action=${ACTIONS[1]} data-id=${todo.id}>X</button>
              </li>`;
    })
    .join("");
}

// events
const root = document.querySelector<HTMLDivElement>("#app")!;

root.addEventListener("submit", function (event) {
  event.preventDefault();
  const form = event.target;
  console.log("form", form);
  if (!(form instanceof HTMLFormElement)) {
    return;
  }
  if (form.dataset.action !== ACTIONS[0]) {
    return;
  }

  const input = form.elements.namedItem("title");
  if (!(input instanceof HTMLInputElement)) {
    return;
  }
  const value = input.value.trim();
  if (!value) {
    return;
  }
  dispatch({ type: "ADD_TODO", title: value });
  input.value = "";
});

root.addEventListener("click", function (event) {
  const target = event.target;
  console.log("target click", target);
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const actionElement = target.closest<HTMLElement>("[data-action]");
  if (!actionElement) {
    return;
  }
  const action = actionElement.dataset.action as ActionType;
  switch (action) {
    case "DELETE_TODO":
      {
        const id = actionElement.dataset.id;
        if (!id) return;
        dispatch({ type: "DELETE_TODO", id });
      }
      break;
    case "SET_FILTER":
      {
        const filter = actionElement.dataset.filter as FilterType;
        console.log("Filter:", filter);
        if (!filter) return;
        dispatch({ type: "SET_FILTER", filter });
      }
      break;
    default:
      break;
  }
});

root.addEventListener("change", function (event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }
  const action = target.dataset.action as ActionType;

  if (action !== ACTIONS[2]) {
    return;
  }
  console.log("Toggling", action);
  const id = target.dataset.id;
  if (!id) return;
  dispatch({ type: "TOGGLE_TODO", id });
});
root.innerHTML = `
  <main class="container">
    <section class="header">
      <form data-action=${ACTIONS[0]}>
        <input type="text" name="title"/>
        <button type="submit">Add</button>
      </form>
    </section>
    <section class="content">
      <h2>My Todo App</h2>
      <div class="filters">
        ${FILTERS.map((filter) => `<button data-action=${ACTIONS[3]} data-active=${filter === state.filter} data-filter=${filter}>${filter.toUpperCase()}</button>`).join("")}
      </div>
      <article class="todo-container">
        <ul id="todo-list" class="todo-list">
          <span class="zero-state">No Todos! Please add some todos</span>
        </ul>
      </article>
    </section>
  </main>
`;
