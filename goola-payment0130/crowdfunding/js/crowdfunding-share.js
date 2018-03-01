(function(api, util, ajax){
				var crowdfundingId = util.getUrlParams("crowdfundingId");
				var type=util.getUrlParams('type')
				if(type==1){
					$('.fanhui').show()
				}
				initOrder(crowdfundingId);
				var code
				function initOrder(crowdfundingId) {
					ajax.post(api.baseServerUrl + "/shareCrowdfunding/getCrowdById",{
						"crowdfundingId":crowdfundingId	
					},function(data) {
						code=data.crowdActivityId
						var obj = {data:data,picUrl:api.picUrl}
						util.render("#content", obj, ".content");
						$('.jindutiao div').css('width',data.finishPercent+"%")
						if(data.status==2){
							$('.crowdfunding-bottom').css('display','block')
						}else{
							$('.crowdfunding-footer').css('display','block')
						}
						$('.price p').html("¥"+Number($('.price p').html().split("¥")[1]).toFixed(2))
						shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),data.slogan,data.goods.goodsDesc,"http://" + document.domain +"/payment/crowdfunding-share.html?crowdfundingId="+crowdfundingId,"http://"+ document.domain +api.picUrl + data.goods.cartPhoto);
					})
				}
				$('.bangmang').click(function(){
					ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/checkLogin",{
						
					},function(data) {
						window.location.href="crowdfunding-choukuan.html?crowdfundingId="+crowdfundingId
					},function(returnData){
						window.location.href="../login/denglu.html?crowdfundingId="+crowdfundingId
					})
				})
				$('.kanjia').click(function(){
					ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/createCrowdfundingItem",{
						"orderCrowdfundingId":crowdfundingId,
						"message":"",
						"price":"0.1",
						"type":"3"
					},function(data) {
						$('.jianyi span').html(data.price)
						$('.jianyi').fadeIn(1500).fadeOut(1500);
						initOrder(crowdfundingId);
					})
				})
				$('.content').delegate('.fukuan','click',function(){
					if ($(this).attr('payable') == 1) {
						if(isWeiXin()){
							var crowdItemId=$(this).attr('id')
							payOrder(crowdItemId)
						}else{
							var orderCode=$(this).attr('code');
							var orderPrice=$(this).attr('price');
							toPay(orderCode);
						}
					}
					
				})
				function payOrder(crowdItemId) {
					ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/payCrowdOrder",{
						"crowdItemId":crowdItemId,"url":encodeURI(location.href.split('#')[0])	
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
										window.location.href="http://" + document.domain +"/crowdfunding/payment-success.html?crowdItemId="+crowdItemId+"&crowdfundingId="+crowdfundingId+"&type=1";
									}
								});	
						})			
					})
				}
				function confirmOrder(crowdItemId){
					ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/confirmCrowdfundingItem",{
						"crowdItemId":crowdItemId	
					},function(data) {
						window.location.href="http://" + document.domain +"/crowdfunding/payment-success.html?crowdItemId="+crowdItemId+"&crowdfundingId="+crowdfundingId+"&type=1";
					})
				}
			})(goola.api, goola.util, goola.ajax);