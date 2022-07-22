import ParamComponent from './ParamComponent'
import Sockets from '../Sockets'

export default class Vec2ParamComponent extends ParamComponent{
  constructor () {
    super('Vec2Param');

  }

  _outputSocket () {
    return Sockets.s_PVector2Socket;
  }

  _paramType () {
    return 'vec2';
  }

}
