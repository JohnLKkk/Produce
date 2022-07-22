import Rete from "rete";
import NumberControl from "./NumberControl";
import Sockets from "../Sockets";
import ShaderNode from '../ShaderNode'

export default class MathComponent extends ShaderNode {
  static _s_VarTypes = {
    'bool':0,
    'int':1,
    'float':2,
    'vec2':3,
    'vec3':4,
    'vec4':5
  };

  /**
   * 提升类型转换,将转换为varType1和varType2中其中的一个类型。<br/>
   * @param {String}[varType1]
   * @param {String}[varType2]
   * @return {String}
   */
  static upgradeCast(varType1, varType2){
    return (MathComponent._s_VarTypes[varType1] > MathComponent._s_VarTypes[varType2]) ? varType1 : varType2;
  }

  static cast(varType1, varType2){

  }

  doOperation(v1, v2) {
    return 0;
  }

  _builder(node) {
    let inp1 = new Rete.Input("inNum1", "Value 1", Sockets.s_OperationSocket);
    let inp2 = new Rete.Input("inNum2", "Value 2", Sockets.s_OperationSocket);
    let out = new Rete.Output("numOut", "Result", Sockets.s_OperationSocket);

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
    let n1 = inputs["inNum1"].length ? inputs["inNum1"][0] : node.data.inNum1;
    let n2 = inputs["inNum2"].length ? inputs["inNum2"][0] : node.data.inNum2;
    let sum = this.doOperation(n1, n2);

    this.editor.nodes
      .find(n => n.id == node.id)
      .controls.get("preview")
      .setValue(sum);
    outputs["numOut"] = sum;
  }

  _updateBinding(node){
    let nodeProps = node.data._m_Props;
    // 转换类型
    let numContinue = super._getContinueNode(node, 'inNum1', 0);
    if(numContinue){
      let cont = node.inputs['inNum1'].connections[0].output;
      if(cont){
        nodeProps._m_InputsMap['inNum1'].type = numContinue.data._m_Props._m_OutputsMap[cont].type;
      }
    }
    else{
      nodeProps._m_InputsMap['inNum1'].type = 'float';
    }
    numContinue = super._getContinueNode(node, 'inNum2', 0);
    if(numContinue){
      let cont = node.inputs['inNum2'].connections[0].output;
      if(cont){
        nodeProps._m_InputsMap['inNum2'].type = numContinue.data._m_Props._m_OutputsMap[cont].type;
      }
    }
    else{
      nodeProps._m_InputsMap['inNum2'].type = 'float';
    }
    let type1 = nodeProps._m_InputsMap['inNum1'].type;
    let type2 = nodeProps._m_InputsMap['inNum2'].type;
    let castType = MathComponent.upgradeCast(type1, type2);
    if(type1 == castType){
      // todo:类型转换,确保运算正确
    }
    nodeProps._m_OutputsMap['numOut'].type = castType;
    this._updateOutputsBinding(node);
    super._updateBinding(node);
  }
}
