//查询某个巡视点、巡视设备 下的设备部件
var queryDevicePartSql = "select * from device_part where dpid in ( select distinct(dpid) from card_content_ref where iiid=? and did = ?) ";

//查询巡视内容
var queryContentSql = "select * from inspection_content where icid in ( select distinct(icid) from card_content_ref where iiid=? and dpid = ?)";

//保存用户抄录数据
var insertNewDefectOfUserDefine = "insert into defect_record(creater,irchunk,ipid,ipname,did,dname,dpid,dpname,icid,iccontent,result_type,val,unit,drchunk,createtime,createphoto) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";


//查询各个设备部件的缺陷数量
var _queryDevicePartDefectCountSql = "select dp.name,dp.dpid,dr.irchunk,count(1) as dcount from device_part dp left join defect_record dr on dp.dpid = dr.dpid where dr.result_type is null and dp.dpid in(select dpid from card_content_ref where iiid = ? and did = ?) group by dp.dpid ";
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
                var __result_type = results.rows.item(i).result_type;
                var __unit = results.rows.item(i).unit;
                var __ceil = results.rows.item(i).ceil;
                var __floor = results.rows.item(i).floor;
                var __val = localStorage.getItem("_icid"+__icid);
                if(!__val || __val=='null'){
                    __val="";
                }
                if(!__irchunk && __dcount==1){
                    __dcount = 0;
                }
                if(__dpname !=temp_dpname){
                    innerhtml = innerhtml+devicepartlist_of_device.getLiDividerHtml(__dpid,__dpname,__dcount);
                    temp_dpname = __dpname;
                }
                innerhtml = innerhtml+devicepartlist_of_device.getLiHtml(__icid,__content,__result_type,__val,__unit,__ceil,__floor,__dpid,__dpname);
            }
            $('#contentlist').html(innerhtml).trigger('create');
            $('#contentlist').listview("refresh");
        }else{
            kmsg('数据库中无详细的设备数据，请在后台配置');
        }
    },
    getLiHtml:function(icid,content,result_type,val,unit,ceil,floor,dpid,dpname){
        if(result_type && result_type == 'Y')
        {
            return '<div class="qx_shuru"><input type="text" value="'+val+'" placeholder="'+unit+'" size=4 max="'+ceil+'" min="'+floor+'" onchange="devicepartlist_of_device.userDefineOnchange(this,\''+icid+'\',\''+content+'\',\''+unit+'\',\''+dpid+'\',\''+dpname+'\')" /></div><li data-theme="c" class="lb_bg" data-icon="false"><a href="#" data-transition="slide">'+content+'</a></li>';
        }else{
            return '<div class="qx_shuru"></div><li data-theme="c" class="lb_bg" data-icon="false"><a href="#" data-transition="slide">'+content+'</a></li>';
        }
    },
    getLiDividerHtml:function(dpid,dpname,dcount){
        return '<li data-role="list-divider" role="heading" class="xunshi">'+dpname+'<div class="jl"><a href="#" data-role="button" class="jl_quexian" onclick="devicepartlist_of_device.findDefectOnClick('+dpid+',\''+dpname+'\')">记录缺陷</a></div><span class="ui-li-count jsp">'+dcount+'</span></li>';
    },
    findDefectOnClick:function(dpid,dpname){
        localStorage._dpid = dpid;
        localStorage._dpname = dpname;
        $.mobile.changePage("6.html","slidedown",true,true);
    },
    userDefineOnchange:function(input,icid,content,unit,dpid,dpname){
        localStorage._icid = icid;
        localStorage._content = content;
        localStorage._dpid = dpid;
        localStorage._dpname = dpname;
        var max = new Number($(input).attr("max"));
        var min = new Number($(input).attr("min"));
        var val = new Number($(input).val());
        localStorage._userVal = val;
        localStorage._userValUnit = unit;
        if(val>max)
        {
            navigator.notification.confirm("您输入的:"+val+",超过上限:"+max+",是否保存?",devicepartlist_of_device.saveUserDefineData,"信息提示",["保存","取消"]);
        }else if(val<min){
            navigator.notification.confirm("您输入的:"+val+",低于下限:"+min+",是否保存?",devicepartlist_of_device.saveUserDefineData,"信息提示",["保存","取消"]);
        }else{
            devicepartlist_of_device.saveUserDefineData(1);
        }
        
    },
    saveUserDefineData:function(buttonIndex){
        if(buttonIndex==1){
            var _params = [
                           localStorage._username,
                           localStorage._irchunk,
                           localStorage._iiid,
                           localStorage._pointname,
                           localStorage._did,
                           localStorage._dname,
                           localStorage._dpid,
                           localStorage._dpname,
                           localStorage._icid,
                           localStorage._content,
                           'Y',
                           localStorage._userVal,
                           localStorage._userValUnit,
                           getChunk(),
                           getFormatDt(),
                           _fileSystem.root.toURL()+'/blank.gif'
                        ];
            
            localStorage.setItem("_icid"+localStorage._icid,localStorage._userVal);
            
            executeQuery(insertNewDefectOfUserDefine,_params,function(tx,results){console.log('数据保存成功');});
        }
        
    }
}