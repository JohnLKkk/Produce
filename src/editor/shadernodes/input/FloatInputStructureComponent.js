import Sockets from '../Sockets'
import InputStructureComponent from './InputStructureComponent'

export default class FloatInputStructureComponent extends InputStructureComponent{
  constructor () {
    super('FloatInputStructure');

  }

  _outputSocket () {
    return Sockets.s_NumSocket;
  }

  _paramType () {
    return 'float';
  }

}
