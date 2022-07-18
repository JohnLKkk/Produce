import ShaderNode from '../ShaderNode'
import Sockets from '../Sockets'
import Rete from 'rete'

export default class FragmentOutColorComponent extends ShaderNode{
  constructor () {
    super('FragmentOutColor');

  }
  _builder (node) {
    let inColor = new Rete.Input('inColor', 'Color', Sockets.s_Vector4Socket);
    let nodeProps = node.data._m_Props;
    // inputMap
    nodeProps._m_InputsMap['inColor'] = {type:'vec4', varname:this.getVarName(node, 'inColor'), defaultValue:'vec4(1.0f)'};
    nodeProps._m_IsOutput = true;

    return node
      .addInput(inColor);
  }
  _getNodeCodeString (node) {
    return ' Context.OutColor = inColor ;\n';
  }

}
