
<template>
<div>
  <!-- 顶部自定义导航 -->
  <topNav ref="nav" @exportExcel="exportExcel" @afterRead="afterRead" @filter="filter"></topNav>

<van-tabs v-model:active="active">
  <van-tab title="总览">
    <div>
      <div>
        <v-chart autoresize style="height:60vh" :option="pieOptionComputed"/>
      </div>
      <div>
      <van-collapse :border="false" v-model="activeNames">
          <van-collapse-item name="5">
            <template #title>
            <div>
              <div style="display:flex;align-items:center">
                <van-rate v-model="rate[0]" value="5"  color="#ffd21e" readonly></van-rate>
                <span style="color:#ffd21e;margin-left:auto;margin-right:20px;font-size:16px"> {{rankRate.rank5}}%</span>
              </div>
              <div  style="color:#ffd21e;font-size: 13px;display:flex;align-items:center">平均出货次数: {{rankAvg["rank5"]["all"]}}</div>
              </div>
            </template>
              <div style="margin:0 auto">
                <van-tag style="margin:2px 2px" size="medium" type="primary"  plain v-for="i in rankListFiltered['all'].rank5" :key="i">{{ i['name'] }}({{i['count5']}})</van-tag>
              </div>
          </van-collapse-item>
          <van-collapse-item name="4">
            <template #title>
              <div>
                <div style="display:flex;align-items:center">
                  <van-rate v-model="rate[1]"  color="#AD1AF5" readonly></van-rate>
                  <span style="color:#AD1AF5;margin-left:auto;margin-right:20px;font-size:16px"> {{rankRate.rank4}}%</span>
                </div>
                <div  style="color:#AD1AF5;font-size: 13px;display:flex;align-items:center">平均出货次数: {{rankAvg["rank4"]["all"]}}</div>
              </div>
            </template>
            <div style="margin:0 auto">
                <van-tag style="margin:2px 2px" size="medium" type="primary"  plain v-for="i in rankListFiltered['all'].rank4" :key="i">{{ i['name'] }}({{i['count4']}})</van-tag>
            </div>
          </van-collapse-item>
          <van-collapse-item name="3" :is-link='false' disabled>
            <template #title>
                <div style="display:flex;align-items:center;margin-right:22px">
                  <van-rate v-model='rate[2]'  color="#2C64FF" readonly ></van-rate>
                  <span style="color:#2C64FF;margin-left:auto;margin-right:20px;font-size:16px"> {{rankRate.rank3}}%</span>
                </div>
            </template>
          </van-collapse-item>
      </van-collapse>
      </div>
    </div>
  </van-tab>
  <van-tab  title="出货次数">
    <div>
      <v-chart autoresize style="height:60vh" :option="lineOptionComputed.rank4"/>
    </div>
    <!-- <van-cell center title="显示五星出货次数图">
      <template #right-icon>
        <van-switch v-model="show5LineCharts" size="16" />
      </template>
    </van-cell> -->
    <!-- <div :style="show5LineCharts?'':'display:none'">
      <v-chart  autoresize  style="height:60vh;" :option="lineOptionComputed.rank5"/>
    </div> -->
  </van-tab>
  <van-tab title="祈愿次数">

      <!-- <v-chart style="overflow:auto;width:100vw;height:100%" ref='calendar' :init-options= "calendarInitOption" :option="calendarOptionComputed"/> -->
    <div>
      <v-chart autoresize style="height:60vh" :option="barOptionComputed"/>
    </div>
  </van-tab>
  <van-tab title="热力图">
    <CalendarHeatmapVue ref='cal'></CalendarHeatmapVue>
  </van-tab>
  <van-tab title="词云">
    <WordCloudChartVue ref='wordCloud'></WordCloudChartVue>
  </van-tab>
</van-tabs>
</div>
</template>
<script setup name="Show">
import { use } from "echarts/core";
import 'echarts-wordcloud'
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


import { onMounted,ref,computed, watch, provide,reactive, readonly,inject} from 'vue'
import { useRoute } from 'vue-router'

// import { Swiper, SwiperSlide } from 'swiper/vue'
// import "swiper/css/scrollbar"
// import 'swiper/css'
// import SwiperCore, { Scrollbar,Mousewheel } from 'swiper'
// SwiperCore.use([Scrollbar,Mousewheel])


