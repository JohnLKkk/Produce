<template>
    <div class="window">
      <div class="topdeftoolbg"></div>
      <div class="leadingBg"></div>
    </div>
</template>

<script>
  import '../assets/tools.css'
  export default {
    name: 'LeadingPrinciples'
  }
</script>

<style scoped>
  .window{
    width: 100%;
    height: 100%;
    margin-left: 1px;
    margin-bottom: 1px;
  }
  .leadingBg{
    border-radius: 0 0 10px 10px;
    width: 100%;
    height: calc(100% - 20px);

    background: -webkit-linear-gradient(top, transparent 20px, rgba(40, 40, 40, 0.29) 21px);
    background-color: rgba(45, 45, 45, 0.2);
    background-size: 21px 42px;


  }
</style>
