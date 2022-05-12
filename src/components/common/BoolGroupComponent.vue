<template>
    <div v-show="content">
      <BoolComponent v-for="(item, key) in content" :key='key' v-bind:content="item"></BoolComponent>
    </div>
</template>

<script>
  import BoolComponent from './BoolComponent'
  export default {
    name: 'BoolGroupComponent',
    components: {BoolComponent},
    props:{
      content:null
    },
    created () {
    }
  }
</script>

<style scoped>

</style>
