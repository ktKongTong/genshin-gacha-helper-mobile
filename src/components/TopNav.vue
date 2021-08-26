<template>
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
</template>
<script>
import {defineComponent} from 'vue'
export default defineComponent({
  name:'topnav',
  setup(){
    const showPopoverLeft = ref(false)
    const showPopoverRight = ref(false)
    const DatePickerShow=ref(false)
    const StartDate = ref("")
    const EndDate = ref("")
    const tmpDate = ref("")
    return{

    }
  }   
})
</script>