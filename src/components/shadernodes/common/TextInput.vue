<template>
  <input type="text" class="textcontrol_component_input" placeholder="parameter name" :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop=""/>
</template>

<script>
  import '../../../assets/shadernodes/controls.css'
  export default {
    name: "TextInput",
    props: ['readonly', 'emitter', 'key', 'getData', 'putData'],
    data() {
      return {
        value: 'defaultName',
      }
    },
    methods: {
      change(e){
        this.value = e.target.value;
        this.update();
      },
      update() {
        if (this.key)
          this.putData(this.key, this.value)
        this.emitter.trigger('process');
      }
    },
    mounted() {
      this.value = this.getData(this.key);
    }
  }
</script>

<style scoped>

</style>
