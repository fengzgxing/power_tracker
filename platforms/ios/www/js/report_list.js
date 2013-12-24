
//查询某个巡视点下的设备列表
var queryReportSql = "select * from inspection_report where psid is not null";

//巡视点下的设备列表
var report_list = {
    
    pageInit:function(){
        executeQuery(queryReportSql,[],report_list.dealQueryReportSqlResult);
    },
    dealQueryReportSqlResult:function(tx,results){
        var lens = results.rows.length;
        if(lens>0){
             var innerhtml = "";
             for(var i=0;i<lens;i++){
                 var cname = results.rows.item(i).cname;
                 innerhtml = innerhtml+'<tr> <th>1</th> <td>青居电厂</td> <td>'+cname+'</td> <td>2013-12-20 13:12:20</td> <td>2013-12-20 14:12:20</td> </tr>';
             }
             $('table[id=tbl_report] tbody').html(innerhtml).trigger("create");
             
        }else{
            kmsg('数据库中无设备数据，请在后台配置');
        }
    },
    itemOnClick:function(did,dname){
//        localStorage._did = did;
//        localStorage._dname = dname;
//        $.mobile.changePage("5.html","slidedown",true,true);
    }
}