import Try3d from 'try3d/src/Try3d'
import Mesh from 'try3d/src/Core/WebGL/Mesh'

export default class Arrow extends Try3d.Geometry{
  getType(){
    return 'Geometry';
  }
  static positions = [
      0, 0, 0,
      0, 0, 1, // tip
      0.05, 0, 0.9, // tip right
      -0.05, 0, 0.9, // tip left
      0, 0.05, 0.9, // tip top
      0, -0.05, 0.9, // tip bottom
  ];

  /**
   * 创建一个Arrow。<br/>
   * @param {Component}[owner]
   * @param {String}[cfg.id]
   * @param {Vector3}[cfg.extent]
   */
  constructor (owner, cfg) {
    super(owner, cfg);
    this._m_TempQuat = new Try3d.Quaternion();
    this._m_TempVec = new Try3d.Vector3();

    let len = cfg.extent.length();
    let up = Try3d.Vector3.S_UNIT_AXIS_Y;
    let dot = cfg.extent.dot(up);
    // 说明几乎朝向平行
    if(dot >= 0.9){
      up = Try3d.Vector3.S_UNIT_AXIS_NEGATIVE_Z;
    }
    else if(dot <= -0.9){
      up = Try3d.Vector3.S_UNIT_AXIS_Z;
    }
    this.lookAt(this._m_TempQuat, cfg.extent, up);
    let mesh = new Try3d.Mesh();
    const positions = [];
    const indices = [0, 1,
      1, 2,
      1, 3,
      1, 4,
      1, 5];
    for(let i = 0;i < Arrow.positions.length;i+=3){
      this._m_TempVec.setToInXYZ(Arrow.positions[i], Arrow.positions[i + 1], Arrow.positions[i + 2]);
      this._m_TempVec.multLength(len);
      this._m_TempQuat.multVec3(this._m_TempVec, this._m_TempVec);
      positions.push(this._m_TempVec._m_X);
      positions.push(this._m_TempVec._m_Y);
      positions.push(this._m_TempVec._m_Z);
    }
    mesh.setData(Try3d.Mesh.S_POSITIONS, positions);
    mesh.setData(Try3d.Mesh.S_INDICES, indices);
    mesh.setPrimitive(Try3d.Mesh.S_PRIMITIVE_LINES);
    this.setMesh(mesh);
    this.updateBound();
  }
  lookAt(q, direction, up){
    let vect3 = new Try3d.Vector3();
    vect3.setTo(direction).normal();
    let vect1 = new Try3d.Vector3();
    vect1.setTo(up);
    vect1.cross(direction);
    vect1.normal();
    let vect2 = new Try3d.Vector3();
    vect2.setTo(direction);
    vect2.cross(vect1);
    vect2.normal();
    q.fromAxis(vect1, vect2, vect3);
  }

};
