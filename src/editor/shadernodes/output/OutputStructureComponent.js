import ShaderNode from '../ShaderNode'
import Sockets from '../Sockets'
import Rete from 'rete'
import TextControl from '../param/TextControl'

/**
 * OutputStructureComponent，是所有输出结构类型节点的父类。<br/>
 * @author JohnKkk
 * @date 2022年7月19日20点08分
 */
export default class OutputStructureComponent extends ShaderNode{
  _getNodeCodeString (node) {
    return '';
  }
  static getParam(node){
    let props = node.data._m_Props;
    return {type:props._m_InputsMap['varOut'].type, name:props._m_InputsMap['varOut'].varname};
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
   * 返回输入Socket。<br/>
   * @return {null}
   * @private
   */
  _inputSocket(){
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
    let out = new Rete.Output('varOut', 'VarOut', this._outputSocket());
    let inVar = new Rete.Input('inVar', 'InVar', this._inputSocket());
    let inVarName = new Rete.Input('inVarName', 'VarName', Sockets.s_NoContinueSocket);

    inVarName.addControl(new TextControl(this.editor, "inVarName"));
    node.addInput(inVarName);
    node.addInput(inVar);
    node.addOutput(out);

    // inputMap
    node.data._m_Props._m_InputsMap['inVar'] = {type:this._paramType(), varname:this.getVarName(node, 'inVar'), defaultValue:null};
    return node;
  }

  _updateBinding(node){
    let nodeProps = node.data._m_Props;
    let varname = node.data.inVarName;
    if(varname == undefined || varname.trim() == ''){
      varname = this.getVarName(node, 'inVar');
    }
    nodeProps._m_InputsMap['inVar'].varname = varname;
    super._updateBinding(node);
  }

  _updateShaderNodeCode(node){
    super._updateShaderNodeCode(node);
    // let props = node.data._m_Props;
    // props._m_ShaderNodeCode = props._m_ShaderNodeCodeSource = '';
  }

}
