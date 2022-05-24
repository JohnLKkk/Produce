import Try3d from 'try3d/src/Try3d'
import Utils from '../utils/Utils'

export default class Material {
  static S_COLOR_MAT = Try3d.MaterialDef.parse(Try3d.Internal.S_COLOR_DEF_DATA);
  static S_BASIC_LIGHTING_MAT = Try3d.MaterialDef.parse(Try3d.Internal.S_BASIC_LIGHTING_DEF_DATA);
  static _S_WHITE_COLOR_MAT_INS = null;
  static _S_BASIC_LIGHTING_MAT_INS = null;
  constructor (props) {
  }

  /**
   * 返回WhiteColorMatIns。<br/>
   * @param scene
   * @param {Boolean}[make 是否创建新的]
   * @returns {null}
   */
  static getWhiteColorMatIns(scene, make){
    if(!Material._S_WHITE_COLOR_MAT_INS){
      Material._S_WHITE_COLOR_MAT_INS = new Try3d.Material(scene, {id:"white_color", materialDef:Material.S_COLOR_MAT});
    }
    return Material._S_WHITE_COLOR_MAT_INS;
  }

  /**
   * 返回一个BasicLightingMatIns
   * @param scene
   * @param {Boolean}[make 是否创建新的]
   * @returns {null|Material}
   */
  static getBasicLightingMatIns(scene, make){
    if(make){
      return new Try3d.Material(scene, {id:"basic_light_" + Utils.nextId(), materialDef:Material.S_BASIC_LIGHTING_MAT});
    }
    if(!Material._S_BASIC_LIGHTING_MAT_INS){
      Material._S_BASIC_LIGHTING_MAT_INS = new Try3d.Material(scene, {id:"basic_light", materialDef:Material.S_BASIC_LIGHTING_MAT});
    }
    return Material._S_BASIC_LIGHTING_MAT_INS;
  }

}
