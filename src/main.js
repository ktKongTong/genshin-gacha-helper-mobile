import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import ECharts from 'vue-echarts'
import { use } from "echarts/core";
import 'echarts-wordcloud'
import VCalendar from 'v-calendar';
import Vant,{Uploader, Tab, Tabs,Rate,Collapse,CollapseItem,Cell, CellGroup,Popup, Icon, Popover,Overlay } from 'vant';
import 'vant/lib/index.css';
// 手动引入 ECharts 各模块来减小打包体积
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart,PieChart,HeatmapChart,LineChart
} from 'echarts/charts'
import {
  LegendComponent,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  DataZoomSliderComponent,
  CalendarComponent,
  VisualMapComponent,
} from 'echarts/components'
use([
  CanvasRenderer,
  PieChart,BarChart,HeatmapChart,LineChart,
  LegendComponent,
  GridComponent,
  TooltipComponent,
  DataZoomSliderComponent,
  TitleComponent,
  CalendarComponent,
  VisualMapComponent
]);

const app = createApp(App).use(router)
app.use(VCalendar)
app.use(Vant).use(Icon).use(Popover).use(Rate).use(Popup).use(Uploader).use(Overlay)
// 折叠面板
app.use(Collapse).use(CollapseItem)
// 单元格
app.use(Cell).use(CellGroup)
// tab栏
app.use(Tab).use(Tabs);
app.component('v-chart', ECharts)
app.mount('#app')