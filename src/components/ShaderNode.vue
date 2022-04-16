<template>
  <VueDragResize class="VueDragResize" :isDraggable="true" :isResizable="false" :w="200" :h="200">
    <h5 class="title">{{title}}</h5>
  </VueDragResize>
  <!--原本想自己实现一个拖动控件-->
  <!--<div ref="shaderNode" class="ShaderNode" v-on:mousedown="mousedown"v-on:mousemove="mousemove"v-on:mouseup="mouseup"></div>-->
</template>

<script>
  import VueDragResize from 'vue-drag-resize';
  export default {
    name: 'ShaderNode',
    props:{
      title:{
        type:String
      }
    },
    data(){
      return {
      }
    },
    methods:{

    },
    components:{VueDragResize}
  }
</script>

<style scoped>
  .ShaderNode{
    position: absolute;
    min-width: 200px;
    min-height: 200px;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    background-color: aliceblue;
  }
  .VueDragResize{
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    max-width: 200px;
    padding: 0px;
    margin: 0px 0px 1px 1px;
    position: relative;
    border-radius: 5px;
    background-color: #3e3e3e;
    box-shadow:0 0 15px #000;
  }
  .title{
    text-align: left;
    font-style: normal;
    font-size: 10px;
    font-stretch: normal;
    padding-left: 10px;
    background-color: rebeccapurple;
    -webkit-border-radius: 5px 5px 0px 0px;
    -moz-border-radius: 5px 5px 0px 0px;
    border-radius: 5px 5px 0px 0px;
    color: white;
  }
</style>
