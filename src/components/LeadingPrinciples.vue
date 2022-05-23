<template>
    <div class="window">
      <div class="topdeftoolbg2"></div>
      <div class="leadingBg" @contextmenu.prevent="showMenu($event)">
        <v-jstree ref="scenes" class="leadingBg" :data="data" noDots draggable allow-batch whole-row @item-click="itemClick" @item-drag-start="itemDragStart" @item-drop-before="itemDropBefore" style="overflow-y:auto;"></v-jstree>
        <vue-context-menu :contextMenuData="contextMenuData"
                          @addNode="addNode" @deleteObject="deleteObject"></vue-context-menu>
      </div>
    </div>
</template>

<script>
  import '../assets/tools.css'
  import '../assets/core/icons.css'

  import VJstree from 'vue-jstree'
  import {EditorContext} from '../editor/EditorContext'
  import LeadingPrinciples from '../editor/leadingPrinciples/LeadingPrinciples'
  import CommandManager from '../editor/command/CommandManager'
  import BaseCommand from '../editor/command/BaseCommand'
  import Light from 'try3d/src/Core/Light/Light'
  export default {
    name: 'LeadingPrinciples',
    components: {
      VJstree
    },
    data(){
      return {
        _temp: null,
        _tempSelect: null,
        data: [],
        leadingPrinciplesEditor: null,
        contextMenuData: {
          menuName: 'LeadingPrinciplesContextMenu',
          axis: {
            x: null,
            y: null
          },
          menulists: [{
            btnName: 'addShape...',
            children:[
              {
                btnName: 'Node',
                fnHandler: 'addNode'
              },
              {
                btnName: 'Box',
                fnHandler: 'addShape(1)'
              },
              {
                btnName: 'Sphere',
                fnHandler: 'addShape(2)'
              },
              {
                btnName: 'Plane',
                fnHandler: 'addShape(3)'
              },
              {
                btnName: 'Cylinder',
                fnHandler: 'addShape(4)'
              },
              {
                btnName: 'Teapot',
                fnHandler: 'addShape(5)'
              },
              {
                btnName: 'Torus',
                fnHandler: 'addShape(6)'
              }
            ]
          }, {
            btnName: 'addLight...',
            children: [
              {
                fnHandler: 'addDirectionalLight',
                btnName: 'DirectionalLight',
              },
              {
                fnHandler: 'addPointLight',
                btnName: 'PointLight',
              },
              {
                fnHandler: 'addSpotLight',
                btnName: 'SpotLight',
              },
              {
                fnHandler: 'addGIProbe',
                btnName: 'GIProbe',
              },
              {
                fnHandler: 'addRefProbe',
                btnName: 'RefProbe',
              }
            ]
          },{
            btnName: 'delete',
            fnHandler: 'deleteObject'
          }]
        }
      }
    },
    beforeCreate () {
      let self = this;
      EditorContext.getInstance().registerEvent(EditorContext.S_EVENT_SCENE_LOAD_END, ()=>{
        self.data = self.leadingPrinciplesEditor.getData();
      });
    },
    created () {
      // created函数表明data结构已经创建完毕
      // 所以在这里赋值才有效
      this.leadingPrinciplesEditor = new LeadingPrinciples();

      this.$watch('contentMenu.visible', (v, o)=>{
        if (v) {
          document.body.addEventListener('click', this.closeMenu);
        } else {
          document.body.removeEventListener('click', this.closeMenu);
        }
      });
    },
    methods: {
      // 右键菜单----------------------------------------↓
      showMenu (e) {
        e.preventDefault();
        let x = e.clientX
        let y = e.clientY
        // Get the current location
        this.contextMenuData.axis = {
          x, y
        }

        // 触发一次鼠标左键点击,模拟选中object操作
        const ev = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        });
        document.dispatchEvent(ev);
      },
      addNode(){
        // 创建一个随机名称节点
        let parentNode = this.getCurrentSelectObject();
        if(parentNode){
          let n = this.leadingPrinciplesEditor.newNode();
          CommandManager.getInstance().executeCommand(new BaseCommand({
            redo: (v)=>{v.parentNode.addChildren(v.node);this.data = this.leadingPrinciplesEditor.getData();},
            undo: (v)=>{v.parentNode.removeChildren(v.node);this.data = this.leadingPrinciplesEditor.getData();},
            redoData: {parentNode, node:n},
            undoData: {parentNode, node:n}
          }));
        }
      },
      deleteObject(){
        let editorContext = EditorContext.getInstance();
        if(editorContext.getRenderer() && editorContext.getRenderer()._scene){
          let sceneRoot = editorContext.getRenderer()._scene.getSceneNode(0);
          let currentSelectObject = this.getCurrentSelectObject();
          if(currentSelectObject != sceneRoot){
            // 删除操作
            let n = currentSelectObject;
            let parentNode = n.getParent();
            CommandManager.getInstance().executeCommand(new BaseCommand({
              redo: (v)=>{
                v.parentNode.removeChildren(v.node);this.data = this.leadingPrinciplesEditor.getData();
                if(v.node instanceof Light){
                  v.node.disable();
                }
                },
              undo: (v)=>{
                v.parentNode.addChildren(v.node);this.data = this.leadingPrinciplesEditor.getData();
                if(v.node instanceof Light){
                  v.node.enable();
                }
              },
              redoData: {parentNode, node:n},
              undoData: {parentNode, node:n}
            }));
          }
        }
      },
      // 右键菜单----------------------------------------↑
      getCurrentSelectObject(){
        if(!this._tempSelect){
          // 则设置为根节点
          let editorContext = EditorContext.getInstance();
          if(editorContext.getRenderer() && editorContext.getRenderer()._scene){
            // 这里暂时只读取一个scene,后续可以增加为多个scene
            this._tempSelect = editorContext.getRenderer()._scene.getSceneNode(0);
          }
        }
        return this._tempSelect;
      },
      itemClick (node) {
        // console.log(node.model.value)
        EditorContext.getInstance().notifyEvent(LeadingPrinciples.S_LEADINGPRINCIPLES_EVENT_SELECTED, [node.model.value]);
        this._tempSelect = node.model.value;
      },
      itemDragStart (node) {
        // console.log('dragStart:',node);
        // 记录父节点
        if(node.$parent && node.$parent.model){
          this._temp = {parent:node.$parent.model.value, node:node.model.value};
        }
      },
      changeParent(preParent, nextParent, node){
        // 从当前父节点移除该节点
        preParent.removeChildren(node);
        // 将其添加到新的父节点
        nextParent.addChildren(node);
        // 更新数据结构
        this.data = this.leadingPrinciplesEditor.getData();
      },
      itemDropBefore (node) {
        // 调整父节点
        // console.log('dragEnd:',node);
        // 说明是合法节点
        if(this._temp != null && (this._temp.parent != node.model.value)){
          let preParent = this._temp.parent;
          let nextParent = node.model.value;
          let n = this._temp.node;
          CommandManager.getInstance().executeCommand(new BaseCommand({
            redo: (v)=>{this.changeParent(v.preParent, v.nextParent, v.node);},
            undo: (v)=>{this.changeParent(v.preParent, v.nextParent, v.node);},
            redoData: {preParent, nextParent, node:n},
            undoData: {preParent:nextParent, nextParent:preParent, node:n}
          }));
        }
        else{
          // 同个父节点,不做任何操作
          // console.log('移动失败');
        }
        // 重置
        this._temp = null;
      },
    }
  }
</script>

<style scoped>
  .window{
    width: 100%;
    height: 100%;
    margin-left: 1px;
    margin-bottom: 1px;
  }
  .leadingBg{
    color: #c2c2c2;
    font-style: normal;
    border-radius: 0 0 10px 10px;
    width: 100%;
    min-height: 80%;
    overflow-y: auto;
    height: calc(100% - 20px);

    background: -webkit-linear-gradient(top, transparent 20px, rgba(40, 40, 40, 0.29) 21px);
    background-color: rgba(45, 45, 45, 0.2);
    background-size: 21px 42px;
  }
  /*滚动条样式*/
  .leadingBg::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  .leadingBg::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .leadingBg::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
</style>
