<template>
  <div
    style="height: 100%;width: 100%;position:relative;display:flow;font-size: 15px;color: white"
  >
    <component v-bind:is="currentContent" v-bind="currentContentData"></component>
  </div>
</template>

<script>
  import AttrItem from '../AttrItem'
  import ColorMath from '../../../editor/utils/ColorMath'
  import PostFilterFactory from '../../../editor/common/PostFilterFactory'
  import {EditorContext} from '../../../editor/EditorContext'
  import Try3d from 'try3d/src/Try3d'

  export default {
    name: 'RendererProperty',
    beforeCreate () {
      EditorContext.getInstance().registerEvent(EditorContext.S_EVENT_SCENE_LOAD_END, ()=>{
        // 第一次加载时刷新一次视图
        this.updateView();
        this._first = true;
      });
    },
    created () {
      if(!this._first)
        this.updateView();
    },
    methods:{
      updateView:function(){
        this.obj = PostFilterFactory.getPostFilterList();
        if(!this.obj){
          // 获取所有后处理器
          let firstScene = EditorContext.getScene(0);
          let filterCamera = firstScene.getComponent('mainCamera');
          if(!this.obj){
            this.obj = {};
          }

          if(!this.obj['fogFilter']){
            this.obj['fogFilter'] = PostFilterFactory.createFogFilter(firstScene, filterCamera);
            this.obj['fogFilter'].disable();
          }
          if(!this.obj['dofFilter']){
            this.obj['dofFilter'] = PostFilterFactory.createDofFilter(firstScene, filterCamera);
            this.obj['dofFilter'].disable();
          }
          if(!this.obj['bloomFilter'])
          {
            this.obj['bloomFilter'] = PostFilterFactory.createBloomFilter(firstScene, filterCamera);
            this.obj['bloomFilter'].disable();
          }
          // 加载自定义filter...
          PostFilterFactory.postFilterListRefresh(this.obj);
        }

        // 设置可用的后处理
        this.content = [];
        // 由于js上下文切换问题,这里使用驻留上下文变量
        let bloomFilter = this.obj['bloomFilter'];
        this.content.push({
          // Bloom
          type:'Bloom',
          component:'CombinationComponent',
          data:[
            {
              component:'BoolComponent',
              data:{
                typename:'enabled',
                content:{checked:bloomFilter.isEnable()},
                set:(v)=>{
                  if(v){
                    bloomFilter.enable();
                  }
                  else{
                    bloomFilter.disable();
                  }
                }
              }
            },
            {
              component:'TransformComponent',
              data:[
                {
                  type:'',
                  content:{
                    extractThreshold:0.2
                  },
                  set:(v)=>{
                    bloomFilter.getMaterial().setParam('extractThreshold', new Try3d.FloatVars().valueOf(v.extractThreshold));
                  }
                },
                {
                  type:'',
                  content:{
                    exposurePower:2.0
                  },
                  set:(v)=>{
                    bloomFilter.getMaterial().setParam('exposurePower', new Try3d.FloatVars().valueOf(v.exposurePower));
                  }
                },
                {
                  type:'',
                  content:{
                    bloomIntensity:0.25
                  },
                  set:(v)=>{
                    bloomFilter.getMaterial().setParam('bloomIntensity', new Try3d.FloatVars().valueOf(v.bloomIntensity));
                  }
                },
                {
                  type:'',
                  content:{
                    blurScale:2.0
                  },
                  set:(v)=>{
                    bloomFilter.getMaterial().setParam('blurScale', new Try3d.FloatVars().valueOf(v.blurScale));
                  }
                },
              ]
            }
          ]
        });
        let fogFilter = this.obj['fogFilter'];
        this.content.push({
          // Fog
          type:'Fog',
          component:'CombinationComponent',
          data:[
            {
              component:'BoolComponent',
              data:{
                typename:'enabled',
                content:{checked:fogFilter.isEnable()},
                set:(v)=>{
                  if(v){
                    fogFilter.enable();
                  }
                  else{
                    fogFilter.disable();
                  }
                }
              }
            },
            {
              component:'TransformComponent',
              data:[
                {
                  type:'',
                  content:{
                    fogNear:250
                  },
                  set:(v)=>{
                    fogFilter.getMaterial().setParam('fogNear', new Try3d.FloatVars().valueOf(v.fogNear));
                  }
                },
                {
                  type:'',
                  content:{
                    fogFar:500
                  },
                  set:(v)=>{
                    fogFilter.getMaterial().setParam('fogFar', new Try3d.FloatVars().valueOf(v.fogFar));
                  }
                },
                {
                  type:'',
                  content:{
                    fogDensity:1.0
                  },
                  set:(v)=>{
                    fogFilter.getMaterial().setParam('fogDensity', new Try3d.FloatVars().valueOf(v.fogDensity));
                  }
                },
              ]
            },
            {
              component:'ColorComponent',
              data:{
                type:'fogColor',
                content:ColorMath.rgb_to_hex(1.0, 1.0, 1.0),
                set:(v)=>{
                  fogFilter.getMaterial().setParam('fogColor', new Try3d.Vec4Vars().valueFromXYZW(v.r, v.g, v.b, 1.0));
                }
              }
            },
            {
              component:'SelectComponent',
              data:{
                selected:'Default',
                typename:'type',
                content:[
                  {text:'LinearFog', value:'LinearFog'},
                  {text:'Default', value:'Default'},
                ],
                set:(v)=>{
                  fogFilter.getMaterial().selectTechnology((v == 'Default') ? '' : v);
                }
              }
            }
          ]
        });
        let dofFilter = this.obj['dofFilter'];
        this.content.push({
          type:'Dof',
          component:'CombinationComponent',
          data:[
            {
              component:'BoolComponent',
              data:{
                typename:'enabled',
                content:{checked:dofFilter.isEnable()},
                set:(v)=>{
                  if(v){
                    dofFilter.enable();
                  }
                  else{
                    dofFilter.disable();
                  }
                }
              }
            },
            {
              component:'TransformComponent',
              data:[
                {
                  type:'',
                  content:{
                    focusDistance:50
                  },
                  set:(v)=>{
                    dofFilter.getMaterial().setParam('focusDistance', new Try3d.FloatVars().valueOf(v.focusDistance));
                  }
                },
                {
                  type:'',
                  content:{
                    focusRange:10
                  },
                  set:(v)=>{
                    dofFilter.getMaterial().setParam('focusRange', new Try3d.FloatVars().valueOf(v.focusRange));
                  }
                },
                {
                  type:'',
                  content:{
                    hScale:1.0
                  },
                  set:(v)=>{
                    dofFilter.getMaterial().setParam('hScale', new Try3d.FloatVars().valueOf(v.hScale));
                  }
                },
                {
                  type:'',
                  content:{
                    vScale:1.0
                  },
                  set:(v)=>{
                    dofFilter.getMaterial().setParam('vScale', new Try3d.FloatVars().valueOf(v.vScale));
                  }
                },
              ]
            }
          ]
        });
      }
    },
    props:{
      obj:null,
    },
    watch:{
      // 外部更新props.obj
      // 监听发生变化后更新视图
      // obj:function () {
      //   this.updateView();
      // }
    },
    components:{AttrItem},
    data(){
      return {
        _first:false,
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
