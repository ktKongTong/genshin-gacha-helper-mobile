
<template>
<div>
<!-- 顶部自定义导航 -->
<div style="width:100%;">
  <div style="width:100vw;display:flex; align-items:center" class="topNav">
    <div style="width:12vw;height:100%">
      <van-popover  v-model:show="showPopoverLeft" placement="bottom-start">
        <div style="margin:20px 20px 10px 20px;">
          <van-checkbox-group v-model="checkboxGroup">
            <van-checkbox v-for="name in names" :name="name['value']" :key="name['value']">{{name["name"]}}</van-checkbox>
          </van-checkbox-group>
          <div style="display:flex">
          <van-button style="margin:4px auto" v-on:click="gachaTypeUpDate" size="small">确认</van-button>
          </div>
        </div>
        <template #reference>
          <van-icon style="margin:0 auto" class-prefix="iconfont icon-menu" name="extra"></van-icon>
        </template>
      </van-popover>
    </div>
    <div style="display:flex;width:76vw" >
      <van-field v-model="StartDate" class='dateInput' style="margin:0 auto" label-width='0' placeholder="起始日期" disabled v-on:click="DatePicker(true)"/>
      <!-- <div style="display:flex;align-items:center;margin:0 auto"  v-on:click="selectGacha"> -->
      <!-- <span style="font-size:12px"> 快捷选择</span> -->
      <!-- </div> -->
      <van-field v-model="EndDate" class='dateInput'  style="margin:0 auto"  label-width='0' placeholder="结束日期" disabled v-on:click="DatePicker(false)" />
      <van-popup v-model:show="DatePickerShow" :closeable="false" position="bottom" round :style="{ height: '400px' }">
        <div style="line-height:2;margin-top:15px;display:flex;width:100vw">
          <span style="margin:0 auto">{{currentPicker?'起始日期':'截止日期'}}</span>
          <span style="margin-right:30px;margin-left:auto;color:#0000ff" v-on:click="UpDateTime">确认</span>      
        </div>
        <van-datetime-picker v-model="tmpDate" type="datetime" :min-date="currentPicker?StartMinDate:EndMinDate" :max-date="currentPicker?StartMaxDate:EndMaxDate">
        <template #default></template></van-datetime-picker>
      </van-popup>
    </div>
    <div style="width:12vw">
    <van-popover v-model:show="showPopoverRight" placement="bottom-end">
        <van-uploader accept='application/json' :after-read="afterRead">
        <van-cell title="合并历史记录(JSON)" />
      </van-uploader>
    <van-cell-group>
      <!-- JSON/Excel导出 -->
      <van-cell title="JSON  记录导出"  v-on:click="exportJson"/>
      <van-cell title="Excel 记录导出"  v-on:click="exportExcel"/>
      <!-- 跳转分析祈愿 -->
      <van-cell title="祈愿记录分析工具" arrow-direction='t' is-link url="https://genshin-gacha-analyzer.vercel.app/"/>
    </van-cell-group>
      <template #reference>
        <van-icon style="margin:0 auto" class-prefix="iconfont icon-shaixuan" name="extra"/>
      </template>
    </van-popover>
    </div>
</div>
</div>
<van-tabs v-model:active="active" swipeable>
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
    <div>
      <v-chart autoresize style="height:30vh" :option="heatmapOption"/>
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
    .topNav > span {
      margin:0 auto;
    }
    .van-checkbox{
      margin:5px auto;
    }