import _ from 'lodash'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isBetween from 'dayjs/plugin/isBetween'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs().locale('zh-cn')
import { Notify } from 'vant';
import topNav from '../components/TopNav.vue'
import WordCloudChartVue from "../components/Charts/WordCloudChart.vue"; "../components/Charts/WordCloudChart.vue"
import CalendarHeatmapVue from "../components/Charts/CalendarHeatmap.vue"
import {gExcel,gRawJson,mergeJson,fileToJson} from '../utils/dealData.js'


const route = useRoute();
const nav = ref(null)
const cal = ref(null)
const wordCloud = ref(null)
// 实际取值的时间
const StartDate=ref('2020-09-15 08:00')
const EndDate=ref(dayjs().format("YYYY-MM-DD HH:mm"))
// Tabs栏的当前激活页
const active =ref(0)
// 总览页面 折叠面板显示项
const activeNames=ref(["5"])
const rate=[5,4,3]
const show5LineCharts=ref(false)

const gachaCode = ["100","200","301","302"]
const gachaCodeAll = ["all","100","200","301","302"]
const gachaName  = ["新手祈愿","常驻祈愿","角色活动祈愿","武器活动祈愿"]
const gachaNameAll = ["所有","新手祈愿","常驻祈愿","角色活动祈愿","武器活动祈愿"]
const gachaItemTypeName =  ["3星武器","4星武器","5星武器","4星角色","5星角色"]
// 传来的数据存储的List
const dataList=ref([])
const tmpList = ref([])
provide('gachaDataList',dataList)
// 向其他组件提供tmpList
provide('gachaTmpDataList',tmpList)

watch(()=>dataList.value,()=>{
  console.log("dataList changed")
})

// 由子组件触发,数据筛选
const filter = ()=>{
  StartDate.value = dayjs(nav.value.menu.startDate).format("YYYY-MM-DD HH:mm")
  EndDate.value = dayjs(nav.value.menu.endDate).format("YYYY-MM-DD HH:mm")
  let tmp = dataList.value.sort(sortDataById).reverse()
  let group = nav.value.menu.gachaGroup
  tmpList.value = _.cloneDeep(tmp.filter(elem=>{
    return group.indexOf(elem.gacha_type)!=-1&&dayjs(elem.time).isBetween(StartDate.value, EndDate.value, null, '[]')
  }))
}


// 概率计算
const rankRate = computed(()=>{
    let rankRate = {rank5:0,rank4:0,rank3:0}
    let data = tmpList.value
    if(data.length!=0){
        for(const i in  rankRate){
            rankRate[i] = (data.filter(elem=>elem.rank_type==i.slice(4,5)).length/data.length*100).toFixed(2)
        }
    }
    return rankRate
})
// 在dataList改变的时候进行计算
// 出货消耗次数，未筛选，基于dataList
const rankList= computed(()=>{
  let gachaRes = {}
  gachaRes["all"] = {rank5:[],rank4:[]}
    for(let item of gachaCode){
        let gacha = _.cloneDeep(dataList.value.filter(elem=>{return elem.gacha_type==item}).sort(sortDataById).reverse())
        let count5 = 1
        let count4 = 1
        let restmp = gacha.reduce((total,currentValue)=>{
            if(currentValue.rank_type=="5"){
                currentValue.count5 = count5
                total.rank5.push(currentValue)
                count5=0
            }else if(currentValue.rank_type=="4"){
                currentValue.count4 = count4
                total.rank4.push(currentValue)
                count4=0
            }
            count4++
            count5++
            return total
        },{rank5:[],rank4:[]})
        gachaRes[item] = restmp
        gachaRes["all"].rank5 = gachaRes["all"].rank5.concat(gachaRes[item].rank5).sort(sortDataById).reverse()
        gachaRes["all"].rank4 = gachaRes["all"].rank4.concat(gachaRes[item].rank4).sort(sortDataById).reverse()
    }
    return gachaRes
})
// 经过筛选的rankList,tmpList改变之后再筛选
// 此处应该在filter 确定之后再筛选

