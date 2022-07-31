import ShaderNode from '../ShaderNode'
import Sockets from '../Sockets'
import Rete from 'rete'
import TextControl from '../param/TextControl'
import Try3d from 'try3d/src/Try3d'

/**
 * InputAttributeComponent，所有可用的顶点输入属性。<br/>
 * @author JohnKkk
 * @date 2022年7月19日19点46分
 */
export default class InputAttributeComponent extends ShaderNode{
  constructor () {
    super('InputAttribute');
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
    let inPosition = new Rete.Output('inPosition', 'InPosition(vec3)', Sockets.s_Vector3Socket);
    let inNormal = new Rete.Output('inNormal', 'InNormal(vec3)', Sockets.s_Vector3Socket);
    let inTangent = new Rete.Output('inTangent', 'InTangent(vec3)', Sockets.s_Vector3Socket);
    let inUv0 = new Rete.Output('inUv0', 'InUv0(vec2)', Sockets.s_Vector2Socket);
    let inJoint0 = new Rete.Output('inJoint0', 'InJoint0(int)', Sockets.s_Vector4Socket);
    let inWeight0 = new Rete.Output('inWeight0', 'InWeight0(vec4)', Sockets.s_Vector4Socket);

    node.addOutput(inPosition);
    node.addOutput(inNormal);
    node.addOutput(inTangent);
    node.addOutput(inUv0);
    node.addOutput(inJoint0);
    node.addOutput(inWeight0);

    // outputMap
    node.data._m_Props._m_OutputsMap['inPosition'] = {type:Try3d.ShaderSource.Context_Data['Context.InPosition'].type, varname:'Context.InPosition', defaultValue:null};
    node.data._m_Props._m_OutputsMap['inNormal'] = {type:Try3d.ShaderSource.Context_Data['Context.InNormal'].type, varname:'Context.InNormal', defaultValue:null};
    node.data._m_Props._m_OutputsMap['inTangent'] = {type:Try3d.ShaderSource.Context_Data['Context.InTangent'].type, varname:'Context.InTangent', defaultValue:null};
    node.data._m_Props._m_OutputsMap['inUv0'] = {type:Try3d.ShaderSource.Context_Data['Context.InUv0'].type, varname:'Context.InUv0', defaultValue:null};
    node.data._m_Props._m_OutputsMap['inJoint0'] = {type:Try3d.ShaderSource.Context_Data['Context.InJoint0'].type, varname:'Context.InJoint0', defaultValue:null};
    node.data._m_Props._m_OutputsMap['inWeight0'] = {type:Try3d.ShaderSource.Context_Data['Context.InWeight0'].type, varname:'Context.InWeight0', defaultValue:null};
    return node;
  }

  _updateBinding(node){
  }

  _updateShaderNodeCode(node){
    let props = node.data._m_Props;
    props._m_ShaderNodeCode = props._m_ShaderNodeCodeSource = '';
  }

}
