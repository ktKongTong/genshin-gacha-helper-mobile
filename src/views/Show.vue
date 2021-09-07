
<template>
<div>
  <!-- 顶部自定义导航 -->
  <topNav ref="nav" @exportExcel="exportExcel" @exportJson="exportJson" @afterRead="afterRead" @filter="filter"></topNav>

<van-tabs v-model:active="active" >
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
    <van-cell center title="显示五星出货次数图">
      <template #right-icon>
        <van-switch v-model="show5LineCharts" size="16" />
      </template>
    </van-cell>
    <div :style="show5LineCharts?'':'display:none'">
      <v-chart  autoresize  style="height:60vh;" :option="lineOptionComputed.rank5"/>
    </div>
  </van-tab>
  <van-tab title="祈愿次数">
    <div>
      <swiper
    :direction="'horizontal'"
    :slidesPerView="'auto'"
    :freeMode="true"
    :scrollbar="true"
    :mousewheel="true"
  >
    <swiper-slide>
        <v-chart :init-options= "{width:800,height:160}" :option="heatmapOptionComputed"/>
    </swiper-slide>
  </swiper>
    </div>
    <div>
      <v-chart autoresize style="height:60vh" :option="barOptionComputed"/>
    </div>
  </van-tab>
  <van-tab title="词云">
    <div>
    <v-chart style="height:80vh;width: auto;margin: 0 auto"  autoresize :option="wordOptionComputed"/>
    </div>
  </van-tab>
</van-tabs>
<div>{{}}</div>
</div>
</template>
<style>
  .swiper {
  width: 100%;
  height: 100%;
  }
  .swiper-slide {
      overflow: auto;  
      -webkit-overflow-scrolling: touch;   
  }
</style>
<script setup name="Show">
import { onMounted,ref,computed, watch } from 'vue'
import { useRoute } from 'vue-router'

import { Swiper, SwiperSlide } from 'swiper/vue'
import "swiper/css/scrollbar"
import 'swiper/css'
import SwiperCore, { Scrollbar,Mousewheel } from 'swiper'
SwiperCore.use([Scrollbar,Mousewheel])

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
import {gExcel,gRawJson,mergeJson,fileToJson} from '../utils/dealData.js'

const route = useRoute();
const nav = ref(null)
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

// 传来的数据存储的List
const dataList=ref([])
watch(()=>dataList.value,()=>{
  console.log("dataList changed")
})

const tmpList = ref([])
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

