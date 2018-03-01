(function(api, util, ajax){
	
	var userCouponIds;
	var theAddressId=getCookie('addressId');
	var slogan;
	var price;
	var goodsId = util.getUrlParams("goodsId");
	var buyCount=util.getUrlParams("buyCount");
	var activityId=util.getUrlParams("activityId");
	var choosedSendTime=util.getUrlParams("choosedSendTime");
	var tuan=util.getUrlParams("tuan")
	var childrenGoodsIds = util.getUrlParams("goolasId")
	var usePoints;
	var crowdfundingPrice;
	var id=util.getUrlParams("id")
	var theAddressId=getCookie('addressId');
	var orderType=1;
	var identityCard,foreignOrder
	if(activityId!=undefined&& activityId!=null && activityId!=''){
		orderType=7
		var activityType=2
	}


	ajax.post(api.baseServerUrl + "/goods/findGoods", {
        "goodsId": goodsId,
        "lat": getCookie('lat'),
        "lng": getCookie('lng'),
        "locationType": 1
    }, function(response) {
		if(response.goods.repertoryTotalNum < 1 || !response.goods.repertoryTotalNum || response.goods.repertoryTotalNum < buyCount){
			//库存不足弹出提示
			layer.open({
				content: '库存不足，请稍后购买',
				btn: ['提醒补货', '稍后购买'],
				shadeClose: false,
				yes: function(index){
					window.location.href = "/shangpin/shangpinxiangqing.html?goodsId=" + goodsId
				},
				no: function(){
					window.location.href = "/shangpin/shangpinxiangqing.html?goodsId=" + goodsId
				}
			});
		}
	})

	
	var buyGoodsJson = new Array();
	var obj = new Object();
		obj.buyCount = buyCount;
		obj.goodsId = goodsId;
		if(childrenGoodsIds!=undefined && childrenGoodsIds!=null && childrenGoodsIds!=''){
			obj.childrenGoodsIds = childrenGoodsIds
		}
		if(activityId!=undefined&& activityId!=null && activityId!=''){
			obj.activityId=activityId
			obj.choosedSendTime=choosedSendTime
			obj.activityType=2
		}
		
		buyGoodsJson[0] = obj;
		buyGoodsJson=JSON.stringify(buyGoodsJson)
	
		getAddressInfo(theAddressId,goodsId)









	//showShoppingList(theAddressId)
	function showShoppingList(addressId){
		ajax.post(api.baseServerUrl + "/order/prepareOrder",{
			"addressId":addressId,"buyGoodsJson":buyGoodsJson,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1,"orderType":orderType,
		},function(data) {
			util.render("#shoppingListTmpl", data.goods, "#shoppingList");
			util.render("#dis-goods", data.goods, ".dis-goods");
			
			$('.commodity ul').each(function(){
				if($(this).find('li').length==0){
					$(this).parent().remove()
				}
			})
			foreignOrder=data.foreignOrder
			if(foreignOrder==1 && $('.card').html()=='' ){
				$('.idcard').show()
			}else if(foreignOrder==1 && $('.card').length<=0){
				$('.idcard').show()
			}else{
				$('.idcard').hide()
			}
			if(foreignOrder!=1){
				$('.card').hide()
			}
			if($('.dis-goods-ul').html()==''){
				$('.dis-title').hide()
			}
			if(choosedSendTime!=undefined && choosedSendTime!=null && choosedSendTime!=''){
				$('.time-select').html(choosedSendTime)
			}
			$('.pointsMoneyValue span').html("¥"+data.pointsMoneyValue)
			/*if(!isNaN(data.carriage)){
				$('.goodsPrice').html('¥ '+(data.orderPrice-data.carriage).toFixed(2))
			}*/
			//getAddressInfo(theAddressId,goodsId);
			var PreferentialPrice = 0
			data.goods.forEach(function(item){
				item.goodsList.forEach(function(it){
					if(it.activityType == 6){
						PreferentialPrice += it.activityPreferentialPrice
					}
				})
			})
			$(".fullReduce a").html("减"+ PreferentialPrice +"元")
			PreferentialPrice == 0 && $(".fullReduce").hide()
		});
		getusablecoupon(buyGoodsJson);
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
			util.render("#couponCountTmpl", "0 张可用","#couponCount");
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
		
		caculateOrderPrice(theAddressId, userCouponIds, buyGoodsJson,usePoints,orderType);
		couponPrice=s
	})
	
	
	
	
	function caculateOrderPrice(addressId, couponId, buyGoodsJson,usePoints,orderType) {
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
	}
		
		
	//获取地址
	function getAddressInfo(addressId,goodsId) {
		ajax.post(api.baseServerUrl + "/addr/queryUserAddressById",{
			"addressId":addressId,"goodsIds":goodsId
		},function(data) {
			util.render("#addressInfoTmpl", data,"#addressInfo");
			if (data && data.isUse==1) {
				theAddressId = data.addressId;
			}else{
				theAddressId = undefined;
			}
			if(data &&data.card!='' && data.card!=undefined && data.card!=null){
				identityCard=data.card
				$('.idcard').hide()
			}else{
				identityCard=''
				$('.idcard').show()
			}
			
			showShoppingList(theAddressId)
			caculateOrderPrice(theAddressId, userCouponIds, buyGoodsJson,usePoints,orderType);
		},function(returnData) {
		});
	}
	$("#addressInfo").click(function(){
		
		setCookie('addGoodsIds',goodsId)
		$('.app-top').hide()
		$('.app-content').css('margin-top','0')
		$(".balance").hide();
		$('.bottom').hide()
		setCookie("loadUrlParam","type=1");
		$('#selectAddressList').load("/address/dizhiguanli.html #xuanzedizhi",null,function(){
			//选择地址
			$('.guanlidizhi .fanhui').show()
			$('.address').delegate('.address-info','click',function(){
				$('#page2').show();
				$(".balance").show()
				$('.app-top').show()
				$('.bottom').show()
				$('.app-content').css('margin-top','1.25rem')
				$('#selectAddressList').html("");
				getAddressInfo($(this).parent().attr("id"),goodsId);
			})
			$('.guanlidizhi #fanhui').click(function(){
				$('#page2').show();
				$(".balance").show()
				$('.app-top').show()
				$('.bottom').show()
				$('.app-content').css('margin-top','1.25rem')
				$('#selectAddressList').html("");
				$('#dimCityQuery').remove()
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
			
			 
			 $('#addressDiv').hide()
			 $('.dis-address').show()
			 $('#di-address').show()
			 //获取地址列表  
			 address()
			 function address(){
			 	ajax.post(api.baseServerUrl + "/addr/querySelectByUserId",{
					"goodsIds":goodsId
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
		});

	})
	
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
			caculateOrderPrice(theAddressId, userCouponIds, buyGoodsJson,points,orderType);
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
		var s=(Number($('.integral-choice input').val()))/pointsMoneyRate
		if($('.integral-choice input').val()==''){
			s=($('.integral-choice input').attr('placeholder'))/pointsMoneyRate
		}
		if(s.toString().indexOf('.')>0){
			s=Number(s.toString().substring(0,s.toString().indexOf('.')+3))
		}
		$('.integral-choice span').html("抵现：¥"+s)
	})*/
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
		caculateOrderPrice(theAddressId, userCouponIds, buyGoodsJson,usePoints,orderType);
		
		/*if(price-usePoints/pointsMoneyRate<0){
			$('.balance-total span').html("¥"+(0).toFixed(2))
		}else{
			$('.balance-total span').html("¥"+(price-usePoints/pointsMoneyRate).toFixed(2))
		}
		$('.jifen a').html('<p>抵用金额  ¥'+(usePoints/pointsMoneyRate).toFixed(2)+'</p>')*/
		
		ajax.post(api.baseServerUrl + "/distribution/checkUserPointsUse",{
			"usePoints":usePoints,"orderPrice":undefined
		},function(data) {
			var pointsMoneyValue=Number((data.pointsMoneyValue).toString().substring(0,(data.pointsMoneyValue).toString().indexOf('.')+3))
			pointsPrice=pointsMoneyValue
			
		});
	})
	//取消使用积分
	/*$('.integral-cancle').click(function(){
		$("#integral").hide();
		$('.bg').hide()
		document.body.ontouchmove=function(){
				return true;
		}
	})*/
	
	$('.bottom').click(function(){
		slogan=$('.crowdfunding input').val()
		
		if($('.crowdfunding input').val()==''){
			slogan=$('.crowdfunding input').attr('placeholder')
		}
		if(!(/[\u4E00-\u9FA5]{0,30}/.test(slogan))){
    		alert("最多输入"+30+"个字");
    		return false
    	}
		if(!(/[a-zA-Z]{0,60}/.test(slogan))){
    		alert("最多输入"+60+"个字母");
    		return false
    	}
		
		if(activityId!=undefined&& activityId!=null && activityId!=''){
			ordering1()
		}else{
			ordering()
		}
		
	})
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
		if(foreignOrder==1 && identityCard==''){
			identityCard=$('.idcode input').val()
			if(!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(identityCard))){
				alert('身份证号输入错误');
				identityCard=''
				return false;
			}
		}
		
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
		
		ajax.post(api.baseServerUrl + "/order/createOrder",{
			"orderType":1,"addressId":theAddressId, "userCouponIds":userCouponIds,"usePoints":usePoints,
			"buyGoodsJson":createGoodsInfo,"buyerMessages":JSON.stringify(buyMessage),
			"choosedSendTime":choosedSendTime,
			"currentLat":getCookie("firstLat"),"currentLng":getCookie("firstLng"),"locationType":1,
			"identityCard":identityCard
		},function(data) {
			
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
	function ordering1(){
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
			obj1.choosedSendTime=choosedSendTime
			obj1.planType=$(this).attr('planType')
			obj1.planDay=$(this).attr('planDay')
			obj1.singleSendCount=$(this).attr('singleSendCount')
			obj1.activityId=activityId
			obj1.activityType=activityType
			obj2=JSON.stringify(obj1)+','+obj2
		})
			obj2=obj2.substring(0,obj2.length-1)
		
		var createGoodsInfo='['+obj2+']'	
		//console.log(createGoodsInfo)
		if(foreignOrder==1 && identityCard==''){
			identityCard=$('.idcode input').val()
			if(!(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(identityCard))){
				alert('身份证号输入错误');
				identityCard=''
				return false;
			}
		}
		ajax.post(api.baseServerUrl + "/order/createOrder",{
			"orderType":7,"addressId":theAddressId, "userCouponIds":userCouponIds,"usePoints":usePoints,
			"buyGoodsJson":createGoodsInfo,"buyerMessages":JSON.stringify(buyMessage),
			"currentLat":getCookie("firstLat"),"currentLng":getCookie("firstLng"),"locationType":1,
			"identityCard":identityCard
		},function(data) {
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
	$('#shoppingList').delegate('.selectTime','click',function(){
		
		var latestDeliveryDate
		$(".balance").hide();
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
		$('#selectTime').load("../order/choice-time.html",null,function(){
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
					//goodsInfo=goodsInfo1
					$('#time-select').html(choosedSendTime)
					$('#time-select').parent().parent().parent().find('li').attr('choosedSendTime',choosedSendTime)
					$('#time-select').parent().parent().parent().find('li').removeAttr('planType')
					$('#time-select').parent().parent().parent().find('li').removeAttr('planDay')
					$('#time-select').parent().parent().parent().find('li').removeAttr('singleSendCount')
					$('#selectTime').html('')
					$("#page2").show();
					$('.balance').show()
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
						$("#page2").show()
						$('.balance').show()
					});
					
				}
			})
			
		});
	})
	
	
})(goola.api, goola.util, goola.ajax);