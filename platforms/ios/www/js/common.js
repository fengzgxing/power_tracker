
var powerDB = null;


//当前文件系统
var _fileSystem ;

if(powerDB==null){
    powerDB = window.openDatabase("power_tracker502","1.1","power_tracker",20971520);
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
    kmsg("操作成功");//,function(){},'信息提示','确定');
}

function errorMsg(err){
    if(err.message.indexOf('no such table: defect_record')>-1){
        powerDB.transaction(sync.pullData,errorMsg,successMsg);
    }else{
        kmsg("错误信息："+err.message);//,function(){},'信息提示','确定');
    }
}

//执行sql查询
function executeQuery(sql,params,callback){
    powerDB.transaction(function(tx){tx.executeSql(sql,params,callback);},errorMsg);
}

//读取RIFD,action = open 打开读卡器 action = close 关闭读卡器 action = read 读取标签
window.rfid = function(action,callback){
    cordova.exec(scan.dealScanResult,function(error){kmsg("读取RFID标签错误："+error)},"Rfid","readRfid",[action]);
}

function kmsg(msg){
    if(typeof(msg)=='string'){
        navigator.notification.alert(msg,function(){},'信息提示','确定');
    }else{
        alert(msg);
    }
}

var cameraConfig={
    quality         : 50,
    destinationType : navigator.camera.DestinationType.FILE_URI,
    sourceType      : navigator.camera.PictureSourceType.PHOTOLIBRARY,
    allowEdit : true,
    encodingType: Camera.EncodingType.JPEG,
    targetWidth: 100,
    targetHeight: 100,
    popoverOptions: CameraPopoverOptions,
    saveToPhotoAlbum: true
}