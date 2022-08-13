<template>
  <div style="padding: 5px 0px">
    <div v-show="content.typename" style="color: #cbcbcb;font-size: 12px;text-align: left"><input style="max-width: 25px;max-height: 20px;width: 25px;padding: 0px;margin: 5px 5px" type="color" v-model="content.color">{{content.typename}}</div>

    <span style="color: #cbcbcb;font-size: 12px;" v-for="(item, key) in content.content">{{key}}<input class="component_input" ref="number" type="number" v-model='content.content[key]'><br/></span>
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
    name: 'VectorColorComponent',
    props: {
      cl:null,
      content: {
        color:null,
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
      currentColor:function(){
        let cl = this.content.content;
        this.cl = ColorMath.rgbToHex(Number(cl.R), Number(cl.G), Number(cl.B));
        return this.cl;
      }
    },
    created () {
      // 绑定属性编辑
      this.$watch('content.color', (v, o)=>{
        let rgb = ColorMath.hexToRgba(v);
        this.content.content.R = rgb.r.toFixed(2);
        this.content.content.G = rgb.g.toFixed(2);
        this.content.content.B = rgb.b.toFixed(2);
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
