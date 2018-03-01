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
	var usePoints;
	var crowdfundingPrice;
	var id=util.getUrlParams("id")
	var theAddressId=getCookie('addressId');
	var orderType=1
	if(activityId!=undefined&& activityId!=null && activityId!=''){
		orderType=7
		var activityType=2
	}
	
	var buyGoodsJson = new Array();
	var obj = new Object();
		obj.buyCount = buyCount;
		obj.goodsId = goodsId;
		if(activityId!=undefined&& activityId!=null && activityId!=''){
			obj.activityId=activityId
			obj.choosedSendTime=choosedSendTime
			obj.activityType=2
		}
		
		buyGoodsJson[0] = obj;
		buyGoodsJson=JSON.stringify(buyGoodsJson)
	
	getAddressInfo(theAddressId,goodsId)
	

	
		//console.log(buyGoodsJson)
	//showShoppingList(theAddressId)
	function showShoppingList(addressId){
		ajax.post(api.baseServerUrl + "/distributionSellTeamOrder/prepareOrder",{
			"addressId":addressId,"buyGoodsJson":buyGoodsJson,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1,"orderType":orderType,
		},function(data) {
			util.render("#shoppingListTmpl", data.goods, "#shoppingList");
			util.render("#dis-goods", data.goods, ".dis-goods");
			if(choosedSendTime!=undefined && choosedSendTime!=null && choosedSendTime!=''){
				$('.time-select').html(choosedSendTime)
			}
			
			var pointsMoneyValue=Number((data.pointsMoneyValue).toString().substring(0,(data.pointsMoneyValue).toString().indexOf('.')+3))
			$('.pointsMoneyValue span').html("¥"+pointsMoneyValue)
			if(!isNaN(data.carriage)){
				$('.goodsPrice').html('¥ '+(data.orderPrice-data.carriage).toFixed(2))
			}
			//getAddressInfo(theAddressId,goodsId);
		});
		
		
	}
		
	
	
	
	
	
	function caculateOrderPrice(addressId,buyGoodsJson,usePoints,orderType) {
		ajax.post(api.baseServerUrl + "/distributionSellTeamOrder/coculateOrderPrice",{
			"addressId":addressId, "buyGoodsJson":buyGoodsJson,
			"usePoints":usePoints,"orderType":orderType,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
		},function(data) {
			util.render("#tmsTmpl", data.carriage, "#tms");
			if(usePoints!=undefined){
				$('.jifen a').html('<p>抵用金额  ¥'+pointsPrice+'</p>')
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
			if (data.isUse==1) {
				theAddressId = data.addressId;
			}else{
				theAddressId = undefined;
			}
			showShoppingList(theAddressId)
			caculateOrderPrice(theAddressId,buyGoodsJson,usePoints,orderType);
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
			$('#xuanzedizhi').append('<script type="text/javascript" src="/lib/fastclick.js"  ></script>\
									<script type="text/javascript" src="/js/init-fastclick.js"  ></script>\
									<script type="text/javascript" src="/js/address/public.js" ></script>\
									<script type="text/javascript" src="/js/address/jquery.actionsheet-1.0.js"></script>\
								    <script type="text/javascript" src="/js/address/mobiscroll.scroller.zh-min.js"></script>\
									<script type="text/javascript" src="/js/address/queryAllProvinces.js"></script>\
									<script type="text/javascript" src="/js/address/queryCities.js"></script>\
									<script type="text/javascript" src="http://webapi.amap.com/maps?v=1.3&key=b4ad70349fb06a421c2840238dc61b29&plugin=AMap.Autocomplete"></script>\
									<script src="/js/address/shopAddress.js"></script>')
			
			 
			 //获取地址列表  
			 address()
			 function address(){
			 	ajax.post(api.baseServerUrl + "/addr/querySelectByUserId",{
				},function(data) {
					addressList = data.rows;
					util.render("#addressList", data.rows, "#addressDiv");
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
		var s=(Number($('.integral-choice input').val()))/pointsMoneyRate
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
		caculateOrderPrice(theAddressId,buyGoodsJson,usePoints,orderType);
		
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
	$('.integral-cancle').click(function(){
		$("#integral").hide();
		$('.bg').hide()
		document.body.ontouchmove=function(){
				return true;
		}
	})
	
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
			obj2=JSON.stringify(obj1)+','+obj2
		})
			obj2=obj2.substring(0,obj2.length-1)
		
		var createGoodsInfo='['+obj2+']'	
		console.log(createGoodsInfo)
		ajax.post(api.baseServerUrl + "/distributionSellTeamOrder/createOrder",{
			"orderType":1,"addressId":theAddressId,"usePoints":usePoints,
			"buyGoodsJson":createGoodsInfo,"buyerMessages":JSON.stringify(buyMessage),
			"choosedSendTime":choosedSendTime,
			"currentLat":getCookie("firstLat"),"currentLng":getCookie("firstLng"),"locationType":1
		},function(data) {
			if(data.finishOrderFlag==1){
				window.location.href="/payment/community/zhifuchenggong.html?orderId=" + data.orderId+"&zhifutype=1&giftKey="+data.giftKey;
			}else{
				window.location.href="/payment/community/querenzhifu.html?orderId=" + data.orderId+"&price="+$('.balance-total span').html().split('¥')[1];
			}
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
		ajax.post(api.baseServerUrl + "/distributionSellTeamOrder/createOrder",{
			"orderType":7,"addressId":theAddressId, "userCouponIds":userCouponIds,"usePoints":usePoints,
			"buyGoodsJson":createGoodsInfo,"buyerMessages":JSON.stringify(buyMessage),
			"currentLat":getCookie("firstLat"),"currentLng":getCookie("firstLng"),"locationType":1
		},function(data) {
			if(data.finishOrderFlag==1){
				window.location.href="/payment/community/zhifuchenggong.html?orderId=" + data.orderId+"&zhifutype=1&giftKey="+data.giftKey;
			}else{
				window.location.href="/payment/community/querenzhifu.html?orderId=" + data.orderId+"&price="+$('.balance-total span').html().split('¥')[1];
			}
		});
	}
	
	
	
})(goola.api, goola.util, goola.ajax);