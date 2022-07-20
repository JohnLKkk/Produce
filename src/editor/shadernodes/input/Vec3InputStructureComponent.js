import Sockets from '../Sockets'
import InputStructureComponent from './InputStructureComponent'

export default class Vec3InputStructureComponent extends InputStructureComponent{
  constructor () {
    super('Vec3InputStructure');

  }

  _outputSocket () {
    return Sockets.s_Vector3Socket;
  }

  _paramType () {
    return 'vec3';
  }

}
