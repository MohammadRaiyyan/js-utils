import { useCallback, useReducer, type SubmitEvent } from "react";

interface BaseField {
  id: string;
  name: string;
  required: boolean;
  placeholder?: string;
  label: string;
}
interface SelectType {
  type: "select";
  options: string[];
}
interface TextType {
  type: "text";
}
interface EmailType {
  type: "email";
}

type Field = BaseField & (SelectType | TextType | EmailType);

interface Step {
  id: string;
  title: string;
  fields: Array<Field>;
}

interface State {
  step: number;
  values: Record<Field["name"], string>;
  errors: Record<Field["name"], string>;
}

const initialState: State = {
  step: 0,
  values: {},
  errors: {},
};

type Action =
  | { type: "SET_STEP"; payload: { step: number } }
  | { type: "RESET" }
  | { type: "SET_FIELD"; payload: { name: Field["name"]; value: string } }
  | {
      type: "SET_ERROR";
      payload: { name: Field["name"]; value: string | null };
    }
  | { type: "SET_ERRORS"; payload: Partial<Record<Field["name"], string>> };
function reducer(state: State = initialState, action: Action) {
  switch (action.type) {
    case "SET_STEP":
      return {
        ...state,
        step: action.payload.step,
        errors: {},
      };
    case "SET_FIELD":
      return {
        ...state,
        values: {
          ...state.values,
          [action.payload.name]: action.payload.value,
        },
      };
    case "SET_ERRORS":
      return {
        ...state,
        errors: {
          ...state.errors,
          ...action.payload,
        },
      };
    case "SET_ERROR": {
      const errros: State["errors"] = { ...state.errors };
      if (action.payload.value === null) {
        if (errros.hasOwnProperty(action.payload.name)) {
          delete errros[action.payload.name];
        }
      } else {
        errros[action.payload.name] = action.payload.value;
      }
      return {
        ...state,
        errors: errros,
      };
    }

    case "RESET":
      return initialState;
    default:
      return state;
  }
}

const steps: Step[] = [
  {
    id: "personal",
    title: "Personal",
    fields: [
      {
        id: "name",
        type: "text",
        name: "name",
        required: true,
        placeholder: "Enter name",
        label: "Name",
      },
      {
        id: "email",
        type: "email",
        name: "email",
        required: true,
        placeholder: "Enter name",
        label: "Email",
      },
    ],
  },
  {
    id: "address",
    title: "Address",
    fields: [
      {
        id: "city",
        type: "text",
        name: "city",
        required: true,
        placeholder: "Enter city",
        label: "City",
      },
      {
        id: "country",
        type: "select",
        name: "country",
        required: true,
        placeholder: "Enter country",
        options: ["India", "USA", "UK"],
        label: "Country",
      },
    ],
  },
];

function FieldRenderer({
  field,
  value,
  error,
  handleUpdate,
  handleBlur,
}: {
  field: Field;
  value: string;
  error: string | null;
  handleUpdate: (name: Field["name"], value: string) => void;
  handleBlur: (name: Field["name"], value: string, field: Field) => void;
}) {
  switch (field.type) {
    case "select":
      return (
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor={field.id}>{field.label}</label>
          <select
            value={value}
            onChange={({ target }) => handleUpdate(field.name, target.value)}
            name={field.name}
            id={field.id}
            onBlur={() => handleBlur(field.name, value, field)}
            className="h-9 px-2 border border-gray-300 rounded"
          >
            {field.options.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
          {error ? <span className="text-red-500 text-sm">{error}</span> : null}
        </div>
      );
    default:
      return (
        <div className="flex flex-col gap-2 w-full">
          <label htmlFor={field.id}>{field.label}</label>
          <input
            id={field.id}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            value={value}
            onChange={({ target }) => handleUpdate(field.name, target.value)}
            className="h-9 px-2 border border-gray-300 rounded"
            onBlur={() => handleBlur(field.name, value, field)}
          />
          {error ? <span className="text-red-500 text-sm">{error}</span> : null}
        </div>
      );
  }
}

function validateAll(
  values: Record<Field["name"], string>,
  currentStepFields: Step["fields"],
) {
  const errors: Record<Field["name"], string> = {};
  currentStepFields.forEach((field) => {
    if (field.required) {
      if (!values[field.name] || !values[field.name].trim()) {
        errors[field.name] = `${field.label} is required`;
      }
    }
  });
  return errors;
}
function validate(key: Field["name"], value: string, field: Field) {
  if (field.required) {
    if (!value || !value.trim()) {
      return false;
    }
  }
  return true;
}

export default function MultiStepForm() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const currentStep = state.step;
  const step = steps[currentStep];

  const handleUpdate = useCallback((name: Field["name"], value: string) => {
    dispatch({ type: "SET_FIELD", payload: { name, value } });
  }, []);
  const handleBlur = useCallback(
    (name: Field["name"], value: string, field: Field) => {
      const isValid = validate(name, value, field);
      if (!isValid) {
        dispatch({
          type: "SET_ERROR",
          payload: { name, value: `${field.label} is required` },
        });
        return;
      }
      dispatch({
        type: "SET_ERROR",
        payload: { name, value: null },
      });
    },
    [],
  );

  const handleBack = () => {
    if (currentStep > 0) {
      dispatch({ type: "SET_STEP", payload: { step: currentStep - 1 } });
    }
  };
  const handleReset = () => {
    dispatch({ type: "RESET" });
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    // validate current step if every thing is okay dispatch to set new step, if last step logit
    const errors = validateAll(state.values, step.fields);
    if (Object.keys(errors).length) {
      dispatch({ type: "SET_ERRORS", payload: errors });
      return;
    }

    if (currentStep === steps.length - 1) {
      alert("form value: " + JSON.stringify(state.values));
      dispatch({ type: "SET_STEP", payload: { step: 0 } });
      return;
    }
    if (currentStep < steps.length - 1) {
      dispatch({ type: "SET_STEP", payload: { step: currentStep + 1 } });
      return;
    }
  };

  return (
    <section className="flex items-center justify-center h-screen w-screen">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 p-4 bg-gray-50 rounded w-200"
      >
        <h2 className="text-xl font-bold">{step.title}</h2>
        {step.fields.map((field) => {
          return (
            <FieldRenderer
              handleUpdate={handleUpdate}
              key={field.id}
              field={field}
              value={state.values[field.name] ?? ""}
              error={state.errors[field.name] ?? null}
              handleBlur={handleBlur}
            />
          );
        })}
        <div className="flex items-center justify-end gap-3">
          <button
            className="h-9 px-3 font-medium flex items-center justify-center rounded bg-gray-300"
            onClick={handleReset}
            type="button"
          >
            Reset
          </button>
          <button
            className="h-9 px-3 font-medium flex items-center justify-center rounded bg-gray-300"
            onClick={handleBack}
            type="button"
          >
            Back
          </button>
          <button
            className="h-9 px-3 font-medium flex items-center justify-center rounded text-white bg-indigo-500"
            type="submit"
          >
            Next
          </button>
        </div>
      </form>
    </section>
  );
}
