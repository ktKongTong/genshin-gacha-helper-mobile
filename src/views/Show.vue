
<template>
<div>
  <!-- 顶部导航 -->
<van-nav-bar title="" fixed left-text="筛选" :border='false' :placeholder='true'>
  <!-- 筛选 -->
  <template #left>
    <van-icon class-prefix="iconfont icon-shaixuan" name="extra"></van-icon>
  </template>
  <!-- 菜单弹出框 -->
  <template #right>
    <van-popover v-model:show="showPopover" placement="bottom-end">
        <van-uploader accept='application/json' :after-read="afterRead">
        <van-cell title="合并历史记录(JSON)" />
      </van-uploader>
    <van-cell-group>
      <!-- JSON/Excel导出 -->
      <van-cell title="JSON  记录导出"  v-on:click="exportJson"/>
      <van-cell title="Excel 记录导出"  v-on:click="exportExcel"/>
      <van-cell title="渲染"  v-on:click="Init"/>
      <!-- 跳转分析结缘 -->
      <van-cell title="祈愿记录分析工具" arrow-direction='test' is-link url="https://genshin-gacha-analyzer.vercel.app/"/>
    </van-cell-group>
      <template #reference>
        <van-icon class-prefix="iconfont icon-xuanxiang" name="extra"/>
      </template>
    </van-popover>
  </template>
</van-nav-bar>
<van-tabs v-model:active="active" swipeable>
  <van-tab title="总览">
  <div>
    <v-chart autoresize style="height:60vh" :option="pieOption"/>
  </div>
  <div>
    <van-collapse :border="false" v-model="activeNames">
          <van-collapse-item name="5">
            <template #title>
            <div>
              <div style="display:flex;align-items:center">
                <van-rate v-model="rate[0]"  color="#ffd21e" readonly></van-rate>
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
  <div>
    <!-- 筛选弹出框 -->
    <van-popup
      :v-model:show="show"
      round
      position="bottom"
      :style="{ height: '70%' }"
      closeable
      close-icon="close" safe-area-inset-bottom
    >
      <Filter/>
    </van-popup>

  </div>
</div>

</template>
<script>
import { ref } from 'vue';
import '../assets/iconfont.css'
import { Notify,Toast,Tab, Tabs,Tabbar,TabbarItem } from 'vant';
import Filter from '../components/Filter.vue'
import {gExcel,gRawJson,mergeJson,fileToJson,getPieData,getRankCountData,getGachaCount,getWordCloudData,getBase64} from '../utils/dealData.js'

