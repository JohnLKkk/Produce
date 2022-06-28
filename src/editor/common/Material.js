import Try3d from 'try3d/src/Try3d'
import Utils from '../utils/Utils'

export default class Material {
  static S_GIZMO_DEF = Try3d.MaterialDef.parse('// 用于3D视图编辑器中的ObjControl操作\n' +
    'Def GizmoDef{\n' +
    '    Params{\n' +
    '        vec4 color;\n' +
    '    }\n' +
    '    SubTechnology NormPass{\n' +
    '        Vars{\n' +
    '            vec4 wordPosition;\n' +
    '        }\n' +
    '        Vs_Shader{\n' +
    '            void main(){\n' +
    '                Context.OutPosition = Context.ProjectMatrix * Context.ViewMatrix * Context.ModelMatrix * vec4(Context.InPosition, 1.0f);\n' +
    '            }\n' +
    '        }\n' +
    '        Fs_Shader{\n' +
    '            void main(){\n' +
    '                Context.OutColor = vec4(1.0f);\n' +
    '                // 使用自定义颜色输出\n' +
    '                #ifdef Params.color\n' +
    '                    Context.OutColor *= Params.color;\n' +
    '                #endif\n' +
    '            }\n' +
    '        }\n' +
    '    }\n' +
    '    Technology{\n' +
    '        Sub_Pass{\n' +
    '            Pass NormPass{\n' +
    '                DepthTest Off;\n' +
    '            }\n' +
    '        }\n' +
    '    }\n' +
    '}\n');
  static S_COLOR_MAT = Try3d.MaterialDef.parse('// 颜色材质,提供指定颜色或颜色纹理并渲染\n' +
    'Def HelperUnlitDef{\n' +
    '    Params{\n' +
    '        vec4 color;\n' +
    '        sampler2D colorMap;\n' +
    '        float alphaDiscard;\n' +
    '    }\n' +
    '    SubTechnology ColorPass{\n' +
    '        Vars{\n' +
    '            vec4 wordPosition;\n' +
    '            vec2 uv0;\n' +
    '        }\n' +
    '        Vs_Shader{\n' +
    '            void main(){\n' +
    '                //Context.OutPosition = Context.ProjectViewModelMatrix * vec4(Context.InPosition, 1.0f);\n' +
    '                Context.OutPosition = Context.ProjectMatrix * Context.ViewMatrix * Context.ModelMatrix * vec4(Context.InPosition, 1.0f);\n' +
    '                wordPosition = Context.OutPosition;\n' +
    '                uv0 = Context.InUv0;\n' +
    '            }\n' +
    '        }\n' +
    '        Fs_Shader{\n' +
    '            void main(){\n' +
    '                Context.OutColor = vec4(1.0f);\n' +
    '                // 使用自定义颜色输出\n' +
    '                #ifdef Params.color\n' +
    '                    Context.OutColor.rgb *= Params.color.rgb;\n' +
    '                #endif\n' +
    '\n' +
    '                // 使用纹理\n' +
    '                #ifdef Params.colorMap\n' +
    '                    Context.OutColor *= texture(Params.colorMap, uv0);\n' +
    '                #endif\n' +
    '\n' +
    '                #ifdef Params.alphaDiscard\n' +
    '                    if(Context.OutColor.a < Params.alphaDiscard){\n' +
    '                        discard;\n' +
    '                    }\n' +
    '                #endif\n' +
    '            }\n' +
    '        }\n' +
    '    }\n' +
    '    Technology{\n' +
    '        Sub_Pass{\n' +
    '            Pass ColorPass{\n' +
    '            }\n' +
    '        }\n' +
    '    }\n' +
    '}\n');
  static S_BASIC_LIGHTING_MAT = Try3d.MaterialDef.parse(Try3d.Internal.S_BASIC_LIGHTING_DEF_DATA);
  static _S_WHITE_COLOR_MAT_INS = null;
  static _S_RED_COLOR_MAT_INS = null;
  static _S_GREEN_COLOR_MAT_INS = null;
  static _S_BLUE_COLOR_MAT_INS = null;
  static _S_BASIC_LIGHTING_MAT_INS = null;
  constructor (props) {
  }

