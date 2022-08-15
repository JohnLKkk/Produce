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
    let inVar = new Rete.Input('inVar', 'InVar', Sockets.s_OperationSocket);
    let inTrue = new Rete.Input('inTrue', 'True', Sockets.s_OperationSocket);
    let inFalse = new Rete.Input('inFalse', 'False', Sockets.s_OperationSocket);
    let out = new Rete.Output('expressionOut', 'expressionOut', Sockets.s_OperationSocket);

    // inputMap
    node.data._m_Props._m_InputsMap['inVar'] = {type:'float', varname:this.getVarName(node, 'inVar'), defaultValue:null};
    node.data._m_Props._m_InputsMap['inTrue'] = {type:'float', varname:this.getVarName(node, 'inVar'), defaultValue:null};
    node.data._m_Props._m_InputsMap['inFalse'] = {type:'float', varname:this.getVarName(node, 'inVar'), defaultValue:null};
    // outputMap
    node.data._m_Props._m_OutputsMap['expressionOut'] = {type:'float', varname:this.getVarName(node, 'expressionOut'), defaultValue:null};
    node.addInput(inContinue);
    node.addInput(inVar);
    node.addInput(inTrue);
    node.addInput(inFalse);
    node.addOutput(out);

    return node;
  }

  _updateShaderNodeCode(node){
    let props = node.data._m_Props;
    let continueNode = this._getContinueNode(node, 'inContinue', 0);
    // 分支类型,宏类型,上下文
    let branchType = 0;
    if(continueNode){
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
    else{
      return '';
    }
    let shaderNodeCode = '';
    let shaderNodeCodeSource = '';
    let trueCode = '', falseCode = '';
    shaderNodeCode += '// ' + props._m_Uid + ' : ' + 'Begin\n';
    shaderNodeCodeSource += '// ' + props._m_Uid + ' : ' + 'Begin\n';
    let checks = {};
    let outputAlreadyNodeCodeMaps = {};
    let insertCodes = '';
    let cont = null;
    cont = node.inputs['inContinue'].connections[0].output;
    let pName = continueNode.data._m_Props._m_OutputsMap[cont].varname;
    // input
    for(let input in node.inputs){
      if(input == 'inContinue')continue;
      insertCodes = '';
      // 判断是否插入连接代码
      let cl = node.inputs[input].connections.length;
      if(cl){
        cont = node.inputs[input].connections[0].output;
        for(let i = 0;i < cl;i++){
          let continueNode = this.editor.nodes.find(n=>n.id == node.inputs[input].connections[i].node);
          if(!checks[continueNode.data._m_Props._m_Uid]){
            checks[continueNode.data._m_Props._m_Uid] = true;
            // 加载continueNode已有的所有insertCodes
            // 这意味着continueNode应该在当前Node之前就构建完了ShaderNodeCode
            // 好在ReteNode会按照时序依次构建Node
            insertCodes += this._initAlreadyLoadNodeCodeMaps(continueNode.data._m_Props._m_ShaderNodeCode, outputAlreadyNodeCodeMaps);
          }
          if(!outputAlreadyNodeCodeMaps[continueNode.data._m_Props._m_Uid]){
            outputAlreadyNodeCodeMaps[continueNode.data._m_Props._m_Uid] = true;
            insertCodes += this._addNodeCode(continueNode);
          }
        }
      }
      if(input == 'inTrue'){
        trueCode = insertCodes;
        trueCode += (props._m_InputsBinding[input] != undefined ? props._m_InputsBinding[input] : '');
      }
      else if(input == 'inFalse'){
        falseCode = insertCodes;
        falseCode += (props._m_InputsBinding[input] != undefined ? props._m_InputsBinding[input] : '');
      }
      else if(insertCodes != ''){
        shaderNodeCode += insertCodes;
        shaderNodeCode += (props._m_InputsBinding[input] != undefined ? props._m_InputsBinding[input] : '');
        shaderNodeCodeSource += (props._m_InputsBinding[input] != undefined ? props._m_InputsBinding[input] : '');
      }
    }

    // 拼接代码
    // if块
    shaderNodeCode += (branchType == 2) ? 'if( ' + pName + ' ){\n' : '#ifdef ' + pName + ' \n';
    shaderNodeCode += trueCode;
    shaderNodeCode += (branchType == 2) ? '}\nelse{\n' : '#else\n';
    shaderNodeCode += falseCode;
    shaderNodeCode += (branchType == 2) ? '}\n' : '#endif\n';


    // build shader node code
    if(true){
      shaderNodeCode = this._buildShaderCode(outputAlreadyNodeCodeMaps, shaderNodeCode);
    }
    // todo:由于之前设计以插入点排在前面进行代码插入,导致ifelse分支代码节点无法适用于这种方式,所以在这里进行去重
    shaderNodeCode = this._deduplication(shaderNodeCode);

    // output
    for(let output in node.outputs){
      if(!props._m_OutputsBinding[output])continue;
      shaderNodeCode += props._m_OutputsBinding[output];
      shaderNodeCodeSource += props._m_OutputsBinding[output];
    }
    // logic
    shaderNodeCode += props._m_NodeCode;
    shaderNodeCodeSource += props._m_NodeCode;
    shaderNodeCode += '// ' + props._m_Uid + ' : ' + 'End\n';
    shaderNodeCodeSource += '// ' + props._m_Uid + ' : ' + 'End\n';

    props._m_ShaderNodeCodeSource = shaderNodeCode;
    props._m_ShaderNodeCode = shaderNodeCode;
  }

  _getNodeCodeString (node) {
    return ' expressionOut = inVar ;\n';
  }

  _updateBinding(node){
    let nodeProps = node.data._m_Props;
    // 转换类型
    let inVarContinue = super._getContinueNode(node, 'inVar', 0);
    let castType = 'float';
    if(inVarContinue){
      let cont = node.inputs['inVar'].connections[0].output;
      if(cont){
        castType = inVarContinue.data._m_Props._m_OutputsMap[cont].type;
        let varname = inVarContinue.data._m_Props._m_OutputsMap[cont].varname;
        nodeProps._m_InputsMap['inVar'].type = castType;
        nodeProps._m_InputsMap['inTrue'].type = '';
        nodeProps._m_InputsMap['inFalse'].type = '';
      }
    }
    else{
      nodeProps._m_InputsMap['inVar'].type = 'float';
      nodeProps._m_InputsMap['inTrue'].type = 'float';
      nodeProps._m_InputsMap['inFalse'].type = 'float';
    }
    nodeProps._m_OutputsMap['expressionOut'].type = castType;
    this._updateOutputsBinding(node);
    super._updateBinding(node);
  }
}
