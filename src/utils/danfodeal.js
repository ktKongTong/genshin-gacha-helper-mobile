// 数据处理
import XLSX from "xlsx";
// 传入list
function sortDataById(a, b) {
    for(let i=0;i<a.length;i++){
        if(parseInt(a.id[i])>parseInt(b.id[i])){return -1}else{return 1}
    }
}
export function gExcel(dataList) {
    let  res = dataList.sort(sortDataById)
    let ret = {}
    var wb = XLSX.utils.book_new();/*新建book*/
    var tL=[{"name":"角色活动祈愿","value":"301"},{"name":"常驻祈愿","value":"200"},{"name":"新手祈愿","value":"100"},{"name":"武器活动祈愿","value":"302"}]
    tL.forEach(elem => {
        let dataRes = []
        let data = res.filter(item=>item.gacha_type==elem["value"])
        data = data.sort(sortDataById).reverse()
        console.log(data)
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
    console.log(ret)        
        return ret;
    }
export default{ gExcel
}