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
      <van-cell title="JSON  记录导出"  v-on:click="clickRightMenu('exportJson')"/>
      <van-cell title="Excel 记录导出"  v-on:click="clickRightMenu('exportExcel')"/>
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

<script setup name='topNav'>
import selectMenu from './SelectMenu.vue'
import {ref} from 'vue'
  const emit = defineEmits(['exportJson', 'exportExcel','afterRead','filter'])
  const menu = ref(null)
  defineExpose({
    menu
  })
  const showPopoverLeft = ref(false)
  const showPopoverRight = ref(false)
  const afterRead = (file)=>{
    showPopoverRight.value=!showPopoverRight.value;
    emit('afterRead',file)
  }
  const submit = () =>{
    clickLeftMenu()
    emit("filter")
  }
  const clickRightMenu = (name)=>{
    showPopoverRight.value=!showPopoverRight.value;
    emit(name)
  }
  const clickLeftMenu = ()=>{
    showPopoverLeft.value = !showPopoverLeft.value
    document.body.style.overflow = showPopoverLeft.value?'hidden':''
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
