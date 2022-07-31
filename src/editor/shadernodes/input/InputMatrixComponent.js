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
    let inModelMatrix4x4 = new Rete.Output('inModelMatrix4x4', 'InModelMatrix4x4', Sockets.s_Matrix4Socket);
    let inViewMatrix4x4 = new Rete.Output('inViewMatrix4x4', 'InViewMatrix4x4', Sockets.s_Matrix4Socket);
    let inProjectMatrix4x4 = new Rete.Output('inProjectMatrix4x4', 'InProjectMatrix4x4', Sockets.s_Matrix4Socket);
    let inMVPMatrix4x4 = new Rete.Output('inMVPMatrix4x4', 'InMVPMatrix4x4', Sockets.s_Matrix4Socket);
    let inVPMatrix4x4 = new Rete.Output('inVPMatrix4x4', 'InProjViewMatrix4x4', Sockets.s_Matrix4Socket);

    node.addOutput(inModelMatrix4x4);
    node.addOutput(inViewMatrix4x4);
    node.addOutput(inProjectMatrix4x4);
    node.addOutput(inMVPMatrix4x4);
    node.addOutput(inVPMatrix4x4);

    // outputMap
    node.data._m_Props._m_OutputsMap['inModelMatrix4x4'] = {type:Try3d.ShaderSource.Context_Data['Context.ModelMatrix'].type, varname:'Context.ModelMatrix', defaultValue:null};
    node.data._m_Props._m_OutputsMap['inViewMatrix4x4'] = {type:Try3d.ShaderSource.Context_Data['Context.ViewMatrix'].type, varname:'Context.ViewMatrix', defaultValue:null};
    node.data._m_Props._m_OutputsMap['inProjectMatrix4x4'] = {type:Try3d.ShaderSource.Context_Data['Context.ProjectMatrix'].type, varname:'Context.ProjectMatrix', defaultValue:null};
    node.data._m_Props._m_OutputsMap['inMVPMatrix4x4'] = {type:Try3d.ShaderSource.Context_Data['Context.ProjectViewModelMatrix'].type, varname:'Context.ProjectViewModelMatrix', defaultValue:null};
    node.data._m_Props._m_OutputsMap['inVPMatrix4x4'] = {type:Try3d.ShaderSource.Context_Data['Context.ProjectViewMatrix'].type, varname:'Context.ProjectViewMatrix', defaultValue:null};
    return node;
  }

  _updateBinding(node){
  }

  _updateShaderNodeCode(node){
    let props = node.data._m_Props;
    props._m_ShaderNodeCode = props._m_ShaderNodeCodeSource = '';
  }

}
