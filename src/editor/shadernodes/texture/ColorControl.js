import Rete from 'rete'
import Color from '../../../components/shadernodes/common/Color'

export default class ColorControl extends Rete.Control {

  constructor(emitter, key, readonly) {
    super(key);
    this.component = Color;
    this.props = { emitter, key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
