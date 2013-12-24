//查询某个巡视点、巡视设备 下的设备部件
var queryDevicePartSql = "select * from device_part where dpid in ( select distinct(dpid) from card_content_ref where iiid=? and did = ?) ";

//查询巡视内容
var queryContentSql = "select * from inspection_content where icid in ( select distinct(icid) from card_content_ref where iiid=? and dpid = ?)";


//查询各个设备部件的缺陷数量
var _queryDevicePartDefectCountSql = "select dp.name,dp.dpid,dr.irchunk,count(1) as dcount from device_part dp left join defect_record dr on dp.dpid = dr.dpid where dp.dpid in(select dpid from card_content_ref where iiid = ? and did = ?) group by dp.dpid ";
var queryInspectionContentSql = "select ic.*,_tmp.* from ("+_queryDevicePartDefectCountSql+") as _tmp left join inspection_content ic on ic.dpid = _tmp.dpid where ic.icid in (select icid from card_content_ref where iiid = ? and did = ?)"

var devicepartlist_of_device={
    
    pageInit:function(){
        $('#page_devicepartlist_title').html(localStorage._dname+' - 巡视内容');
        executeQuery(queryInspectionContentSql,[localStorage._iiid,localStorage._did,localStorage._iiid,localStorage._did],devicepartlist_of_device.dealQueryInspectionContentSql);
    },
    dealQueryInspectionContentSql:function(tx,results){
        var lens = results.rows.length;
        if(lens>0){
            var innerhtml ="";
            var temp_dpname = "";
            for(var i=0;i<lens;i++){
                var __icid = results.rows.item(i).icid;
                var __dpid = results.rows.item(i).dpid;
                var __content = results.rows.item(i).content;
                var __dpname = results.rows.item(i).name;
                var __dcount  = results.rows.item(i).dcount;
                var __irchunk = results.rows.item(i).irchunk;
                
                if(!__irchunk && __dcount==1){
                    __dcount = 0;
                }
                if(__dpname !=temp_dpname){
//                    if(temp_dpname.length>0){
//                        innerhtml = innerhtml+'<li data-icon="false">  <a href="#" data-role="button" data-theme="e" onclick="devicepartlist_of_device.findDefectOnClick('+__dpid+',\''+__dpname+'\')">记录缺陷</a> </li>';
//                    }
                    innerhtml = innerhtml+devicepartlist_of_device.getLiDividerHtml(__dpid,__dpname,__dcount);
                    temp_dpname = __dpname;
                }
                innerhtml = innerhtml+devicepartlist_of_device.getLiHtml(__content);
            }
            //innerhtml = innerhtml+'<li data-icon="false">  <a href="#" data-role="button" data-theme="e" onclick="devicepartlist_of_device.findDefectOnClick('+__dpid+',\''+__dpname+'\')">记录缺陷</a>  </li>';
            $('#contentlist').html(innerhtml).trigger('create');
            $('#contentlist').listview("refresh");
        }else{
            kmsg('数据库中无详细的设备数据，请在后台配置');
        }
    },
    getLiHtml:function(content){
        //return '<li data-theme="c" data-icon="false"><a href="#" data-transition="slide">'+content+'</a> </li>';
        return '<div class="qx_shuru"><input type="text" size=4 /></div><li data-theme="c" class="lb_bg" data-icon="false"><a href="#" data-transition="slide">'+content+'</a></li>';
    },
    getLiDividerHtml:function(dpid,dpname,dcount){
        //return '<li data-role="list-divider" role="heading" style="padding:15px;font-size:18px;">'+dpname+'<a href="#" onclick="devicepartlist_of_device.findDefectOnClick('+dpid+',\''+dpname+'\')">记录缺陷</a> <span class="ui-li-count">'+dcount+'</span></li>';
        return '<li data-role="list-divider" role="heading" class="xunshi">'+dpname+'<div class="jl"><a href="#" data-role="button" class="jl_quexian" onclick="devicepartlist_of_device.findDefectOnClick('+dpid+',\''+dpname+'\')">记录缺陷</a></div><span class="ui-li-count jsp">'+dcount+'</span></li>';
    },
    findDefectOnClick:function(dpid,dpname){
        localStorage._dpid = dpid;
        localStorage._dpname = dpname;
        $.mobile.changePage("6.html","slidedown",true,true);
    }
}