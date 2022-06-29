/**
 * ObjControl用于提供对3D视图下的对象操作，包括选中，平移，旋转和缩放。<br/>
 * @author Kkk
 * @date 2022年6月27日16点15分
 */
import Try3d from 'try3d/src/Try3d'
import ShapeFactory from '../common/ShapeFactory'
import {EditorContext} from '../EditorContext'
import LeadingPrinciples from '../leadingPrinciples/LeadingPrinciples'
import Material from '../common/Material'
import Viewer from '../viewer/Viewer'

export default class ObjControl extends Try3d.Component{
  // GizmoID
  static S_GIZMO = 'S_GIZMO';
  static S_TRANSLATE_ACTION = 'S_TRANSLATE_ACTION';
  static S_ROTATE_ACTION = 'S_ROTATE_ACTION';
  static S_SCALE_ACTION = 'S_SCALE_ACTION';
  static S_ARROW_HEAD_X = "S_ARROW_HEAD_X";
  static S_ARROW_HEAD_Y = "S_ARROW_HEAD_Y";
  static S_ARROW_HEAD_Z = "S_ARROW_HEAD_Z";
  static S_AXIS_X = "S_AXIS_X";
  static S_AXIS_Y = "S_AXIS_Y";
  static S_AXIS_Z = "S_AXIS_Z";
  static S_GIZMO_MAP = [ObjControl.S_GIZMO,
    ObjControl.S_TRANSLATE_ACTION,
    ObjControl.S_ROTATE_ACTION,
    ObjControl.S_SCALE_ACTION,
    ObjControl.S_ARROW_HEAD_X,
    ObjControl.S_ARROW_HEAD_Y,
    ObjControl.S_ARROW_HEAD_Z,
    ObjControl.S_AXIS_X,
    ObjControl.S_AXIS_Y,
    ObjControl.S_AXIS_Z
  ];
  // ActionMode
  static S_ACTION_MODE_TRANSLATE = 'S_ACTION_MODE_TRANSLATE';
  static S_ACTION_MODE_ROTATE = 'S_ACTION_MODE_ROTATE';
  static S_ACTION_MODE_SCALE = 'S_ACTION_MODE_SCALE';


  constructor (owner, cfg) {
    super(owner, cfg)
    if(!(owner instanceof Try3d.Scene)){
      console.error('owner必须是Try3d.Scene或其子类!');
    }


    this._m_Gizmo = null;
    this._m_TranslateAction = null;
    this._m_RotateAction = null;
    this._m_ScaleAction = null;
    this._m_GizmoMap = {};
    this._m_GizmoDrawables = [];
    this._m_ActionMode = ObjControl.S_ACTION_MODE_TRANSLATE;
    this._createGizmo();
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

    // 事件处理
    EditorContext.getInstance().registerEvent(LeadingPrinciples.S_LEADINGPRINCIPLES_EVENT_SELECTED, (obj)=>{this.handler(obj);});
    EditorContext.getInstance().registerEvent(Viewer.S_VIEWER_EVENT_SELECTED, (obj)=>{this.handler(obj);});
    // hit
    let PICKABLE = this._m_Scene.getComponent(EditorContext.S_PICKABLE);
    let input = Try3d.Input.getInput(this._m_Scene, {id:this._m_Scene.getId()});
    input.on('mousemove', (uv)=>{
      // 实时pick
      // 以便进行高亮显示
      let result = PICKABLE.immediatelyPick(uv[0], uv[1], this._m_GizmoDrawables);
      if(result){
      }
    });
    input.on('mousedown', (buttonId)=>{
      if(buttonId == Try3d.Input.S_MOUSE_BUTTON0_DOWN){
        let uv = input.getMouseCoords();
      }
    });
  }

  /**
   * 设置actionMode
   * @param {Object}[actionMode 只能未ObjControl的枚举]
   */
  setActionMode(actionMode){
    switch (actionMode) {
      case ObjControl.S_ACTION_MODE_TRANSLATE:
        break;
      case ObjControl.S_ACTION_MODE_ROTATE:
        break;
      case ObjControl.S_ACTION_MODE_SCALE:
        break;
    }
    this._m_ActionMode = actionMode;
  }

