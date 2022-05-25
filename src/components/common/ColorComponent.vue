<template>
  <div v-show="content">
    <span v-show="content.type" style="color: #cbcbcb;font-size: 12px;">{{content.type}}</span>
    <input type="color" v-model="content.content">
  </div>
</template>

<script>
  import ColorMath from '../../editor/utils/ColorMath'
  import CommandManager from '../../editor/command/CommandManager'
  import BaseCommand from '../../editor/command/BaseCommand'
  import Utils from '../../editor/utils/Utils'

  export default {
    name: 'ColorComponent',
    props: {
      content:{
        type:null,
        content:null,
        set:null
      }
    },
    data () {
      return {
        isCommand : true
      }
    },
    created () {
      this.$watch('content.content', (v, o)=>{
        if(this.isCommand){
          let oldValue = ColorMath.hex_to_rgb(o.replace('#', '0x'));
          let newValue = ColorMath.hex_to_rgb(v.replace('#', '0x'));
          CommandManager.getInstance().executeCommand(new BaseCommand({
            redo: (v)=>{this.content.set(v);this.isCommand = false;this.content.content = ColorMath.rgb_to_hex(v.r, v.g, v.b);},
            undo: (v)=>{this.content.set(v);this.isCommand = false;this.content.content = ColorMath.rgb_to_hex(v.r, v.g, v.b);},
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
