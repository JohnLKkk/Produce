import ShaderNode from '../ShaderNode'
import Sockets from '../Sockets'
import Rete from 'rete'
import MaterialDefFactory from '../MaterialDefFactory'

export default class FragmentShaderOutComponent extends ShaderNode{
  constructor () {
    super('FragmentShaderOut');

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

  _output (node) {
    super._output(node);
    MaterialDefFactory.setFsShader(node.data._m_Props._m_ShaderNodeCode);
    console.log('matDef:\n' + MaterialDefFactory.toMaterialDefString());
  }

  _getNodeCodeString (node) {
    return ' Context.OutColor = inColor ;\n';
  }

}
