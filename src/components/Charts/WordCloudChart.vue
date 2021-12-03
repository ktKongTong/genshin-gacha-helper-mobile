<template>
    <v-chart style="height:80vh;width: auto;margin: 0 auto"  autoresize :option="wordOptionComputed"/>
</template>
<script setup>
import { use } from "echarts/core";
import {
  CanvasRenderer
} from 'echarts/renderers'
import {
  BarChart,PieChart,HeatmapChart,LineChart,ScatterChart
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
  VisualMapComponent,
  ScatterChart
]);

import { onMounted,ref,computed, watch,inject } from 'vue'
import _ from 'lodash'
// 获取tmpList
const tmpList = inject('gachaTmpDataList');

// 词云,基于tmpList.value
const wordOptionComputed = computed(()=>{
  let option = {
      tooltip:{
          trigger: 'item',
          triggerOn: "mousemove",
          formatter:"{b0}: {c0}"
      },
      series: [{
      name: '祈愿词云',
      type: 'wordCloud',
      maskImage: '',
      left: 'center',
      top: 'center',
      sizeRange: [12, 60],
      rotationStep: 45,
      gridSize: 1,
      layoutAnimation: true,
      textStyle: {
          fontFamily: 'sans-serif',
          fontWeight: 'bold',
          color: function () {
              return 'rgb(' + [Math.round(Math.random() * 160),Math.round(Math.random() * 160),Math.round(Math.random() * 160)].join(',') + ')';
          }
      },
      data: []
      }]
    }
    let data = _.cloneDeep(tmpList.value)
    console.log("watchWordOption")
    let tmp = {}
    data.forEach(elem=>{
        tmp[elem.name] = tmp.hasOwnProperty(elem.name)?tmp[elem.name]+1:1
    })
    let res = []
    for(let elem in tmp){
        res.push({
            "name":elem,
            "value":tmp[elem]
        })
    }
    option.series[0].data = res
    return option
})
</script>
<style>

</style>