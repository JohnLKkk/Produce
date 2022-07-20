import Sockets from '../Sockets'
import OutputStructureComponent from './OutputStructureComponent'

export default class Vec4OutputStructureComponent extends OutputStructureComponent{
  constructor () {
    super('Vec4OutputStructure');

  }

  _outputSocket () {
    return Sockets.s_Attribute;
  }

  _inputSocket () {
    return Sockets.s_Vector4Socket;
  }

  _paramType () {
    return 'vec4';
  }

}
