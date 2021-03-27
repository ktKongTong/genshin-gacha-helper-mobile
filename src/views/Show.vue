
<template>
<div>
<div>
  <van-popup
    :v-model:show="show"
    round
    position="bottom"
    :style="{ height: '70%' }"
    closeable
    close-icon="close" safe-area-inset-bottom
  >
  <Filter/>
  <van-button type="primary" plain v-loading="loading" v-on:click="switchState?flashData():loadData(true)">{{switchState?"刷新数据":"加载数据"}}</van-button>
  <!-- <van-button type="success" plain v-on:click="exportExcel" :disabled="time===0">Excel导出</van-button> -->
  </van-popup>
<van-uploader accept='application/json' :after-read="afterRead">
  <van-button icon="plus" type='success'>合并JSON记录</van-button>
</van-uploader><br>
  <!-- <van-button v-on:click="show=true">筛选</van-button> -->
  <van-button type="success" :style="btDisplay?'':'display:none'" plain v-on:click="exportJson">JSON导出</van-button>
  <van-button type="success" :style="btDisplay?'':'display:none'" plain v-on:click="exportExcel">Excel导出</van-button>
</div>
<van-button type="success" :style="btDisplay?'display:none':''" plain v-on:click="toAna">
祈愿记录分析工具
</van-button>

</div>
</template>

<script>

import {gExcel,gRawJson,mergeJson} from '../utils/dealData.js'
import { Notify } from 'vant';
import Filter from '../components/Filter.vue'
import {fileToJson} from '../utils/dealData.js'
export default {
  name: 'Show',
  data() {
    return {
      btDisplay:true,
      show:false,
      switchState:false,
      dataList:[],
    }
  },
  components: {
    Filter
  },
  created(){
  },
  mounted(){
    this.dataList = JSON.parse(this.$route.params.dataList)
  },
  methods:{
    async afterRead(file){
      try{
          const json=await fileToJson(file.file)
          console.log(json)
          mergeJson(this.dataList,json)
      }catch{
      }
    },
    toAna(){
      window.location.href="https://genshin-gacha-analyzer.vercel.app/"
    },
    exportExcel(){
      var res = gExcel(this.dataList)
      console.log(res)
      Notify({ type: 'success', message: '导出成功' }); 
      this.btDisplay=false
    },
    exportJson(){
      var res = gRawJson(this.dataList)
      Notify({ type: 'success', message: '导出成功' }); 
      this.btDisplay=false
    }
  }
}
</script>
