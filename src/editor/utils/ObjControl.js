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
    this._m_Forward = new Try3d.Vector3();
    this._m_PlaneNormal = new Try3d.Vector3();
    this._m_P1 = new Try3d.Vector3();
    this._m_P2 = new Try3d.Vector3();
    this._m_P3 = new Try3d.Vector3();
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
    let lastHit = null;
    let action = null;
    let grabbed = false;
    let lastCanvasPos = [0, 0];
    this._m_XBaseAxis = new Try3d.Vector3(1, 0, 0);
    this._m_YBaseAxis = new Try3d.Vector3(0, 1, 0);
    this._m_ZBaseAxis = new Try3d.Vector3(0, 0, 1);
    input.on('mousemove', (uv)=>{
      if(grabbed){
        // 根据action进行操作
        let baseAxis = this._getBaseAxis(lastHit.getName());
        if(baseAxis){
          this._handlerAction(baseAxis, lastCanvasPos, uv);
        }
      }
      else{
        // 实时pick
        // 以便进行高亮显示
        let result = PICKABLE.immediatelyPick(uv[0], uv[1], this._m_GizmoDrawables);
        if(result){
          lastHit = result.pickResult;
          lastHit.getMaterial().setParam('highlightColor', new Try3d.Vec4Vars().valueFromXYZW(1.0,215/255.0,0));
        }
        else if(lastHit){
          lastHit.getMaterial().clearParam('highlightColor');
        }
      }
      lastCanvasPos[0] = uv[0];
      lastCanvasPos[1] = uv[1];
    });
    input.on('mousedown', (buttonId)=>{
      if(buttonId == Try3d.Input.S_MOUSE_BUTTON0_DOWN){
        grabbed = lastHit ? true : false;
      }
    });
    input.on('mouseup', (buttonId)=>{
      if(buttonId == Try3d.Input.S_MOUSE_BUTTON0_UP){
        grabbed = false;
        if(lastHit){
          lastHit.getMaterial().clearParam('highlightColor');
        }
        lastHit = null;
      }
    });
  }

  /**
   * 处理action。<br/>
   * @param {Vector3}[baseAxis]
   * @param {Number[]}[m0]
   * @param {Number[]}[m1]
   * @private
   */
  _handlerAction(baseAxis, m0, m1){
    switch (this._m_ActionMode) {
      case ObjControl.S_ACTION_MODE_TRANSLATE:
        let translateOff = this._dragTranslate(baseAxis, m0, m1);
        this._m_LastObj.setLocalTranslation(this._m_LastObj.getLocalTranslation().add(translateOff));
        break;
      case ObjControl.S_ACTION_MODE_ROTATE:
        break;
      case ObjControl.S_ACTION_MODE_SCALE:
        break;
    }
  }

  /**
   * 返回操作轴。<br/>
   * @param {String}[id]
   * @return {null|Vector3}
   * @private
   */
  _getBaseAxis(id){
    switch (id) {
      case ObjControl.S_AXIS_X:
      case ObjControl.S_ARROW_HEAD_X:
        return this._m_XBaseAxis;
      case ObjControl.S_AXIS_Y:
      case ObjControl.S_ARROW_HEAD_Y:
        return this._m_YBaseAxis;
      case ObjControl.S_AXIS_Z:
      case ObjControl.S_ARROW_HEAD_Z:
        return this._m_ZBaseAxis;
    }
    return null;
  }

  /**
   * 设置actionMode
   * @param {Object}[actionMode 只能未ObjControl的枚举]
   */
  setActionMode(actionMode){
    if(this._m_Gizmo.getChildren().length){
      this._m_Gizmo.removeChildren(this._m_Gizmo.getChildrenAtIndex(0));
    }
    switch (actionMode) {
      case ObjControl.S_ACTION_MODE_TRANSLATE:
        this._m_Gizmo.addChildren(this._m_TranslateAction);
        break;
      case ObjControl.S_ACTION_MODE_ROTATE:
        this._m_Gizmo.addChildren(this._m_RotateAction);
        break;
      case ObjControl.S_ACTION_MODE_SCALE:
        this._m_Gizmo.addChildren(this._m_ScaleAction);
        break;
    }
    this._m_ActionMode = actionMode;
  }

  /**
   * 计算平面法线。<br/>
   * @param {Vector3}[worldAxis]
   * @return {Vector3}
   * @private
   */
  _getPlaneNormal(worldAxis){
    const absX = Math.abs(worldAxis._m_X);
    // 计算平面forward分量
    // 当x分量大于y,z时,使用标准Up
    if(absX > Math.abs(worldAxis._m_Y) && absX > Math.abs(worldAxis._m_Z)){
      worldAxis.cross(Try3d.Vector3.S_UNIT_AXIS_Y, this._m_Forward);
    }
    else{
      // 使用标准Right避免与Up平行
      worldAxis.cross(Try3d.Vector3.S_UNIT_AXIS_X, this._m_Forward);
    }
    this._m_Forward.normal();
    // 计算平面up分量,也就是平面法线
    this._m_Forward.cross(worldAxis, this._m_PlaneNormal);
    this._m_PlaneNormal.normal();
    return this._m_PlaneNormal;
  }

  /**
   * 计算屏幕点在指定平面上的交点。<br/>
   * @param {Number[]}[screenUV]
   * @param {Vector3}[axis]
   * @param {Vector3}[dest]
   * @param {Number}[offset]
   * @private
   */
  _getPointerPlaneIntersect(screenUV, axis, dest, offset){
    offset = offset || 0;
    let currentCamera = this._m_Scene.getMainCamera();
    // 计算从当前视点到近截面的射线
    let n = new Try3d.Vector3();
    currentCamera.getWorldCoordinates(new Try3d.Vector2(screenUV[0], -screenUV[1]), 0, true, n);
    const dir = new Try3d.Vector3();
    let eye = currentCamera.getEye();
    n.sub(eye, dir);

    this._m_P3.setTo(this._m_Gizmo.getWorldTranslation());
    let d = -this._m_P3.dot(axis) - offset;
    let dot = axis.dot(dir);
    // 只要不是垂直与axis,就可以进行拖拽
    if(Math.abs(dot) > 0.005){
      let t = -(axis.dot(eye) + d) / dot;
      dir.multLength(t, dest);
      dest.add(eye);
      dest.sub(this._m_P3);
    }
  }
  _dragTranslate(baseAxis, fromMouse, toMouse){
    // 获取当前baseAxis所在平面的法线
    const planeNormal = this._getPlaneNormal(baseAxis);
    // 获取平面坐标下转换到baseAxis所在平面的交点
    this._getPointerPlaneIntersect(fromMouse, planeNormal, this._m_P1);
    this._getPointerPlaneIntersect(toMouse, planeNormal, this._m_P2);
    // 计算拖拽方向
    this._m_P2.sub(this._m_P1);
    const dot = this._m_P2.dot(baseAxis);
    // 计算最终偏移pos
    this._m_P1.setTo(baseAxis);
    this._m_P1.multLength(dot);
    return this._m_P1;
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

    this.setActionMode(ObjControl.S_ACTION_MODE_TRANSLATE);
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
