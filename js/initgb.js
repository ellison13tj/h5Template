
/* ua */
var UA = function() {
    var userAgent = navigator.userAgent.toLowerCase();
    return {
        ipad: /ipad/.test(userAgent),
        iphone: /iphone/.test(userAgent),
        android: /android/.test(userAgent),
        qqnews: /qqnews/.test(userAgent),
        weixin: /micromessenger/.test(userAgent)
    };
}

var layout = {
    init: function() {
        var _this = this,
            _w = $(window).width(),
            _h = $(window).height(),
            _len = $(".layout").length;
        var ua = UA();
        //console.log(ua);
        if (ua.iphone && ua.qqnews) {
            //_h = _h - 44;
        }
        $(".swipeTip").addClass("fadeOutUp");
        $(".global").width(_w).height(_h * _len).addClass("ease");
        $(".screen").width(_w).height(_h * _len);
        $(".layout").width(_w).height(_h);
        $(".load").width(_w).height(_h);

        //for ".wrap" init
        $(".wrap").each(function(index, elem){
            var tempH = _h/2 - $(this).height()/2 - 15;
            $(this).css("top",tempH+"px");
        });


        var mh = $(".m1 img").height();
        $(".mpic").height(mh);
        if(_h < 500){
            $(".mdetail").height((_h - mh)*0.5);
        }
        $(".mpic .m1 img").css("clip","rect(0px,auto,auto,"+_w/2+"px)")

        if (!ua.qqnews) {
            /*$('#layout_3 .foot').hide();
            $('#layout_3 .main').css("height", "100%");*/
        }
        

        //init pageSlide
        var oPage = new PageSlide(".layout");
        oPage.pageTo(0, oPage.h);
        //oPage.swipeTo(oPage.h, oPage.len);
    }
}


function PageSlide(elem){
    this.oElem = $(elem);
    this.len = this.oElem.length;
    this.w = $(window).width();
    this.h = $(window).height();
}

PageSlide.prototype.pageTo = function(i, h){
    $(".global").css({
        "-webkit-transform": "translate3d(0px, -" + h * i + "px, 0px)"
    });
    $(".layout .inner").removeClass("animated");
    $("#layout_" + (i + 1)).find(".inner").addClass("animated");
}

PageSlide.prototype.swipeTo = function(h, len){ 
    var _this = this;
    _this.oElem.each(function(index, obj) {
        $(obj).on("swipeUp", function() {
            //index = index < (_len - 1) ? index : index - 1;
            if (index < (len - 1)) {
                _this.pageTo(index + 1, h);
            } else {
                _this.pageTo(index, h);
            }
        }).on("swipeDown", function() {
            _this.pageTo(index - 1, h);
        });
    });
};


//var People = [{icon:"1.jpg",name:"周欢",music:"时间煮雨"},{icon:"2.jpg",name:"彭峥",music:"海阔天空"},{icon:"3.jpg",name:"师宇琼",music:"Chocolate Ice"},{icon:"4.jpg",name:"邓昂，段微微",music:"你最珍贵"},{icon:"5.jpg",name:"张竹熙",music:"画情"},{icon:"6.jpg",name:"银鹿",music:"原创歌曲"}];

var eSort = {};
eSort.sortDate = [];
eSort.getDate = function(callback){
    var _this = this;
    var msg = "";
    var sortDate = [];
    $.ajax({
        type: "get",
        url: "http://panshi.qq.com/v2/vote/10229024?source=1",
        data: '',
        dataType: "jsonp",
        success: function(res){
            //console.log(res);
            var _option = res.data.subject[0].option;
            //console.log(_option);
            for(i=0; i<_option.length; i++){
                sortDate[i] = _option[i].selected;
                //console.log(sortDate[i]);
            }
        },
        complete: function(){
            _this.sortDate = sortDate;
            callback();
        }
    });
    
}

//返回排序后的用户组
eSort.changeSort = function(obj){   //obj：自定义用户组
    var _this = eSort;
    //console.log(_this);
    var sortDate = _this.sortDate;
    //console.log(sortDate);
    var tmpPlay = [];
    //tmpPlay = obj;
    //console.log(obj);
    for(var n=0; n<obj.length; n++){
        tmpPlay[n] = obj[n];
        tmpPlay[n].vote = sortDate[n];
    }
    //console.log(tmpPlay);

    for(var i=0; i<tmpPlay.length; i++){
        for(var j= tmpPlay.length-1; j>0; j--){
            if(tmpPlay[j].vote > tmpPlay[j-1].vote){
                var temp = tmpPlay[j-1];
                tmpPlay[j-1] = tmpPlay[j];
                tmpPlay[j] = temp;
            }
        }
    }

    //console.log(tmpPlay);
    return tmpPlay;

    // var _ul = $("#sort");
    // _ul.html("");
    // for (var z=0; z<tmpPlay.length; z++){
    //     var htmlStr = "<li><img src=\"http:\/\/mat1.gtimg.com\/hn\/tangjian\/images\/zt_xgxm\/"+people[z].icon+"\" alt=\"\"><span class=\"name\">"+people[z].name+"<\/span><span class=\"info\"><em>"+people[z].music+"<\/em><br\/><em>票数："+people[z].vote+"<\/em><\/span><\/li>";
    //     _ul.append(htmlStr);
    // }
}

