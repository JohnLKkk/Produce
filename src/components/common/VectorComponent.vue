<template>
  <div>
    <span style="color: #cbcbcb;font-size: 12px;" v-for="(item, key) in content">{{key}}<input class="component_input" ref="number" type="number" v-model='content[key]'><br/></span>
  </div>
</template>

<script>
  import '../../assets/tools.css'
  import CommandManager from '../../editor/command/CommandManager'
  import BaseCommand from '../../editor/command/BaseCommand'
  import Utils from '../../editor/utils/Utils'
  import CommandFactory from '../../editor/command/CommandFactory'
  export default {
    name: 'VectorComponent',
    props: {
      content: null,
      set: null
    },
    data(){
      return {
        isCommand : true
      }
    },
    methods:{

    },
    created () {
      // 绑定属性编辑
      for(let key in this.content){
        this.$watch('content.' + key, (v, o)=>{
          // 以便在ObjControl中可以同步操作,防止过多的command
          // 只记录down和up的command
          if(!CommandFactory.isCommand()){
          }
          else{
            // old Value
            let oldValue = Utils.copyObj(this.content, key, Number(o));
            // new Value
            let newValue = Utils.copyObj(this.content);
            if(this.isCommand){
              CommandManager.getInstance().executeCommand(new BaseCommand({
                redo: (v)=>{this.set(v);this.isCommand = false;this.content = Utils.copyObj(v);},
                undo: (v)=>{this.set(v);this.isCommand = false;this.content = Utils.copyObj(v);},
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
