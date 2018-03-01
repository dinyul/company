(function(api, util, ajax){
	var goodsId=util.getUrlParams("goodsId");
	var activityId=util.getUrlParams("activityId");
	goods()
	function goods(){
		ajax.post(api.baseServerUrl + "/gb/requireLocation/queryJoinBuyingGoods",{
			"goodsId":goodsId,"activityId":activityId
		},function(data) {
			var obj = {data:data,picUrl:api.picUrl}
			util.render("#goods",obj,".goods")
			util.render("#part1",obj,".part1 ul")
			updateEndTime()
		})
	}
	
	otherGoods()
	function otherGoods(){
		ajax.post(api.baseServerUrl + "/gb/requireLocation/queryOtherGoodsJoinBuyingList",{
			"goodsId":goodsId,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
		},function(data) {
			if(data!='' && data!=null && data!=undefined && data.length>0){
				$('.part2').show()
			}
			var obj = {data:data,picUrl:api.picUrl}
			util.render("#part2",obj,".part2 ul")
			updateEndTime()
		})
	}
	
})(goola.api, goola.util, goola.ajax);