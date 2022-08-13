<template>
    <div>
      <component v-bind:is="currentContent" v-bind="currentContentData"></component>
    </div>
</template>

<script>
  import AttrItem from '../AttrItem'
  import Utils from '../../../editor/utils/Utils'
  import ColorMath from '../../../editor/utils/ColorMath'
  import Try3d from 'try3d/src/Try3d'
  import {EditorContext} from '../../../editor/EditorContext'
  import Viewer from '../../../editor/viewer/Viewer'
  import MaterialDefFactory from '../../../editor/shadernodes/MaterialDefFactory'
  import MoreMath from 'try3d/src/Core/Math3d/MoreMath'

  export default {
    name: 'MaterialProperty',
    created () {
      // 第一次加载时刷新一次视图
      this.updateView();
      EditorContext.getInstance().registerEvent(Viewer.S_VIEWER_EVENT_SELECTED2, ()=>{
        this.updateView();
      });
    },
    methods:{
      refMaterialParams:function(material){
        if(this.content.length){
          let matDefItem = this.content[0];
          this.content = [];
          let paramValues = material.getParamValues();
          let paramDescriptors = material.getParamDescriptions();
          let paramContent = {
            type:'Material',
            component:'CombinationComponent',
            data:[]
          };
          for(let param in paramDescriptors){
            console.log(param + ':',paramDescriptors[param]);
            let item = this._parseParamType(paramDescriptors[param].getType(), param, paramValues[param]);
            if(item)
              paramContent.data.push(item);
          }
          this.content.push(matDefItem);
          this.content.push(paramContent);
        }
      },
      _getTexture : (imgData, srgb)=>{
        let editorContext = EditorContext.getInstance();
        let scene = editorContext.getRenderer()._scene;
        let texture = new Try3d.Texture2DVars(scene);
        // texture.setPreloadColor(scene, new Try3d.Vector4(0.2, 0.2, 0.2, 1.0));
        texture.setImageSrc(scene, imgData);
        if(srgb)
          texture.setTextureFormat(Try3d.Texture2DVars.S_TEXTURE_FORMAT.S_SRGBA, Try3d.Texture2DVars.S_TEXTURE_FORMAT.S_RGBA, Try3d.Texture2DVars.S_TEXTURE_FORMAT.S_UNSIGNED_BYTE);
        return texture;
      },
      _parseParamType:function(type, paramName, param){
        let pV = null;
        let targetMaterial = this.obj.getMaterial();
        switch (type) {
          case 'bool':
            pV = {
              component:'BoolComponent',
              data:{
                typename:paramName,
                textAlign:'left',
                width:'100%',
                content:{checked:param ? param._m_Bool : false},
                set:(v)=>{
                  targetMaterial.setParam(paramName, new Try3d.BoolVars().valueOf(v));
                }
              }
            };
            break;
          case 'vec2':
            pV = {
              component: 'VectorColorComponent',
              data: {
                typename: paramName,
                content: param ? {
                  R: Number(param._m_X).toFixed(2),
                  G: Number(param._m_Y).toFixed(2)
                } : {R:0, G:0},
                set: (v) => {
                  targetMaterial.setParam(paramName, new Try3d.Vec2Vars().valueFromXYZW(Number(v.R), Number(v.G)));
                }
              }
            };
            break;
          case 'vec3':
            // todo:待办,添加vec3Vars
            pV = {
              component: 'VectorColorComponent',
              data: {
                typename: paramName,
                content: param ? {
                  R: Number(param._m_X).toFixed(2),
                  G: Number(param._m_Y).toFixed(2),
                  B: Number(param._m_Z).toFixed(2)
                } : {R:0, G:0, B:0},
                set: (v) => {
                  targetMaterial.setParam(paramName, new Try3d.Vec2Vars().valueFromXYZW(Number(v.R), Number(v.G), Number(v.B)));
                }
              }
            };
            break;
          case 'vec4':
            let cl = param ? {
              R: Number(param._m_X).toFixed(2),
              G: Number(param._m_Y).toFixed(2),
              B: Number(param._m_Z).toFixed(2),
              W: Number(param._m_W).toFixed(2)
            } : {R:0, G:0, B:0, W:1};
            pV = {
              component: 'VectorColorComponent',
              data: {
                typename: paramName,
                color:ColorMath.rgbToHex(cl.R, cl.G, cl.B),
                content: cl,
                set: (v) => {
                  targetMaterial.setParam(paramName, new Try3d.Vec4Vars().valueFromXYZW(Number(v.R), Number(v.G), Number(v.B), Number(v.W)));
                }
              }
            };
            break;
          case 'int':
            pV = {
              component: 'VectorComponent',
              data: {
                typename: paramName,
                content: param ? {
                  v: Number(param._m_X).toFixed(2),
                } : {v:0},
                set: (v) => {
                  targetMaterial.setParam(paramName, new Try3d.FloatVars().valueOf(Number(v)));
                }
              }
            };
            break;
          case 'float':
            pV = {
              component: 'NumberComponent',
              type:paramName,
              data: {
                typename: paramName,
                content: param ? {
                  v: Number(param._m_Float).toFixed(2),
                } : {v:0},
                set: (v) => {
                  targetMaterial.setParam(paramName, new Try3d.FloatVars().valueOf(Number(v.v)));
                }
              }
            };
            break;
          case 'sampler2D':
            pV = {
              component:'ImgComponent',
              data:{
                typename:paramName,
                textAlign:'left',
                width:'100%',
                content:{img:param ? param._m_ImageSource.src : null},
                set:(v)=>{
                  targetMaterial.setParam(paramName, this._getTexture(v.img));
                }
              }
            };
            break;
        }
        // if(param instanceof Try3d.BoolVars){
        //   pV = {
        //     component:'BoolComponent',
        //     data:{
        //       typename:paramName,
        //       content:{checked:param._m_Bool},
        //       set:(v)=>{
        //         this.obj.getMaterial().setParam(paramName, new Try3d.BoolVars().valueOf(v));
        //       }
        //     }
        //   };
        // }
        // else if(param instanceof Try3d.Vec4Vars){
        //   pV = {
        //     component:'VectorColorComponent',
        //     data:{
        //       typename:paramName,
        //       content:{
        //         R:param._m_X.toFixed(2),
        //         G:param._m_Y.toFixed(2),
        //         B:param._m_Z.toFixed(2),
        //         A:param._m_W.toFixed(2)
        //       },
        //       set:(v)=>{
        //         this.obj.getMaterial().setParam(paramName, new Try3d.Vec4Vars().valueFromXYZW(v.R, v.G, v.B, v.W));
        //       }
        //     }
        //   };
        // }
        // else if(param instanceof Try3d.Vec2Vars){
        //
        // }
        return pV;
      },
      updateView:function(){
        if(this.obj && this.obj != this._lastObj){
          this._lastObj = this.obj;
          // 构造数据编辑组件数据
          this.content = [];
          if(this.obj instanceof Try3d.Geometry){
            // 获取当前选中geometry的材质
            // MaterialDefinition
            let matDefs = MaterialDefFactory.getCompileMatDefs();
            let matDefsContent = [];
            for(let matDef in matDefs){
              if(matDefs[matDef] && matDefs[matDef].getName){
                matDefsContent.push({text:matDefs[matDef].getName(), value:matDefs[matDef]});
              }
            }
            let targetObj = this.obj;
            this.content.push({
              // Material Definition
              type:'Material Definition',
              component:'SelectComponent',
              data:{
                selected:matDefs[targetObj.getMaterial().getMatDefName()],
                typename:'Material Definition',
                content:matDefsContent,
                set:(v)=>{
                  // 创建一个材质实例赋给obj
                  // todo:当前每次选择其他matDef作为材质定义时,都创建一个新的基于matDef的material
                  // todo:后续调整为将material缓存到对应的matDef池中,优先检测matDef池中未被利用的material
                  let editorContext = EditorContext.getInstance();
                  if(targetObj.getMaterial().getMatDefName() != v.getName()){
                    let material = new Try3d.Material(editorContext.getRenderer()._scene, {id:'mat_next_' + Try3d.Tools.nextId(), materialDef:v});
                    targetObj.setMaterial(material);
                    this.refMaterialParams(targetObj.getMaterial());
                  }
                }
              }
            });

            // MaterialParams
            this.refMaterialParams(this.obj.getMaterial());
          }
        }
      }
    },
    props:{
      obj:null,
    },
    watch:{
      // 外部更新props.obj
      // 监听发生变化后更新视图
      obj:function () {
        this.updateView();
      }
    },
    components:{AttrItem},
    data(){
      return {
        _lastObj:null,
        content:[
        ],
      }
    },
    computed: {
      currentContentData : function(){
        return {
          content:this.content,
        };
      },
      currentContent : function () {
        return 'AttrItem';
      }
    }
  }
</script>

<style scoped>

</style>
