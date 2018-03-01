//根据页面url获取goodId
(function(api, util, ajax){
	var goodsId;
	var repertoryCount;
	var paramGoodsId = util.getUrlParams("goodsId");
	var cowdfundingId
	var id=util.getUrlParams("id")
	var goodsInfo
	var oldPrice
	getGoodsInfo(paramGoodsId);
	
	
	//事业会员分享
	var type=util.getUrlParams("type")
	var huiyuan=util.getUrlParams("huiyuan")
	if(type=="dis" && huiyuan!=1){
		$('body').append('<div class="shareinfo-bg">\
				<img src="/distribution/imgs/fenxiang.png" />\
				<a>知道啦</a>\
			</div>')
		if(isWeiXin()){
			$('.shareinfo-bg').css('top','0')
		}else{
			$('.shareinfo-bg').css('top','1.25rem')
		}
		$('.shareinfo-bg a').click(function(){
			$(this).parent().remove()
		})
	}
	
	var tuan=util.getUrlParams("tuan");
	var activityId
	//获取商品信息
	if( browser.versions.ios || browser.versions.android){
		if(!isWeiXin()){
			$('#shouye').hide()
		}
	}
	function getGoodsInfo(paramGoodsId) {   
		ajax.post(api.baseServerUrl + "/distributionSellTeamGoods/findGoods",{
			"goodsId":paramGoodsId,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
		},function(data) {
			goodsInfo=data
			if(tuan==null){
				var obj = {data:data,picUrl:api.picUrl}
			}else{
				var obj = {data:data,picUrl:api.picUrl,tuan:tuan}
			}
			oldPrice=(data.goods.preferentialPrice).toFixed(2)
			util.render("#swiper-container",obj,".swiper-container")
			util.render("#leftsidebar_box_dl",obj,".details-one")
			
			var mySwiper = new Swiper('.swiper-container', {
				loop: true,
				autoplay: 3000,
				pagination: '.swiper-pagination',
				paginationClickable :true,
				autoplayDisableOnInteraction: false
			})
			cowdfundingId=data.cowdfundingId
			if(data.ifSelectFlag!=undefined && data.ifSelectFlag !=null && data.ifSelectFlag!=''){
				$('#bottom-slider').show()
			}
			if(data.poActivity!=undefined && data.poActivity!=null && data.poActivity!=''){
				$('#bottom-slider').show()
				util.render("#bottom-slide1",obj,'#bottom-slider .bottom-slide1');
				$('.payment1').remove()
				$('.bottom-slide-payment').remove()
				$('.bottom-slide-confirm').html('立即购买')
					.css('width','8.28125rem').css('background','#fa2f3e')
				$('.bottom-slide1').find('.d a').eq(0).addClass('selected')
				$('.bottom-slide1').find('.c0').show().addClass('checkedTime')
				$('.payment1').remove()
				$('.addgwc').html('立即购买').css('width','8.28125rem').css('background','#fa2f3e')	
			}else{
				util.render("#bottom-slide",obj,'#bottom-slider .bottom-slide1');
				
			}
			/*if(data.typeInfo!=undefined && data.typeInfo!=null && data.typeInfo!=''){
				$('.payment1').remove()
				$('.addgwc').css('width','8.28125rem').css('background','#fa2f3e')
			}*/
			util.render("#message",obj,'.message-content'); 
			 
			
			$('.collocation .collocation-addcard').on('click', addCart);
			if(data.isLocationInventory==1){
				$('.bottom').css('background','#BEBEBE').html('<p>所在地区无库存</p>')
			}
			$(function() {
				$(".lazy").lazyload({
					effect : "fadeIn",
					threshold : 1000
				});
			});
			if (data.ifSelectFlag == 0) {
				goodsId = data.goods.goodsId;
				repertoryCount = data.repertoryCount;
			} else {
				$('.a div a')[0].click();
				$('.b div a')[0].click();
			}
			
			
				$('.bottom').show()
			
			
			
			shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),data.goods.shareTitle,data.goods.shareDescription,location.href+"&huiyuan=1","http://"+ document.domain +api.picUrl + data.goods.cartPhoto);
		},function(returnData){
			console.log(returnData)
		})
	}
	function goods(){
		ajax.post(api.baseServerUrl + "/gb/requireLocation/queryGroupBuyingOrderDetail",{
			"activityId":activityId,"orderId":id,"goodsId":paramGoodsId
		},function(data) {
			var obj = {data:data,picUrl:api.picUrl,tuan:tuan}
			util.render("#tuan-content",obj,'.tuan-content');
			$('.tc-top ul').css('width',(1.1875+0.328125)*$('.tc-top ul').find('li').length-0.328125+'rem')
			$('.tc-top ul>:first').append('<a><img src="../tuan/imgs/icon11.png"/></a>')
			updateEndTime()
			if(tuan=="cantuan"){
				if($('.tc-top h3').html()=="拼团剩余时间 已结束"){
					$('.cantuan').find('.cantuan-btn').css('background','#aaa').removeClass('cantuan-btn')
					$('.tc-top p').hide()
				}
			}
		})
	}
	

	


	$('.message').delegate('.message-btn','click',function(){
		$('.message-btn a').css('border-bottom','2px solid #fff')
							.css('color','#1b1b1b')
							.eq($(this).index())
							.css('border-bottom','2px solid #fa2f3e')
							.css('color','#fa2f3e')
		$('.message-show').css('display','none')
		$('.message-show').eq($(this).index()).css('display','block')
	})
	
	$('#bottom-slider').delegate(' .a div a','click',function(){
		$('.a div a').attr("class","noselected");
		$(this).attr("class","selected");
		$(".b div").hide();
		var selectB = $(".b").find("#" + $(this).index());
		selectB.show();
		$('.bottom-slide').find('.bottom-slide-title-describe h3 span').html(selectB.find('.selected').attr('preferentialPrice'))
		$(".bottom-slide-num").hide();
		if (selectB.find(".selected").length == 0) {
			selectB.find(".noselected")[0].click();
		} else {
			$("#bottom" + selectB.find(".selected").attr("id")).show();
		}
		if(selectB.find('.selected').html()==undefined){
			var data1=(goodsInfo.typeInfo)[$(this).html()][selectB.find('a').eq(0).html()]
			data1.type1=$(this).html()
			data1.type2=selectB.find('a').eq(0).html()
		}else{
			var data1=(goodsInfo.typeInfo)[$(this).html()][selectB.find('.selected').html()]
			data1.type1=$(this).html()
			data1.type2=selectB.find('.selected').html()
		}
		var obj={data:data1,picUrl:api.picUrl}

		$('.bottom-slide').find('.bottom-slide-title img').attr('src',api.picUrl+data1.goods.cartPhoto)
		if(data1.goods.goodsId!=goodsId){
			guigeChoice(obj)
		}
		
		goodsId=selectB.find('a').attr('id')
		
	})
	$('#bottom-slider').delegate(' .b div a','click',function(){
		$(this).parent().find('a').attr("class","noselected");
		$(this).attr("class","selected");
		$('.bottom-slide').find('.bottom-slide-title-describe h3 span').html($(this).attr('preferentialPrice'))
		$(".bottom-slide-num").hide();
		$("#bottom" + $(this).attr("id")).show();
		
		var data2=(goodsInfo.typeInfo)[$('#bottom-slider .a').find('.selected').html()][$(this).html()]
		data2.type1=$('#bottom-slider .a').find('.selected').html()
		data2.type2=$(this).html()
		var obj={data:data2,picUrl:api.picUrl}
		$('.bottom-slide').find('.bottom-slide-title img').attr('src',api.picUrl+data2.goods.cartPhoto)
		if(data2.goods.goodsId!=goodsId && goodsId!=undefined){
			guigeChoice(obj)
		}
		
		goodsId=$(this).attr("id");
		repertoryCount=$("#bottom" + $(this).attr("id")).attr("repertoryCount");
		
		
	})
	function guigeChoice(obj){
		util.render("#swiper-container",obj,".swiper-container")
		util.render("#leftsidebar_box_dl",obj,".details-one")
		var mySwiper = new Swiper('.swiper-container', {
			loop: true,
			autoplay: 3000,
			pagination: '.swiper-pagination',
			paginationClickable :true,
			autoplayDisableOnInteraction: false
		})
		util.render("#message",obj,'.message-content'); 
		$(function() {
			$(".lazy").lazyload({
				effect : "fadeIn",
				threshold : 1000
			});
		});
	}
	
	//周期预定
	$('#bottom-slider').delegate(' .d div a','click',function(){
		$('.d div a').attr("class","noselected");
		$(this).attr("class","selected");
		$(this).parent().parent().parent().find('.bottom-slide-title img').attr('src',api.picUrl+$(this).attr('cartPhoto'))
		$(this).parent().parent().parent().find('.bottom-slide-title-describe h3 span').html($(this).attr('prePrice'))
		$(".c").hide().removeClass('checkedTime');
		$(".c" + $(this).index()).show().addClass('checkedTime');
		
	})
	//周期预定选择时间
	$('#bottom-slider').delegate('.bottom-time','click',function(){
		$(this).parent().append('<div class="bg" style="display:block"></div>')
		$(this).next().slideDown('2000')
		$(this).next().find('li').css('color','#9b9b9b')
		$(this).next().find('li').eq(0).css('color','#fa2f3e')
		$(this).next().find('.bottom-time-choice .time-queding').attr('time',$('#bottom-slider').find('.bottom-time-choice li').eq(0).attr('time'))
		
	})
	$('#bottom-slider').delegate('.time-quxiao','click',function(){
		$(this).parent().slideUp('2000')
		$(this).parent().parent().find('.bg').remove()
	})
	$('#bottom-slider').delegate('.bottom-slide-choice .bg','click',function(){
		$(this).prev().slideUp('2000')
		$(this).remove()
	})
	$('#bottom-slider').delegate('.bottom-time-choice li','click',function(){
		$('#bottom-slider').find('.bottom-time-choice li').css('color','#9b9b9b')
		$(this).css('color','#fa2f3e')
		$(this).parent().parent().parent().find('.time-queding').attr('time',$(this).attr('time'))
	})
	$('#bottom-slider').delegate('.time-queding','click',function(){
		$(this).parent().prev().find('p').html(getFormatDate(Number($(this).attr('time'))).split(' ')[0])
		$(this).parent().slideUp('2000')
		$(this).parent().parent().find('.bg').remove()
	})
	
	
	
	$('#bottom-slider').delegate('.minus','click',function(){
		if($('#bottom' + goodsId + ' .amount').html()==1){
			$(this).css('background','#fff url(/imgs/shangpin/gouwuchemin.png?t=20161117) no-repeat center center')
					.css('background-size','0.375rem 0.375rem')
			return;
		}
		$('#bottom' + goodsId + ' .amount').html(parseInt($('#bottom' + goodsId + ' .amount').html())-1);
	})
	$('#bottom-slider').delegate('.add','click',function(){
		$(this).prev().prev().css('background','#fff url(/imgs/shangpin/gouwuchemin1.png?t=20161117) no-repeat center center')
					.css('background-size','0.375rem 0.375rem')
		$('#bottom' + goodsId + ' .amount').html(parseInt($('#bottom' + goodsId + ' .amount').html())+1)
	})
	$('.details').delegate('.choice','click',function(){
		$('.bottom-slide').slideDown('2000')
		$('body').scrollTop(0)
		document.body.ontouchmove=function(){
			return false;
		}
		$('.bg').css('display','block')
		if($('.bottom-slide').find('.b').html()!='' && $('.bottom-slide').find('.b').html()!=undefined && $('.bottom-slide').find('.b').html()!=null){
				$('.bottom-slide').find('.bottom-slide-title-describe span').html(Number($('.bottom-slide').find('.b .selected').attr('preferentialprice')).toFixed(2))
			}
	})
	var sss=0;
		
	$('.body').delegate('.addgwc','click',function(){
		if ($("#bottom-slider .bottom-slide1").html()!=''){
			$('.bottom-slide').slideDown('2000')
			$('body').scrollTop(0)
			document.body.ontouchmove=function(){
				return false;
			}
			$('.bg').css('display','block')
			if($('.bottom-slide').find('.a a').html()==''){
				$('.bottom-slide').find('.a').hide()
			}
			if($('.bottom-slide').find('.b').html()!='' && $('.bottom-slide').find('.b').html()!=undefined && $('.bottom-slide').find('.b').html()!=null){
				$('.bottom-slide').find('.bottom-slide-title-describe span').html(Number($('.bottom-slide').find('.b .selected').attr('preferentialprice')).toFixed(2))
			}
		}else{
			var aaa=getCookie('3goolaNew').split('$')
			for(var i=0;i<aaa.length;i++){
				if((aaa[i].split('||')[0]).replace('|','')==goodsId){
					sss=aaa[i].split('||')[3]
				}
			}
			
			var goodsPrice=$('.price span').text()
			var goodsPriceNew=$('.cost span').text()
			window._hmt && window._hmt.push(['_trackEvent',"加入购物车", goodsId]);
			addProductinCart(goodsId,goodsPrice,goodsPriceNew,1,repertoryCount)
			//quantity.attr("limitCount",quantity.attr("limitCount")-1)
		}
	})
	$('.body').delegate('.payment1','click',function(){
		if ($("#bottom-slider .bottom-slide1").html()!=''){
			$('.bottom-slide').slideDown('2000')
			$('body').scrollTop(0)
			document.body.ontouchmove=function(){
				return false;
			}
			$('.bg').css('display','block')
			if($('.bottom-slide').find('.a a').html()==''){
				$('.bottom-slide').find('.a').hide()
			}
			if($('.bottom-slide').find('.b').html()!='' && $('.bottom-slide').find('.b').html()!=undefined && $('.bottom-slide').find('.b').html()!=null){
				$('.bottom-slide').find('.bottom-slide-title-describe span').html(Number($('.bottom-slide').find('.b .selected').attr('preferentialprice')).toFixed(2))
			}
		}else{
			window._hmt && window._hmt.push(['_trackEvent',"立即购买", goodsId]);
			window.location.href="/payment/community/payment.html?goodsId="+goodsId+"&buyCount=1"
		}
	})
	
	$('.bottom .addgwc').on('click', addCart);
	
	
	
	
	$('.gwc').click(function(){
		window.location.href='../gouwuche/gouwuche.html'
	})
	
			
	$('#bottom-slider').delegate('.bottom-slide-confirm','click',function(){
		var goodsPrice=$('.price span').text()
		var goodsPriceNew=$('.cost span').text()
		var count=$("#bottom" + goodsId +' .amount').text()
		if($(this).html()=="加入购物车"){
			window._hmt && window._hmt.push(['_trackEvent',"加入购物车", goodsId]);
			addProductinCart(goodsId,goodsPrice,goodsPriceNew,count,repertoryCount)
			$('.bottom-slide').css('display','none')
			document.body.ontouchmove=function(){
				return true;
			}
			$('.bg').css('display','none')
		}else if($(this).html('立即购买')){
			var activityId=$(this).parent().parent().find('.d .selected').attr('activityId')
			var choosedSendTime=$(this).parent().parent().find('.checkedTime .bottom-time p').html()
			var buyCount=$(this).parent().parent().find('.amount').html()
			window._hmt && window._hmt.push(['_trackEvent',"预定", goodsId]);
			window.location.href="../../payment/payment.html?activityId="+activityId+"&choosedSendTime="+choosedSendTime+"&goodsId="+goodsId+"&buyCount="+buyCount
		}
	})
	$('#bottom-slider').delegate('.bottom-slide-payment','click',function(){
		var count=$("#bottom" + goodsId +' .amount').text()
		window._hmt && window._hmt.push(['_trackEvent',"立即购买", goodsId]);
		window.location.href="../../payment/payment.html?goodsId="+goodsId+"&buyCount="+count
	})
	$('#bottom-slider').delegate('.cancel','click',function(){
		$('.bottom-slide').css('display','none')
		document.body.ontouchmove=function(){
			return true;
		}
		$('.bg').css('display','none')
	})
	
	
	
		
		
		
		
	
	
})(goola.api, goola.util, goola.ajax);