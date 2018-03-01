(function(api, util, ajax){
	var goodsId=util.getUrlParams("goodsId");
	var activityId=util.getUrlParams("activityId");
	var groupBuyingOrderUserId=util.getUrlParams("groupBuyingOrderUserId")
	var tuan=util.getUrlParams("tuan")
	var shareTitle,shareContent,sharePicture
	var successFlag=util.getUrlParams("successFlag")
	goods()
	function goods(){
		ajax.post(api.baseServerUrl + "/gb/requireLocation/queryGroupBuyingOrderDetail",{
			"activityId":activityId,"orderId":groupBuyingOrderUserId,"goodsId":goodsId
		},function(data) {
			
			var obj = {data:data,picUrl:api.picUrl,tuan:tuan}
			util.render("#goods",obj,".goods")
			util.render("#tuan-content",obj,".tuan-content")
			$('.tc-top ul').css('width',(1.1875+0.328125)*$('.tc-top ul').find('li').length-0.328125+'rem')
			$('.tc-top ul>:first').append('<a><img src="../tuan/imgs/icon11.png"/></a>')
			updateEndTime()
			shareTitle=data.goodsName
			shareContent=data.shareTitle
			sharePicture=data.goodsPic
			if(data.status==5){
				shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),'【拼团】'+shareTitle,shareContent,"http://"+ document.domain +"/shangpin/shangpinxiangqing.html?goodsId="+goodsId+"&activityId="+activityId+"&tuan=cantuan&id="+groupBuyingOrderUserId,"http://"+ document.domain +api.picUrl + sharePicture);
			}else{
				shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),shareTitle,shareContent,"http://"+ document.domain +"/shangpin/shangpinxiangqing.html?goodsId="+goodsId,"http://"+ document.domain +api.picUrl + sharePicture);
			}
			
			
			
			
			if(successFlag==0){
				alert('参团失败，该团已被其他用户拼团成功，我们将马上为您进行退款，给您带来的不便请您谅解')
				$('.goola-alert-title p').css('text-align','left')
				$('.icon').hide()
				$('.chenggong').hide()
				$('.tc-bottom').html('<p class="home">去逛逛</p>')
			}
			
		})
	}
	
	
	otherGoods()
	function otherGoods(){
		ajax.post(api.baseServerUrl + "/gb/requireLocation/queryOtherGoodsJoinBuyingList",{
			"goodsId":goodsId,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
		},function(data) {
			if(data!=undefined && data!=null && data!='' && data.length>0){
				$('.part2').show()
			}
			var obj = {data:data,picUrl:api.picUrl}
			util.render("#part2",obj,".part2 ul")
			updateEndTime()
		})
	}
	$('.tuan-content').delegate('.yaoqing','click',function(){
		
		if(!isWeiXin() && (browser.versions.ios || browser.versions.android)){
			$('.share-btn').css('top','1.25rem')
			toShare('【拼团】'+shareTitle,shareContent,"http://"+ document.domain +"/shangpin/shangpinxiangqing.html?goodsId="+goodsId+"&activityId="+activityId+"&tuan=cantuan&id="+groupBuyingOrderUserId,"http://"+ document.domain +api.picUrl + sharePicture);
		}else if(isWeiXin()){
			$('.share-btn').show()
			wxShare(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),'【拼团】'+shareTitle,shareContent,"http://"+ document.domain +"/shangpin/shangpinxiangqing.html?goodsId="+goodsId+"&activityId="+activityId+"&tuan=cantuan&id="+groupBuyingOrderUserId,"http://"+ document.domain +api.picUrl + sharePicture);
		}
		document.body.ontouchmove=function(){
			return false;
		}
	})
	$('.share-btn a').click(function(){
		$('.share-btn').hide()
		document.body.ontouchmove=function(){
			return true;
		}
	})
	$('.tuan-content').delegate('.home','click',function(){
		window.location.href="../../index.html"
	})
	
})(goola.api, goola.util, goola.ajax);