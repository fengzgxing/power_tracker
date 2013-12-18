//扫描标签 二维码 界面
var queryPointByBarcodeSql = "select * from inspection_point where barcode = ?";


var iclick=false;
var echoValue = '';
var scan ={
    startScan:function(button){
        iclick = true;
        window.rfid("echome",scan.dealScanResult);
    },
    dealScanResult:function(_echoValue){
        echoValue = _echoValue;
        if(echoValue.length>0 && echoValue !='Error'){
            executeQuery(queryPointByBarcodeSql,[echoValue],scan.dealQueryPointByBarcode)
        }
        else
        {
            navigator.notification.alert('未扫描到巡视点标签，请重新扫描',null,'信息提示','确定');
        }
        iclick=false;
    },
    dealQueryPointByBarcode:function(tx,results){
        if(results.rows.length>0){
            localStorage._pointname = results.rows.item(0).name;
            localStorage._iiid = results.rows.item(0).iiid;
            localStorage._rfidCode = echoValue;
            $.mobile.changePage("4.html","slidedown",true,true);
        }else{
            avigator.notification.prompt("此射频标签未绑定到巡视点，是否立即绑定？",scan.dealPromptResult,"信息提示",["不绑定","立即绑定"],echoValue);
        }
    },
    dealPromptResult:function(result){
        if(result.buttonIndex==2){
            localStorage._rfidCode =echoValue;
            $.mobile.changePage("point_list.html","slidedown",true,true);
        }
    }
};


