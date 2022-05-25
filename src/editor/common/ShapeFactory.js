import {EditorContext} from '../EditorContext'
import Material from './Material'
import Try3d from 'try3d/src/Try3d'
import Utils from '../utils/Utils'

export default class ShapeFactory {
  constructor (props) {
  }

  /**
   * 创建Box。<br/>
   * @param options
   * @returns {Box}
   */
  static createBox(options){
    let scene = EditorContext.getScene(0);
    let box1Mat = Material.getWhiteBasicLightingMatIns(scene, true);
    let box = new Try3d.Box(scene, {id:'box_' + Utils.nextId(), xHalf:0.2, yHalf:0.2, zHalf:0.2});
    box.setMaterial(box1Mat);
    return box;
  }

  /**
   * 创建Cylinder。<br/>
   * @param options
   * @returns {Cylinder}
   */
  static createCylinder(options){
    let scene = EditorContext.getScene(0);
    // 定义一个Cylinder
    let cylinder = new Try3d.Cylinder(scene, {id:'cylinder_' + Utils.nextId(), radiusTop:0.0, radiusBottom:0.3, height:1});
    // 创建cylinderMat
    let cylinderMat = Material.getWhiteBasicLightingMatIns(scene, true);
    cylinder.setMaterial(cylinderMat);
    return cylinder;
  }

  /**
   * 创建Sphere。<br/>
   * @param options
   * @returns {Sphere}
   */
  static createSphere(options){
    // 定义一个Sphere
    let scene = EditorContext.getScene(0);
    let sphere = new Try3d.Sphere(scene, {id:'sphere_' + Utils.nextId(), radius:0.2});
    // 创建sphereMat
    let sphereMat = Material.getWhiteBasicLightingMatIns(scene, true);
    sphere.setMaterial(sphereMat);
    return sphere;
  }

  /**
   * 创建Teapot。<br/>
   * @param options
   * @returns {Teapot}
   */
  static createTeapot(options){
    let scene = EditorContext.getScene(0);
    // 定义一个Teapot
    let teapot = new Try3d.Teapot(scene, {id:'teapot_' + Utils.nextId()});
    let teapotMat = Material.getWhiteBasicLightingMatIns(scene, true);
    teapot.setMaterial(teapotMat);
    return teapot;
  }

  /**
   * 创建Torus。<br/>
   * @param options
   * @returns {Torus}
   */
  static createTorus(options){
    let scene = EditorContext.getScene(0);
    // 定义一个Torus
    let torus = new Try3d.Torus(scene, {id:'torus', tube:0.05, radius:0.2, segmentsR:64, segmentsT:64});
    // 创建torusMat
    let torusMat = Material.getWhiteBasicLightingMatIns(scene, true);
    torus.setMaterial(torusMat);
    return torus;
  }

  /**
   * 创建Plane。<br/>
   * @param options
   * @returns {GroupPlane}
   */
  static createPlane(options){
    let scene = EditorContext.getScene(0);
    // 定义一个GroupPlane
    let groupPlane = new Try3d.GroupPlane(scene, {id:'groupPlane_' + Utils.nextId(), xSize:4, zSize:4, xSegments:2, zSegments:2});
    // 创建groupPlaneMat
    let groupPlaneMat = Material.getWhiteBasicLightingMatIns(scene, true);
    groupPlane.setMaterial(groupPlaneMat);
    return groupPlane;
  }

}
