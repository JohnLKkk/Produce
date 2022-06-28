import Try3d from 'try3d/src/Try3d'
import Utils from '../utils/Utils'
import Material from './Material'
import ShapeFactory from './ShapeFactory'
import {EditorContext} from '../EditorContext'

class LightBulbHelper {
  static makeLightBulb(options){
    let scene = options.scene;
    let lightMat = new Try3d.Material(scene, {id:'lightBulbMat_' + Utils.nextId(), materialDef:Material.S_COLOR_MAT});
    let colorMap = new Try3d.Texture2DVars(scene);
    colorMap.setPreloadColor(scene, new Try3d.Vector4(0.2, 0.2, 0.2, 1.0));
    colorMap.setWrap(scene, Try3d.Texture2DVars.S_WRAPS.S_CLAMP_TO_EDGE, Try3d.Texture2DVars.S_WRAPS.S_CLAMP_TO_EDGE);
    colorMap.setImageSrc(scene, require('../../assets/textures/lightbulb32.png'));
    lightMat.setParam('colorMap', colorMap);
    lightMat.setParam('alphaDiscard', new Try3d.FloatVars().valueOf(0.1));
    let lightBulb = new Try3d.GroupPlane(scene, {id:'lightBulb_' + Utils.nextId(), xSize:2, zSize:2});
    lightBulb.setMaterial(lightMat);
    lightBulb.receiveShadow(false);
    lightBulb.castShadow(false);
    lightBulb.setLocalRotationFromEuler(Try3d.MoreMath.toRadians(90), 0, 0);
    lightBulb.setLocalScaleXYZ(0.1, 0.1, 0.1);
    lightBulb.setIsPickable(false);
    return lightBulb;
  }
  static makeDirectionalLightLabel(options){
    let lightBulbNode = new Try3d.Node(options.scene, {id:'lightBulbNode_' + Utils.nextId()});
    let directionalLightBulb = LightBulbHelper.makeLightBulb(options);
    lightBulbNode.addChildren(directionalLightBulb);
    let billboardControl = new Try3d.BillboardControl(lightBulbNode, {id:'billboardControl_' + Utils.nextId()});
    billboardControl.setAlignment(Try3d.BillboardControl.Alignment.Screen);
    let fixedControl = new Try3d.FixedControl(lightBulbNode, {id:'fixedControl_' + Utils.nextId()});
    fixedControl.setWorldSizeFactor(EditorContext.S_LIGHT_BULB_SIZE);

    // dir
    let zArrow = ShapeFactory.createArrow({scene:options.scene, id:'zArrow_' + Utils.nextId(), extent:new Try3d.Vector3(0, 0, 1), matStrId:"light"});
    zArrow.castShadow(false);
    zArrow.receiveShadow(false);

    let lightLabelNode = new Try3d.Node(options.scene, {id:'lightLabelNode_' + Utils.nextId()});
    lightLabelNode.addChildren(lightBulbNode);
    lightLabelNode.addChildren(zArrow);

    // 监视light相关信息
    // directionalLighting我们只关注颜色
    let light = options.light;
    let lightBulbMat = directionalLightBulb.getMaterial();
    let lastLightColor = new Try3d.Vector4();
    lastLightColor.setTo(light.getColor());
    lightBulbMat.setParam('color', new Try3d.Vec4Vars().valueFromXYZW(lastLightColor._m_X, lastLightColor._m_Y, lastLightColor._m_Z, 1.0));
    options.scene.on('update', (exTime)=>{
      let currentLightColor = light.getColor();
      if(currentLightColor._m_X != lastLightColor._m_X && currentLightColor._m_Y != lastLightColor._m_Y && currentLightColor._m_Z != lastLightColor._m_Z){
        lastLightColor.setTo(light.getColor());
        lightBulbMat.setParam('color', new Try3d.Vec4Vars().valueFromXYZW(lastLightColor._m_X, lastLightColor._m_Y, lastLightColor._m_Z, 1.0));
      }
    });
    return lightLabelNode;
  }
  static makePointLightLabel(options){
    let lightBulbNode = new Try3d.Node(options.scene, {id:'lightBulbNode_' + Utils.nextId()});
    let pointLightBulb = LightBulbHelper.makeLightBulb(options);
    lightBulbNode.addChildren(pointLightBulb);
    let billboardControl = new Try3d.BillboardControl(lightBulbNode, {id:'billboardControl_' + Utils.nextId()});
    billboardControl.setAlignment(Try3d.BillboardControl.Alignment.Screen);
    let fixedControl = new Try3d.FixedControl(lightBulbNode, {id:'fixedControl_' + Utils.nextId()});
    fixedControl.setWorldSizeFactor(EditorContext.S_LIGHT_BULB_SIZE);

    let lightLabelNode = new Try3d.Node(options.scene, {id:'lightLabelNode_' + Utils.nextId()});
    // radius
    let radiusMesh = Try3d.MeshFactor.createRoundMesh(3, true);
    let radius = new Try3d.Geometry(options.scene, {id:'radius_' + Utils.nextId()});
    radius.receiveShadow(false);
    radius.castShadow(false);
    radius.setMesh(radiusMesh);
    radius.setMaterial(new Try3d.Material(options.scene, {id:'radiusMat_' + Utils.nextId(), materialDef:Material.S_COLOR_MAT}));
    radius.updateBound();
    radius.setLocalRotationFromEuler(Try3d.MoreMath.toRadians(90), 0, 0);
    let lightRadiusNode = new Try3d.Node(options.scene, {id:'lightRadiusNode_' + Utils.nextId()});
    lightRadiusNode.addChildren(radius);
    let billboardControl2 = new Try3d.BillboardControl(lightRadiusNode, {id:'billboardControl_' + Utils.nextId()});
    billboardControl2.setAlignment(Try3d.BillboardControl.Alignment.Screen);

    lightLabelNode.addChildren(lightRadiusNode);
    lightLabelNode.addChildren(lightBulbNode);

    // 监视light相关信息
    // pointLighting我们只关注颜色
    let light = options.light;
    let lightBulbMat = pointLightBulb.getMaterial();
    let lastLightColor = new Try3d.Vector4();
    lastLightColor.setTo(light.getColor());
    lightBulbMat.setParam('color', new Try3d.Vec4Vars().valueFromXYZW(lastLightColor._m_X, lastLightColor._m_Y, lastLightColor._m_Z, 1.0));
    options.scene.on('update', (exTime)=>{
      let currentLightColor = light.getColor();
      if(currentLightColor._m_X != lastLightColor._m_X && currentLightColor._m_Y != lastLightColor._m_Y && currentLightColor._m_Z != lastLightColor._m_Z){
        lastLightColor.setTo(light.getColor());
        lightBulbMat.setParam('color', new Try3d.Vec4Vars().valueFromXYZW(lastLightColor._m_X, lastLightColor._m_Y, lastLightColor._m_Z, 1.0));
      }
    });
    return lightLabelNode;
  }
  static makeSpotLightLabel(options){
    let lightBulbNode = new Try3d.Node(options.scene, {id:'lightBulbNode_' + Utils.nextId()});
    let spotLightBulb = LightBulbHelper.makeLightBulb(options);
    lightBulbNode.addChildren(spotLightBulb);
    let billboardControl = new Try3d.BillboardControl(lightBulbNode, {id:'billboardControl_' + Utils.nextId()});
    billboardControl.setAlignment(Try3d.BillboardControl.Alignment.Screen);
    let fixedControl = new Try3d.FixedControl(lightBulbNode, {id:'fixedControl_' + Utils.nextId()});
    fixedControl.setWorldSizeFactor(EditorContext.S_LIGHT_BULB_SIZE);

    let lightLabelNode = new Try3d.Node(options.scene, {id:'lightLabelNode_' + Utils.nextId()});
    lightLabelNode.addChildren(lightBulbNode);

    // dir
    let zArrow = ShapeFactory.createArrow({scene:options.scene, id:'zArrow_' + Utils.nextId(), extent:new Try3d.Vector3(0, 0, 1), matStrId:"light"});
    zArrow.castShadow(false);
    zArrow.receiveShadow(false);
    lightLabelNode.addChildren(zArrow);

    let outerAngle = options.light.getOuterAngle();
    let innerAngle = options.light.getInnerAngle();
    let lastRange = options.light.getSpotRange();
    let angleRadiusNode = new Try3d.Node(options.scene, {id:'angleRadiusNode_' + Utils.nextId()});
    // 外角度
    let outerRadius = lastRange * Math.atan(outerAngle);
    let outerRadiusShape = ShapeFactory.createRound({scene:options.scene, dashed:true});
    outerRadiusShape.setLocalScaleXYZ(outerRadius, outerRadius, outerRadius);
    angleRadiusNode.addChildren(outerRadiusShape);
    // 内角度
    let innerRadius = lastRange * Math.atan(innerAngle);
    let innerRadiusShape = ShapeFactory.createRound({scene:options.scene, dashed:false});
    innerRadiusShape.setLocalScaleXYZ(innerRadius, innerRadius, innerRadius);
    angleRadiusNode.addChildren(innerRadiusShape);

    angleRadiusNode.setLocalTranslationXYZ(0, 0, lastRange);
    lightLabelNode.addChildren(angleRadiusNode);

    // 监视light相关信息
    // spotLightBulb我们关注颜色，范围和内外角
    let light = options.light;
    let lightBulbMat = spotLightBulb.getMaterial();
    let lastLightColor = new Try3d.Vector4();
    lastLightColor.setTo(light.getColor());
    lightBulbMat.setParam('color', new Try3d.Vec4Vars().valueFromXYZW(lastLightColor._m_X, lastLightColor._m_Y, lastLightColor._m_Z, 1.0));
    zArrow.setLocalScaleXYZ(lastRange, lastRange, lastRange);
    options.scene.on('update', (exTime)=>{
      let currentLightColor = light.getColor();
      if(currentLightColor._m_X != lastLightColor._m_X && currentLightColor._m_Y != lastLightColor._m_Y && currentLightColor._m_Z != lastLightColor._m_Z){
        lastLightColor.setTo(light.getColor());
        lightBulbMat.setParam('color', new Try3d.Vec4Vars().valueFromXYZW(lastLightColor._m_X, lastLightColor._m_Y, lastLightColor._m_Z, 1.0));
      }
      if(innerAngle != light.getInnerAngle()){
        innerAngle = light.getInnerAngle();
        innerRadius = lastRange * Math.atan(innerAngle);
        innerRadiusShape.setLocalScaleXYZ(innerRadius, innerRadius, innerRadius);
      }
      if(outerAngle != light.getOuterAngle()){
        outerAngle = light.getOuterAngle();
        outerRadius = lastRange * Math.atan(outerAngle);
        outerRadiusShape.setLocalScaleXYZ(outerRadius, outerRadius, outerRadius);
      }
      if(lastRange != light.getSpotRange()){
        lastRange = light.getSpotRange();
        zArrow.setLocalScaleXYZ(lastRange, lastRange, lastRange);
        angleRadiusNode.setLocalTranslationXYZ(0, 0, lastRange);
        outerRadius = lastRange * Math.atan(outerAngle);
        outerRadiusShape.setLocalScaleXYZ(outerRadius, outerRadius, outerRadius);
        innerRadius = lastRange * Math.atan(innerAngle);
        innerRadiusShape.setLocalScaleXYZ(innerRadius, innerRadius, innerRadius);
      }
    });
    return lightLabelNode;
  }
}

