/**
 * Outputs表示可用的一组输出相关的节点。<br/>
 * 输出节点用于构建最终ShaderCode的作用。<br/>
 * @author JohnKkk
 * @date 2022年7月15日16点39分
 */
import FragmentOutColor from './FragmentOutColorComponent'

export default class Outputs {
  static _s_Filters = [
    FragmentOutColor
  ];
  static getGroup(){
    return 'output';
  }
  static filter(component){
    let r = false;
    let targetComponentName = component.name + 'Component';
    for(let c in Outputs._s_Filters){
      if(Outputs._s_Filters[c].name == targetComponentName){
        r = true;
        break;
      }
    }
    return r;
  }
}
