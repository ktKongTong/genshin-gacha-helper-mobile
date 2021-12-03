<template>
<div class="mytopNav">
    <!-- 左侧栏 -->
    <div class='nav-left'  v-on:click="clickLeftMenu">
    <van-icon name="ellipsis" />
    </div>
    <!-- <div class="nav-center">
      quick select
    </div> -->
    <!-- 右侧栏 -->
    <div class="nav-right">
    <van-popover v-model:show="showPopoverRight" placement="bottom-end">
        <van-uploader accept='application/json' :after-read="afterRead">
        <van-cell title="合并历史记录(JSON)" />
      </van-uploader>
    <van-cell-group>
      <!-- JSON/Excel导出 -->
      <van-cell title="JSON  记录导出"  v-on:click="exportJson"/>
      <van-cell title="Excel 记录导出"  v-on:click="clickRightMenu('exportExcel')"/>
      <!-- <van-cell title="生成祈愿报告" /> -->
      <!-- 跳转分析祈愿 -->
      <van-cell title="祈愿记录分析工具" arrow-direction='t' is-link url="https://genshin-gacha-analyzer.vercel.app/"/>
      <!-- <van-cell title="GitHub反馈" arrow-direction='t' is-link url="https://genshin-gacha-analyzer.vercel.app/"/> -->
    </van-cell-group>
    <template #reference>
      <van-icon name="add-o" />
    </template>
    </van-popover>
    </div>
</div>
<select-menu ref="menu" @filterSubmit="submit" :show="showPopoverLeft"></select-menu>
</template>

<script setup name='topNav'>

import { Notify } from 'vant';
import sortDataById from '../utils/dealData.js'
import _ from 'lodash'
import selectMenu from './SelectMenu.vue'
import {ref,inject} from 'vue'


const emit = defineEmits(['exportJson', 'exportExcel','afterRead','filter'])
const menu = ref(null)
defineExpose({
  menu
})
const showPopoverLeft = ref(false)
const showPopoverRight = ref(false)
const closePopoverRight = () => {
  showPopoverRight.value=!showPopoverRight.value;
}
const afterRead = (file)=>{
  showPopoverRight.value=!showPopoverRight.value;
  emit('afterRead',file)
}
const submit = () =>{
  clickLeftMenu()
  emit("filter")
}
const clickLeftMenu = ()=>{
  showPopoverLeft.value = !showPopoverLeft.value
  document.body.style.overflow = showPopoverLeft.value?'hidden':''
}

const clickRightMenu = (name)=>{
  showPopoverRight.value=!showPopoverRight.value;
  
  emit(name)
}

const dataList = inject('gachaDataList')

const tL=[{"name":"角色活动祈愿","value":"301"},
{"name":"常驻祈愿","value":"200"},
{"name":"新手祈愿","value":"100"},
{"name":"武器活动祈愿","value":"302"}]


  // 导出Excel
  // const exportExcel = ()=>{
  //   let res = gExcel(_.cloneDeep(dataList))
  //   Notify({ type: 'success', message: '导出成功' });
  // }


  
  // 导出JSON
  const exportJson = ()=>{
    let DL = dataList.value
    // let res = gJson(_.cloneDeep(dataList))
    let  res = _.cloneDeep(DL)
    console.log(res)
    // 导出json数据格式
    let ret = {gachaLog:{100:[],200:[],301:[],302:[],uid:""},
        gachaType:[{id:"14",key:"100",name:"新手祈愿"},{id:"4",key:"200",name:"常驻祈愿"},
        {id:"15",key:"301",name:"角色活动祈愿"},{id:"16",key:"302",name:"武器活动祈愿"}]}
    if(res.length>0){
        ret.uid=res[0].uid
    }
    tL.forEach(elem => {
        let data = res.filter(item=>item.gacha_type==elem["value"])
        // data = data.sort(sortDataById).reverse()
        ret.gachaLog[parseInt(elem.value)]=data
    })
    var json = JSON.stringify(ret,null,"\t");
    const blob = new Blob([json], {type: 'application/json'})
    var d = new Date()
    let time = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "
    +d.getHours()+"-"+d.getMinutes()+"-"+d.getSeconds()
    saveAs(blob,"ysdata"+"-"+ret.uid+"_"+time+".json")
    // let res = gRawJson(_.cloneDeep(dataList))
    Notify({ type: 'success', message: '导出成功' });
    closePopoverRight();
  }
</script>

<style scoped>
  .mytopNav{
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    height: 50px;
    background: white;
    z-index: 999;
  }
  .nav-left{
    display: block;
    width: 20vw;
    text-align: start;
    padding: 0 16px;
  }
  .nav-center{
    text-align: center;
    display: flex;
    padding: 0 16px;
  }
  .nav-right{
    display: block;
    width: 20vw;
    text-align: end;
    padding: 0 16px;
  }
</style>
