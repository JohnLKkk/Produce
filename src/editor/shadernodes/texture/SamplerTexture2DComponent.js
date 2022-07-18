import Rete from 'rete';
import Sockets from '../Sockets';
import ShaderNode from '../ShaderNode'

export default class SamplerTexture2DComponent extends ShaderNode{
  constructor () {
    super('SamplerTexture2D');
  }
  _builder (node) {
    let inTexture2D = new Rete.Input('inTexture2D', 'Texture', Sockets.s_Texture2DSocket);
    let inTexCoords = new Rete.Input('inTexCoords', 'TexCoords', Sockets.s_Vector2Socket);
    let rgbaOut = new Rete.Output('rgbaOut', "RGBA", Sockets.s_Vector4Socket);
    let rOut = new Rete.Output('rOut', "R", Sockets.s_NumSocket);
    let gOut = new Rete.Output('gOut', "G", Sockets.s_NumSocket);
    let bOut = new Rete.Output('bOut', "B", Sockets.s_NumSocket);
    let aOut = new Rete.Output('aOut', "A", Sockets.s_NumSocket);

    let nodeProps = node.data._m_Props;
    // inputMap
    nodeProps._m_InputsMap['inTexture2D'] = {type:'sampler2D', varname:this.getVarName(node, 'inTexture2D'), defaultValue:null};
    nodeProps._m_InputsMap['inTexCoords'] = {type:'vec2', varname:this.getVarName(node, 'inTexCoords'), defaultValue:null};

    // outputMap
    nodeProps._m_OutputsMap['rgbaOut'] = {type:'vec4', varname:this.getVarName(node, 'rgbaOut'), defaultValue:'vec4(1.0f)'};
    nodeProps._m_OutputsMap['rOut'] = {type:'float', varname:this.getVarName(node, 'rOut'), defaultValue:this.getVarName(node, 'rgbaOut') + '.r'};
    nodeProps._m_OutputsMap['gOut'] = {type:'float', varname:this.getVarName(node, 'gOut'), defaultValue:this.getVarName(node, 'rgbaOut') + '.g'};
    nodeProps._m_OutputsMap['bOut'] = {type:'float', varname:this.getVarName(node, 'bOut'), defaultValue:this.getVarName(node, 'rgbaOut') + '.b'};
    nodeProps._m_OutputsMap['aOut'] = {type:'float', varname:this.getVarName(node, 'aOut'), defaultValue:this.getVarName(node, 'rgbaOut') + '.a'};

    return node
      .addInput(inTexture2D)
      .addInput(inTexCoords)
      .addOutput(rgbaOut)
      .addOutput(rOut)
      .addOutput(gOut)
      .addOutput(bOut)
      .addOutput(aOut);
  }
  _getNodeCodeString (node) {
    return ' rgbaOut = texture( inTexture2D , inTexCoords ) ;\n';
  }

  _worker (node, inputs, outputs, ...args) {
    // 正常输出用于节点展示
    outputs['rgba'] = node.data.rgba;
  }
}
