import ParamComponent from './ParamComponent'
import Sockets from '../Sockets'

export default class Vec3ParamComponent extends ParamComponent{
  constructor () {
    super('Vec3Param');

  }

  _outputSocket () {
    return Sockets.s_Vector3Socket;
  }

  _paramType () {
    return 'vec3';
  }

}
