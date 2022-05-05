<template>
  <splitpanes id="port" >
    <pane min-size="0.2" size="80">
      <splitpanes horizontal>
        <pane :size="topSize">
          <template>
            <Viewer></Viewer>
          </template>
        </pane>
        <pane :size="btmSize">
          <template>
            <ShadingEdit></ShadingEdit>
          </template>
        </pane>
      </splitpanes>
    </pane>
    <pane min-size="0.2">
      <splitpanes horizontal>
        <pane :size="topSize">
          <LeadingPrinciples></LeadingPrinciples>
        </pane>
        <pane :size="btmSize">

        </pane>
      </splitpanes>
    </pane>
  </splitpanes>
</template>

<script>
  import { Splitpanes, Pane } from 'splitpanes'
  import 'splitpanes/dist/splitpanes.css'
  import ShadingEdit from '@/components/ShadingEdit'
  import Viewer from '@/components/Viewer'
  import LeadingPrinciples from '@/components/leadingPrinciples'

  export default {
    name: 'Port',
    components: {LeadingPrinciples, Viewer, ShadingEdit, Splitpanes, Pane },
    data () {
      return {
        topSize: 60
      }
    },
    methods:{
      onresize:function(e){
        this.topSize = e[0].size;
      }
    },
    computed:{
      btmSize:function(){
        return 100 - this.topSize;
      }
    }
  }
</script>

<style>
  #port{
    margin: 0px;
    height: 100%;
    position: absolute;
    left: 0px;
    top: 0px;
  }
  .splitpanes__pane {
    background-color: rgb(22, 22, 22);
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .splitpanes__pane {
    justify-content: center;
    align-items: center;
    display: flex;
  }
  .splitpanes__splitter {
    background-color: rgb(22, 22, 22);
    position: relative;
  }
  .splitpanes__splitter:before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    transition: 0.4s;
  }
  .splitpanes--vertical > .splitpanes__splitter:before {
    left: -3px;
    right: -3px;
  }
  .splitpanes--horizontal > .splitpanes__splitter:before {
    top: -3px;
    bottom: -3px;
  }
  .splitpanes__splitter:hover:before {
    background-color: rgba(0, 0, 0, 0.3);
  }
</style>
