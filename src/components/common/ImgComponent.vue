<template>
  <div style="padding: 5px 0px">
    <div :style="styleObj"><label style="color: #cbcbcb;font-size: 12px;">{{ content.typename }}</label><br/><img ref="img_img" style="width: 100px;height: 100px;background-color: black;display: none"v-on:click="doInput"/><input type="file" ref="img_file" accept=".png,.jpg,.jpeg,image/png,image/jpg,image/jpeg" style="display: none"><canvas ref="img_cvs" width="100px" height="100px" style="background-color: black;display: block;border: white solid 1px"v-on:click="doInput"></canvas></div>
  </div>
</template>

<script>
  import '../../assets/tools.css'

  import CommandManager from '../../editor/command/CommandManager'
  import BaseCommand from '../../editor/command/BaseCommand'
  import CommandFactory from "../../editor/command/CommandFactory";

  export default {
    name: 'ImgComponent',
    props:{
      content:{
        width:'100%',
        textAlign:'left',
        typename:null,
        content:{img:null},
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
    methods:{
      readFile:function(){
        let inputObj = this.$refs.img_file;
        let file = inputObj.files[0];//获取input输入的图片
        if(!/image\/\w+/.test(file.type)){
          alert("请确保文件为图像类型");
          return false;
        }//判断是否图片，在移动端因为浏览器对调用file类型处理不一样，虽然加了accept = 'image/*'，可是还要再次判断
        let reader = new FileReader();
        reader.readAsDataURL(file);//转化成base64数据类型
        reader.onload = ()=>{
          this.drawToCanvas(reader.result);
        }
      },
      doInput:function(id){
        let inputObj = this.$refs.img_file;
        console.log('inputObj:',inputObj);
        inputObj.addEventListener('change',this.readFile,false);
        inputObj.type = 'file';
        inputObj.accept = 'image/*';
        inputObj.click();
      },
      drawToCanvas:function(imgData){
        this.$refs.img_img.onload = ()=>{
          if(this.isCommand){
            this.content.content.img = imgData;
            this.content.set({img:imgData});
          }
          else
            this.isCommand = true;
          let cvs = this.$refs.img_cvs;
          let ctx = cvs.getContext('2d');
          ctx.drawImage(this.$refs.img_img,0,0,cvs.width,cvs.height);
          // // old Value
          // let oldValue = {img:this.content.content.img};
          // this.content.content.img = imgData;
          // // new Value
          // let newValue = {img:this.content.content.img};
          // if(!CommandFactory.isCommand()){
          // }
          // else{
          //   CommandManager.getInstance().executeCommand(new BaseCommand({
          //     redo: (v)=>{this.content.set(v);this.isCommand = false;this.content.content.img = v;},
          //     undo: (v)=>{this.content.set(v);this.isCommand = false;this.content.content.img = v;},
          //     redoData: newValue,
          //     undoData: oldValue
          //   }));
          //   this.isCommand = true;
          // }
        };
        this.$refs.img_img.src = imgData;
        // let cvs = this.$refs.img_cvs;
        // let ctx = cvs.getContext('2d');
        // let img = new Image;
        // img.src = imgData;
        // img.onload = function(){//必须onload以后再画
        //   ctx.drawImage(img,0,0,cvs.width,cvs.height);
        //   // strDataURI = cvs.toDataURL();//获取canvas base64数据
        // }
      }
    },
    mounted() {
      if(this.content.content.img){
        this.$refs.img_img.src = this.content.content.img;
      }
    },
    created () {
      this.$watch('content.content.img', (v, o)=>{
        if(v)
        {
          this.isCommand = false;
          this.drawToCanvas(v);
        }
        else{
          // 清楚当前缓存的图片
          if(this.$refs.img_img){
            let black = this.$refs.img_cvs;
            black.widtd = 100;
            black.height = 100;
            black.style.width = '100px';
            black.style.height = '100px';
            let blackContext = black.getContext('2d');
            blackContext.fillStyle = '#000000ff';
            blackContext.fillRect(0, 0, 100, 100);
            // this.$refs.img_img.src = black.toDataURL('image/png');
          }
        }
      });
      // this.$watch('content.content.img', (v, o)=>{
      //   // old Value
      //   let oldValue = {img:o};
      //   // new Value
      //   let newValue = {img:v};
      //   if(!CommandFactory.isCommand()){
      //   }
      //   else{
      //     CommandManager.getInstance().executeCommand(new BaseCommand({
      //       redo: (v)=>{this.content.set(v);this.isCommand = false;this.content.content.img = v;},
      //       undo: (v)=>{this.content.set(v);this.isCommand = false;this.content.content.img = v;},
      //       redoData: newValue,
      //       undoData: oldValue
      //     }));
      //     this.isCommand = true;
      //   }
      // });
    }
  }
</script>

<style scoped>

</style>
