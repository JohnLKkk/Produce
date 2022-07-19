/**
 * Params表示可用的输入参数。<br/>
 * @author JohnKkk
 * @date 2022年7月12日14点08分
 */
import Rete from 'rete';
import FloatParamComponent from './FloatParamComponent'
import IntParamComponent from './IntParamComponent'
import BoolParamComponent from './BoolParamComponent'
import Vec2ParamComponent from './Vec2ParamComponent'
import Vec3ParamComponent from './Vec3ParamComponent'
import Vec4ParamComponent from './Vec4ParamComponent'
import Texture2DParamComponent from './Texture2DParamComponent'
import TextureCubeParamComponent from './TextureCubeParamComponent'

export default class Params extends Rete.Component{
  static _s_Filters = [
    FloatParamComponent,
    IntParamComponent,
    BoolParamComponent,
    Vec2ParamComponent,
    Vec3ParamComponent,
    Vec4ParamComponent,
    Texture2DParamComponent,
    TextureCubeParamComponent,
  ];
  static getGroup(){
    return 'param';
  }
  static filter(component){
    let r = false;
    let targetComponentName = component.name + 'Component';
    for(let c in Params._s_Filters){
      if(Params._s_Filters[c].name == targetComponentName){
        r = true;
        break;
      }
    }
    return r;
  }
}
