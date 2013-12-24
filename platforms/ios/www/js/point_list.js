
//查询电厂下的巡视列表
var queryPointByPsidSql = "select * from inspection_point where psid = ? order by barcode,ord";
var updateBacodeByIiidSql = "update inspection_point set barcode = ? where iiid = ? ";

var page_point_list = {
    
    pageInit:function(){
        $("#page_point_list_title").html(localStorage._psname+'巡视点列表');
        executeQuery(queryPointByPsidSql,[localStorage._psid],page_point_list.dealQueryPointByPsidSql);
    },
    dealQueryPointByPsidSql:function(tx,results){
        var lens = results.rows.length;
        if(lens>0){
            var innerhtml = "";
            for(var i=0;i<lens;i++){
                innerhtml = innerhtml+page_point_list.getLiHtml(results.rows.item(i).iiid,results.rows.item(i).name,results.rows.item(i).barcode);
            }
            $('#point_list').html(innerhtml);
            $("#point_list").listview("refresh");
        }
        else{
            kmsg(localStorage._psname+'电厂无巡视点列表信息');
        }
    },
    itemOnClick:function(iiid,name){
        localStorage._iiid_ =iiid;
        navigator.notification.confirm('确定要将此标签绑定到巡视点'+name+'么？',page_point_list.dealConfirmResult,'信息确认',['取消','确定']);
    },
    dealConfirmResult:function(buttonIndex){
        if(buttonIndex==2){
            executeQuery(updateBacodeByIiidSql,[localStorage._rfidCode,localStorage._iiid_],page_point_list.dealUpdateBacodeByIiidSql);
        }
    },
    dealUpdateBacodeByIiidSql:function(tx,results){
        $.mobile.changePage("3.html","slidedown",true,true);
    },
    getLiHtml:function(iiid,point_name,barcode){
        var li = '<li data-theme="c" class="li_bg">';
        if(!barcode || barcode=='null'){
            barcode="未设定";
        }
        li = li + '<a href="" data-transition="slide" onclick="page_point_list.itemOnClick('+iiid+',\''+point_name+'\')")><p class="li_top">';
        li = li + point_name;
        li = li + '</p>';
        li = li + '<span>射频标签：'+barcode+'</span><br /><span>二维码：'+barcode+'</span>';
        li = li + '</a></li>';
        return li;
    }   
    
};

