import ParamComponent from './ParamComponent'
import Sockets from '../Sockets'

export default class IntParamComponent extends ParamComponent{
  constructor () {
    super('IntParam');

  }

  _outputSocket () {
    return Sockets.s_NumSocket;
  }

  _paramType () {
    return 'int';
  }

}
