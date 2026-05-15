import { registerComponent } from "@utils/knockout";
import template from "./input.html?raw";
import { ViewModel } from "./input.js";
import "./input.scss";

registerComponent("my-input", ViewModel, template);