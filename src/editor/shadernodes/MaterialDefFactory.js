/**
 * MaterialDefFactory用于实时创建当前正在定义的材质定义。<br/>
 * @author JohnKkk
 * @date 2022年7月12日15点35分
 */
import Try3d from 'try3d/src/Try3d'

export default class MaterialDefFactory {
  static _s_MaterialDef = null;
  static _s_MaterialDefs = {};
  static _s_CompileMaterialDefs = {};

  /**
   * 返回当前正在编辑打开的材质定义。<br/>
   * @return {null}
   */
  static getMaterialDef(){
    return MaterialDefFactory._s_MaterialDef;
  }

  /**
   * 添加一个var。<br/>
   * @param {Object}[varobj]
   */
  static addVar(varobj, subTechnologyId){
    subTechnologyId = subTechnologyId || 'defaultSubDraw';
    let subTechnology = MaterialDefFactory.getMaterialDef();
    subTechnology = subTechnology.subTechnologys[subTechnologyId];
    if(subTechnology){
      if(!subTechnology.vars[varobj.data._m_Props._m_Uid]){
        subTechnology.vars[varobj.data._m_Props._m_Uid] = varobj;
      }
    }
  }

  /**
   * 添加参数。<br/>
   * @param {Object}[param]
   */
  static addParam(param){
    let currentMatDef = MaterialDefFactory.getMaterialDef();
    if(!currentMatDef.params[param.data._m_Props._m_Uid]){
      currentMatDef.params[param.data._m_Props._m_Uid] = param;
    }
  }

  /**
   * 返回当前MatDef的参数集。<br/>
   * @return {null|*}
   */
  static getParams(){
    let currentMatDef = MaterialDefFactory.getMaterialDef();
    if(currentMatDef){
      return currentMatDef.params;
    }
    return null;
  }

  /**
   * 设置一个FsShader。<br/>
   * @param {String}[FsShaderCode]
   * @param {String}[subTechnologyId]
   */
  static setFsShader(FsShaderCode, subTechnologyId){
    subTechnologyId = subTechnologyId || 'defaultSubDraw';
    let subTechnology = MaterialDefFactory.getMaterialDef();
    subTechnology = subTechnology.subTechnologys[subTechnologyId];
    if(subTechnology){
      subTechnology.fs_shader = FsShaderCode;
    }
  }

  /**
   * 设置一个VsShader。<br/>
   * @param {String}[VsShaderCode]
   * @param {String}[subTechnologyId]
   */
  static setVsShader(VsShaderCode, subTechnologyId){
    subTechnologyId = subTechnologyId || 'defaultSubDraw';
    let subTechnology = MaterialDefFactory.getMaterialDef();
    subTechnology = subTechnology.subTechnologys[subTechnologyId];
    if(subTechnology){
      subTechnology.vs_shader = VsShaderCode;
    }
  }

  /**
   * 转换MaterialDefString。<br/>
   * @return {string}
   */
  static toMaterialDefString(){
    let currentMatDef = MaterialDefFactory.getMaterialDef();
    if(currentMatDef){
      let matDefStr = '';
      // Begin
      matDefStr += 'Def ' + currentMatDef.defId + '{\n';

      // Params
      let params = '';
      if(currentMatDef.params){
        for(let param in currentMatDef.params){
          param = currentMatDef.params[param];
          if(param){
            param = param.data._m_Props._m_OutputsMap['paramOut'];
            params += param.type + ' ' + param.varname.replace('Params.', '') + ';\n';
          }
        }
      }
      if(params.length > 1){
        matDefStr += 'Params{\n';
        matDefStr += params;
        matDefStr += '}\n';
      }

      // SubTechnologys
      let defaultSubTechnology = '';
      if(currentMatDef.subTechnologys){
        for(let subTechnology in currentMatDef.subTechnologys){
          // BEGIN
          defaultSubTechnology += 'SubTechnology ' + subTechnology + '{\n';
          subTechnology = currentMatDef.subTechnologys[subTechnology];

          // Vars
          let vars = '';
          if(subTechnology.vars){
            for(let varobj in subTechnology.vars){
              varobj = subTechnology.vars[varobj];
              if(varobj){
                varobj = varobj.data._m_Props._m_InputsMap['inVar'];
                vars += varobj.vartype + ' ' + varobj.varname + ';\n';
              }
            }
          }
          if(vars.length > 1){
            defaultSubTechnology += 'Vars{\n';
            defaultSubTechnology += vars;
            defaultSubTechnology += '}\n';
          }

          // Vs_Shader
          defaultSubTechnology += 'Vs_Shader{\n' +
            '            void main(){\n';
          defaultSubTechnology += (subTechnology.vs_shader || '') + '\n';
          defaultSubTechnology += '            }\n' +
            '        }\n';

          // Fs_Shader
          defaultSubTechnology += 'Fs_Shader{\n' +
            '            void main(){\n';
          defaultSubTechnology += (subTechnology.fs_shader || '') + '\n';
          defaultSubTechnology += '            }\n' +
            '        }\n';
          // END
          defaultSubTechnology += '}\n';
        }
      }
      if(defaultSubTechnology.length > 1){
        matDefStr += defaultSubTechnology;
      }

      // Technologys
      let technologys = '';
      if(currentMatDef.technologys){
        for(let technology in currentMatDef.technologys){
          // todo:暂时还没想好如何在编辑器下配置多个technology,因此,这里理论上只有一个defaultTechnology
          if(technology != 'defaultTechnology'){
            technologys += 'Technology ' + technology + '{\n';
          }
          else{
            technologys += 'Technology{\n';
          }
          technologys += currentMatDef.technologys[technology].sub_Pass;
          technologys += '}\n';
        }
      }
      if(technologys.length > 1){
        matDefStr += technologys;
      }

      return matDefStr;
    }

    return '';
  }

