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
      <van-cell title="JSON  记录导出"  v-on:click="context.emit('exportJson')"/>
      <van-cell title="Excel 记录导出"  v-on:click="context.emit('exportExcel')"/>
      <!-- 跳转分析祈愿 -->
      <van-cell title="祈愿记录分析工具" arrow-direction='t' is-link url="https://genshin-gacha-analyzer.vercel.app/"/>
    </van-cell-group>
    <template #reference>
      <van-icon name="add-o" />
    </template>
    </van-popover>
    </div>
    
</div>
<select-menu ref="menu" @filterSubmit="submit" :show="showPopoverLeft"></select-menu>
</template>

<script>
import selectMenu from './SelectMenu.vue'
import {ref,defineComponent,onMounted} from 'vue'
export default defineComponent({
  name:'topNav',
  components:{
    selectMenu
  },
  emits:{
      "exportJson":null,
      "exportExcel":null,
      "afterRead":null
  },
  setup(props, context){

    const menu = ref(null)
    const showPopoverLeft = ref(false)
    const showPopoverRight = ref(false)
    const tmpDate = ref("")
    const afterRead = (file)=>{
      console.log(file)
      context.emit('afterRead',file)
    }
    const submit = () =>{
      click()
      console.log(menu.value)
      // 更新数据
    }
    const click = ()=>{
      showPopoverLeft.value = !showPopoverLeft.value
      if(showPopoverLeft.value){
        document.body.style.overflow = 'hidden'
      }else{
        document.body.style.overflow = ''
      }
    }
    return{
        showPopoverLeft,showPopoverRight,
        click,submit,menu,afterRead,context
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
