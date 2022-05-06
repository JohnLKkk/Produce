<template>
    <div class="window">
      <div class="topdeftoolbg2"></div>
      <div class="leadingBg">
        <v-jstree :data="data" noDots draggable allow-batch whole-row @item-click="itemClick" style="overflow-y:auto;"></v-jstree>
      </div>
    </div>
</template>

<script>
  import '../assets/tools.css'
  import '../assets/core/icons.css'

  import VJstree from 'vue-jstree'
  import {EditorContext} from '../editor/EditorContext'
  import LeadingPrinciples from '../editor/leadingPrinciples/LeadingPrinciples'
  export default {
    name: 'LeadingPrinciples',
    components: {
      VJstree
    },
    data(){
      return {
        data: [],
        leadingPrinciplesEditor: null,
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
    },
    methods: {
      itemClick (node) {
        console.log(node.model.value)
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
