(function(api, util, ajax){
			var cowdfundingId;
			var code= util.getUrlParams("code");
			var crowdfundingId= util.getUrlParams("crowdfundingId")
			if(code==null||code==undefined){
				getCrowdfundingId(crowdfundingId)
			}else{
				getCrowdfundingCode(code)
			}
			function getCrowdfundingCode(code) {
				ajax.post(api.baseServerUrl + "/goods/queryCrowdfundingActivity",{
					"code":code
				},function(data) {
					var obj = {data:data,picUrl:api.picUrl}
					cowdfundingId=data.id
					util.render("#content", obj,".container");
					shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),data.shareTitle,data.shareContent,location.href,"http://"+ document.domain +api.picUrl + data.sharePrint);
					$('.zhongchouzhong').click(function(){
						window.location.href="crowdfunding-payment.html?goodsId="+$(this).parent().parent().attr('id')+"&cowdfundingId="+cowdfundingId
					})
					
					
				});
			}
			function getCrowdfundingId(crowdfundingId) {
				ajax.post(api.baseServerUrl + "/shareCrowdfunding/getCrowdfundingActivityById",{
					"crowdfundingId":crowdfundingId
				},function(data) {
					var obj = {data:data,picUrl:api.picUrl}
					cowdfundingId=data.id
					util.render("#content", obj,".container");
					shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),data.shareTitle,data.shareContent,location.href,"http://"+ document.domain +api.picUrl + data.sharePrint);
					$('.zhongchouzhong').click(function(){
						window.location.href="crowdfunding-payment.html?goodsId="+$(this).parent().parent().attr('id')+"&cowdfundingId="+cowdfundingId
					})
					$('.zhongchouzhong').click(function(){
						window.location.href="crowdfunding-payment.html?goodsId="+$(this).parent().parent().attr('id')+"&cowdfundingId="+cowdfundingId
					})
					
				});
			}

			
		})(goola.api, goola.util, goola.ajax);