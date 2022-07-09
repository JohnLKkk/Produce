import MathComponent from "./MathComponent";

export default class DivideComponent extends MathComponent {
  constructor() {
    super("Divide");
  }
  doOperation(v1, v2) {
    return v2 != 0 ? v1 / v2 : 0;
  }
}
