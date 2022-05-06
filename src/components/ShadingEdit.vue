<template>
  <div class="window">
    <div class="topdeftoolbg2"></div>
    <div ref="edit" v-on:mousewheel="zoom"class="one"style="width: 100%;height: 100%;background-color: #1a1a1a;overflow:hidden;position:relative;"v-on:mousedown.middle="">
      <ShaderNode title="原理化BSDF"></ShaderNode>
      <ShaderNode title="漫射BSDF"></ShaderNode>
    </div>
  </div>
</template>

<script>
  /**
   * 着色器编辑器。<br/>
   * @author JhonKkk
   * @date 2021年8月14日09点49分
   */
  import '../assets/tools.css'
  import ShaderNode from '@/components/ShaderNode'
  export default {
    name: 'ShadingEdit',
    components: {ShaderNode},
    methods:{
      zoom:function(e){
        let ele = this.$refs.edit;
        let zoom = parseInt(ele.style.zoom, 10) || 100;
        zoom += event.wheelDelta / 12;
        zoom = Math.min(Math.max(zoom, 60), 300);
        if(zoom > 0) { ele.style.zoom = `${zoom}%`}
      }
    }
  }
</script>

<style scoped>
  .window{
    width: 100%;
    height: 100%;
    margin-right: 1px;
    margin-top: 1px;
  }
  .one{
    height: inherit; /* 继承.box高度 */
    background: -webkit-linear-gradient(top, transparent 20px, #000000 21px),-webkit-linear-gradient(left, transparent 20px, #000000 21px);
    background-size: 21px 21px;

  }
</style>
