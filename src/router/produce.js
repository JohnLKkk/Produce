import Vue from 'vue'
import ProduceEdit from 'vue-router'
import Port from '@/components/Port'

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
