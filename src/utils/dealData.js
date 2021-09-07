// 数据处理
import {saveAs} from 'file-saver'
import ExcelJS from 'exceljs'

const tL=[{"name":"角色活动祈愿","value":"301"},
{"name":"常驻祈愿","value":"200"},
{"name":"新手祈愿","value":"100"},
{"name":"武器活动祈愿","value":"302"}]

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

// 合并传过来的json
export function mergeJson(dataList,json){
    let  res = dataList.sort(sortDataById)
    // 最早的一个Id
    let firstData = res[res.length-1]
    // 空List合并所有
    if(res.length==0){
        firstData = {id:"900000000000000000"}
    }
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
export async function gExcel(dataList) {
    let  res = dataList.sort(sortDataById).reverse()
    let ret = {}

    const workbook = new ExcelJS.Workbook();

    tL.forEach(elem => {
        let data = res.filter(item=>item.gacha_type==elem["value"]).sort(sortDataById).reverse()
        const sheet = workbook.addWorksheet(elem.name)
        sheet.properties.defaultRowHeight = 15;
        sheet.columns = [
            { header: '时间', key: 'time', width: 32, style: { numFmt: 'YYYY-MM-DD HH:mm:ss' } },
            { header: '名称', key: 'name', width: 15},
            { header: '类别', key: 'type', width: 8 },
            { header: '星级', key: 'rank', width: 8 },
            { header: '保底内', key: 'lastin', width: 8 },
            { header: '总次数', key: 'total', width: 8 }
          ];
        let count = 1
        let totalCount = 1
        data.forEach(elem=>{
            sheet.addRow({
                time:elem.time,
                name:elem.name,
                type:elem.item_type,
                rank:parseInt(elem.rank_type),
                lastin:count,
                total:totalCount
            })
            count =(elem.rank_type==="5")?1:++count
            // 时间	名称	类别	星级	总次数	保底内
            totalCount++
        })
        ret[elem.value]=data
        // 修改内容样式
        sheet.eachRow((row, rowNumber)=>{
                row.eachCell((cell, colNumber)=>{
                cell.font= { name: 'Microsoft YaHei'}
                cell.fill = {
                    type: 'pattern',
                    pattern:'solid',
                    fgColor:{argb:'FFF0EBEF'}
                }
                cell.alignment =  { horizontal: 'center' };
                cell.border = {
                    top: {style:'thin',color:{argb:'FFbfbfbf'}},
                    left: {style:'thin',color:{argb:'FFbfbfbf'}},
                    bottom: {style:'thin',color:{argb:'FFbfbfbf'}},
                    right: {style:'thin',color:{argb:'FFbfbfbf'}}
                }
                })
            if(row.values[4]=='4'){
                row.font = { name: 'Microsoft YaHei',color:{ argb: 'FFAD1AF5'}}
            }else if(row.values[4]=='5'){
                row.font = { name: 'Microsoft YaHei',color:{ argb: 'FFC0713D'}}
            }
        })
        // 修改表头样式
        sheet.getRow(1).eachCell(cell=>{
            cell.fill = {type: 'pattern',pattern:'solid',fgColor:{argb:'FFdfd7d4'}}
        })
     })
    workbook.xlsx.writeBuffer().then(data=>{
        const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })        
        saveAs(blob,'ysdata.xlsx')
    })
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
export default{mergeJson,gExcel,gRawJson,fileToJson}