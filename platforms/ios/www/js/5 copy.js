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
            kmsg('数据库中无详细的设备数据，请在后台配置');
        }
    },
    h3ItemOnClick:function(dpid,dpname){
        localStorage._dpid = dpid;
        localStorage._dpname = dpname;
        executeQuery(queryContentSql,[localStorage._iiid,localStorage._dpid],devicepartlist_of_device.dealQueryContentSql);
    },
    dealQueryContentSql:function(tx,results){
        var lens = results.rows.length;
        if(lens>0){
            var innerhtml ="";
            for(var i=0;i<lens;i++){
                innerhtml = innerhtml+devicepartlist_of_device.getLiHtml(results.rows.item(i).icid,results.rows.item(i).content,results.rows.item(i).result_type);
            }
            innerhtml = innerhtml+'<li data-icon="false"> <p> <a href="#" data-role="button" data-theme="e" onclick="devicepartlist_of_device.findDefectOnClick()">记录缺陷</a> </p> </li>';
            $('#dpcontent'+localStorage._dpid ).html(innerhtml);
            $('#dpcontent'+localStorage._dpid ).listview('refresh');
        }else{
            kmsg('数据库中无详细的巡视标准，请在后台配置');
        }
    },
    findDefectOnClick:function(){
        $.mobile.changePage("6.html","slidedown",true,true);
    },
    getDivHtml:function(dpid,dpname){
        var html='<div data-role="collapsible" data-theme="b" data-collapsed="true" data-content-theme="c" data-collapsed-icon="true" class="colla_div">';
        html = html +'<h3 class="xunshi" onclick="devicepartlist_of_device.h3ItemOnClick('+dpid+',\''+dpname+'\')">';
        html = html + dpname;
        html = html+'</h3>';
        html = html +'<ul data-role="listview" class="bi" id="dpcontent'+dpid+'">';
        html = html + '</ul></div>';
        return html;
    },
    getLiHtml:function(icid,content,result_type){
        var li ="";
        if(result_type != 'Y'){
            li = '<li class="lb_bg" data-icon="false"><a href="#">'+content+'</a><p class="shuoming1"></p></li>';
        }else{
            li = '<li class="lb_bg"> <div class="qxdy" style="margin-right:30px;"> <input type="text" value="" style="width:60px;height:24px;font-size:14px; margin-left:10px;">mA</div> <a href=”#“ >'+content+'</a> </li>';
        }
        
        return li;
    }
}