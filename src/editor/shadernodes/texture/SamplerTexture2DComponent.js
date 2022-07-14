import Rete from 'rete';
import Sockets from '../Sockets';

export default class SamplerTexture2DComponent extends Rete.Component{
  // 当前节点表达式
  _m_ShaderNode = null;
  constructor () {
    super('SamplerTexture');
    this._m_ShaderNode = '';
  }
  builder (node) {
    let inTexture2D = new Rete.Input('inTexture2D', 'Texture', Sockets.s_Texture2DSocket);
    let inTexCoords = new Rete.Input('inTexCoords', 'TexCoords', Sockets.s_NumArraySocket);
    let rgbaOut = new Rete.Output('rgbaOut', "RGBA", Sockets.s_NumArraySocket);
    let rOut = new Rete.Output('rOut', "R", Sockets.s_NumSocket);
    let gOut = new Rete.Output('gOut', "G", Sockets.s_NumSocket);
    let bOut = new Rete.Output('bOut', "B", Sockets.s_NumSocket);
    let aOut = new Rete.Output('aOut', "A", Sockets.s_NumSocket);

    return node
      .addInput(inTexture2D)
      .addInput(inTexCoords)
      .addOutput(rgbaOut)
      .addOutput(rOut)
      .addOutput(gOut)
      .addOutput(bOut)
      .addOutput(aOut);
  }
  worker (node, inputs, outputs, ...args) {
    // 正常输出用于节点展示
    outputs['rgba'] = node.data.rgba;
    // 传递表达式
  }
}
