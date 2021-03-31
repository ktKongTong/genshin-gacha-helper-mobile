<template>
    <div style="display: flex;align-items: center">
        
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
    }
  },
  components: {
  },
  methods:{
  }
}


</script>