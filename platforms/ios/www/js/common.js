var syncUrl = "http://app.cnksi.com.cn/qj/sync/full_sync";

var userLoginSql="select u.name as username,u.account,u.deptid,d.name as deptname from member u left join department d on u.deptid = d.deptid where account=? and pwd=?";





window.rfid = function(str ,callback){
    cordova.exec(callback,function(str){
                 callback(str);
                },"Rfid","echo",[str]);
};



var powerDB = null;

if(powerDB==null){
    powerDB = window.openDatabase("power_tracker_7","1.0","power_tracker",200000);
}

function clearDB(){
   //powerDB.transaction(function(tx){tx.executeSql('select name from sqlite_master where type="table"',[],function(tx,results){ alert(results.rows.length);},errorMsg)});
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

//执行sql查询
function executeQuery(sql,params,callback){
    powerDB.transaction(function(tx){tx.executeSql(sql,params,callback);},errorMsg);
}

//用户登陆
var index = {
    userLogin:function(){
        var username = $('#user_input').val();
        var userpwd = $('#pwd_input').val();
        if(username=="" || username=="请输入账号"){
            navigator.notification.alert("请输入账号");
        }
        else if(userpwd=="" || userpwd=="请输入密码"){
            navigator.notification.alert("请输入密码");
        }else{
            executeQuery(userLoginSql,[username,userpwd],index.dealUserLogin);
        }
    },
dealUserLogin:function(tx,results){
    var lens = results.rows.length;
    if(lens>0){
        //存储当前登录用户的信息
        localStorage.mid = results.rows.item(0).mid; //当前用户ID
        localStorage._username=results.rows.item(0).username;//当前用户名称
        localStorage._deptid=results.rows.item(0).deptid;//当前用户所属部门
        localStorage._deptname=results.rows.item(0).deptname;//当前用户所属部门名称
        $.mobile.changePage("2.html","slidedown",true,true);
    }
    else{
        alert("登陆失败，不存在 "+username+" 账号");
    }
},
httpSyncDb:function(){
    clearDB();
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


