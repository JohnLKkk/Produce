import MathComponent from "./MathComponent";

export default class MultiplyComponent extends MathComponent {
  constructor() {
    super("Multiply");
  }
  doOperation(v1, v2) {
    return v1 * v2;
  }
  _getNodeCodeString (node) {
    return ' numOut = inNum1 + inNum2 ;\n';
  }
}
