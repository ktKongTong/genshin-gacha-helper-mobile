import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ECharts from 'vue-echarts'
import { use } from "echarts/core";
import 'echarts-wordcloud'
import Vant,{Uploader, Tab, Tabs, Sidebar, SidebarItem,
  Tabbar,TabbarItem,NavBar,Icon,Popover,Cell, CellGroup,Rate,Collapse,CollapseItem } from 'vant';

import 'vant/lib/index.css';

// 手动引入 ECharts 各模块来减小打包体积
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart,
  PieChart,
  HeatmapChart
} from 'echarts/charts'
import {
  LegendComponent,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  CalendarComponent,
  VisualMapComponent
} from 'echarts/components'
use([
  CanvasRenderer,
  PieChart,
  BarChart,
  HeatmapChart,
  LegendComponent,
  GridComponent,
  TooltipComponent,
  TitleComponent,
  CalendarComponent,
  VisualMapComponent
]);

const app = createApp(App).use(store).use(router).use(Vant).use(Uploader)
app.use(NavBar).use(Icon).use(Popover).use(Rate)
app.use(Collapse).use(CollapseItem)
app.use(Cell).use(CellGroup)
app.use(Tabbar).use(TabbarItem);
app.use(Tab).use(Tabs);
app.use(Sidebar).use(SidebarItem);

app.component('v-chart', ECharts)
app.mount('#app')