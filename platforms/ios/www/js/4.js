
//查询某个巡视点下的设备列表
var queryDeviceSql = "select * from device where did in (select distinct(did) from card_content_ref where cardid = ? and iiid in (select iiid from inspection_point where barcode = ?) )";

//巡视点下的设备列表
var devicelist_of_point = {
    
    pageInit:function(){
        $('#page_inspection_point_title').html(localStorage._pointname+' - 设备列表');
        executeQuery(queryDeviceSql,[localStorage._cardid,localStorage._rfidCode],devicelist_of_point.dealQueryDeviceSqlResult);
    },
    dealQueryDeviceSqlResult:function(tx,results){
        var lens = results.rows.length;
        if(lens>0){
             var innerhtml = "";
             for(var i=0;i<lens;i++){
                 var __did = results.rows.item(i).did;
                 var __dname = results.rows.item(i).name;
                 innerhtml = innerhtml+'<li data-theme="c"><a href="#" data-transition="slide" onclick="devicelist_of_point.itemOnClick('+__did+',\''+__dname+'\')">'+__dname+'</a> </li>';
             }
             $('#devicelist').html(innerhtml);
            $("#devicelist").listview("refresh");
        }else{
            kmsg('数据库中无设备数据，请在后台配置');
        }
    },
    itemOnClick:function(did,dname){
        localStorage._did = did;
        localStorage._dname = dname;
        $.mobile.changePage("5.html","slidedown",true,true);
    }
}