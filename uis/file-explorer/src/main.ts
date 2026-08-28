import "./style.css";

// state
interface ExplorerBase {
  id: string;
  title: string;
}
interface FileExplorer extends ExplorerBase {
  type: "FILE";
}
interface FolderExplorer extends ExplorerBase {
  type: "FOLDER";
  children: Explorer[];
}
type Explorer = FileExplorer | FolderExplorer;

interface State {
  explorer: Explorer[];
  expandedIds: Set<string>;
  creating?: {
    parentId: string;
    nodeType: "FILE" | "FOLDER";
  };
}
const EXPLORER: Explorer[] = [
  {
    id: crypto.randomUUID(),
    title: "js-utils",
    type: "FOLDER",
    children: [
      {
        type: "FOLDER",
        id: crypto.randomUUID(),
        title: "fns",
        children: [
          { id: crypto.randomUUID(), title: "array.polyfil.js", type: "FILE" },
        ],
      },
      {
        type: "FOLDER",
        id: crypto.randomUUID(),
        title: "uis",
        children: [
          {
            type: "FOLDER",
            id: crypto.randomUUID(),
            title: "file-explorer",
            children: [
              {
                id: crypto.randomUUID(),
                title: "index.html",
                type: "FILE",
              },
            ],
          },
        ],
      },
    ],
  },
];

let state: State = {
  explorer: EXPLORER,
  expandedIds: new Set(),
  creating: undefined,
};
type Action =
  | { type: "TOGGLE"; id: string }
  | { type: "START_CREATE"; parentId: string; nodeType: "FILE" | "FOLDER" }
  | { type: "ADD_NEW"; title: string };

function addNode(
  nodes: Explorer[],
  parentId: string,
  newNode: Explorer,
): Explorer[] {
  return nodes.map((node) => {
    if (node.type === "FILE") {
      return node;
    }
    if (node.id === parentId) {
      return {
        ...node,
        children: [...node.children, newNode],
      };
    }
    return {
      ...node,
      children: addNode(node.children, parentId, newNode),
    };
  });
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "TOGGLE": {
      const copy = new Set(state.expandedIds);
      if (copy.has(action.id)) {
        copy.delete(action.id);
      } else {
        copy.add(action.id);
      }
      return {
        ...state,
        expandedIds: copy,
      };
    }
    case "START_CREATE": {
      return {
        ...state,
        creating: { nodeType: action.nodeType, parentId: action.parentId },
      };
    }

    case "ADD_NEW": {
      const expandedIds = new Set(state.expandedIds);
      expandedIds.add(state.creating.parentId);
      return {
        ...state,
        explorer: addNode(state.explorer, state.creating.parentId, {
          id: crypto.randomUUID(),
          title: action.title,
          type: state.creating.nodeType,
          ...(state.creating.nodeType === "FOLDER" && { children: [] }),
        }),
        creating: undefined,
        expandedIds,
      };
    }

    default:
      return state;
  }
}

function dispatch(action: Action) {
  state = reducer(state, action);
  render(state.explorer);
}

const root = document.querySelector<HTMLDivElement>("#app")!;

root.innerHTML = `
  <article id="explorer-container"></article>
`;

const explorerContainer = document.querySelector<HTMLElement>(
  "#explorer-container",
)!;

function render(nodes: Explorer[]) {
  explorerContainer.innerHTML = process(nodes);
}

function process(nodes: State["explorer"]) {
  return nodes
    .map((dir) => {
      if (dir.type === "FILE") {
        return `<li data-id="${dir.id}">📄 ${dir.title}</li>`;
      }
      return `<div class="folder">
                <button data-action="TOGGLE" data-id="${dir.id}">📁 ${dir.title}</button>
                <button data-action="START_CREATE_FOLDER" data-id="${dir.id}">📁 + </button>
                <button data-action="START_CREATE_FILE" data-id="${dir.id}">📄 +</button>
              </div>
              ${
                state.creating?.parentId === dir.id
                  ? `
                <input type="text"   data-role="NEW_TITLE"/>
                <button data-action="ADD_NEW">Save</button>
              `
                  : ""
              }
              ${
                state.expandedIds.has(dir.id)
                  ? `<ul id=${dir.id}>
                      ${dir.children.length > 0 ? process(dir.children) : ""}
                    </ul>
                    `
                  : ""
              }
      `;
    })
    .join("");
}

root.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) return;
  const targetElement = target.closest<HTMLButtonElement>("[data-action]");
  if (!targetElement) return;
  const targetAction = targetElement.dataset.action;

  const targetId = targetElement.dataset.id;

  if (targetAction === "TOGGLE") {
    if (!targetId) return;
    dispatch({ type: "TOGGLE", id: targetId });
  } else if (targetAction === "START_CREATE_FOLDER") {
    if (!targetId) return;
    dispatch({ type: "START_CREATE", nodeType: "FOLDER", parentId: targetId });
  } else if (targetAction === "START_CREATE_FILE") {
    if (!targetId) return;
    dispatch({ type: "START_CREATE", nodeType: "FILE", parentId: targetId });
  } else if (targetAction === "ADD_NEW") {
    const input = root.querySelector<HTMLInputElement>(
      '[data-role="NEW_TITLE"]',
    );
    if (!input) return;
    dispatch({ type: "ADD_NEW", title: input.value });
  }
});

render(state.explorer);
