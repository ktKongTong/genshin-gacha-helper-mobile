// 数据处理
import XLSX from "xlsx";
import FileSaver from 'file-saver';
// 传入list
function sortDataById(a, b) {
    for(let i=0;i<a.length;i++){
        if(parseInt(a.id[i])>parseInt(b.id[i])){
            return -1
        }else if(parseInt(a.id[i])<parseInt(b.id[i])){
            return 1
        }
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
    // XLSX.writeFile(wb, "ysdata.xlsx");
    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    var wbout = XLSX.write(wb, wopts);
    var blob = new Blob([s2ab(wbout)], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });
    // var reader = new FileReader()
    // reader.readAsDataURL(blob);   // 转换为base64，可以直接放入a标签href
    // reader.onload = function (e) {
    //     var a = document.createElement('a');   // 转换完成，创建一个a标签用于下载
    //     a.download = 'XX数据.xlsx';
    //     a.href = e.target.result;
    //     a.click();
    // }
    // window.open(URL.createObjectURL(blob))
    // saveAs(blob, "ysdata.xlsx");
    // var bl = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
    // FileSaver.saveAs(blob, "ysdata.xlsx");
    return blob;
    }
// 字符串转ArrayBuffer
function s2ab(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

export default{ gExcel
}