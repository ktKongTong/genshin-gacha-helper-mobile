// 数据处理
import XLSX from "xlsx";
import {saveAs} from 'file-saver'
var tL=[{"name":"角色活动祈愿","value":"301"},
{"name":"常驻祈愿","value":"200"},
{"name":"新手祈愿","value":"100"},
{"name":"武器活动祈愿","value":"302"}]


class DealData{
    constructor(dataList){
        this.dataList = dataList.sort(sortDataById)
    }


}
// 根据id排序
function sortDataById(a, b) {
    for(let i=0;i<a.id.length;i++){
        if(parseInt(a.id[i])>parseInt(b.id[i])){
            return -1
        }else if(parseInt(a.id[i])<parseInt(b.id[i])){
            return 1
        }
    }
}

// 获取抽卡次数
export function getGachaCount(dataList){
    var data = dataList.sort(sortDataById).reverse()
    var res = [[],[],[],[]]
    
}
// 获取指定rank的List，增加count5/4字段
export function getRankCountData(dataList){
    var data = dataList.sort(sortDataById).reverse()
    var rank5RoleList = {"all":[],"100":[],"200":[],"301":[],"302":[]}
    var rank5WeaponList = {"all":[],"100":[],"200":[],"301":[],"302":[]}
    var rank4RoleList = {"all":[],"100":[],"200":[],"301":[],"302":[]}
    var rank4WeaponList = {"all":[],"100":[],"200":[],"301":[],"302":[]}
    var rank5CountSum = {"all":0,"100":0,"200":0,"301":0,"302":0}
    var rank4CountSum = {"all":0,"100":0,"200":0,"301":0,"302":0}
    var rank5Count = {"all":1,"100":1,"200":1,"301":1,"302":1}
    var rank4Count = {"all":1,"100":1,"200":1,"301":1,"302":1}
    data.forEach(elem=>{
        switch (true){
            case elem.rank_type=="5":
                elem.count5=rank5Count[elem.gacha_type]
                rank5CountSum["all"]+=rank5Count[elem.gacha_type]
                rank5CountSum[elem.gacha_type]+=rank5Count[elem.gacha_type]
                if(elem.item_type=="角色"){
                    rank5RoleList[elem.gacha_type].push(elem)
                    rank5RoleList["all"].push(elem)
                }else{
                    rank5WeaponList[elem.gacha_type].push(elem)
                    rank5WeaponList["all"].push(elem)
                }
                rank5Count["all"]=1
                rank4Count["all"]=1
                rank5Count[elem.gacha_type]=1
                rank4Count[elem.gacha_type]=1
                break
            case elem.rank_type=="4":
                elem.count4=rank4Count[elem.gacha_type]
                rank4CountSum["all"]+=rank4Count[elem.gacha_type]
                rank4CountSum[elem.gacha_type]+=rank4Count[elem.gacha_type]
                if(elem.item_type=="角色"){
                    rank4RoleList[elem.gacha_type].push(elem)
                    rank4RoleList["all"].push(elem)
                }else{
                    rank4WeaponList[elem.gacha_type].push(elem)
                    rank4WeaponList["all"].push(elem)
                    
                }
                rank5Count[elem.gacha_type]++
                rank5Count["all"]++
                rank4Count["all"]=1
                rank4Count[elem.gacha_type]=1
                break
            case elem.rank_type=="3":
                rank5Count[elem.gacha_type]++
                rank4Count[elem.gacha_type]++
                rank5Count["all"]++
                rank4Count["all"]++
                break
        }
    })
    var rank4Avg = {"all":0,"100":0,"200":0,"301":0,"302":0}
    var rank5Avg = {"all":0,"100":0,"200":0,"301":0,"302":0}
    var typeList = ["all","100","200","301","302"]
    typeList.forEach(elem=>{
        if(rank5WeaponList[elem].concat(rank5RoleList[elem]).length>0){
            rank5Avg[elem] = (rank5CountSum[elem]/rank5WeaponList[elem].concat(rank5RoleList[elem]).length).toFixed(2)
        }
        if(rank4WeaponList[elem].concat(rank4RoleList[elem]).length>0){
            rank4Avg[elem] = (rank4CountSum[elem]/rank4WeaponList[elem].concat(rank4RoleList[elem]).length).toFixed(2)
        }
    })
    var res ={
        rank5RoleList:rank5RoleList,
        rank5WeaponList:rank5WeaponList,
        rank4WeaponList:rank4WeaponList,
        rank4RoleList:rank4RoleList,
        rank5Avg:rank5Avg,
        rank4Avg:rank4Avg
    }
    return res
}
// 生成饼图数据
export function getPieData(dataList){
    var rank5Role = 0
    var rank4Role = 0
    var rank5Weapon = 0
    var rank4Weapon = 0
    var rank3Weapon = 0
    dataList.forEach(elem=>{
        switch(true){
            case elem.rank_type=="5"&&elem.item_type=="角色":
                rank5Role++;break
            case elem.rank_type=="4"&&elem.item_type=="角色":
                rank4Role++;break
            case elem.rank_type=="5"&&elem.item_type=="武器":
                rank5Weapon++;break
            case elem.rank_type=="4"&&elem.item_type=="武器":
                rank4Weapon++;break
            case elem.rank_type=="3"&&elem.item_type=="武器":
                rank3Weapon++;break
        }
    })
    var res = {seriesData:[{"name":"3星武器","value":rank3Weapon},
                    {"name":"4星武器","value":rank4Weapon},
                    {"name":"5星武器","value":rank5Weapon},
                    {"name":"4星角色","value":rank4Role},
                    {"name":"5星角色","value":rank5Role}],
                }
    if(dataList.length!=0){
        res.rankRateInfo={
            rank5Rate:((rank5Weapon+rank5Role)/dataList.length*100).toFixed(2),
            rank4Rate:((rank4Weapon+rank4Role)/dataList.length*100).toFixed(2),
            rank3Rate:(rank3Weapon/dataList.length*100).toFixed(2),
        }
    }else{
        res.rankRateInfo={rank5Rate:0,rank4Rate:0,rank3Rate:0}
    }
    return res
}
// 合并传过来的json
export function mergeJson(dataList,json){
    let  res = dataList.sort(sortDataById)
    // 最早的一个Id
    let firstData = res[res.length-1]
    // 导出json数据格式
    try{
        json.gachaType.forEach(item=>{
        let data = json.gachaLog[parseInt(item.key)]
        data.forEach(elem=>{
            if(elem.id===firstData.id){    
            }else if(sortDataById(elem,firstData)==1){
            // elemId小于firstId
                dataList.push(elem)
            }
        })
        })
    }catch{
        return {data:dataList,res:false}
    }
    return {data:dataList.sort(sortDataById),res:true}
}