export default class LightFactory {
  constructor (props) {
  }
  static makeLabel(options){
    let light = options.light;
    if(light){
      // 根据光源类型添加label
      switch (light.getType()) {
        case 'DirectionalLight':
          // 添加方向标记
          light.addChildren(LightBulbHelper.makeDirectionalLightLabel(options));
          break;
        case 'PointLight':
          light.addChildren(LightBulbHelper.makePointLightLabel(options));
          break;
        case 'SpotLight':
          light.addChildren(LightBulbHelper.makeSpotLightLabel(options));
          break;
      }
    }
  }

  /**
   * 创建一个DirectionalLight。<br/>
   * @param options
   * @returns {Try3d.DirectionalLight}
   */
  static createDirectionalLight(options){
    // 定义一个directionalLight
    let directionalLight = new Try3d.DirectionalLight(options.scene, {id:'directionalLight_' + Utils.nextId()});
    directionalLight.setDirectionXYZ(1, -1, 1);
    directionalLight.setColorRGBA(1.0, 1.0, 1.0, 1.0);
    directionalLight.setShadowMapSize(1024);
    directionalLight.proShadow(true);
    LightFactory.makeLabel({scene:options.scene, light:directionalLight});
    return directionalLight;
  }

  /**
   * 创建一个PointLight。<br/>
   * @param options
   * @return {Try3d.PointLight}
   */
  static createPointLight(options){
    // 定义一个PointLight
    let pointLight = new Try3d.PointLight(options.scene, {id:'pointLight_' + Utils.nextId()});
    pointLight.setRadius(3);
    pointLight.setPositionXYZ(-1, 1, 0);
    pointLight.setColorRGBA(1, 1, 1, 1.0);
    pointLight.proShadow(true);
    LightFactory.makeLabel({scene:options.scene, light:pointLight});
    return pointLight;
  }

  /**
   * 创建一个SpotLight。<br/>
   * @param options
   * @returns {Try3d.SpotLight}
   */
  static createSpotLight(options){
    let spotLight = new Try3d.SpotLight(options.scene, {id:'spotLight_' + Utils.nextId()});
    spotLight.setPositionXYZ(-3.5459878, 2.842323, 0.31434864);
    spotLight.setDirectionXYZ(0.5, -1, 0);
    spotLight.setInnerAngle(Try3d.MoreMath.toRadians(10));
    spotLight.setOuterAngle(Try3d.MoreMath.toRadians(35));
    spotLight.setSpotRange(10);
    spotLight.setColorRGBA(1, 1, 1, 1.0);
    spotLight.proShadow(true);
    LightFactory.makeLabel({scene:options.scene, light:spotLight});
    return spotLight;
  }

}
