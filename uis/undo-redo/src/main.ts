import "./style.css";

// State
interface Counter {
  count: number;
}
interface AppState {
  appState: Counter;
  history: { undo: Counter[]; redo: Counter[] };
}

let state: AppState = {
  appState: { count: 0 },
  history: { redo: [], undo: [] },
};

type Action =
  { type: "ADD" } | { type: "RESET" } | { type: "UNDO" } | { type: "REDO" };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "ADD": {
      return {
        ...state,
        history: {
          ...state.history,
          redo: [],
          undo: [...state.history.undo, state.appState],
        },
        appState: {
          ...state.appState,
          count: state.appState.count + 1,
        },
      };
    }

    case "RESET":
      return {
        appState: { count: 0 },
        history: { undo: [], redo: [] },
      };
    case "REDO": {
      if (state.history.redo.length) {
        const newUndo = [...state.history.undo, state.appState];
        const newRedo = [...state.history.redo];
        const newCurrentState = newRedo.pop();
        return {
          ...state,
          history: {
            ...state.history,
            redo: newRedo,
            undo: newUndo,
          },
          appState: newCurrentState,
        };
      }
      return state;
    }

    case "UNDO": {
      if (state.history.undo.length) {
        const newRedo = [...state.history.redo, state.appState];
        const newUndo = [...state.history.undo];
        const newCurrentState = newUndo.pop();
        return {
          ...state,
          history: {
            ...state.history,
            redo: newRedo,
            undo: newUndo,
          },
          appState: newCurrentState,
        };
      }
      return state;
    }
  }
}

function dispatch(action: Action) {
  state = reducer(state, action);
  render();
}
// render
const root = document.querySelector<HTMLDivElement>("#app")!;

function render() {
  root.innerHTML = `
      <div class="container">
        <h3>${state.appState.count}</h3>
        <div class="actions">
          <button data-action="ADD">+</button>
          <button data-action="UNDO">Undo</button>
          <button data-action="REDO">Redo</button>
          <button data-action="RESET">Reset</button>
        </div>
      </div>
    `;
}

// events
root.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  const actionElement = target.closest<HTMLElement>("[data-action]");
  if (!actionElement) return;
  const action = actionElement.dataset.action;

  switch (action) {
    case "ADD":
      dispatch({ type: "ADD" });
      break;
    case "RESET":
      dispatch({ type: "RESET" });
      break;
    case "REDO":
      dispatch({ type: "REDO" });
      break;
    case "UNDO":
      dispatch({ type: "UNDO" });
      break;
    default:
      break;
  }
});

document.addEventListener("DOMContentLoaded", () => {
  render();
});
