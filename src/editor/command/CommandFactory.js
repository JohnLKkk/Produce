import CommandManager from './CommandManager'
import BaseCommand from './BaseCommand'
import Utils from '../utils/Utils'

/**
 * Factory。<br/>
 * 用于快速创建命令。<br/>
 * @author JohnKkk
 * @date 2022年7月8日13点06分
 */
export default class CommandFactory {
  static _s_IsCommand = true;
  static setIsCommand(isCommand){
    CommandFactory._s_IsCommand = isCommand;
  }
  static isCommand(){
    return CommandFactory._s_IsCommand;
  }
  static createFastCommand(oldValue, undo, newValue, redo, noExc){
    let command = new BaseCommand({
      redo: redo,
      undo: undo,
      redoData: newValue,
      undoData: oldValue
    });
    if(!noExc)
      CommandManager.getInstance().executeCommand(command);
    return command;
  }
}
