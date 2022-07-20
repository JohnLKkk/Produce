import Sockets from '../Sockets'
import InputStructureComponent from './InputStructureComponent'

export default class BoolInputStructureComponent extends InputStructureComponent{
  constructor () {
    super('BoolInputStructure');

  }

  _outputSocket () {
    return Sockets.s_BoolSocket;
  }

  _paramType () {
    return 'bool';
  }

}
