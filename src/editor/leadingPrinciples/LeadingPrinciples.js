import {EditorContext} from '../EditorContext'
import Try3d from 'try3d/src/Try3d'
import Utils from '../utils/Utils'
import Material from '../common/Material'

/**
 * 大纲编辑器。<br/>
 * @author JohnKkk
 * @date 2022年5月5日16点48分
 */
export default class LeadingPrinciples {
  // EVENTs
  static S_LEADINGPRINCIPLES_EVENT_SELECTED = 'S_LEADINGPRINCIPLES_EVENT_SELECTED';

  // type
  static SG_NODE = 'sg_node';
  static SG_GEOMETRY = 'sg_geometry';
  static SG_LIGHT = 'sg_light';
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
        "value": node,
        "icon": this._getTypeIcon(node.getType()), // 后续根据node.getType()区分图标
        "opened": true,
        "selected": false,
        "disabled": false,
        "loading": false,
        "dragDisabled": !this._canDrag(node.getType()),
        "dropDisabled": !this._canDrop(node.getType()),
        "children": [
        ]
      };
      if(parent){
        parent.push(newNode);
      }

      // 查找所有子节点
      node.getChildren().forEach(c=>{
        // 跳过grid这个节点
        if(c.getName() != EditorContext.S_HELPER_GRID){
          this._getSceneData(newNode.children, c);
        }
      });
    }
  }

  _canDrag(type){
    return true;
  }

  _canDrop(type){
    if(type == 'Node')return true;
    return false;
  }

  getType(type){
    return this._getTypeIcon(type);
  }

  _getTypeIcon(type){
    switch (type) {
      case 'Node':
        return 'sg_node';
      case 'Geometry':
      case 'Box':
      case 'Sphere':
      case 'Plane':
      case 'SkyBox':
        return 'sg_geometry';
      case 'Light':
      case 'DirectionalLight':
      case 'PointLight':
      case 'SportLight':
        return 'sg_light';
      default:
        return '';
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

  newNode(options){
    // 创建一个node
    let scene = EditorContext.getScene(0);
    if(scene){
      let newNode = new Try3d.Node(scene, {id:'node_' + Utils.nextId()});
      return newNode;
    }
    return null;
  }

  newBox(options){
    let scene = EditorContext.getScene(0);
    let box1Mat = Material.getBasicLightingMatIns(scene, true);
    let box = new Try3d.Box(scene, {id:'box_' + Utils.nextId(), xHalf:0.2, yHalf:0.2, zHalf:0.2});
    box1Mat.setParam('ambientColor', new Try3d.Vec4Vars().valueFromXYZW(0.25, 0.25, 0.25, 1.0));
    box1Mat.setParam('diffuseColor', new Try3d.Vec4Vars().valueFromXYZW(1, 1, 1, 1.0));
    box1Mat.setParam('specularColor', new Try3d.Vec4Vars().valueFromXYZW(1.0, 1.0, 1.0, 1.0));
    box1Mat.setParam('shininess', new Try3d.FloatVars().valueOf(64.0));
    box.setMaterial(box1Mat);
    return box;
  }
}
