import Sockets from '../Sockets'
import OutputStructureComponent from './OutputStructureComponent'

export default class IntOutputStructureComponent extends OutputStructureComponent{
  constructor () {
    super('IntOutputStructure');

  }

  _outputSocket () {
    return Sockets.s_Attribute;
  }

  _inputSocket () {
    return Sockets.s_NumSocket;
  }

  _paramType () {
    return 'int';
  }

}
