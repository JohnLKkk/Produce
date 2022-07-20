import ShaderNode from '../ShaderNode'
import Sockets from '../Sockets'
import Rete from 'rete'
import TextControl from './TextControl'

/**
 * ParamComponent，是所有参数类型节点的父类。<br/>
 * @author JohnKkk
 * @date 2022年7月19日09点57分
 */
export default class ParamComponent extends ShaderNode{
  _getNodeCodeString (node) {
    return '';
  }
  static getParam(node){
    let props = node.data._m_Props;
    return {type:props._m_OutputsMap['paramOut'].type, name:props._m_OutputsMap['paramOut'].varname};
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
    let out = new Rete.Output('paramOut', 'Value', this._outputSocket());
    let paramName = new Rete.Input('inParamName', 'ParamName', Sockets.s_NoContinueSocket);

    paramName.addControl(new TextControl(this.editor, "inParamName"));
    node.addInput(paramName);
    node.addOutput(out);

    // outputMap
    node.data._m_Props._m_OutputsMap['paramOut'] = {type:this._paramType(), varname:'Params.' + this.getVarName(node, 'paramOut'), defaultValue:null};
    return node;
  }

  _updateBinding(node){
    let nodeProps = node.data._m_Props;
    let varname = node.data.inParamName;
    if(varname == undefined || varname.trim() == ''){
      varname = this.getVarName(node, 'paramOut');
    }
    nodeProps._m_OutputsMap['paramOut'].varname = 'Params.' + varname;
  }

  _updateShaderNodeCode(node){
    let props = node.data._m_Props;
    props._m_ShaderNodeCode = props._m_ShaderNodeCodeSource = '';
  }

}
