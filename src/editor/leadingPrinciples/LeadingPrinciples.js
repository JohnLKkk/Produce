import {EditorContext} from '../EditorContext'

/**
 * 大纲编辑器。<br/>
 * @author JohnKkk
 * @date 2022年5月5日16点48分
 */
export default class LeadingPrinciples {
  constructor () {
  }

  /**
   * 获取scene数据。<br/>
   * @param {Array}[parent]
   * @param {Node}[node]
   * @private
   */
  _getSceneData(parent, node){
    if(node){
      // 创建一个新节点
      let newNode = {
        "id": node.getId(),
        "text": node.getName(),
        "value": node.getName(),
        "icon": "", // 后续根据node.getType()区分图标
        "opened": true,
        "selected": false,
        "disabled": false,
        "loading": false,
        "children": [
        ]
      };
      if(parent){
        parent.push(newNode);
      }

      // 查找所有子节点
      node.getChildren().forEach(c=>{
        this._getSceneData(newNode.children, c);
      });
    }
  }

  /**
   * 返回当前场景数据,以便在大纲编辑器中展示。<br/>
   * @returns {[]}
   */
  getData(){
    // 将scene解析为大纲面板渲染列表
    let data = [];
    let editorContext = EditorContext.getInstance();
    if(editorContext.getRenderer() && editorContext.getRenderer()._scene){
      // 开始转换
      // 这里暂时只读取一个scene,后续可以增加为多个scene
      let scene = editorContext.getRenderer()._scene.getSceneNode(0);
      this._getSceneData(data, scene);
    }
    return data;
  }
}
