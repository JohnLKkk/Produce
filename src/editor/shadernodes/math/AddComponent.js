import MathComponent from "./MathComponent";

export default class AddComponent extends MathComponent {
  constructor() {
    super("Add");
  }
  doOperation(v1, v2) {
    return v1 + v2;
  }

  /**
   * 返回节点代码。<br/>
   * @return {string}
   * @private
   */
  _getNodeCodeString (node) {
    return ' numOut = inNum1 + inNum2 ;\n';
  }

}
