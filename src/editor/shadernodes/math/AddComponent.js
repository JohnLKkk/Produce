import MathComponent from "./MathComponent";

export default class AddComponent extends MathComponent {
  constructor() {
    super("Add");
  }
  doOperation(v1, v2) {
    return v1 + v2;
  }
  _getNodeCode (node) {
    let props = node.data._m_Props;
    let inputs = props._m_InputsMap;
    let outputs = props._m_OutputsMap;

    let nodeCode = '' + outputs['numOut'].varname + ' = ' + inputs['inNum1'].varname + ' + ' + inputs['inNum2'].varname + ';\n';
    return nodeCode;
  }
}
