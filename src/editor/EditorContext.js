import Events from 'try3d/src/Core/Util/Events'

export class EditorContext {
  // 默认辅助几何,不会出现在大纲编辑器列表中
  static S_HELPER_GRID = '_helper_grid';

  // EVENTS
  static S_EVENT_SCENE_LOAD_END = "S_EVENT_SCENE_LOAD_END";

  // 唯一实例
  static _s_Instance = null;

  /**
   * 返回唯一实例。<br/>
   * @returns {null}
   */
  static getInstance(){
    if(!EditorContext._s_Instance){
      EditorContext._s_Instance = new EditorContext();
    }
    return EditorContext._s_Instance;
  }

  /**
   * 返回指定scene,默认返回第0个scene。<br/>
   * @param {Number}[index]
   */
  static getScene(index){
    // 这里暂时只返回第0个。
    if(EditorContext._s_Instance.getRenderer()){
      return EditorContext._s_Instance.getRenderer()._scene;
    }
    return null;
  }

  constructor () {
    // 所有工作区
    this.m_Workspaces = {};

    // 渲染器
    this.m_Renderer = null;

    this._m_Events = new Events();
  }

  /**
   * 注册事件。<br/>
   * @param {String}[type 事件类型]
   * @param {Function}[callback 回调函数]
   */
  registerEvent(type, callback){
    this._m_Events.register(type, callback);
  }

  /**
   * 卸载指定事件的指定监听器。<br/>
   * @param {String}[type 事件类型]
   * @param {Function}[callback 回调函数]
   */
  unregisterEvent(type, callback){
    this._m_Events.unregister(type, callback);
  }

  /**
   * 分发事件。<br/>
   * @param {String}[type 事件类型]
   * @param {Object}[data 数据]
   */
  notifyEvent(type, data){
    this._m_Events.trigger(type, data);
  }

  setRenderer(renderer){
    this.m_Renderer = renderer;
  }

  getRenderer(){return this.m_Renderer;}
}
