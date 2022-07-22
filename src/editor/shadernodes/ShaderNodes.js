import Maths from './math/Maths'
import Textures from './texture/Textures'
import Outputs from './output/Outputs'
import Params from './param/Params'
import Inputs from './input/Inputs'
import Sockets from './Sockets'

export default class ShaderNodes {
  static _s_Filters = [
    Params,
    Inputs,
    Outputs,
    Maths,
    Textures,
  ];

  static _s_VarTypes = {
    'bool':0,
    'int':1,
    'float':2,
    'vec2':3,
    'vec3':4,
    'vec4':5
  };

  static filter(component){
    for(let f in ShaderNodes._s_Filters){
      if(ShaderNodes._s_Filters[f].filter(component)){
        return ShaderNodes._s_Filters[f].getGroup();
      }
    }
    return null;
  }

  /**
   * 注册所有系统节点。<br/>
   * @param {Object}[editor]
   * @param {Object}[engine]
   */
  static registerShaderNodes(editor, engine){
    Sockets.init();
    let node = null;
    for(let group in ShaderNodes._s_Filters){
      for(let shaderNode in ShaderNodes._s_Filters[group]._s_Filters){
        node = ShaderNodes._s_Filters[group]._s_Filters[shaderNode];
        node = new node();
        editor.register(node);
        engine.register(node);
      }
    }
  }

  /**
   * 提升类型转换,将转换为varType1和varType2中其中的一个类型。<br/>
   * @param {String}[varType1]
   * @param {String}[varType2]
   * @return {String}
   */
  static upgradeCast(varType1, varType2){
    return (ShaderNodes._s_VarTypes[varType1] > ShaderNodes._s_VarTypes[varType2]) ? varType1 : varType2;
  }
  static cast(varType1, varType2){

  }
}
