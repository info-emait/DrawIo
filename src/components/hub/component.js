import template from "./hub.html?raw";
import { ViewModel } from "./hub.js";
import { registerComponent } from "@utils";
import "./hub.scss";

registerComponent("my-hub", ViewModel, template);