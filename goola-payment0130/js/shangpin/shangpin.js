//根据页面url获取goodId
(function (api, util, ajax) {
    var goodsId;
    var repertoryTotalNum;
    var paramGoodsId = util.getUrlParams("goodsId");
    var cowdfundingId;
    var id = util.getUrlParams("id");
    var goodsInfo;
    var Price;
    var tuan = util.getUrlParams("tuan");
    var activityId = util.getUrlParams("activityId");
    var limitGoodsInfo;
    getGoodsInfo(paramGoodsId);
    getPingJia(paramGoodsId);


    if(!tuan){
        $("bottom").show()
    }
    //事业会员分享
    var type = util.getUrlParams("type")
    var huiyuan = util.getUrlParams("huiyuan")
    if (type == "dis" && huiyuan != 1) {
        $('body').append('<div class="shareinfo-bg"><img src="/distribution/imgs/fenxiang.png" /><a>知道啦</a></div>')
        if (isWeiXin()) {
            $('.shareinfo-bg').css('top', '0')
        } else {
            $('.shareinfo-bg').css('top', '1.25rem')
        }
        $('.shareinfo-bg a')
            .click(function () {
                $(this)
                    .parent()
                    .remove()
            })
    }

    
    //获取商品信息
    if (browser.versions.ios || browser.versions.android) {
        if (!isWeiXin()) {
            $('#shouye').hide()
        }
    }

    //判断商品类型的flag
    var isCompositeGoods = null;
    var oldprice = 0

    function getGoodsInfo(paramGoodsId) {

        var interfaceName = api.baseServerUrl + (tuan ? "/goods/findGroupBuyingGoods" : "/goods/findGoods"),
        interfaceParams = {
            "goodsId": paramGoodsId,
            "lat": getCookie('lat'),
            "lng": getCookie('lng'),
            "locationType": 1
        };
        tuan ? interfaceParams.activityId = activityId : ""
        
        ajax.post(interfaceName, interfaceParams, function (data) {
                console.log(data)
                $(data.comboGoods).each(function (i, v) {
                    oldprice += v.goods.preferentialPrice;
                })
                isCompositeGoods = (data.goods.goodsType == 2)
                    ? true
                    : false;
                goodsInfo = data
                
        
                if (tuan == null) {
                    var obj = {
                        data: data,
                        picUrl: api.picUrl,
                        isCompositeGoods: isCompositeGoods,
                        oldPrice: oldprice
                    }
                } else {
                    var obj = {
                        data: data,
                        picUrl: api.picUrl,
                        tuan: tuan,
                        oldPrice: oldprice
                    }
                }
                oldPrice = (data.goods.preferentialPrice).toFixed(2)
                util.render("#swiper-container", obj, ".swiper-container")
                util.render("#leftsidebar_box_dl", obj, ".details-one")

                if (data.goods.providerIsShop == "1") {
                    $('.shopadmin').show()
                }
                util.render("#shopadmin", obj, ".shopadmin")
                var mySwiper = new Swiper('.swiper-container', {
                    loop: true,
                    autoplay: 3000,
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    autoplayDisableOnInteraction: false
                })
                cowdfundingId = data.cowdfundingId
                if (data.ifSelectFlag != undefined && data.ifSelectFlag != null && data.ifSelectFlag != '') {
                    $('#bottom-slider').show()
                }
                if (data.poActivity != undefined && data.poActivity != null && data.poActivity != '') {
                    $('#bottom-slider').show()
                    util.render("#bottom-slide1", obj, '#bottom-slider .bottom-slide1');
                    $('.payment1').remove()
                    $('.bottom-slide-payment').remove()
                    $('.bottom-slide-confirm')
                        .html('立即购买')
                        .css('width', '8.28125rem')
                        .css('background', '#fa2f3e')
                    $('.bottom-slide1')
                        .find('.d a')
                        .eq(0)
                        .addClass('selected')
                    $('.bottom-slide1')
                        .find('.c0')
                        .show()
                        .addClass('checkedTime')
                    $('.payment1').remove()
                    $('.addgwc')
                        .html('立即购买')
                        .css('width', '8.28125rem')
                        .css('background', '#fa2f3e')
                } else {
                    util.render("#bottom-slide", obj, '#bottom-slider .bottom-slide1');

                }
                /*if(data.typeInfo!=undefined && data.typeInfo!=null && data.typeInfo!=''){
            	$('.payment1').remove()
            	$('.addgwc').css('width','8.28125rem').css('background','#fa2f3e')
            }*/
                util.render("#message", obj, '.message-content');
                util.render("#articles", obj, '.news');
                util.render("#collocation", obj, '.collocation');
                util.render("#collocation", obj, '.collocation');

        
                $(".goods-activity-group").click(function(){
                    window.location.href = "/shangpin/shangpinxiangqing.html?goodsId="+ data.isGroupBuying.goodsId +"&activityId="+ data.isGroupBuying.activityId +"&tuan=kaituan"
                })



                if (data.isCrowdFundingGoods == 1) {
                    $('.crowdfunding').css('display', 'block')
                    $('.leastprice').html(data.leastPrice)
                    $('.crowdfunding').click(function () {
                        window.location.href = "../../crowdfunding/crowdfunding-list.html?crowdfundingId=" + data.cowdfundingId
                    })
                }
                $('.collocation .collocation-addcard').on('click', addCart);
                if (data.isLocationInventory == 1) {
                    $('.bottom')
                        .css('background', '#BEBEBE')
                        .html('<p>所在地区无库存</p>')
                }
                $(function () {
                    $(".lazy").lazyload({effect: "fadeIn", threshold: 1000});
                });
                if (data.ifSelectFlag == 0) {
                    goodsId = data.goods.goodsId;
                    repertoryTotalNum = data.goods.repertoryTotalNum;
                } else {
                    if (data.goods.goodsType != 2) {
                        $('.a div a')[0].click();
                        $('.b div a')[0].click();
                    }
                }
                //拼团模块
                if (data.groupBuying != '' && data.groupBuying != null && data.groupBuying != undefined && data.groupBuying.activityId) {
                    if (data.groupBuying.activityId != '' && data.groupBuying.activityId != undefined && data.groupBuying.activityId != null) {
                        activityId = data.groupBuying.activityId
                    }
                    util.render("#tuan-details", obj, '.tuan-details');

                    $('.tuan').show()
                    $('.details-one')
                        .find('.details-title')
                        .hide()

                    if (tuan == "cantuan") {
                        $('.bottom').hide()
                        $('.cantuan').show()

                        goods()
                    } else {
                        util.render("#tuan-content", obj, '.tuan-content');
                        $('.bottom').hide()
                        $('.kaituan')
                            .find('.addgwc')
                            .remove()
                        $('.kaituan')
                            .find('.kaituan-btn')
                            .remove()
                        $('.kaituan')
                            .show()
                            .append('<a class="addgwc">单独购<br/>￥' + oldPrice + '</a><a class="kaituan-btn">' + $('.tuan-num').html() + '<br/>' + $('.tuan-price').html() + '</a>')

                    }
                    updateEndTime()

                } else {
                    $('.bottom').show()
                }

                goodsSeckill(paramGoodsId)
                var shareTitle,
                    shareDescription
                if (data.goods.shareTitle != '' && data.goods.shareTitle != undefined && data.goods.shareTitle != null) {
                    shareTitle = data.goods.shareTitle
                } else {
                    shareTitle = data.goods.goodsName
                }
                if (data.goods.shareDescription != '' && data.goods.shareDescription != undefined && data.goods.shareDescription != null) {
                    shareDescription = data.goods.shareDescription
                } else {
                    shareDescription = data.goods.goodsDesc
                }
                shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g, "|"), shareTitle, shareDescription, location.href + "&huiyuan=1",
                "http://" + document.domain + api.picUrl + data.goods.cartPhoto);



                //库存不足禁用底部功能按钮
                if(!goodsInfo.goods.repertoryTotalNum || goodsInfo.goods.repertoryTotalNum <= 0 ){
                    $(".bottom .addgwc").removeClass().addClass("addgwc_gray").off("click")
                    $(".bottom .payment1").removeClass().addClass("payment1_gray").off("click")
                    $(".tuan-bottom .addgwc").css("background","#CACACA").off("click")
                    $(".tuan-bottom .kaituan-btn").removeClass().css("background","#CACACA").off("click")
                }

            }, function (returnData) {
                console.log(returnData)
            })
    }

    function goods() {
        ajax
            .post(api.baseServerUrl + "/gb/requireLocation/queryGroupBuyingOrderDetail", {
                "activityId": activityId,
                "orderId": id,
                "goodsId": paramGoodsId
            }, function (data) {
                var obj = {
                    data: data,
                    picUrl: api.picUrl,
                    tuan: tuan
                }
                console.log(obj)
                util.render("#tuan-content", obj, '.tuan-content');
                $('.tc-top ul').css('width', (1.1875 + 0.328125) * $('.tc-top ul').find('li').length - 0.328125 + 'rem')
                $('.tc-top ul>:first').append('<a><img src="../tuan/imgs/icon11.png"/></a>')
                updateEndTime()
                if (tuan == "cantuan") {
                    if ($('.tc-top h3').html() == "拼团剩余时间 已结束") {
                        $(".details-one .choice").hide()
                        $('.cantuan')
                            .find('.cantuan-btn')
                            .css('background', '#aaa')
                            .removeClass('cantuan-btn')
                        $('.tc-top p').hide()
                    }
                }
            })
    }
    //获取评价
    function getPingJia(goodsId) {
        ajax
            .post(api.baseServerUrl + "/goods/queryEvaluates", {
                "goodsId": goodsId
            }, function (data) {
                //console.log(data)
                if(data){
                    var defaultEvaluate = data.list[0]

                    //选出时间最近的五星好评
                    data.list.forEach(function(item,index){
                        if(defaultEvaluate.evaluateResult < item.evaluateResult){
                            defaultEvaluate = data.list[index]
                        }
                    })
                    data.list = [defaultEvaluate]  
                    var obj = {
                        data: data,
                    }
                    util.render("#evaluate", obj, ".evaluate");
                    }   
            })
    }

    $('.evaluate')
        .delegate('.evaluate-title', 'click', function () {
            window.location.href = "quanbupingjia.html?goodsId=" + paramGoodsId;
        })

    $('.message').delegate('.message-btn', 'click', function () {
        $('.message-btn a')
            .css('border-bottom', '2px solid #fff')
            .css('color', '#1b1b1b')
            .eq($(this).index())
            .css('border-bottom', '2px solid #fa2f3e')
            .css('color', '#fa2f3e')
        $('.message-show').css('display', 'none')
        $('.message-show')
            .eq($(this).index())
            .css('display', 'block')
    })

    $('#bottom-slider').delegate(' .a div a', 'click', function () {
        $('.a div a').attr("class", "noselected");
        $(this).attr("class", "selected");
        $(".b div").hide();
        var selectB = $(".b").find("#" + $(this).index());
        selectB.show();
        $('.bottom-slide')
            .find('.bottom-slide-title-describe h3 span')
            .html(selectB.find('.selected').attr('preferentialPrice'))
        $(".bottom-slide-num").hide();
        if (selectB.find(".selected").length == 0) {
            selectB
                .find(".noselected")[0]
                .click();
        } else {
            $("#bottom" + selectB.find(".selected").attr("id")).show();
        }
        if (selectB.find('.selected').html() == undefined) {
            var data1 = (goodsInfo.typeInfo)[$(this).html()][
                selectB
                    .find('a')
                    .eq(0)
                    .html()
            ]
            data1.type1 = $(this).html()
            data1.type2 = selectB
                .find('a')
                .eq(0)
                .html()
        } else {
            var data1 = (goodsInfo.typeInfo)[$(this).html()][
                selectB
                    .find('.selected')
                    .html()
            ]
            data1.type1 = $(this).html()
            data1.type2 = selectB
                .find('.selected')
                .html()
        }
        var obj = {
            data: data1,
            picUrl: api.picUrl
        }

        $('.bottom-slide')
            .find('.bottom-slide-title img')
            .attr('src', api.picUrl + data1.goods.cartPhoto)
        if (data1.goods.goodsId != goodsId) {
            guigeChoice(obj)
        }

        goodsId = selectB
            .find('a')
            .attr('id')

    })
    $('#bottom-slider').delegate(' .b div a', 'click', function () {
        $(this)
            .parent()
            .find('a')
            .attr("class", "noselected");
        $(this).attr("class", "selected");
        $('.bottom-slide')
            .find('.bottom-slide-title-describe h3 span')
            .html($(this).attr('preferentialPrice'))
        $(".bottom-slide-num").hide();
        $("#bottom" + $(this).attr("id")).show();

        var data2 = (goodsInfo.typeInfo)[
            $('#bottom-slider .a')
                .find('.selected')
                .html()
        ][$(this).html()]
        data2.type1 = $('#bottom-slider .a')
            .find('.selected')
            .html()
        data2.type2 = $(this).html()
        var obj = {
            data: data2,
            picUrl: api.picUrl
        }
        $('.bottom-slide')
            .find('.bottom-slide-title img')
            .attr('src', api.picUrl + data2.goods.cartPhoto)
        if (data2.goods.goodsId != goodsId && goodsId != undefined) {
            guigeChoice(obj)
        }

        goodsId = $(this).attr("id");
        repertoryTotalNum = $("#bottom" + $(this).attr("id")).attr("repertoryTotalNum");

    })

    function guigeChoice(obj) {
        util.render("#swiper-container", obj, ".swiper-container")
        util.render("#leftsidebar_box_dl", obj, ".details-one")
        var mySwiper = new Swiper('.swiper-container', {
            loop: true,
            autoplay: 3000,
            pagination: '.swiper-pagination',
            paginationClickable: true,
            autoplayDisableOnInteraction: false
        })
        util.render("#message", obj, '.message-content');
        $(function () {
            $(".lazy").lazyload({effect: "fadeIn", threshold: 1000});
        });
    }

    //周期预定
    $('#bottom-slider')
        .delegate(' .d div a', 'click', function () {
            $('.d div a').attr("class", "noselected");
            $(this).attr("class", "selected");
            $(this)
                .parent()
                .parent()
                .parent()
                .find('.bottom-slide-title img')
                .attr('src', api.picUrl + $(this).attr('cartPhoto'))
            $(this)
                .parent()
                .parent()
                .parent()
                .find('.bottom-slide-title-describe h3 span')
                .html($(this).attr('prePrice'))
            $(".c")
                .hide()
                .removeClass('checkedTime');
            $(".c" + $(this).index())
                .show()
                .addClass('checkedTime');

        })
    //周期预定选择时间
    $('#bottom-slider').delegate('.bottom-time', 'click', function () {
        $(this)
            .parent()
            .append('<div class="bg" style="display:block"></div>')
        $(this)
            .next()
            .slideDown('2000')
        $(this)
            .next()
            .find('li')
            .css('color', '#9b9b9b')
        $(this)
            .next()
            .find('li')
            .eq(0)
            .css('color', '#fa2f3e')
        $(this)
            .next()
            .find('.bottom-time-choice .time-queding')
            .attr('time', $('#bottom-slider').find('.bottom-time-choice li').eq(0).attr('time'))

    })
    $('#bottom-slider').delegate('.time-quxiao', 'click', function () {
        $(this)
            .parent()
            .slideUp('2000')
        $(this)
            .parent()
            .parent()
            .find('.bg')
            .remove()
    })
    $('#bottom-slider').delegate('.bottom-slide-choice .bg', 'click', function () {
        $(this)
            .prev()
            .slideUp('2000')
        $(this).remove()
    })
    $('#bottom-slider').delegate('.bottom-time-choice li', 'click', function () {
        $('#bottom-slider')
            .find('.bottom-time-choice li')
            .css('color', '#9b9b9b')
        $(this).css('color', '#fa2f3e')
        $(this)
            .parent()
            .parent()
            .parent()
            .find('.time-queding')
            .attr('time', $(this).attr('time'))
    })
    $('#bottom-slider').delegate('.time-queding', 'click', function () {
        $(this)
            .parent()
            .prev()
            .find('p')
            .html(getFormatDate(Number($(this).attr('time'))).split(' ')[0])
        $(this)
            .parent()
            .slideUp('2000')
        $(this)
            .parent()
            .parent()
            .find('.bg')
            .remove()
    })

    $('#bottom-slider').delegate('.minus', 'click', function () {
        if ($('#bottom' + goodsId + ' .amount').html() == 1) {
            $(this)
                .css('background', '#fff url(/imgs/shangpin/gouwuchemin.png?t=20161117) no-repeat center center')
                .css('background-size', '0.375rem 0.375rem')
            return;
        }
        $('#bottom' + goodsId + ' .amount').html(parseInt($('#bottom' + goodsId + ' .amount').html()) - 1);
    })
    $('#bottom-slider').delegate('.add', 'click', function () {
        $(this)
            .prev()
            .prev()
            .css('background', '#fff url(/imgs/shangpin/gouwuchemin1.png?t=20161117) no-repeat center center')
            .css('background-size', '0.375rem 0.375rem')
        $('#bottom' + goodsId + ' .amount').html(parseInt($('#bottom' + goodsId + ' .amount').html()) + 1)
    })
    


    $('.details').delegate('.choice', 'click', function () {
        var param = tuan ? "&isgroup="+tuan+"&activityId=" + activityId : "";
            param = id ? param + "&id=" + id : param;
        window.location.href = "/shangpin/specification.html?goodsId=" + window.location.search.split("=")[1] + param;
    })
    var sss = 0;    

    //点击加入购物车&&立即购买跳转至规格页
    $('.body .addgwc').add('.body .payment1').on("click", function () {
        var childrenGoodsIdsParams = ""
        if (goodsInfo.ifSelectFlag === 0) {
            if (goodsInfo.goods.goodsType == 1){
                childrenGoodsIdsParams = ""
            } else if (goodsInfo.goods.goodsType == 2 ){
                childrenGoodsIdsParams = "&goolasId=" + goodsId;
            }
            var childrenGoodsIds = childrenGoodsIdsParams.split("=")[1] || "" ;
            if (this.className == "addgwc") {
                var price = goodsInfo.goods.preferentialPrice;
                if (limitGoodsInfo){
                    price = limitGoodsInfo.limitPrice
                }
                addProductinCart(goodsId, goodsInfo.goods.costPrice, price, 1, goodsInfo.goods.repertoryTotalNum, childrenGoodsIds)
            }
            else window.location.href = "../../payment/payment.html?goodsId=" + goodsId + "&buyCount=1" + childrenGoodsIdsParams;
        }
        else window.location.href = "/shangpin/specification.html?goodsId=" + window.location.search.split("=")[1];
    })

        


    $('body').delegate('#appDate', 'change', function () {

        $('.shijian').html($(this).val())
    })
    $('.collocation').delegate('.collocation-addcard', 'click', function () {

        var goodsId1 = $(this)
            .parent()
            .attr('id')
        var goodsPrice1 = $(this)
            .parent()
            .find('.oldPrice span')
            .text()
        var goodsPriceNew1 = $(this)
            .parent()
            .find('.newPrice span')
            .text()

        var aaa = getCookie('3goolaNew').split('$')
        for (var i = 0; i < aaa.length; i++) {
            if ((aaa[i].split('||')[0]).replace('|', '') == goodsId) {
                sss = aaa[i].split('||')[3]
            }
        }

        var quantity = $('#limitCount')
        if (quantity.attr('limitCount') == sss && quantity.attr('limitCount') != undefined) {
            alert('数量达限购上限，已按原价添加到购物车')
        } else if (quantity.attr('limitCount') <= sss) {
            $('.kaituan')
                .find('.addgwc')
                .remove()
            $('.kaituan')
                .find('.kaituan-btn')
                .remove()
            $('.kaituan').append('<a class="addgwc">单独购<br/>' + oldPrice + '</a><a class="kaituan-btn">' + $('.tuan-num').html() + '<br/>¥' + $('.tuan-price').html() + '</a>')
        }
        addProductinCart(goodsId1, goodsPrice1, goodsPriceNew1, 1, -1)
        quantity.attr("limitCount", quantity.attr("limitCount") - 1)
    })

    $('.bottom-crowdfunding .addgwc').on('click', addCart)
    $('.tuan-bottom').delegate('.addgwc', 'click', addCart)
    $('.gwc').click(function () {
        window.location.href = '../gouwuche/gouwuche.html'
    })

    $('#bottom-slider').delegate('.bottom-slide-confirm', 'click', function () {
        var goodsPrice = $('.price span').text()
        var goodsPriceNew = $('.cost span').text()
        var count = $("#bottom" + goodsId + ' .amount').text()
        if ($(this).html() == "加入购物车") {
            window._hmt && window
                ._hmt
                .push(['_trackEvent', "加入购物车", goodsId]);
            addProductinCart(goodsId, goodsPrice, goodsPriceNew, count, repertoryTotalNum)
            $('.bottom-slide').css('display', 'none')
            /*document.body.ontouchmove=function(){
                	return true;
                }*/
            $('.shangpin').css('position', 'static')
            $('.bg').css('display', 'none')
        } else if ($(this).html('立即购买')) {
            var activityId = $(this)
                .parent()
                .parent()
                .find('.d .selected')
                .attr('activityId')
            var choosedSendTime = $(this)
                .parent()
                .parent()
                .find('.checkedTime .bottom-time p')
                .html()
            var buyCount = $(this)
                .parent()
                .parent()
                .find('.amount')
                .html()
            window._hmt && window
                ._hmt
                .push(['_trackEvent', "预定", goodsId]);
            window.location.href = "../../payment/payment.html?activityId=" + activityId + "&choosedSendTime=" + choosedSendTime + "&goodsId=" + goodsId + "&buyCount=" + buyCount
        }
    })
    $('#bottom-slider').delegate('.bottom-slide-payment', 'click', function () {
        var count = $("#bottom" + goodsId + ' .amount').text()
        window._hmt && window
            ._hmt
            .push(['_trackEvent', "立即购买", goodsId]);
        window.location.href = "../../payment/payment.html?goodsId=" + goodsId + "&buyCount=" + count
    })
    $('#bottom-slider').delegate('.cancel', 'click', function () {
        $('.bottom-slide').css('display', 'none')
        /*document.body.ontouchmove=function(){
            	return true;
            }*/
        $('.shangpin').css('position', 'static')
        $('.bg').css('display', 'none')
    })

    $('#crowdfunding').click(function () {
        window._hmt && window
            ._hmt
            .push(['_trackEvent', "许愿单", goodsId]);
        window.location.href = "../../crowdfunding/crowdfunding-payment.html?goodsId=" + paramGoodsId + "&cowdfundingId=" + cowdfundingId
    })
    var limitStartTime,
        limitEndTime

    function goodsSeckill(goodsId) {
        ajax
            .post(api.baseServerUrl + "/fs/openAuthority/goodsDetail", {
                "goodsId": goodsId
            }, function (data) {
                //var data=jQuery.parseJSON(data);
                if (data.goodsCount != 0) {
                    $('.seckill').show()
                    limitGoodsInfo = data
                    util.render("#seckill", data, '.seckill');
                    if ($("#bottom-slider .bottom-slide1").html() != '') {
                        $('.bottom-slide1')
                            .find('.b a')
                            .each(function () {

                                if ($(this).attr("id") == goodsId) {
                                    $(this).attr('preferentialprice', $('.qianggou').html())
                                }
                            })
                    }
                    limitStartTime = (data.limitStartTime).replace(/:/g, '')
                    limitEndTime = (data.limitEndTime).replace(/:/g, '')
                    $('.sk-oldprice').html($('.cost').html())
                    var nowtime = new Date()
                    var hours = (nowtime.getHours() > 10)
                        ? (nowtime.getHours())
                        : ('0' + nowtime.getHours())
                    var minutes = (nowtime.getMinutes() > 10)
                        ? (nowtime.getMinutes())
                        : ('0' + nowtime.getMinutes())
                    var seconds = (nowtime.getSeconds() > 10)
                        ? (nowtime.getSeconds())
                        : ('0' + nowtime.getSeconds())
                    nowtime = hours + '' + minutes + '' + seconds
                    if (Number(nowtime) < Number(limitStartTime)) {
                        $('#aa').html('距离开始')
                        startCountDown(data.limitStartTime)
                    } else {
                        $('#aa').html('距离结束')
                        startCountDown(data.limitEndTime)
                    }
                    if ($('.tuan').css('display') == 'block' && tuan != "cantuan") {
                        $('.bottom').hide()
                        $('.kaituan')
                            .find('.addgwc')
                            .remove()
                        $('.kaituan')
                            .find('.kaituan-btn')
                            .remove()
                        $('.kaituan')
                            .show()
                            .append('<a class="addgwc">抢购价<br/>¥' + $('.qianggou').html() + '</a><a class="kaituan-btn">' + $('.tuan-num').html() + '<br/>¥' + $('.tuan-price').html() + '</a>')
                    }

                }

            });
    }

    $('.tuan-bottom')
        .delegate('.kaituan-btn', 'click', function () {
            if(goodsInfo.ifSelectFlag === 0){
                window._hmt && window._hmt.push(['_trackEvent', "开团", goodsId]);
                window.location.href = "../../tuan/payment.html?goodsId=" + goodsId + "&tuan=kaituan&activityId=" + activityId     
                return false;
            }
            window.location.href = "/shangpin/specification.html?goodsId=" + window.location.search.split("=")[1] + "&isgroup=kaituan&activityId=" + activityId ;
            
        })
        $('.tuan-bottom')
        .delegate('.addgwc', 'click', function () {
            var goolasId = "";
            if (goodsInfo.ifSelectFlag === 0) {
                $(goodsInfo.comboGoods).each(function(i, v) {
                    goolasId += v.goods.goodsId + ","
                })
                
                goolasId = goolasId.substr(0, goolasId.length - 1);
                if(goodsInfo.goods.goodsType == 1){
                    goolasId = goodsId.toString()
                }
                addProductinCart(goodsId, goodsInfo.goods.costPrice, goodsInfo.goods.preferentialPrice, 1, goodsInfo.goods.repertoryTotalNum, goolasId)
                return false
            }
            window.location.href = "/shangpin/specification.html?goodsId=" + window.location.search.split("=")[1] + "&isgroup=kaituan&activityId=" + activityId;
        })
    $('.tuan-bottom').delegate('.cantuan-btn', 'click', function () {   
        var temp = id ? "&id=" + id : "";
        if(goodsInfo.ifSelectFlag === 0){
            window._hmt && window._hmt.push(['_trackEvent', "参团", goodsId]);
            window.location.href = "../../tuan/payment.html?goodsId=" + goodsId + "&tuan=cantuan&activityId=" + activityId + temp 
            return false;
        }
        window.location.href = "/shangpin/specification.html?goodsId=" + window.location.search.split("=")[1] + "&isgroup=cantuan&activityId=" + activityId + temp
    })

    var EndTime = 0;
    //倒计时
    function GetRTime() {
        var NowTime = new Date();
        var t = EndTime - NowTime.getTime();
        if (t <= 0) {
            $("#detailsFirst")
                .find('#sk-time')
                .html('活动已结束')
        } else {
            var d = Math.floor(t / 1000 / 60 / 60 / 24);
            if (d < 10) {
                d = '0' + d
            }
            var h = Math.floor(t / 1000 / 60 / 60 % 24);
            if (h < 10) {
                h = "0" + h
            }
            var m = Math.floor(t / 1000 / 60 % 60);
            if (m < 10) {
                m = '0' + m
            }
            var s = Math.floor(t / 1000 % 60);
            if (s < 10) {
                s = '0' + s
            }
            $("#detailsFirst")
                .find('#sk-time')
                .html(h + ":" + m + ":" + s);
        }
    }
    //开始倒计时
    function startCountDown(time) {
        var date1 = new Date()
        var time11 = date1.getFullYear() + '/' + (date1.getMonth() + 1) + '/' + date1.getDate() + " " + time
        var endTime = new Date(time11)
        EndTime = endTime.getTime()
        setInterval(GetRTime, 0);
    }


    

})(goola.api, goola.util, goola.ajax);