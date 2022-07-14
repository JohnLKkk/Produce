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

    }
  }
}
