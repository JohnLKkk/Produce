import ParamComponent from './ParamComponent'
import Sockets from '../Sockets'

export default class FloatParamComponent extends ParamComponent{
  constructor () {
    super('FloatParam');

  }

  _outputSocket () {
    return Sockets.s_PNumSocket;
  }

  _paramType () {
    return 'float';
  }

}
