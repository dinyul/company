
var goodsIds = ",";
var cartGoods;
var goodsInfo,goodsInfo1;
var selPrice = 0;
var oriPrice = 0;
var count=0;
var giftUrl=0;
var addressInfoFunc;
var addressInfoFunc1
var userCouponIds;
var theAddressId=getCookie('addressId');
var orderType;
var usePoints;
var pointsPrice;
var pointsMoneyRate;
var isBatchOrder=2;
var choosedSendTime;
var goodsList=""
var couponPrice
var useBalance=false;
var totalPrice
$(function() {	
(function(api,util,ajax,address){
	var shopId=util.getUrlParams("shopId") || getCookie("shopId");
	if (shopId != null && shopId != '') {
		setCookie("shopId", shopId);
	}
	$(".shouye").click(function(){
		if (getCookie("shopId")) {
			window.location.href="/mobilerack/mobilerack.html?shopId=" + getCookie("shopId");
		} else {
			window.location.href="/mobilerack/mobilerack-shop.html";
		}
	})
	var type=util.getUrlParams("type")
	showCart();//展示购物车物品
	$("#total").delegate('.payment','click',function(){
		$("#gwc").hide();
		$("#jiesuan").show();
		showShoppingList();
	})
	
	$("#jiesuan").delegate(".imga",'click',function() {
		showShoppingList1();
	})
	
	$("#jiesuan").delegate('.bottompay','click',function(){
		ordering();
	})
	$(".scanQRCode").click(function(){
		if (getCookie("shopId")) {
			scanQRCode(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),shopId)
		} else {
			alert("请先扫描货架二维码");
			scanQRCodeShop(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),shopId)
		}
	})
	function scanQRCodeShop(theajax, serverUrl, url,shopId) {
	
		theajax.post(serverUrl + "/shop/getLocationConfig",{
			url:url
		},function(data) {
			wx.config({
				debug: false,
				appId: data.appid,
				timestamp: data.timeStamp,
				nonceStr: data.nonceStr,
				signature: data.signature,
				jsApiList: ['scanQRCode']
			});
			wx.ready(function () {
				wx.scanQRCode({ 
				    needResult : 1, 
				    scanType : [ "qrCode" ], 
				    success : function(res) { 
				    	if(res.resultStr.split('?')[1]!=undefined && res.resultStr.split('?')[1]!=null && res.resultStr.split('?')[1]!=''){
				    		window.location.href="/payment/rack-shopping.html?"+res.resultStr.split('?')[1]
				    	}else{
				    		alert('请扫描货架上的二维码')
				    	}
				   		
				    }, 
				    fail : function(res) { 
					    console.log(res) 
					    alert(JSON.stringify(res)+" 2"); 
					    setCookie('jsDebug','scanQRCode error',60/24/60)
				 
				    } 
				  			
				});
			})
		})
	}
	function showCart(){
		var carHelper = new CartHelper();
		var car = carHelper.Read();
		var result = '';
		var items = car.Items;
//		if(document.referrer==window.location.origin+"/mobilerack/mobilerack-shop.html"){
//			$('#fullCart_4 .scanQRCode').html('扫描商品条形码').css('width','3.75rem')
//		}
		if(items.length == 0){
			$("#fullCart_4").show();
		}else{
			$("#fullCart_1").show();
			$('#total').show()
			var buyGoodsJson = new Array();
			for(var i=0;i<items.length;i++){
				var obj = new Object();
				obj.buyCount = items[i].GoodsCount;
				obj.goodsId = items[i].GoodsId;
				buyGoodsJson[i] = obj;
				goodsIds = goodsIds + items[i].GoodsId + ",";
			}
			ajax.post(api.baseServerUrl + "/shop/shelvesShopCarDetail",{
				"buyGoodsJson":JSON.stringify(buyGoodsJson),"shopId":shopId
			},function(data) {
				cartGoods = data.goods;
				util.render("#cartTmpl", cartGoods,"#fullCart_1");
				selectChecked()
				util.render("#totalTmpl",data,".total");
				
			});
			
		}
	}

	//数量减少
	function minus(id){
		var oldNum = $('.addminus').find("#"+id+"c").html();
		var newNum = parseInt(oldNum)-1;
		if(Number(newNum) == 1){
	//		$('#jian_'+id).html('<img src="'+rootPath+'/images/shanc_03.png">');
		//	$('#jian_'+id).html('<img src="'+rootPath+'/images/car/shanc_03.png" width="25">');
		}
		if(parseInt(oldNum) == 1){
			//delGoods(id);
			/*$('.addminus').find("#"+id+"c").html('0')
			delGoods(id);
			selectChecked();*/
			
			//$('.addminus').find("#"+id+"c").html('0')
			$('#gwc .address-firm').show()
			$('.bg').show()
			$('#gwc .address-firm').attr('goodsId',id)
		}else{
			$('.addminus').find("#"+id+"c").html(newNum);
			var cc=0
			$("."+id+"c").each(function(){
				cc=Number(cc)+Number($(this).html())
			})
			updateProduct(id,cc);
			selectChecked();
		}
	}
	//数量增加
	function plus(id){
		
		if(Number(id) == 1769){
			alert("该商品每人限购一件！");
			return;
		}
		//原来数量
		var oldNum = $('.addplus').find("#"+id+"c").html();
		//增加后数量
		var newNum = parseInt(oldNum)+1;
		//库存数量
		var repertoryCount = $('.addplus').find("#"+id+"rc").html();
		if(Number(repertoryCount) != -1 && Number(newNum) > Number(repertoryCount)){
			alert("卖完啦！购小啦努力备货中…");
			return;
		}else{
			$('.addplus').find("#"+id+"c").html(newNum);
			var cc=0
			$("."+id+"c").each(function(){
				//console.log($(this).html())
				cc=Number(cc)+Number($(this).html())
			})
			updateProduct(id,cc);
			//计算选中商品价格
			selectChecked();
		}

	}


	//删除商品
	function delGoods(goodsId){
		if($('.adddelete').parent().find("li").length <= 1){
			$('.adddelete').parent().find('.gouwuche-title').remove();
		}
		$('.adddelete').find("#"+goodsId).parent().remove();
		
		if($("."+goodsId+"c").length>0){
			var cc=0
			$("."+goodsId+"c").each(function(){
				//console.log($(this).html())
				cc=Number(cc)+Number($(this).html())
			})
			updateProduct(goodsId,cc);
		}else{
			var carHelper = new CartHelper();
			carHelper.Del(goodsId);
		}
		selectChecked()
		if (goodsIds == ",") {
			$("#fullCart_1").hide();
			$("#total").hide();
			$("#fullCart_4").show();
		}	
	}


	//数量增加
	$('#cartInfo').delegate('.plus','click',function(){
		$('.body').find('.one-goods').removeClass('addplus')
		$(this).parent().parent().addClass('addplus')
		if($(this).attr('activityType')==3){
			if(Number($(this).prev().html())>=Number($(this).attr('maxFsCount'))){
				alert('已达限购数量，请下次活动继续参与')
				return;
			}else{
				plus($(this).parent().parent().attr('id'))
			}
		}else{
			plus($(this).parent().parent().attr('id'))
		}
		
		
		
		
	})
	//数量减
	$('#cartInfo').delegate('.minus','click',function(){
		$('.body').find('.one-goods').removeClass('addminus')
		$('.body').find('.one-goods').removeClass('adddelete')
		$(this).parent().parent().addClass('addminus')
		$(this).parent().parent().addClass('adddelete')
		minus($(this).parent().parent().attr('id'))
	})
	//点击删除
	$('#cartInfo').delegate('.delete','click',function(){
		$('.body').find('.one-goods').removeClass('adddelete')
		$(this).parent().addClass('adddelete')
		$('#gwc .address-firm').show()
		$('.bg').show()
		$('#gwc .address-firm').attr('goodsId',$(this).parent().attr('id'))
		//delGoods($(this).parent().attr('id'))

	})
	$('#gwc .address-firm .cancelGoods').click(function(){
		$('#gwc .address-firm').hide()
		$('.bg').hide()
		$('#gwc .address-firm').removeAttr('goodsId')
	})
	$('#gwc .address-firm .deleteGoods').click(function(){
		$('#gwc .address-firm').hide()
		$('.bg').hide()
		delGoods($(this).parent().parent().attr('goodsId'))
	})
	//清空购物车
	function clearCart(){
		if(COOKIE_LENGTH > 0){
			layer.open({
				content: '哦，NO！主人不要我了哦！ㄒoㄒ',
				btn: ['取消', '确认'],
				shadeClose: false,
				yes: function(){
					//点击取消
					layer.closeAll();
				}, no: function(){
					//点击确认
					var carHelper = new CartHelper();
					carHelper.Clear();
					showCart();
					layer.closeAll();
				}
			});
		}
		
	}
	//编辑购物车
	function updateProduct(goodsId,count){
		var carHelper = new CartHelper();
		carHelper.Change(goodsId, count);
	}
	
	$('#cartInfo').delegate('.GoodsCheck','click',function() {
		$(this).parent().toggleClass('checked')
		$(this).parent().parent().parent().find('li').each(function() {
			var elem = $(this).find('.btn');
			if(elem.hasClass('checked')==false){
				$(this).parent().find('.GoodsCheck1').parent().removeClass('checked')
			}else if($(this).parent().find('li .checked').length==$(this).parent().find('li').length){
				$(this).parent().find('.GoodsCheck1').parent().addClass('checked')
			}
		})
		$('#cartInfo ul li').each(function() {
			var elem = $(this).find('.btn');
			if(elem.hasClass('checked')==false){
				$('.GoodsCheckall').parent().removeClass('checked')
			}else if($('#cartInfo ul').find('li .checked').length==$('#cartInfo ul').find('li').length){
				$('.GoodsCheckall').parent().addClass('checked')
			}
		})
		selectChecked()
	});
	$('#cartInfo').delegate('.GoodsCheck1','click',function() {
		$(this).parent().toggleClass('checked')
		if($(this).parent().hasClass('checked')==true){
			$(this).parent().parent().parent().find('.GoodsCheck').parent().addClass('checked')
		}else{
			$(this).parent().parent().parent().find('.GoodsCheck').parent().removeClass('checked')
		}
		$('#cartInfo ul li').each(function() {
			var elem = $(this).find('.btn');
			if(elem.hasClass('checked')==false){
				$('.GoodsCheckall').parent().removeClass('checked')
			}else if($('#cartInfo ul').find('li .checked').length==$('#cartInfo ul').find('li').length){
				$('.GoodsCheckall').parent().addClass('checked')
			}
		})
		selectChecked()
	});	
	$('.gouwuche-bottom').delegate('.GoodsCheckall','click',function() {
		$(this).parent().toggleClass('checked')
		if($(this).parent().hasClass('checked')==true){
			$('#cartInfo ul').find('.btn').addClass('checked')
		}else{
			$('#cartInfo ul').find('.btn').removeClass('checked')
		}
		selectChecked()
	});	
		//查找所有选中的物品
	function selectChecked(){
		oriPrice = 0;
		selPrice = 0;
		count=0
		goodsIds = ",";
		$('#cartInfo ul li').each(function() {
			var elem = $(this).find('.btn');
			if(elem.hasClass('checked')==true){
				goodsIds = goodsIds + elem.attr('id')+ ",";
				var p = $(this).find("#"+elem.parent().attr('id')+"p").html();
				var c = $(this).find("#"+elem.parent().attr('id')+"c").html();
				var o = $(this).find("#"+elem.parent().attr('id')+"o").html();
				//价格计算
				if(selPrice == 0){
					count=Number(c)
					selPrice = accMul(Number(p),Number(c));
					oriPrice = accMul(Number(o),Number(c))
				}else{
					count+=Number(c)
					selPrice += accMul(Number(p),Number(c));
					oriPrice += accMul(Number(o),Number(c))
				}
				
			}
		})
		
		showCartStatus()
		$("#totalPrice_2").html(selPrice.toFixed(2));
		$("#save").html((oriPrice-selPrice).toFixed(2));
		$('#selectedTotal').html('<span id="goodsCount">'+count+'</span>')
		isBatchOrder=2
	}
	/**
	 * 确认订单页面
	 */
//展示购物清单
	
	function showShoppingList(){
		selectChecked();
		var carHelper = new CartHelper();
		var car = carHelper.Read();
		var items = car.Items;	
		goodsInfo = new Array();
		var t = 0;
		for(var i=0;i<items.length;i++){
			if(goodsIds.indexOf("," + items[i].GoodsId + ",") > -1){
				var obj = new Object();
				obj.buyCount = items[i].GoodsCount;
				obj.goodsId = items[i].GoodsId;
				goodsInfo[t] = obj;
				t ++;
			}
		}
		goodsInfo=JSON.stringify(goodsInfo)
		goodsInfo1=goodsInfo
		ajax.post(api.baseServerUrl + "/shop/shelvesShopCarDetail",{
			"buyGoodsJson":goodsInfo,"shopId":shopId,"userCouponIds":userCouponIds
		},function(data) {
			util.render("#goodsTmpl", data.goods, ".content2");
			totalPrice=data.orderPrice
			if (!data.staffQuotaBalance) {
				data.staffQuotaBalance = 0;
			}
			if (!data.useEnterpriseBalance) {
				data.useEnterpriseBalance = 0;
			} 
			util.render("#jiesuanTmpl", data, "#bottomjiesuan");
			if(data.isLogin==false){
				getusablecoupon(goodsInfo);
			}else{
				//$('.content2e-pay').html("¥"+Number(totalPrice).toFixed(2))
			}
		});
		
		
	}
	
	function showShoppingList1(){
		selectChecked();
		var carHelper = new CartHelper();
		var car = carHelper.Read();
		var items = car.Items;	
		goodsInfo = new Array();
		var t = 0;
		for(var i=0;i<items.length;i++){
			if(goodsIds.indexOf("," + items[i].GoodsId + ",") > -1){
				var obj = new Object();
				obj.buyCount = items[i].GoodsCount;
				obj.goodsId = items[i].GoodsId;
				goodsInfo[t] = obj;
				t ++;
			}
		}
		goodsInfo=JSON.stringify(goodsInfo)
		goodsInfo1=goodsInfo
		
		ajax.post(api.baseServerUrl + "/shop/shelvesShopCarDetail",{
			"buyGoodsJson":goodsInfo,"shopId":shopId,useEnterpriseBalance:useBalance?0:1,"userCouponIds":userCouponIds
		},function(data) {
			if (useBalance) {
				useBalance = false;
			} else {
				useBalance = true;
			}
			if (!data.staffQuotaBalance) {
				data.staffQuotaBalance = 0;
			}
			if (!data.useEnterpriseBalance) {
				data.useEnterpriseBalance = 0;
			} 
			if (useBalance) {
				data.src = "/imgs/payment/jiesuan2/icon2/207918759010222378.png";
			} else {
				data.src = "/imgs/payment/jiesuan2/icon2/617871071494316514.png";
			}
			totalPrice=data.orderPrice
			util.render("#jiesuanTmpl", data, "#bottomjiesuan");
			getusablecoupon(goodsInfo);
		});
		
	}
	$('#jiesuan #fanhui').click(function(){
		$('#gwc').show();
		$("#jiesuan").hide();
	})
	
	//获取可用优惠券
	function getusablecoupon(buyGoodsJson){
		ajax.post(api.baseServerUrl + "/promotion/queryShelvesUsableCouponList",{
			"buyGoodsJson":buyGoodsJson,"shopId":shopId
		},function(data) {
			var info = data.length + "张可用";			
			if(userCouponIds!=undefined){
				$('.use-coupon').html("¥"+Number(couponPrice).toFixed(2))
			}else{
				$('.use-coupon').html(info)
				
			}
			util.render("#couponInfoTmpl", data,"#couponInfo");
		},function(returnData) {
			$('.use-coupon').html("0张可用")
		});
	}
	
	//点击选择优惠券页面
	$("#bottomjiesuan").delegate('.use-coupon','click',function(){
		var num = $(".use-coupon").html().split("张")[0];
		if(Number(num) < 1){
			alert("您没有可用优惠券!");
			return;
		}
		$("#yhq").show();
		if(!isWeiXin()){
			$('#yhq').css('top','1.25rem')
		}
	});
	$('#yhq #fanhui').click(function(){
		$("#yhq").hide();
	})
	//选择使用优惠券
	$("#couponInfo").delegate('li','click',function(){
		$("#yhq").hide();
		$('.bg').hide()
		userCouponIds = $(this).find(".left").attr("id");
		var s=Number($(this).find(".left span").html()).toFixed(2)
		$('.use-coupon').html("¥" + s)
		couponPrice=s
		//$('.content2e-pay').html("¥"+(Number(totalPrice)-couponPrice).toFixed(2))
		ajax.post(api.baseServerUrl + "/shop/shelvesShopCarDetail",{
			"buyGoodsJson":goodsInfo,"shopId":shopId,"userCouponIds":userCouponIds,"useEnterpriseBalance":useBalance?1:0
		},function(data) {
			if (!data.staffQuotaBalance) {
				data.staffQuotaBalance = 0;
			}
			if (!data.useEnterpriseBalance) {
				data.useEnterpriseBalance = 0;
			} 
			if (useBalance) {
				data.src = "/imgs/payment/jiesuan2/icon2/207918759010222378.png";
			} else {
				data.src = "/imgs/payment/jiesuan2/icon2/617871071494316514.png";
			}
			util.render("#jiesuanTmpl", data, "#bottomjiesuan");
			if(data.isLogin==false){
				getusablecoupon(goodsInfo);
			}
		});
	})
	//结算
	function ordering(){
		$('#bottompay').css('background','#aaa').removeClass('bottompay');
		selectChecked();
		var carHelper = new CartHelper();
		var car = carHelper.Read();
		var items = car.Items;	
		goodsInfo = new Array();
		var t = 0;
		for(var i=0;i<items.length;i++){
			if(goodsIds.indexOf("," + items[i].GoodsId + ",") > -1){
				var obj = new Object();
				obj.buyCount = items[i].GoodsCount;
				obj.goodsId = items[i].GoodsId;
				goodsInfo[t] = obj;
				t ++;
			}
		}
		goodsInfo=JSON.stringify(goodsInfo)	
		
		ajax.post(api.baseServerUrl + "/shelvesOrder/openAuthority/createShelvesOrder",{
			"buyGoodsJson":goodsInfo,"shopId":shopId,"useEnterpriseBalance":useBalance?1:0,
			"userCouponIds":userCouponIds
		},function(data) {
			
			
			if(data.finishOrderFlag == '1') {
				delCartGods(goodsIds);
				window.location.href="/mobilerack/complete.html?shopId="+shopId+"&orderId="+data.orderId;
			} else {
				payOrder(data.orderId)
			}
			
		});
	}
	function payOrder(orderId) {
			ajax.post(api.baseServerUrl + "/shelvesOrder/openAuthority/payShelvesOrder",{
				"orderId":orderId,"url":encodeURI(location.href.split('#')[0].replace(/&/g,"|"))	
			},function(data) {
				wx.config({
					debug: false,
					appId: data[0].appid,
					timestamp: data[0].timeStamp,
					nonceStr: data[0].nonceStr,
					signature: data[0].signature,
					jsApiList: ['chooseWXPay','scanQRCode']
				});
				wx.ready(function () {
					wx.chooseWXPay({
						timestamp: data[1].timeStamp , 
						nonceStr: data[1].nonceStr, 
						package: data[1].packageWithPrepayId , 
						signType: data[1].signType, 
						paySign: data[1].paySign, 
						success: function (res) {
							confirmOrder(orderId)
						},
					    cancel: function () { 
					        cancelOrder(orderId);
					    }
					});
				})			
			})
		}
	function confirmOrder(orderId){
			ajax.post(api.baseServerUrl + "/shelvesOrder/openAuthority/confirmShelvesOrder",{
				"orderId":orderId	
			},function(data) {
				delCartGods(goodsIds);
				window.location.href="/mobilerack/complete.html?shopId="+shopId+"&orderId="+orderId;
			})
		}
	
	function cancelOrder(orderId){
		ajax.post(api.baseServerUrl + "/shelvesOrder/openAuthority/cancelShelvesOrder",{
			"orderId":orderId	
		},function(data) {
		},function(data){
			
		})
	}
	
	
	function delCartGods(ids){
		var idArr = new Array();
		idArr = ids.split(",");
		var carHelper = new CartHelper();
		for(var i=0;i<idArr.length;i++){
			carHelper.Del(idArr[i]);
		}
	}
	//信纸
	
	function date(){
	   var mydate = new Date();
	   var str = "" + mydate.getFullYear() + "年";
	   str += (mydate.getMonth()+1) + "月";
	   str += mydate.getDate() + "日";
	   return str;
	}
	
	/*var title="更好甄选—更好·不贵"
	var doc="种草全世界的好货"
	shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),title,doc,"http://" + document.domain + "/index.html","http://" + document.domain +"/imgs/shouye-share.png");*/
})(goola.api,goola.util,goola.ajax,goola.address);
});
