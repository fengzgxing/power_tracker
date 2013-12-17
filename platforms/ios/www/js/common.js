
var syncUrl = "http://app.cnksi.com.cn/qj/sync/full_sync";

var userLoginSql="select u.name as username,u.account,u.deptid,d.name as deptname from member u left join department d on u.deptid = d.deptid where account=? and pwd=?";

var xunjianCardSql = "select * from card where deptid = ?";

var queryPointByBarcode = "select * from inspection_point where barcode = ?";

//查询某个巡视点下的设备列表
var queryDeviceSql = "select * from device where did in (select distinct(did) from card_content_ref where cardid = ? and iiid in (select iiid from inspection_point where barcode = ?) )";

//查询某个巡视点、巡视设备 下的设备部件
var queryDevicePartSql = "select * from device_part where dpid in ( select distinct(dpid) from card_content_ref where iiid=? and did = ?) ";

//查询巡视内容
var queryContentSql = "select * from inspection_content where icid in ( select distinct(icid) from card_content_ref where iiid=? and dpid = ?)";

window.rfid = function(str ,callback){
    cordova.exec(callback,function(str){
                 callback(str);
                 },"Rfid","echo",[str]);
};



var powerDB = null;

if(powerDB==null){
    powerDB = window.openDatabase("power_tracker_6","1.0","power_tracker",200000);
}

/**判断当前网络是否连接到wifi**/
function checkConnection(){
    
    var networkState = navigator.connection.type;
    
    if(networkState==Connection.WIFI){
        return true;
    }else{
        return false;
    }
}


function successMsg(){
    alert('successMsg');
}


function errorMsg(err){
    navigator.notification.alert("错误信息："+err.message);
}

//用户登陆
var index = {
    
userLogin:function(){
    var username = $('#user_input').val();
    var userpwd = $('#pwd_input').val();
    if(username=="" || username=="请输入账号"){
        navigator.notification.alert("请输入账号");
    }else if(userpwd=="" || userpwd=="请输入密码"){
        navigator.notification.alert("请输入密码");
    }else{
        powerDB.transaction(
                            function(tx){
                                tx.executeSql(
                                              userLoginSql,
                                              [username,userpwd],
                                              function(tx,results){
                                              var lens = results.rows.length;
                                              if(lens>0){
                                              
                                              localStorage._username=results.rows.item(0).username;
                                              localStorage._deptid=results.rows.item(0).deptid;
                                              localStorage._deptname=results.rows.item(0).deptname;
                                              
                                              $.mobile.changePage("xunjianliebiao.html","slidedown",true,true);
                                              }
                                              else{
                                              alert("登陆失败，不存在 "+username+" 账号");
                                              }
                                              }
                                );
                            },errorMsg
        );
    }
},
dealUserLogin:function(tx,username,userpwd){
    
},
httpSyncDb:function(){
    if(checkConnection()){
        powerDB.transaction(index.dealHttpSyncDb,errorMsg,successMsg);
    }else{
        alert('设备当前未连接到WIFI网络，无法进行数据同步');
    }
},
dealHttpSyncDb:function(tx){
    var responseObj = $.ajax({url:syncUrl,async:false});
    var responseObjJson = eval(responseObj.responseText);
    $.each(responseObjJson,function(i,sql){tx.executeSql(sql);});
}
}



var xunjianliebiao = {

//初始化巡视表界面，加载巡视表
pageInit:function(){
    powerDB.transaction(
                        function(tx){
                        tx.executeSql(
                                      xunjianCardSql,
                                      [localStorage._deptid],
                                      function(tx,results){
                                      var lens = results.rows.length;
                                      if(lens>0){
                                        var innerhtml = "";
                                        for(var i=0;i<lens;i++){
                                            innerhtml = innerhtml+'<li data-theme="c"><a href="#" data-transition="slide" onclick="xunjianliebiao.itemOnClick('+results.rows.item(i).cardid+')")>'+results.rows.item(i).cardname+'</a> </li>';
                                        }
                                        $('#cardlist').html(innerhtml);
                                        $("#cardlist").listview("refresh");
                                      }
                                      else{
                                        alert("当前用户所在部门没有配置巡视表，请在后台配置巡检表后再使用");
                                      }
                                      });
                        }, errorMsg);
    },
itemOnClick:function(cardid){
    localStorage._cardid = cardid;
     $.mobile.changePage("qxjlbd.html","slidedown",true,true);
}

}

//------------------------------------------------

var iclick=false;

