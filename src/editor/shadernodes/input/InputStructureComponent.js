import ShaderNode from '../ShaderNode'
import Sockets from '../Sockets'
import Rete from 'rete'
import TextControl from '../param/TextControl'

/**
 * InputStructureComponent，是所有输入结构类型节点的父类。<br/>
 * @author JohnKkk
 * @date 2022年7月19日18点31分
 */
export default class InputStructureComponent extends ShaderNode{
  _getNodeCodeString (node) {
    return '';
  }
  static getParam(node){
    let props = node.data._m_Props;
    return {type:props._m_OutputsMap['valueOut'].type, name:props._m_OutputsMap['valueOut'].varname};
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
    let out = new Rete.Output('valueOut', 'Value', this._outputSocket());
    let inVarName = new Rete.Input('inVarName', 'VarName', Sockets.s_NoContinueSocket);

    inVarName.addControl(new TextControl(this.editor, "inVarName"));
    node.addInput(inVarName);
    node.addOutput(out);

    // outputMap
    node.data._m_Props._m_OutputsMap['valueOut'] = {type:this._paramType(), varname:this.getVarName(node, 'valueOut'), defaultValue:null};
    return node;
  }

  _updateBinding(node){
    let nodeProps = node.data._m_Props;
    let varname = node.data.inVarName;
    if(varname == undefined || varname.trim() == ''){
      varname = this.getVarName(node, 'valueOut');
    }
    nodeProps._m_OutputsMap['valueOut'].varname = varname;
  }

  _updateShaderNodeCode(node){
    let props = node.data._m_Props;
    props._m_ShaderNodeCode = props._m_ShaderNodeCodeSource = '';
  }

}
