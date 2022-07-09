import MathComponent from "./MathComponent";

export default class SubtractComponent extends MathComponent {
  constructor() {
    super("Subtract");
  }
  doOperation(v1, v2) {
    return v1 - v2;
  }
}