// 由子组件触发
const filter = ()=>{
  StartDate.value = dayjs(nav.value.menu.startDate).format("YYYY-MM-DD HH:mm")
  EndDate.value = dayjs(nav.value.menu.endDate).format("YYYY-MM-DD HH:mm")
  let tmp = dataList.value.sort(sortDataById).reverse()
  let group = nav.value.menu.gachaGroup
  tmpList.value = _.cloneDeep(tmp.filter(elem=>{
    return group.indexOf(elem.gacha_type)!=-1&&dayjs(elem.time).isBetween(StartDate.value, EndDate.value, null, '[]')
  }))
}
// 在dataList改变的时候进行计算
// 出货消耗次数，未筛选，基于dataList
const rankList= computed(()=>{
  let gachaRes = {}
  gachaRes["all"] = {rank5:[],rank4:[]}
    for(const i in gachaCode){
        let gacha = _.cloneDeep(dataList.value.filter(elem=>{return elem.gacha_type==gachaCode[i]}).sort(sortDataById).reverse())
        let count5 = 1
        let count4 = 1
        let restmp = gacha.reduce((total,currentValue)=>{
            if(currentValue.rank_type=="5"){
                currentValue.rank5count = count5
                total.rank5.push(currentValue)
                count5=0
                count4=0
            }else if(currentValue.rank_type=="4"){
                currentValue.rank4count = count4
                total.rank4.push(currentValue)
                count4=0
            }
            count4++
            count5++
            return total
        },{rank5:[],rank4:[]})
        gachaRes[gachaCode[i]] = restmp
        gachaRes["all"].rank5 = gachaRes["all"].rank5.concat(gachaRes[gachaCode[i]].rank5).sort(sortDataById).reverse()
        gachaRes["all"].rank4 = gachaRes["all"].rank4.concat(gachaRes[gachaCode[i]].rank4).sort(sortDataById).reverse()
    }
    return gachaRes
})
// 经过筛选的rankList,tmpList改变之后再筛选
// 此处应该在filter 确定之后再筛选
const rankListFiltered = ref({"all":{},"100":{},"200":{},"301":{},"302":{}})
// 当进行筛选的时候，触发rankList的筛选
watch(()=>tmpList.value,()=>{
  console.log("watchRankList")
  let rankArray = ["rank5","rank4"]
  let rankListComputed = {}
  for(let i in gachaCodeAll){
    rankListComputed[gachaCodeAll[i]] = {}
    for(let j in rankArray){
      rankListComputed[gachaCodeAll[i]][rankArray[j]] = rankList.value[gachaCodeAll[i]][rankArray[j]].filter(elem =>{
          return nav.value.menu.gachaGroup.indexOf(elem.gacha_type)!=-1&&dayjs(elem.time).isBetween(StartDate.value, EndDate.value, null, '[]')
      })
      rankListFiltered.value[gachaCodeAll[i]][rankArray[j]] = _.cloneDeep(rankListComputed[gachaCodeAll[i]][rankArray[j]]).sort(sortDataById).reverse()
    }
  }
})
// 出货次数均值,基于rankListFiltered
const rankAvg = computed(()=>{
  let rankArray = ["rank5","rank4"]
  // let 
  let avgRes = {}
  for(let j in rankArray){
    avgRes[rankArray[j]] = {}
    for (const i in gachaCodeAll){
      let total=rankListFiltered.value[gachaCodeAll[i]][rankArray[j]].reduce((sum,currentValue)=>{
        sum = currentValue[j==1?"count4":"count5"] + sum
        return sum
      },0)
      avgRes[rankArray[j]][gachaCodeAll[i]]=((total==0)?0:total/rankListFiltered.value[gachaCodeAll[i]][rankArray[j]].length).toFixed(2)
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
      // 图例配置
      legend: {
          top:"8%",
          type: "scroll",
          itemGap:6,
          itemWidth:14,
          left: 'center',
      },
      color:['#5470c6', '#AD1AF5', '#fac858', '#ff8c00', '#ffe700'],
      series: [{
        name: ' ',
        type: 'pie',
        top:"15%",
        radius: '50%',
        label:{
          formatter: function (params) {
              let str = params.name + "\n";
              str=str+""+params.value
              let per = params.percent
              str = str+"("+per+"%)"
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
    for(let i in type){
        series.push({
            name:type[i],
            value: data.filter(elem=>elem.rank_type==type[i].slice(0,1)&&elem.item_type==type[i].slice(2)).length
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
      data: ["3星武器","4星武器","5星武器","4星角色","5星角色"]
  },
  // grid: {left: '3%',right: '4%',containLabel: true},
  xAxis: [{type: 'category',data: [" "]}],
  yAxis: [{type: 'value'}],
  series: [
      {
        name: '3星武器',type: 'bar',stack:'day',emphasis: {focus: 'series'},
        data: [0],legendHoverLink: false
      },{
          name: '4星武器',type: 'bar',stack:'day',emphasis: {focus: 'series'},
          data: [0],legendHoverLink: false
      },{
          name: '5星武器',type: 'bar',stack:'day',emphasis: {focus: 'series'},
          data: [0],legendHoverLink: false
      },{
          name: '4星角色',type: 'bar',stack:'day',emphasis: {focus: 'series'},
          data: [0],legendHoverLink: false
      },{
          name: '5星角色',type: 'bar',stack:'day',emphasis: {focus: 'series'},
          data: [0],legendHoverLink: false
      }]
}
  console.log("computedBarOption")
  let data = tmpList.value
  let type = ["3星武器","4星武器","5星武器","4星角色","5星角色"]
  let bucket = {}
  let index = []
  if(data.length<=0){
    return
  }
  for (let i in type){
    bucket[type[i]] = []
  }
  // 先按日期分组
  let grouped = _.groupBy(data,elem=>elem.time.slice(0,10))
  // 对日期遍历
  for (let item in _.keys(grouped)){
    index.push(_.keys(grouped)[item])
    let counted = _.countBy(grouped[_.keys(grouped)[item]],elem=>elem.rank_type+"星"+elem.item_type)
    for (let i in type){
      bucket[type[i]].push(counted[type[i]]||0)
    }
  }
  option.xAxis[0].data = index
  for(let i in type){
    option.series[i].data=bucket[type[i]]
  }
  return option
})

// 热力图,基于tmpList.value
const heatmapOptionComputed = computed(()=>{
  let option = {
      title: {left: 'left',text: '祈愿热力图'},
      tooltip: {
        formatter:function (params) {return params.data[0]+" : "+params.data[1]}
      },
      calendar: {
          splitLine:{show:false},
          top: 50,
          cellSize: [14, 14],
          range: ['2021-04-15', dayjs().format("YYYY-MM-DD")],
          itemStyle: {borderWidth: 4,borderColor:"#ffffff"},
          dayLabel:{firstDay:1,position:"end",nameMap:"cn"},
          monthLabel:{fontSize:10},
          yearLabel: {show: false,}
      },
      visualMap:{
        type:"piecewise",
        // 朝向水平 超出部分无法换行
        // orient: 'horizontal',
        itemGap:5,
        textGap:2,
        top: 30,    
        itemWidth:12,
        itemHeight:12,
        pieces: [{min:50,color:'#134121'},
          // {min: 50,max:100,color:'#19532B'},
          {min: 20, max: 50,color:'#24763D'},
          {min: 10, max: 20,color:'#2B8D49'},
          {min: 5, max: 10,color:'#3AC063'},
          {min: 3, max: 5,color:"#72D490"},
          {min: 1, max: 3,color:"#9be9a8"},
          {max: 1,color:"#ebedf0"}],
      },
      series: {type: 'heatmap',coordinateSystem: 'calendar',data: []}
  }
    console.log("watchHeatmapOption")
  let data = tmpList.value
  let heatmapData = []
  let currentDate = dayjs("2020-09-15",'YYYY-MM-DD')
  let heatmapRange=[]
  if(data.length>0){
      currentDate = dayjs(data[0].time.slice(0,10),'YYYY-MM-DD')
      heatmapRange.push(data[0].time.slice(0,10))
      let endDay= dayjs(data[data.length-1].time.slice(0,10)).add(1, 'day').format('YYYY-MM-DD')
      heatmapRange.push(endDay)
      while(currentDate.isSameOrBefore(dayjs(data[data.length-1].time.slice(0,10),'YYYY-MM-DD'))){
          let total = data.filter(function(value, index, array){
              return value.time.slice(0,10) == this
          },currentDate.format('YYYY-MM-DD')).length
          heatmapData.push([currentDate.format('YYYY-MM-DD'),total])
          currentDate = currentDate.add(1,"day")
      }
  }
  option.series.data=heatmapData
  option.calendar.range=heatmapRange
  return option
})
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
    let data = tmpList.value
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

// 线图,基于rankListFiltered
// 出货次数分布(同时提供多五星出货次数分布)
const lineOptionComputed = computed(()=>{
  let rankArray = ["rank5","rank4"]
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
    for(let i in gachaNameAll){      
      let freqArray = new Array(j==1?10:90).fill(0)
      rankListFiltered.value[gachaCodeAll[i]][rankArray[j]].forEach(elem=>{
        freqArray[(j==1?elem.count4:elem.count5)-1]++
      })
      option.series.push({
        name:gachaNameAll[i],
        data:freqArray,
        type: 'line',
        smooth: true
      })
    }
    res[rankArray[j]] = option
  }
  return res
})


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
  filter()
  localStorage.setItem("dataList", JSON.stringify(dataList.value));
}catch{
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

// 读取JSON文件之后
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
      console.log("error1")
      Notify({ type: 'danger', message: '合并失败,可能是哪里出了问题🙁'});
    }
}catch{
  console.log("error2")
    Notify({ type: 'danger', message: '合并失败，可能是哪里出了问题🙁'});
}
}
// 导出Excel
const exportExcel = ()=>{
  let res = gExcel(_.cloneDeep(dataList.value))
  Notify({ type: 'success', message: '导出成功' });
}
// 导出JSON
const exportJson = ()=>{
  let res = gRawJson(_.cloneDeep(dataList.value))
  Notify({ type: 'success', message: '导出成功' });
}
</script>
