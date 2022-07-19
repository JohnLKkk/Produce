import Rete from "rete";
import TextInput from '../../../components/shadernodes/common/TextInput'

export default class TextControl extends Rete.Control {

  constructor(emitter, key, readonly) {
    super(key);
    this.component = TextInput;
    this.props = { emitter, key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
