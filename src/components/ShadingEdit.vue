<template>
  <div class="window">
    <div class="topdeftoolbg2">
<!--      currentMatDef-->
      <span style="color: #cbcbcb;font-size: 12px;">matDef</span>
      <select v-model="selectedCurrentMatDef" class="component_select">
        <option v-for="option in currentMatDef" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>
<!--      currentTechnology-->
      <span v-show="selectedCurrentMatDef" style="color: #cbcbcb;font-size: 12px;">tech</span>
      <select v-show="selectedCurrentMatDef" v-model="selectedCurrentTechnology" class="component_select">
        <option v-for="option in currentTechnology" v-bind:value="option.value">
          {{ option.text }}
        </option>
      </select>
      <button style="border: 0;background-color: gray" v-on:click="addMatDef">+</button>
    </div>
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
  import CommandManager from '../editor/command/CommandManager'
  import BaseCommand from '../editor/command/BaseCommand'
  import Utils from '../editor/utils/Utils'
  export default {
    name: 'ShadingEdit',
    components: {ShaderNode},
    data(){
      return {
        currentMatDef:[],
        currentTechnology:[],
        selectedCurrentMatDef:null,
        selectedCurrentTechnology:null,
        _editor:null,
        _engine:null,
      }
    },
    async mounted() {
      const editor = new Rete.NodeEditor('ShadingEdit@0.1.0', this.$refs.edit);
      editor.use(ConnectionPlugin);
      editor.use(VueRenderPlugin);
      editor.use(AreaPlugin);
      editor.use(HistoryPlugin);
      const engine = new Rete.Engine('ShadingEdit@0.1.0');
      this._editor = editor;
      this._engine = engine;

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
    created () {
      this.$watch('selectedCurrentMatDef', async (v, o)=>{
        let cmt = null;
        for(let i = 0;i < this.currentMatDef.length;i++){
          if(this.currentMatDef[i].text == v){
            cmt = this.currentMatDef[i];
            break;
          }
        }
        this.currentTechnology = v ? cmt.currentTechnology : [];
        this.selectedCurrentTechnology = this.currentTechnology[0].text;
        if(o){
          let editMatDef = MaterialDefFactory.getMaterialDef();
          if(editMatDef){
            editMatDef.meta = this._editor.toJSON();
          }
        }
        let meta = '{}';
        meta = MaterialDefFactory.editMaterialDef(v);
        meta = meta.meta;
        await this._editor.fromJSON(meta);
        // // old Value
        // let oldValue = o;
        // // new Value
        // let newValue = v;
        // if(this.isCommand){
        //   CommandManager.getInstance().executeCommand(new BaseCommand({
        //     redo: (v)=>{this.content.set(v);this.isCommand = false;this.content.selected = v;},
        //     undo: (v)=>{this.content.set(v);this.isCommand = false;this.content.selected = v;},
        //     redoData: newValue,
        //     undoData: oldValue
        //   }));
        // }
        // this.isCommand = true;
      });
      this.$watch('selectedCurrentTechnology', (v, o)=>{
        // // old Value
        // let oldValue = o;
        // // new Value
        // let newValue = v;
        // if(this.isCommand){
        //   CommandManager.getInstance().executeCommand(new BaseCommand({
        //     redo: (v)=>{this.content.set(v);this.isCommand = false;this.content.selected = v;},
        //     undo: (v)=>{this.content.set(v);this.isCommand = false;this.content.selected = v;},
        //     redoData: newValue,
        //     undoData: oldValue
        //   }));
        // }
        // this.isCommand = true;
      });
    },
    methods:{
      addMatDef:function(e){
        let newMatDef = Utils.nextId() + '_mat';
        let i = this.currentMatDef.length + 1;
        this.currentMatDef.push({i, value:newMatDef, text:newMatDef, currentTechnology:[{text:'defaultTechnology', value:'defaultTechnology'}]});
        // // 添加新的matDef
        // MaterialDefFactory.editMaterialDef(newMatDef);
      },
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
