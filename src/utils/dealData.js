// 数据处理
import XLSX from "xlsx";
import {saveAs} from 'file-saver'
var tL=[{"name":"角色活动祈愿","value":"301"},
{"name":"常驻祈愿","value":"200"},
{"name":"新手祈愿","value":"100"},
{"name":"武器活动祈愿","value":"302"}]
// 传入list
function sortDataById(a, b) {
    for(let i=0;i<a.id.length;i++){
        if(parseInt(a.id[i])>parseInt(b.id[i])){
            return -1
        }else if(parseInt(a.id[i])<parseInt(b.id[i])){
            return 1
        }
    }
}

// 合并传过来的json
export function mergeJson(dataList,json){
    // console.log(dataList)
    let  res = dataList.sort(sortDataById)
    // 最早的一个Id
    let firstData = res[res.length-1]
    // console.log(res)
    // 导出json数据格式
    json.gachaType.forEach(item=>{
        let data = json.gachaLog[parseInt(item.key)]
        data.forEach(elem=>{
            // console.log(elem)
            if(elem.id===firstData.id){    
            }else if(sortDataById(elem,firstData)==1){
            // elemId小于firstId
                dataList.push(elem)
            }
        })
    })
    console.log(dataList.sort(sortDataById))
    return dataList.sort(sortDataById)
}

// 生成json文件，方便合并数据
export function gRawJson(dataList){
    let  res = dataList.sort(sortDataById)
    // 导出json数据格式
    let ret = {gachaLog:{100:[],200:[],301:[],302:[]},
        gachaType:[{id:"14",key:"100",name:"新手祈愿"},{id:"4",key:"200",name:"常驻祈愿"},
        {id:"15",key:"301",name:"角色活动祈愿"},{id:"16",key:"302",name:"武器活动祈愿"}]}
    tL.forEach(elem => {
        let data = res.filter(item=>item.gacha_type==elem["value"])
        data = data.sort(sortDataById).reverse()
        ret.gachaLog[parseInt(elem.value)]=data
    })
    var json = JSON.stringify(ret,null,"\t");
    const blob = new Blob([json], {
        type: 'application/json'
    })
    let time = (new Date()).toLocaleString()
    saveAs(blob,"ysdata "+time+".json")
}
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
            // elem.总次数=totalCount
            // elem.保底内=count
            if(elem.rank_type=="5"){
                count=1
            }else{
                count++
            }
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

// 字符串转ArrayBuffer
// function s2ab(s) {
//     var buf = new ArrayBuffer(s.length);
//     var view = new Uint8Array(buf);
//     for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
//     return buf;
// }



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
export default{gExcel,gRawJson,fileToJson}