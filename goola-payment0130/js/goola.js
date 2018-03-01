var goola = goola || {

	extend : function(target, source){

  		for (var p in source) {
        	if(source.hasOwnProperty(p)) {
	            target[p] = source[p];
	        }
	    }
	}

}

function getCookie(c_name)
{
if (document.cookie.length>0)
  {
  c_start=document.cookie.indexOf(c_name + "=")
  if (c_start!=-1)
    { 
    c_start=c_start + c_name.length+1 
    c_end=document.cookie.indexOf(";",c_start)
    if (c_end==-1) c_end=document.cookie.length
    return unescape(document.cookie.substring(c_start,c_end))
    } 
  }
return ""
}
function setCookie(c_name,value,expiredays,path)
{
var exdate=new Date()
exdate.setDate(exdate.getDate()+expiredays)
document.cookie=c_name+ "=" +escape(value)+
((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
+((path==null) ? ";path=/" : ";path="+path)
}

if(!parent.layer) {
	setCookie("shareUrl",location.href);
}
/*if (getCookie("orgId") == "") {
	setCookie("orgId", "20");
}*/
if((getCookie('lat')==''||getCookie('lat')==null||getCookie('lat')==undefined)&&getCookie('orgId')!=3){
		if(getCookie('lng')==''||getCookie('lng')==null||getCookie('lng')==undefined&&getCookie('orgId')!=3){
			setCookie('orgId',3)
			setCookie("lat","39.92958")
			setCookie("lng","116.31092")
			setCookie("firstLat","39.92958")
			setCookie("firstLng","116.31092")
		}
}

function formatData(date, format) {
	var o = {
		"M+": date.getMonth() + 1,
		"d+": date.getDate(),
		"h+": date.getHours(),
		"m+": date.getMinutes(),
		"s+": date.getSeconds(),
		"q+": Math.floor((date.getMonth() + 3) / 3),
		"S": date.getMilliseconds()
	}
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}

function getFormatDate(timeStamp, pattern) {
	var date = new Date(timeStamp);
	if (pattern == undefined) {
		pattern = "yyyy-MM-dd hh:mm:ss";
	}
	return formatData(date, pattern);
}

function wxShare(theajax, serverUrl, url,title, desc, link, imgUrl) {	
	theajax.post(serverUrl + "/location/openAuthority/getLocationConfig",{
		url:encodeURI(url)
	},function(data) {
		wx.config({
			debug: false,
			appId: data.appid,
			timestamp: data.timeStamp,
			nonceStr: data.nonceStr,
			signature: data.signature,
			jsApiList: ['onMenuShareTimeline','onMenuShareAppMessage','onMenuShareQQ','onMenuShareWeibo','hideOptionMenu','showOptionMenu','getNetworkType']
		});

		wx.ready(function () {
			
			//分享朋友
			wx.onMenuShareAppMessage({
				title: title,
				desc: desc,
				link: link,
				imgUrl: imgUrl,
				trigger: function (res) {
				},
				success: function (res) {
					if(window.location.pathname!="/community/community.html"){
						shareOpen()
					}
					
				},
				cancel: function (res) {
				},
				fail: function (res) {
				}
			});
			//分享朋友圈
			wx.onMenuShareTimeline({
				title: title,
				link: link,
				imgUrl: imgUrl,
				trigger: function (res) {
				},
				success: function (res) {
					if(window.location.pathname!="/community/community.html"){
						shareOpen()
					}
				},
				cancel: function (res) {
				},
				fail: function (res) {
				}
			});
			//分享qq好友
			wx.onMenuShareQQ({
				title: title,
				desc: desc,
				link: link,
				imgUrl: imgUrl,
				trigger: function (res) {
				},
				complete: function (res) {
				},
				success: function (res) {
					if(window.location.pathname!="/community/community.html"){
						shareOpen()
					}
				},
				cancel: function (res) {
				},
				fail: function (res) {
				}
			});
			//分享微博
			wx.onMenuShareWeibo({
				title: title,
				desc: desc,
				link: link,
				imgUrl: imgUrl,
				trigger: function (res) {
				},
				complete: function (res) {
				},
				success: function (res) {
					if(window.location.pathname!="/community/community.html"){
						shareOpen()
					}
				},
				cancel: function (res) {
				},
				fail: function (res) {
				}
			});

			wx.getNetworkType({
				success: function (res) {
					var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
					if(networkType == '2g'){
						setTimeout("wx.showOptionMenu()",10000);
					}else if(networkType == '3g'){
						setTimeout("wx.showOptionMenu()",4000);
					}else if(networkType == '4g'){
						setTimeout("wx.showOptionMenu()",4000);
					}else if(networkType == 'wifi'){
						setTimeout("wx.showOptionMenu()",3000);
					}
				}
			});
						
		});
	})
	
}
function shareOpen(){
	$.ajax({
		type:"post",
		url:"/goola-web/v1/userTask/operateUserGrowValue",
		async:true,
		data:{"acquireType":2},
		success:function(data){
			console.log(data)
			var data=jQuery.parseJSON(data)
			if(data.message!='' && data.message!=null && data.message!=undefined){
				$('body').append('<div class="share-open" style="display:none">\
					<img src="/imgs/zhifu/zhifuchenggong.png" />\
					<h2>分享成功</h2>\
					<p>'+data.message+'</p>\
				</div>')
				$('body').find('.share-open').fadeIn()
				setTimeout(function(){
					$('body').find('.share-open').fadeOut().remove()
					
				},3000)
			}
			
		}
	});
	
	
}


var browser={
	versions:function(){
		var u = navigator.userAgent, app = navigator.appVersion;
		return {         //移动终端浏览器版本信息
			trident: u.indexOf('Trident') > -1, //IE内核
			presto: u.indexOf('Presto') > -1, //opera内核
			webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
			gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
			mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
			ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
			android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
			iPhone: u.indexOf('iPhone') > -1 , //是否为iPhone或者QQHD浏览器
			iPad: u.indexOf('iPad') > -1, //是否iPad
			webApp: u.indexOf('Safari') == -1 //是否web应该程序，没有头部与底部
		};
	 }(),
	 language:(navigator.browserLanguage || navigator.language).toLowerCase()
}

function isWeiXin(){ 
	var ua = window.navigator.userAgent.toLowerCase(); 
	if(ua.match(/MicroMessenger/i) == 'micromessenger'){ 
		return true; 
	}else{ 
		return false; 
	}
}

function toShare(title, desc, link, imgUrl) {
	if(browser.versions.ios){
		var str = "title$"+title+"$desc$"+desc+"$link$"+link+"$imgUrl$"+imgUrl;
		window.webkit.messageHandlers.shareBtnClick.postMessage({body: str})
	} else if (browser.versions.android){
		window.jsObj.goulaShare(title,desc,link,imgUrl);
	} else {
		alert("当前环境不支持分享");
		return;
	}
}


//微信外支付 (开始)
function toPay(orderCode,orderId,url,flag){
	
	if(browser.versions.ios && getCookie('platform')=='1'){
		var str = "orderNumber-"+orderCode;
		window.webkit.messageHandlers.payBtnClick.postMessage({body:str});  //调起ios app支付
	}else if (browser.versions.android && getCookie('platform')=='2'){
		window.jsObj.goulaPay(orderCode);  //调起Android app支付
	} else {   //微信外支付
		$('body').append('<div class="bg" style="display:block"></div>\
		<div class="topay">\
			<ul>\
				<li id="weixin">\
					<img src="/imgs/weixinpay.jpg"/>\
					<p>微信支付</p>\
				</li>\
				<li id="zhifubao">\
					<img src="/imgs/zhifubao.jpg"/>\
					<p>支付宝支付</p>\
				</li>\
			</ul>\
			<p class="quxiao">取消</p>\
		</div>')
		if(browser.versions.ios){
			$('#zhifubao').hide()
			$('#weixin').css('float','none').css('margin','0 auto')
		}
		$('.topay').slideDown()
		//选择微信支付
		$('#weixin').click(function(){
			setCookie('reFresh','weixin')
			$.ajax({
				type:"post",
				url:"/goola-web/v1/pay/weChatH5PayOrder",
				async:true,
				data:{"orderCode":orderId,"url":url,"flag":flag},
				success:function(data){
					$('.topay').prev().remove()
					$('.topay').remove()
					confirmPay('微信','weixin')
					window.location.href=(jQuery.parseJSON(data).data)[2]
				}
			});
		})
		//选择支付宝支付
		$('#zhifubao').click(function(){
			setCookie('reFresh','zhifubao')
			$.ajax({
				type:"post",
				url:"/goola-web/v1/pay/wapAliPay",
				async:true,
				data:{"orderCode":orderId,"flag":flag},
				success:function(data){
					$('.topay').prev().remove()
					$('.topay').remove()
					confirmPay('支付宝','zhifubao')
					$('.body').append(data)
				}
			});
		})
		$('.quxiao').click(function(){
			$('.topay').prev().remove()
			$('.topay').remove()
			
		})
	}
}

if(!((window.location.pathname).indexOf("querenzhifu")>0)&&!((window.location.pathname).indexOf("tuan-confirmpay")>0) &&!((window.location.pathname).indexOf("recharge-confirmpay")>0)){
	setCookie('reFresh','')
}
//弹出支付是否完成
if(getCookie('reFresh')=="weixin"){
	confirmPay('微信','weixin')
}else if(getCookie('reFresh')=="zhifubao"){
	confirmPay('支付宝','zhifubao')
}
$('.nocomplete').click(function(){
	setCookie('reFresh','')
	$('.weixin-open').remove()
})
//支付是否完成弹出框
function confirmPay(str,type){
	$('body').append('<div class="weixin-open">\
						<div>\
							<h3>请确认'+str+'支付是否完成</h3>\
							<a class="complete" type="'+type+'">支付已完成</a>\
							<a class="nocomplete">支付遇到问题</a>\
						</div>\
					</div>')
}

//微信外支付 (结束)
function shareInfo(theajax, serverUrl, url,title, desc, link, imgUrl){
		if(isWeiXin()){
			wxShare(theajax, serverUrl, url,title, desc, link, imgUrl);
			$('.shareButton').click(function(){
				$('body').append('<div class="wx-share">\
								<img src="../imgs/giftcard/fenxiang.png" />\
								<a class="wx-share-btn">知道啦</a>\
								</div>')
				$('.wx-share-btn').click(function(){
					 $('.wx-share').remove()	 
				})
			})
			
		}else if( browser.versions.ios || browser.versions.android){
			if(!isWeiXin()){
				if(location.href.indexOf('dis.goola.cn') <= 0){
					$('.shareButton').show()
				}
			}
			$('.shareButton').unbind('click').click(function(){
				toShare(title, desc, link, imgUrl)
			})
		}
		
	}
if(!isWeiXin()){
	if( browser.versions.ios || browser.versions.android){
		$('body').prepend('<div class="app-top">\
			<p><a href="javascript:void(history.back())" style="display: block;"></a></p>\
			<p>'+$('title').html()+'</p>\
			<p class="shareButton" style="display:none">分享</p>\
		</div>')
		$('.body').addClass('app-content')
	}
	
	
}else{
	setCookie("platform", "3");
}
var shield = document.createElement("DIV");
shield.className  = "alert-bg";
window.alert = function(str,aa) {
	shield.style.display = "block";
    var alertFram = document.createElement("DIV");
	alertFram.className  = "goola-alert";
	var alertInfo = '<div class="goola-alert-title">\
				<table style="width:100%;height:100%;text-align:center"><tr><td><p>' + str + '</p></td></tr></table>\
			</div>\
			<div class="goola-alert-list">\
				<p style="display:none"></p>\
				<p class="closeAlert">确定</p>\
				<div class="clear"></div>\
			</div>';
	alertFram.innerHTML = alertInfo
	document.body.appendChild(alertFram);
    document.body.appendChild(shield);
    
	$('body').find('.closeAlert').click(function(){
		
		if(aa!=null && aa!='' && aa!=undefined){
			window.location.href=aa
		}else{
			$(this).parent().parent().remove()
			if($('body').find('.closeAlert').length==0){
				shield.style.display = "none";
			}
		}
		
	})
}
	
	
function removeElement(_element){
	 var _parentElement = _element.parentNode;
	 if(_parentElement){
			_parentElement.removeChild(_element);
	 }
}

//活动发放优惠券
if(getCookie('lat')!='' && getCookie('lat')!=null && getCookie('lat')!=undefined){
	activity()
}

function activity(){
	$.ajax({
		type:"post",
		url:"/goola-web/v1/coupon/sendCoupon",
		async:true,
		success:function(data){
			var data=jQuery.parseJSON(data)
			if(data.code==0){
				data=data.data
				if(data!=''){
					if(data.regList.length!=0){
						for(var i=0;i<data.regList.length;i++){
							var regList=data.regList[i]
							addActivity('regList'+i,'/image/'+regList.activityPicture,regList.userCouponActivityItemList)
							}
						}
					if(data.visitList.length!=0){
						for(var i=0;i<data.visitList.length;i++){
							var visitList=data.visitList[i]
							addActivity('visitList'+i,'/image/'+visitList.activityPicture,visitList.userCouponActivityItemList)
						}				
					}
				}
			}
		}
	});
}
function addActivity(type,bg,list){
	var activityHtml='<div class="activity '+type+'"> \
		<div class="activity-content" style="background-image:url('+bg+') ;">\
			<a class="activity-close activity-top"></a>\
			<a class="activity-close activity-bottom"></a>\
			<div class="activity-coupon">\
				<ul>'
			for(var i=0;i<list.length;i++)	{
				var couponLimitValue
				if(list[i].coupon.couponLimitType==1){
					couponLimitValue="全品类"
				}else{
					couponLimitValue=list[i].coupon.couponLimitValue
					couponLimitValue=couponLimitValue.split('-')[1]
				}
				activityHtml+='<li>\
						<h3>'+list[i].coupon.preferentialPrice+'</h3>\
						<a><span>×</span>'+list[i].couponCount+'</a>\
						<p>'+couponLimitValue+'</p>\
						</li>'
			}
	
		activityHtml+='</ul>\
					</div>\
				</div>\
			</div>'

	$('body').append(activityHtml)
	$('.'+type+' ul').width(($('.'+type+' li').width()+5)*$('.'+type+' li').length)
	if($('.'+type+' li').length==1){
			$('.'+type+' ul').css('margin','0 auto')
		}
	$('.'+type+' .activity-close').click(function(){
		$(this).parent().parent().remove()
	})
}
//二维码关注
var QRcode='<div class="QRcode" >\
		<div class="QRcode-left" >\
			<img src="/imgs/QRcode-left.png" />\
		</div>\
		<div class="QRcode-alert" >\
			<img src="/imgs/QRcode-alert.png" />\
			<div class="QRcode-close"></div>\
		</div>\
	</div>'
if(isWeiXin() && !((window.location.pathname).indexOf("community")>0)){
	$.ajax({ 
			type: "post", 
			url: "/goola-web/v1/user/openAuthority/ifConcern", 
			async: true,
			success: function(data) { 
				if(jQuery.parseJSON(data).code==1){
					$('body').append(QRcode)
					$('.QRcode-left').click(function(){
						$('.QRcode-alert').fadeIn()
						$(this).animate({left:'-0.859375rem'});
					})
					$('.QRcode-close').click(function(){
						$('.QRcode-alert').fadeOut()
						$('.QRcode-left').animate({left:0});
					})
				}
			}, 
			error: function(e) { 
			
			} 
		}); 
}


//获取字符长度,一个字符为1/2汉字
function getByteLen(val) {
    var len = 0;
    if(val!=undefined){
        for (var i = 0; i < val.length; i++) {
            var a = val.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                len += 1;
            }
            else {
                len += 0.5;
            }
        }
        return len;
    }
}
function hzlength(val){
	var len = 0;
    if(val!=undefined){
        for (var i = 0; i < val.length; i++) {
            var a = val.charAt(i);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                len += 2;
            }
            else {
                len += 1;
            }
        }
        return len;
    }
}
//去掉字符串中空格,,所有第二个参数是"g"
function Trim(str,is_global){
 var result; 
 result = str.replace(/(^\s+)|(\s+$)/g,"");
 if(is_global.toLowerCase()=="g")
    result = result.replace(/\s/g,"");
 return result;
}

