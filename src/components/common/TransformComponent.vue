<template>
  <div>
    <ol>
      <li v-for="(item, item_index) in content">
        <span style="color: #cbcbcb;font-size: 10px;">{{item.type}}</span><VectorComponent v-bind="item"></VectorComponent>
      </li>
    </ol>
  </div>
</template>

<script>
  import VectorComponent from './VectorComponent'

  export default {
    name: 'TransformComponent',
    components:{
      VectorComponent,
    },
    props: {
      content:'null'
    },
  }
</script>

<style scoped>
  ol{
    list-style:none;
    margin: 0px;
    padding: 0px;
  }
  li{
    margin: 0px;
    padding: 0px;
  }
</style>
