import "./style.css";

const BASE_URL = "https://dummyjson.com/users";

// State
type User = {
  id: number;
  firstName: string;
  lastName: string;
};

interface State {
  users: Array<User>;
  loading: boolean;
  limit: number;
  page: number;
  search: string;
}

let state: State = {
  users: [],
  loading: true,
  limit: 10,
  page: 0,
  search: "",
};

type Action =
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_USERS"; users: Array<User> }
  | { type: "SET_LIMIT"; limit: number }
  | { type: "SET_PAGE"; page: number }
  | { type: "SET_SEARCH"; search: string };

const ACTIONS = [
  "SET_LOADING",
  "SET_USERS",
  "SET_LIMIT",
  "SET_PAGE",
  "SET_SEARCH",
  "FETCH_PREVIOUS_PAGE",
  "FETCH_NEXT_PAGE",
] as const;
type ActionType = (typeof ACTIONS)[number];

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.loading,
        page: 0,
      };
    case "SET_USERS":
      return {
        ...state,
        users: action.users,
        loading: false,
      };
    case "SET_LIMIT":
      return {
        ...state,
        limit: action.limit,
        page: 0,
        loading: true,
      };
    case "SET_PAGE":
      return {
        ...state,
        page: action.page,
        loading: true,
      };
    case "SET_SEARCH":
      return {
        ...state,
        search: action.search,
        page: 0,
        loading: true,
      };
    default:
      return state;
  }
};

const dispatch = (action: Action) => {
  state = reducer(state, action);
  render();
};

// render
function render() {
  const tableBody = document.querySelector<HTMLDivElement>("#table-body")!;
  const paginationSummary = document.querySelector<HTMLDivElement>(
    "#current-pagination-summary",
  )!;
  paginationSummary.innerHTML = `Current Page:${state.page}`;
  if (state.loading) {
    tableBody.innerHTML = `<span>Loading...</span>`;
    return;
  }
  if (state.users.length === 0) {
    tableBody.innerHTML = `<span>No users found!</span>`;
    return;
  }
  tableBody.innerHTML = state.users
    .map((user) => {
      return `<tr>
          <td>${user.id}</td>
          <td>${user.firstName}</td>
          <td>${user.lastName}</td>
      </tr>
    `;
    })
    .join("");
}
async function fetchUsers() {
  try {
    const { limit, page, search } = state;
    let response;
    if (search) {
      response = await fetch(
        `${BASE_URL}/search?q=${search}&limit=${limit}&skip=${page}`,
      );
    } else {
      response = await fetch(`${BASE_URL}?limit=${limit}&skip=${page}`);
    }

    const { users } = (await response.json()) as { users: Array<User> };
    dispatch({ type: "SET_USERS", users });
  } catch (e) {
    console.log(e);
  }
}
// events

const root = document.querySelector<HTMLDivElement>("#app")!;

root.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const actionElement = target.closest<HTMLElement>("[data-action]");
  if (!actionElement) {
    return;
  }
  const action = actionElement.dataset.action as unknown as ActionType;
  switch (action) {
    case "FETCH_NEXT_PAGE":
      {
        dispatch({ type: "SET_PAGE", page: state.page + 1 });
        fetchUsers();
      }
      break;
    case "FETCH_PREVIOUS_PAGE":
      {
        const prevPage = state.page - 1;
        if (prevPage <= 0) {
          return;
        }
        dispatch({ type: "SET_PAGE", page: state.page - 1 });
        fetchUsers();
      }
      break;
    case "SET_LIMIT":
      {
        const limit = +actionElement.dataset.limit;
        dispatch({ type: "SET_LIMIT", limit });
        fetchUsers();
      }
      break;
  }
});

const debounce = function (
  fn: (args: unknown) => void,
  delay: 500,
): (...args: any[]) => void {
  let timerid: number;
  return function (...args) {
    const self = this;
    if (timerid) clearTimeout(timerid);
    timerid = setTimeout(() => {
      fn.apply(self, args);
    }, delay);
  };
};

const debouncedFetch = debounce(function (args: string) {
  dispatch({ type: "SET_SEARCH", search: args });
  fetchUsers();
}, 500);

root.addEventListener("input", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }
  const actionElement = target.closest<HTMLElement>("[data-action]");
  if (!actionElement) {
    return;
  }
  const action = actionElement.dataset.action as unknown as ActionType;
  switch (action) {
    case "SET_SEARCH":
      {
        const searchTerm = (target as HTMLInputElement).value;
        debouncedFetch(searchTerm);
      }
      break;
  }
});

root.innerHTML = `
  <table>
    <thead>
      <tr>
        <th>
          ID
        </th>
        <th>
          First Name
        </th>
        <th>
          Last Name
        </th>
      </tr>
    </thead>
    <tbody id="table-body">

    </tbody>
  </table>
  <div>
  <input type="text" data-action="SET_SEARCH"/>
    <button data-action="FETCH_PREVIOUS_PAGE">Previous</button>
    <span id="current-pagination-summary"></span>
    <button data-action="FETCH_NEXT_PAGE">Next</button>
    <select id="switch-limit">
      <option value="10">10</option>
      <option value="20">20</option>
      <option value="30">30</option>
    </select>
  </div>
`;

document.addEventListener("DOMContentLoaded", () => {
  fetchUsers();
  const switchLimit = document.querySelector<HTMLDivElement>("#switch-limit")!;
  switchLimit.addEventListener("change", (event) => {
    dispatch({
      type: "SET_LIMIT",
      limit: +(event.target as HTMLInputElement).value,
    });
    fetchUsers();
  });
});
