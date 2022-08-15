import Rete from 'rete';
import Utils from '../utils/Utils'

/**
 * ShaderNode,所有shaderNode的基类。<br/>
 * @author JhonKkk
 * @date 2022年7月14日14点00分
 */
export default class ShaderNode extends Rete.Component{
  static _S_RECORD_POINT = '_S_RECORD_POINT';
  constructor (nodeType) {
    super(nodeType);
    // if(nodeType){
    //   this._m_Uid = nodeType + '_' + Utils.nextShaderNodeId();
    // }
  }

  /**
   * 返回变量名称。<br/>
   * @param node
   * @param metaName
   * @return {string}
   */
  getVarName(node, metaName){
    return node.data._m_Props._m_Uid + '_' + metaName;
  }

  /**
   * 返回节点代码。<br/>
   * @param {Node}
   * @return {string}
   * @private
   */
  _getNodeCodeString(node){
    return '';
  }

  /**
   * 返回节点代码。<br/>
   * @return {string}
   * @private
   */
  _getNodeCode(node){
    // 应该在需要rebuild时重建nodeCode
    // 但这里先稳妥一点,每次调用都build一次nodeCode
    let props = node.data._m_Props;
    let inputs = props._m_InputsMap;
    let outputs = props._m_OutputsMap;

    // 模板替换
    let codeStr = this._getNodeCodeString(node);
    let regex = /[^0-9a-zA-A]?[^0-9a-zA-A]/g;
    for(let input in inputs){
      regex = new RegExp('[^0-9a-zA-A]' + input + '[^0-9a-zA-A]', 'g');
      codeStr = codeStr.replace(regex, inputs[input].varname);
    }
    for(let output in outputs){
      regex = new RegExp('[^0-9a-zA-A]' + output + '[^0-9a-zA-A]', 'g');
      codeStr = codeStr.replace(regex, outputs[output].varname);
    }
    return codeStr;
  }

  /**
   * 构建节点。<br/>
   * @param node
   * @return {*}
   */
  builder (node) {
    if(!node._m_Props){
      node.data._m_Props = {};
      node.data._m_Props._m_Uid = node.name + '_' + Utils.nextShaderNodeId();
      node.data._m_Props._m_ShaderNodeCode = '';
      node.data._m_Props._m_ShaderNodeCodeSource = '';
      node.data._m_Props._m_NodeCode = '';
      node.data._m_Props._m_InputsBinding = {};
      node.data._m_Props._m_InputsConnections = {};
      node.data._m_Props._m_OutputsBinding = {};
      node.data._m_Props._m_InputsMap = {};
      node.data._m_Props._m_OutputsMap = {};
      node.data._m_Props._m_RebuildCode = false;
      // 如果为输出节点,则将生成输出代码
      node.data._m_Props._m_IsOutput = false;
    }
    node = this._builder(node);
    node.data._m_Props._m_NodeCode = this._getNodeCode(node);
    // 由于outputsBinding表示输出声明
    // 声明是可以预先定义并且保持不变的
    this._updateOutputsBinding(node);
    return node;
  }

  /**
   * 更新输出绑定。<br/>
   * @param node
   * @private
   */
  _updateOutputsBinding(node){
    let dv = null;
    for(let output in node.data._m_Props._m_OutputsMap){
      node.data._m_Props._m_OutputsBinding[output] = node.data._m_Props._m_OutputsMap[output].type + ' ' + node.data._m_Props._m_OutputsMap[output].varname;
      dv = node.data._m_Props._m_OutputsMap[output].defaultValue;
      if(dv){
        node.data._m_Props._m_OutputsBinding[output] += ' = ' + dv;
      }
      node.data._m_Props._m_OutputsBinding[output] += ';\n';
    }
  }

  /**
   * 构建节点。<br/>
   * @param node
   * @return {*}
   */
  _builder (node) {
  }

  /**
   * 调用输出处理。<br/>
   * @param {Rete.Node}[node]
   * @private
   */
  _output(node){
    console.log(node.data._m_Props._m_Uid + " ShaderNodeCode:\n" + node.data._m_Props._m_ShaderNodeCode);
  }

  /**
   * 刷新节点。<br/>
   * @param node
   * @param inputs
   * @param outputs
   * @param args
   */
  worker (node, inputs, outputs, ...args) {
    this._worker(node, inputs, outputs, args);
    // 更新输入绑定点
    // 对于每个节点,我们只处理输入绑定
    this._updateBinding(node);
    if(node.data._m_Props._m_RebuildCode){
      node.data._m_Props._m_NodeCode = this._getNodeCode(node);
      node.data._m_Props._m_RebuildCode = false;
    }
    this._updateShaderNodeCode(node);
    if(node.data._m_Props._m_IsOutput){
      this._output(node);
    }
  }

