<template>
  <div style="margin: 5px 0px">
    <div v-show="content.typename" style="padding-left:15px;color: #cbcbcb;font-size: 12px;text-align: left">{{content.typename}}</div>

    <span style="color: #cbcbcb;font-size: 12px;" v-for="(item, key) in content.content"><input class="component_input" ref="number" type="number" v-model='content.content[key]'><br/></span>
  </div>
</template>

<script>
  import '../../assets/tools.css'
  import CommandManager from '../../editor/command/CommandManager'
  import BaseCommand from '../../editor/command/BaseCommand'
  import Utils from '../../editor/utils/Utils'
  import CommandFactory from '../../editor/command/CommandFactory'
  import ColorMath from '../../editor/utils/ColorMath'
  export default {
    name: 'NumberComponent',
    props: {
      cl:null,
      content: {
        typename:null,
        content:null,
        set: null
      },
    },
    data(){
      return {
        isCommand : true
      }
    },
    methods:{

    },
    computed: {
    },
    created () {
      // 绑定属性编辑
      for(let key in this.content.content){

        this.$watch('content.content.' + key, (v, o)=>{
          // 以便在ObjControl中可以同步操作,防止过多的command
          // 只记录down和up的command
          if(!CommandFactory.isCommand()){
          }
          else{
            // old Value
            let oldValue = Utils.copyObj(this.content.content, key, Number(o));
            // new Value
            let newValue = Utils.copyObj(this.content.content);
            if(this.isCommand){
              CommandManager.getInstance().executeCommand(new BaseCommand({
                redo: (v)=>{this.content.set(v);this.isCommand = false;this.content.content = Utils.copyObj(v);},
                undo: (v)=>{this.content.set(v);this.isCommand = false;this.content.content = Utils.copyObj(v);},
                redoData: newValue,
                undoData: oldValue
              }));
            }
            this.isCommand = true;
            // if(this.set){
            //   this.set(this.content);
            // }
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
