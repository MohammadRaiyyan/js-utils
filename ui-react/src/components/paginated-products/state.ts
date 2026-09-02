import type { State } from "./types";

type ActionType =
  | { type: "SET_PAGE"; payload: { page: number } }
  | { type: "SET_LIMIT"; payload: { limit: number } }
  | { type: "SET_SEARCH"; payload: { search: string } };

export const initialState: State = {
  page: 0,
  limit: 10,
  search: "",
};

export function reducer(
  state: State = initialState,
  action: ActionType,
): State {
  const { payload, type } = action;
  switch (type) {
    case "SET_PAGE":
      return {
        ...state,
        page: payload.page,
      };
    case "SET_LIMIT":
      return {
        ...state,
        limit: payload.limit,
        page: 0,
      };
    case "SET_SEARCH":
      return {
        ...state,
        search: payload.search,
        page: 0,
      };
    default:
      return state;
  }
}
