export default class Utils {
  static _s_Id = -1;
  static _s_ShaderNodeId = 0;
  static nextId(){
    return Utils._s_Id++;
  }
  static nextShaderNodeId(){
    return Utils._s_ShaderNodeId++;
  }

  static getObjectType(type){
    switch (type) {
      case 'Node':
        return 'Node';
      case 'Geometry':
      case 'Box':
      case 'Sphere':
      case 'Plane':
      case 'SkyBox':
        return 'Geometry';
      case 'Light':
      case 'DirectionalLight':
      case 'PointLight':
      case 'SpotLight':
        return 'Light';
      default:
        return '';
    }
  }

  /**
   * 复制一个对象。<br/>
   * @param {Object}[object]
   * @param {String}[filterKey 过滤key]
   * @param {Object}[filterValue 过滤key对应的value]
   * @returns {{}}
   */
  static copyObj(object, filterKey, filterValue){
    let result = {};
    for(let k in object){
      if(k == filterKey){
        result[k] = filterValue;
      }
      else{
        result[k] = object[k];
      }
    }
    return result;
  }
}
