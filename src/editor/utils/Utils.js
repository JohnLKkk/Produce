export default class Utils {
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
      case 'SportLight':
        return 'Light';
      default:
        return '';
    }
  }
}
