import Rete from "rete";
import NumberControl from "./NumberControl";
import Sockets from "../Sockets";
import ShaderNode from '../ShaderNode'

export default class MathComponent extends ShaderNode {
  doOperation(v1, v2) {
    return 0;
  }

  _builder(node) {
    let inp1 = new Rete.Input("inNum1", "Value 1", Sockets.s_NumSocket);
    let inp2 = new Rete.Input("inNum2", "Value 2", Sockets.s_NumSocket);
    let out = new Rete.Output("numOut", "Result", Sockets.s_NumSocket);

    inp1.addControl(new NumberControl(this.editor, "inNum1"));
    inp2.addControl(new NumberControl(this.editor, "inNum2"));

    let nodeProps = node.data._m_Props;
    // inputMap
    nodeProps._m_InputsMap['inNum1'] = {type:'float', varname:this.getVarName(node, 'inNum1'), defaultValue:'0.0f'};
    nodeProps._m_InputsMap['inNum2'] = {type:'float', varname:this.getVarName(node, 'inNum2'), defaultValue:'0.0f'};

    // outputMap
    nodeProps._m_OutputsMap['numOut'] = {type:'float', varname:this.getVarName(node, 'numOut'), defaultValue:'0.0f'};

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumberControl(this.editor, "preview", true))
      .addOutput(out);
  }

  _worker(node, inputs, outputs) {
    // if(node.inputs.num1.connections.length){
    //   let num1Node = this.editor.nodes.find(n=>n.id == node.inputs.num1.connections[0].node);
    //   console.log('num1Node:',num1Node);
    // }
    let n1 = inputs["inNum1"].length ? inputs["inNum1"][0] : node.data.num1;
    let n2 = inputs["inNum2"].length ? inputs["inNum2"][0] : node.data.num2;
    let sum = this.doOperation(n1, n2);

    this.editor.nodes
      .find(n => n.id == node.id)
      .controls.get("preview")
      .setValue(sum);
    outputs["numOut"] = sum;
  }
}
