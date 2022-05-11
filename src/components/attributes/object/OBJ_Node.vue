<template>
  <div>
    <component v-bind:is="currentContent" v-bind="currentContentData"></component>
  </div>
</template>

<script>
  import '../../../assets/tools.css'
  import AttrItem from '../AttrItem'
  import MoreMath from 'try3d/src/Core/Math3d/MoreMath'
  export default {
    name: 'OBJ_Node',
    created () {
      // 第一次加载时刷新一次视图
      this.updateView();
    },
    mounted() {
    },
    methods:{
      updateView:function(){
        if(this.obj){
          // 构造数据编辑组件数据
          this.content = [];
          // 对于Node,我们只允许编辑translation,rotation以及scale
          let angles = [];
          this.obj.getLocalRotation().toAngles(angles);
          this.content.push({
            // Transform
            type:'Transform',
            component:'TransformComponent',
            data:[
              {
                type:'translation',
                content:{
                  x:this.obj.getLocalTranslation()._m_X,
                  y:this.obj.getLocalTranslation()._m_Y,
                  z:this.obj.getLocalTranslation()._m_Z
                },
                set:(v)=>{
                  this.obj.setLocalTranslationXYZ(v.x, v.y, v.z);
                }
              },
              {
                type:'rotation',
                content:{
                  x:MoreMath.toAngle(angles[0]).toFixed(2),
                  y:MoreMath.toAngle(angles[1]).toFixed(2),
                  z:MoreMath.toAngle(angles[2]).toFixed(2)
                },
                set:(v)=>{
                  this.obj.setLocalRotationFromEuler(MoreMath.toRadians(v.x), MoreMath.toRadians(v.y), MoreMath.toRadians(v.z));
                }
              },
              {
                type:'scale',
                content:{
                  x:this.obj.getLocalScale()._m_X,
                  y:this.obj.getLocalScale()._m_Y,
                  z:this.obj.getLocalScale()._m_Z
                },
                set:(v)=>{
                  this.obj.setLocalScaleXYZ(v.x, v.y, v.z);
                }
              }
            ]
          });


          // 剔除模式
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
  .newslist ul li p {
    font-size: 14px;
    color: #555;
    line-height: 25px;
    height: 50px;
    overflow: hidden;
    transition: height .3s;
  }
</style>
