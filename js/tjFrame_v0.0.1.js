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
        if (ua.iphone && ua.qqnews) {
            //_h = _h - 44;
        }
        $(".swipeTip").addClass("fadeOutUp");
        $(".global").width(_w).height(_h * _len).addClass("ease");
        $(".screen").width(_w).height(_h * _len);
        $(".layout").width(_w).height(_h);
        $(".load").width(_w).height(_h);

        //init pageSlide
        var oPage = new PageSlide(".layout");
    }
}


function PageSlide(elem) {
    this.oElem = $(elem);
    this.len = this.oElem.length;
    this.w = $(window).width();
    this.h = $(window).height();
    this.init();
}

PageSlide.prototype.pageTo = function(i, h) {
    $(".global").css({
        "-webkit-transform": "translate3d(0px, -" + h * i + "px, 0px)"
    });
    $(".layout .inner").removeClass("animated");
    //$("#layout_" + (i + 1)).find(".inner").addClass("animated");
    $(".layout").eq(i).find(".inner").addClass("animated");
}

PageSlide.prototype.swipeTo = function(h, len) {
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
PageSlide.prototype.init = function() {
    var _this = this;
    _this.pageTo(0, _this.h);
    _this.swipeTo(_this.h, _this.len);
}

var b12Bgm = document.getElementById('b12-bgm'),
    b12AC = $('#b12-audio-ctrl');
b12Bgm.addEventListener('playing', function() {
    b12AC.addClass('playing');
}, false);
b12AC.click(function(event) {
    if (b12Bgm.paused == false) {
        b12Bgm.pause();
        $(this).removeClass('playing');
    } else {
        b12Bgm.play();
        $(this).addClass('playing');
    }
});

function playBgm() {
    $(b12Bgm).one("canplaythrough", function() {
        this.play();
    });

    $('.b12-swiper').one('touchstart', function() {
        b12Bgm.play();
    });
}
setTimeout(playBgm, 800);