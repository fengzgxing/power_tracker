/**
 *
 * createtime, 发现时间
 * creater, 发现人
 * irid, 巡视报告编号
 * ipid, 巡视点ID
 * ipname,巡视点名称
 * did, 设备ID
 * dname, 设备名称
 * dpid, 设备部件ID
 * dpname, 设备部件名称
 * level, 缺陷级别
 * description, 缺陷描述
 * createphoto 缺陷照片
 * dealtime 消缺时间
 * dealer  消缺人
 * dealphoto 消缺照片
 *
 **/

var params ;

//查询各个具体设备下的巡视标准
var queryContentByDpid  = "select dd.ddid,dd.description,dd.level,dr.createphoto,dr.level,dr.drchunk,dr.dealphoto,dr.state from defect_define dd left join defect_record dr on dd.ddid = dr.ddid where dd.dpid = ?";

//插入新发现的缺陷
var insertNewDefect = "insert into defect_record(creater,irchunk,ipid,ipname,did,dname,dpid,dpname,level,description,createphoto,ddid,drchunk,createtime) values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

//更新消缺信息与缺陷图片信息
var updateDefectSql = "update defect_record set createphoto=?,level=?,dealphoto=?,dealtime=?,dealer=? where drchunk=?";

//查询缺陷级别信息
var queryDefectLevelSql = "select * from defect_level";

var defectArray =null;

var levelArray = new Array();

