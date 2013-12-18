//查询某个巡视点、巡视设备 下的设备部件
var queryDevicePartSql = "select * from device_part where dpid in ( select distinct(dpid) from card_content_ref where iiid=? and did = ?) ";

//查询巡视内容
var queryContentSql = "select * from inspection_content where icid in ( select distinct(icid) from card_content_ref where iiid=? and dpid = ?)";


var devicepartlist_of_device={
    
    pageInit:function(){
        $('#page_devicepartlist_title').html(localStorage._dname+' - 具体巡视设备列表');
        executeQuery(queryDevicePartSql,[localStorage._iiid,localStorage._did],devicepartlist_of_device.dealQueryDevicePartSql);
    },
    dealQueryDevicePartSql:function(tx,results){
        var lens = results.rows.length;
        if(lens>0){
            var innerhtml ="";
            for(var i=0;i<lens;i++){
                innerhtml = innerhtml+devicepartlist_of_device.getDivHtml(results.rows.item(i).dpid,results.rows.item(i).name);
            }
            innerhtml = innerhtml+'<a href="javascript:;" data-theme="b" data-role="button" class="queding">确定</a>';
            $('#devicepartlist').append(innerhtml).trigger("create");
        }else{
            navigator.notification.alert('数据库中无详细的设备数据，请在后台配置',null,'信息提示','确定');
        }
    },
    h3ItemOnClick:function(dpid){
        localStorage._dpid = dpid;
        executeQuery(queryContentSql,[localStorage._iiid,localStorage._dpid],devicepartlist_of_device.dealQueryContentSql);
    },
    dealQueryContentSql:function(tx,results){
        var lens = results.rows.length;
        if(lens>0){
            var innerhtml ="";
            for(var i=0;i<lens;i++){
                innerhtml = innerhtml+devicepartlist_of_device.getLiHtml(results.rows.item(i).icid,results.rows.item(i).content,results.rows.item(i).result_type);
            }
            $('#dpcontent'+localStorage._dpid ).html(innerhtml);
            $('#dpcontent'+localStorage._dpid ).listview('refresh');
        }else{
            navigator.notification.alert('数据库中无详细的巡视标准，请在后台配置',null,'信息提示','确定');
        }
    },
    contentItemOnClick:function(icid,){
        
    },
    getDivHtml:function(dpid,dpname){
        var html='<div data-role="collapsible" data-theme="b" data-collapsed="true" data-content-theme="c" data-collapsed-icon="true" class="yongdxt">';
        html = html +'<h3 class="xunshi" onclick="devicepartlist_of_device.h3ItemOnClick('+dpid+')">';
        html = html + dpname;
        html = html+'</h3>';
        html = html +'<ul data-role="listview" data-inset="false" data-theme="c" class="bi" id="dpcontent'+dpid+'">';
        html = html + '</ul></div>';
        return html;
    },
    getLiHtml:function(icid,content,result_type){
        var li = '<li class="lb_bg"><a href="#" data-rel="dialog" onclick="devicepartlist_of_device.contentItemOnClick('+icid+','+content+')">'+content+'</a>';
        if(result_type != 'Y'){
            li = li + '<p class="shuoming1"></p></li>';
        }else{
            li = '<li class="lb_bg"> <div class="qxdy" style="margin-right:30px;"> <input type="text" value="" style="width:60px;height:24px;font-size:14px; margin-left:10px;">mA</div> <a href=”#“ >'+content+'</a> </li>';
        }
        return li;
    }
}