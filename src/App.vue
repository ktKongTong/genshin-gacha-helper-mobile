<template>
  <router-view class="content"/>
<div class='footer'>任何想法建议/Bug可到
<van-tag v-on:click="jump"  plain type="primary">Github Issue</van-tag>进行反馈
</div>
</template>
<script setup>
    const jump = ()=>{
      window.location.href='https://github.com/ktKongTong/genshin-gacha-helper-mobile/issues'
    }
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.content{
  height: 100%;
  flex:1;
}
.footer{
  font-size:12px;
  padding-bottom: 10px;
  padding-top:10px;
  left: 0%;
  right: 0%;
  flex: 0;
}
</style>