const rankListFiltered = ref({"all":{rank5:[],rank4:[]},"100":{rank5:[],rank4:[]},"200":{rank5:[],rank4:[]},"301":{rank5:[],rank4:[]},"302":{rank5:[],rank4:[]}})
// 当进行筛选的时候，触发rankList的筛选
watch(()=>tmpList.value,()=>{
  console.log("watchRankList")
  let rankArray = ["rank5","rank4"]
  let rankListComputed = {}
  for(let i of gachaCodeAll){
    rankListComputed[i] = {}
    for(let j of rankArray){
      rankListComputed[i][j] = rankList.value[i][j].filter(elem =>{
          return nav.value.menu.gachaGroup.indexOf(elem.gacha_type)!=-1&&dayjs(elem.time).isBetween(StartDate.value, EndDate.value, null, '[]')
      })
      rankListFiltered.value[i][j] = _.cloneDeep(rankListComputed[i][j]).sort(sortDataById).reverse()
    }
  }
})
// 出货次数均值,基于rankListFiltered
const rankAvg = computed(()=>{
  // console.log(rankListFiltered.value)
  let rankArray = ["rank5","rank4"]
  // let 
  let avgRes = {}
  for(let j of rankArray){
    avgRes[j] = {}
    for (const i of gachaCodeAll){
      let total=rankListFiltered.value[i][j].reduce((sum,currentValue)=>{
        sum = currentValue[j==1?"count4":"count5"] + sum
        return sum
      },0)
      avgRes[j][i]=((total==0)?0:total/rankListFiltered.value[i][j].length).toFixed(2)
    }
  }
  return avgRes
})
// 饼图,基于tmpList.value
const pieOptionComputed = computed(()=>{
    let option = {
      title: {text: '祈愿总览',left: 'center'},
      tooltip: {
        trigger: 'item',
        formatter: function (params) {
            let str = params.name + "<br/>";
            str=str+"数量:"+params.value
            let per = params.percent
            str = str+"<br/>占比:"+per+"%"
            return str;
        },
      },
      legend: {
          top:20,
          type: "scroll",
          itemGap:6,
          itemWidth:14,
          left: 'center',
      },
      color:['#5470c6', '#AD1AF5', '#fac858', '#ff8c00', '#ffe700'],
      series: [{
        name: ' ',
        type: 'pie',
        radius: ['30%', '45%'],
        itemStyle: {
                borderRadius: 5,
                borderColor: '#fff',
                borderWidth: 0.5
            },
        label:{
          formatter: function (params) {
              let str = params.name + "\n"+params.value;
              str = str+"("+params.percent+"%)"
              return str;
          },
        },
        data: [],
        legendHoverLink: false
      }]
    }
    let type = ["3星武器","4星武器","5星武器","4星角色","5星角色"]
    let data = tmpList.value
    let series =  []
    for(let item of type){
        series.push({
            name:item,
            value: data.filter(elem=>elem.rank_type==item.slice(0,1)&&elem.item_type==item.slice(2)).length
        })
    }
    option.series[0].data = series
    return option
})

// 条形图,基于tmpList.value
const barOptionComputed = computed(()=>{
let option = {
  dataZoom: [{type:'slider' },],
  color:['#5470c6', '#AD1AF5', '#fac858', '#ff8c00', '#ffe700'], 
  tooltip: {trigger: 'axis',axisPointer: {type: 'shadow'}},
  legend: {
      itemGap:6,
      itemWidth:14,
      left: 'center',
      data: gachaItemTypeName
  },
  // grid: {left: '3%',right: '4%',containLabel: true},
  xAxis: [{type: 'category',data: [" "]}],
  yAxis: [{type: 'value'}],
  series: gachaItemTypeName.map((item)=>{
      return {
        name: item,type: 'bar',stack:'day',emphasis: {focus: 'series'},
        data: [0],legendHoverLink: false
      }
    }),
}
  console.log("computedBarOption")
  let data = tmpList.value

  let type = ["3星武器","4星武器","5星武器","4星角色","5星角色"]
  let bucket = {}
  let index = []
  if(data.length<=0){
    return
  }
  // 粪桶
  for (let i of type){
    bucket[i] = []
  }
  // 先按日期分组
  let grouped = _.groupBy(data,elem=>elem.time.slice(0,10))
  // 对日期遍历
  for (let item of _.keys(grouped)){
    index.push(item)
    let counted = _.countBy(grouped[item],elem=>elem.rank_type+"星"+elem.item_type)
    for (let i of type){
      bucket[i].push(counted[i]||0)
    }
  }
  option.xAxis[0].data = index
  type.forEach((item,index)=>{
    option.series[index].data = bucket[item]
  })
  // for(let i in type){
  //   option.series[i].data=bucket[type[i]]
  // }
  return option
})

