import ShaderNode from '../ShaderNode'
import Rete from 'rete'
import Sockets from '../Sockets'
import NumberControl from './NumberControl'

export default class ConstructVec4Component extends ShaderNode{
  constructor () {
    super('ConstructVec4');
  }

  _builder(node) {
    let inp1 = new Rete.Input("inX", "X", Sockets.s_NumSocket);
    let inp2 = new Rete.Input("inY", "Y", Sockets.s_NumSocket);
    let inp3 = new Rete.Input("inZ", "Z", Sockets.s_NumSocket);
    let inp4 = new Rete.Input("inW", "W", Sockets.s_NumSocket);
    let out = new Rete.Output("ResultOut", "Result", Sockets.s_Vector4Socket);

    inp1.addControl(new NumberControl(this.editor, "inX"));
    inp2.addControl(new NumberControl(this.editor, "inY"));
    inp3.addControl(new NumberControl(this.editor, "inZ"));
    inp4.addControl(new NumberControl(this.editor, "inW"));

    let nodeProps = node.data._m_Props;
    // inputMap
    nodeProps._m_InputsMap['inX'] = {type:'float', varname:this.getVarName(node, 'inX'), defaultValue:'0.0f'};
    nodeProps._m_InputsMap['inY'] = {type:'float', varname:this.getVarName(node, 'inY'), defaultValue:'0.0f'};
    nodeProps._m_InputsMap['inZ'] = {type:'float', varname:this.getVarName(node, 'inZ'), defaultValue:'0.0f'};
    nodeProps._m_InputsMap['inW'] = {type:'float', varname:this.getVarName(node, 'inW'), defaultValue:'0.0f'};

    // outputMap
    nodeProps._m_OutputsMap['ResultOut'] = {type:'vec4', varname:this.getVarName(node, 'Result'), defaultValue:'vec4( ' + this.getVarName(node, 'inX') + ' , ' + this.getVarName(node, 'inY') + ' , ' + this.getVarName(node, 'inZ') + ' , ' + this.getVarName(node, 'inW') + ' )'};

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addInput(inp3)
      .addInput(inp4)
      .addOutput(out);
  }

  _worker(node, inputs, outputs) {
    let nodeProps = node.data._m_Props;
    let x = inputs["inX"].length ? inputs["inX"][0] : node.data.inX;
    let y = inputs["inY"].length ? inputs["inY"][0] : node.data.inY;
    let z = inputs["inZ"].length ? inputs["inZ"][0] : node.data.inZ;
    let w = inputs["inW"].length ? inputs["inW"][0] : node.data.inW;
    if(x != undefined)
      nodeProps._m_InputsMap['inX'].defaultValue = 'float(' + x + ')';
    if(y != undefined)
      nodeProps._m_InputsMap['inY'].defaultValue = 'float(' + y + ')';
    if(z != undefined)
      nodeProps._m_InputsMap['inZ'].defaultValue = 'float(' + z + ')';
    if(w != undefined)
      nodeProps._m_InputsMap['inW'].defaultValue = 'float(' + w + ')';

    outputs["ResultOut"] = 'vec3( ' + x + ' , ' + y + ' , ' + z + ' , ' + w + ' )';
  }
}
