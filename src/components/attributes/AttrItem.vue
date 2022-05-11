<template>
  <div>
    <ol v-show="content">
      <li v-for="(item, item_index) in content">
        <div @click="show(item_index)" class="attr_item" ref="show"><span ref="item_icon" class="icon_right"></span>{{item.type}}</div>
        <div ref="item_content" class='attr_item_content' style="display: none">
          <VectorComponent v-bind="item.data"></VectorComponent>
        </div>
      </li>
    </ol>
  </div>
</template>

<script>
  import '../../assets/tools.css'
  import VectorComponent from '../common/VectorComponent'
  export default {
    name: 'AttrItem',
    props: {
      content:'null'
    },
    components:{
      VectorComponent
    },
    mounted() {
    },
    data(){
      return {
      }
    },
    methods: {
      show(item_index) {
        item_index = Number(item_index);
        // console.log('点击:' + item_index);
        if(!this.content[item_index].open) {
          this.content[item_index].open = true;
          this.$refs.item_content[item_index].style.display = 'block';
          this.$refs.show[item_index].className = 'attr_item_top';
          this.$refs.item_icon[item_index].className = 'icon_btm';
        } else {
          this.content[item_index].open = false;
          this.$refs.item_content[item_index].style.display = 'none';
          this.$refs.show[item_index].className = 'attr_item';
          this.$refs.item_icon[item_index].className = 'icon_right';
        }
      },
    }
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
