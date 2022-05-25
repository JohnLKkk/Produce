<template>
    <div>
      <component v-bind:is="currentContent" v-bind="currentContentData"></component>
    </div>
</template>

<script>
  import AttrItem from '../AttrItem'
  import Utils from '../../../editor/utils/Utils'
  import ColorMath from '../../../editor/utils/ColorMath'

  export default {
    name: 'OBJ_Light',
    created () {
      // 第一次加载时刷新一次视图
      this.updateView();
    },
    methods:{
      updateView:function(){
        if(this.obj){
          // 构造数据编辑组件数据
          this.content = [];
          // 所有light都有color属性
          let lightColor = this.obj.getColor();
          this.content.push({
            // Color
            type:'LightColor',
            component:'ColorComponent',
            data:{
              type:'',
              content:ColorMath.rgb_to_hex(lightColor._m_X, lightColor._m_Y, lightColor._m_Z),
              set:(v)=>{
                this.obj.setColorRGBA(v.r, v.g, v.b, 1.0);
              }
            }
          });
        }
      }
    },
    props:{
      obj:null,
    },
    watch:{
      // 外部更新props.obj
      // 监听发生变化后更新视图
      obj:function () {
        this.updateView();
      }
    },
    components:{AttrItem},
    data(){
      return {
        content:[
        ],
      }
    },
    computed: {
      currentContentData : function(){
        return {
          content:this.content,
        };
      },
      currentContent : function () {
        return 'AttrItem';
      }
    }
  }
</script>

<style scoped>

</style>
