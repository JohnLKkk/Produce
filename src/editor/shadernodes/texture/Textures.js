/**
 * Textures表示可用的一组Texture计算相关的节点。<br/>
 * @author JohnKkk
 * @date 2022年7月12日14点54分
 */
import SamplerTexture2DComponent from './SamplerTexture2DComponent'

export default class Textures {
  static _s_Filters = [
    SamplerTexture2DComponent
  ];
  static getGroup(){
    return 'texture';
  }
  static filter(component){
    let r = false;
    let targetComponentName = component.name + 'Component';
    for(let c in Textures._s_Filters){
      if(Textures._s_Filters[c].name == targetComponentName){
        r = true;
        break;
      }
    }
    return r;
  }
}
