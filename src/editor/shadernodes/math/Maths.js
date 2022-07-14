import MathComponent from './MathComponent'
import AddComponent from './AddComponent'
import DivideComponent from './DivideComponent'
import MultiplyComponent from './MultiplyComponent'
import SubtractComponent from './SubtractComponent'
import NumberComponent from './NumberComponent'

/**
 * 表示Maths可用节点。<br/>
 * @author JohnKkk
 * @date 2022年7月12日12点43分
 */
export default class Maths {
  static _s_Filters = [
    AddComponent,
    DivideComponent,
    MultiplyComponent,
    SubtractComponent,
    NumberComponent
  ];
  static getGroup(){
    return 'math';
  }
  static filter(component){
    let r = false;
    let targetComponentName = component.name + 'Component';
    for(let c in Maths._s_Filters){
      if(Maths._s_Filters[c].name == targetComponentName){
        r = true;
        break;
      }
    }
    return r;
  }
}