export default {
  name: 'Show',
  setup() {
  },
  data() {
    return {
      activeNames:["5"],
      rate:[5,4,3],
      showPopover:false,
      active :0,
      btDisplay:true,
      show:false,
      switchState:false,
      dataList:[],
      rank5RoleList : {"all":[],"100":[],"200":[],"301":[],"302":[]},
      rank5WeaponList : {"all":[],"100":[],"200":[],"301":[],"302":[]},
      rank4RoleList : {"all":[],"100":[],"200":[],"301":[],"302":[]},
      rank4WeaponList : {"all":[],"100":[],"200":[],"301":[],"302":[]},
      rank5Avg:{"all":0,"100":0,"200":0,"301":0,"302":0},
      rank4Avg:{"all":0,"100":0,"200":0,"301":0,"302":0},
      rankRateInfo:{
        rank5Rate:0,rank4Rate:0,rank3Rate:0
      },
      pieOption:{
                    title: {
                        text: '祈愿总览',
                        left: 'center'
                    },
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
                        top:"8%",
                        type: "scroll",
                        itemGap:6,
                        itemWidth:14,
                        left: 'center',
                    },
                    color:['#5470c6', '#AD1AF5', '#fac858', '#ff8c00', '#ffe700'],
                    series: [
                        {
                            name: ' ',
                            type: 'pie',
                            radius: '50%',
                            label:{
                                // formatter: '{b}({c}): {d}%',
                                formatter: function (params) {
                                    let str = params.name + "\n";
                                    str=str+""+params.value
                                    let per = params.percent
                                    str = str+"("+per+"%)"
                                    return str;
                                },
                                // color:['#5470c6', '#AD1AF5', '#fac858', '#ff8c00', '#ffe700'],
                            },
                            top:"15%",
                            data: "",legendHoverLink: false
                        }
                    ]
      },
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
      heatmapOption:{
          title: {
              left: 'center',
              text: '祈愿热力图'
          },
          tooltip: {
            formatter:function (params) {
                return params.data[0]+" : "+params.data[1]
            }
          },
          calendar: {
              splitLine:{
                show:false
              },
              top: 50,
              left: "15%",
              right: 30,
              cellSize: [15, 15],
              range: ['2020-09-25', '2021-03-30'],
              itemStyle: {
                  borderWidth: 4,
                  borderColor:"#ffffff"
              },
              dayLabel:{
                firstDay:1,
                position:"end",
                nameMap:"cn"
              },
              monthLabel:{fontSize:10},
              yearLabel: {show: false,}
          },
          visualMap:{
            type:"piecewise",
            // orient: 'horizontal',
            itemGap:5,
            textGap:2,
            top: 30,    
            itemWidth:12,
            itemHeight:12,
            pieces: [
                {min:50,color:'#134121'},
                // {min: 50,max:100,color:'#19532B'},
                {min: 20, max: 50,color:'#24763D'},
                {min: 10, max: 20,color:'#2B8D49'},
                {min: 5, max: 10,color:'#3AC063'},
                {min: 3, max: 5,color:"#72D490"},
                {min: 1, max: 3,color:"#9be9a8"},
                {max: 1,color:"#ebedf0"}
            ],

          },
          series: {
              type: 'heatmap',
              coordinateSystem: 'calendar',
              data: []
          }
      },
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
        width: '70%',
        height: '80%',
        right: null,
        bottom: null,
        sizeRange: [20, 35],
        rotationRange: [-90, 90],
        rotationStep: 45,
        gridSize: 1,
        // drawOutOfBound: false,
        layoutAnimation: true,
        textStyle: {
            fontFamily: 'sans-serif',
            fontWeight: 'bold',
            // color:['#5470c6', '#AD1AF5', '#fac858', '#ff8c00', '#ffe700'],
            color: function () {
                return 'rgb(' + [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                ].join(',') + ')';
            }
        },
        emphasis: {
            focus: 'self',
            textStyle: {
                shadowBlur: 10,
                shadowColor: '#333'
            }
        },
        data: []
        }]
      },
    }
  },
  components: {
    Filter,
  },
  created(){
  },
  mounted(){
    // 读取传过来的数据
    try{
      this.dataList = JSON.parse(this.$route.params.dataList)
      this.Init()
      localStorage.setItem("dataList", JSON.stringify(this.dataList));
    }catch{
      Notify({ type: 'danger', message: '数据没传递过来呢,尝试从本地取数据' });
      this.dataList = JSON.parse(localStorage.getItem("dataList"));
      this.Init()
    }
  },
  methods:{
    Init(){
      var ret =  getPieData(this.dataList)
      this.pieOption.series[0].data = ret.seriesData
      this.rankRateInfo = ret.rankRateInfo
      var res = getRankCountData(this.dataList)
      this.rank5RoleList = res.rank5RoleList
      this.rank5WeaponList = res.rank5WeaponList
      this.rank4RoleList = res.rank4RoleList
      this.rank4WeaponList = res.rank4WeaponList
      this.rank5Avg = res.rank5Avg
      this.rank4Avg = res.rank4Avg
      var countres = getGachaCount(this.dataList)
      this.barOption.xAxis[0].data=countres.barData.index
      this.barOption.series[0].data=countres.barData.rank3weapon
      this.barOption.series[1].data=countres.barData.rank4weapon
      this.barOption.series[2].data=countres.barData.rank5weapon
      this.barOption.series[3].data=countres.barData.rank4role
      this.barOption.series[4].data=countres.barData.rank5role
      this.heatmapOption.series.data=countres.heatmap.data
      this.heatmapOption.calendar.range=countres.heatmap.range
      this.wordOption.series[0].data=getWordCloudData(this.dataList)
      this.showPopover=false
    },
    getImgToBase64(url,callback){
    var canvas = document.createElement('canvas'),
      ctx = canvas.getContext('2d'),
      img = new Image;
    img.crossOrigin = 'Anonymous';
    img.onload = function(){
      canvas.height = img.height;
      canvas.width = img.width;
      ctx.drawImage(img,0,0);
      var dataURL = canvas.toDataURL('image/png');
      callback(dataURL);
      canvas = null;
    };
    img.src = url;
  },

    // 读取文件之后
    async afterRead(file){
      this.showPopover=false
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
      this.showPopover=false
    },
    // 导出JSON
    exportJson(){
      var res = gRawJson(this.dataList)
      Notify({ type: 'success', message: '导出成功' });
      this.showPopover=false
    },
  }
}
</script>
