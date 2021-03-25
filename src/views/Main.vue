<template>
<div>
<div>
    <van-field
    v-model="url"
    label=""
    size="large"
    type="textarea"
    maxlength="2000"
    placeholder="请填入url"
    show-word-limit
    :border='false'
    label-width='0'
    :clearable = "true"
    :error-message="error_msg"
    :autosize="{ maxHeight: 100, minHeight: 50 }"
    :update:model-value='checkAuthkey()'
    />
  <van-button v-on:click="click" :disabled="disabled">获取数据</van-button>
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
<script>
import axios from 'axios'
export default {
  name: 'Home',
  data() {
    return {
        active:0,
        requestSteps:["获取新手祈愿","获取常驻祈愿","获取武器获取祈愿","获取角色活动祈愿","完成"],
        url:"",
        disabled:true,
        dialogVisible:false,
        authkey:"",
        error_msg:"",
        state:"",
        stateMsg:"开始获取祈愿数据",
        dataList:[],
        ctn:true
    }
  },
  components: {
  },
  methods:{
    //   检测authkey
      checkAuthkey(){
          var url = this.url
          var patt0 = 'authkey=.+(&game)'
          var patt = 'http(s)?://.+(log)'
          var res = url.match(patt0)
          if (res != null){
            console.log(url.match(patt)[0])   
            this.authkey = res[0].slice(8,-5)
            this.disabled=false
          }else{
              this.disabled=true
          }
      },
      setState(active,msg){
        this.stateMsg=msg
        this.active = active
      },
      async click(){
          var that = this
          let authkey = this.authkey
          this.dialogVisible = true
          this.getData(authkey).then((res)=>{
          if(that.ctn){
            that.setState(5,"成功获取数据开始处理")
            setTimeout(
                ()=>{
                    that.dialogVisible=false
                    that.$router.push({
			          name: 'Show',
			          params: {
			              dataList:JSON.stringify(res)
                        }
			        })
                },1000
            )}
          })
      },
    //尝试获取数据
     async getData(authkey){
        var that =this
        let dataList = []
        let url = "https://gacha.api.ktnote.cn/gacha"
        let typeList = [
        {"name":"常驻祈愿","value":"200","stepState":0},
        {"name":"新手祈愿","value":"100","stepState":1},
        {"name":"角色活动祈愿","value":"301","stepState":2},
        {"name":"武器活动祈愿","value":"302","stepState":3}
        ]
        for (let i=0;i<4;i++){
            let gacha_type = typeList[i]["value"]
            let gacha_type_name = typeList[i]["name"]
            let stepState = typeList[i]["stepState"]
            let end_id="0"
            let page = 1
            let hasData = true
            that.setState(stepState,"开始获取"+gacha_type_name)
            while(hasData&&that.ctn){
                await axios.get(url,{
                    params:{authkey_ver:1,lang:"zh-cn",size:20,authkey:decodeURIComponent(authkey),
                        gacha_type:gacha_type,page:page,end_id:end_id},
                }).then((res)=>{
                    let data = res.data
                    console.log(res)
                    if(res.status==502||(res.status==200&&res.data["retcode"]==-1024)){
                        that.setState(stepState,"函数执行出错，如有需要，请联系开发者")
                        that.ctn=false
                    }else if(res.status==200&&res.data["message"]=="OK"){
                        if(data.data["list"].length>0){
                            that.setState(stepState,gacha_type_name+"第"+data.data["page"]+"获取完毕")
                            console.log(gacha_type_name+"第"+data.data["page"]+"获取完毕")
                            if(data.data["list"].length<6){
                                hasData=false
                            }
                            data.data.list.forEach(elem => {
                                dataList.push(elem)
                            });
                            page++;
                            end_id = data.data["list"].pop()["id"]
                        }else{
                            hasData=false
                        }
                    }else{
                        hasData=false
                        that.setState(stepState,"未知错误")
                        that.ctn=false
                    }
                })
            }
            if(!that.ctn){
                break;
            }
        }
        return dataList
    }

  }
}


</script>