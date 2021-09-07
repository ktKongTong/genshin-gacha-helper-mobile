<template>
<div class="menumask" v-if='show' @touchmove.prevent @mousewheel.prevent/>
<transition name="fade">
<div v-if='show'  class="menu">
    <div style="text-align:start;padding:20px 10px;font-size:14px">池子选择</div>
    <div style="margin:10px">
    <van-checkbox-group v-model="gachaGroup">
    <van-checkbox v-for="name in names" :name="name['value']" :key="name['value']">{{name["name"]}}</van-checkbox>
    </van-checkbox-group>
    </div>
    <van-divider/>
    <div style="text-align:start;padding:10px 10px;font-size:14px">起始日期选择</div>     
    <v-date-picker v-model="startDate" is-required :minute-increment='5' :popover='{placement:"auto-end",positionFixed:true}' mode="dateTime" is24hr>
    <template v-slot="{ inputEvents }">
        <van-field class="field" disabled v-on="inputEvents"  v-model="startDateField"/>
    </template>
    </v-date-picker>
    <van-divider/>
    <div style="text-align:start;padding:10px 10px;font-size:14px">终止日期选择</div>
    <v-date-picker v-model="endDate" is-required  :minute-increment='5' :popover='{placement:"auto-end",positionFixed:true}' mode="dateTime" is24hr>
    <template v-slot="{ inputEvents }">
        <van-field class="bottomfield field" disabled v-on="inputEvents" v-model="endDateField"/>
    </template>
    </v-date-picker>
    <van-button v-on:click="emit('filterSubmit')">确定</van-button>
</div>

</transition>
</template>
<script setup name='selectMenu'>
import {computed, ref} from 'vue'
import dayjs from 'dayjs'
dayjs().locale('zh-cn')
const props = defineProps({show:Boolean})
const emit = defineEmits(['filterSubmit'])
const gachaGroup=ref(["100","200","301","302"])
const startDate = ref(dayjs("2020-09-15 08:00").toDate())
const endDate = ref(dayjs().startOf('hour').add(1,'hour').toDate())
defineExpose({
    startDate,endDate,gachaGroup
})
const startDateField = computed(() => dayjs(startDate.value).format("YYYY-MM-DD HH:mm"))
const endDateField = computed(() => dayjs(endDate.value).format("YYYY-MM-DD HH:mm"))
const names = [{"name":"新手祈愿", "value":"100"},{"name":"常驻祈愿", "value":"200"},{"name":"角色活动祈愿", "value":"301"},{"name":"武器活动祈愿", "value":"302"}]
</script>
<style scoped>
    .menumask{
        display: block;
        top: 0;
        position:absolute;
        z-index: 998;
        width: 100%;
        height: 100vh;
        background-color: white;
    }
    .menu{
        height: 100%;
        top: 50px;
        width: 100vw;
        background: white;
        position:fixed;
        z-index: 998;
        overflow-x:hidden;
        overflow-y: auto;
    }

    .fade-enter-active,
    .fade-leave-active {
    transform: translateY(0);
    transition: transform 0.3s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
    transform: translateY(-100vh);
    transition: transform 0.3s ease;
    }
    .bottomfield{
         margin-bottom: 120px;
    }
    .field{
         margin-left: 10px;
    }
    .van-checkbox{
    margin:5px auto;
  }
</style>