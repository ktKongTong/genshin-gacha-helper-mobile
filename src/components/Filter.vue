<template>
    <div style="display: flex;align-items: center">
        <!-- <el-date-picker
                    style="margin: 0 auto"
            v-model="dateValue"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker> -->
    <van-checkbox-group v-model="checkboxGroup">
        <van-checkbox v-for="name in names" :name="name['value']" :key="name['value']">{{name["name"]}}</van-checkbox>
    </van-checkbox-group>
    </div>
</template>
<script>
export default {
  name: 'Filter',
  data() {
    return {
      checkboxGroup: ["100","200","301","302"],
      names: [{"name":"新手祈愿", "value":"100"},{"name":"常驻祈愿", "value":"200"},{"name":"角色活动祈愿", "value":"301"},{"name":"武器活动祈愿", "value":"302"}],
      activeName: 'first',
      dateValue: [new Date("2020-09-15 08:00:00"), new Date()]
    }
  },
  components: {
  },
  methods:{
  }
}


</script>