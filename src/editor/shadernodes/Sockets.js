import Rete from "rete";

/**
 * Sockets类提供了当前系统内置shaderNode可以连接的插槽类型。<br/>
 * @author JohnKkk
 * @date 2022年7月9日10点21分
 */
export default class Sockets{
  static s_NumSocket = new Rete.Socket('s_NumSocket');
  static s_UniversalSocket = new Rete.Socket('s_UniversalSocket');
  static s_NumArraySocket = new Rete.Socket('s_NumArraySocket');
  static s_Texture2DSocket = new Rete.Socket('s_Texture2DSocket');
  static s_TextureCubeSocket = new Rete.Socket('s_TextureCubeSocket');
  static s_Vector3Socket = new Rete.Socket('s_Vector3Socket');
  static s_Vector4Socket = new Rete.Socket('s_Vector4Socket');
}
