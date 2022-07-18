import Maths from './math/Maths'
import Textures from './texture/Textures'
import Outputs from './output/Outputs'

export default class ShaderNodes {
  static _s_Filters = [
    Outputs,
    Maths,
    Textures,
  ];
  static filter(component){
    for(let f in ShaderNodes._s_Filters){
      if(ShaderNodes._s_Filters[f].filter(component)){
        return ShaderNodes._s_Filters[f].getGroup();
      }
    }
    return null;
  }
  static registerShaderNodes(editor, engine){
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
}
