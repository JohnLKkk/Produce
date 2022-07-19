import ShaderNode from '../ShaderNode'
import Rete from 'rete'
import Sockets from '../Sockets'
import NumberControl from './NumberControl'

export default class ConstructVec3Component extends ShaderNode{
  constructor () {
    super('ConstructVec3');
  }

  _builder(node) {
    let inp1 = new Rete.Input("inX", "X", Sockets.s_NumSocket);
    let inp2 = new Rete.Input("inY", "Y", Sockets.s_NumSocket);
    let inp3 = new Rete.Input("inZ", "Z", Sockets.s_NumSocket);
    let out = new Rete.Output("ResultOut", "Result", Sockets.s_Vector3Socket);

    inp1.addControl(new NumberControl(this.editor, "inX"));
    inp2.addControl(new NumberControl(this.editor, "inY"));
    inp3.addControl(new NumberControl(this.editor, "inZ"));

    let nodeProps = node.data._m_Props;
    // inputMap
    nodeProps._m_InputsMap['inX'] = {type:'float', varname:this.getVarName(node, 'inX'), defaultValue:'0.0f'};
    nodeProps._m_InputsMap['inY'] = {type:'float', varname:this.getVarName(node, 'inY'), defaultValue:'0.0f'};
    nodeProps._m_InputsMap['inZ'] = {type:'float', varname:this.getVarName(node, 'inZ'), defaultValue:'0.0f'};

    // outputMap
    nodeProps._m_OutputsMap['ResultOut'] = {type:'vec3', varname:this.getVarName(node, 'Result'), defaultValue:'vec3( inX , inY , inZ )'};

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addInput(inp3)
      .addOutput(out);
  }

  _worker(node, inputs, outputs) {
    let nodeProps = node.data._m_Props;
    let x = inputs["inX"].length ? inputs["inX"][0] : node.data.inX;
    let y = inputs["inY"].length ? inputs["inY"][0] : node.data.inY;
    let z = inputs["inZ"].length ? inputs["inZ"][0] : node.data.inZ;
    if(x != undefined)
      nodeProps._m_InputsMap['inX'].defaultValue = 'float(' + x + ')';
    if(y != undefined)
      nodeProps._m_InputsMap['inY'].defaultValue = 'float(' + y + ')';
    if(z != undefined)
      nodeProps._m_InputsMap['inZ'].defaultValue = 'float(' + z + ')';

    outputs["ResultOut"] = 'vec3( ' + x + ' , ' + y + ' , ' + z + ' )';
  }
}