// 线图,基于rankListFiltered
// 出货次数分布(同时提供多五星出货次数分布)
const lineOptionComputed = computed(()=>{
  let rankArray = ["rank5","rank4"]
  
  console.log(rankArray[j])
  let res = {rank5:{},rank4:{}}
  for(let j in rankArray){
    let option = {
        grid:{top:"20%"},
        title:{left: 'center',text: (j==1?"四":"五")+'星出货频次图'},
        xAxis: {type: 'category',data: Array.from(new Array(j==1?11:91).keys()).slice(1)},
        legend: {itemGap:6,itemWidth:14,left: 'center',top:"8%",
        data: ["所有","新手祈愿","常驻祈愿","角色活动祈愿","武器活动祈愿"]},
        yAxis: {type: 'value'},
        series: []
      }
    for(let i of gachaNameAll){      
      let freqArray = new Array(j==1?10:90).fill(0)
      rankListFiltered.value[i][rankArray[j]].forEach(elem=>{
        freqArray[(j==1?elem.count4:elem.count5)-1]++
      })
      option.series.push({
        name:i,
        data:freqArray,
        type: 'line',
        smooth: true
      })
    }
    res[rankArray[j]] = option
  }
  return res
})

// 合并
onMounted(()=>{
// 读取传过来的数据
  try{
    dataList.value = JSON.parse(route.params.dataList)
  // 合并原有本地数据
  try{
    // 按id升序排序
    let tmpList = dataList.value.sort(sortDataById).reverse()
    let oldList = JSON.parse(localStorage.getItem("dataList"))
    if(oldList!=null&&oldList.length>0){
      let firstData = tmpList[0]||{id:"200000000000000000"}
      oldList.forEach(elem => {
        // 合并
          if(sortDataById(elem,firstData)==1){
          // elemId小于firstId
              dataList.value.push(elem)
          }
    });
    }
  }catch{
  }
  // console.log(calendar.value)
  filter()
  localStorage.setItem("dataList", JSON.stringify(dataList.value));
}catch{
  // console.log(calendar.value)
  Notify({ type: 'danger', message: '数据没传递过来呢,尝试从本地取数据' });
  dataList.value = JSON.parse(localStorage.getItem("dataList"))||[];
  filter()
}
})

// 排序
const sortDataById=(a, b)=> {
  for(let i=0;i<a.id.length;i++){
      if(parseInt(a.id[i])>parseInt(b.id[i])){
          return -1
      }else if(parseInt(a.id[i])<parseInt(b.id[i])){
          return 1
      }
  }
}

// 读取JSON文件之后，更新
const afterRead =  async (file)=>{
  try{
    const json=await fileToJson(file.file)
    let res = mergeJson(_.cloneDeep(dataList.value),json)
    if(res.res){
      dataList.value = res.data
      Notify({ type: 'success', message: '合并成功' });
      
      filter()
      localStorage.setItem("dataList", JSON.stringify(dataList.value));
    }else{
      dataList.value = res.data
      // console.log("error1")
      Notify({ type: 'danger', message: '合并失败,可能是哪里出了问题🙁'});
    }
}catch{
  // console.log("error2")
    Notify({ type: 'danger', message: '合并失败，可能是哪里出了问题🙁'});
}
}
// 导出Excel
const exportExcel = ()=>{
  let res = gExcel(_.cloneDeep(dataList.value))
  Notify({ type: 'success', message: '导出成功' });
}
</script>
<style>
.echarts > div{
  margin: 0 auto !important;
}
/* .swiper-slide {
    overflow: auto;
} */
</style>
