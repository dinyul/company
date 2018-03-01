(function(api,util,ajax){
	var crowdfundingId = util.getUrlParams("crowdfundingId");
	var userId
	refund()
	
	function refund(){
		ajax.post(api.baseServerUrl + "/shareCrowdfunding/getCrowdById",{
				"crowdfundingId":crowdfundingId	
		},function(data) {
				userId=data.userId
				util.render("#refund", data, ".body");	
		})
	}
	
	
	$('.body').delegate('.refund','click',function(){
			ajax.post(api.baseServerUrl + "/crowdfunding/cancelRefunding",{
				"crowdfundingId":crowdfundingId
			},function(data) {
					$('.goola-alert').show()
					$('.bg').show()
					$('.confirm').click(function(){
						window.location.href='../../payment/my-crowdfunding.html?crowdfundingId='+crowdfundingId
					})
					
			})		
		})
	$('.body').delegate('.re-refund','click',function(){
			ajax.post(api.baseServerUrl + "/crowdfunding/modifyCrowdfundingStatus",{
				"crowdfundingId":crowdfundingId
			},function(data) {
				refund()
			})
			
		})
})(goola.api,goola.util,goola.ajax)