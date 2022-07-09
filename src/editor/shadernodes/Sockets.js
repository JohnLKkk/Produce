import Rete from "rete";

/**
 * Sockets类提供了当前系统内置shaderNode可以连接的插槽类型。<br/>
 * @author JohnKkk
 * @date 2022年7月9日10点21分
 */
export default class Sockets{
  static s_NumSocket = new Rete.Socket('s_NumSocket');
}
