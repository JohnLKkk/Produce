import Rete from "rete";
import NumberControl from "./NumberControl";
import Sockets from "../Sockets";

export default class MathComponent extends Rete.Component {
  doOperation(v1, v2) {
    return 0;
  }

  builder(node) {
    let inp1 = new Rete.Input("num1", "Value 1", Sockets.s_NumSocket);
    let inp2 = new Rete.Input("num2", "Value 2", Sockets.s_NumSocket);
    let out = new Rete.Output("num", "Result", Sockets.s_NumSocket);

    inp1.addControl(new NumberControl(this.editor, "num1"));
    inp2.addControl(new NumberControl(this.editor, "num2"));

    return node
      .addInput(inp1)
      .addInput(inp2)
      .addControl(new NumberControl(this.editor, "preview", true))
      .addOutput(out);
  }

  worker(node, inputs, outputs) {
    let n1 = inputs["num1"].length ? inputs["num1"][0] : node.data.num1;
    let n2 = inputs["num2"].length ? inputs["num2"][0] : node.data.num2;
    let sum = this.doOperation(n1, n2);

    this.editor.nodes
      .find(n => n.id == node.id)
      .controls.get("preview")
      .setValue(sum);
    outputs["num"] = sum;
  }
}
