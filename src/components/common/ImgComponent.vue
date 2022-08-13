<template>
  <div>
    <div :style="styleObj"><label for="content.typename" style="color: #cbcbcb;font-size: 12px;">{{ content.typename }}</label><input type="file" id="content.typename" v-model="content.content.checked"></div>
  </div>
</template>

<script>
  import '../../assets/tools.css'

  import CommandManager from '../../editor/command/CommandManager'
  import BaseCommand from '../../editor/command/BaseCommand'

  export default {
    name: 'ImgComponent',
    props:{
      content:{
        width:'100%',
        textAlign:'left',
        typename:null,
        content:{checked:false},
        set:null
      }
    },
    data(){
      return {
        styleObj:{
          textAlign:this.content.textAlign || 'left',
          margin:'0 auto',
          width:this.content.width || '40%'
        },
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
