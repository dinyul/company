
$(function(){
	
	(function(api,util,ajax){
		var orderCode;
		var crowdfundingId = util.getUrlParams("crowdfundingId");
		var crowdfund,childOrderCode,childOrderPrice
		getOrderCountDown(crowdfundingId);
		initOrder(crowdfundingId);
		function initOrder(crowdfundingId) {
			ajax.post(api.baseServerUrl + "/shareCrowdfunding/getCrowdById",{
				"crowdfundingId":crowdfundingId	
			},function(data) {
				var obj = {data:data,picUrl:api.picUrl}
				util.render("#zhifuTmpl", obj, ".zhifu");
				$('.price p').html("¥"+Number($('.price p').html().split("¥")[1]).toFixed(2))
				orderCode=data.code;
				crowdfund=data.id;
				childOrderCode=data.childCode;
				childOrderPrice=data.childPrice;
			})
		}
		$('.zhifu').delegate('.bottom','click',function(){
			if(isWeiXin()){
				payOrder(crowdfund);
			}else{
				toPay(childOrderCode);
			}
		})
		function getOrderCountDown(crowdfundingId) {
			ajax.post(api.baseServerUrl + "/crowdfunding/getCrowdfundingCountDown",{
				"crowdFundingId":crowdfundingId	
			},function(data) {
				startCountDown(data);
			},function(returnData){

			})
		}
		
		function payOrder(crowdfundingId) {
			ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/payCrowdOrder",{
				"crowdId":crowdfundingId,"url":encodeURI(location.href.split('#')[0])	
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
								confirmOrder(crowdfundingId)
								
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
		function confirmOrder(crowdfundingId){
			ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/confirmCrowdfundingItem",{
				"crowdId":crowdfundingId
			},function(data) {
				window.location.href="http://" + document.domain +"/payment/my-crowdfunding.html?crowdfundingId="+crowdfundingId+"&type="+1;
			})
		}

		//取消订单
		function cancelOrder(crowdfundingId){
			ajax.post(api.baseServerUrl + "/crowdfunding/cancelCrowdfunding",{
				"crowdfundingId":crowdfundingId
			},function(data) {
				alert("取消成功");
				window.location.href="";
			})
		}
		var title="更好甄选—更好·不贵"
		var doc="种草全世界的好货"
		shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),title,doc,"http://" + document.domain + "/index.html","http://" + document.domain +"/imgs/shouye-share.png");
	})(goola.api,goola.util,goola.ajax)
})
