/**
 * MaterialDefFactory用于实时创建当前正在定义的材质定义。<br/>
 * @author JohnKkk
 * @date 2022年7月12日15点35分
 */
export default class MaterialDefFactory {
  static _s_MaterialDef = null;
  static _s_MaterialDefs = {};

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
          defaultSubTechnology += 'SubTechnology ' + subTechnology + '{\n';
          subTechnology = currentMatDef.subTechnologys[subTechnology];

          // Vars
          let vars = '';
          if(subTechnology.vars){
            for(let varobj in subTechnology.vars){
              varobj = subTechnology.vars[varobj];
              if(varobj){
                varobj = varobj.data._m_Props._m_InputsMap['inVar'];
                vars += varobj.type + ' ' + varobj.varname + ';\n';
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
}
