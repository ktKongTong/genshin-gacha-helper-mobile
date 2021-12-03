<template>
    <v-chart style="overflow:auto;width:100vw;height:60vh" ref='calendar' :init-options= "calendarInitOption" :option="calendarOptionComputed"/>
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
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isBetween from 'dayjs/plugin/isBetween'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs().locale('zh-cn')
// 获取tmpList
const tmpList = inject('gachaTmpDataList');
console.log(tmpList)
// inject
// 属性
// const props = defineProps({tmpList:Array})
// calendar
const calendar = ref(null)
// 热力图,基于tmpList
const calendarInitOption = ref({})
const calendarOptionComputed = computed(()=>{
  let option = {
      title: {left: 50,text: '祈愿热力图'},
      tooltip: {
        formatter:function (params) {return params.data[0]+" : "+params.data[1]}
      },
      // 日历图
      calendar: {
          splitLine:{show:false},
          top: 50,
          left:120,
          cellSize: [15, 15],
          range: ['2020-09-15', dayjs().format("YYYY-MM-DD")],
          itemStyle: {borderColor:"#ffffff"},
          dayLabel:{firstDay:1,position:"start",nameMap:"cn"},
          monthLabel:{fontSize:8,
            formatter: '{yy}-{MM}',
            overflow:'break'
          },
          yearLabel: {show: false}
      },
      visualMap:{
        type:"piecewise",
        top:30,
        left: 20,
        textGap:2,
        itemGap:3,
        itemWidth:14,
        itemHeight:14,
        bottom:5,
        pieces: [{min:50,color:'#134121'},
          {min: 20, max: 50,color:'#24763D'},
          {min: 10, max: 20,color:'#2B8D49'},
          {min: 5, max: 10,color:'#3AC063'},
          {min: 3, max: 5,color:"#72D490"},
          {min: 1, max: 3,color:"#9be9a8"},
          {max: 1,color:"#ebedf0"}],
      },
      series: {
      type: 'scatter',
      symbol:'roundRect',
      coordinateSystem: 'calendar',data: []}
  }
  console.log("watchCalendarOption")
  // 计算tmpList的改动
  let data = _.cloneDeep(tmpList.value)
console.log(tmpList.value)
  let calendarData = []
  // 计算每个日期的祈愿数量
  let currentDate = dayjs("2020-09-15",'YYYY-MM-DD')
  let calendarRange=[]
  if(data.length>0){
      currentDate = dayjs(data[0].time.slice(0,10),'YYYY-MM-DD')
      calendarRange.push(data[0].time.slice(0,10))
      let endDay= dayjs(data[data.length-1].time.slice(0,10)).add(1, 'day').format('YYYY-MM-DD')
      calendarRange.push(endDay)
      while(currentDate.isSameOrBefore(dayjs(data[data.length-1].time.slice(0,10),'YYYY-MM-DD'))){
          let total = data.filter(function(value, index, array){
              return value.time.slice(0,10) == this
          },currentDate.format('YYYY-MM-DD')
          ).length
          calendarData.push([currentDate.format('YYYY-MM-DD'),total])
          currentDate = currentDate.add(1,"day")
      }
  }
  option.series.data=calendarData
  option.calendar.range=calendarRange
  return option
})
// 当calendar更新时，calendar刷新宽度
// watch(()=>calendarOptionComputed.value,(option)=>{
//   console.log(option.calendar.range)
//   let days = (dayjs(option.calendar.range[1]).valueOf()-dayjs(option.calendar.range[0]).valueOf())/(1000*3600*24)
//   let length = parseInt(days/7)+2
//   if(calendar.value){
//     console.log("calendar resize width"+(120+length*15)>300?120+length*15:300)
//     calendar.value.resize({width: (120+length*15)>300?120+length*15:300})
//   }else{
//     console.log(120+length*15)
//     calendarInitOption.value = {width: 120+length*15,height:180}
//   }
// },
// {deep:true})
</script>
<style>
</style>