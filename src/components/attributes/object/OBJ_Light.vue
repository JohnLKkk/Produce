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
          // 根据光源类型设置不同属性编辑
          switch(this.obj.getType()){
            case 'DirectionalLight':
              this.content.push({
                // Direction
                type:'Direction',
                component:'TransformComponent',
                data:[
                  {
                    content:{
                      x:this.obj.getDirection()._m_X,
                      y:this.obj.getDirection()._m_Y,
                      z:this.obj.getDirection()._m_Z
                    },
                    set:(v)=>{
                      this.obj.setDirectionXYZ(v.x, v.y, v.z);
                    }
                  }
                ]
              });
              break;
            case 'PointLight':
              this.content.push({
                // Position
                type:'Position',
                component:'TransformComponent',
                data:[
                  {
                    content:{
                      x:this.obj.getPosition()._m_X,
                      y:this.obj.getPosition()._m_Y,
                      z:this.obj.getPosition()._m_Z
                    },
                    set:(v)=>{
                      this.obj.setPositionXYZ(v.x, v.y, v.z);
                    }
                  }
                ]
              });
              this.content.push(
                {
                  // Radius
                  type:'Radius',
                  component:'TransformComponent',
                  data:[
                    {
                      content:{r:this.obj.getRadius()},
                      set:(v)=>{
                        this.obj.setRadius(v.r);
                      }
                    }
                  ]
                }
              );
              break;
            case 'SpotLight':
              this.content.push({
                // Position
                type:'Position',
                component:'TransformComponent',
                data:[
                  {
                    content:{
                      x:this.obj.getPosition()._m_X,
                      y:this.obj.getPosition()._m_Y,
                      z:this.obj.getPosition()._m_Z
                    },
                    set:(v)=>{
                      this.obj.setPositionXYZ(v.x, v.y, v.z);
                    }
                  }
                ]
              });
              this.content.push({
                // Direction
                type:'Direction',
                component:'TransformComponent',
                data:[
                  {
                    content:{
                      x:this.obj.getDirection()._m_X,
                      y:this.obj.getDirection()._m_Y,
                      z:this.obj.getDirection()._m_Z
                    },
                    set:(v)=>{
                      this.obj.setDirectionXYZ(v.x, v.y, v.z);
                    }
                  }
                ]
              });
              this.content.push({
                // SpotRange, InnerAngle, OuterAngle
                type:'Spot Properties',
                component:'TransformComponent',
                data:[
                  {
                    content:{
                      spotRange:this.obj.getSpotRange(),
                      innerAngle:Try3d.MoreMath.toAngle(this.obj.getInnerAngle()),
                      outerAngle:Try3d.MoreMath.toAngle(this.obj.getOuterAngle())
                    },
                    set:(v)=>{
                      this.obj.setSpotRange(v.spotRange);
                      this.obj.setInnerAngle(Try3d.MoreMath.toRadians(v.innerAngle));
                      this.obj.setOuterAngle(Try3d.MoreMath.toRadians(v.outerAngle));
                    }
                  }
                ]
              });
              break;
          }
          // 阴影部分
          switch (this.obj.getType()) {
            case 'DirectionalLight':
              this.content.push({
                type:'Shadow',
                component:'CombinationComponent',
                data:[
                  {
                    component:'BoolComponent',
                    data:{
                      typename:'proShadow',
                      content:{checked:this.obj.isProShadow()},
                      set:(v)=>{
                        this.obj.proShadow(v);
                      }
                    }
                  },
                  // {
                  //   component:'SelectComponent',
                  //   data:{
                  //     selected:'4',
                  //     typename:'shadow split num',
                  //     content:[
                  //       {text:'1', value:1},
                  //       {text:'2', value:2},
                  //       {text:'3', value:3},
                  //       {text:'4', value:4}
                  //     ],
                  //     set:(v)=>{
                  //       this.obj.setShadowSplitNum(v);
                  //     }
                  //   }
                  // },
                  // {
                  //   component:'SelectComponent',
                  //   data:{
                  //     selected:1024,
                  //     typename:'shadow map size',
                  //     content:[
                  //       {text:'512x512', value:512},
                  //       {text:'1024x1024', value:1024},
                  //       {text:'2048x2048', value:2048}
                  //     ],
                  //     set:(v)=>{
                  //       this.obj.setShadowMapSize(v);
                  //     }
                  //   }
                  // },
                  {
                    component:'BoolComponent',
                    data:{
                      typename:'backfaceShadows',
                      content:{checked:this.obj.getShadow().isBackfaceShadows()},
                      set:(v)=>{
                        this.obj.getShadow().setBackfaceShadows(v);
                      }
                    },
                    set:(v)=>{
                      this.obj.getShadow().setBackfaceShadows(v.backfaceShadows);
                    }
                  },
                  {
                    component:'TransformComponent',
                    data:[
                      {
                        type:'',
                        content:{
                          biasFactor:this.obj.getShadow().getBiasFactor()
                        },
                        set:(v)=>{
                          this.obj.getShadow().setBias(v.biasFactor, this.obj.getShadow().getBiasUnits());
                        }
                      },
                      {
                        type:'',
                        content:{
                          biasUnits:this.obj.getShadow().getBiasUnits()
                        },
                        set:(v)=>{
                          this.obj.getShadow().setBias(v.getShadow().getBiasFactor(), v.biasUnits);
                        }
                      },
                      {
                        type:'',
                        content:{
                          shadowIntensity:this.obj.getShadow().getShadowIntensity()
                        },
                        set:(v)=>{
                          this.obj.getShadow().setShadowIntensity(v.shadowIntensity);
                        }
                      }
                    ]
                  }
                ]
              });
              break;
            case 'PointLight':
              this.content.push({
                type:'Shadow',
                component:'CombinationComponent',
                data:[
                  {
                    component:'BoolComponent',
                    data:{
                      typename:'proShadow',
                      content:{checked:this.obj.isProShadow()},
                      set:(v)=>{
                        this.obj.proShadow(v);
                      }
                    }
                  },
                  {
                    component:'BoolComponent',
                    data:{
                      typename:'backfaceShadows',
                      content:{checked:this.obj.getShadow().isBackfaceShadows()},
                      set:(v)=>{
                        this.obj.getShadow().setBackfaceShadows(v);
                      }
                    },
                    set:(v)=>{
                      this.obj.getShadow().setBackfaceShadows(v.backfaceShadows);
                    }
                  },
                  {
                    component:'TransformComponent',
                    data:[
                      {
                        type:'',
                        content:{
                          biasFactor:this.obj.getShadow().getBiasFactor()
                        },
                        set:(v)=>{
                          this.obj.getShadow().setBias(v.biasFactor, this.obj.getShadow().getBiasUnits());
                        }
                      },
                      {
                        type:'',
                        content:{
                          biasUnits:this.obj.getShadow().getBiasUnits()
                        },
                        set:(v)=>{
                          this.obj.getShadow().setBias(v.getShadow().getBiasFactor(), v.biasUnits);
                        }
                      },
                      {
                        type:'',
                        content:{
                          shadowIntensity:this.obj.getShadow().getShadowIntensity()
                        },
                        set:(v)=>{
                          this.obj.getShadow().setShadowIntensity(v.shadowIntensity);
                        }
                      }
                    ]
                  }
                ]
              });
              break;
            case 'SpotLight':
              this.content.push({
                type:'Shadow',
                component:'CombinationComponent',
                data:[
                  {
                    component:'BoolComponent',
                    data:{
                      typename:'proShadow',
                      content:{checked:this.obj.isProShadow()},
                      set:(v)=>{
                        this.obj.proShadow(v);
                      }
                    }
                  },
                  {
                    component:'BoolComponent',
                    data:{
                      typename:'backfaceShadows',
                      content:{checked:this.obj.getShadow().isBackfaceShadows()},
                      set:(v)=>{
                        this.obj.getShadow().setBackfaceShadows(v);
                      }
                    },
                    set:(v)=>{
                      this.obj.getShadow().setBackfaceShadows(v.backfaceShadows);
                    }
                  },
                  {
                    component:'TransformComponent',
                    data:[
                      {
                        type:'',
                        content:{
                          biasFactor:this.obj.getShadow().getBiasFactor()
                        },
                        set:(v)=>{
                          this.obj.getShadow().setBias(v.biasFactor, this.obj.getShadow().getBiasUnits());
                        }
                      },
                      {
                        type:'',
                        content:{
                          biasUnits:this.obj.getShadow().getBiasUnits()
                        },
                        set:(v)=>{
                          this.obj.getShadow().setBias(v.getShadow().getBiasFactor(), v.biasUnits);
                        }
                      },
                      {
                        type:'',
                        content:{
                          shadowIntensity:this.obj.getShadow().getShadowIntensity()
                        },
                        set:(v)=>{
                          this.obj.getShadow().setShadowIntensity(v.shadowIntensity);
                        }
                      }
                    ]
                  }
                ]
              });
              break;
          }
          // 禁用和开启
          this.content.push({
            // enabled
            type:'Enabled',
            component:'BoolComponent',
            data:{
              typename:'status',
              content:{checked:this.obj.isEnable()},
              set:(v)=>{
                if(v){
                  this.obj.enable();
                  this.obj._edit = true;
                }
                else{
                  this.obj.disable();
                  this.obj._edit = false;
                }
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
