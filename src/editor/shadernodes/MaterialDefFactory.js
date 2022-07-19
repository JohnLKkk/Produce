/**
 * MaterialDefFactory用于实时创建当前正在定义的材质定义。<br/>
 * @author JohnKkk
 * @date 2022年7月12日15点35分
 */
export default class MaterialDefFactory {
  static _s_MaterialDef = null;
  static _s_MaterialDefs = {};

  /**
   * 返回当前正在编辑打开的材质定义。<br/>
   * @return {null}
   */
  static getMaterialDef(){
    return MaterialDefFactory._s_MaterialDef;
  }

  static editMaterialDef(defId){
    MaterialDefFactory._s_MaterialDef = MaterialDefFactory._s_MaterialDefs[defId];
    if(!MaterialDefFactory._s_MaterialDef){
      MaterialDefFactory._s_MaterialDef = {
        defId,
        params:{},
        subTechnology:{},
        technology:{}
      };
      MaterialDefFactory._s_MaterialDefs[defId] = MaterialDefFactory._s_MaterialDef;
      MaterialDefFactory._initDefaultMaterialDef(MaterialDefFactory._s_MaterialDef);
    }
    return MaterialDefFactory._s_MaterialDef;
  }

  static _initDefaultMaterialDef(materialDef){
    materialDef.subTechnology['defaultSubDraw'] = {
      vars:null,
      vs_shader:null,
      fs_shader:null
    };
    materialDef.technology['defaultTechnology'] = {
      sub_Pass:'Sub_Pass{\n' +
        '            Pass defaultSubDraw{\n' +
        '            }\n' +
        '        }\n'
    };
  }
}
