import Sockets from '../Sockets'
import OutputStructureComponent from './OutputStructureComponent'

export default class BoolOutputStructureComponent extends OutputStructureComponent{
  constructor () {
    super('BoolOutputStructure');

  }

  _outputSocket () {
    return Sockets.s_Attribute;
  }

  _inputSocket () {
    return Sockets.s_BoolSocket;
  }

  _paramType () {
    return 'bool';
  }

}