// 传入DataList生成json文件，方便合并数据
export function gRawJson(dataList){
    let  res = dataList.sort(sortDataById)
    // 导出json数据格式
    let ret = {gachaLog:{100:[],200:[],301:[],302:[],uid:""},
        gachaType:[{id:"14",key:"100",name:"新手祈愿"},{id:"4",key:"200",name:"常驻祈愿"},
        {id:"15",key:"301",name:"角色活动祈愿"},{id:"16",key:"302",name:"武器活动祈愿"}]}
    if(res.length>0){
        ret.uid=res[0].uid
    }
    tL.forEach(elem => {
        let data = res.filter(item=>item.gacha_type==elem["value"])
        data = data.sort(sortDataById).reverse()
        ret.gachaLog[parseInt(elem.value)]=data
    })
    var json = JSON.stringify(ret,null,"\t");
    const blob = new Blob([json], {type: 'application/json'})
    var d = new Date()
    let time = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate()+" "
    +d.getHours()+"-"+d.getMinutes()+"-"+d.getSeconds()
    saveAs(blob,"ysdata"+"-"+ret.uid+"_"+time+".json")
}
// 传入DataList生成Excel
export function gExcel(dataList) {
    let  res = dataList.sort(sortDataById)
    let ret = {}
    var wb = XLSX.utils.book_new();/*新建book*/
    tL.forEach(elem => {
        let dataRes = []
        let data = res.filter(item=>item.gacha_type==elem["value"])
        data = data.sort(sortDataById).reverse()
        var count = 1
        var totalCount = 1
        data.forEach(elem=>{
            dataRes.push({
                时间:elem.time,
                名称:elem.name,
                类别:elem.item_type,
                星级:parseInt(elem.rank_type),
                保底内:count,
                总次数:totalCount
            })
            // 时间	名称	类别	星级	总次数	保底内
            if(elem.rank_type=="5"){count=1}else{count++}
            totalCount++
        })
        ret[elem.value]=data
        var ws = XLSX.utils.json_to_sheet(dataRes);/* 新建空workbook，然后加入worksheet */        
        XLSX.utils.book_append_sheet(wb, ws, elem.name);/* 生成xlsx文件(book,sheet数据,sheet命名) */
    })
        XLSX.writeFile(wb, "ysdata.xlsx");
        // var wopts = {
        //     bookType: 'xlsx', // 要生成的文件类型
        //     bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        //     type: 'binary'
        // };
        // var wbout = XLSX.write(wb, wopts);
        // XLSX.writeFile(wb,"ysdata.xlsx",wopts)
        // var blob = new Blob([s2ab(wbout)], {
        //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        // });
        // saveAs(blob, "ysdata.xlsx");
        return ret
}

// file转Json
export async function fileToJson (file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = res => {
        const { result } = res.target // 得到字符串
        const data = JSON.parse(result) // 解析成json对象
            resolve(data)
        } // 成功回调
        reader.onerror = err => {
            reject(err)
        } // 失败回调
        reader.readAsText(new Blob([file]), 'utf-8') // 按照utf-8编码解析
    })
}
export default{gExcel,gRawJson,fileToJson,getPieData,getRankCountData}