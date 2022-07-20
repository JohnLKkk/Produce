import Sockets from '../Sockets'
import InputStructureComponent from './InputStructureComponent'

export default class Vec2InputStructureComponent extends InputStructureComponent{
  constructor () {
    super('Vec2InputStructure');

  }

  _outputSocket () {
    return Sockets.s_Vector2Socket;
  }

  _paramType () {
    return 'vec2';
  }

}
