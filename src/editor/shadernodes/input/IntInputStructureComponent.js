import Sockets from '../Sockets'
import InputStructureComponent from './InputStructureComponent'

export default class IntInputStructureComponent extends InputStructureComponent{
  constructor () {
    super('IntInputStructure');

  }

  _outputSocket () {
    return Sockets.s_NumSocket;
  }

  _paramType () {
    return 'int';
  }

}
