<template>
<div class="mytopNav">
    <!-- 左侧栏 -->
    <div class='nav-left'  v-on:click="click">
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
      <van-cell title="Excel 记录导出"  v-on:click="exportExcel"/>
      <!-- 跳转分析祈愿 -->
      <van-cell title="祈愿记录分析工具" arrow-direction='t' is-link url="https://genshin-gacha-analyzer.vercel.app/"/>
    </van-cell-group>
    <template #reference>
      <van-icon name="add-o" />
    </template>
    </van-popover>
    </div>
    
</div>
<select-menu :show="showPopoverLeft"></select-menu>
</template>

<script>
import selectMenu from './SelectMenu.vue'
import {ref,defineComponent} from 'vue'
export default defineComponent({
  name:'topNav',
  components:{
    selectMenu
  },
  props:{

  },
  setup(props, { attrs, slots, emit, expose }){
    const checkboxGroup=ref(["100","200","301","302"])
    const names = ref([{"name":"新手祈愿", "value":"100"},{"name":"常驻祈愿", "value":"200"},{"name":"角色活动祈愿", "value":"301"},{"name":"武器活动祈愿", "value":"302"}])      
    const showPopoverLeft = ref(false)
    const showPopoverRight = ref(false)
    const DatePickerShow=ref(false)
    const StartDate = ref("2020-09-15")
    const EndDate = ref("2020-09-15")
    const tmpDate = ref("")
    expose({
      StartDate,
      EndDate
    })
    const click = ()=>{
      showPopoverLeft.value = !showPopoverLeft.value
      if(showPopoverLeft.value){
        document.body.style.overflow = 'hidden'
      }else{
        document.body.style.overflow = ''
      }
    }
    return{
        checkboxGroup,names,
        showPopoverLeft,showPopoverRight,DatePickerShow,
        StartDate,EndDate,tmpDate,
        click
    }
  }   
})
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
