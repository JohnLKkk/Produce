<template>
  <ul class="child-ul-wrapper" :class="float">
    <li v-for="i in itemchildren" :key="i.name" class="child-li-wrapper">
      <div v-if="i.children && i.children.length > 0" class="has-child">
        <div class="parent-name btn-wrapper-simple">
          <i :class="i.icoName ? i.icoName : ''" class="nav-icon-fontawe"></i>
          <span class="nav-name-right">{{i.btnName}}</span>
          <i class="icon"></i></div>
          <tree-child-component :itemchildren="i.children" @childhandler="fnHandler" :float="float" />
      </div>
      <div v-else>
        <div @click.stop="fnHandler(i)" class="no-child-btn btn-wrapper-simple">
          <i :class="i.icoName ? i.icoName : ''" class="nav-icon-fontawe"></i>
          <span class="nav-name-right">{{i.btnName}}</span>
        </div>
      </div>
    </li>
  </ul>
</template>
<script>
export default {
  name: 'tree-child-component',
  props: ['itemchildren', 'float'],
  methods: {
    fnHandler (item) {
      this.$emit('childhandler', item)
    }
  }
}
</script>
<style scoped>
  .float-status-1 {
    left: 100%;
    bottom: -1px;
    z-index: 10001
  }
  .float-status-2 {
    left: 100%;
    top: -1px;
    z-index: 10001
  }
  .float-status-3 {
    right: 100%;
    top: -1px;
    z-index: 10001
  }
  .float-status-4 {
    right: 100%;
    bottom: -1px;
    z-index: 10001
  }

  .child-ul-wrapper .has-child {
    padding: 5px 10px;
    position: relative;
  }
  li {
    list-style: none;
  }
  .parent-name .icon {
    position: absolute;
    display: block;
    top: 4px;
    right: 0;
    border-top: 4px solid transparent;
    border-left: 8px solid #c2c2c2;
    border-bottom: 4px solid transparent;
    border-right: 4px solid transparent;
  }

  .no-child-btn {
    padding: 5px 10px;
  }

  .child-ul-wrapper {
    background: #0c0c0c;
    position: absolute;
    display: none;
    border: 2px;
    box-shadow: 4px 4px 5px 0 rgba(0, 0, 0, 0.84);
    border-radius: 3px;
  }
  .child-li-wrapper:hover > .has-child > .child-ul-wrapper{
    display: block;
  }
  .context-menu-list:hover, .child-li-wrapper:hover {
    background: rgba(119, 119, 119, 0.25);
  }

  .nav-icon-fontawe {
    position: absolute;
  }
  .nav-name-right {
    white-space: nowrap;
    display: block;
    margin: auto 20px;
  }
  .btn-wrapper-simple {
    position: relative;
    height: 16px;
    line-height: 16px;
  }
</style>