</style>
<script>
import '../assets/iconfont.css'
import { Notify } from 'vant';
import {gExcel,gRawJson,mergeJson,fileToJson,getPieData,sortDataById,
getRankCountData,getGachaCount,getWordCloudData,filterData} from '../utils/dealData.js'
import {dateFormat} from '../utils/dateUtils.js'
export default {
  name: 'Show',
  setup() {
  },
  data() {
    return {
      // 顶部左侧导航栏弹出框
      showPopoverLeft:false,
      // 弹出框内容 复选框
      checkboxGroup: ["100","200","301","302"],
      names: [{"name":"新手祈愿", "value":"100"},{"name":"常驻祈愿", "value":"200"},{"name":"角色活动祈愿", "value":"301"},{"name":"武器活动祈愿", "value":"302"}],      
      // 是否显示时间选择器
      DatePickerShow:false,
      // 当前显示起始/截止时间选择器
      currentPicker:true,
      // 时间选择器的临时时间
      tmpDate:new Date(),
      // 为时间选择器设定的时间范围限制
      StartMinDate:new Date("2020/09/15"),
      StartMaxDate:new Date(),
      EndMinDate:new Date("2020/09/15"),
      EndMaxDate:new Date(),
      // 实际取值的时间
      StartDate:'2020-09-15 08:00',
      EndDate:dateFormat("YYYY-mm-dd HH:MM",new Date()),
      // 顶部右侧导航栏弹出框
      showPopoverRight:false,
      // Tabs栏的当前激活页
      active :0,
      // 总览页面 折叠面板显示项
      activeNames:["5"],
      rate:[5,4,3],
      // 传来的数据存储的List
      dataList:[],
      // 5星角色的List
      rank5RoleList : {"all":[],"100":[],"200":[],"301":[],"302":[]},
      // 5星武器的List
      rank5WeaponList : {"all":[],"100":[],"200":[],"301":[],"302":[]},
      // 4星角色List
      rank4RoleList : {"all":[],"100":[],"200":[],"301":[],"302":[]},
      // 4星武器List
      rank4WeaponList : {"all":[],"100":[],"200":[],"301":[],"302":[]},
      // 5星出货均值
      rank5Avg:{"all":0,"100":0,"200":0,"301":0,"302":0},
      // 4星出货均值
      rank4Avg:{"all":0,"100":0,"200":0,"301":0,"302":0},
      rankRateInfo:{
        // 不同星级比率
        rank5Rate:0,rank4Rate:0,rank3Rate:0
      },
      show5LineCharts:false,
      // 饼图配置项
      pieOption:{
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
      },
      // 条形图配置项
      barOption: {
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
      },
      // 热力图配置项
      heatmapOption:{
          title: {left: 'center',text: '祈愿热力图'},
          tooltip: {
            formatter:function (params) {return params.data[0]+" : "+params.data[1]}
          },
          calendar: {
              splitLine:{show:false},
              top: 50,
              // left: "15%",
              // right: 30,
              cellSize: [12, 12],
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
      },
      // 词云配置项
      wordOption: {
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
      },
      // 氪金大佬/欧皇 多五星专供出货次数分布
      line5Option:{
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
      },
      // 四星出货次数分布
      line4Option:{
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
      },
      test:"test"
    }
  },
  components: {
  },
  created(){
  },
  mounted(){
    // 读取传过来的数据
    try{
      this.dataList = JSON.parse(this.$route.params.dataList)
      // 合并原有本地数据
      try{
        var tmpList = this.dataList.sort(sortDataById).reverse()
        var oldList = JSON.parse(localStorage.getItem("dataList"));
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
                  this.dataList.push(elem)
              }
          });
        }
      }catch{

      }
      this.Init()
      localStorage.setItem("dataList", JSON.stringify(this.dataList));
    }catch{
      Notify({ type: 'danger', message: '数据没传递过来呢,尝试从本地取数据' });
      this.dataList = JSON.parse(localStorage.getItem("dataList"));
      if(this.dataList==null){
        this.dataList = []
      }
      this.Init()
    }
    // console.log(this.line5Option)
  },
  methods:{
    // 刷新数据,自动筛选
    Init(){
      var dataList = filterData(this.dataList,this.StartDate,this.EndDate,this.checkboxGroup)
      // 饼图
      var ret =  getPieData(dataList)
      this.pieOption.series[0].data = ret.seriesData
      this.rankRateInfo = ret.rankRateInfo
      // 这个不能使用filter，数据会出错，应该先计算再筛选
      var res = getRankCountData(this.dataList,this.StartDate,this.EndDate,this.checkboxGroup)
      this.rank5RoleList = res.rank5RoleList
      this.rank5WeaponList = res.rank5WeaponList
      this.rank4RoleList = res.rank4RoleList
      this.rank4WeaponList = res.rank4WeaponList
      this.rank5Avg = res.rank5Avg
      this.rank4Avg = res.rank4Avg
      // 祈愿频次/与饼图一同计算
      this.line5Option.series[0].data = res.line5Count["all"]
      this.line5Option.series[1].data = res.line5Count["100"]
      this.line5Option.series[2].data = res.line5Count["200"]
      this.line5Option.series[3].data = res.line5Count["301"]
      this.line5Option.series[4].data = res.line5Count["302"]
      this.line4Option.series[0].data = res.line4Count["all"]
      this.line4Option.series[1].data = res.line4Count["100"]
      this.line4Option.series[2].data = res.line4Count["200"]
      this.line4Option.series[3].data = res.line4Count["301"]
      this.line4Option.series[4].data = res.line4Count["302"]
      // 祈愿次数
      var countres = getGachaCount(dataList)
      this.barOption.xAxis[0].data=countres.barData.index
      this.barOption.series[0].data=countres.barData.rank3weapon
      this.barOption.series[1].data=countres.barData.rank4weapon
      this.barOption.series[2].data=countres.barData.rank5weapon
      this.barOption.series[3].data=countres.barData.rank4role
      this.barOption.series[4].data=countres.barData.rank5role
      this.heatmapOption.series.data=countres.heatmap.data
      this.heatmapOption.calendar.range=countres.heatmap.range
      // 词云
      this.wordOption.series[0].data=getWordCloudData(dataList)
      
    },
    // 快捷选择池子，时间
    selectGacha(){
    },
    // 祈愿类型选择
    gachaTypeUpDate(event){
      // 关闭悬浮框
      this.showPopoverLeft = false
      this.Init()
    },
    // 更新起始/截止日期
    UpDateTime(){
      // 起始日期
      if(this.currentPicker){
        this.StartDate = dateFormat("YYYY-mm-dd HH:MM",this.tmpDate)
        this.EndMinDate = this.tmpDate
      }else{
        this.EndDate = dateFormat("YYYY-mm-dd HH:MM",this.tmpDate)
        this.StartMaxDate = this.tmpDate
      }
      this.DatePickerShow=false
      this.Init()
    },
    // 点击日期输入框控制哪个日期选择器显示
    DatePicker(isStart){
      if(isStart){
        this.currentPicker=true
        this.DatePickerShow=true
      }else{
        this.currentPicker=false
        this.DatePickerShow=true
      }
    },
    // 读取JSON文件之后
    async afterRead(file){
      this.showPopoverRight=false
      try{
          const json=await fileToJson(file.file)
          var res = mergeJson(this.dataList,json)
          if(res.res){
            Notify({ type: 'success', message: '合并成功' });
            this.Init()
            localStorage.setItem("dataList", JSON.stringify(this.dataList));
          }else{
            Notify({ type: 'danger', message: '合并失败,可能是哪里出了问题🙁'});
          }
      }catch{
          Notify({ type: 'danger', message: '合并失败，可能是哪里出了问题🙁'});
      }
    },
    // 导出Excel
    exportExcel(){
      var res = gExcel(this.dataList)
      Notify({ type: 'success', message: '导出成功' });
      this.showPopoverRight=false
    },
    // 导出JSON
    exportJson(){
      var res = gRawJson(this.dataList)
      Notify({ type: 'success', message: '导出成功' });
      this.showPopoverRight=false
    }
  }
}
</script>
