
<template>
<div>
  <topNav ref="nav" @exportExcel="exportExcel" @exportJson="exportJson" @afterRead="afterRead" @filter="filter"></topNav>
<!-- 顶部自定义导航 -->
<van-tabs v-model:active="active" >
  <van-tab title="总览">
    <div>
      <div>
        <v-chart autoresize style="height:60vh" :option="pieOption"/>
      </div>
      <div>
      <van-collapse :border="false" v-model="activeNames">
          <van-collapse-item name="5">
            <template #title>
            <div>
              <div style="display:flex;align-items:center">
                <van-rate v-model="rate[0]" value="5"  color="#ffd21e" readonly></van-rate>
                <span style="color:#ffd21e;margin-left:auto;margin-right:20px;font-size:16px"> {{rankRateInfo.rank5Rate}}%</span>
              </div>
              <div  style="color:#ffd21e;font-size: 13px;display:flex;align-items:center">平均出货次数: {{rank5Avg["all"]}}</div>
              </div>
            </template>
              <div style="margin:0 auto">
                <van-tag style="margin:2px 2px" size="medium" type="primary"  plain v-for="i in rank5RoleList['all'].concat(rank5WeaponList['all'])" :key="i">{{ i['name'] }}({{i['count5']}})</van-tag>
              </div>
          </van-collapse-item>
          <van-collapse-item name="4">
            <template #title>
              <div>
                <div style="display:flex;align-items:center">
                  <van-rate v-model="rate[1]"  color="#AD1AF5" readonly></van-rate>
                  <span style="color:#AD1AF5;margin-left:auto;margin-right:20px;font-size:16px"> {{rankRateInfo.rank4Rate}}%</span>
                </div>
                <div  style="color:#AD1AF5;font-size: 13px;display:flex;align-items:center">平均出货次数: {{rank4Avg["all"]}}</div>
              </div>
            </template>
            <div style="margin:0 auto">
                <van-tag style="margin:2px 2px" size="medium" type="primary"  plain v-for="i in rank4RoleList['all'].concat(rank4WeaponList['all'])" :key="i">{{ i['name'] }}({{i['count4']}})</van-tag>
            </div>
          </van-collapse-item>
          <van-collapse-item name="3" :is-link='false' disabled>
            <template #title>
                <div style="display:flex;align-items:center;margin-right:22px">
                  <van-rate v-model="rate[2]"  color="#2C64FF" readonly ></van-rate>
                  <span style="color:#2C64FF;margin-left:auto;margin-right:20px;font-size:16px"> {{rankRateInfo.rank3Rate}}%</span>
                </div>
            </template>
          </van-collapse-item>
      </van-collapse>
      </div>
    </div>
  </van-tab>
  <van-tab  title="出货次数">
    <div>
      <v-chart autoresize style="height:60vh" :option="line4Option"/>
    </div>
    <van-cell center title="显示五星出货次数图">
      <template #right-icon>
        <van-switch v-model="show5LineCharts" size="16" />
      </template>
    </van-cell>
    <div :style="show5LineCharts?'':'display:none'">
      <v-chart  autoresize  style="height:60vh;" :option="line5Option"/>
    </div>
  </van-tab>
  <van-tab title="祈愿次数">
    <div style="width:100vw">
      <swiper
    :direction="'horizontal'"
    :slidesPerView="'auto'"
    :freeMode="true"
    :scrollbar="true"
    :mousewheel="true"
  >
    <swiper-slide>
        <v-chart :init-options= "{width:800,height:150}" :option="heatmapOption"/>
    </swiper-slide>
  </swiper>
    </div>
    <div>
      <v-chart autoresize style="height:60vh" :option="barOption"/>
    </div>
  </van-tab>
  <van-tab title="词云">
    <div>
    <v-chart style="height:80vh;width: auto;margin: 0 auto"  autoresize :option="wordOption"/>
    </div>
  </van-tab>
