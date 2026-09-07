import { Pencil, Trash } from "lucide-react";
import {
  useCallback,
  useMemo,
  useReducer,
  useState,
  type SubmitEvent,
} from "react";
type TodoStatus = "completed" | "inprogress" | "todo";
type TodoFilter = TodoStatus | "all";
interface ITodo {
  id: string;
  title: string;
  status: TodoStatus;
}

interface State {
  todos: ITodo[];
  filter: TodoFilter;
}

type Action =
  | { type: "ADD_TODO"; payload: { title: string } }
  | {
      type: "UPDATE_TODO";
      payload: { id: string; fields: Omit<Partial<ITodo>, "id"> };
    }
  | {
      type: "DELETE_TODO";
      payload: { id: string };
    }
  | {
      type: "FILTER_TODO";
      payload: { filter: State["filter"] };
    };

const initialState: State = {
  todos: [],
  filter: "all",
};

function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case "ADD_TODO": {
      const newTodo: ITodo = {
        id: crypto.randomUUID(),
        title: action.payload.title,
        status: "todo",
      };
      return {
        ...state,
        todos: [...state.todos, newTodo],
      };
    }
    case "DELETE_TODO": {
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload.id),
      };
    }
    case "UPDATE_TODO": {
      return {
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === action.payload.id) {
            return {
              ...todo,
              ...action.payload.fields,
            };
          }
          return todo;
        }),
      };
    }
    case "FILTER_TODO": {
      return {
        ...state,
        filter: action.payload.filter,
      };
    }
    default:
      return state;
  }
}

function useTodos() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const addTodo = useCallback((title: string) => {
    dispatch({ type: "ADD_TODO", payload: { title } });
  }, []);
  const removeTodo = useCallback((id: string) => {
    dispatch({ type: "DELETE_TODO", payload: { id } });
  }, []);
  const updateTodo = useCallback(
    (id: string, fields: Omit<Partial<ITodo>, "id">) => {
      dispatch({ type: "UPDATE_TODO", payload: { id, fields } });
    },
    [],
  );
  const filterTodo = useCallback((status: TodoStatus) => {
    dispatch({ type: "FILTER_TODO", payload: { filter: status } });
  }, []);
  const filteredTodos = useMemo(() => {
    if (state.filter === "todo") {
      return state.todos.filter((todo) => todo.status === "todo");
    }
    if (state.filter === "inprogress") {
      return state.todos.filter((todo) => todo.status === "inprogress");
    }
    if (state.filter === "completed") {
      return state.todos.filter((todo) => todo.status === "completed");
    }
    return state.todos;
  }, [state.filter, state.todos]);
  return {
    todos: filteredTodos,
    filter: state.filter,
    addTodo,
    removeTodo,
    updateTodo,
    filterTodo,
  };
}
function TodoItem(props: {
  todo: ITodo;
  handleUpdate: (id: string, fields: Partial<ITodo>) => void;
  removeTodo: (id: string) => void;
}) {
  const { handleUpdate, todo, removeTodo } = props;
  const [edit, setEdit] = useState(false);
  const updateTodo = useCallback(
    (title: string) => {
      handleUpdate(todo.id, { title });
      setEdit(false);
    },
    [handleUpdate, todo.id],
  );
  return (
    <li className="flex items-center gap-4 justify-between hover:bg-gray-200 p-2 rounded">
      <div className="flex items-center justify-between gap-2 w-full flex-1">
        <div className="flex flex-1">
          {edit ? (
            <TodoForm addTodo={updateTodo} initialvalue={todo.title} />
          ) : (
            <p>{todo.title.toUpperCase()}</p>
          )}
        </div>
        <select
          value={props.todo.status.toString()}
          className="h-6 w-36 rounded hover:bg-gray-400"
          onChange={({ target }) =>
            props.handleUpdate(todo.id, { status: target.value as TodoStatus })
          }
        >
          <option value="todo">Todo</option>
          <option value="inprogress">In progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      <div className="flex items-center gap-3">
        <button
          className=" bg-gray-300 p-2 rounded-sm"
          onClick={() => setEdit((prev) => !prev)}
        >
          <Pencil />
        </button>
        <button
          className=" bg-red-200 p-2 rounded-sm"
          onClick={() => {
            removeTodo(todo.id);
          }}
        >
          <Trash />
        </button>
      </div>
    </li>
  );
}
function Todos(props: {
  todos: State["todos"];
  updateTodo: (id: string, fiels: Omit<Partial<ITodo>, "id">) => void;
  removeTodo: (id: string) => void;
}) {
  return (
    <ul className="flex flex-col gap-2 w-full">
      {props.todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleUpdate={props.updateTodo}
          removeTodo={props.removeTodo}
        />
      ))}
    </ul>
  );
}

function TodoForm(props: {
  addTodo: (title: string) => void;
  initialvalue: string;
}) {
  const [value, setValue] = useState(() => props.initialvalue);
  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = value.trim();
    if (v !== "") {
      props.addTodo(v);
      setValue("");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        type="text"
        value={value}
        onChange={({ target }) => setValue(target.value)}
        className="border border-gray-400 h-9 px-2 rounded w-full outline-none focus:ring-2 ring-indigo-500"
        placeholder="Add todo..."
      />
      <button
        className="bg-indigo-500 text-white font-medium h-9 px-3 rounded"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
}

export default function AdvanceTodo() {
  const { todos, filter, addTodo, removeTodo, updateTodo, filterTodo } =
    useTodos();
  return (
    <article className="flex items-center justify-center">
      <section className="w-200 flex gap-4 flex-col items-start justify-start bg-gray-50 min-h-150 rounded-2xl p-4">
        <h2 className="font-bold text-2xl">Add Todo</h2>
        <TodoForm addTodo={addTodo} initialvalue={""} />
        <select
          value={filter}
          className="h-6 w-36 border border-gray-300 rounded hover:bg-gray-400"
          onChange={({ target }) => filterTodo(target.value as TodoStatus)}
        >
          <option value="all">All</option>
          <option value="todo">Todo</option>
          <option value="inprogress">In progress</option>
          <option value="completed">Completed</option>
        </select>
        {todos.length > 0 ? (
          <Todos
            todos={todos}
            updateTodo={updateTodo}
            removeTodo={removeTodo}
          />
        ) : (
          <span className="flex items-center justify-center w-full h-56">
            No Todos
          </span>
        )}
      </section>
    </article>
  );
}
