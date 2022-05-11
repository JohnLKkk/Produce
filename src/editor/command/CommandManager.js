/**
 * CommandManager。<br/>
 * @author JohnKkk
 * @date 2022年5月11日16点57分
 */
export default class CommandManager {
  // 最多缓存100条命令
  static S_MAX_COMMANDS = 100;
  static _s_Instance = null;

  constructor () {
    this._m_Undos = [];
    this._m_Redos = [];
  }

  static getInstance(){
    if(!CommandManager._s_Instance){
      CommandManager._s_Instance = new CommandManager();
    }
    return CommandManager._s_Instance;
  }

  _addToUndos(command){
    if((this._m_Undos.length + 1) > CommandManager.S_MAX_COMMANDS){
      this._m_Undos.shift();
    }
    this._m_Undos.push(command);
  }

  _addToRedos(command){
    if((this._m_Redos.length + 1) > CommandManager.S_MAX_COMMANDS){
      this._m_Redos.shift();
    }
    this._m_Redos.push(command);
  }

  /**
   * 执行命令。<br/>
   * @param {Object}[command]
   */
  executeCommand(command){
    if(command){
      command.redo();
      this._addToUndos(command);
      // 一旦开始执行命令,意味着开始一个新命令集,所以清除旧的Redos列表
      if(this._m_Redos.length)
        this._m_Redos = [];
    }
  }

  /**
   * 撤销最后一个命令。<br/>
   */
  undoLastCommand(){
    if(this._m_Undos.length){
      let lastCommand = this._m_Undos.pop();
      lastCommand.undo();
      this._addToRedos(lastCommand);
    }
  }

  /**
   * 重做最后一个命令。<br/>
   */
  redoLastCommand(){
    if(this._m_Redos.length){
      let lastCommand = this._m_Redos.pop();
      lastCommand.redo();
      this._addToUndos(lastCommand);
    }
  }

}
