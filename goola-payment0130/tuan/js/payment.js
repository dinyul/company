(function(api, util, ajax){
	var userCouponIds;
	var theAddressId=getCookie('addressId');
	var slogan;
	var price;
	var goodsId = util.getUrlParams("goodsId");
	var activityId=util.getUrlParams("activityId");
	var tuan=util.getUrlParams("tuan")
	var usePoints;
	var crowdfundingPrice;
	var id=util.getUrlParams("id")
	var theAddressId=getCookie('addressId');
	//initOrder(theAddressId,activityId,goodsId);
	
	
	getAddressInfo(theAddressId,goodsId)
	

	var buyGoodsJson = new Array();
	var obj = new Object();
		obj.buyCount = 1;
		obj.goodsId = goodsId;
		buyGoodsJson[0] = obj;
		
		function initOrder(addressId,activityId,goodsId) {
			ajax.post(api.baseServerUrl + "/gb/preGroupBuying",{
				"addressId":addressId,
				"goodsId":goodsId,"activityId":activityId,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
			},function(data) {
				price=data.paidPrice
				var obj = {data:data,picUrl:api.picUrl}
				console.log()
				util.render("#shoppingListTmpl", obj, "#shoppingList");
				$('.balance-total span').html("¥"+(price).toFixed(2))
				$('.pointsMoneyValue span').html("¥"+data.pointsMoneyValue)
			})
		}
	
	
	//获取地址
	function getAddressInfo(addressId,goodsId) {
		
		ajax.post(api.baseServerUrl + "/addr/queryUserAddressById",{
			addressId:addressId,"goodsIds":goodsId
		},function(data) {
			util.render("#addressInfoTmpl", data,"#addressInfo");
			if (data.isUse==1) {
				theAddressId = data.addressId;
			}else{
				theAddressId = undefined;
			}
			initOrder(theAddressId,activityId,goodsId);
			if($(".jifen a").hasClass('check')){
				$('.jifen a').html('<img src="/imgs/payment/jiesuan2/icon2/617871071494316514.png"/>')
				ajax.post(api.baseServerUrl + "/distribution/checkUserPointsUse",{
					"usePoints":undefined,"orderPrice":"0.00"
				},function(){});
			}
			//caculateOrderPrice(theAddressId, userCouponIds, goodsId,usePoints,"5");
		},function(returnData) {
		});
	}
	$("#addressInfo").click(function(){
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
			var addGoodsIds='';
			 $('.good-info').each(function(){
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
			$('#selectMode').load('../../order/tmsTmpl.html',null,function(){
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
			alert("您的积分金额不足1元，暂不能使用哦!");
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
			$('.integral-choice input').attr("placeholder",pointsMoneyValue*pointsMoneyRate)
			if($('.integral-choice input').val()==''){
				$('.integral-choice span').html('抵现：¥'+pointsMoneyValue)
			}*/
			var points
			if($(".jifen a").hasClass('check')){
				$(".jifen a").removeClass('check')
				points=0
				usePoints=0
				$('.jifen a').html('<img src="/imgs/payment/jiesuan2/icon2/617871071494316514.png"/>')
			}else{
				$(".jifen a").addClass('check')
				points=$('.pointsMoneyValue span').html().split('¥')[1]
				usePoints=data.usePoints
				$('.jifen a').html('<img src="/imgs/payment/jiesuan2/icon2/207918759010222378.png"/>')
			}
			
			if(price-points<0){
				$('.balance-total span').html("¥"+(0).toFixed(2))
			}else{
				$('.balance-total span').html("¥"+(price-points).toFixed(2))
			}
			
		});

	});
	
	
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
		
		if(tuan=="cantuan"){
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
		ajax.post(api.baseServerUrl + "/gb/startGroupBuying",{
			"slogan":slogan,"goodsId":goodsId,
			"addressId":theAddressId,
			"usePoints":usePoints,"activityId":activityId,
		},function(data) {
			if(data.payStatus==1){
				window.location.href="http://" + document.domain +"/tuan/complete.html?groupBuyingOrderUserId="+data.groupBuyingOrderId+"&goodsId="+goodsId+'&activityId='+activityId
			}else{
				window.location.href="../../payment/tuan-confirmpay.html?groupBuyingOrderUserId="+data.groupBuyingOrderUserId
			}
			
			
		});
	}
	
	function ordering1(){
		if (!theAddressId) {
			alert("请选择收货地址！");
			return;
		}
		ajax.post(api.baseServerUrl + "/gb/joinGroupBuying",{
			"slogan":slogan,"addressId":theAddressId,
			"usePoints":usePoints,"groupBuyingOrderId":id,
			"goodsId":goodsId,"activityId":activityId
		},function(data) {
			if(data.payStatus==1){
				window.location.href="http://" + document.domain +"/tuan/complete.html?groupBuyingOrderUserId="+data.groupBuyingOrderId+"&goodsId="+goodsId+'&activityId='+activityId+"&tuan=cantuan"
			}else{
				window.location.href="../../payment/tuan-confirmpay.html?groupBuyingOrderUserId="+data.groupBuyingOrderUserId+"&tuan=cantuan"
			}
		});
	}
})(goola.api, goola.util, goola.ajax);




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
		//caculateOrderPrice(theAddressId, userCouponIds, goodsInfo,usePoints,orderType);
		
		if(price-usePoints/pointsMoneyRate<0){
			$('.balance-total span').html("¥"+(0).toFixed(2))
		}else{
			$('.balance-total span').html("¥"+(price-usePoints/pointsMoneyRate).toFixed(2))
		}
		$('.jifen a').html('<p>抵用金额  ¥'+(usePoints/pointsMoneyRate).toFixed(2)+'</p>')
		
		ajax.post(api.baseServerUrl + "/distribution/checkUserPointsUse",{
			"usePoints":usePoints,"orderPrice":undefined
		},function(data) {
			var pointsMoneyValue=Number((data.pointsMoneyValue).toString().substring(0,(data.pointsMoneyValue).toString().indexOf('.')+3))
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