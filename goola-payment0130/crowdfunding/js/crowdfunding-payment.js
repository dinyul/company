(function(api, util, ajax){
	var userCouponIds;
	var theAddressId=getCookie('addressId');
	var slogan;
	var price;
	var goodsId = util.getUrlParams("goodsId");
	var cowdfundingId=util.getUrlParams("cowdfundingId")
	var usePoints;
	var crowdfundingPrice;
	initOrder(cowdfundingId,goodsId);
	getAddressInfo()
	getusablecoupon(goodsId)

	var buyGoodsJson = new Array();
	var obj = new Object();
		obj.buyCount = 1;
		obj.goodsId = goodsId;
		buyGoodsJson[0] = obj;
		
		function initOrder(cowdfundingId,goodsId) {
			ajax.post(api.baseServerUrl + "/crowdfunding/queryActivity",{
				"cowdfundingId":cowdfundingId,"goodsId":goodsId	
			},function(data) {
				price=data.leastPrice
				var obj = {data:data,picUrl:api.picUrl}
				util.render("#content", obj, ".content");
				$('.payment-total a').html(price.toFixed(2))
				$('.payment input').val(price.toFixed(2))
				$('.price1 p').html("¥"+Number($('.price1 p').html().split("¥")[1]).toFixed(2))
			})
		}
	
	//获取地址
	function getAddressInfo(addressId) {
		ajax.post(api.baseServerUrl + "/addr/queryUserAddressById",{
			addressId:addressId
		},function(data) {
			util.render("#addressInfoTmpl", data,"#addressInfo");
			if (data) {
				theAddressId = data.addressId;
			}
			caculateOrderPrice(theAddressId, userCouponIds, goodsId,usePoints,"5");
		},function(returnData) {
		});
	}
	//获取可用优惠券
	function getusablecoupon(goodsId){
		ajax.post(api.baseServerUrl + "/promotion/queryUsableCouponList",{
			"buyGoodsJson":'[{"goodsId":'+goodsId+',"buyCount":1}]'
		},function(data) {
			var info = data.length + "张可用";
			util.render("#couponCountTmpl", info,"#couponCount");
			util.render("#couponInfoTmpl", data,"#couponInfo");
		},function(returnData) {
			util.render("#couponCountTmpl", "0张可用","#couponCount");
		});
	}
	
	//点击选择优惠券页面
	$("#couponCount").click(function(){
		var num = $("#couponCount a p").html().split("张")[0];
		if(Number(num) == 0){
			alert("您没有可用优惠券!")
			return;
		}
		$("#yhq").show();
		$('.bottom').hide()
		$('.app-top').hide()
		$('.app-content').css('margin-top','0')
	});
	$('#yhq #fanhui').click(function(){
		$("#yhq").hide();
		$('.bottom').show()
		$('.app-top').show()
		$('.app-content').css('margin-top','1.25rem')
	})
	//选择使用优惠券
	$("#couponInfo").delegate('li','click',function(){
		$("#yhq").hide();
		$('.bottom').show()
		$(".balance").show()
		$('.app-top').show()
		$('.app-content').css('margin-top','1.25rem')
		userCouponIds = $(this).find(".left").attr("id");
		var s=Number($(this).find(".left span").html()).toFixed(2) //选择的优惠券金额
		var a=Number(($('.price1 p').html()).split("¥")[1]) //订单总金额
		var b=Number($('.payment-total span a').html()) //选择支付金额
		if(s>=(a-b)){
			alert('优惠金额大于众筹金额不能使用');
			return false;
		}
		util.render("#couponCountTmpl", "¥" + s ,"#couponCount");
		$('.crowdfunding-total a').html((a-b-s).toFixed(2))
		crowdfundingPrice=a-s
	})

	//选择地址
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
				getAddressInfo($(this).parent().attr("id"));
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
		});

	})
	function caculateOrderPrice(addressId, couponId, goodsId,usePoints,orderType) {
		ajax.post(api.baseServerUrl + "/order/coculateOrderPrice",{
			"addressId":addressId, "userCouponIds":couponId, "buyGoodsJson":'[{"goodsId":'+goodsId+',"buyCount":1}]',
			"usePoints":usePoints,"orderType":5
		},function(data) {
			util.render("#tmsTmpl", data.carriage, "#tms");
			$('.crowdfunding-total a').html((data.orderPrice-price).toFixed(2))
			crowdfundingPrice=data.orderPrice
		});
	}
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
		ordering()
	})
	function ordering(){
		if (!theAddressId) {
			alert("请选择收货地址！");
			return;
		}
		ajax.post(api.baseServerUrl + "/crowdfunding/startCrowdfunding",{
			"slogan":slogan,"goodsId":goodsId,"goodsCount":1,"userCouponIds":userCouponIds,
			"addressId":theAddressId,
			"preparePay":$('.payment-total span').find('a').html(),
			"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
		},function(data) {
			window.location.href="../../payment/crowdfunding-confirmpayment.html?crowdfundingId=" + data;
		});
	}
	$('.payment .jian').click(function(){
		if(Number($('.payment input').val())<=price){
			return false
		}
		$(this).next().val((Number($(this).next().val())-1).toFixed(2))
		$('.crowdfunding-total a').html((crowdfundingPrice-Number($(this).next().val())).toFixed(2))
		$('.payment-total a').html(Number($(this).next().val()).toFixed(2))
	})
	$('.payment .jia').click(function(){
		if(Number($('.payment input').val())>=parseInt(crowdfundingPrice)){
			return false
		}
		$(this).prev().val((Number($(this).prev().val())+1).toFixed(2))
		$('.crowdfunding-total a').html((crowdfundingPrice-Number($(this).prev().val())).toFixed(2))
		$('.payment-total a').html(Number($(this).prev().val()).toFixed(2))
	})
	$('.payment input').blur(function(){
		if(Number($('.payment input').val())<=price){
			$('.payment input').val(price)
		}
		if(Number($('.payment input').val())>=crowdfundingPrice){
			$('.payment input').val(crowdfundingPrice)
			
		}
		var s=(crowdfundingPrice-Number($(this).val())).toFixed(2)
		var p=Number($(this).val()).toFixed(2);
		$('.crowdfunding-total a').html(s)
		$('.payment-total a').html(p)
	})
	
	
	
	var title="更好甄选—更好·不贵"
	var doc="种草全世界的好货"
	shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),title,doc,"http://" + document.domain + "/index.html","http://" + document.domain +"/imgs/shouye-share.png");
})(goola.api, goola.util, goola.ajax);