import Rete from "rete";
import Sockets from "../Sockets";
import NumberControl from "./NumberControl";
import ShaderNode from '../ShaderNode'
export default class NumberComponent extends ShaderNode {
  constructor() {
    super('Number');
  }

  _builder(node) {
    let out = new Rete.Output('num', 'Result', Sockets.s_NumSocket);

    node.addControl(new NumberControl(this.editor, "num"));
    node.addOutput(out);

    // outputMap
    this._m_OutputsMap['num'] = {type:'float', varname:this.getVarName('num'), defaultValue:'0.0f'};
    return node;
  }

  _worker(node, inputs, outputs) {
    outputs['num'] = node.data.num;
  }
}
