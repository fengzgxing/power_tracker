
//查询某个巡视点下的设备列表
//var mid = localStorage._mid;
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
             var temp_psname = "";
             for(var i=0;i<lens;i++){
                 var cname = results.rows.item(i).cname;
                 var mname = results.rows.item(i).mname;
                 var psname = results.rows.item(i).psname;
                 var starttime = formatDate(results.rows.item(i).starttime);
                 var endtime = formatDate(results.rows.item(i).endtime);
                 
                 if(psname !=temp_psname){                    
                    innerhtml = innerhtml+'<tr><td colspan="5" style="text-align:left; text-indent:1em;"><strong>'+psname+'巡视结果</strong></td></tr>';                     
                    temp_psname = psname;
                 }           
                 innerhtml = innerhtml+'<tr><td>'+mname+'</td> <td>'+cname+'</td> <td>'+starttime+'</td> <td>'+endtime+'</td><td>完成</td> </tr>';
             }
             //console.log(innerhtml);
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
function formatDate(fmt) { //author: meizz
    if(fmt){
    	var start = fmt.indexOf("-")+1;
	    var stop = fmt.lastIndexOf(":");
	    return fmt.substring(start,stop);
    }else{
    	return "-";
    }
		
}
