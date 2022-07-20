/**
 * Inputs表示可用的一组输入相关的节点，主要是上下文输入变量，顶点属性。<br/>
 * 输入节点用于构建最终ShaderCode的上下文变量和顶点属性。<br/>
 * @author JohnKkk
 * @date 2022年7月19日17点33分
 */
import BoolInputStructureComponent from './BoolInputStructureComponent'
import IntInputStructureComponent from './IntInputStructureComponent'
import FloatInputStructureComponent from './FloatInputStructureComponent'
import Vec2InputStructureComponent from './Vec2InputStructureComponent'
import Vec3InputStructureComponent from './Vec3InputStructureComponent'
import Vec4InputStructureComponent from './Vec4InputStructureComponent'
import InputAttributeComponent from './InputAttributeComponent'

export default class Inputs {
  static _s_InputStructureFilters = [
    BoolInputStructureComponent,
    IntInputStructureComponent,
    FloatInputStructureComponent,
    Vec2InputStructureComponent,
    Vec3InputStructureComponent,
    Vec4InputStructureComponent
  ];
  static _s_Filters = [
    InputAttributeComponent,
    BoolInputStructureComponent,
    IntInputStructureComponent,
    FloatInputStructureComponent,
    Vec2InputStructureComponent,
    Vec3InputStructureComponent,
    Vec4InputStructureComponent
  ];
  static getGroup(){
    return 'input';
  }
  static filterInputStructure(component){
    let r = false;
    let targetComponentName = component.name + 'Component';
    for(let c in Inputs._s_InputStructureFilters){
      if(Inputs._s_Filters[c].name == targetComponentName){
        r = true;
        break;
      }
    }
    return r;
  }
  static filter(component){
    let r = false;
    let targetComponentName = component.name + 'Component';
    for(let c in Inputs._s_Filters){
      if(Inputs._s_Filters[c].name == targetComponentName){
        r = true;
        break;
      }
    }
    return r;
  }
}
