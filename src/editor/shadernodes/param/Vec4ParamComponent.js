import ParamComponent from './ParamComponent'
import Sockets from '../Sockets'

export default class Vec4ParamComponent extends ParamComponent{
  constructor () {
    super('Vec4Param');

  }

  _outputSocket () {
    return Sockets.s_Vector4Socket;
  }

  _paramType () {
    return 'vec4';
  }

}
