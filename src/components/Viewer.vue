<template>
  <div class="window">
    <canvas class="canvas"></canvas>
  </div>
</template>

<script>
  export default {
    name: 'Viewer'
  }
</script>

<style scoped>
  .window{
    width: 100%;
    height: 100%;
    margin-right: 1px;
    margin-bottom: 1px;
    border-radius: 0 0 10px 10px;
    background: rgba(66, 66, 66, 0.53);
  }
  .canvas{
    border-radius: 0 0 10px 10px;
  }
</style>
