(function(api,util,ajax){
			
			count()
			list(1,20)
			function count(){
				ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/selectCrowdfundingVirtual",{
						"id":2
				},function(data) {
					$('.count span').html(data)
				})
			}
			function list(pageNo,pageSize){
				ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/voidWall",{
					'pageNo':pageNo,'pageSize':pageSize
				},function(data) {
					var obj = {data:data.rows,picUrl:api.picUrl}
					util.render("#wish-list", obj, ".wish-list ul");
						
				})	
			}
			ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/queryCurrentActivityId",{
							
			},function(data) {
				$('.wish-bottom img').click(function(){
					window.location.href='crowdfunding-list.html?crowdfundingId='+data.id
				})
				shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),data.wishShareTitle,data.wishShareContent,"http://" + document.domain + "/crowdfunding/wish.html","http://" + document.domain  +api.picUrl+data.wishSharePicture);
			})
			//弹幕
			function getBarrageData(){
				ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/getBarrageData",{		
				},function(data) {
						var obj = {data:data,picUrl:api.picUrl}
						util.render("#danmu", obj, ".danmu ul");
					})
			}
			function animate(){
				$('.danmu').animate({top:'5.234375rem',opacity:'1'},1000)
							.animate({top:'5.234375rem',opacity:'1'},1500)
				   	   		.animate({top:'3.671875rem',opacity:'0'},500)
				$('.danmu ul li:first').remove()
				if($('.danmu li').length==0){
					getBarrageData()
				}
			}
			animate()
			setInterval(animate,5000)
	})(goola.api,goola.util,goola.ajax)