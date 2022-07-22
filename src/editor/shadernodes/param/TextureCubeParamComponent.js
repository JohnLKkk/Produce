import ParamComponent from './ParamComponent'
import Sockets from '../Sockets'

export default class TextureCubeParamComponent extends ParamComponent{
  constructor () {
    super('TextureCubeParam');

  }

  _outputSocket () {
    return Sockets.s_PTextureCubeSocket;
  }

  _paramType () {
    return 'samplerCube';
  }

}
