(function(api,util,ajax){
				var  crowdItemId = util.getUrlParams("crowdItemId");
				var crowdfundingId=util.getUrlParams("crowdfundingId");
				var type=util.getUrlParams("type");
				getUserCoupon(crowdItemId)
				function getUserCoupon(crowdItemId){
					ajax.post(api.baseServerUrl + "	/crowdfunding/openAuthority/getUserCoupon",{
						"crowdItemId":crowdItemId	
					},function(data) {
						console.log(data)
						util.render("#youhuiquan", data, ".youhuiquan");
					})
				}
				$('.youhuiquan').delegate('.shiyong','click',function(){
					window.location.href="../fenlei/fenlei.html"
				})
				$('.fanhui').click(function(){
					console.log(type)
					if(type==2){
						window.location.href="../payment/my-crowdfunding.html?crowdfundingId="+crowdfundingId
					}else{
						window.location.href="../payment/crowdfunding-share.html?crowdfundingId="+crowdfundingId
					}
				})
				var title="更好甄选—更好·不贵"
				var doc="种草全世界的好货"
				shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),title,doc,"http://" + document.domain + "/index.html","http://" + document.domain +"/imgs/shouye-share.png");
			})(goola.api,goola.util,goola.ajax)