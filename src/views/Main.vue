<template>
<div>
    <van-notice-bar style="text-align:start;font-size:12px"
        color="#1989fa"
        scrollable='true'
        background="#ecf9ff"
        speed="120"
        text="部分浏览器不支持以Blob链接格式下载文件，无法导出文件"
    />
    <div>
        <van-field
        v-model="url"
        size="large"
        type="textarea"
        maxlength="3000"
        placeholder="请填入包含url的字符串"
        show-word-limit
        :border='false'
        label-width='0'
        :clearable = "true"
        :autosize="{ maxHeight: 200, minHeight: 80 }"
        :update:model-value='checkAuthkey()'
        />
        <div style="display:flex;margin:10 auto">
        <van-button style="margin:0 auto" v-on:click="click" :disabled="disabled">获取数据</van-button>
        <van-button style="margin:0 auto" v-on:click="tips" type="primary" plain>使用说明</van-button>
        </div>
    </div>
    <van-overlay id="getDataStep" style="align-items:center;display:flex" :show="dialogVisible">
        <div style="align-items:center">
                <div style="background-color:#ffffff;
                font-size:14px;
                color:#38f;
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                line-height:4;
                ">{{stateMsg}}</div>
                <van-steps direction="vertical" :active="active" active-icon="success" active-color="#38f">          
                <van-step v-for="item in requestSteps" :key="item">{{item}}</van-step>
                </van-steps>
        </div>
    </van-overlay>
</div>
</template>
<script>
import {ref} from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Dialog } from 'vant'
export default {
   setup(){
      const router = useRouter();
    //   UI
      const requestSteps=["获取新手祈愿","获取常驻祈愿","获取角色活动祈愿","获取武器活动祈愿","完成"]
      const active = ref(0)
      // 请求状态
      const stateMsg=ref("开始获取祈愿数据")
      const disabled = ref(false)
      const dialogVisible = ref(false)
      // 输入框中的URL
      const url =ref("")
      const ctn = ref(true)
      // 匹配的authkey
      let authkey = "" 
      // 数据
      let dataList=[]

      // 获取说明
      const tips = ()=>{
        Dialog.alert({
        confirmButtonColor:"#38f",
        title: 'url获取方式',
        message: "1.进入祈愿历史记录界面\n2.关闭网络\n3. 历史记录右上角刷新\n 4. 复制包含url的文字即可",
        });
      }
      // 检查填写URL是否包含authkey
      const checkAuthkey = ()=>{
          let patt = 'authkey=.+(&game)'
          //   var patt = 'http(s)?://.+(log)'
          let pattRes = url.value.match(patt)
          if (pattRes != null){
            authkey = pattRes[0].slice(8,-5)
            disabled.value=false
          }else{
            disabled.value=true
          }
      }
      // 设置状态
      const setState =(act,msg)=>{
        stateMsg.value=msg
        active.value = act
      }
      // 点击获取数据
      const click = async ()=>{
          dialogVisible.value = true
          getData().then((res)=>{
          if(ctn.value){
            setState(5,"成功获取数据开始处理")
            setTimeout(()=>{
                    dialogVisible.value=false
                    router.push({
			          name: 'Show',
			          params: {
			              dataList:JSON.stringify(res)
                        }
			        })
                },1000
            )}
          })
      }
      //尝试获取数据
     const  getData = async()=>{
        let typeList = [
        {"name":"新手祈愿","value":"100","stepState":0},
        {"name":"常驻祈愿","value":"200","stepState":1},
        {"name":"角色活动祈愿","value":"301","stepState":2},
        {"name":"武器活动祈愿","value":"302","stepState":3}]
        for (let i=0;i<4;i++){
            let gacha_type = typeList[i]["value"]
            let gacha_type_name = typeList[i]["name"]
            let stepState = typeList[i]["stepState"]
            let end_id="0"
            // 当前页
            let page = 1
            // 下一页是否仍然有数据
            let hasData = true
            setState(stepState,"开始获取"+gacha_type_name)
            // 当有数据
            while(hasData&&ctn.value){
                await axios.get("/api",{
                    params:{
                        authkey_ver:1,
                        lang:"zh-cn",
                        size:20,
                        authkey:decodeURIComponent(authkey),
                        gacha_type:gacha_type,
                        page:page,
                        end_id:end_id
                    },
                }).then((res)=>{
                    let data = res.data
                    if(res.status==200&&res.data["message"]=="OK"){
                        if(data.data["list"].length>0){
                            setState(stepState,gacha_type_name+"第"+data.data["page"]+"页获取完毕")                            
                            if(data.data["list"].length<20){
                                hasData=false
                            }
                            dataList = dataList.concat(data.data.list)
                            page++;
                            end_id = data.data["list"].pop()["id"]
                        }else{
                            hasData=false
                        }
                    }else{
                        setState(stepState,res.data["message"])
                        console.log(res)
                        hasData=false
                        ctn.value=false
                    }
                }).catch((res)=>{
                    console.log(res)
                })
            }
            if(!ctn.value){
                break;
            }
        }
        return dataList
    }
    return{
        requestSteps,url,disabled,
        dialogVisible,ctn,active,stateMsg,
        checkAuthkey,tips,click
    }
  },
}
</script>

<style>
    #getDataStep > div > div.van-steps.van-steps--vertical{
        border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            padding:0 40px 32px 72px;
    }
    #getDataStep > div{
        margin:0 auto;
        align-items:center;
        text-align:center;
    }
</style>
