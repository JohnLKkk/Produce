import Rete from "rete";
import Sockets from "../Sockets";
import NumberControl from "./NumberControl";
export default class NumberComponent extends Rete.Component {
  constructor() {
    super('Number');
  }

  builder(node) {
    let out = new Rete.Output('num', 'Result', Sockets.s_NumSocket);

    node.addControl(new NumberControl(this.editor, "num"));
    node.addOutput(out);
  }

  worker(node, inputs, outputs) {
    outputs['num'] = node.data.num;
  }
}
