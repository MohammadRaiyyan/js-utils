import "./style.css";

// State
interface Card {
  id: string;
  title: string;
  position: number;
}
interface Column {
  title: string;
  cards: Array<Card>;
}
interface State {
  board: Map<string, Column>;
}

type Action = {
  type: "MOVE_CARD";
  payload: {
    cardId: string;
    fromColumnId: string;
    toColumnId: string;
    position?: number;
  };
};

const BOARD: State["board"] = new Map();
BOARD.set(crypto.randomUUID(), {
  title: "Todo",
  cards: [
    { id: crypto.randomUUID(), position: 1, title: "Work On design" },
    { id: crypto.randomUUID(), position: 1, title: "Work On Performance" },
  ],
});
BOARD.set(crypto.randomUUID(), {
  title: "In-progress",
  cards: [
    {
      id: crypto.randomUUID(),
      position: 1,
      title: "Work On Typescript migration",
    },
    { id: crypto.randomUUID(), position: 1, title: "Work On Onboarding fixes" },
  ],
});

let state: State = {
  board: BOARD,
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "MOVE_CARD": {
      const copyBoard = new Map(state.board);
      const fromColumn = copyBoard.get(action.payload.fromColumnId);
      const toColumn = copyBoard.get(action.payload.toColumnId);
      const card = fromColumn.cards.find(
        (card) => card.id === action.payload.cardId,
      );
      copyBoard.set(action.payload.fromColumnId, {
        ...fromColumn,
        cards: fromColumn.cards.filter(
          (card) => card.id !== action.payload.cardId,
        ),
      });
      copyBoard.set(action.payload.toColumnId, {
        ...toColumn,
        cards: [...toColumn.cards, card],
      });
      // TODO:
      // Position placemnt support
      return {
        ...state,
        board: copyBoard,
      };
    }

    default:
      return state;
  }
};

const dispatch = (action: Action) => {
  state = reducer(state, action);
  render();
};

// render
const root = document.querySelector<HTMLDivElement>("#app")!;

function render() {
  const templateStrings = [];
  state.board.forEach((column, columnId) => {
    templateStrings.push(`
        <article class="column" data-column=${columnId}>
          <h2>${column.title}</h2>
          <ul>
            ${
              column.cards.length > 0
                ? column.cards
                    .map((card) => {
                      return `
                <li class="card" draggable="true" data-column=${columnId} data-id=${card.id}>${card.title}</li>
              `;
                    })
                    .join("")
                : `<span>No card!</span>`
            }
          </ul>
        </article>
      `);
  });
  root.innerHTML = `
    <main class="board">
      ${templateStrings.join("")}
    </main>
  `;
}

// Events
root.addEventListener("dragstart", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const card = target.closest<HTMLElement>(".card");
  if (!card) return;
  card.classList.add("dragging");
  const cardId = card.dataset.id;
  const fromColumnId = card.dataset.column;
  if (!cardId || !fromColumnId) return;
  event.dataTransfer.setData(
    "application/json",
    JSON.stringify({ cardId, fromColumnId }),
  );
});
root.addEventListener("dragend", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const card = target.closest<HTMLElement>(".card");
  if (!card) return;
  card.classList.remove("dragging");
});
root.addEventListener("dragover", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const column = target.closest<HTMLElement>(".column");
  if (!column) return;
  event.preventDefault();
});
root.addEventListener("dragenter", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const column = target.closest<HTMLElement>(".column");
  if (!column) return;
  column.classList.add("dragenter");
});
root.addEventListener("dragleave", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const column = target.closest<HTMLElement>(".column");
  if (!column) return;
  column.classList.remove("dragenter");
});
root.addEventListener("drop", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const column = target.closest<HTMLElement>(".column");
  if (!column) return;
  event.preventDefault();
  column.classList.remove("dragenter");
  const toColumnId = column.dataset.column;
  if (!toColumnId) return;
  const { cardId, fromColumnId } = JSON.parse(
    event.dataTransfer.getData("application/json"),
  ) as { fromColumnId: string; cardId: string };
  if (fromColumnId === toColumnId) return;
  dispatch({
    type: "MOVE_CARD",
    payload: { cardId, fromColumnId, toColumnId },
  });
});
//
document.addEventListener("DOMContentLoaded", () => {
  render();
});
