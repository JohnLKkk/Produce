<template>
  <div>
    <component v-bind:is="currentContent" v-bind="currentContentData"></component>
  </div>
</template>

<script>
  import '../../../assets/tools.css'
  import AttrItem from '../AttrItem'
  import MoreMath from 'try3d/src/Core/Math3d/MoreMath'
  import Try3d from 'try3d/src/Try3d'
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
          // 对于Node,我们只允许编辑Transform,Visibility culling以及shadow
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
          this.content.push({
            // Visibility culling
            type:'Visibility Culling',
            component:'SelectComponent',
            data:{
              selected:this.obj.getFilterFlag(),
              typename:'mode',
              content:[
                {text:'dynamic', value:Try3d.Node.S_DYNAMIC},
                {text:'always', value:Try3d.Node.S_ALWAYS},
                {text:'never', value:Try3d.Node.S_NEVER}
              ],
              set:(v)=>{
                this.obj.setFilterFlag(v);
              }
            }
          });

          // Shadow模式
          this.content.push({
            // Shadow
            type:'Shadow',
            component:'BoolGroupComponent',
            data:[
              {
                typename:'cast shadow',
                content:{checked:this.obj.isCastShadow()},
                set:(v)=>{
                  this.obj.castShadow(v);
                }
              },
              {
                typename:'receive shadow',
                content:{checked:this.obj.isReceiveShadow()},
                set:(v)=>{
                  this.obj.receiveShadow(v);
                }
              }
            ]
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
  .newslist ul li p {
    font-size: 14px;
    color: #555;
    line-height: 25px;
    height: 50px;
    overflow: hidden;
    transition: height .3s;
  }
</style>