</van-tabs>
<van-divider/>
</div>
</template>
<style>
/* 日期选择居中 */
    .dateInput > div > div > input{
      text-align: center !important;
    }
    .van-checkbox{
      margin:5px auto;
    }
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
import { Swiper, SwiperSlide } from 'swiper/vue'
import "swiper/css/scrollbar"
import SwiperCore, {
  Scrollbar,Mousewheel
} from 'swiper'
SwiperCore.use([Scrollbar,Mousewheel])
import 'swiper/css'
import '../assets/iconfont.css'
import { Notify } from 'vant';
import {gExcel,gRawJson,mergeJson,fileToJson,getPieData,sortDataById,
getRankCountData,getGachaCount,getWordCloudData,filterData,getHeatMap} from '../utils/dealData.js'
import {dateFormat} from '../utils/dateUtils.js'
import { useRoute } from 'vue-router'
import topNav from '../components/TopNav.vue'
import { onMounted,ref } from 'vue'

      const route = useRoute();
      const nav = ref(null)
      // 为时间选择器设定的时间范围限制
      const StartMinDate = ref(new Date("2020/09/15"))
      const StartMaxDate = ref(new Date())
      const EndMinDate=ref(new Date("2020/09/15"))
      const EndMaxDate=ref(new Date())
      // 实际取值的时间
      const StartDate=ref('2020-09-15 08:00')
      const EndDate=ref(dateFormat("YYYY-mm-dd HH:MM",new Date()))
      // Tabs栏的当前激活页
      const active =ref(0)
      // 总览页面 折叠面板显示项
      const activeNames=ref(["5"])
      const rate=[5,4,3]
      // 传来的数据存储的List
      const dataList=ref([])
      // 5星角色的List
      const rank5RoleList = ref({"all":[],"100":[],"200":[],"301":[],"302":[]})
      // 5星武器的List
      const rank5WeaponList = ref({"all":[],"100":[],"200":[],"301":[],"302":[]})
      // 4星角色List
      const rank4RoleList = ref({"all":[],"100":[],"200":[],"301":[],"302":[]})
      // 4星武器List
      const rank4WeaponList = ref({"all":[],"100":[],"200":[],"301":[],"302":[]})
      // 5星出货均值
      const rank5Avg=ref({"all":0,"100":0,"200":0,"301":0,"302":0})
      // 4星出货均值
      const rank4Avg=ref({"all":0,"100":0,"200":0,"301":0,"302":0})
      const rankRateInfo=ref({
        // 不同星级比率
        rank5Rate:0,rank4Rate:0,rank3Rate:0
      })
      const show5LineCharts=ref(false)
      const filter = ()=>{
        StartDate.value = dateFormat("YYYY-mm-dd HH:MM",nav.value.menu.startDate)
        EndDate.value = dateFormat("YYYY-mm-dd HH:MM",nav.value.menu.endDate)
        console.log()
        Init()
      }
      // 饼图配置项
      const pieOption = ref({
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
          // 指示标签
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
      })
      // 条形图配置项
      const barOption = ref({
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
      })
      // 热力图配置项
      const heatmapOption = ref({
          title: {left: 'left',text: '祈愿热力图'},
          tooltip: {
            formatter:function (params) {return params.data[0]+" : "+params.data[1]}
          },
          calendar: {
              splitLine:{show:false},
              top: 50,
              // left: "15%",
              // right: 30,
              cellSize: [14, 14],
              range: ['2021-04-15', dateFormat("YYYY-mm-dd",new Date())],
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
      })
      // 词云配置项
      const wordOption = ref({
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
      })
      // 氪金大佬/欧皇 多五星专供出货次数分布
      const line5Option = ref({
          grid:{top:"20%"},
          title:{left: 'center',text: '五星出货频次图'},
          xAxis: {type: 'category',data: Array.from(new Array(91).keys()).slice(1)},
          legend: {itemGap:6,itemWidth:14,left: 'center',top:"8%",
            data: ["所有","新手祈愿","常驻祈愿","角色活动祈愿","武器活动祈愿"]},
          yAxis: {type: 'value'},
          series: [{name:"所有",data: [],type: 'line',smooth: true},
          {name:"新手祈愿", data: [],type: 'line', smooth: true},
          {name:"常驻祈愿",data: [],type: 'line',smooth: true},
          {name:"角色活动祈愿",data: [],type: 'line',smooth: true},
          {name:"武器活动祈愿",data: [],type: 'line',smooth: true}]
      })
      // 四星出货次数分布
      const line4Option = ref({
          grid:{top:"20%"},
          title:{left: 'center',text: '四星出货频次图'},
          xAxis: {type: 'category',data: Array.from(new Array(11).keys()).slice(1)},
          legend: {itemGap:6,itemWidth:14,left: 'center',top:"8%",
            data: ["所有","新手祈愿","常驻祈愿","角色活动祈愿","武器活动祈愿"]},
          yAxis: {type: 'value'},
          series: [{name:"所有",data: [],type: 'line',smooth: true},
          {name:"新手祈愿", data: [],type: 'line', smooth: true},
          {name:"常驻祈愿",data: [],type: 'line',smooth: true},
          {name:"角色活动祈愿",data: [],type: 'line',smooth: true},
          {name:"武器活动祈愿",data: [],type: 'line',smooth: true}]
      })


      onMounted(()=>{
    // 读取传过来的数据
      try{
        dataList.value = JSON.parse(route.params.dataList)
      // 合并原有本地数据
      try{
        var tmpList = dataList.value.sort(sortDataById).reverse()
        var oldList = JSON.parse(localStorage.getItem("dataList"))
        if(oldList!=null&&oldList.length>0){
          // 空List合并所有
          let firstData = {id:"200000000000000000"}
          if(tmpList.length>0){
            // 早些的数据Id小
            firstData = tmpList[0]
          }
          oldList.forEach(elem => {
            // 合并
              if(elem.id===firstData.id){    
              }else if(sortDataById(elem,firstData)==1){
              // elemId小于firstId
                  dataList.value.push(elem)
              }
          });
        }
      }catch{

      }
      Init()
      localStorage.setItem("dataList", JSON.stringify(dataList.value));
    }catch{
      Notify({ type: 'danger', message: '数据没传递过来呢,尝试从本地取数据' });
      dataList.value = JSON.parse(localStorage.getItem("dataList"));
      if(dataList.value==null){
        dataList.value = []
      }
      Init()
    }
    })
    // 刷新数据,自动筛选
    const Init = ()=>{
      var data = filterData(dataList.value,StartDate.value,EndDate.value,nav.value.menu.gachaGroup)
      // 饼图
      var ret =  getPieData(data)
      pieOption.value.series[0].data = ret.seriesData
      rankRateInfo.value = ret.rankRateInfo
      // 这个不能使用filter，数据会出错，应该先计算再筛选
      var res = getRankCountData(data,StartDate.value,EndDate.value,nav.value.menu.gachaGroup)
      rank5RoleList.value = res.rank5RoleList
      rank5WeaponList.value = res.rank5WeaponList
      rank4RoleList.value = res.rank4RoleList
      console.log(rank4RoleList.value)
      rank4WeaponList.value = res.rank4WeaponList
      rank5Avg.value = res.rank5Avg
      rank4Avg.value = res.rank4Avg
      // 祈愿频次/与饼图一同计算
      line5Option.value.series[0].data = res.line5Count["all"]
      line5Option.value.series[1].data = res.line5Count["100"]
      line5Option.value.series[2].data = res.line5Count["200"]
      line5Option.value.series[3].data = res.line5Count["301"]
      line5Option.value.series[4].data = res.line5Count["302"]
      line4Option.value.series[0].data = res.line4Count["all"]
      line4Option.value.series[1].data = res.line4Count["100"]
      line4Option.value.series[2].data = res.line4Count["200"]
      line4Option.value.series[3].data = res.line4Count["301"]
      line4Option.value.series[4].data = res.line4Count["302"]
      // 祈愿次数
      var countres = getGachaCount(data)
      barOption.value.xAxis[0].data=countres.barData.index
      barOption.value.series[0].data=countres.barData.rank3weapon
      barOption.value.series[1].data=countres.barData.rank4weapon
      barOption.value.series[2].data=countres.barData.rank5weapon
      barOption.value.series[3].data=countres.barData.rank4role
      barOption.value.series[4].data=countres.barData.rank5role
      // 热力图
      let heatmap = getHeatMap(data)
      heatmapOption.value.series.data=heatmap.data
      heatmapOption.value.calendar.range=heatmap.range
      // 词云
      wordOption.value.series[0].data=getWordCloudData(data)
      
    }
    // 快捷选择池子，时间
    // selectGacha(){
    // },
    // 更新起始/截止日期
    // UpDateTime(){
    //   // 起始日期
    //   if(this.currentPicker){
    //     this.StartDate = dateFormat("YYYY-mm-dd HH:MM",this.tmpDate)
    //     this.EndMinDate = this.tmpDate
    //   }else{
    //     this.EndDate = dateFormat("YYYY-mm-dd HH:MM",this.tmpDate)
    //     this.StartMaxDate = this.tmpDate
    //   }
    //   this.DatePickerShow=false
    //   this.Init()
    // },
    // 读取JSON文件之后
    const afterRead =  async (file)=>{
      try{
          const json=await fileToJson(file.file)
          var res = mergeJson(dataList.value,json)
          if(res.res){
            Notify({ type: 'success', message: '合并成功' });
            Init()
            localStorage.setItem("dataList", JSON.stringify(dataList.value));
          }else{
            Notify({ type: 'danger', message: '合并失败,可能是哪里出了问题🙁'});
          }
      }catch{
          Notify({ type: 'danger', message: '合并失败，可能是哪里出了问题🙁'});
      }
    }
    // 导出Excel
    const exportExcel = ()=>{
      var res = gExcel(dataList.value)
      Notify({ type: 'success', message: '导出成功' });
    }
    // 导出JSON
    const exportJson = ()=>{
      var res = gRawJson(dataList.value)
      Notify({ type: 'success', message: '导出成功' });
    }
</script>
