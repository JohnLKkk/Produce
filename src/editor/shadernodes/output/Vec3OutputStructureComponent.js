import Sockets from '../Sockets'
import OutputStructureComponent from './OutputStructureComponent'

export default class Vec3OutputStructureComponent extends OutputStructureComponent{
  constructor () {
    super('Vec3OutputStructure');

  }

  _outputSocket () {
    return Sockets.s_Attribute;
  }

  _inputSocket () {
    return Sockets.s_Vector3Socket;
  }

  _paramType () {
    return 'vec3';
  }

}
