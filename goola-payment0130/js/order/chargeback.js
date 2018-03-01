(function(api,util,ajax){
	
	orderList()
	function orderList(){
		ajax.post(api.baseServerUrl + "/orderRefund/queryUserAterSaleOrder",{
		},function(data) {
			
			var obj = {data:data, picUrl: api.picUrl}
			util.render("#orderInfoTmpl", obj, "#orderInfo")
			$('.fahuoshijian').each(function(){
				if($(this).html()<=time){
					$(this).parent().parent().find('.xiugai').hide()
				}
			})
		})	
	}
	
	
})(goola.api, goola.util,goola.ajax)