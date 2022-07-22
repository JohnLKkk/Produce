import Rete from "rete";
import Sockets from "../Sockets";
import ShaderNode from '../ShaderNode'
import Inputs from '../input/Inputs'
import Params from '../param/Params'
export default class IfElseBranchComponent extends ShaderNode {
  constructor() {
    super('IfElseBranch');
  }

  _builder(node) {
    let inContinue = new Rete.Input('inContinue', 'InContinue', Sockets.s_BoolSocket);
    let inTrue = new Rete.Input('inTrue', 'True', Sockets.s_OperationSocket);
    let inFalse = new Rete.Input('inFalse', 'False', Sockets.s_OperationSocket);
    let out = new Rete.Output('out', 'Result', Sockets.s_OperationSocket);

    node.addInput(inContinue);
    node.addInput(inTrue);
    node.addInput(inFalse);
    node.addOutput(out);

    return node;
  }
  _if(branchType){
    let ifstr = '';
    switch (branchType) {
      case 0:
        ifstr = '#ifdef Context.';
        break;
      case 1:
        ifstr = '#ifdef Params.';
        break;
      case 0:
        ifstr = 'if( ';
        break;
    }
  }

  _updateBinding(node){
    let continueNode = null;
    let cont = null;
    let varPin = null;
    let nodeProps = node.data._m_Props;
    for(let input in node.inputs){
      varPin = nodeProps._m_InputsMap[input];
      if(!varPin)continue;
      nodeProps._m_InputsBinding[input] = varPin.type + ' ' + varPin.varname;
      // 置空
      nodeProps._m_InputsConnections[input] = null;
      if(node.inputs[input].connections.length){
        continueNode = this.editor.nodes.find(n=>n.id == node.inputs[input].connections[0].node);
        // 绑定输入
        cont = node.inputs[input].connections[0].output;
        if(cont && continueNode){
          nodeProps._m_InputsConnections[input] = {continueNode, cont};
          nodeProps._m_InputsBinding[input] += ' = ' + continueNode.data._m_Props._m_OutputsMap[cont].varname;
        }
        // this._m_InputsBinding[input] += continueNode;
      }
      else{
        // 默认值
        nodeProps._m_InputsBinding[input] += varPin.defaultValue ? ' = ' + varPin.defaultValue : '';
      }
      nodeProps._m_InputsBinding[input] += ';\n';
    }
  }

  _getNodeCodeString (node) {
    let nodeProps = node.data._m_Props;
    let continueNode = super._getContinueNode(node, 'inContinue', 0);
    let code = '';
    if(continueNode){
      // 分支类型,宏类型,上下文
      let branchType = 0;
      // 判断是Params还是Context还是普通条件
      if(Inputs.filterInputContext(continueNode)){
        branchType = 0;
      }
      else if(Params.filter(continueNode)){
        branchType = 1;
      }
      else{
        branchType = 2;
      }
    }
    return code;
  }

  _worker(node, inputs, outputs) {
    outputs['numOut'] = node.data.numOut;
    node.data._m_Props._m_RebuildCode = true;
  }
}
