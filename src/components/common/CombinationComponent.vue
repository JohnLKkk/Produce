<template>
  <div v-show="content">
    <ol v-show="content">
      <li v-for="(item, item_index) in content">
        <component v-bind:is="item.component" v-bind:content="item.data"></component>
      </li>
    </ol>
  </div>
</template>

<script>
  import SelectComponent from './SelectComponent'
  import BoolGroupComponent from './BoolGroupComponent'
  import BoolComponent from './BoolComponent'
  import TransformComponent from './TransformComponent'
  import ColorComponent from './ColorComponent'

  export default {
    name: 'CombinationComponent',
    props:{
      content:{
        data:null
      }
    },
    components:{
      SelectComponent,
      BoolGroupComponent,
      BoolComponent,
      TransformComponent,
      ColorComponent,
    },
    created () {
      console.log('content:',this.content);
    }
  }
</script>

<style scoped>
  ol{
    list-style:none;
    margin: 0px;
    padding: 0px;
  }
  li{
    max-width: 200px;
    margin: 0px;
    padding: 0px;
    margin-left: calc(50% - 100px);
    text-align: left;
  }
</style>
