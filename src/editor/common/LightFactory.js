import Try3d from 'try3d/src/Try3d'
import Utils from '../utils/Utils'

export default class LightFactory {
  constructor (props) {
  }

  /**
   * 创建一个DirectionalLight。<br/>
   * @param options
   * @returns {Try3d.DirectionalLight}
   */
  static createDirectionalLight(options){
    // 定义一个directionalLight
    let directionalLight = new Try3d.DirectionalLight(options.scene, {id:'directionalLight_' + Utils.nextId()});
    directionalLight.setDirectionXYZ(-1, -1, -1);
    directionalLight.setColorRGBA(1, 1, 1, 1);
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
    pointLight.setRadius(10);
    pointLight.setPositionXYZ(-5, 5, 0);
    pointLight.setColorRGBA(1, 1, 1, 1.0);
    return pointLight;
  }

  /**
   * 创建一个SpotLight。<br/>
   * @param options
   * @returns {Try3d.SpotLight}
   */
  static createSpotLight(options){
    let spotLight = new Try3d.SpotLight(options.scene, {id:'spotLight_' + Utils.nextId()});
    spotLight.setInnerAngle(Try3d.MoreMath.toRadians(5));
    spotLight.setOuterAngle(Try3d.MoreMath.toRadians(25));
    spotLight.setSpotRange(50);
    spotLight.setColorRGBA(1, 1, 1, 1.0);
    return spotLight;
  }

}
