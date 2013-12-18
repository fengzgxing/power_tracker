
//查询电厂下的巡视列表
var queryPointByPsid = "select * from inspection_point where psid = ? order by ord,barcode";
var updateBacodeByIiid = "update inspection_point set barcode = ? where iiid = ? ";

var page_point_list = {
    
    pageInit:function(){
        $("#page_point_list_title").html(localStorage._psname+'电厂巡视点列表');
        powerDB.transaction(
                        function(tx){tx.executeSql(
                                                   queryPointByPsid,
                                                   [localStorage._psid],
                                                   function(tx,results){
                                                        var lens = results.rows.length;
                                                        if(lens>0){
                                                            var innerhtml = "";
                                                            for(var i=0;i<lens;i++){
                                                                innerhtml = innerhtml+page_point_list.getLiHtml(results.rows.item(i).iiid,results.rows.item(i).name);
                                                            }
                                                            $('#point_list').html(innerhtml);
                                                            $("#point_list").listview("refresh");
                                                        }
                                                        else{
                                                            alert(localStorage._psname+'电厂无巡视点列表信息');
                                                        }
                                                   });
                        }, errorMsg);
    },
    itemOnClick:function(iiid,name){
        navigator.notification.confirm(
                                       '确定要将此标签绑定到巡视点'+name+'么？',
                                       function(buttonIndex){
                                            if(buttonIndex==2){
                                                powerDB.transaction(function(tx){tx.executeSql(updateBacodeByIiid,[localStorage._rfidCode,iiid]);$.mobile.changePage("3.html","slidedown",true,true);},errorMsg);
                                            }
                                       },
                                       '信息确认',
                                       ['取消','确定']
                                    );
    },
    getLiHtml:function(iiid,point_name){
       // var li = '<li data-role="list-divider" role="heading" style="padding:15px;font-size:18px;">'+point_name+'</li>';
        var li = '<li data-theme="c" class="lb_bg"><a href="#" data-transition="slide" onclick="page_point_list.itemOnClick('+iiid+',\''+point_name+'\')")>'+point_name+'</a> </li>';

        return li;
    }
    
    
};

