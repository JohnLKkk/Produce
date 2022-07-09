import MathComponent from "./MathComponent";

export default class MultiplyComponent extends MathComponent {
  constructor() {
    super("Multiply");
  }
  doOperation(v1, v2) {
    return v1 * v2;
  }
}
