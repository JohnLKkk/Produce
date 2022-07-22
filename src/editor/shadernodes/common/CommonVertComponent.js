import Rete from "rete";
import Sockets from "../Sockets";
import ShaderNode from '../ShaderNode'
export default class CommonVertComponent extends ShaderNode {
  constructor() {
    super('Number');
  }

  _builder(node) {
    let projPositionOut = new Rete.Output('projPositionOut', 'ProjPositionOut', Sockets.s_Vector4Socket);
    let texCoord0Out = new Rete.Output('texCoord0Out', 'TexCoord0Out', Sockets.s_Vector2Socket);
    let texCoord1Out = new Rete.Output('texCoord1Out', 'TexCoord1Out', Sockets.s_Vector2Socket);

    let inWorldViewProjectionMatrix = new Rete.Input('inWorldViewProjectionMatrix', 'InWorldViewProjectionMatrix', Sockets.s_Matrix4Socket);
    let inPosition = new Rete.Input('inPosition', 'InPosition', Sockets.s_Vector3Socket);

    node.addOutput(projPositionOut);
    node.addOutput(texCoord0Out);
    node.addOutput(texCoord1Out);

    // outputMap
    node.data._m_Props._m_OutputsMap['numOut'] = {type:'float', varname:this.getVarName(node, 'numOut'), defaultValue:'0.0f'};
    return node;
  }
  _getNodeCodeString (node) {
    let r = node.data.numOut != undefined ? 'float(' + node.data.numOut + ')' : '0.0f';
    return ' numOut = ' + r + ' ;\n';
  }

  _worker(node, inputs, outputs) {
  }
}
