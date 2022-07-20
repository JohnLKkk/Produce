import Sockets from '../Sockets'
import InputStructureComponent from './InputStructureComponent'

export default class Vec4InputStructureComponent extends InputStructureComponent{
  constructor () {
    super('Vec4InputStructure');

  }

  _outputSocket () {
    return Sockets.s_Vector4Socket;
  }

  _paramType () {
    return 'vec4';
  }

}
