import Rete from "rete";
import Number from '../../../components/shadernodes/math/Number'

export default class NumberControl extends Rete.Control {

  constructor(emitter, key, readonly) {
    super(key);
    this.component = Number;
    this.props = { emitter, key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
