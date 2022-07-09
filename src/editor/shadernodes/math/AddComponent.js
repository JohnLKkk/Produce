import MathComponent from "./MathComponent";

export default class AddComponent extends MathComponent {
  constructor() {
    super("Add");
  }
  doOperation(v1, v2) {
    return v1 + v2;
  }
}
