

//查询当前用户所在部门的巡视卡列表信息
var queryCardListSql = "select c.*,ps.name  from card c left join power_station ps on c.psid = ps.psid where deptid = ? order by psid";

//选择巡视表后，更新变电站及巡视表名称
var updateReportStep2 = "update inspection_report set psid=?,psname=?,cid=?,cname=? where irchunk = ?";

//巡视卡列表界面，第二个界面（登录后的界面）
var cardlist = {
    //初始化巡视表界面，加载巡视表
    pageInit:function(){
        $("#page2_title").html(localStorage._deptname+'-巡视表');
        $("#loginUser").html("您好:"+localStorage._username);
        executeQuery(queryCardListSql,[localStorage._deptid],cardlist.queryCardList);
    },
    queryCardList:function(tx,results){
        var lens = results.rows.length;
        if(lens>0){
            var innerhtml = "";
            var psname = "";
            for(var i=0;i<lens;i++){
                if(results.rows.item(i).name !=psname){
                    innerhtml = innerhtml+cardlist.getLiDividerHtml(results.rows.item(i).name);
                    psname = results.rows.item(i).name;
                }
                innerhtml = innerhtml+cardlist.getLiHtml(results.rows.item(i).cardid,results.rows.item(i).cardname,results.rows.item(i).psid,psname);
            }
            $('#cardlist').html(innerhtml);
            $("#cardlist").listview("refresh");
        }
        else{
            kmsg("当前用户所在部门没有配置巡视表，请在后台配置巡检表后再使用");
        }
    },
    itemOnClick:function(cardid,cardname,psid,psname){
        localStorage._cardid = cardid;
        localStorage._psid = psid;
        localStorage._cardname=cardname;
        localStorage._psname = psname;
        executeQuery(updateReportStep2,[localStorage._psid,localStorage._psname,localStorage._cardid,localStorage._cardname,localStorage._irchunk],cardlist.dealSaveReport);
    },
    dealSaveReport:function(tx,results){
         if(results.rowsAffected>0){             
            $.mobile.changePage("3.html","slidedown",true,true);
         }
    },
    dealBtnExit:function(){
        localStorage.clear();
        $.mobile.changePage("index.html","slidedown",true,true);
    },
    getLiHtml:function(cardid,cardname,psid,psname){
        var li = '<li data-theme="c" ><a href="#" data-transition="slide" onclick="cardlist.itemOnClick('+cardid+',\''+cardname+'\','+psid+',\''+psname+'\')")>'+cardname+'</a> </li>';
        return li;
    },
    getLiDividerHtml:function(name){
        return '<li data-role="list-divider" role="heading" style="padding:15px;font-size:18px;">'+name+'</li>';
    }
}

