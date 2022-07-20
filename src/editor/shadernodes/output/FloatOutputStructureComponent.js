import Sockets from '../Sockets'
import OutputStructureComponent from './OutputStructureComponent'

export default class FloatOutputStructureComponent extends OutputStructureComponent{
  constructor () {
    super('FloatOutputStructure');

  }

  _outputSocket () {
    return Sockets.s_Attribute;
  }

  _inputSocket () {
    return Sockets.s_NumSocket;
  }

  _paramType () {
    return 'float';
  }

}