//添加购物车动画
function addCart(event) {
		var a=$(this).offset().top-$(document).scrollTop();
		var offset = $('#selectedTotal').offset(), flyer = $('<img class="u-flyer" src="/imgs/shouye-gouwuche.png"/>');
		if($(this).parent().hasClass('kaituan')){
			offset=$(this).parent().find('#selectedTotal').offset()
		}
		var endTop=offset.top-$(document).scrollTop()
		flyer.fly({
		    start: {
		        left: event.pageX-10,
		        top: a
		    },
		    end: {
		        left: offset.left,
		        top: endTop,
		        width: 0,
		        height: 0
		    }
		});
	}



//倒计时
function updateEndTime(){
		var date = new Date();
		var time = date.getTime();  //当前时间距1970年1月1日之间的毫秒数
		
		$(".settime").each(function(i){
			var endTime = $(this).attr('id'); //结束时间毫秒数
			
			var lag = (endTime - time) / 1000; //当前时间和结束时间之间的秒数
			
			if(lag > 0){
		   		var second = Math.floor(lag % 60);
		   		if(second<10){
					second='0'+second
				}
		   		var minite = Math.floor((lag / 60) % 60);
		   		if(minite<10){
					minite='0'+minite
				}
		  		var hour = Math.floor((lag / 3600) % 24);
		  		if(hour<10){
					hour='0'+hour
				}
		   		var day = Math.floor((lag / 3600) / 24);
		   		if(day<10){
					day='0'+day
				}
		   		if($(this).hasClass('settime1')){
		   			$(this).html(day+"天"+hour+"时"+minite+"分"+second+"秒");
		   		}else if($(this).hasClass('settime2')){
		   			$(this).html('<span>'+hour+'</span>:<span>'+minite+'</span>:<span>'+second+'</span>')
		   		}else{
		   			if(day=='00'){
			   			$(this).html(hour+":"+minite+":"+second);
			   		}else if(day=='00' && hour=="00"){
			   			$(this).html(minite+":"+second);
			   		}else if(day=='00' && hour=="00" && minite=="00"){
			   			$(this).html(second);
			   		}else{
			   			$(this).html(day+":"+hour+":"+minite+":"+second);
			   		}
		   		}
		   		
			}else{
				if($(this).hasClass('tuan-settime')){
					if($(this).hasClass('my-tuan')){
						$(this).parent().parent().append('<div class="icon"><img src="imgs/icon6.png"/></div>')
						$(this).parent().parent().parent().find('.yaoqing').remove()
						
					}
					$(this).parent().html('拼团剩余时间 已结束')
					
				}else{
					$(this).html("活动结束啦！");
				}
				
			}
			   	
			});
		 	setTimeout(updateEndTime,1000);
		}

