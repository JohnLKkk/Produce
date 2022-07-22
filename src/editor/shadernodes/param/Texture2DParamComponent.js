import ParamComponent from './ParamComponent'
import Sockets from '../Sockets'

export default class Texture2DParamComponent extends ParamComponent{
  constructor () {
    super('Texture2DParam');

  }

  _outputSocket () {
    return Sockets.s_PTexture2DSocket;
  }

  _paramType () {
    return 'sampler2D';
  }

}
