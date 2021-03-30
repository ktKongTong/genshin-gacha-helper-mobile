<template>
  <div>
    <div>
        <v-chart autoresize style="height:300px" :option="pieOption"/>
    </div>
    <div>
        <van-collapse :border="false" v-model="activeNames">
            <van-collapse-item name="5">
                <template #title>
                <div>
                <div style="display:flex;align-items:center">
                    <van-rate v-model="rate[0]"  color="#ffd21e" readonly></van-rate>
                    <span style="color:#ffd21e;margin-left:auto;margin-right:20px;font-size:16px"> {{rankRateInfo.rank5Rate}}%</span>
                </div>
                <div  style="color:#ffd21e;font-size: 13px;display:flex;align-items:center">平均出货次数: {{rank5Avg["all"]}}</div>
                </div>
                </template>
                <div style="margin:0 auto">
                    <van-tag style="margin:2px 2px" size="medium" type="primary"  plain v-for="i in rank5RoleList['all'].concat(rank5WeaponList['all'])" :key="i">{{ i['name'] }}({{i['count5']}})</van-tag>
                </div>
            </van-collapse-item>
            <van-collapse-item name="4">
                <template #title>
                <div>
                    <div style="display:flex;align-items:center">
                    <van-rate v-model="rate[1]"  color="#AD1AF5" readonly></van-rate>
                    <span style="color:#AD1AF5;margin-left:auto;margin-right:20px;font-size:16px"> {{rankRateInfo.rank4Rate}}%</span>
                    </div>
                    <div  style="color:#AD1AF5;font-size: 13px;display:flex;align-items:center">平均出货次数: {{rank4Avg["all"]}}</div>
                </div>
                </template>
                <div style="margin:0 auto">
                    <van-tag style="margin:2px 2px" size="medium" type="primary"  plain v-for="i in rank4RoleList['all'].concat(rank4WeaponList['all'])" :key="i">{{ i['name'] }}({{i['count4']}})</van-tag>
                </div>
            </van-collapse-item>
            <van-collapse-item name="3" :is-link='false' disabled>
                <template #title>
                    <div style="display:flex;align-items:center;margin-right:22px">
                    <van-rate v-model="rate[2]"  color="#2C64FF" readonly ></van-rate>
                    <span style="color:#2C64FF;margin-left:auto;margin-right:20px;font-size:16px"> {{rankRateInfo.rank3Rate}}%</span>
                    </div>
                </template>
            </van-collapse-item>
        </van-collapse>
    </div>
  </div>
</template>