eSort.fillSpanLH = function(obj){ //obj：排序后的用户组
    //var _this = eSort;
    //var sortDate = _this.sortDate;
    
    //var tmpArr = [];
    var oElem = $("#layout_12 ul");
    var tmpLi, n;
    oElem.empty();
    for(i=0; i<obj.length; i++){
        n = i+1;
        tmpLi = "<li>"+n+"、"+obj[i].tt+"<span>（"+obj[i].vote+"赞）</span></li>";
        oElem.append(tmpLi);
        // if(obj[i-1].playid != "undefined"){
        //     var n = parseInt(obj[i-1].playid) - 1;
        //     //tmpArr[n-1] = i;
        //     $("#layout_2 .item span").eq(n).text(i);
        // }        
    }
}

//for 两会问答
eSort.fillSpan = function(obj){ //obj：排序后的用户组
    //var _this = eSort;
    //var sortDate = _this.sortDate;
    
    //var tmpArr = [];
    for(i=1; i<=obj.length; i++){
        if(obj[i-1].playid != "undefined"){
            var n = parseInt(obj[i-1].playid) - 1;
            //tmpArr[n-1] = i;
            $("#layout_2 .item span").eq(n).text(i);
        }        
    }
}

eSort.initPlayerPage = function(obj){ //obj：排序后的用户组
    for(i=1; i<=obj.length; i++){
        // if(obj[i-1].playid != "undefined" && ){
        //     var n = parseInt(obj[i-1].playid) - 1;
        //     //tmpArr[n-1] = i;
        //     $("#layout_2 .item span").eq(n).text(i);
        // }
        var _layout = '';
        if(obj[i-1].playid != "undefined" && obj[i-1].domHeight == "auto") {
            var tmpHtml = '<div class="layout popBox popBg'+obj[i-1].playid+'" id="pop_'+ i +'"><div class="inner"><div class="wrap bounceIn"><div class="playMenu"><div class="icon"><img src="http://mat1.gtimg.com/v/zt/wesong2014/'+ obj[i-1].img +'" alt=""></div><span class="b b1" data-vid="'+ obj[i-1].vid +'"></span><span class="b b2" data-vote="0" data-voteID="'+ obj[i-1].itemID +'"></span><span class="b b3"></span><span class="b b4"></span></div></div><div class="swipeTip"></div></div></div>'
            _layout = $(tmpHtml);
        } else {
            var tmpHtml = '<div class="layout popBox popBg'+obj[i-1].playid+'" id="pop_'+ i +'"><div class="inner"><div class="wrap bounceIn"><div class="playMenu"><div class="icon" style="height: '+ obj[i-1].domHeight+'px;"><img src="http://mat1.gtimg.com/v/zt/wesong2014/'+ obj[i-1].img +'" alt=""></div><span class="b b1" data-vid="'+ obj[i-1].vid +'"></span><span class="b b2" data-vote="0" data-voteID="'+ obj[i-1].itemID +'"></span><span class="b b3"></span><span class="b b4"></span></div></div><div class="swipeTip"></div></div></div>'
            _layout = $(tmpHtml);            
        }
        $(".screen").append(_layout);
    }
}


String.prototype.trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, "");
}

var JsLoader = {
    load: function(sUrl, fCallback) {
        var _script = document.createElement("script");
        _script.setAttribute("type", "text/javascript");
        _script.setAttribute("src", sUrl);
        document.getElementsByTagName("head")[0].appendChild(_script);

        if (/msie/.test(window.navigator.userAgent.toLowerCase())) {
            _script.onreadystatechange = function() {
                if (this.readyState == "loaded" || this.readyState == "complete") {
                    fCallback();
                }
            };
        } else if (/gecko/.test(window.navigator.userAgent.toLowerCase())) {
            _script.onload = function() {
                fCallback();
            };
        } else {
            fCallback();
        }
    }
};

