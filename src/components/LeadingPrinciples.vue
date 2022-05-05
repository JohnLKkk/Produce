<template>
    <div class="window">
      <div class="topdeftoolbg"></div>
      <div class="leadingBg">
        <v-jstree :data="data" show-checkbox multiple allow-batch whole-row @item-click="itemClick" style="overflow-y:auto;"></v-jstree>
      </div>
    </div>
</template>

<script>
  import '../assets/tools.css'

  import VJstree from 'vue-jstree'
  export default {
    name: 'LeadingPrinciples',
    components: {
      VJstree
    },
    data(){
      return {
        data: [
          {
            "id": 0,
            "text": "Same but with checkboxes",
            "value": "Same but with checkboxes",
            "icon": "",
            "opened": false,
            "selected": false,
            "disabled": false,
            "loading": false,
            "children": [
              {
                "id": 2,
                "text": "custom icon",
                "value": "custom icon",
                "icon": "fa fa-warning icon-state-danger",
                "opened": false,
                "selected": false,
                "disabled": false,
                "loading": false,
                "children": []
              },
              {
                "id": 5,
                "text": "custom icon",
                "value": "custom icon",
                "icon": "fa fa-warning icon-state-warning",
                "opened": false,
                "selected": false,
                "disabled": false,
                "loading": false,
                "children": []
              },
              {
                "id": 6,
                "text": "disabled node",
                "value": "disabled node",
                "icon": "fa fa-check icon-state-success",
                "opened": false,
                "selected": false,
                "disabled": true,
                "loading": false,
                "children": []
              },
              {
                "id": 3,
                "text": "initially open",
                "value": "initially open",
                "icon": "fa fa-folder icon-state-default",
                "opened": true,
                "selected": false,
                "disabled": false,
                "loading": false,
                "children": [
                  {
                    "id": 4,
                    "text": "Another node",
                    "value": "Another node",
                    "icon": "",
                    "opened": false,
                    "selected": false,
                    "disabled": false,
                    "loading": false,
                    "children": []
                  }
                ]
              },
              {
                "id": 1,
                "text": "initially selected",
                "value": "initially selected",
                "icon": "",
                "opened": false,
                "selected": true,
                "disabled": false,
                "loading": false,
                "children": []
              },
              {
                "id": 8,
                "text": "initially selected",
                "value": "initially selected",
                "icon": "",
                "opened": false,
                "selected": false,
                "disabled": false,
                "loading": false,
                "children": []
              }
            ]
          },
          {
            "id": 7,
            "text": "Same but with checkboxes",
            "value": "Same but with checkboxes",
            "icon": "",
            "opened": true,
            "selected": false,
            "disabled": false,
            "loading": false,
            "children": [
              {
                "id": 9,
                "text": "custom icon",
                "value": "custom icon",
                "icon": "fa fa-warning icon-state-danger",
                "opened": false,
                "selected": false,
                "disabled": false,
                "loading": false,
                "children": []
              },
              {
                "id": 10,
                "text": "initially open",
                "value": "initially open",
                "icon": "fa fa-folder icon-state-default",
                "opened": true,
                "selected": true,
                "disabled": false,
                "loading": false,
                "children": [
                  {
                    "id": 11,
                    "text": "Another node",
                    "value": "Another node",
                    "icon": "",
                    "opened": false,
                    "selected": false,
                    "disabled": false,
                    "loading": false,
                    "children": []
                  }
                ]
              },
              {
                "id": 12,
                "text": "custom icon",
                "value": "custom icon",
                "icon": "fa fa-warning icon-state-warning",
                "opened": false,
                "selected": false,
                "disabled": false,
                "loading": false,
                "children": []
              },
              {
                "id": 13,
                "text": "disabled node",
                "value": "disabled node",
                "icon": "fa fa-check icon-state-success",
                "opened": false,
                "selected": false,
                "disabled": true,
                "loading": false,
                "children": []
              }
            ]
          },
          {
            "id": 14,
            "text": "And wholerow selection",
            "value": "And wholerow selection",
            "icon": "",
            "opened": true,
            "selected": false,
            "disabled": false,
            "loading": false,
            "children": [
              {
                "id": 27,
                "text": "newNode",
                "value": "newNode",
                "icon": "",
                "opened": false,
                "selected": false,
                "disabled": false,
                "loading": false,
                "children": []
              }
            ]
          },
          {
            "id": 15,
            "text": "drag disabled",
            "value": "drag disabled",
            "icon": "fa fa-warning icon-state-danger",
            "opened": true,
            "selected": false,
            "disabled": false,
            "loading": false,
            "children": [
              {
                "id": 28,
                "text": "newNode",
                "value": "newNode",
                "icon": "",
                "opened": false,
                "selected": false,
                "disabled": false,
                "loading": false,
                "children": []
              }
            ],
            "dragDisabled": true
          },
          {
            "id": 16,
            "text": "drop disabled",
            "value": "drop disabled",
            "icon": "fa fa-warning icon-state-danger",
            "opened": false,
            "selected": false,
            "disabled": false,
            "loading": false,
            "children": [],
            "dropDisabled": true
          }
        ]
      }
    },
    methods: {
      itemClick (node) {
        console.log(node.model.text + ' clicked !')
      }
    }
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
    min-height: 100%;
    overflow-y: auto;
    height: calc(100% - 20px);

    background: -webkit-linear-gradient(top, transparent 20px, rgba(40, 40, 40, 0.29) 21px);
    background-color: rgba(45, 45, 45, 0.2);
    background-size: 21px 42px;
  }
  /*滚动条样式*/
  .leadingBg::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;     /*高宽分别对应横竖滚动条的尺寸*/
    height: 4px;
  }
  .leadingBg::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    border-radius: 5px;
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    background: rgba(0,0,0,0.2);
  }
  .leadingBg::-webkit-scrollbar-track {/*滚动条里面轨道*/
    -webkit-box-shadow: inset 0 0 5px rgba(0,0,0,0.2);
    border-radius: 0;
    background: rgba(0,0,0,0.1);
  }
</style>