//统计代码
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?abbbe792d935d57b7bb937bfed478dae";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();

//底部logo替换
if(getCookie("platform")==1 || getCookie("platform")==2){
	$('#logo-bottom').attr('src','/imgs/logo-bottom1.jpg')
}

setChannelCookies();

function setChannelCookies() {
	var source = getUrlParameters("source");
	var feedback = getUrlParameters("feedback");
	if (source != null && source != '' && source != undefined) {
		var date=new Date(); 
		date.setTime(date.getTime()+30*24*60*60*1000); 
		setCookie("source", getUrlParameters("source"), date);
		setCookie("feedback", getUrlParameters("feedback"), date);
	}
}

function getUrlParameters(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return r[2];
	return null;
}

$('.nav').load("/base/footer.html",function(){
	if(window.location.pathname=="/index.html"){
		$('.nav').children('a').eq(0).find('img').attr('src','/imgs/shouye-Home1.png')
	}else if(window.location.pathname=="/fenlei/fenlei.html"){
		$('.nav').children('a').eq(1).find('img').attr('src','/imgs/shouye-List1.png')
	}else if(window.location.pathname=="/gouwuche/gouwuche.html"){
		$('.nav').children('a').eq(2).find('img').attr('src','/imgs/shouye-gouwuche1.png')
	}else if(window.location.pathname=="/gerenzhongxin/gerenzhongxin.html"){
		$('.nav').children('a').eq(3).find('img').attr('src','/imgs/shouye-User1.png')
	}
})