  /**
   * 刷新节点。<br/>
   * @param node
   * @param inputs
   * @param outputs
   * @param args
   */
  _worker (node, inputs, outputs, ...args) {
  }

  /**
   * 返回连接的节点。<br/>
   * @param node
   * @param input
   * @param i
   * @return {null|InputConnectionData}
   * @private
   */
  _getContinueNode(node, input, i){
    if(node.inputs[input].connections.length > i){
      return this.editor.nodes.find(n=>n.id == node.inputs[input].connections[i].node);
    }
    return null;
  }

  /**
   * 初始化已存在的追加点。<br/>
   * @param {String}[targetNodeCode]
   * @param {Object}[outputAlreadyNodeCodeMaps]
   * @private
   */
  _initAlreadyLoadNodeCodeMaps(targetNodeCode, outputAlreadyNodeCodeMaps){
    // 分组lines
    let lines = targetNodeCode.split('\n');
    if(lines.length){
      let recordPoint = null;
      let outputNewNodeCode = '';
      for(let line in lines){
        line = lines[line];
        recordPoint = line.split(ShaderNode._S_RECORD_POINT);
        if(recordPoint.length == 2){
          // 追加记录
          if(!outputAlreadyNodeCodeMaps[recordPoint[1]]){
            // 新增nodeCode
            outputNewNodeCode += line + '\n';
          }
          outputAlreadyNodeCodeMaps[recordPoint[1].trim()] = true;
        }
      }
      return outputNewNodeCode;
    }
    return '';
  }

  /**
   * 添加一个NodeCode。<br/>
   * @param targetNode
   * @return outputNewNodeCode
   * @private
   */
  _addNodeCode(targetNode){
    let targetNodeName = targetNode.data._m_Props._m_Uid;
    return ShaderNode._S_RECORD_POINT + ' ' + targetNodeName + '\n';
  }

  /**
   * 构建ShaderCode。<br/>
   * @param codePoints
   * @param shaderNodeCode
   * @return {*}
   * @private
   */
  _buildShaderCode(codePoints, shaderNodeCode){
    let regex = null;
    for(let codePoint in codePoints){
      regex = new RegExp(ShaderNode._S_RECORD_POINT + ' ' + codePoint, 'g');
      // 匹配并替换
      let targetNode = this.editor.nodes.find(n=>n.data._m_Props._m_Uid == codePoint);
      if(targetNode){
        shaderNodeCode = shaderNodeCode.replace(regex, targetNode.data._m_Props._m_ShaderNodeCodeSource);
      }
    }
    return shaderNodeCode;
  }

  _updateBinding(node){
    let continueNode = null;
    let cont = null;
    let varPin = null;
    let nodeProps = node.data._m_Props;
    for(let input in node.inputs){
      varPin = nodeProps._m_InputsMap[input];
      if(!varPin)continue;
      if(!varPin.skip)
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
    // if(node.inputs.num1.connections.length){
    //   let num1Node = this.editor.nodes.find(n=>n.id == node.inputs.num1.connections[0].node);
    // }
  }

  _updateShaderNodeCode(node){
    let props = node.data._m_Props;
    let shaderNodeCode = '';
    let shaderNodeCodeSource = '';
    shaderNodeCode += '// ' + props._m_Uid + ' : ' + 'Begin\n';
    shaderNodeCodeSource += '// ' + props._m_Uid + ' : ' + 'Begin\n';
    let checks = {};
    let outputAlreadyNodeCodeMaps = {};
    let insertCodes = '';
    // input
    for(let input in node.inputs){
      insertCodes = '';
      // 判断是否插入连接代码
      let cl = node.inputs[input].connections.length;
      if(cl){
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
      if(insertCodes != ''){
        shaderNodeCode += insertCodes;
      }
      shaderNodeCode += (props._m_InputsBinding[input] != undefined ? props._m_InputsBinding[input] : '');
      shaderNodeCodeSource += (props._m_InputsBinding[input] != undefined ? props._m_InputsBinding[input] : '');
    }

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

    props._m_ShaderNodeCodeSource = shaderNodeCodeSource;
    // build shader node code?
    if(props._m_IsOutput){
      shaderNodeCode = this._buildShaderCode(outputAlreadyNodeCodeMaps, shaderNodeCode);
    }
    props._m_ShaderNodeCode = shaderNodeCode;
  }
}
