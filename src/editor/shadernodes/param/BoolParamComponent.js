import ParamComponent from './ParamComponent'
import Sockets from '../Sockets'

export default class BoolParamComponent extends ParamComponent{
  constructor () {
    super('BoolParam');

  }

  _outputSocket () {
    return Sockets.s_BoolSocket;
  }

  _paramType () {
    return 'bool';
  }

}
