var delGoodsIds=new Array()
var goodsIds = ",",childrenGoodsIds='-';
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
var identityCard,foreignOrder
$(function() {	
(function(api,util,ajax,address){
	showCart();//展示购物车物品
	
	$("#total").delegate('.payment','click',function(){
		if (goodsIds == ",") {
			alert("请选择需要购买的商品！");
			return;
		}
		$("#yh").hide();
		$("#gwc").hide();
		$('.gifts').hide();
		$('.address').show()
		$('.idcard').show()
		$('.selectTime').show()
		$("#page2").show();
		$('.app-top').hide()
		$('.app-content').css('margin-top',0)
		orderType=1;
		showShoppingList(theAddressId,getCookie('lat'),getCookie('lng'));
		$('.balance-total').hide()
		$('.bottom').html('<div class="balance-total"></div><a class="bottom-one"><p>去结算</p></a>')
	})
	
	$("#total").delegate('.payment1','click',function(){
		if (goodsIds == ",") {
			alert("请选择需要购买的商品！");
			return;
		}
		/*$("#gwc").hide();
		$('.gifts').show()
		$('.bottom').css('background','#F1EDEE')
		gift($('.gifts-top').find('.gifts-checked').attr('id'))
		$('.address').hide()
		$("#page2").show("slow");
		$('.bottom').html('<p class="yulan">预览礼品卡</p><p class="bottom-two">去结算</p><div class="clear"></div>')*/
		
		orderType=4;
		showShoppingList1();
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
	function gift(giftTypeId){
		ajax.post(api.baseServerUrl + "/promotion/getGiftUrl",{
			"giftTypeId":giftTypeId
		},function(data) {
			giftUrl=data.giftTempletUrlDef
			$('.yulan').attr('id',"/giftcard/giftcard1.html")
			if($('#zhufu').val()==''){
				$('#zhufu').attr('placeholder',data.giftGreeDef)
			}
			if($('#name').val()==''){
				$('#name').attr('placeholder',data.giftNamePrefixDef)
			}
			//util.render("#gift-liuyan",data, ".gift-liuyan");
			
		});
	}
	$('.gift-process').click(function(){
		$("#page2").hide();
		$('#gift-process').load("/gift/gift-process.html",function(){
			$('#process').click(function(){
				setCookie("loadUrlParam","",0);
				$('#page2').show();
				$('#gift-process').html("");
				$('title').html('购物车')
			})
		});
	})
	
	$('.bottom').delegate('.yulan','click',function(){
				$("#page2").hide();
				$('#selectGiftcard').load("../../giftcard/giftcard1.html",function(){yulan()});
				$('title').html('预览礼品卡')
			})
	$('.bottom').delegate('b','click',function(){
		$('#page2').hide()
		$('#gwc').show()
		$('.yulan').hide()
		
		$('.app-top').show()
		$('.app-content').css('margin-top','1.25rem')
		
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
			$('#total').hide();
		}else{
			$("#yh").show();
			$(".gouwuche-bottom").show()
			var buyGoodsJson = new Array();
			for(var i=0;i<items.length;i++){
				var obj = new Object();
				obj.buyCount = items[i].GoodsCount;
				obj.goodsId = items[i].GoodsId;
				if(items[i].ChildrenGoodsIds!='' && items[i].ChildrenGoodsIds!=undefined && items[i].ChildrenGoodsIds!=null && items[i].ChildrenGoodsIds!='undefined'){
					obj.childrenGoodsIds = items[i].ChildrenGoodsIds
				}
				buyGoodsJson[i] = obj;
				goodsIds = goodsIds + items[i].GoodsId + ",";
				var delGoodsIdsObj=new Object()
				delGoodsIdsObj.goodsId=items[i].GoodsId
				delGoodsIdsObj.childrenGoodsIds=items[i].ChildrenGoodsIds
				delGoodsIds.push(delGoodsIdsObj)
			}
			delGoodsIds=JSON.stringify(delGoodsIds)
			ajax.post(api.baseServerUrl + "/order/shopCarDetail",{
				"buyGoodsJson":JSON.stringify(buyGoodsJson)
			},function(data) {
				cartGoods = data.goods;
				util.render("#cartTmpl", cartGoods,"#fullCart_1");
				util.render("#totalTmpl",data,".total");
				$('#fullCart_1').delegate('.goodsmessage','click',function(){
					window.location.href="/shangpin/shangpinxiangqing.html?goodsId="+$(this).parent().attr('id')
				})
				selectChecked()
			},function(data){
				alert(data.message)
				delCartGods(delGoodsIds)
				$("#fullCart_4").show();
				$("#fullCart_1").hide();
				$('#total').hide()
			});
			
		}
	}

	//数量减少
	function minus(id,childrenGoodsIds){
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
			$('.addminus').find("."+id+"c").each(function(){
				if($(this).attr('childrenGoodsIds')==childrenGoodsIds){
					cc=Number(cc)+Number($(this).html())
				}
			})
			updateProduct(id,cc,childrenGoodsIds);
			selectChecked();
		}
	}
	//数量增加
	function plus(id,childrenGoodsIds){
		
		if(Number(id) == 1769){
			alert("该商品每人限购一件！");
			return;
		}
		//原来数量
		var oldNum = $('.addplus').find("#"+id+"c").html();
		//增加后数量
		var newNum = parseInt(oldNum)+1;
		//库存数量
		var carHelper = new CartHelper();
		var car = carHelper.Read();
		var index = carHelper.Find(id,childrenGoodsIds);
        //将订单项的的数量替换
        var repertoryCount = car.Items[index].RepertoryCount;
		if(Number(repertoryCount) != -1 && Number(newNum) > Number(repertoryCount)){
			alert("超出库存范围");
			return;
		}else{
			$('.addplus').find("#"+id+"c").html(newNum);
			var cc=0
			$('.addplus').find("."+id+"c").each(function(){
				if($(this).attr('childrenGoodsIds')==childrenGoodsIds){
					cc=Number(cc)+Number($(this).html())
				}
			})
			updateProduct(id,cc,childrenGoodsIds);
			//计算选中商品价格
			selectChecked();
		}

	}


	//删除商品
	function delGoods(goodsId,childrenGoodsIds){
		
		if($('.adddelete').parent().find("li").length <= 1){
			$('.adddelete').parent().find('.gouwuche-title').remove();
		}
		$('.adddelete').find("#"+goodsId).parent().remove();
		if($('.adddelete').find("."+goodsId+"c").length>0){
			var cc=0
			$('.adddelete').find("."+goodsId+"c").each(function(){
				if($(this).attr('childrenGoodsIds')==childrenGoodsIds){
					cc=Number(cc)+Number($(this).html())
				}
			})
			if(cc==0){
				var carHelper = new CartHelper();
				carHelper.Del(goodsId,childrenGoodsIds)
			}else{
				updateProduct(goodsId,cc,childrenGoodsIds);
			}
		}else{
			var carHelper = new CartHelper();
			carHelper.Del(goodsId,childrenGoodsIds);
		}
		selectChecked()
		
		if ($(".one-goods").length == 0) {
			$("#fullCart_1").hide();
			$("#total").hide();
			$("#yh").hide()
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
				plus($(this).parent().parent().attr('id'),$(this).parent().parent().attr('childrengoodsids'))
			}
		}else{
			plus($(this).parent().parent().attr('id'),$(this).parent().parent().attr('childrengoodsids'))
		}
		
		
		
		
	})
	//数量减
	$('#cartInfo').delegate('.minus','click',function(){
		$('.body').find('.one-goods').removeClass('addminus')
		$('.body').find('.one-goods').removeClass('adddelete')
		$(this).parent().parent().addClass('addminus')
		$(this).parent().parent().addClass('adddelete')
		minus($(this).parent().parent().attr('id'),$(this).parent().parent().attr('childrengoodsids'))
	})
	//点击删除
	$('#cartInfo').delegate('.delete','click',function(){
		$('.body').find('.one-goods').removeClass('adddelete')
		$(this).parent().addClass('adddelete')
		$('#gwc .address-firm').show()
		$('.bg').show()
		$('#gwc .address-firm').attr('goodsId',$(this).parent().attr('id'))
		$('#gwc .address-firm').attr('childrengoodsids',$(this).parent().attr('childrengoodsids'))
		//delGoods($(this).parent().attr('id'))

	})
	$('#gwc .address-firm .cancelGoods').click(function(){
		$('#gwc .address-firm').hide()
		$('.bg').hide()
		$('#gwc .address-firm').removeAttr('goodsId')
		$('#gwc .address-firm').removeAttr('childrengoodsids')
	})
	$('#gwc .address-firm .deleteGoods').click(function(){
		$('#gwc .address-firm').hide()
		$('.bg').hide()
		delGoods($(this).parent().parent().attr('goodsId'),$(this).parent().parent().attr('childrengoodsids'))
		
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
	function updateProduct(goodsId,count,childrenGoodsIds){
		var carHelper = new CartHelper();
		carHelper.Change(goodsId, count,childrenGoodsIds);
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
		delGoodsIds=new Object()
		childrenGoodsIds="-"
		var goodsLists = []     //储存选中商品的商品信息    
		$('#cartInfo ul li').each(function() {
			var elem = $(this).find('.btn');
			if(elem.hasClass('checked')==true){
				goodsIds = goodsIds + elem.attr('id')+ ",";
				childrenGoodsIds=childrenGoodsIds + elem.attr('childrenGoodsIds')+ "-"
				delGoodsIds.goodsIds=elem.attr('id')
				delGoodsIds.childrenGoodsIds=elem.attr('childrenGoodsIds')
				var p = $(this).find("#"+elem.parent().attr('id')+"p").html();
				var c = $(this).find("#"+elem.parent().attr('id')+"c").html();
				var o = $(this).find("#"+elem.parent().attr('id')+"o").html();
				if(selPrice == 0){
					count=Number(c)
					selPrice = accMul(Number(p),Number(c));
					oriPrice = accMul(Number(o),Number(c))
				}else{
					count+=Number(c)
					selPrice += accMul(Number(p),Number(c));
					oriPrice += accMul(Number(o),Number(c))
				}
				goodsLists.push({
					goodsId: elem.attr('id'),
					buyCount: c,
					childrenGoodsIds: elem.attr('childrenGoodsIds') || "" 
				})
			}
		})
		ajax.post(api.baseServerUrl + "/order/shopCarDetail",{
			"buyGoodsJson":JSON.stringify(goodsLists)
		},function(data) {
			var PreferentialPrice = 0;
			data.goods.forEach(function(item){
				item.goodsList.forEach(function(it){
					if(it.activityType == 6){
						PreferentialPrice += it.activityPreferentialPrice
					}
				})
			})
			$("#yh span").html(PreferentialPrice)
			$("#totalPrice_2").html((selPrice-PreferentialPrice).toFixed(2)+" 元");
			$(".fullReduce a").html("减" + PreferentialPrice + "元");
			PreferentialPrice == 0 ? $("#yh").add($(".fullReduce")).hide() : $("#yh").add($(".fullReduce")).show();
		})
		showCartStatus()
				//显示优惠价
			//显示优惠后的总价
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
		delGoodsIds=new Array()
		var t = 0;
		$('#cartInfo ul li').each(function() {
			var elem = $(this).find('.btn');
			if(elem.hasClass('checked')==true){
				var obj = new Object();
				obj.buyCount = elem.parent().find('.count-input').html();
				obj.goodsId = elem.attr('id');
				if(elem.attr('childrenGoodsIds')!='' && elem.attr('childrenGoodsIds')!=undefined && elem.attr('childrenGoodsIds')!=null ){
					obj.childrenGoodsIds = elem.attr('childrenGoodsIds')
				}
				goodsInfo[t] = obj;
				var delGoodsIdsObj=new Object()
				delGoodsIdsObj.goodsId=elem.attr('id')
				delGoodsIdsObj.childrenGoodsIds=elem.attr('childrenGoodsIds')
				delGoodsIds.push(delGoodsIdsObj)
				t ++;
			}
		})
		delGoodsIds=JSON.stringify(delGoodsIds)
		/*for(var i=0;i<items.length;i++){
			if(goodsIds.indexOf("," + items[i].GoodsId + ",") > -1 ){
				if(childrenGoodsIds.indexOf("-" + items[i].ChildrenGoodsIds + "-")> -1){
					var obj = new Object();
					obj.buyCount = items[i].GoodsCount;
					obj.goodsId = items[i].GoodsId;
					if(items[i].ChildrenGoodsIds!='' && items[i].ChildrenGoodsIds!=undefined && items[i].ChildrenGoodsIds!=null && items[i].ChildrenGoodsIds!='undefined'){
						obj.childrenGoodsIds = items[i].ChildrenGoodsIds
					}
					goodsInfo[t] = obj;
					t ++;
				}
			}
		}*/
		goodsInfo=JSON.stringify(goodsInfo)
		goodsInfo1=goodsInfo
		ajax.post(api.baseServerUrl + "/order/prepareOrder",{
			"addressId":addressId,"buyGoodsJson":goodsInfo,"lat":prepareLat,"lng":prepareLng,"locationType":1,"orderType":orderType
		},function(data) {
			util.render("#shoppingListTmpl", data.goods, "#shoppingList");
			util.render("#dis-goods", data.goods, ".dis-goods");
			$('.commodity ul').each(function(){
				if($(this).find('li').length==0){
					$(this).parent().remove()
				}
			})
			
			if($('.dis-goods').find('li').length==0){
				$('.dis-goods').remove()
			}
			
			foreignOrder=data.foreignOrder
			if(foreignOrder==1 && $('.card').html()==''){
				$('.idcard').show()
			}else{
				$('.idcard').hide()
			}
			if($('.dis-goods-ul').html()==''){
				$('.dis-title').hide()
			}
			$('.pointsMoneyValue span').html("¥"+data.pointsMoneyValue)
			addressInfoFunc(theAddressId);
		});
		getusablecoupon(goodsInfo);
		
	}
	function showShoppingList1(){
		selectChecked();
		var carHelper = new CartHelper();
		var car = carHelper.Read();
		var items = car.Items;	
		goodsInfo = new Array();
		delGoodsIds=new Array()
		var t = 0;
		$('#cartInfo ul li').each(function() {
			var elem = $(this).find('.btn');
			if(elem.hasClass('checked')==true){
				var obj = new Object();
				obj.buyCount = elem.parent().find('.count-input').html();
				obj.goodsId = elem.attr('id');
				if(elem.attr('childrenGoodsIds')!='' && elem.attr('childrenGoodsIds')!=undefined && elem.attr('childrenGoodsIds')!=null ){
					obj.childrenGoodsIds = elem.attr('childrenGoodsIds')
				}
				goodsInfo[t] = obj;
				var delGoodsIdsObj=new Object()
				delGoodsIdsObj.goodsId=elem.attr('id')
				delGoodsIdsObj.childrenGoodsIds=elem.attr('childrenGoodsIds')
				delGoodsIds.push(delGoodsIdsObj)
				t ++;
			}
		})
		delGoodsIds=JSON.stringify(delGoodsIds)
		goodsInfo=JSON.stringify(goodsInfo)
		goodsInfo1=goodsInfo
		ajax.post(api.baseServerUrl + "/order/prepareOrder",{
			"buyGoodsJson":goodsInfo,"orderType":orderType
		},function(data) {
			util.render("#shoppingListTmpl", data.goods, "#shoppingList");
			util.render("#dis-goods", data.goods, ".dis-goods");
			$('.commodity ul').each(function(){
				if($(this).find('li').length==0){
					$(this).parent().remove()
				}
			})
			if($('.dis-goods').find('li').length==0){
				$('.dis-goods').remove()
			}
			$('.selecttime').hide()
			$('.pointsMoneyValue span').html("¥"+data.pointsMoneyValue)
		});
		getusablecoupon(goodsInfo);
		theAddressId=undefined;
		caculateOrderPrice1(theAddressId, userCouponIds, goodsInfo,usePoints,orderType);
	}
		


	//获取可用优惠券
	function getusablecoupon(buyGoodsJson){
		ajax.post(api.baseServerUrl + "/promotion/queryUsableCouponList",{
			"buyGoodsJson":buyGoodsJson
		},function(data) {
			var info = data.length + "张可用";			
			if(userCouponIds!=undefined){
				$('.couponCountValue').html("¥"+couponPrice)
			}else{
				util.render("#couponCountTmpl", info,"#couponCount");
			}
			util.render("#couponInfoTmpl", data,"#couponInfo");
		},function(returnData) {
			util.render("#couponCountTmpl", "0张可用","#couponCount");
		});
	}
	
	//点击选择优惠券页面
	$("#couponCount").click(function(){
		var num = $("#couponCount a p").html().split("张")[0];
		if(Number(num) < 1){
			alert("您没有可用优惠券!");
			return;
		}
		$("#yhq").show();
		
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
		util.render("#couponCountTmpl", "¥" + s ,"#couponCount");
		caculateOrderPrice(theAddressId, userCouponIds, goodsInfo,usePoints,orderType);
		couponPrice=s
	})
	//点击选择使用积分
	$(".jifen").click(function(){
		/*var num = $(".jifen p span").html().split("¥")[1];
		if(Number(num) < 1){
			$('.bg').show()
			$('#alert').show()
			return;
		}
		$("#integral").show();
		$('.bg').show()
		document.body.ontouchmove=function(){
				return false;
		}*/
		
		
		var orderPrice=$('.balance-total span').html().split('¥')[1]
		
		ajax.post(api.baseServerUrl + "/distribution/checkUserPointsUse",{
			"usePoints":undefined,"orderPrice":orderPrice
		},function(data) {
			/*pointsMoneyRate=data.pointsMoneyRate
			var pointsMoneyValue=Number((data.pointsMoneyValue).toString().substring(0,(data.pointsMoneyValue).toString().indexOf('.')+3))
			$('.integral-choice input').attr("placeholder",data.usePoints)
			if($('.integral-choice input').val()==''){
				$('.integral-choice span').html('抵现：¥'+pointsMoneyValue)
			}*/
			var points
			if($(".jifen a").hasClass('check')){
				$(".jifen a").removeClass('check')
				points=undefined
				usePoints=0
			}else{
				$(".jifen a").addClass('check')
				points=data.usePoints
				usePoints=data.usePoints
			}
			caculateOrderPrice(theAddressId, userCouponIds, goodsInfo,points,orderType);
		});
		
		
	});
	$('.closealert').click(function(){
		$('.bg').hide()
		$('#alert').hide()
		document.body.ontouchmove=function(){
				return true;
		}
	})
	/*$('.integral-choice input').bind('input propertychange', function(){
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
	})*/
	//确认使用积分
	/*$('.integral-config').click(function(){
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
	})*/
	//取消使用积分
	/*$('.integral-cancle').click(function(){
		$("#integral").hide();
		$('.bg').hide()
		document.body.ontouchmove=function(){
				return true;
		}
	})*/
	
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
			if(foreignOrder!=1){
				$('.card').hide()
			}
			if(data.card!='' && data.card!=undefined && data.card!=null){
				identityCard=data.card
				$('.idcard').hide()
			}else{
				if(foreignOrder==1){
					identityCard=''
					$('.idcard').show()
				}else{
					identityCard=''
					$('.idcard').hide()
				}
				
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
			ajax.post(api.baseServerUrl + "/order/coculateOrderPrice",{
				"addressId":addressId, "userCouponIds":couponId, "buyGoodsJson":buyGoodsJson,
				"usePoints":usePoints,"orderType":orderType,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
			},function(data) {
				util.render("#tmsTmpl", data.carriage, "#tms");
				if(usePoints!=undefined){
					$(".jifen a").addClass('check')
					$('.jifen a').html('<img src="/imgs/payment/jiesuan2/icon2/207918759010222378.png"/>')
				}else{
					$(".jifen a").removeClass('check')
					$('.jifen a').html('<img src="/imgs/payment/jiesuan2/icon2/617871071494316514.png"/>')
				}
				util.render("#orderPriceTmpl", {count:data.count,price:data.orderPrice}, ".balance-total");
			});
		}else{
			if(usePoints!=undefined){
					$('.jifen a').html('<img src="/imgs/payment/jiesuan2/icon2/207918759010222378.png"/>')
				}else{
					$('.jifen a').html('<img src="/imgs/payment/jiesuan2/icon2/617871071494316514.png"/>')
				}
			util.render("#orderPriceTmpl", {count:0,price:0}, ".balance-total");
		}
		
	}
	function caculateOrderPrice1(addressId, couponId, buyGoodsJson,usePoints,orderType) {
		ajax.post(api.baseServerUrl + "/order/coculateOrderPrice",{
			"addressId":addressId, "userCouponIds":couponId, "buyGoodsJson":buyGoodsJson,
			"usePoints":usePoints,"orderType":orderType
		},function(data) {
			$("#gwc").hide();
			$('.gifts').show()
			gift($('.gifts-top').find('.gifts-checked').attr('id'))
			$('.address').hide()
			$('.idcard').hide()
			$('.selectTime').hide()
			$("#page2").show();
			$('.app-top').hide()
			$('.app-content').css('margin-top','0')
			$('.balance-total').show()
			ajax.post(api.baseServerUrl + "/giftOrder/cueGiftOperate",{	
			},function(data){
				
			},function(returndata){
				$('.bg').show()
				$('.giftopen').show()
			})
			$('.bottom').html('<b>返回</b><p class="yulan">预览礼品卡</p><p class="bottom-two">去结算</p><div class="clear"></div>')
			util.render("#tmsTmpl", data.carriage, "#tms");
			if(usePoints!=undefined){
					$(".jifen a").addClass('check')
					$('.jifen a').html('<img src="/imgs/payment/jiesuan2/icon2/207918759010222378.png"/>')
				}else{
					$(".jifen a").removeClass('check')
					$('.jifen a').html('<img src="/imgs/payment/jiesuan2/icon2/617871071494316514.png"/>')
				}
			util.render("#orderPriceTmpl", {count:count,price:data.orderPrice}, ".balance-total");
		});
	}
	//送礼弹窗
	
	$('.giftopen .giftopen-close').click(function(){
		if($('.giftopen-btn input').is(':checked')){
			ajax.post(api.baseServerUrl + "/giftOrder/OffGiftOperate",{	
			},function(data){
				
			})
		}
		$('.bg').hide()
		$('.giftopen').hide()
		
	})
	//选择地址
	$("#addressInfo").click(function(){
		$("#page2").hide();
		setCookie("loadUrlParam","type=1");
		$('#selectAddressList').load("/address/dizhiguanli.html #xuanzedizhi",null,function(){
			//选择地址
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
			
			$('#xuanzedizhi').append('<script type="text/javascript" src="../lib/fastclick.js"  ></script>\
									<script type="text/javascript" src="../js/init-fastclick.js"  ></script>\
									<script type="text/javascript" src="../js/address/public.js" ></script>\
									<script type="text/javascript" src="../js/address/jquery.actionsheet-1.0.js"></script>\
								    <script type="text/javascript" src="../js/address/mobiscroll.scroller.zh-min.js"></script>\
									<script type="text/javascript" src="../js/address/queryAllProvinces.js"></script>\
									<script type="text/javascript" src="../js/address/queryCities.js"></script>\
									<script type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=b4ad70349fb06a421c2840238dc61b29&plugin=AMap.Autocomplete"></script>\
									<script src="../js/address/shopAddress.js"></script>')
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
			obj1.parentComboGoodsId=$(this).attr('parentComboGoodsId')
			obj2=JSON.stringify(obj1)+','+obj2
		})
			obj2=obj2.substring(0,obj2.length-1)
		
		var createGoodsInfo='['+obj2+']'	
		if(createGoodsInfo=='[]'){
			layer.open({
				content: '库存不足，请稍后购买',
				btn: ['提醒补货', '稍后购买'],
				shadeClose: false,
				yes: function(index){
					window.location.href = "/gouwuche/gouwuche.html"
				},
				no: function(){
					window.location.href = "/gouwuche/gouwuche.html"
				}
			});
			return;
		}
		if(foreignOrder==1 && identityCard==''){
			identityCard=$('.idcode input').val()
			if(!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(identityCard))){
				alert('身份证号输入错误');
				identityCard=''
				return false;
			}
		}
		ajax.post(api.baseServerUrl + "/order/createOrder",{
			"orderType":1,"addressId":theAddressId, "userCouponIds":userCouponIds,"usePoints":usePoints,
			"buyGoodsJson":createGoodsInfo,"buyerMessages":JSON.stringify(buyMessage),
			"isBatchOrder":isBatchOrder,"choosedSendTime":choosedSendTime,
			"currentLat":getCookie("firstLat"),"currentLng":getCookie("firstLng"),"locationType":1,
			"identityCard":identityCard
		},function(data) {
			delCartGods(delGoodsIds);
			window._hmt && window._hmt.push(['_trackEvent','用户结算', 'click', '普通订单']);
			if(data.finishOrderFlag==1){
				window.location.href="../payment/zhifuchenggong.html?orderId=" + data.orderId+"&zhifutype=1&giftKey="+data.giftKey;
			}else{
				window.location.href="../payment/querenzhifu.html?orderId=" + data.orderId+"&price="+$('.balance-total span').html().split('¥')[1];
			}
		},function(data){
			alert(data.message)
			identityCard=''
		});
	}
	
	function ordering2(){
		var buyMessage = new Array();
		$('.message').each(function(i) {
			var obj = new Object();
			obj.providerId = $(this).find('p').text();
			obj.message = $(this).find('input').val();
			buyMessage[i] = obj;
		})
		var giftType=$('.gifts').find('.gifts-checked').attr('id')
		var giftGreet,giftPerson
		if($('.gifts').find('#zhufu').val()==''){
			giftGreet=$('.gifts').find('#zhufu').attr('placeholder')
		}else{
			giftGreet=$('.gifts').find('#zhufu').val()
		}
		if($('.gifts').find('#name').val()==''){
			giftPerson=$('.gifts').find('#name').attr('placeholder')
		}else{
			giftPerson=$('.gifts').find('#name').val()
		}
		ajax.post(api.baseServerUrl + "/order/createOrder",{
			"giftType":giftType,"giftGreet":giftGreet,"giftPerson":giftPerson,"giftUrl":giftUrl,
			"orderType":4,"userCouponIds":userCouponIds,"usePoints":usePoints, "buyGoodsJson":goodsInfo,
			"buyerMessages":JSON.stringify(buyMessage),"isBatchOrder":2,
			"currentLat":getCookie("firstLat"),"currentLng":getCookie("firstLng"),"locationType":1
		},function(data) {
			delCartGods(delGoodsIds);
			window._hmt && window._hmt.push(['_trackEvent','用户结算', 'click', '礼品订单']);
			if(data.finishOrderFlag==1){
				window.location.href="../payment/zhifuchenggong.html?orderId=" + data.orderId+"&zhifutype=4&giftKey="+data.giftKey;
			}else{
				window.location.href="../payment/querenzhifu.html?orderId=" + data.orderId;
			}
		},function(data){
			alert(data.message)
			identityCard=''
		});
	}
	
	function delCartGods(ids){
		var idArr=jQuery.parseJSON(ids)
		var carHelper = new CartHelper();
		for(var i=0;i<idArr.length;i++){
			carHelper.Del(idArr[i].goodsId,idArr[i].childrenGoodsIds);
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
	//预览礼品卡
	function yulan() {
		$('#fanhui2').show()
		if($('#zhufu').val()==''){
			$('#title').html($('#zhufu').attr('placeholder'))
		}else{
			$('#title').html($('#zhufu').val())
		}
		if($('#name').val()==''){
			$('#cards-name').html($('#name').attr('placeholder'))
		}else{
			$('#cards-name').html($('#name').val())
		}
		
		$('#date').html(date())
		$('#fanhui2').click(function(){
			setCookie("loadUrlParam","",0);
			$('#page2').show();
			$('#selectGiftcard').html("");
			$('title').html('购物车')
		})
	}
	
	//限制礼品卡输入字符长度
	function check(obj){
    	var value = $(obj).val();
    	var length = value.length;
    	//假设长度限制
    	/*if(length>num){
        		alert("最多输入"+num+"个字");	
    	}*/	 
    	if(/[\u4E00-\u9FA5]{24}/.test(value)){
    		alert("最多输入"+23+"个字");
    		$(obj).val(value.substr(0,23))
    	}else if(/[a-zA-Z]{47}/.test(value)){
    		alert("最多输入"+46+"个字母");
    		$(obj).val(value.substr(0,46))
    	}
	}
	 
	$('#name').bind('input propertychange', function(){
		check(this)
	})
	$('#zhufu').bind('input propertychange', function(){
		check(this)
	})
		var currYear = (new Date()).getFullYear();	
		var currMonth = (new Date()).getMonth()+1
		var currDay = (new Date()).getDate()
		if(currMonth<10){
			var currMonth = "0"+(currMonth); 
		}
		if(currDay<10){
			 currDay = "0"+currDay; 
		}
		var time=currYear+'-'+currMonth+'-'+currDay		
		//选择配送方式
		$('#shoppingList').delegate('.selectMode','click',function(){
			$("#page2").hide();
			$('#shoppingList').find('.mode-select').removeAttr('id')
			$(this).find('.mode-select').attr('id','mode-select')
			var modeObj=new Object()
			modeObj.orgAddress=$(this).parent().find('.business').attr('orgAddress')
			modeObj.orgPhone=$(this).parent().find('.business').attr('orgPhone')
			modeObj.orgOpenTime=$(this).parent().find('.business').attr('orgOpenTime')
			modeObj.carriage=$(this).parent().find('.business').attr('carriage')
			$('#selectMode').load('../../order/tmsTmpl.html',null,function(){
				$('.carriage').html('运费 ¥ '+modeObj.carriage+'')
				util.render("#ziti-content", modeObj, ".ziti-content");
				if(($('#mode-select').text().substring(0,4))=='站点配送'){
					$('.peisong a').show()
				}else{
					$('.ziti-title a').show()
				}
				$('.mode #fanhui').click(function(){
					$('#selectMode').html('')
					$("#page2").show();
				})
				$('.tms-check').click(function(){
					$('.tms-check a').hide()
					$(this).find('a').show()
					$('#mode-select').html($(this).find('b').text()+'&nbsp;'+$(this).find('b').next().text())
					$('#mode-select').parent().parent().parent().find('li').attr('orgDeliverType',$(this).attr('orgDeliverType'))
					$('#selectMode').html('')
					$("#page2").show();
				})
			})
		})
		
	$('#shoppingList').delegate('.selectTime','click',function(){
		var latestDeliveryDate
		$("#page2").hide();
		$('#shoppingList').find('.time-select').removeAttr("id")
		$(this).find('.time-select').attr('id','time-select')
		var stGoodsInfo=''
		var stItems={}
		$(this).parent().find('li').each(function(){
			stItems.goodsId=$(this).attr('id')
			stItems.buyCount=$(this).find('.goodsCount').text();
			stGoodsInfo=JSON.stringify(stItems)+','+stGoodsInfo
		})
		stGoodsInfo=stGoodsInfo.substring(0,stGoodsInfo.length-1)
		stGoodsInfo='['+stGoodsInfo+']'
		isBatchOrder=$(this).parent().find('ul').attr('isBatchOrder')
		goodsList=$(this).parent().find('ul').attr('goodsList')
		var sendTime=$(this).parent().find('ul').attr('choosedSendTime')
		if(sendTime!='' && sendTime!=undefined && sendTime!=null){
			time=$(this).parent().find('ul').attr('choosedSendTime')
		}
		$('#selectTime').load("../../order/choice-time.html",null,function(){
			if(isBatchOrder==2){
				$("#appDate").attr('value',time)
				$('.shijian').html(time)
				gouwuche()
				$('.time').find('#2').addClass('choice-btn')
				$('.time').find('#2').parent().parent().find('.show').show()
				$('.time').find('#1').removeClass('choice-btn')
				$('.time').find('#1').parent().parent().find('.show').hide()
			}else if(isBatchOrder==1){
				util.render("#content-list1", eval('(' + goodsList + ')'), ".choice-cycle");
				$('.time').find('#1').addClass('choice-btn')
				$('.time').find('#1').parent().parent().find('.show').show()
				$('.time').find('#2').removeClass('choice-btn')
				$('.time').find('#2').parent().parent().find('.show').hide()
				$("#appDate").attr('value',time)
				$('.shijian').html(time)
			}else{
				gouwuche()
				$("#appDate").attr('value',time)
				$('.shijian').html(time)
			}
			function gouwuche(){
				ajax.post(api.baseServerUrl + "/goods/queryGoodsByGoodsJson",{
					"buyGoodsJson":stGoodsInfo
				},function(data) {
					
					util.render("#content-list", data, ".choice-cycle");
				});
			}
			isBatchOrder=$('.choice-btn').attr('id')
			
			$('#appDate').change(function(){

				$('.shijian').html($(this).val())
			})
			$('.time').delegate('.btn','click',function(){
				$('.time .btn').removeClass('choice-btn').addClass('a')
				$(this).addClass('choice-btn').removeClass('a')
				$('.a').parent().parent().find('.show').slideUp()
				$(this).parent().parent().find('.show').slideDown()
				isBatchOrder=$(this).attr('id')
				
			})
			
			$('.time').delegate('.week a','click',function(){
				$(this).parent().next().slideToggle()
			})
			$('.time').delegate('.week-choice li','click',function(){
				$(this).parent().parent().parent().parent().find('.week').attr('planType','')
				$(this).parent().parent().css('display','none')
				$(this).parent().parent().parent().find('.week p').html($(this).html())
				if($(this).html()=="每月"){
					$(this).parent().parent().parent().find('.day').html('<input type="day" value="1"/>日')
					$(this).parent().parent().parent().parent().find('.day').attr('planDay',1)
					
				}else{
					$(this).parent().parent().parent().find('.day').html('<p>星期五</p><a></a>')
					$(this).parent().parent().parent().parent().find('.day').attr('planDay',6)
					
				}
				$(this).parent().parent().parent().parent().find('.week').attr('planType',$(this).attr('planType'))
				
			})
			$('.time').delegate('.day a','click',function(){
				$(this).parent().next().slideToggle()
			})
			$('.time').delegate('.day-choice li','click',function(){
				$(this).parent().parent().parent().parent().find('.day').attr('planDay','')
				$(this).parent().parent().css('display','none')
				$(this).parent().parent().parent().find('.day p').html($(this).html())
				$(this).parent().parent().parent().find('.day').addClass($(this).attr('id'))
				$(this).parent().parent().parent().parent().find('.day').attr('planDay',$(this).attr('planDay'))
			})
			$('.time').delegate('.day input','blur',function(){
				$(this).parent().parent().parent().find('.day').attr('planDay',$(this).val())
				if($(this).val()>31||$(this).val()==''||$(this).val()<=0){
					alert("请重新选择日期")
					$(this).val('1')
				}
			})
			$('.time').delegate('.cont-num input','blur',function(){
				if(Number($(this).parent().parent().find('.shuliang').html())/$(this).val()<1){
					alert('单次发货数量不得大于总数量')
					$(this).val('1')
				}
				var a=Number($(this).parent().parent().find('.shuliang').html())/$(this).val()
				if(parseInt(a)==a){	
					a=a
				}else{
					a=parseInt(a)+1
				}
				$(this).next().find('a').html(a)
				$(this).parent().parent().attr('singlesendcount',$(this).val())
			})
			$('.time #fanhui').click(function(){
				$('#selectTime').html('')
				$("#page2").show();
				isBatchOrder=2
			})
			$('.time-confirm').click(function(){
				$('#time-select').parent().parent().parent().find('ul').attr('isBatchOrder',isBatchOrder)
				$('#time-select').parent().parent().parent().find('li').attr('isBatchOrder',isBatchOrder)
				var arr=''
				$('.choice-cycle .shop1').each(function(){
					arr=$(this).find('.title p').html()+','+arr
				})
				arr=(arr.substring(0,arr.length-1)).split(',')
				function unique(arr) {
			      var result = [], hash = {};
				    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
				        if (!hash[elem]) {
				            result.push(elem);
				            hash[elem] = true;
				        }
				    }
				    return result;
			 	}
				if((isBatchOrder==1)&&(unique(arr).length>1)){
					alert("多供应商的商品订单不支持发货周期的制定")
					return false
				}
				if(isBatchOrder==2){
					choosedSendTime=$('#appDate').val()
					$('#time-select').parent().parent().parent().find('ul').attr('choosedSendTime',choosedSendTime)
					$('#time-select').parent().parent().parent().find('ul').removeAttr('goodsList')
					var arrDay=[]
					$('.content-list').find('.lis').each(function(){
						arrDay.push(($(this).attr('latestDate').split(' ')[0]).replace(/-/g,""))
					})
					latestDeliveryDate=Math.min.apply(null,arrDay)
					if(choosedSendTime.replace(/-/g,"")>latestDeliveryDate){
						alert('商品可支持的最晚发货时间为'+latestDeliveryDate+',请重新设置')
						return false
					}
					goodsInfo=goodsInfo1
					$('#time-select').html(choosedSendTime)
					$('#time-select').parent().parent().parent().find('li').attr('choosedSendTime',choosedSendTime)
					$('#time-select').parent().parent().parent().find('li').removeAttr('planType')
					$('#time-select').parent().parent().parent().find('li').removeAttr('planDay')
					$('#time-select').parent().parent().parent().find('li').removeAttr('singleSendCount')
					$('#selectTime').html('')
					$("#page2").show();
				}
				if(isBatchOrder==1){
					$('#time-select').html("去查看")
					choosedSendTime=""
					$('#time-select').parent().parent().parent().find('li').removeAttr('choosedSendTime')
					$('#time-select').parent().parent().parent().find('ul').removeAttr('choosedSendTime')
					goodsList=""
					var obj2=""
					var obj1={}
					var itemss=$('.content-list').find('.lis')
					/*itemss.each(function(){
						obj1.goodsId=$(this).attr('goodsId')
						obj1.buyCount=$(this).attr('buyCount')
						obj1.planType=$(this).find('.week').attr('planType')
						obj1.planDay=$(this).find('.day').attr('planDay')
						obj1.singleSendCount=$(this).attr('singleSendCount')
						obj2=JSON.stringify(obj1)+','+obj2
					})
						obj2=obj2.substring(0,obj2.length-1)
					
					goodsInfo='['+obj2+']'	*/
					
					
					var goodsList1={}
					itemss.each(function(){
						goodsList1.goodsId=$(this).attr('goodsId')
						goodsList1.buyCount=$(this).attr('buyCount')
						goodsList1.planType=$(this).find('.week').attr('planType')
						goodsList1.planDay=$(this).find('.day').attr('planDay')
						goodsList1.singleSendCount=$(this).attr('singleSendCount')
						goodsList1.goodsName=$(this).find('.goodsname').html()
						goodsList1.providerName=$(this).parent().find('.providername').html()
						goodsList1.zhouqishu=$(this).find('.zhouqishu').html()
						goodsList1.cycle=$(this).attr('cycle')
						goodsList1.latestDeliveryDate=$(this).attr('latestDate')
						goodsList1.isDeliveryPlan=$(this).attr('isDeliveryPlan')
						goodsList=JSON.stringify(goodsList1)+','+goodsList
						
						$('#shoppingList').find('#'+$(this).attr('goodsId')).attr('planType',$(this).find('.week').attr('planType'))
						$('#shoppingList').find('#'+$(this).attr('goodsId')).attr('planDay',$(this).find('.day').attr('planDay'))
						$('#shoppingList').find('#'+$(this).attr('goodsId')).attr('singleSendCount',$(this).attr('singleSendCount'))
					})
					
					goodsList=goodsList.substring(0,goodsList.length-1)
					goodsList='['+goodsList+']'	
					$('#time-select').parent().parent().parent().find('ul').attr('goodsList',goodsList)
					
					var checkGoods=''
					var checkGoods1={}
					$('.content-list').find('.lis1').each(function(){
						checkGoods1.goodsName=$(this).find('.goodsname').html()
						checkGoods1.buyCount=$(this).attr('buyCount')
						checkGoods1.singleSendCount=$(this).attr('singleSendCount')
						checkGoods1.planType=$(this).find('.week').attr('planType')
						checkGoods1.planDay=$(this).find('.day').attr('planDay')
						checkGoods1.latestDate=$(this).attr('latestDate').split(' ')[0]
						checkGoods=JSON.stringify(checkGoods1)+','+checkGoods
					})
					
					checkGoods=checkGoods.substring(0,checkGoods.length-1)
					checkGoods='['+checkGoods+']'	

					ajax.post(api.baseServerUrl + "/goods/checkGoodsLatestSend",{
						"buyGoodsJson":checkGoods
					},function(data) {
						$('#selectTime').html('')
						$("#page2").show();
					});
					
				}
			})
			
		});
	})
	
	
	
	var title="更好甄选—更好·不贵"
	var doc="种草全世界的好货"
	shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),title,doc,"http://" + document.domain + "/index.html","http://" + document.domain +"/imgs/shouye-share.png");
})(goola.api,goola.util,goola.ajax,goola.address);
});
