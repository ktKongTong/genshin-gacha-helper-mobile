<template>
<div class="menumask" v-if='show' @touchmove.prevent @mousewheel.prevent/>
<transition name="fade">
<div v-if='show'  class="menu">
    <div style="text-align:start;padding:10px 10px;font-size:14px">池子选择</div>
    <div style="margin:10px">
    <van-checkbox-group v-model="checkboxGroup">
    <van-checkbox v-for="name in names" :name="name['value']" :key="name['value']">{{name["name"]}}</van-checkbox>
    </van-checkbox-group>
    </div>
    <div style="text-align:start;padding:10px 10px;font-size:14px">起始日期选择</div>     
    <v-date-picker v-model="startDate" mode="dateTime" is24hr>
    <template v-slot="{ inputEvents }">
        <van-field disabled v-on="inputEvents" v-model="startDateField"/>
    </template>
    </v-date-picker>
    <div style="text-align:start;padding:10px 10px;font-size:14px">终止日期选择</div>
    <v-date-picker v-model="endDate" :minute-increment='5' :popover='{placement:"auto-end",positionFixed:true}' mode="dateTime" is24hr>
    <template v-slot="{ inputEvents }">
        <van-field class="bottomfield" disabled v-on="inputEvents" v-model="endDateField"/>
    </template>
    </v-date-picker>
    <div>t</div>
</div>

</transition>
</template>
<script>
import {computed, ref, watch} from 'vue'
export default {
    name:"selectMenu",
    props:{
      show: {
          type:Boolean,
          default:false
      }
    },
    setup(){
    const checkboxGroup=ref(["100","200","301","302"])
    const startDate = ref(new Date())
    const endDate = ref(new Date())
    const startDateField = computed(() => {
      return startDate.value.toLocaleString()
    })
    const endDateField = computed(() => {
      return endDate.value.toLocaleString()
    })
    const names = ref([{"name":"新手祈愿", "value":"100"},{"name":"常驻祈愿", "value":"200"},{"name":"角色活动祈愿", "value":"301"},{"name":"武器活动祈愿", "value":"302"}])      
    
    return{
        checkboxGroup,names,startDate,endDate,startDateField,endDateField
    }
    }
}
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
        margin-left: 20px;
        margin-bottom: 400px;
    }
</style>