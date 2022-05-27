<template>
  <div>
    <div style="text-align: left;margin: 0 auto;width: 40%"><input type="checkbox" id="content.typename" v-model="content.content.checked"><label for="content.typename" style="color: #cbcbcb;font-size: 12px;">{{ content.typename }}</label></div>
  </div>
</template>

<script>
  import '../../assets/tools.css'

  import CommandManager from '../../editor/command/CommandManager'
  import BaseCommand from '../../editor/command/BaseCommand'

  export default {
    name: 'BoolComponent',
    props:{
      content:{
        typename:null,
        content:{checked:false},
        set:null
      }
    },
    data(){
      return {
        isCommand : true
      }
    },
    created () {
      this.$watch('content.content.checked', (v, o)=>{
        // old Value
        let oldValue = o;
        // new Value
        let newValue = v;
        if(this.isCommand){
          CommandManager.getInstance().executeCommand(new BaseCommand({
            redo: (v)=>{this.content.set(v);this.isCommand = false;this.content.content.checked = v;},
            undo: (v)=>{this.content.set(v);this.isCommand = false;this.content.content.checked = v;},
            redoData: newValue,
            undoData: oldValue
          }));
        }
        this.isCommand = true;
      });
    }
  }
</script>

<style scoped>

</style>
