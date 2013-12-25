//服务器端同步地址
var server_url = "http://192.168.0.211:8080/qinju";

var syncUploadSql ="select dr.*,ir.* from defect_record dr left join inspection_report ir on ir.irchunk = dr.irchunk ";

//需要上传的数据
var needUpload = new Array();

//需要下载的数据
var needDownload = new Array() ;

//登陆页面处理逻辑
var sync = {
    pushData:function(){
        //检查网络是否连接
        if(checkConnection()){
            //清空数组
            needUpload.length=0;
            
            //查询需要同步的数据
            executeQuery(syncUploadSql,[],sync.dealPushDataResult);
            
        }else{
            kmsg('设备当前未连接到WIFI网络，无法进行数据同步');
        }
    },
    dealPushDataResult:function(tx,results){
        var lens = results.rows.length;
        for(var i=0;i<lens;i++){
            var rowdata = results.rows.item(i);
            if(rowdata.createphoto && rowdata.createphoto.length>6 && rowdata.createphoto.indexOf("/")>-1){
                var record = {};
                record.imageURI = rowdata.createphoto;
                record.options = getFileUploadOption(rowdata);
                needUpload.push(record);
            }
        }
        if(needUpload.length>0){
            jtProBar.display(true);
            sync.pushFileToServer();
        }else{
            kmsg('没有要同步的数据');
            jtProBar.display(false);
        }
    },
    pushFileToServer:function(){
        if(needUpload.length>0){
            var record = needUpload.shift();
            jtProBar.setLabel('当前正在上传文件: '+record.options.fileName+',还有'+needUpload.length+'个文件需要上传');
            getFileTransfer('upload').upload(record.imageURI, encodeURI(server_url+"/sync/sync_file"), win, fail, record.options);
        }else{
            kmsg('数据上传完成，您已同步数据到服务器');
            jtProBar.display(false);
        }
    },
    pullData:function(){
        //检查网络是否连接
        if(checkConnection()){
            needDownload.length=0;
            
            //查询需要同步的数据
            powerDB.transaction(sync.dealPullDataResult,errorMsg,sync.dealPullDataResultSuccess);
            
        }else{
            kmsg('设备当前未连接到WIFI网络，无法进行数据同步');
        }
    },
    dealPullDataResult:function(tx){
        var responseObj = $.ajax({url:server_url+"/sync/full_sync",async:false});
        var responseObjJson = eval(responseObj.responseText);
        var _total = responseObjJson.length;
        jtProBar.display(true);
        jtProBar.setLabel("正在同步基础数据...");
        for(var i=0;i<_total;i++){
            tx.executeSql(responseObjJson[i]);
        }
        jtProBar.setLabel("基础数据同步完成");
    },
    dealPullDataResultSuccess:function(){
        setTimeout(sync.getDownloadFiles,500);
    },
    getDownloadFiles:function(){
        jtProBar.setLabel("正在获取服务器端的文件信息...");
        var responseObj = $.ajax({url:server_url+"/sync/sync_file?direct=download",async:false});
        var responseObjJson = eval(responseObj.responseText);
        var _total = responseObjJson.length;
        for(var i=0;i<_total;i++){
            needDownload.push(responseObjJson[i]);
        }
        if(_total>0){
            jtProBar.setLabel("已获取到"+_total+"个文件需要同步到PAD端,准备下载文件...");
            setTimeout(downloadPhoto,500);
        }else{
            kmsg("没有要同步的文件，数据同步完成");
            jtProBar.display(false);
        }
    },
    
}

function downloadPhoto(){
    
    if(needDownload.length>0){
        var _download_filename = needDownload.shift();
       
        jtProBar.display(true);
        jtProBar.setLabel("正在同步文件 : "+ _download_filename+",还有"+needDownload.length+"个文件需要下载");
        _fileSystem.root.getFile(
                                 _download_filename,
                                 {create:false},
                                 function(fileEntry){
                                    downloadPhoto();
                                 },
                                 function(error){
                                    var _sourceUrl = encodeURI(server_url+"/upload/"+_download_filename);
                                    var _targetUrl = _fileSystem.root.fullPath+"/"+_download_filename;
                                    getFileTransfer('download').download(_sourceUrl,_targetUrl,win,fail);
                                 });
    }else{
        kmsg("文件下载完成");
        jtProBar.display(false);
    }
}
function uploadPhoto(){
    if(needUpload.length>0){
        var record = needUpload.shift();
        jtProBar.setLabel('当前正在上传文件: '+record.options.fileName);
        getFileTransfer('upload').upload(record.imageURI, encodeURI(server_url+"/sync/sync_file"), win, fail, record.options);
    }else{
        kmsg('数据上传完成，您已同步数据到服务器');
        jtProBar.display(false);
    }
}


function win(r) {
    console.log("Code = " + r.responseCode);
    console.log("Response = " + r.response);
    console.log("Sent = " + r.bytesSent);
}

function fail(error) {
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
}

//获取文件传输对象
function getFileTransfer(type){
    var ft = new FileTransfer();
    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            var precent= progressEvent.loaded / progressEvent.total;
            jtProBar.setPercent(precent);
            if(precent==1){
                if(type=='upload'){
                    uploadPhoto();
                }else if(type=='download'){
                    downloadPhoto();
                }
            }
        } else {
            console.log("loadingStatus.increment()");
        }
    };
    return ft;
}

//获取文件传输所需要的options
function getFileUploadOption(rowdata){
    var options = new FileUploadOptions();
    options.fileKey="file";
    options.fileName=rowdata.createphoto.substr(rowdata.createphoto.lastIndexOf('/')+1);
    options.mimeType="image/jpeg";
    var params = {
        'report.starttime':rowdata.starttime,
        'report.endtime':rowdata.endtime,
        'report.mid':rowdata.mid,
        'report.mname':rowdata.mname,
        'report.psid':rowdata.psid,
        'report.psname':rowdata.psname,
        'report.cid':rowdata.cid,
        'report.cname':rowdata.cname,
        'report.status':rowdata.status,
        'report.irchunk':rowdata.irchunk,
        'defect.irchunk':rowdata.irchunk,
        'defect.ipid':rowdata.ipid,
        'defect.ipname':rowdata.ipname,
        'defect.did':rowdata.did,
        'defect.dname':rowdata.dname,
        'defect.result_type':rowdata.result_type,
        'defect.val':rowdata.val,
        'defect.unit':rowdata.unit,
        'defect.dpid':rowdata.dpid,
        'defect.dpname':rowdata.dpname,
        'defect.level':rowdata.level,
        'defect.description':rowdata.description,
        'defect.createtime':rowdata.createtime,
        'defect.creater':rowdata.creater,
        'defect.createphoto':options.fileName,
        'defect.ddid':rowdata.ddid,
        'defect.drchunk':rowdata.drchunk
    };
    console.log(params);
    options.params = params;
    return options;
}
