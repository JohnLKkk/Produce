/**
 * Outputs表示可用的一组输出相关的节点，包括传递结构。<br/>
 * 输出节点用于构建最终ShaderCode的作用。<br/>
 * @author JohnKkk
 * @date 2022年7月15日16点39分
 */
import FragmentShaderOutComponent from './FragmentShaderOutComponent'
import VertexShaderOutComponent from './VertexShaderOutComponent'
import BoolOutputStructureComponent from './BoolOutputStructureComponent'
import IntOutputStructureComponent from './IntOutputStructureComponent'
import FloatOutputStructureComponent from './FloatOutputStructureComponent'
import Vec2OutputStructureComponent from './Vec2OutputStructureComponent'
import Vec3OutputStructureComponent from './Vec3OutputStructureComponent'
import Vec4OutputStructureComponent from './Vec4OutputStructureComponent'

export default class Outputs {
  static _s_OutputStructureFilters = [
    BoolOutputStructureComponent,
    IntOutputStructureComponent,
    FloatOutputStructureComponent,
    Vec2OutputStructureComponent,
    Vec3OutputStructureComponent,
    Vec4OutputStructureComponent,
  ];
  static _s_Filters = [
    BoolOutputStructureComponent,
    IntOutputStructureComponent,
    FloatOutputStructureComponent,
    Vec2OutputStructureComponent,
    Vec3OutputStructureComponent,
    Vec4OutputStructureComponent,
    VertexShaderOutComponent,
    FragmentShaderOutComponent
  ];
  static getGroup(){
    return 'output';
  }
  static filterOutputStructure(component){
    let r = false;
    let targetComponentName = component.name + 'Component';
    for(let c in Outputs._s_OutputStructureFilters){
      if(Outputs._s_OutputStructureFilters[c].name == targetComponentName){
        r = true;
        break;
      }
    }
    return r;
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
