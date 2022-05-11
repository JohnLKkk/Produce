/**
 * BaseCommand。<br/>
 * @author JohnKkk
 * @date 2022年5月11日19点11分
 */
export default class BaseCommand {
  /**
   * BaseCommand。<br/>
   * @param {Function}[data.redo]
   * @param {Function}[data.undo]
   * @param {Object}[data.redoData]
   * @param {Object}[data.undoData]
   */
  constructor (data) {
    this._mData = {};
    this._mData.redo = data.redo;
    this._mData.undo = data.undo;
    this._mData.redoData = data.redoData;
    this._mData.undoData = data.undoData;
  }

  redo(){
    if(this._mData.redo){
      this._mData.redo(this._mData.redoData);
    }
  }

  undo(){
    if(this._mData.undo){
      this._mData.undo(this._mData.undoData);
    }
  }
}
