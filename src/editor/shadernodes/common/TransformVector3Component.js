import Rete from "rete";
import Sockets from "../Sockets";
import ShaderNode from '../ShaderNode'
export default class TransformVector3Component extends ShaderNode {
  constructor() {
    super('TransformVector3');
  }

  _builder(node) {
    let vec4Out = new Rete.Output('vec4Out', 'Vec4Out', Sockets.s_Vector4Socket);

    let inMatrix4x4 = new Rete.Input('inMatrix4x4', 'InMatrix4x4', Sockets.s_Matrix4Socket);
    let inVec3 = new Rete.Input('inVec3', 'InVec3', Sockets.s_Vector3Socket);

    node.addOutput(vec4Out);
    node.addInput(inVec3);
    node.addInput(inMatrix4x4);

    // inputMap
    node.data._m_Props._m_InputsMap['inVec3'] = {type:'vec3', varname:this.getVarName(node, 'inVec3')};
    node.data._m_Props._m_InputsMap['inMatrix4x4'] = {type:'mat4', varname:this.getVarName(node, 'inMatrix4x4')};
    // outputMap
    node.data._m_Props._m_OutputsMap['vec4Out'] = {type:'vec4', varname:this.getVarName(node, 'vec4Out'), defaultValue:null};
    return node;
  }
  _getNodeCodeString (node) {
    return ' vec4Out = inMatrix4x4 * vec4( inVec3 , 1.0f) ;\n';
  }

  _worker(node, inputs, outputs) {
  }
}
