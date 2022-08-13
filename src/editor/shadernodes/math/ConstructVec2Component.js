import ShaderNode from '../ShaderNode'
import Rete from 'rete'
import Sockets from '../Sockets'
import NumberControl from './NumberControl'

export default class ConstructVec2Component extends ShaderNode{
  constructor () {
    super('ConstructVec2');
  }

  _builder(node) {
    let inp1 = new Rete.Input("inX", "X", Sockets.s_NumSocket);
    let inp2 = new Rete.Input("inY", "Y", Sockets.s_NumSocket);
    let out = new Rete.Output("ResultOut", "Result", Sockets.s_Vector2Socket);

    inp1.addControl(new NumberControl(this.editor, "inX"));
    inp2.addControl(new NumberControl(this.editor, "inY"));

    let nodeProps = node.data._m_Props;
    // inputMap
    nodeProps._m_InputsMap['inX'] = {type:'float', varname:this.getVarName(node, 'inX'), defaultValue:'0.0f'};
    nodeProps._m_InputsMap['inY'] = {type:'float', varname:this.getVarName(node, 'inY'), defaultValue:'0.0f'};

    // outputMap
    nodeProps._m_OutputsMap['ResultOut'] = {type:'vec2', varname:this.getVarName(node, 'Result'), defaultValue:'vec2( ' + this.getVarName(node, 'inX') + ' , ' + this.getVarName(node, 'inY') + ' )'};

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addOutput(out);
  }

  _worker(node, inputs, outputs) {
    let nodeProps = node.data._m_Props;
    let x = inputs["inX"].length ? inputs["inX"][0] : node.data.inX;
    let y = inputs["inY"].length ? inputs["inY"][0] : node.data.inY;
    if(x != undefined)
      nodeProps._m_InputsMap['inX'].defaultValue = 'float(' + x + ')';
    if(y != undefined)
      nodeProps._m_InputsMap['inY'].defaultValue = 'float(' + y + ')';

    outputs["ResultOut"] = 'vec2(' + x + ',' + y + ')';
  }
}