var defect_list = {
    
    pageInit:function(){
        
        params = [localStorage._username,localStorage._irchunk,localStorage._iiid,localStorage._pointname,localStorage._did,localStorage._dname,localStorage._dpid,localStorage._dpname];
        
        defectArray= new Array();
        
        $('#page_defect_list_title').html(localStorage._dpname+'缺陷定义');
        if(levelArray.length==0){
            executeQuery(queryDefectLevelSql,[],defect_list.dealQueryDefectLevelSql);
        }else{
             executeQuery(queryContentByDpid,[localStorage._dpid],defect_list.dealQueryContentByDpid);
        }
       
        $('#btnOk').bind('click',defect_list.dealBtnOkClick);
    },
    dealQueryDefectLevelSql:function(tx,results){
        var lens = results.rows.length;
        if(lens>0){
            for(var i=0;i<lens;i++){
                levelArray[i]=results.rows.item(i).level;
            }
        }
        executeQuery(queryContentByDpid,[localStorage._dpid],defect_list.dealQueryContentByDpid);
    },
    dealQueryContentByDpid:function(tx,results){
        var lens = results.rows.length;
        if(lens>0){
            var innerHtml = "";
            for(var i=0;i<lens;i++){
                innerHtml = innerHtml + defect_list.getHtml(results.rows.item(i).description,results.rows.item(i).ddid,results.rows.item(i).level,results.rows.item(i).createphoto,results.rows.item(i).dealphoto,results.rows.item(i).drchunk,results.rows.item(i).state);
            }
         
            $('#colla').html(innerHtml).trigger("create");
        }
        //executeQuery('select * from defect_record',[],defect_list.viewdata);
    },
    viewdata:function(tx,results){
        for(var i=0;i<results.rows.length;i++){
           console.log(results.rows.item(i).irchunk+","+results.rows.item(i).drchunk);
        }
    },
    getHtml:function(description,ddid,level,imageURL,dealImageURL,drchunk,state){
        var imgDisplay = 'none';
        var dealImgDisplay = 'none';
        if(imageURL && imageURL.length>4){
            imgDisplay = 'block';
            var defect = {};
            defect.ddid = ddid;
            defect.state=state;
            defect.description = description;
            if(imageURL.indexOf("/")==-1){
                imageURL = _fileSystem.root.toURL() +"/"+imageURL;
            }
            defect.createphoto = imageURL;
            defect.status = 'old';
            defect.level = level;
            defect.drchunk = drchunk;
            
            if(dealImageURL && dealImageURL.length>4 ){
                if(dealImageURL.indexOf("/")==-1){
                    dealImageURL = _fileSystem.root.toURL() +"/"+dealImageURL;
                }
                dealImgDisplay='block';
                defect.dealphoto = dealImageURL;
            }
            
            defectArray.push(defect);
        }
 
        var divHtml = ' <div data-role="collapsible" data-theme="d" data-collapsed="false" data-content-theme="d" data-collapsed-icon="false">';
        
        divHtml = divHtml+'<h4 id="qx">';
        divHtml = divHtml+description;
        divHtml = divHtml+'</h4>';
        divHtml = divHtml+defect_list.getLevelSelect(ddid,level,imgDisplay);
        divHtml = divHtml+'<div class="ui-grid-b">';
        divHtml = divHtml+'<div class="ui-block-a"><a class="xj" data-role="button"><img src="images/icon_camera.png" onclick="defect_list.cameraOnClick(true,'+ddid+',\''+description+'\');" /></a>';
        divHtml = divHtml+'<img id="defect_img'+ddid+'" src="'+imageURL+'" style="display:'+imgDisplay+';height:70px;width:85px;" onclick="defect_list.showBigImg();"/>';
        divHtml = divHtml+'</div>';
        divHtml = divHtml+'<div class="ui-block-b" style="display:'+imgDisplay+'"><a class="xj" data-role="button"><img src="images/icon_camera.png" onclick="defect_list.cameraOnClick(false,'+ddid+',\''+description+'\');" /></a>';
        divHtml = divHtml+'<img id="x_defect_img'+ddid+'" src="'+dealImageURL+'" style="display:'+dealImgDisplay+';height:70px;width:85px;" onclick="defect_list.showBigImg();"/>';
        divHtml = divHtml+'</div>';
        divHtml = divHtml+'</div>';
        divHtml = divHtml+'</div>';
        return divHtml;
    },
    cameraOnClick:function(isNewDefect,ddid,description){
        localStorage._ddid = ddid;
        localStorage._description = description;
        localStorage._isNewDefect = isNewDefect;  //判定是缺陷照片还是消缺照片
        if(isNewDefect)
        {
            navigator.camera.getPicture(defect_list.onPhotoDataSuccessNewDefect,defect_list.onFail,cameraConfig);
        }else{
            navigator.camera.getPicture(defect_list.onPhotoDataSuccessOldDefect,defect_list.onFail,cameraConfig);
        }
        
    },
    onPhotoDataSuccessNewDefect:function(imageURL){
        var defect = {};
        var simg = document.getElementById('defect_img'+localStorage._ddid);
        simg.style.display='block';
        simg.src=imageURL;
        defect.createphoto = imageURL;
        //判断数组中是否存在该缺陷的描述
        var exist = false;
        for(var i=0;i<defectArray.length;i++){
            if(defectArray[i].ddid == localStorage._ddid){
                defectArray[i].createphoto=imageURL;
                defectArray[i].status='update';
                exist = true;
                break;
            }
        }
        //不存在数组就添加2013-12-22-19-29-27-701
        if(!exist){
            defect.status='new';
            defect.ddid = localStorage._ddid;
            defect.description = localStorage._description;
            defect.drchunk = getChunk();
            defect.createtime = getFormatDt();
            defectArray.push(defect);
        }
        
    },
    onPhotoDataSuccessOldDefect:function(imageURL){
        //判断数组中是否存在该缺陷的描述
        for(var i=0;i<defectArray.length;i++){
            if(defectArray[i].ddid == localStorage._ddid){
                defectArray[i].dealphoto=imageURL;
                defectArray[i].dealtime = getFormatDt();
                defectArray[i].status='update';
                break;
            }
        }
        var simg = document.getElementById('x_defect_img'+localStorage._ddid);
        simg.style.display='block';
        simg.src=imageURL;
        
    },
    onFail:function(message){
        kmsg(message);
    },
    dealBtnOkClick:function(){
        for(var i=0;i<defectArray.length;i++){
            console.log(defectArray[i]);
            if(defectArray[i].status=='new'){
                var _params = params.concat(defectArray[i].level,defectArray[i].description,defectArray[i].createphoto,defectArray[i].ddid,defectArray[i].drchunk,defectArray[i].createtime);
            
                executeQuery(insertNewDefect,_params,defect_list.dealInsertNewDefect);
            }else if(defectArray[i].status=='update'){
                // "update defect_record set createphoto=?,level=?,dealphoto=?,dealtime=?,dealer=? where drchunk=?";
                executeQuery(updateDefectSql,[defectArray[i].createphoto,defectArray[i].level,defectArray[i].dealphoto,defectArray[i].dealtime,localStorage._username,defectArray[i].drchunk],defect_list.dealUpdateDefect);
            }
        }
        $.mobile.changePage("5.html","slidedown",true,true);
    },
    dealInsertNewDefect:function(tx,results){
        console.log('insert new defect : '+results.insertId);
    },
    dealUpdateDefect:function(tx,results){
        console.log('update result : '+results.rowsAffected);
    },
    dealSelectDefectLevel:function(ddid,level){
        
        for(var i=0;i<defectArray.length;i++){
            if(defectArray[i].ddid == ddid){
                defectArray[i].level = level;
                if(defectArray[i].status=='old')
                {
                    defectArray[i].status='update';
                }
            }
            break;
        }
    },
    getLevelSelect:function(ddid,level,imgDisplay){
        var disabled = "";
        if(imgDisplay=='none'){
            //disabled = 'disabled="disabled"';
        }
        var select = '<div class="qxdy"><select id="select'+ddid+'" '+disabled+' onchange="defect_list.dealSelectDefectLevel('+ddid+',this.options[this.options.selectedIndex].value)">';
        select = select+'<option value=“”>选择缺陷级别</option>';
        for(var i=0;i<levelArray.length;i++){
            if(level == levelArray[i]){
                select = select+'<option value='+levelArray[i]+' selected>'+levelArray[i]+'</option>';
            }else{
                select = select+'<option value='+levelArray[i]+'>'+levelArray[i]+'</option>';
            }
        }
        
        select = select+'</select></div> ';
        
        return select;
    }
    
}