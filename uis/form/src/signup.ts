//State
interface Field {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
}
interface FormErrors {
  email: string | null;
  name: string | null;
  password: string | null;
  confirmPassword: string | null;
}
interface State {
  fields: Field;
  errors: FormErrors;
}

type Action =
  | {
      type: "SET_FIELD";
      payload: { field: keyof Field; value: string };
    }
  | {
      type: "RESET_FIELD";
    }
  | {
      type: "SET_ERRORS";
      payload: Partial<FormErrors>;
    };

const DEFAULT_STATE: State = {
  fields: { name: "", email: "", password: "", confirmPassword: "" },
  errors: {
    name: null,
    email: null,
    password: null,
    confirmPassword: null,
  },
};
let state: State = DEFAULT_STATE;

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_FIELD":
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.payload.field]: action.payload.value,
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
    case "RESET_FIELD":
      return DEFAULT_STATE;
    default:
      return state;
  }
}

function dispatch(action: Action) {
  state = reducer(state, action);
}

function hasError(errors: FormErrors) {
  return Object.values(errors).some(Boolean);
}
function validate<k extends keyof Field>(
  field: k,
  value: Field[k],
  state: Field,
): string | null {
  switch (field) {
    case "name": {
      const val = value.trim();
      if (!val) return "Name is required";
      if (val.length < 3) return "Name should be greater than 3 charcaters";
      if (val.length > 30) return "Name should be less than 30 characters";
      return null;
    }
    case "email": {
      const val = value.trim();
      if (!val) return "Email is required";
      if (!val.includes("@")) return "Email should be valid email";
      return null;
    }
    case "password": {
      const val = value.trim();
      if (!val) return "Password is required";
      if (val.length < 8) return "Password should be greater than 8 charcaters";
      if (val.length > 32) return "Password should be less than 32 characters";
      if (state.confirmPassword && state.confirmPassword !== val)
        return "Password should match the confirmPassword";
      return null;
    }
    case "confirmPassword": {
      const val = value.trim();
      if (!val) return "Confirm Password is required";
      if (val.length < 8)
        return "Confirm Password should be greater than 8 charcaters";
      if (val.length > 32)
        return "Confirm Password should be less than 32 characters";
      if (state.password && state.password !== val)
        return "Confirm Password should match the Password";

      return null;
    }
    default:
      return null;
  }
}
function validateAll(field: Field) {
  const errors: Partial<FormErrors> = {};
  Object.keys(field).forEach((key: keyof Field) => {
    const error = validate(key, field[key], state.fields);
    errors[key] = error ?? null;
  });
  dispatch({ type: "SET_ERRORS", payload: errors });
}

export function renderSignupForm(root: HTMLDivElement) {
  root.innerHTML = `
        <div class="signup-form">
          <h2>Signup</h2>
          <form class="form" data-action="SIGNUP_FORM">
          <div class="field">
            <label for="name">Name</label>
            <input  type="text" name="name" id="name"/>
            <span data-error="name">${state.errors.name ?? ""}</span>
          </div>
          <div class="field">
          <label for="email">Email</label>
            <input  type="email" name="email" id="email"/>
            <span data-error="email">${state.errors.email ?? ""}</span>
          </div>
          <div class="field">
          <label  for="password">Password</label>
            <input  type="password" name="password" id="password"/>
            <span data-error="password">${state.errors.password ?? ""}</span>
          </div>
          <div class="field">
          <label for="confirmPassword">Confirm Password</label>
            <input  type="password" name="confirmPassword" id="confirmPassword"/>
            <span data-error="confirmPassword">${state.errors.confirmPassword ?? ""}</span>
          </div>
          <div class="form_action">
            <button type="button" data-action="RESET">Reset</button>
            <button type="submit">Submit</button>
          </div>
          </form>
        </div>
    `;
  const formContainer = root.querySelector<HTMLFormElement>(
    '[data-action="SIGNUP_FORM"]',
  )!;

  formContainer.addEventListener("submit", (event) => {
    console.log("Form submit");
    const target = event.target;
    if (!(target instanceof HTMLFormElement)) return;
    const actionElement = target.closest<HTMLFormElement>(
      '[data-action="SIGNUP_FORM"]',
    );
    event.preventDefault();
    console.log("Form submit");
    if (!actionElement) return;
    validateAll(state.fields);
    renderErrors(root);
    if (hasError(state.errors)) return;
    alert("Form submitted" + JSON.stringify(state.fields));
    dispatch({ type: "RESET_FIELD" });
    formContainer.reset();
  });

  formContainer.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const { name, value } = target as { name: keyof Field; value: string };
    dispatch({ type: "SET_FIELD", payload: { field: name, value } });
  });
  formContainer.addEventListener("focusout", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const { name, value } = target as { name: keyof Field; value: string };
    const error = validate(name as keyof Field, value, state.fields);
    dispatch({ type: "SET_ERRORS", payload: { [name]: error } });
    renderErrors(root);
  });
  formContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLButtonElement)) return;
    const action = target.dataset.action;
    if (action === "RESET") {
      dispatch({ type: "RESET_FIELD" });
      formContainer.reset();
      renderErrors(root);
    }
  });
}

function renderErrors(root: HTMLDivElement) {
  Object.entries(state.errors).forEach(([key, value]) => {
    const errorContainer = root
      .querySelector(".signup-form")!
      .querySelector<HTMLElement>(`[data-error="${key}"]`);

    if (!errorContainer) return;

    errorContainer.textContent = value ?? "";
  });
}
