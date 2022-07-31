/**
 * Commons表示可用的一组常用的节点,包括顶点变换,法线转换,视察计算等。<br/>
 * @author JohnKkk
 * @date 2022年7月20日21点16分
 */
import IfElseBranchComponent from './IfElseBranchComponent'
import TransformVector3Component from './TransformVector3Component'

export default class Commons {
  static _s_Filters = [
    IfElseBranchComponent,
    TransformVector3Component,
  ];
  static getGroup(){
    return 'common';
  }
  static filter(component){
    let r = false;
    let targetComponentName = component.name + 'Component';
    for(let c in Commons._s_Filters){
      if(Commons._s_Filters[c].name == targetComponentName){
        r = true;
        break;
      }
    }
    return r;
  }
}
