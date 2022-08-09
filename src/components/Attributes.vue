<template>
  <div class="window">
    <div class="topdeftoolbg2"></div>
    <div class="attributes_content" style="width: 100%;height: 100%;">
      <vue-tabs active-tab-color="rgba(66, 66, 66, 0.53)"
                type="pills"
                :start-index="1"
                direction="vertical"
                style="min-height: 100%"
      >
        <v-tab id="renderer_pro" icon="sg_eye" style="background-color: rgba(66, 66, 66, 0.53);min-height: 100%;">
<!--          渲染属性(各种后处理)-->
          <component v-bind:is="currentRendererProTabComponent" class="attributes_tab"></component>
        </v-tab>

        <v-tab id="scene_pro" icon="sg_scene" style="background-color: rgba(66, 66, 66, 0.53);min-height: 100%;">
<!--          场景属性-->
          <component v-bind:is="currentObjectAttrTabComponent" class="attributes_tab"></component>
        </v-tab>

        <v-tab id="object_pro" icon="sg_model" style="background-color: rgba(66, 66, 66, 0.53);min-height: 100%;">
<!--          物体属性-->
          <component v-bind:is="currentObjectAttrTabComponent" class="attributes_tab" v-bind:obj="currentObjData"></component>
        </v-tab>

        <v-tab id="material_pro" icon="sg_material" style="background-color: rgba(66, 66, 66, 0.53);min-height: 100%;">
<!--          材质数据(只有geometry才有)-->
          <component v-bind:is="currentMaterialTabComponent" class="attributes_tab" v-bind:obj="currentObjData"></component>
        </v-tab>

        <v-tab id="texture_pro" icon="sg_texture" style="background-color: rgba(66, 66, 66, 0.53);min-height: 100%;">
<!--          纹理属性-->
          <component v-bind:is="currentObjectAttrTabComponent" class="attributes_tab"></component>
        </v-tab>

      </vue-tabs>

    </div>
  </div>
</template>

<script>
  import '../assets/tools.css'
  import '../assets/core/icons.css'

  import {VueTabs, VTab} from 'vue-nav-tabs'
  import '../assets/attributes-tabs.css'
  import OBJ_Geometry from './attributes/object/OBJ_Geometry'
  import OBJ_Node from './attributes/object/OBJ_Node'
  import OBJ_Light from './attributes/object/OBJ_Light'
  import OBJ_None from './attributes/object/OBJ_None'
  import {EditorContext} from '../editor/EditorContext'
  import LeadingPrinciples from '../editor/leadingPrinciples/LeadingPrinciples'
  import Utils from '../editor/utils/Utils'
  import RendererProperty from './attributes/renderer/RendererProperty'
  import MaterialProperty from './attributes/material/MaterialProperty'
  export default {
    name: 'Attributes',
    components: {
      VueTabs,
      VTab,

      RendererProperty,
      MaterialProperty,

      OBJ_Node,
      OBJ_Geometry,
      OBJ_Light,
      OBJ_None,
    },
    data(){
      return {
        obj:null,
        currentObjectAttrTab: 'OBJ_None',
      }
    },
    beforeCreate () {
      EditorContext.getInstance().registerEvent(LeadingPrinciples.S_LEADINGPRINCIPLES_EVENT_SELECTED, (obj)=>{
        // console.log('obj:',obj);
        this.obj = obj;
        switch (Utils.getObjectType(obj.getType())) {
          case 'Node':
            this.currentObjectAttrTab = 'OBJ_Node';
            break;
          case 'Geometry':
            this.currentObjectAttrTab = 'OBJ_Geometry';
            break;
          case 'Light':
            this.currentObjectAttrTab = 'OBJ_Light';
            break;
          default:
            this.currentObjectAttrTab = 'OBJ_None';
            break;
        }
      });
    },
    computed: {
      /**
       * 返回当前选中的物体。<br/>
       * @returns {Object}
       */
      currentObjData: function(){
        return this.obj;
      },

      /**
       * 渲染面板。<br/>
       * @returns {string}
       */
      currentRendererProTabComponent: function(){
        return 'RendererProperty';
      },

      /**
       * 物体属性面板。<br/>
       * @returns {string}
       */
      currentObjectAttrTabComponent: function() {
        return this.currentObjectAttrTab;
      },

      /**
       * 材质属性面包。<br/>
       * @return {string}
       */
      currentMaterialTabComponent: function(){
        return 'MaterialProperty';
      }
    }
  }
</script>

<style scoped>
  .window{
    width: 100%;
    height: 100%;
    margin-left: 1px;
    margin-bottom: 1px;
    border-radius: 10px;
    background-color: rgba(41, 41, 41, 0.53);
  }
  .attributes_tab{
    width: 100%;
    height: 100%;
    padding: 10px;
  }
  .attributes_content{
    overflow-y: auto;
  }
  /*滚动条样式*/
  .attributes_content::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  .attributes_content::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .attributes_content::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
</style>
