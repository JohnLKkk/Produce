<template>
  <div v-show="content">
    <span v-show="content.typename" style="color: #cbcbcb;font-size: 12px;">{{content.typename}}</span>
    <select v-model="content.selected" class="component_select">
      <option v-for="option in content.content" v-bind:value="option.value">
        {{ option.text }}
      </option>
    </select>
  </div>
</template>

<script>
  import '../../assets/tools.css'

  import CommandManager from '../../editor/command/CommandManager'
  import BaseCommand from '../../editor/command/BaseCommand'

  export default {
    name: 'SelectComponent',
    props: {
      content: {
        content:null,
        selected:null,
        set:null
      },
    },
    data(){
      return {
        isCommand : true
      }
    },
    created () {
      this.$watch('content.selected', (v, o)=>{
        // old Value
        let oldValue = o;
        // new Value
        let newValue = v;
        if(this.isCommand){
          CommandManager.getInstance().executeCommand(new BaseCommand({
            redo: (v)=>{this.content.set(v);this.isCommand = false;this.content.selected = v;},
            undo: (v)=>{this.content.set(v);this.isCommand = false;this.content.selected = v;},
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
