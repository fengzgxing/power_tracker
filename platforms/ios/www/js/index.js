 
//用户登陆SQL
var userLoginSql="select u.mid,u.name as username,u.account,u.deptid,d.name as deptname from member u left join department d on u.deptid = d.deptid where account=? and pwd=?";

//新增报告SQL
var newReportSql = "insert into inspection_report(starttime,mid,mname,irchunk) values(?,?,?,?)";



//登陆页面处理逻辑
var index = {
    userLogin:function(){
        var username = $('#user_input').val();
        var userpwd = $('#pwd_input').val();
        if(username=="" || username=="请输入账号"){
            kmsg("请输入账号");
        }
        else if(userpwd=="" || userpwd=="请输入密码"){
            kmsg("请输入密码");
        }else{
            executeQuery(userLoginSql,[username,userpwd],index.dealUserLogin);
        }
    },
    dealUserLogin:function(tx,results){
        var lens = results.rows.length;
        
        if(lens>0){
            //存储当前登录用户的信息
            localStorage._mid = results.rows.item(0).mid; //当前用户ID
            localStorage._username=results.rows.item(0).username;//当前用户名称
            localStorage._deptid=results.rows.item(0).deptid;//当前用户所属部门
            localStorage._deptname=results.rows.item(0).deptname;//当前用户所属部门名称
           
            localStorage._irchunk = getChunk();            
            executeQuery(newReportSql,[getFormatDt(),localStorage._mid,localStorage._username,localStorage._irchunk] ,index.dealSaveReport);
        }
        else{
            kmsg("登陆失败，不存在 "+username+" 账号");
        }
    },
    dealSaveReport:function(tx,results){
        if(results.rowsAffected>0){
            localStorage._reportid = results.insertId;
            $.mobile.changePage("2.html",{});
        }else{
            kmsg('保存数据失败');
        }
    },
    dealBtnReportOnClick:function(){
        $.mobile.changePage("report_list.html",{});
    }
}


