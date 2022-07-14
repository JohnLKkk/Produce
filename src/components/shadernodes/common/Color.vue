<template>
    <canvas width="64" height="64" style="background-color: rgba(255, 0, 0, 255)"></canvas>
</template>

<script>
  export default {
    name: "Color",
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
