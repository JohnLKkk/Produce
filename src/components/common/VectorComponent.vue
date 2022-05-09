<template>
  <div>
    <span style="color: #cbcbcb;font-size: 12px;" v-for="(item, key) in content">{{key}}<input class="component_input" ref="number" type="number" v-model='content[key]'><br/></span>
  </div>
</template>

<script>
  import '../../assets/tools.css'
  export default {
    name: 'VectorComponent',
    props: {
      content: null,
      set: null
    },
    data(){
      return {
      }
    },
    methods:{

    },
    created () {
      // 绑定属性编辑
      for(let key in this.content){
        this.$watch('content.' + key, (v)=>{
          if(this.set){
            this.set(this.content);
          }
        });
      }
    }
  }
</script>

<style scoped>

</style>
