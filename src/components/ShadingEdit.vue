<template>
  <div class="window">
    <div class="topdeftoolbg2"></div>
    <div ref="edit" v-on:mousewheel="zoom"class="one" style="width: 100%;height: 100%;min-width:100%;min-height:100%;background-color: #1a1a1a;overflow:hidden;position:relative;"v-on:mousedown.middle="">
      <!--      <ShaderNode title="原理化BSDF"></ShaderNode>-->
      <!--      <ShaderNode title="漫射BSDF"></ShaderNode>-->
    </div>
  </div>
</template>

<script>
  /**
   * 着色器编辑器。<br/>
   * @author JhonKkk
   * @date 2021年8月14日09点49分
   */
  import "@babel/polyfill";
  import '../assets/tools.css'
  import ShaderNode from '@/components/ShaderNode'
  import Rete from "rete";
  import VueRenderPlugin from 'rete-vue-render-plugin';
  import ConnectionPlugin from 'rete-connection-plugin';
  import HistoryPlugin from "rete-history-plugin";
  import ContextMenuPlugin from "rete-context-menu-plugin";
  import AreaPlugin from "rete-area-plugin";
  import NumberComponent from "../editor/shadernodes/math/NumberComponent";
  import AddComponent from "../editor/shadernodes/math/AddComponent";


  import SubtractComponent from "../editor/shadernodes/math/SubtractComponent";
  import MultiplyComponent from "../editor/shadernodes/math/MultiplyComponent";
  import DivideComponent from "../editor/shadernodes/math/DivideComponent";
  import '../assets/shadernodes/shadernodes.css'
  import ShaderNodes from '../editor/shadernodes/ShaderNodes'
  import Params from '../editor/shadernodes/param/Params'
  import MaterialDefFactory from '../editor/shadernodes/MaterialDefFactory'
  import ParamComponent from '../editor/shadernodes/param/ParamComponent'
  import Inputs from '../editor/shadernodes/input/Inputs'
  import Outputs from '../editor/shadernodes/output/Outputs'
  export default {
    name: 'ShadingEdit',
    components: {ShaderNode},
    async mounted() {
      const editor = new Rete.NodeEditor('ShadingEdit@0.1.0', this.$refs.edit);
      editor.use(ConnectionPlugin);
      editor.use(VueRenderPlugin);
      editor.use(AreaPlugin);
      editor.use(HistoryPlugin);
      const engine = new Rete.Engine('ShadingEdit@0.1.0');

      editor.use(ContextMenuPlugin, {
        searchBar: false,
        delay: 1,
        searchKeep: title => true,
        items: {
          // 'Click me'(){ console.log('Works!') }
        },
        nodeItems: {
          // 'Click me'(){ console.log('Works for node!') },
          'Delete': true,
          'Clone': true
        },
        allocate(component) {
          return [ShaderNodes.filter(component)];
        },
        rename(component) {
          return component.name;
        }
      });
      ShaderNodes.registerShaderNodes(editor, engine);

      // 一个测试材质定义
      MaterialDefFactory.editMaterialDef('TestDef');
      editor.on('process nodecreated noderemoved connectioncreated connectionremoved', async () => {
        await engine.abort();
        await engine.process(editor.toJSON());
      });
      editor.on('nodecreate', node => {
        if(Params.filter(node)){
          // 添加参数
          MaterialDefFactory.addParam(node);
        }
        else if(Outputs.filterOutputStructure(node)){
          // 添加传递结构
          MaterialDefFactory.addVar(node);
        }
      });
      editor.on('noderemoved', node => {
        if(Params.filter(node)){
          // 移除参数
          MaterialDefFactory.removeParam(node);
        }
        else if(Outputs.filterOutputStructure(node)){
          // 移除传递结构
          MaterialDefFactory.removeVar(node);
        }
      });
      editor.view.resize();
      AreaPlugin.zoomAt(editor);
      editor.trigger("process");

      this.$refs.edit.firstChild.style.position = 'absolute';
    },
    methods:{
      zoom:function(e){
        // let ele = this.$refs.edit;
        // let zoom = parseInt(ele.style.zoom, 10) || 100;
        // zoom += event.wheelDelta / 12;
        // zoom = Math.min(Math.max(zoom, 60), 300);
        // if(zoom > 0) { ele.style.zoom = `${zoom}%`}
      }
    }
  }
</script>

<style scoped>
  .window{
    width: 100%;
    height: 100%;
    margin-right: 1px;
    margin-top: 1px;
  }
  .one{
    height: inherit; /* 继承.box高度 */
    background: -webkit-linear-gradient(top, transparent 20px, #000000 21px),-webkit-linear-gradient(left, transparent 20px, #000000 21px);
    background-size: 21px 21px;

  }
</style>
