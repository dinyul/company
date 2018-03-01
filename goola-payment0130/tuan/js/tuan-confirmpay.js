
$(function(){
	
	(function(api,util,ajax){
		var orderCode;
		var orderType;
		var giftKey;
		var groupBuyingOrderUserId = util.getUrlParams("groupBuyingOrderUserId");
		var orderPrice = 0;
		var activityId,goodsId;
		var tuan=util.getUrlParams("tuan")
		var payStatus,groupBuyingOrderUserId1
		//getOrderCountDown(groupBuyingOrderUserId);
		initOrder(groupBuyingOrderUserId);
		function initOrder(groupBuyingOrderUserId) {
			ajax.post(api.baseServerUrl + "/gb/getGroupBuyingOrderUserById",{
				"groupBuyingOrderUserId":groupBuyingOrderUserId	
			},function(data) {
				payStatus=Number(data.payStatus)
				groupBuyingOrderUserId1=data.groupBuyingOrderId
				util.render("#zhifuTmpl", data, ".zhifu");
				if(data.receiverName==undefined){
					$('.zhifu').find('.zhifu-info').html('<p style="height:2.171875rem;line-height:2.171875rem;font-size:0.5rem">由好友填写</p>')
					$('.fahuo-time').hide()
				}
				orderCode=data.orderCode;
				orderPrice=data.orderPrice;
				startCountDown(data.countDown);
				activityId=data.groupBuyingOrder.activityId
				goodsId=data.goods.goodsId
			})
		}
		
		function getOrderCountDown(orderId) {
			ajax.post(api.baseServerUrl + "/order/getOrderCountDown",{
				"orderId":orderId	
			},function(data) {
				startCountDown(data);
			},function(returnData){

			})
		}                

		$('.zhifu').delegate('.bottom','click',function(){
			if(payStatus==1){
				window.location.href="http://" + document.domain +"/tuan/complete.html?groupBuyingOrderUserId="+groupBuyingOrderUserId1+"&goodsId="+goodsId+'&activityId='+activityId
			}else{
				if(isWeiXin()){
					payOrder(groupBuyingOrderUserId);
				}else{
					toPay(orderCode,groupBuyingOrderUserId,encodeURI(location.href.split('#')[0]),2);
				}
			}
			
		})
		
		function payOrder(groupBuyingOrderUserId) {
			ajax.post(api.baseServerUrl + "/gb/payGroupBuying",{
				"groupBuyingOrderUserId":groupBuyingOrderUserId,"url":encodeURI(location.href.split('#')[0])	
			},function(data) {
				wx.config({
					debug: false,
					appId: data[0].appid,
					timestamp: data[0].timeStamp,
					nonceStr: data[0].nonceStr,
					signature: data[0].signature,
					jsApiList: ['chooseWXPay']
				});
				wx.ready(function () {
					wx.chooseWXPay({
						timestamp: data[1].timeStamp , 
						nonceStr: data[1].nonceStr, 
						package: data[1].packageWithPrepayId , 
						signType: data[1].signType, 
						paySign: data[1].paySign, 
						success: function (res) {
							confirmOrder(groupBuyingOrderUserId)
						}
					});
				})			
			})
		}
		
		var EndTime = 0;
		//倒计时
		function GetRTime(){
		var NowTime = new Date();
		var t =EndTime - NowTime.getTime();
		if(t <= 0){
			var data={orderCode:orderCode,dataStatus:2};
			util.render("#zhifuTmpl", data, ".zhifu");
		}else{
			var d=Math.floor(t/1000/60/60/24);
			var h=Math.floor(t/1000/60/60%24);
			var m=Math.floor(t/1000/60%60);
			var s=Math.floor(t/1000%60);
			$("#time").html(m+"分钟"+s+"秒");
		}
		}
		//开始倒计时
		function startCountDown(time){
			var NowTime = new Date();
			EndTime = Number(NowTime)+Number(time);
			setInterval(GetRTime,0);
		}
		

		//确认订单
		function confirmOrder(groupBuyingOrderUserId){
			ajax.post(api.baseServerUrl + "/gb/confirmGroupBuying",{
				"groupBuyingOrderUserId":groupBuyingOrderUserId	
			},function(data) {
				if(tuan=="cantuan"){
					window.location.href="http://" + document.domain +"/tuan/complete.html?groupBuyingOrderUserId="+data.groupBuyingOrderId+"&goodsId="+goodsId+'&activityId='+activityId+"&tuan=cantuan"+"&successFlag="+data.successFlag
				}else{
					window.location.href="http://" + document.domain +"/tuan/complete.html?groupBuyingOrderUserId="+data.groupBuyingOrderId+"&goodsId="+goodsId+'&activityId='+activityId+"&successFlag="+data.successFlag
				}
				
			})
		}

		//取消订单
		function cancelOrder(orderId){
			ajax.post(api.baseServerUrl + "/order/cancelOrder",{
				"orderId":orderId	
			},function(data) {
				alert("取消成功");
				window.location.href="";
			})
		}
		$('.zhifu').delegate('.chakan','click',function(){
			$('.bg').show()
			$('.cycle').show()
		})
		$('.cycle').delegate('.queren','click',function(){
			$('.bg').hide()
			$('.cycle').hide()
		})
		
		
		$('.complete').click(function(){
			complete($(this).attr('type'),groupBuyingOrderUserId,2)
		})
		//点击支付完成查询订单状态
		function complete(type,orderCode,flag){
			if(type=="weixin"){
				completePay("/order/weChatH5PayConfirmOrder",orderCode,flag)
			}else if(type=="zhifubao"){
				completePay("/order/wapAlipayConfirmOrder",orderCode,flag)
			}
		}
		//查询订单状态是否已支付
		function completePay(url,orderCode,flag){
			ajax.post( api.baseServerUrl+ url,{
				"orderCode":orderCode,"flag":flag
			},function(data) {
				setCookie('reFresh','')
				if(tuan=="cantuan"){
					window.location.href="http://" + document.domain +"/tuan/complete.html?groupBuyingOrderUserId="+data.groupBuyingOrderId+"&goodsId="+goodsId+'&activityId='+activityId+"&tuan=cantuan"+"&successFlag="+data.successFlag
				}else{
					window.location.href="http://" + document.domain +"/tuan/complete.html?groupBuyingOrderUserId="+data.groupBuyingOrderId+"&goodsId="+goodsId+'&activityId='+activityId+"&successFlag="+data.successFlag
				}
			},function(){
				setCookie('reFresh','')
				window.location.reload()
			})
		}
		
		
	})(goola.api,goola.util,goola.ajax)
})