if (typeof jQuery == "undefined") {
    JsLoader.load("http://mat1.gtimg.com/www/panshi/dist/js/jquery.js", function() {
        $(document).on("click", "#submit_survey", submitSurvey);
        $(document).on("click", "#view_survey", view);
    })
} else {
    $(document).on("click", "#submit_survey", submitSurvey);
    $(document).on("click", "#view_survey", view);
}
if (typeof JSON == "undefined") {
    JsLoader.load("http://mat1.gtimg.com/www/panshi/dist/js/json2.js")
}

function getAnswer(uid,itemID) {
    // var form = $("#form_survey").serializeArray();
    // var tmp = {};

    // for (var i = 0, len = form.length; i < len; i++) {
    //     if (/sbj_\d+\[\]/.test(form[i]['name'])) {
    //         var qid = form[i]['name'].replace(/\D+/g, "");
    //         if (typeof tmp[qid] == "undefined") {
    //             tmp[qid] = {};
    //         }
    //         if (typeof tmp[qid]['selected'] == "undefined") {
    //             tmp[qid]['selected'] = [];
    //         }
    //         tmp[qid]['selected'].push(form[i]['value']);
    //     }
    //     if (/sbj_\d+\[\d+\]/.test(form[i]['name']) && form[i]['value'].trim().length != 0) {
    //         //杈撳叆
    //         var qid = form[i]['name'].replace(/\[\d+\]/, "").replace(/\D+/g, "");
    //         var oid = form[i]['name'].replace(/sbj_\d+/, "").replace(/\D+/g, "");
    //         if (typeof tmp[qid] == "undefined") {
    //             tmp[qid] = {};
    //         }
    //         if (typeof tmp[qid]['others'] == "undefined") {
    //             tmp[qid]['others'] = {};
    //         }
    //         if (typeof tmp[qid]['selected'] == "undefined") {
    //             tmp[qid]['selected'] = [];
    //         }
    //         tmp[qid]['selected'].push(oid);
    //         tmp[qid]['others'][oid] = form[i]['value'];
    //     }
    // }

    //start modified by tj
    var tmp = {};
    var qid = uid;
    if (typeof tmp[qid] == "undefined") {
      tmp[qid] = {};
    }
    if (typeof tmp[qid]['selected'] == "undefined") {
      tmp[qid]['selected'] = [];
    }
    tmp[qid]['selected'].push(itemID)
    //end modified by tj

    if(itemID == 548815){
        var oid = itemID;
        if (typeof tmp[qid]['others'] == "undefined") {
            tmp[qid]['others'] = {};
        }
        //tmp[qid]['selected'].push(oid);
        tmp[qid]['others'][oid] = $("#txtQQ").val();
    }


    var data = {
        'answer': JSON.stringify(tmp),
        'login': 1,
        'source': 1,
        'format': "script",
        'callback': 'parent.callback'
    };
    return data;
}

function formPost(url, data) {
    var _target = 'post_iframe';
    if (!$('#post_iframe').length) {
        $("body").append('<iframe id="post_iframe" name="post_iframe" style="display:none"></iframe>');
    }
    var _$form = $('#_messageform').length ?
        $('#_messageform').attr('action', url).empty() :
        $('<form action="' + url + '" method="post" target="' + _target + '" id="_messageform" style="display:none;" enctype="multipart/form-data" accept-charset="utf-8" onsubmit="document.charset=\'utf-8\';"></form>').appendTo($("body"));
    for (name in data) {
        _$form.append($('<input name="' + name + '" type="hidden" value="" />').val(data[name]));
    }
    _$form.submit();
}

function view() {
    var url = 'http://panshi.qq.com/vote/' + SURVEY_ID + '/view?type=result';
    //var url = 'http://panshi.qq.com/v2/' + SURVEY_ID + '/result';
    window.open(url);
}

function submitSurvey(uid, itemID, sid) {
    //formPost('http://panshi.qq.com/vote/' + SURVEY_ID + '/submit', getAnswer(uid, itemID));
    formPost('http://panshi.qq.com/vote/' + sid + '/submit', getAnswer(uid, itemID));
}

function callback(data) {
    if (data.errCode == 0) {
        if(data.data.voteid != "10219276"){
            //alert("\u6210\u529F\u70B9\u8D5E");
        }
    } else if (data.errCode == 34 || data.errCode == 35 || data.errCode == 36) {
        //alert("\u8bf7\u9009\u62e9\u540e\u518d\u63d0\u4ea4");
    } else if (data.errCode == 20 || data.errCode == 25) {
        //alert("\u8bf7\u767b\u5f55");
    } else if (data.errCode == 21) {
        //alert("\u5df2\u53c2\u4e0e");
    }
}