import Sockets from '../Sockets'
import OutputStructureComponent from './OutputStructureComponent'

export default class Vec2OutputStructureComponent extends OutputStructureComponent{
  constructor () {
    super('Vec2OutputStructure');

  }

  _outputSocket () {
    return Sockets.s_Attribute;
  }

  _inputSocket () {
    return Sockets.s_Vector2Socket;
  }

  _paramType () {
    return 'vec2';
  }

}
