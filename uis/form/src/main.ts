import { renderSignupForm } from "./signup";
import "./style.css";

const root = document.querySelector<HTMLDivElement>("#app")!;

document.addEventListener("DOMContentLoaded", () => {
  renderSignupForm(root);
});
