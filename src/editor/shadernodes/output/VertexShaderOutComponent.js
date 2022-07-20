import ShaderNode from '../ShaderNode'
import Sockets from '../Sockets'
import Rete from 'rete'
import MaterialDefFactory from '../MaterialDefFactory'

export default class VertexShaderOutComponent extends ShaderNode{
  constructor () {
    super('VertexShaderOut');

  }

  _builder (node) {
    let inPosition = new Rete.Input('inPosition', 'Position', Sockets.s_Vector4Socket);
    let inAttributes = new Rete.Input('inAttributes', 'Attributes', Sockets.s_Attribute, true);
    let nodeProps = node.data._m_Props;
    // inputMap
    nodeProps._m_InputsMap['inPosition'] = {type:'vec4', varname:this.getVarName(node, 'inPosition'), defaultValue:'vec4(1.0f)'};
    nodeProps._m_IsOutput = true;

    return node
      .addInput(inPosition)
      .addInput(inAttributes);
  }

  _output (node) {
    super._output(node);
    MaterialDefFactory.setVsShader(node.data._m_Props._m_ShaderNodeCode);
    console.log('matDef:\n' + MaterialDefFactory.toMaterialDefString());
  }

  _getNodeCodeString (node) {
    return ' Context.OutPosition = inPosition ;\n';
  }

}
