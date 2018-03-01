(function(api, util, ajax){
				var crowdfundingId = util.getUrlParams("crowdfundingId");
				initOrder(crowdfundingId);
				var type=util.getUrlParams("type")
				if(type==1){
					coupon()
					if(isWeiXin()){
						$('.payment-success').css('display','block')
					}
					
				}
				function initOrder(crowdfundingId) {
					ajax.post(api.baseServerUrl + "/shareCrowdfunding/getCrowdById",{
						"crowdfundingId":crowdfundingId	
					},function(data) {
						var obj = {data:data,picUrl:api.picUrl}
						util.render("#content", obj, ".content");
						$('.price p').html("¥"+Number($('.price p').html().split("¥")[1]).toFixed(2))
						shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),data.slogan,data.goods.goodsDesc,"http://" + document.domain +"/payment/crowdfunding-share.html?crowdfundingId="+crowdfundingId,"http://"+ document.domain +api.picUrl + data.goods.cartPhoto);
						$('.shareButton1').click(function(){
							if(isWeiXin()){
									$('body').append('<div class="wx-share" style="z-index:101">\
														<img src="../imgs/giftcard/fenxiang.png" />\
														<a class="wx-share-btn">知道啦</a>\
														</div>')
										$('.wx-share-btn').click(function(){
											 $('.wx-share').remove()	 
										})
									wxShare(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),data.slogan,data.goods.goodsDesc,"http://" + document.domain +"/payment/crowdfunding-share.html?crowdfundingId="+crowdfundingId,"http://"+ document.domain +api.picUrl + data.goods.cartPhoto);
								}else if( browser.versions.ios || browser.versions.android){
									if(!isWeiXin()){
										toShare(data.slogan,data.goods.goodsDesc,"http://" + document.domain +"/payment/crowdfunding-share.html?crowdfundingId="+crowdfundingId,"http://"+ document.domain +api.picUrl + data.goods.cartPhoto)
									}
								}
						})
						$('.jindutiao div').css('width',data.finishPercent+"%")
						$('.payment-success a').click(function(){
							$('.payment-success').css('display','none')
						})
						$('.refund').click(function(){
							window.location.href="../crowdfunding/refund.html?crowdfundingId="+crowdfundingId
						})
						$('.zhifuyue').click(function(){
							window.location.href="crowdfunding-myself.html?crowdfundingId="+crowdfundingId
						})
						$('.ziji').click(function(){
							window.location.href="crowdfunding-myself.html?crowdfundingId="+crowdfundingId
						})
						if(data.redPacketId!=undefined){
							$('.share1').css('display','block')
							$('.share1').click(function(){
								if(isWeiXin()){
									$('body').append('<div class="wx-share" style="z-index:101">\
														<img src="../imgs/giftcard/fenxiang.png" />\
														<a class="wx-share-btn">知道啦</a>\
														</div>')
										$('.wx-share-btn').click(function(){
											 $('.wx-share').remove()	 
										})
									wxShare(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),data.rpActivity.shareTitle,data.rpActivity.shareContent,"http://" + document.domain + "/activity/coupon.html?redPacketUserId="+data.redPacketId,"http://" + document.domain +api.picUrl +data.rpActivity.sharePrint);
								}else if( browser.versions.ios || browser.versions.android){
									if(!isWeiXin()){
										toShare(data.rpActivity.shareTitle,data.rpActivity.shareContent,"http://" + document.domain + "/activity/coupon.html?redPacketUserId="+data.shareContent,"http://" + document.domain +api.picUrl +data.rpActivity.sharePrint)
									}
								}
							})
						}
					})
				}
				
				
				
				$('.content').delegate('.fukuan','click',function(){
					var crowdItemId=$(this).attr('id')
					if($(this).attr('payable')==1){
						if(isWeiXin()){
							payOrder(crowdItemId)
						}else{
							var orderCode=$(this).attr('code');
							toPay(orderCode);
						}
					}else{
						alert('该订单不能支付')
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
				
				//优惠券弹窗
				function coupon(){
					ajax.post(api.baseServerUrl + "/crowdfunding/crowdIsRpa",{
					"crowdId":crowdfundingId 
					},function(data) {
						var obj={data:data,picUrl:api.picUrl};
						util.render("#coupon",obj,".coupon");
						if(data!=undefined){
							$('.coupon').css('display','block')
						}
						if($('.couponlist li').length==1){
							$('.couponlist li').css('margin-top','2.015625rem')
						}else if($('.couponlist li').length==2){
							$('.couponlist li:nth-child(1)').css('margin','0.703125rem 0')
						}else if($('.couponlist li').length>3){
							$('.couponlist').css('height',"6.484375rem")
											.css('margin','5.3125rem auto 0')
						}
						$('.close').click(function(){
							$('.coupon').hide()
						})
						$('.share').click(function(){
							if(isWeiXin()){
								$('body').append('<div class="wx-share" style="z-index:101">\
													<img src="../imgs/giftcard/fenxiang.png" />\
													<a class="wx-share-btn">知道啦</a>\
													</div>')
									$('.wx-share-btn').click(function(){
										 $('.wx-share').remove()	 
									})
								wxShare(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),data.shareTitle,data.shareContent,"http://" + document.domain + "/activity/coupon.html?redPacketUserId="+data.redPacketUserId,"http://" + document.domain +api.picUrl + data.sharePrint);
							}else if( browser.versions.ios || browser.versions.android){
								if(!isWeiXin()){
									toShare(data.shareTitle,data.shareContent,"http://" + document.domain + "/activity/coupon.html?redPacketUserId="+data.redPacketUserId,"http://" + document.domain +api.picUrl + data.sharePrint)
								}
							}
							
						})
					},function(data){
						console.log(data)
					});
				}
				
				
				
			})(goola.api, goola.util, goola.ajax);