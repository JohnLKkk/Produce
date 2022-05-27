import Try3d from 'try3d/src/Try3d'

export default class PostFilterFactory {
  static _s_PostFilterList;
  static postFilterListRefresh(postFilterList){
    PostFilterFactory._s_PostFilterList = postFilterList;
  }
  static getPostFilterList(){
    return PostFilterFactory._s_PostFilterList;
  }
  /**
   * DofFilter.<br/>
   * @param scene
   * @param camera
   */
  static createDofFilter(scene, camera){
    let dofFilter = camera.addFilterFromMaterial(new Try3d.Material(scene, {id:'dofFilter', materialDef:Try3d.MaterialDef.parse(Try3d.Internal.S_DOF_FILTER_DEF_DATA)}));
    let mat = dofFilter.getMaterial();
    let focusDistance = 50;
    let focusRange = 10;
    let hScale = 1.0;
    let vScale = 1.0;
    mat.setParam('focusDistance', new Try3d.FloatVars().valueOf(focusDistance));
    mat.setParam('focusRange', new Try3d.FloatVars().valueOf(focusRange));
    mat.setParam('hScale', new Try3d.FloatVars().valueOf(hScale));
    mat.setParam('vScale', new Try3d.FloatVars().valueOf(vScale));
    return dofFilter;
  }

  /**
   * FogFilter.<br/>
   * @param scene
   * @param camera
   * @returns {Filter}
   */
  static createFogFilter(scene, camera){
    let fogFilter = camera.addFilterFromMaterial(new Try3d.Material(scene, {id:'fogFilter', materialDef:Try3d.MaterialDef.parse(Try3d.Internal.S_FOG_FILTER_DEF_DATA)}));
    let mat = fogFilter.getMaterial();
    fogFilter.getMaterial().selectTechnology('Default');
    fogFilter.getMaterial().setParam('vNear', new Try3d.FloatVars().valueOf(camera.getNear()));
    fogFilter.getMaterial().setParam('vFar', new Try3d.FloatVars().valueOf(camera.getFar()));
    fogFilter.getMaterial().setParam('fogNear', new Try3d.FloatVars().valueOf(150));
    fogFilter.getMaterial().setParam('fogFar', new Try3d.FloatVars().valueOf(250));
    return fogFilter;
  }
  static createBloomFilter(scene, camera){
    let bloomFilter = camera.addFilterFromMaterial(new Try3d.Material(scene, {id:'bloomFilter', materialDef:Try3d.MaterialDef.parse(Try3d.Internal.S_BLOOM_FILTER_DEF_DATA)}));
    let mat = bloomFilter.getMaterial();
    mat.setParam('extractThreshold', new Try3d.FloatVars().valueOf(0.2));
    mat.setParam('bloomIntensity', new Try3d.FloatVars().valueOf(0.25));
    return bloomFilter;
  }
}
