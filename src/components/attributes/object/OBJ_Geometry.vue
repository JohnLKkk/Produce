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
  import {EditorContext} from '../../../editor/EditorContext'
  import Viewer from '../../../editor/viewer/Viewer'
  export default {
    name: 'OBJ_Geometry',
    created () {
      // 第一次加载时刷新一次视图
      this.updateView();
      EditorContext.getInstance().registerEvent(Viewer.S_VIEWER_OBJECT_UPDATE, ()=>{
        this.updateView();
      });
    },
    mounted() {
    },
    methods:{
      updateView:function(){
        if(this.obj){
          // 构造数据编辑组件数据
          this.content = [];
          // 对于Geometry,我们只允许编辑Transform,Visibility culling,Shadow以及绘制状态(这里比较粗略)
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

          // 绘制模式
          let type = this.obj.getType();
          // 早期没有统一封装导致的
          if(type == 'Sky'){
            // 对于Sky,仅展示一项
            this.content.push({
              type: 'Queue Bucket',
              component: 'SelectComponent',
              data: {
                selected:null,
                typename:'bucket',
                content:[
                  {text:'sky', value:null},
                ],
                set:(v)=>{
                  // 不做任何操作;
                }
              }
            });
          }
          else{
            this.content.push({
              type: 'Queue Bucket',
              component: 'SelectComponent',
              data: {
                selected:this.obj.isOpaque(),
                typename:'bucket',
                content:[
                  {text:'opaque', value:true},
                  {text:'translucent', value:false}
                ],
                set:(v)=>{
                  // 早期设计导致的缺陷,正常来说这里应该是队列标记
                  if(v){
                    this.obj.setOpaque();
                  }
                  else{
                    this.obj.setTranslucent();
                  }
                }
              }
            });
          }
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
