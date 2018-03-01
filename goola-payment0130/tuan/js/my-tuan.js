(function(api, util, ajax){
	list(1)
	$('nav').delegate('li','click',function(){
		$('nav').find('li').removeClass('checked')
		$(this).addClass('checked')
		list($(this).attr('id'))
	})
	
	function list(status){
		ajax.post(api.baseServerUrl + "/gb/queryUserSuccessBuyingList",{
			"status":status,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
		},function(data) {
			var obj = {data:data,picUrl:api.picUrl,type:Number(status)}
			util.render("#list",obj,".list ul")
			updateEndTime()
			if(data=='' || data==null || data==undefined || data.length<=0){
				$('body').css('background','#fff')
			}else{
				$('body').css('background','#F1EDEE')
			}
		})
	}
	
	$('.list').delegate('.yaoqing','click',function(e){
		e.stopPropagation()
		window.location.href="./complete.html?activityId="+$(this).attr('activityId')+'&goodsId='+$(this).attr('goodsId')+'&groupBuyingOrderUserId='+$(this).attr('id')
	})
	$('.list').delegate('.complete','click',function(e){
		e.stopPropagation()
		if($(this).find('.time').html()!="拼团剩余时间 已结束"){
		window.location.href="./complete.html?activityId="+$(this).attr('activityId')+'&goodsId='+$(this).attr('goodsId')+'&groupBuyingOrderUserId='+$(this).attr('id')
		}

	})
	$('.list').delegate('.ywc','click',function(e){
		e.stopPropagation()
		window.location.href="../../order/dingdanxiangqing.html?orderId="+$(this).attr('orderId')
	})
	$('.list').delegate('.quxiao','click',function(){
		$(this).parent().parent().parent().parent().addClass('delegate')
		ajax.post(api.baseServerUrl + "/gb/cancelGroupBuying",{
			"orderUserId":$(this).attr('orderUserId')
		},function(data) {
			$('.list').find('.delegate').remove()
		})
	})

})(goola.api, goola.util, goola.ajax);