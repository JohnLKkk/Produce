import Rete from "rete";

/**
 * Sockets类提供了当前系统内置shaderNode可以连接的插槽类型。<br/>
 * @author JohnKkk
 * @date 2022年7月9日10点21分
 */
export default class Sockets{
  static s_NoContinueSocket = new Rete.Socket('s_NoContinueSocket');
  static s_OperationSocket = new Rete.Socket('s_OperationSocket');
  static s_NumSocket = new Rete.Socket('s_NumSocket');
  static s_BoolSocket = new Rete.Socket('s_BoolSocket');
  static s_UniversalSocket = new Rete.Socket('s_UniversalSocket');
  static s_NumArraySocket = new Rete.Socket('s_NumArraySocket');
  static s_Texture2DSocket = new Rete.Socket('s_Texture2DSocket');
  static s_TextureCubeSocket = new Rete.Socket('s_TextureCubeSocket');
  static s_Vector2Socket = new Rete.Socket('s_Vector2Socket');
  static s_Vector3Socket = new Rete.Socket('s_Vector3Socket');
  static s_Vector4Socket = new Rete.Socket('s_Vector4Socket');
  static s_Matrix4Socket = new Rete.Socket('s_Matrix4Socket');
  static s_Matrix3Socket = new Rete.Socket('s_Matrix3Socket');

  // Param
  static s_PNumSocket = new Rete.Socket('s_PNumSocket');
  static s_PBoolSocket = new Rete.Socket('s_PBoolSocket');
  static s_PTexture2DSocket = new Rete.Socket('s_PTexture2DSocket');
  static s_PTextureCubeSocket = new Rete.Socket('s_PTextureCubeSocket');
  static s_PVector2Socket = new Rete.Socket('s_PVector2Socket');
  static s_PVector3Socket = new Rete.Socket('s_PVector3Socket');
  static s_PVector4Socket = new Rete.Socket('s_PVector4Socket');
  static s_PMatrix4Socket = new Rete.Socket('s_PMatrix4Socket');
  static s_PMatrix3Socket = new Rete.Socket('s_PMatrix3Socket');


  static s_Attribute = new Rete.Socket('s_Attribute');
  static init(){
    // 运行socket的连接
    Sockets.s_NumSocket.combineWith(Sockets.s_OperationSocket);
    Sockets.s_NumArraySocket.combineWith(Sockets.s_OperationSocket);
    Sockets.s_BoolSocket.combineWith(Sockets.s_OperationSocket);
    Sockets.s_Vector2Socket.combineWith(Sockets.s_OperationSocket);
    Sockets.s_Vector3Socket.combineWith(Sockets.s_OperationSocket);
    Sockets.s_Vector4Socket.combineWith(Sockets.s_OperationSocket);
    Sockets.s_Texture2DSocket.combineWith(Sockets.s_OperationSocket);
    Sockets.s_TextureCubeSocket.combineWith(Sockets.s_OperationSocket);

    Sockets.s_OperationSocket.combineWith(Sockets.s_NumSocket);
    Sockets.s_OperationSocket.combineWith(Sockets.s_NumArraySocket);
    Sockets.s_OperationSocket.combineWith(Sockets.s_BoolSocket);
    Sockets.s_OperationSocket.combineWith(Sockets.s_Vector2Socket);
    Sockets.s_OperationSocket.combineWith(Sockets.s_Vector3Socket);
    Sockets.s_OperationSocket.combineWith(Sockets.s_Vector4Socket);
    Sockets.s_OperationSocket.combineWith(Sockets.s_Texture2DSocket);
    Sockets.s_OperationSocket.combineWith(Sockets.s_TextureCubeSocket);

    Sockets.s_PNumSocket.combineWith(Sockets.s_OperationSocket);
    Sockets.s_PBoolSocket.combineWith(Sockets.s_OperationSocket);
    Sockets.s_PVector2Socket.combineWith(Sockets.s_OperationSocket);
    Sockets.s_PVector3Socket.combineWith(Sockets.s_OperationSocket);
    Sockets.s_PVector4Socket.combineWith(Sockets.s_OperationSocket);
    Sockets.s_PMatrix3Socket.combineWith(Sockets.s_OperationSocket);
    Sockets.s_PMatrix4Socket.combineWith(Sockets.s_OperationSocket);

    Sockets.s_OperationSocket.combineWith(Sockets.s_PNumSocket);
    Sockets.s_OperationSocket.combineWith(Sockets.s_PBoolSocket);
    Sockets.s_OperationSocket.combineWith(Sockets.s_PVector2Socket);
    Sockets.s_OperationSocket.combineWith(Sockets.s_PVector3Socket);
    Sockets.s_OperationSocket.combineWith(Sockets.s_PVector4Socket);
    Sockets.s_OperationSocket.combineWith(Sockets.s_PMatrix3Socket);
    Sockets.s_OperationSocket.combineWith(Sockets.s_PMatrix4Socket);

    Sockets.s_PBoolSocket.combineWith(Sockets.s_BoolSocket);
    Sockets.s_PNumSocket.combineWith(Sockets.s_NumSocket);
    Sockets.s_PVector2Socket.combineWith(Sockets.s_Vector2Socket);
    Sockets.s_PVector3Socket.combineWith(Sockets.s_Vector3Socket);
    Sockets.s_PVector4Socket.combineWith(Sockets.s_Vector4Socket);
    Sockets.s_PMatrix3Socket.combineWith(Sockets.s_Matrix3Socket);
    Sockets.s_PMatrix4Socket.combineWith(Sockets.s_Matrix4Socket);
    Sockets.s_PTexture2DSocket.combineWith(Sockets.s_Texture2DSocket);
    Sockets.s_PTextureCubeSocket.combineWith(Sockets.s_TextureCubeSocket);
    Sockets.s_PNumSocket.combineWith(Sockets.s_BoolSocket);
    Sockets.s_PVector2Socket.combineWith(Sockets.s_BoolSocket);
    Sockets.s_PVector3Socket.combineWith(Sockets.s_BoolSocket);
    Sockets.s_PVector4Socket.combineWith(Sockets.s_BoolSocket);
    Sockets.s_PMatrix3Socket.combineWith(Sockets.s_BoolSocket);
    Sockets.s_PMatrix4Socket.combineWith(Sockets.s_BoolSocket);
    Sockets.s_PTexture2DSocket.combineWith(Sockets.s_BoolSocket);
    Sockets.s_PTextureCubeSocket.combineWith(Sockets.s_BoolSocket);
  }
}
