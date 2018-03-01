
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
$(function() {	
(function(api,util,ajax,address){
	showCart();//展示购物车物品
	
	$("#total").delegate('.payment','click',function(){
		if (goodsIds == ",") {
			alert("请选择需要购买的商品！");
			return;
		}
		$("#gwc").hide();
		$('.gifts').hide();
		$('.address').show()
		$('.selectTime').show()
		$("#page2").show();
		$('.app-top').hide()
		$('.app-content').css('margin-top',0)
		orderType=1;
		showShoppingList(theAddressId,getCookie('lat'),getCookie('lng'));
		$('.balance-total').hide()
		$('.bottom').html('<div class="balance-total"></div><a class="bottom-one"><p>去结算</p></a>')
	})
	
	
	
	
	$('.gifts-top span').click(function(){
		$('.gifts-top span').removeClass('gifts-checked')
		$(this).addClass('gifts-checked')
		var giftTypeId=$(this).attr('id')
		gift(giftTypeId)
		
	})
	$(".bottom").delegate('.bottom-two','click',function(){
		ordering2()
	})
	
	//展示购物车
	function showCart(){
		var carHelper = new CartHelper();
		var car = carHelper.Read();
		var result = '';
		var items = car.Items;
		if(items.length == 0){
			$("#fullCart_4").show();
			$("#fullCart_1").hide();
			$('#total').hide()
		}else{
			var buyGoodsJson = new Array();
			for(var i=0;i<items.length;i++){
				var obj = new Object();
				obj.buyCount = items[i].GoodsCount;
				obj.goodsId = items[i].GoodsId;
				buyGoodsJson[i] = obj;
				goodsIds = goodsIds + items[i].GoodsId + ",";
			}
			ajax.post(api.baseServerUrl + "/distributionSellTeamOrder/shopCarDetail",{
				"buyGoodsJson":JSON.stringify(buyGoodsJson)
			},function(data) {
				cartGoods = data.goods;
				util.render("#cartTmpl", cartGoods,"#fullCart_1");
				selectChecked()
				util.render("#totalTmpl",data,".total");
				$('#fullCart_1').delegate('.goodsmessage','click',function(){
					window.location.href="../../shangpin/shangpinxiangqing.html?goodsId="+$(this).parent().attr('id')
				})
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
		$("#totalPrice_2").html(selPrice.toFixed(2)+" 元");
		$("#save").html((oriPrice-selPrice).toFixed(2));
		$('#selectedTotal').html('<span id="goodsCount">'+count+'</span>')
		isBatchOrder=2
	}
	/**
	 * 确认订单页面
	 */
	
	$('#fanhui').click(function(){
		$('#page2').hide()
		$('#gwc').show()
		$('.yulan').hide()
		$('.bottom').css('background','#fa2f3e')
		$('.app-top').show()
		$('.app-content').css('margin-top','1.25rem')
	})
	$('#fanhui-address').click(function(){
		$('#address-choice-show').hide()
		$('.bg').hide()
	})
	//展示购物清单
	
	function showShoppingList(addressId,prepareLat,prepareLng){
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
		ajax.post(api.baseServerUrl + "/distributionSellTeamOrder/prepareOrder",{
			"addressId":addressId,"buyGoodsJson":goodsInfo,"lat":prepareLat,"lng":prepareLng,"locationType":1,"orderType":orderType
		},function(data) {
			util.render("#shoppingListTmpl", data.goods, "#shoppingList");
			util.render("#dis-goods", data.goods, ".dis-goods");
			if($('.dis-goods-ul').html()==''){
				$('.dis-title').hide()
			}
			var pointsMoneyValue=Number((data.pointsMoneyValue).toString().substring(0,(data.pointsMoneyValue).toString().indexOf('.')+3))
			$('.pointsMoneyValue span').html("¥"+pointsMoneyValue)
			addressInfoFunc(theAddressId);
		});
		
		
	}
	
	
	
	
	//点击选择使用积分
	$(".jifen").click(function(){
		var num = $(".jifen p span").html().split("¥")[1];
		if(Number(num) < 1){
			$('.bg').show()
			$('#alert').show()
			return;
		}
		$("#integral").show();
		$('.bg').show()
		document.body.ontouchmove=function(){
				return false;
		}
		var orderPrice=$('.balance-total span').html().split('¥')[1]
		ajax.post(api.baseServerUrl + "/distribution/checkUserPointsUse",{
			"usePoints":undefined,"orderPrice":orderPrice
		},function(data) {
			pointsMoneyRate=data.pointsMoneyRate
			var pointsMoneyValue=Number((data.pointsMoneyValue).toString().substring(0,(data.pointsMoneyValue).toString().indexOf('.')+3))
			$('.integral-choice input').attr("placeholder",data.usePoints)
			if($('.integral-choice input').val()==''){
				$('.integral-choice span').html('抵现：¥'+pointsMoneyValue)
			}
		});

	});
	$('.closealert').click(function(){
		$('.bg').hide()
		$('#alert').hide()
		document.body.ontouchmove=function(){
				return true;
		}
	})
	$('.integral-choice input').bind('input propertychange', function(){
		if(Number($(this).val())>Number($(this).attr('placeholder'))){
			$('.integral-choice p').css('display','block')
			$('.integral-config').css('color','#9e9e9e')
			return
		}else{
			$('.integral-choice p').css('display','none')
			$('.integral-config').css('color','#1b1b1b')
		}
		var s=($('.integral-choice input').val())/pointsMoneyRate
		if($('.integral-choice input').val()==''){
			s=($('.integral-choice input').attr('placeholder'))/pointsMoneyRate
		}
		if(s.toString().indexOf('.')>0){
			s=Number(s.toString().substring(0,s.toString().indexOf('.')+3))
		}
		$('.integral-choice span').html("抵现：¥"+s)
	})
	//确认使用积分
	$('.integral-config').click(function(){
		if($('.integral-choice p').css('display')=='block'){
			return
		}
		usePoints=$('.integral-choice input').val()
		
		$("#integral").hide();
		$('.bg').hide()
		document.body.ontouchmove=function(){
				return true;
		}
		if(usePoints==''){
			usePoints=$('.integral-choice input').attr('placeholder')
		}
		caculateOrderPrice(theAddressId, userCouponIds, goodsInfo,usePoints,orderType);
		
		ajax.post(api.baseServerUrl + "/distribution/checkUserPointsUse",{
			"usePoints":usePoints,"orderPrice":undefined
		},function(data) {
			if((data.pointsMoneyValue).toString().indexOf('.')>0){
				var pointsMoneyValue=Number((data.pointsMoneyValue).toString().substring(0,(data.pointsMoneyValue).toString().indexOf('.')+3))	
			}else{
				var pointsMoneyValue=Number((data.pointsMoneyValue).toString())
			}
			
			pointsPrice=pointsMoneyValue

		});
	})
	//取消使用积分
	$('.integral-cancle').click(function(){
		$("#integral").hide();
		$('.bg').hide()
		document.body.ontouchmove=function(){
				return true;
		}
	})
	
	addressInfoFunc = function getAddressInfo(addressId) {
		var addGoodsIds='';
		 $('.goodsId').each(function(){
		 	addGoodsIds=addGoodsIds+$(this).attr('id')+','
		 })
		addGoodsIds=addGoodsIds.substring(0,addGoodsIds.length-1) 
		ajax.post(api.baseServerUrl + "/addr/queryUserAddressById",{
			addressId:addressId,"goodsIds":addGoodsIds
		},function(data) {
			util.render("#addressInfoTmpl", data,"#addressInfo");
			if (data && data.isUse==1) {
				theAddressId = data.addressId;
			}else{
				theAddressId = undefined;
			}
			caculateOrderPrice(theAddressId, userCouponIds, goodsInfo,usePoints,orderType);
		},function(returnData) {
		});
	}
	
	function caculateOrderPrice(addressId, couponId, buyGoodsJson,usePoints,orderType) {
		var obj2=""
		var obj1={}
		$('#shoppingList').find('li').each(function(){
			obj1.goodsId=$(this).attr('id')
			obj1.buyCount=$(this).find('.goodsCount').text()
			obj2=JSON.stringify(obj1)+','+obj2
		})
		obj2=obj2.substring(0,obj2.length-1)
		
		var createGoodsInfo='['+obj2+']'
		if(createGoodsInfo!='[]'){
			ajax.post(api.baseServerUrl + "/distributionSellTeamOrder/coculateOrderPrice",{
				"addressId":addressId, "userCouponIds":couponId, "buyGoodsJson":createGoodsInfo,
				"usePoints":usePoints,"orderType":orderType,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
			},function(data) {
				util.render("#tmsTmpl", data.carriage, "#tms");
				if(usePoints!=undefined){
					$('.jifen a').html('<p>抵用金额  ¥'+pointsPrice+'</p>')
				}
				util.render("#orderPriceTmpl", {count:data.count,price:data.orderPrice}, ".balance-total");
			});
		}else{
			if(usePoints!=undefined){
					$('.jifen a').html('<p>抵用金额  ¥'+0+'</p>')
				}
			util.render("#orderPriceTmpl", {count:0,price:0}, ".balance-total");
		}
		
	}
	
	//选择地址
	$("#addressInfo").click(function(){
		$("#page2").hide();
		setCookie("loadUrlParam","type=1");
		$('#selectAddressList').load("/address/dizhiguanli.html #xuanzedizhi",null,function(){
			//选择地址
			console.log('a')
			$('.guanlidizhi .fanhui').show()
			$('.address').delegate('.address-info','click',function(){
				$('#page2').show()
				$('#selectAddressList').html("");
				theAddressId=$(this).parent().attr("id")
				//addressInfoFunc($(this).parent().attr("id"));
				AMap.convertFrom(
						[$(this).parent().attr('lng'),$(this).parent().attr('lat')],
						'baidu',
						function(status,result){
							showShoppingList(theAddressId,result.locations[0].lat,result.locations[0].lng)
							setCookie('lat',result.locations[0].lat)
				   			setCookie('lng',result.locations[0].lng)
				   			
						}
					)
				setCookie('refresh','true',2/24/60)
				setCookie('adr',$(this).find('.address1').text())
				setCookie('addressId',theAddressId)
			})
			$('.guanlidizhi #fanhui').click(function(){
				$('#page2').show();
				$('#selectAddressList').html("");
				$('#dimCityQuery').remove()
				addressInfoFunc(theAddressId)
			})
			
			$('#xuanzedizhi').append('<script type="text/javascript" src="/lib/fastclick.js"  ></script>\
									<script type="text/javascript" src="/js/init-fastclick.js"  ></script>\
									<script type="text/javascript" src="/js/address/public.js" ></script>\
									<script type="text/javascript" src="/js/address/jquery.actionsheet-1.0.js"></script>\
								    <script type="text/javascript" src="/js/address/mobiscroll.scroller.zh-min.js"></script>\
									<script type="text/javascript" src="/js/address/queryAllProvinces.js"></script>\
									<script type="text/javascript" src="/js/address/queryCities.js"></script>\
									<script type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=b4ad70349fb06a421c2840238dc61b29&plugin=AMap.Autocomplete"></script>\
									<script src="/js/address/shopAddress.js"></script>')
			 var addGoodsIds='';
			 $('.goodsId').each(function(){
			 	addGoodsIds=addGoodsIds+$(this).attr('id')+','
			 })
			 addGoodsIds=addGoodsIds.substring(0,addGoodsIds.length-1)
			 setCookie('addGoodsIds',addGoodsIds)
			 $('#addressDiv').hide()
			 $('.dis-address').show()
			 $('#di-address').show()
			 //获取地址列表  
			 address()
			 function address(){
			 	ajax.post(api.baseServerUrl + "/addr/querySelectByUserId",{
					"goodsIds":addGoodsIds
				},function(data) {
					addressList = data.rows;
					$('.dis-address').show()
					util.render("#nodis-addressList", data.rows, "#di-address");
					util.render("#dis-addressList", data.rows, ".dis-address");
					if($('#dis-address').html()==''){
						$('.dis-address-title').hide()
					}
				});
			 }
			 //保存地址	
		});

	})
	
	$(".bottom").delegate('.bottom-one','click',function(){
		ordering();
	})
	
	//结算
	function ordering(){
		if (!theAddressId) {
			alert("请选择收货地址！");
			return;
		}
		var buyMessage = new Array();
		
		$('.message').each(function(i) {
			var obj = new Object();
			obj.providerId = $(this).find('p').text();
			obj.message = $(this).find('input').val();
			buyMessage[i] = obj;
		})
		var obj2=""
		var obj1={}
		var itemss=$('#shoppingList').find('li')
		itemss.each(function(){
			obj1.goodsId=$(this).attr('id')
			obj1.buyCount=$(this).find('.goodsCount').text()
			obj1.orgDeliverType=$(this).attr('orgDeliverType')
			obj1.isBatchOrder=$(this).attr('isBatchOrder')
			obj1.choosedSendTime=$(this).attr('choosedSendTime')
			obj1.planType=$(this).attr('planType')
			obj1.planDay=$(this).attr('planDay')
			obj1.singleSendCount=$(this).attr('singleSendCount')
			obj2=JSON.stringify(obj1)+','+obj2
		})
			obj2=obj2.substring(0,obj2.length-1)
		
		var createGoodsInfo='['+obj2+']'	
		if(createGoodsInfo=='[]'){
			alert("该地址没有可购买商品！");
			return;
		}
		ajax.post(api.baseServerUrl + "/distributionSellTeamOrder/createOrder",{
			"orderType":1,"addressId":theAddressId, "userCouponIds":userCouponIds,"usePoints":usePoints,
			"buyGoodsJson":createGoodsInfo,"buyerMessages":JSON.stringify(buyMessage),
			"isBatchOrder":isBatchOrder,"choosedSendTime":choosedSendTime,
			"currentLat":getCookie("firstLat"),"currentLng":getCookie("firstLng"),"locationType":1
		},function(data) {
			delCartGods(goodsIds);
			window._hmt && window._hmt.push(['_trackEvent','用户结算', 'click', '普通订单']);
			if(data.finishOrderFlag==1){
				window.location.href="/payment/community/zhifuchenggong.html?orderId=" + data.orderId+"&zhifutype=1&giftKey="+data.giftKey;
			}else{
				window.location.href="/payment/community/querenzhifu.html?orderId=" + data.orderId+"&price="+$('.balance-total span').html().split('¥')[1];
			}
		});
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
	
	
	
	
	
	
	
	var title="更好甄选—更好·不贵"
	var doc="种草全世界的好货"
	shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),title,doc,"http://" + document.domain + "/index.html","http://" + document.domain +"/imgs/shouye-share.png");
})(goola.api,goola.util,goola.ajax,goola.address);
});
