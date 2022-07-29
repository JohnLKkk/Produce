import Rete from "rete";
import Sockets from "../Sockets";
import ShaderNode from '../ShaderNode'
export default class CommonVertComponent extends ShaderNode {
  constructor() {
    super('CommonVert');
  }

  _builder(node) {
    let projPositionOut = new Rete.Output('projPositionOut', 'ProjPositionOut', Sockets.s_Vector4Socket);

    let inMatrix = new Rete.Input('inMatrix', 'InMatrix', Sockets.s_Matrix4Socket);
    let inPosition = new Rete.Input('inPosition', 'InPosition', Sockets.s_Vector3Socket);

    node.addOutput(projPositionOut);
    node.addInput(inPosition);
    node.addInput(inMatrix);

    // inputMap
    node.data._m_Props._m_InputsMap['inPosition'] = {type:'vec3', varname:this.getVarName(node, 'inPosition')};
    node.data._m_Props._m_InputsMap['inMatrix'] = {type:'mat4', varname:this.getVarName(node, 'inMatrix')};
    // outputMap
    node.data._m_Props._m_OutputsMap['projPositionOut'] = {type:'vec4', varname:this.getVarName(node, 'projPositionOut'), defaultValue:null};
    return node;
  }
  _getNodeCodeString (node) {
    return ' projPositionOut = inMatrix * vec4( inPosition , 1.0f) ;\n';
  }

  _worker(node, inputs, outputs) {
  }
}