  /**
   * 创建Gizmo。<br/>
   * @private
   */
  _createGizmo(){
    this._m_Gizmo = new Try3d.Node(this._m_Scene, {id:ObjControl.S_GIZMO});
    // info
    const radius = 1.0;
    const hoopRadius = radius - 0.2;
    const tubeRadius = 0.009;
    const arrowRadius = 0.05;

    // materials
    let redMat = new Try3d.Material(this._m_Scene, {id:"S_GIZMO_RED_MAT", materialDef:Material.S_GIZMO_DEF});
    redMat.setParam("color", new Try3d.Vec4Vars().valueFromXYZW(1, 0, 0, 1.0));
    let greenMat = new Try3d.Material(this._m_Scene, {id:"S_GIZMO_GREEN_MAT", materialDef:Material.S_GIZMO_DEF});
    greenMat.setParam("color", new Try3d.Vec4Vars().valueFromXYZW(0, 1, 0, 1.0));
    let blueMat = new Try3d.Material(this._m_Scene, {id:"S_GIZMO_BLUE_MAT", materialDef:Material.S_GIZMO_DEF});
    blueMat.setParam("color", new Try3d.Vec4Vars().valueFromXYZW(0, 0, 1, 1.0));

    // translateAction
    this._m_TranslateAction = new Try3d.Node(this._m_Scene, {id:ObjControl.S_TRANSLATE_ACTION});
    // x-Axis
    let xAxisHelper = new Try3d.Node(this._m_Scene, {id:'X_AXIS_HELPER'});
    let arrowHeadX = new Try3d.Cylinder(this._m_Scene, {id:ObjControl.S_ARROW_HEAD_X, radiusTop:0.001, radiusBottom:arrowRadius, height:0.2});
    arrowHeadX.setMaterial(redMat);
    arrowHeadX.receiveShadow(false);
    arrowHeadX.castShadow(false);
    arrowHeadX.setFilterFlag(Try3d.Node.S_NEVER);
    arrowHeadX.setLocalTranslationXYZ(0, radius + 0.1, 0);
    xAxisHelper.addChildren(arrowHeadX);
    this._m_GizmoMap[ObjControl.S_ARROW_HEAD_X] = arrowHeadX;
    this._m_GizmoDrawables.push(arrowHeadX);
    let axisX = new Try3d.Cylinder(this._m_Scene, {id:ObjControl.S_AXIS_X, radiusTop:tubeRadius, radiusBottom:tubeRadius, height:1.0});
    axisX.setMaterial(redMat);
    axisX.receiveShadow(false);
    axisX.castShadow(false);
    axisX.setFilterFlag(Try3d.Node.S_NEVER);
    axisX.setLocalTranslationXYZ(0, radius * 0.5, 0);
    this._m_GizmoMap[ObjControl.S_AXIS_X] = axisX;
    xAxisHelper.addChildren(axisX);
    xAxisHelper.setLocalRotationFromEuler(0, 0, Try3d.MoreMath.toRadians(-90));
    this._m_TranslateAction.addChildren(xAxisHelper);
    this._m_GizmoDrawables.push(axisX);
    // y-Axis
    let yAxisHelper = new Try3d.Node(this._m_Scene, {id:'Y_AXIS_HELPER'});
    let arrowHeadY = new Try3d.Cylinder(this._m_Scene, {id:ObjControl.S_ARROW_HEAD_Y, radiusTop:0.001, radiusBottom:arrowRadius, height:0.2});
    arrowHeadY.setMaterial(greenMat);
    arrowHeadY.receiveShadow(false);
    arrowHeadY.castShadow(false);
    arrowHeadY.setFilterFlag(Try3d.Node.S_NEVER);
    arrowHeadY.setLocalTranslationXYZ(0, radius + 0.1, 0);
    yAxisHelper.addChildren(arrowHeadY);
    this._m_GizmoMap[ObjControl.S_ARROW_HEAD_Y] = arrowHeadY;
    this._m_GizmoDrawables.push(arrowHeadY);
    let axisY = new Try3d.Cylinder(this._m_Scene, {id:ObjControl.S_AXIS_Y, radiusTop:tubeRadius, radiusBottom:tubeRadius, height:1.0});
    axisY.setMaterial(greenMat);
    axisY.receiveShadow(false);
    axisY.castShadow(false);
    axisY.setFilterFlag(Try3d.Node.S_NEVER);
    axisY.setLocalTranslationXYZ(0, radius * 0.5, 0);
    this._m_GizmoMap[ObjControl.S_AXIS_Y] = axisY;
    this._m_GizmoDrawables.push(axisY);
    yAxisHelper.addChildren(axisY);
    this._m_TranslateAction.addChildren(yAxisHelper);
    // z-Axis
    let zAxisHelper = new Try3d.Node(this._m_Scene, {id:'Z_AXIS_HELPER'});
    let arrowHeadZ = new Try3d.Cylinder(this._m_Scene, {id:ObjControl.S_ARROW_HEAD_Z, radiusTop:0.001, radiusBottom:arrowRadius, height:0.2});
    arrowHeadZ.setMaterial(blueMat);
    arrowHeadZ.receiveShadow(false);
    arrowHeadZ.castShadow(false);
    arrowHeadZ.setFilterFlag(Try3d.Node.S_NEVER);
    arrowHeadZ.setLocalTranslationXYZ(0, radius + 0.1, 0);
    this._m_GizmoMap[ObjControl.S_ARROW_HEAD_Z] = arrowHeadZ;
    this._m_GizmoDrawables.push(arrowHeadZ);
    zAxisHelper.addChildren(arrowHeadZ);
    let axisZ = new Try3d.Cylinder(this._m_Scene, {id:ObjControl.S_AXIS_Z, radiusTop:tubeRadius, radiusBottom:tubeRadius, height:1.0});
    axisZ.setMaterial(blueMat);
    axisZ.receiveShadow(false);
    axisZ.castShadow(false);
    axisZ.setFilterFlag(Try3d.Node.S_NEVER);
    axisZ.setLocalTranslationXYZ(0, radius * 0.5, 0);
    this._m_GizmoMap[ObjControl.S_AXIS_Z] = axisZ;
    this._m_GizmoDrawables.push(axisZ);
    zAxisHelper.addChildren(axisZ);
    zAxisHelper.setLocalRotationFromEuler(Try3d.MoreMath.toRadians(90), 0, 0);
    this._m_TranslateAction.addChildren(zAxisHelper);

    // rotateAction
    this._m_RotateAction = new Try3d.Node(this._m_Scene, {id:ObjControl.S_ROTATE_ACTION});

    // scaleAction
    this._m_ScaleAction = new Try3d.Node(this._m_Scene, {id:ObjControl.S_SCALE_ACTION});

    this._m_Gizmo.addChildren(this._m_TranslateAction);
    let fixedControl2 = new Try3d.FixedControl(this._m_Gizmo, {id:'GIZMO_FIXED_CONTROL'});
    fixedControl2.setWorldSizeFactor(0.4);
  }
  _isGizmo(curObj){
    let id = curObj.getName();
    let findObj = this._m_GizmoMap[id];
    return findObj;
  }

  /**
   * 处理一个选中物体。<br/>
   * @param {Object}[curObj]
   */
  handler(curObj){
    if(this._isGizmo(curObj))return;
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
