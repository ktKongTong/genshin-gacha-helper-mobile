export function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
export function compareDate(TimeA,TimeB){
    var oDate1 = new Date(TimeA);
    var oDate2 = new Date(TimeB);
    if(oDate1.getTime() > oDate2.getTime()){
        return true; //第一个大
    } else {
        return false; //第二个大
    }
}
// 字符串日期加1
export function dayAdd(date){
    var d = new Date(date)
    var dt = new Date(Number(d)+(24*60*60*1000))
    return dateFormat('YYYY-mm-dd',dt)
}


export default{dateFormat,dayAdd,compareDate}