  /**
   * 移除变量。<br/>
   * @param {Object}[varobj]
   * @param subTechnologyId
   */
  static removeVar(varobj, subTechnologyId){
    subTechnologyId = subTechnologyId || 'defaultSubDraw';
    let subTechnology = MaterialDefFactory.getMaterialDef();
    subTechnology = subTechnology.subTechnologys[subTechnologyId];
    if(subTechnology){
      if(subTechnology.vars[varobj.data._m_Props._m_Uid]){
        subTechnology.vars[varobj.data._m_Props._m_Uid] = null;
      }
    }
  }

  /**
   * 移除参数。<br/>
   * @param {Object}[param]
   */
  static removeParam(param){
    let currentMatDef = MaterialDefFactory.getMaterialDef();
    currentMatDef.params[param.data._m_Props._m_Uid] = null;
  }

  static editMaterialDef(defId){
    MaterialDefFactory._s_MaterialDef = MaterialDefFactory._s_MaterialDefs[defId];
    if(!MaterialDefFactory._s_MaterialDef){
      MaterialDefFactory._s_MaterialDef = {
        defId,
        meta:{
          "id":"ShadingEdit@0.1.0",
          "nodes":{
          }
        },
        params:{},
        subTechnologys:{},
        technologys:{}
      };
      MaterialDefFactory._s_MaterialDefs[defId] = MaterialDefFactory._s_MaterialDef;
      MaterialDefFactory._initDefaultMaterialDef(MaterialDefFactory._s_MaterialDef);
    }
    return MaterialDefFactory._s_MaterialDef;
  }

  static _initDefaultMaterialDef(materialDef){
    materialDef.subTechnologys['defaultSubDraw'] = {
      vars:{},
      vs_shader:null,
      fs_shader:null
    };
    materialDef.technologys['defaultTechnology'] = {
      sub_Pass:'Sub_Pass{\n' +
        '            Pass defaultSubDraw{\n' +
        '            }\n' +
        '        }\n'
    };
  }

  /**
   * 返回MatDefs。<br/>
   * @return {{}}
   */
  static getCompileMatDefs(){
    return MaterialDefFactory._s_CompileMaterialDefs;
  }
  static compileMatDef(matDefStr){
    MaterialDefFactory._preloadMatDef(matDefStr);
  }

  /**
   * 预加载材质定义
   * @param matDefStr
   * @private
   */
  static _preloadMatDef(matDefStr){
    let nextMatDef = null;
    nextMatDef = Try3d.MaterialDef.parse(matDefStr);
    console.log('编译：\n' + matDefStr + '');
    MaterialDefFactory._s_CompileMaterialDefs[nextMatDef.getName()] = nextMatDef;
  }

  static initMaterialDefs(){
    // basic lighting def
    MaterialDefFactory._preloadMatDef(Try3d.Internal.S_BASIC_LIGHTING_DEF_DATA);

    // S_DEFERRED_LIGHTING_DEF_DATA
    MaterialDefFactory._preloadMatDef(Try3d.Internal.S_DEFERRED_LIGHTING_DEF_DATA);

    // principled lighting def
    MaterialDefFactory._preloadMatDef(Try3d.Internal.S_PRINCIPLED_LIGHTING_DEF);

    // S_PRINCIPLED_DEFERRED_LIGHTING_DEF_DATA
    MaterialDefFactory._preloadMatDef(Try3d.Internal.S_PRINCIPLED_DEFERRED_LIGHTING_DEF_DATA);

    // S_COLOR_DEF_DATA
    MaterialDefFactory._preloadMatDef(Try3d.Internal.S_COLOR_DEF_DATA);
  }
}
