function getFormatDt(){
    var dt = new Date();
    var dtStr = dt.getFullYear();
    var dtStr = dtStr+'-';
    var dtStr = dtStr + (dt.getMonth()+1);
    var dtStr = dtStr+'-';
    var dtStr = dtStr+dt.getDate();
    var dtStr = dtStr+' ';
    var dtStr = dtStr+dt.getHours();
    var dtStr = dtStr+':';
    var dtStr = dtStr+dt.getMinutes();
    var dtStr = dtStr+':';
    var dtStr = dtStr+dt.getSeconds();
    return dtStr;
}

function getChunk(){
    var dt = new Date();
    var dtStr = dt.getFullYear();
    dtStr = dtStr+'-';
    dtStr = dtStr + (dt.getMonth()+1);
    dtStr = dtStr+'-';
    dtStr = dtStr+dt.getDate();
    dtStr = dtStr+'-';
    dtStr = dtStr+dt.getHours();
    dtStr = dtStr+'-';
    dtStr = dtStr+dt.getMinutes();
    dtStr = dtStr+'-';
    dtStr = dtStr+dt.getSeconds();
    dtStr = dtStr+'-';
    dtStr = dtStr+dt.getMilliseconds();
    return dtStr;
}

//处理ios读取到的rfid code 格式 <333EF EFD0002 77ef> 为 333EFEFD00277ef
function dealWithRfidCode(rfid_code){
    rfid_code = rfid_code.replace("<","");
    rfid_code = rfid_code.replace(">","");
    rfid_code = rfid_code.replace(" ","");
    while(rfid_code.indexOf(" ")>0){
        rfid_code = rfid_code.replace(" ","");
    }
    return rfid_code;
}


/****************************************************************************************/

//下面代码为进度条的封装

if (syj == null) var syj = {};

//进度条,parent进度条的父控件对象,width进度条的宽度,barClass进度条的css,display是否显示进度条

syj.ProgressBar=function(parent, width , barClass, display) {
    this.parent=parent;
    this.pixels = width;
    this.parent.innerHTML="<div/>";
    this.outerDIV = this.parent.childNodes[0];
    this.outerDIV.innerHTML="<div/>";
    this.fillDIV = this.outerDIV.childNodes[0];
    this.fillDIV.innerHTML = "0";
    this.fillDIV.style.width = "0px";
    this.outerDIV.className = barClass;
    this.outerDIV.style.width = (width + 2) + "px";
    this.parent.style.display = display==false?'none':'';
    document.getElementById('div_data_sync').style.display = display==false?'none':'';
}

syj.ProgressBar.prototype.setLabel = function(label){
    document.getElementById('progressLabel').innerHTML = label;
}
//更新进度条进度 pct的值要介于0和1之间

syj.ProgressBar.prototype.setPercent = function(pct) {
    
    var fillPixels;
    
    if (pct < 1.0){
        
        fillPixels = Math.round(this.pixels * pct);
        
    }else {
        
        pct = 1.0;
        
        fillPixels = this.pixels;
        
    }
    
    this.fillDIV.innerHTML =Math.round(100 * pct) + "%";
    
    this.fillDIV.style.width = fillPixels + "px";
    
}

//控制进度条的 显示/隐藏

syj.ProgressBar.prototype.display= function(v){
    
    this.parent.style.display = v==true?'':'none';
    document.getElementById('div_data_sync').style.display = v == true?'':'none';
}
