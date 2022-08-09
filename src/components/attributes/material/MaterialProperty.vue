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
      EditorContext.getInstance().registerEvent(Viewer.S_VIEWER_OBJECT_UPDATE, ()=>{
        this.updateView();
      });
    },
    methods:{
      refMaterialParams:function(material){
        if(this.content.length){
          let matDefItem = this.content[0];
          this.content = [];
          let paramValues = material.getParamValues();
          let paramContent = {
            type:'Material',
            component:'CombinationComponent',
            data:[]
          };
          for(let param in paramValues){
            console.log(param + ':',paramValues);
            let item = this._parseParamType(param, paramValues[param]);
            if(item)
              paramContent.data.push(item);
          }
          this.content.push(matDefItem);
          this.content.push(paramContent);
        }
      },
      _parseParamType:function(paramName, param){
        let pV = null;
        if(param instanceof Try3d.BoolVars){
          pV = {
            component:'BoolComponent',
            data:{
              typename:paramName,
              content:{checked:param._m_Bool},
              set:(v)=>{
                this.obj.getMaterial().setParam(paramName, new Try3d.BoolVars().valueOf(v));
              }
            }
          };
        }
        else if(param instanceof Try3d.Vec4Vars){
          pV = {
            component:'VectorColorComponent',
            data:{
              typename:paramName,
              content:{
                R:param._m_X.toFixed(2),
                G:param._m_Y.toFixed(2),
                B:param._m_Z.toFixed(2),
                A:param._m_W.toFixed(2)
              },
              set:(v)=>{
                this.obj.getMaterial().setParam(paramName, new Try3d.Vec4Vars().valueFromXYZW(v.R, v.G, v.B, v.W));
              }
            }
          };
        }
        else if(param instanceof Try3d.Vec2Vars){

        }
        return pV;
      },
      updateView:function(){
        if(this.obj){
          // 构造数据编辑组件数据
          this.content = [];
          if(this.obj instanceof Try3d.Geometry){
            // 获取当前选中geometry的材质
            // MaterialDefinition
            let matDefs = MaterialDefFactory.getMatDefs();
            let matDefsContent = [];
            for(let matDef in matDefs){
              matDefsContent.push({text:matDefs[matDef].getName(), value:matDefs[matDef]});
            }
            this.content.push({
              // Material Definition
              type:'Material Definition',
              component:'SelectComponent',
              data:{
                selected:matDefs[this.obj.getMaterial().getMatDefName()],
                typename:'Material Definition',
                content:matDefsContent,
                set:(v)=>{
                  // 创建一个材质实例赋给obj
                  // todo:当前每次选择其他matDef作为材质定义时,都创建一个新的基于matDef的material
                  // todo:后续调整为将material缓存到对应的matDef池中,优先检测matDef池中未被利用的material
                  let editorContext = EditorContext.getInstance();
                  let material = new Try3d.Material(editorContext.getRenderer()._scene, {id:'mat_next_' + Try3d.Tools.nextId(), materialDef:v});
                  this.obj.setMaterial(material);
                  this.refMaterialParams(this.obj.getMaterial());
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
