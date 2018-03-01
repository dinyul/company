	(function(api,util,ajax){
			getLastData()		//顶部滚动
			//getBarrageData()  //弹幕	
			//顶部滚动
				function getLastData(){
					ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/getLastData",{		
					},function(data) {
							util.render("#FontScroll-list", data, ".FontScroll-list");
							$('#FontScroll').FontScroll({time: 3000,num: 1});
						})
				}
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
