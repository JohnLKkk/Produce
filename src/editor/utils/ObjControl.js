/**
 * ObjControl用于提供对3D视图下的对象操作，包括选中，平移，旋转和缩放。<br/>
 * @author Kkk
 * @date 2022年6月27日16点15分
 */
import Try3d from 'try3d/src/Try3d'
import ShapeFactory from '../common/ShapeFactory'
import {EditorContext} from '../EditorContext'
import LeadingPrinciples from '../leadingPrinciples/LeadingPrinciples'
import Viewer from '../viewer/Viewer'

export default class ObjControl extends Try3d.Component{
  constructor (owner, cfg) {
    super(owner, cfg)
    if(!(owner instanceof Try3d.Scene)){
      console.error('owner必须是Try3d.Scene或其子类!');
    }


    this._m_Gizmo = new Try3d.Node(owner, {id:'GIZMO'});
    this._m_LastObj = null;
    this._m_SyncGizmoToObj = ()=>{
      // 因为lastObj可能是一个geometry
      // geometry我们不为其添加子节点
      // 同时，由于Gizmo本身要操作LastObj，所以不应该成为LastObj的子节点来同步变换状态
      // 所以这里通过事件监听处理
      this._m_Gizmo.setLocalTranslation(this._m_LastObj.getWorldTranslation());
      this._m_Gizmo.setLocalRotation(this._m_LastObj.getWorldRotation());
      // 由于我们需要保存缩放Gizmo，所以这里不需要同步缩放
      // this._m_Gizmo.setLocalScale(this._m_LastObj.getWorldScale());
    };
    // arrow
    let xArrow = ShapeFactory.createArrow({owner, id:'xArrow', extent:new Try3d.Vector3(1, 0, 0), matStrId:"x"});
    xArrow.castShadow(false);
    xArrow.receiveShadow(false);
    this._m_Gizmo.addChildren(xArrow);

    let yArrow = ShapeFactory.createArrow({owner, id:'yArrow', extent:new Try3d.Vector3(0, 1, 0), matStrId:"y"});
    yArrow.castShadow(false);
    yArrow.receiveShadow(false);
    this._m_Gizmo.addChildren(yArrow);

    let zArrow = ShapeFactory.createArrow({owner, id:'zArrow', extent:new Try3d.Vector3(0, 0, 1), matStrId:"z"});
    zArrow.castShadow(false);
    zArrow.receiveShadow(false);
    this._m_Gizmo.addChildren(zArrow);
    let fixedControl2 = new Try3d.FixedControl(this._m_Gizmo, {id:'GIZMO_FIXED_CONTROL'});
    fixedControl2.setWorldSizeFactor(0.55);


    // 事件处理
    EditorContext.getInstance().registerEvent(LeadingPrinciples.S_LEADINGPRINCIPLES_EVENT_SELECTED, (obj)=>{this.handler(obj);});
    EditorContext.getInstance().registerEvent(Viewer.S_VIEWER_EVENT_SELECTED, (obj)=>{this.handler(obj);});
  }

  /**
   * 处理一个选中物体。<br/>
   * @param {Object}[curObj]
   */
  handler(curObj){
    let scene = EditorContext.getScene();
    if(scene){
      let helperNode = scene.getSceneNode(0).getChildrenAtName(EditorContext.S_HELPER_NODE);
      // this._m_Gizmo.setLocalTranslation(curObj.getWorldTranslation());
      // this._m_Gizmo.setLocalRotation(curObj.getWorldRotation());
      // this._m_Gizmo.setLocalScale(curObj.getWorldScale());
      if(this._m_Gizmo.getParent()){
        this._m_Gizmo.getParent().removeChildren(this._m_Gizmo);
      }
      if(helperNode && this._m_Gizmo.getParent() != helperNode){
        helperNode.addChildren(this._m_Gizmo);
      }

      if(this._m_LastObj != curObj){
        this._m_Gizmo.setLocalTranslation(curObj.getWorldTranslation());
        this._m_Gizmo.setLocalRotation(curObj.getWorldRotation());
        // this._m_Gizmo.setLocalScale(curObj.getWorldScale());

        if(this._m_LastObj){
          this._m_LastObj.off(Try3d.Node.S_WORLD_MATRIX_UPDATE, this._m_SyncGizmoToObj);
        }
        this._m_LastObj = curObj;
        this._m_LastObj.on(Try3d.Node.S_WORLD_MATRIX_UPDATE, this._m_SyncGizmoToObj);
      }
    }
  }

}
