<template>
  <input type="number" :readonly="readonly" :value="value" @input="change($event)" @dblclick.stop=""/>
</template>

<script>
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
