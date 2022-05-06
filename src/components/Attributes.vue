<template>
  <div class="window">
    <div class="topdeftoolbg2"></div>
    <div style="width: 100%;height: 100%;">
      <vue-tabs active-tab-color="gray"
                active-text-color="gray"
                type="pills"
                :start-index="1"
                direction="vertical"
                style="min-height: 100%"
      >
        <v-tab title="First tab" icon="ti-user" style="width: 25px;line-height: 24px;margin: 0 auto;">
          First tab content
        </v-tab>

        <v-tab title="Second tab" icon="ti-settings">
          Second tab content
        </v-tab>

        <v-tab title="Third tab" icon="ti-check">
          Third tab content
        </v-tab>
      </vue-tabs>

    </div>
  </div>
</template>

<script>
  import '../assets/tools.css'

  import {VueTabs, VTab} from 'vue-nav-tabs'
  import 'vue-nav-tabs/themes/paper.css'
  export default {
    name: 'Attributes',
    components: {
      VueTabs,
      VTab
    }
  }
</script>

<style scoped>
  .window{
    width: 100%;
    height: 100%;
    margin-left: 1px;
    margin-bottom: 1px;
    border-radius: 10px;
    background-color: rgba(41, 41, 41, 0.53);
  }
</style>
