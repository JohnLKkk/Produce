import Rete from "rete";
import Sockets from "../Sockets";
import NumberControl from "./NumberControl";
import ShaderNode from '../ShaderNode'
export default class NumberComponent extends ShaderNode {
  constructor() {
    super('Number');
  }

  _builder(node) {
    let out = new Rete.Output('numOut', 'Result', Sockets.s_NumSocket);

    node.addControl(new NumberControl(this.editor, "numOut"));
    node.addOutput(out);

    // outputMap
    node.data._m_Props._m_OutputsMap['numOut'] = {type:'float', varname:this.getVarName(node, 'numOut'), defaultValue:'0.0f'};
    return node;
  }
  _getNodeCodeString (node) {
    let r = node.data.numOut != undefined ? 'float(' + node.data.numOut + ')' : '0.0f';
    return ' numOut = ' + r + ' ;\n';
  }

  _worker(node, inputs, outputs) {
    outputs['numOut'] = node.data.numOut;
    node.data._m_Props._m_RebuildCode = true;
  }
}
