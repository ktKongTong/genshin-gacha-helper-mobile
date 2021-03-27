import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ECharts from 'vue-echarts'
import { use } from "echarts/core";
import Vant,{Uploader} from 'vant';
import 'vant/lib/index.css';

// 手动引入 ECharts 各模块来减小打包体积
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart
} from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent
} from 'echarts/components'
use([
  CanvasRenderer,
  BarChart,
  GridComponent,
  TooltipComponent
]);

const app = createApp(App).use(store).use(router).use(Vant).use(Uploader);
app.component('v-chart', ECharts)
app.mount('#app')