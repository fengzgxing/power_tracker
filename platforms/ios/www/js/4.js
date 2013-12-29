//查询某个巡视点、巡视设备 下的设备部件
//var queryDevicePartListSql = "select * from device_part where dpid in (select distinct(dpid) from card_content_ref where cardid = ? and iiid in (select iiid from inspection_point where barcode = ? ));";
var queryDevicePartListSql = "select dp.did,dp.name,dp.dpid,dr.irchunk,count(1) as dcount from device_part dp left join defect_record dr on dp.dpid = dr.dpid where dr.result_type is null and dp.dpid in(select dpid from card_content_ref where cardid = ? and iiid in (select iiid from inspection_point where barcode = ? ) ) group by dp.dpid";
var devicepartlist={
    
    pageInit:function(){
        $('#page_devicepart_title').html(localStorage._pointname+' - 巡视设备');
        
        executeQuery(queryDevicePartListSql,[localStorage._cardid,localStorage._rfidCode],devicepartlist.dealQueryDevicePartSqlResult);
    },
    dealQueryDevicePartSqlResult:function(tx,results){
        var lens = results.rows.length;
        if(lens>0){
            var innerhtml = "";
            for(var i=0;i<lens;i++){
                //var __did = results.rows.item(i).did;
                var __irchunk = results.rows.item(i).irchunk;
                var __did = results.rows.item(i).did;
                var __dpid = results.rows.item(i).dpid;
                var __dpname = results.rows.item(i).name;
                var __dcount = results.rows.item(i).dcount;
                if(!__irchunk && __dcount==1){
                    __dcount = 0;
                }
                innerhtml = innerhtml+'<li data-theme="c"><a href="#" data-transition="slide" onclick="devicepartlist.itemOnClick('+__did+','+__dpid+',\''+__dpname+'\')">'+__dpname+'</a><span class="ui-li-count jsp" style="color:red;">'+__dcount+'</span></li>';
            }
            $('#devicelist').html(innerhtml);
            $("#devicelist").listview("refresh");
        }else{
            kmsg('数据库中无设备数据，请在后台配置');
        }
    },
    itemOnClick:function(did,dpid,dname){
        localStorage._did = did;
        localStorage._dpid = dpid;
        localStorage._dname = dname;
        $.mobile.changePage("5.html","slidedown",true,true);
    }
}