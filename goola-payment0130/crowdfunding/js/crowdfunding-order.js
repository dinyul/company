$(function(){
	(function(api,util,ajax){
		orderList();		
		//顶部导航

		//订单列表获取
		function orderList(){
			ajax.post(api.baseServerUrl + "/crowdfunding/crowdOrderList",{
			},function(data) {
				if(data.rows.length==0){
					$('.order-none').css('display','block')
				}else{
					var obj = {data:data.rows, picUrl: api.picUrl}
					util.render("#orderInfoTmpl", obj, "#orderInfo")	
				}
				
				$('.order-details').click(function(){
					
					if($(this).attr('id') == 1){
					window.location.href="../../payment/crowdfunding-confirmpayment.html?crowdfundingId="+$(this).parent().attr('id')
					}else{
						window.location.href="../../payment/my-crowdfunding.html?crowdfundingId="+$(this).parent().attr('id')
					}
				})
					
			})	
		}
		//取消订单
		$('.order-list').delegate('.offOrder','click',function(){
			offOrder($(this).parent().attr("id"));
		})
		
		
		function offOrder(crowdfundingId){
			ajax.post(api.baseServerUrl + "/crowdfunding/cancelCrowdfunding",{
				"crowdfundingId":crowdfundingId	
			},function(data) {
				orderList();
			})
		}
			
			
		
		var title="更好甄选—更好·不贵"
		var doc="种草全世界的好货"
		shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),title,doc,"http://" + document.domain + "/index.html","http://" + document.domain +"/imgs/shouye-share.png");
	})(goola.api, goola.util,goola.ajax)
});

