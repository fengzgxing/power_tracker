//扫描标签 二维码 界面
var queryPointByBarcodeSql = "select * from inspection_point where barcode like ?";


var reading = false;

var scan ={
    
    pageInit:function(){
        reading = false;
      
        window.rfid("open");
    },
    startScan:function(button){
        if(!reading){
            reading = true;
            window.rfid("read",scan.dealScanResult);
        }
    },
    dealScanResult:function(_rfidCode){
        
        if(_rfidCode.length>0 && _rfidCode !='Error'){
            
            _rfidCode = dealWithRfidCode(_rfidCode);
            
            localStorage._rfidCode = _rfidCode;
            
            executeQuery(queryPointByBarcodeSql,['%'+_rfidCode+'%'],scan.dealQueryPointByBarcode);
        }
        else
        {
            kmsg('未扫描到巡视点标签，请重新扫描');
        }
        reading=false;
    },
    dealQueryPointByBarcode:function(tx,results){
        if(results.rows.length>0){
            
            localStorage._pointname = results.rows.item(0).name;
            localStorage._iiid = results.rows.item(0).iiid;
            
            window.rfid("close");
            reading = false;
            
            $.mobile.changePage("4.html","slidedown",true,true);
            
        }else{
            navigator.notification.prompt("此射频标签未绑定到巡视点，是否立即绑定？",scan.dealPromptResult,"信息提示",["不绑定","立即绑定"],localStorage._rfidCode);
        }
    },
    dealPromptResult:function(result){
        if(result.buttonIndex==2){
            $.mobile.changePage("point_list.html","slidedown",true,true);
            window.rfid("close");
            reading = false;
        }
    },
    dealScanBack:function(){
        window.rfid("close");
        reading = false;
        $.mobile.changePage("2.html","slidedown",true,true);
    }
};