  /**
   * 返回WhiteColorMatIns。<br/>
   * @param scene
   * @param {Boolean}[make 是否创建新的]
   * @returns {null}
   */
  static getWhiteColorMatIns(scene, make){
    if(!Material._S_WHITE_COLOR_MAT_INS){
      Material._S_WHITE_COLOR_MAT_INS = new Try3d.Material(scene, {id:"white_color", materialDef:Material.S_COLOR_MAT});
      Material._S_WHITE_COLOR_MAT_INS.setParam("color", new Try3d.Vec4Vars().valueFromXYZW(1, 1, 1, 1.0));
    }
    return Material._S_WHITE_COLOR_MAT_INS;
  }

  /**
   * 返回RedColorMatIns。<br/>
   * @param scene
   * @param {Boolean}[make 是否创建新的]
   * @returns {null}
   */
  static getRedColorMatIns(scene, make){
    if(!Material._S_RED_COLOR_MAT_INS){
      Material._S_RED_COLOR_MAT_INS = new Try3d.Material(scene, {id:"red_color", materialDef:Material.S_GIZMO_DEF});
      Material._S_RED_COLOR_MAT_INS.setParam("color", new Try3d.Vec4Vars().valueFromXYZW(1, 0, 0, 1.0));
    }
    return Material._S_RED_COLOR_MAT_INS;
  }

  /**
   * 返回GreenColorMatIns。<br/>
   * @param scene
   * @param {Boolean}[make 是否创建新的]
   * @returns {null}
   */
  static getGreenColorMatIns(scene, make){
    if(!Material._S_GREEN_COLOR_MAT_INS){
      Material._S_GREEN_COLOR_MAT_INS = new Try3d.Material(scene, {id:"green_color", materialDef:Material.S_GIZMO_DEF});
      Material._S_GREEN_COLOR_MAT_INS.setParam("color", new Try3d.Vec4Vars().valueFromXYZW(0, 1, 0, 1.0));
    }
    return Material._S_GREEN_COLOR_MAT_INS;
  }

  /**
   * 返回BlueColorMatIns。<br/>
   * @param scene
   * @param {Boolean}[make 是否创建新的]
   * @returns {null}
   */
  static getBlueColorMatIns(scene, make){
    if(!Material._S_BLUE_COLOR_MAT_INS){
      Material._S_BLUE_COLOR_MAT_INS = new Try3d.Material(scene, {id:"blue_color", materialDef:Material.S_GIZMO_DEF});
      Material._S_BLUE_COLOR_MAT_INS.setParam("color", new Try3d.Vec4Vars().valueFromXYZW(0, 0, 1, 1.0));
    }
    return Material._S_BLUE_COLOR_MAT_INS;
  }

  /**
   * 返回一个BasicLightingMatIns
   * @param scene
   * @param {Boolean}[make 是否创建新的]
   * @returns {null|Material}
   */
  static getBasicLightingMatIns(scene, make){
    if(make){
      return new Try3d.Material(scene, {id:"basic_light_" + Utils.nextId(), materialDef:Material.S_BASIC_LIGHTING_MAT});
    }
    if(!Material._S_BASIC_LIGHTING_MAT_INS){
      Material._S_BASIC_LIGHTING_MAT_INS = new Try3d.Material(scene, {id:"basic_light", materialDef:Material.S_BASIC_LIGHTING_MAT});
    }
    return Material._S_BASIC_LIGHTING_MAT_INS;
  }

  /**
   * 返回一个WhiteBasicLightingMatIns。<br/>
   * @param {Scene}[scene]
   * @param {Boolean}[make]
   * @returns {Material}
   */
  static getWhiteBasicLightingMatIns(scene, make){
    let matIns = Material.getBasicLightingMatIns(scene, make);
    matIns.setParam('ambientColor', new Try3d.Vec4Vars().valueFromXYZW(0.25, 0.25, 0.25, 1.0));
    matIns.setParam('diffuseColor', new Try3d.Vec4Vars().valueFromXYZW(1, 1, 1, 1.0));
    matIns.setParam('specularColor', new Try3d.Vec4Vars().valueFromXYZW(1.0, 1.0, 1.0, 1.0));
    matIns.setParam('shininess', new Try3d.FloatVars().valueOf(64.0));
    return matIns;
  }

}
