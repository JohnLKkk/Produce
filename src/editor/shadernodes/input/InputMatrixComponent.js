import ShaderNode from '../ShaderNode'
import Sockets from '../Sockets'
import Rete from 'rete'
import TextControl from '../param/TextControl'
import Try3d from 'try3d/src/Try3d'

/**
 * InputMatrixComponent，所有可用的上下文输入矩阵。<br/>
 * @author JohnKkk
 * @date 2022年7月29日11点27分
 */
export default class InputMatrixComponent extends ShaderNode{
  constructor () {
    super('InputMatrix');
  }
  _getNodeCodeString (node) {
    return '';
  }

  _getNodeCode(node){
    return '';
  }

  /**
   * 返回输出Socket。<br/>
   * @return {null}
   * @private
   */
  _outputSocket(){
    return null;
  }

  /**
   * 返回参数类型。<br/>
   * @return {string}
   * @private
   */
  _paramType(){
    return '';
  }

  _builder(node) {
    let inModelMatrix = new Rete.Output('inModelMatrix', 'InModelMatrix', Sockets.s_Matrix4Socket);
    let inViewMatrix = new Rete.Output('inViewMatrix', 'InViewMatrix', Sockets.s_Matrix4Socket);
    let inProjectMatrix = new Rete.Output('inProjectMatrix', 'InProjectMatrix', Sockets.s_Matrix4Socket);
    let inMVPMatrix = new Rete.Output('inMVPMatrix', 'InMVPMatrix', Sockets.s_Matrix4Socket);
    let inVPMatrix = new Rete.Output('inVPMatrix', 'InProjectViewMatrix', Sockets.s_Matrix4Socket);

    node.addOutput(inModelMatrix);
    node.addOutput(inViewMatrix);
    node.addOutput(inProjectMatrix);
    node.addOutput(inMVPMatrix);
    node.addOutput(inVPMatrix);

    // outputMap
    node.data._m_Props._m_OutputsMap['inModelMatrix'] = {type:Try3d.ShaderSource.Context_Data['Context.ModelMatrix'].type, varname:'Context.ModelMatrix', defaultValue:null};
    node.data._m_Props._m_OutputsMap['inViewMatrix'] = {type:Try3d.ShaderSource.Context_Data['Context.ViewMatrix'].type, varname:'Context.ViewMatrix', defaultValue:null};
    node.data._m_Props._m_OutputsMap['inProjectMatrix'] = {type:Try3d.ShaderSource.Context_Data['Context.ProjectMatrix'].type, varname:'Context.ProjectMatrix', defaultValue:null};
    node.data._m_Props._m_OutputsMap['inMVPMatrix'] = {type:Try3d.ShaderSource.Context_Data['Context.ProjectViewModelMatrix'].type, varname:'Context.ProjectViewModelMatrix', defaultValue:null};
    node.data._m_Props._m_OutputsMap['inVPMatrix'] = {type:Try3d.ShaderSource.Context_Data['Context.ProjectViewMatrix'].type, varname:'Context.ProjectViewMatrix', defaultValue:null};
    return node;
  }

  _updateBinding(node){
  }

  _updateShaderNodeCode(node){
    let props = node.data._m_Props;
    props._m_ShaderNodeCode = props._m_ShaderNodeCodeSource = '';
  }

}
