<template>
  <input type="number" class="control_component_input" :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop=""/>
</template>

<script>
  import '../../../assets/shadernodes/controls.css'
  export default {
    name: "Number",
    props: ['readonly', 'emitter', 'key', 'getData', 'putData'],
    data() {
      return {
        value: 0,
      }
    },
    methods: {
      change(e){
        this.value = +e.target.value;
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