var scan ={
   
startScan:function(button){
    if(!iclick){
        iclick=true;
        window.rfid("echome",function(echoValue){
                    if(echoValue!=""){
                     echoValue = echoValue.substr(1,31);
                    
                        powerDB.transaction(function(tx){
                                            tx.executeSql(
                                                          queryPointByBarcode,
                                                          [echoValue],
                                                          function(tx,results){
                                                            if(results.rows.length>0){
                                                                localStorage._pointname = results.rows.item(0).name;
                                                          localStorage._iiid = results.rows.item(0).iiid;
                                                                localStorage._rfidCode = echoValue;
                                                                $.mobile.changePage("xsaj.html","slidedown",true,true);
                                                            }else{
                                                                alert("数据库中无此巡视点，请确认");}
                                                            }),errorMsg
                                            });
                    
                    }else
                    {
                        alert("未扫描到巡视点标签，请重新扫描");
                    }
                    iclick=false;
        });
    }
}
    
}

//------------------------------------------------

//巡视点下的设备列表
var devicelist_of_point = {
    //初始化巡视表界面，加载巡视表
pageInit:function(){
    $('#page_inspection_point_title').html(localStorage._pointname+' - 巡视点 巡视设备列表');
    powerDB.transaction(function(tx){
                        tx.executeSql(
                                      queryDeviceSql,
                                      [localStorage._cardid,localStorage._rfidCode],
                                      function(tx,results){
                                      if(results.rows.length>0){
                                        var innerhtml = "";
                                        var lens = results.rows.length;
                                        for(var i=0;i<lens;i++){
                                        var __did = results.rows.item(i).did;
                                        var __dname = results.rows.item(i).name;
                                        innerhtml = innerhtml+'<li data-theme="c"><a href="#" data-transition="slide" onclick="devicelist_of_point.itemOnClick('+__did+',\''+__dname+'\')">'+__dname+'</a> </li>';
                                        }
                                      
                                        $('#devicelist').html(innerhtml);
                                        $("#devicelist").listview("refresh");
                                      }else{
                                        alert("数据库中无设备数据，请在后台配置");}
                                      }),errorMsg
                        });
},
itemOnClick:function(did,dname){
    localStorage._did = did;
    localStorage._dname = dname;
    $.mobile.changePage("xsnr.html","slidedown",true,true);
}
}


//------------------------------------------
var devicepartlist_of_device={
    
pageInit:function(){
    $('#page_devicepartlist_title').html(localStorage._dname+' - 具体巡视设备列表');
    powerDB.transaction(function(tx){
                        tx.executeSql(
                                      queryDevicePartSql,
                                      [localStorage._iiid,localStorage._did],
                                      function(tx,results){
                                      if(results.rows.length>0){
                                      var innerhtml = "";
                                      var lens = results.rows.length;
                                      for(var i=0;i<lens;i++){
                                        innerhtml = innerhtml+devicepartlist_of_device.getDivHtml(results.rows.item(i).dpid,results.rows.item(i).name);
                                      }
                                      innerhtml = innerhtml+'<a href="#" data-inset="true" data-theme="c" data-role="button">确定</a>';
                                      $('#devicepartlist').append(innerhtml).trigger("create");
                                      
                                      }else{
                                        alert("数据库中无详细的设备数据，请在后台配置");}
                                      }),errorMsg
                        });
},
h3ItemOnClick:function(dpid){
    
    localStorage._dpid = dpid;
    
    powerDB.transaction(function(tx){
                        tx.executeSql(
                                      queryContentSql,
                                      [localStorage._iiid,localStorage._dpid],
                                      function(tx,results){
                                      if(results.rows.length>0){
                                        var innerhtml = "";
                                        var lens = results.rows.length;
                                      
                                        for(var i=0;i<lens;i++){
                                            innerhtml = innerhtml+devicepartlist_of_device.getLiHtml(results.rows.item(i).icid,results.rows.item(i).content,results.rows.item(i).result_type);
                                        }
                                      
                                        $('#dpcontent'+dpid).html(innerhtml);
                                        $('#dpcontent'+dpid).listview('refresh');
                                      }else{
                                        alert("数据库中无详细的设备数据，请在后台配置");}
                                      }),errorMsg
                        });

},
getDivHtml:function(dpid,dpname){
    var html='<div data-role="collapsible" data-theme="b"ata-collapsed="true" >';
    html = html +'<h3 onclick="devicepartlist_of_device.h3ItemOnClick('+dpid+')">';
    html = html + dpname;
    html = html+'</h3>';
    html = html +'<ul data-role="listview" data-inset="false" data-theme="c" id="dpcontent'+dpid+'">';
    html = html + '</ul></div>';
    return html;
},
getLiHtml:function(icid,content,result_type){
    
    var li = '<li class="lb_bg"><a href="jlqx.html">'+content+'</a>';
    if(result_type != 'Y'){
        li = li + '<p class="shuoming1">一般缺陷</p></li>';
    }else{
        li = '<li class="lb_bg"> <div class="qxdy" style="margin-right:30px;"> <input type="text" value="" style="width:60px;height:24px;font-size:14px; margin-left:10px;">mA</div> <a href=”#“ >'+content+'</a> </li>';
    }
    return li;
}
    
    
}
