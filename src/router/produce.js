import Vue from 'vue'
import ProduceEdit from 'vue-router'
import Port from '@/components/Port'
import ContextMenu from '../components/ui/ContextMenu'

Vue.component('VueContextMenu', ContextMenu)
Vue.use(ProduceEdit)
/**
 * Produce编辑器。<br/>
 * @author JhonKkk
 * @date 2021年8月13日17点36分
 */
export default new ProduceEdit({
  routes: [
    {
      path: '/',
      name: 'Port',
      component: Port
    }
  ]
})
