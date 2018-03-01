(function(api,util,ajax){
	count() 
	var pageNo=1;
	var total;
	var pageTotal
	var crowdActivityId;
	list(pageNo,20)
	
	$(window).scroll(function () {
		var totalheight=parseFloat($(window).height()+$(window).scrollTop())
		if($(document.body).height()<=totalheight){
			
			if($('.wish-list ul').find('li').length==100||$('.wish-list ul').find('li').length>=total){
				$('.wish-list-complete').css('display','block')
				$(window).unbind('scroll')
				return false
			}

			if(pageNo>=pageTotal){
				$('.wish-list-complete').css('display','block')
				$(window).unbind('scroll')
				return false
			}
			pageNo=pageNo+1
			list(pageNo,20)
		}
	});
	//获取进行中心愿数
	function count(){
		ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/selectCrowdfundingVirtual",{
				"id":1
		},function(data) {
			$('.count span').html("【"+data+'】')
			
		})
	}
	//获取心愿列表
	function list(pageNo,pageSize){
		
		ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/wishingWall",{
			'pageNo':pageNo,'pageSize':pageSize,'status':2
		},function(data) {
			total=data.total
			pageTotal=parseInt(total/pageSize)+1
			for(var i=0;i<data.rows.length;i++){
				var images=['imgs/wish/icon-zanzhu.png','imgs/wish/icon-dashang.png','imgs/wish/icon-zhichi.png','imgs/wish/icon-zhuren.png'];
				var url=images[Math.floor(Math.random()*images.length)];
				var html='<li>\
							<img class="touxiang" src="'+data.rows[i].wechatHead+'"/>'
				if(data.rows[i].isBargain==1){
						html+='<div class="zhichi" id="'+data.rows[i].id+'"><span>'+data.rows[i].supportCount+'</span></div>'
					}else if(data.rows[i].isBargain==2){
						html+='<div class="zhichi praise" id="'+data.rows[i].id+'"><span>'+data.rows[i].supportCount+'</span></div>'
					}
						html+='<div class="message">\
								<h2>'+data.rows[i].userName+'</h2>\
								<a href="../payment/crowdfunding-share.html?crowdfundingId='+data.rows[i].id+'&type=1" style="display:block">\
									<p>许愿'+data.rows[i].goodsName+','+data.rows[i].slogan+'</p>\
								</a>\
							</div>\
							<div class="link">\
								<a href="../payment/crowdfunding-share.html?crowdfundingId='+data.rows[i].id+'&type=1" style="display:block">\
									<img src="imgs/wish/icon.png" />\
								</a>\
							</div>\
						</li>'		
				$('.wish-list ul').html($('.wish-list ul').html()+html)
			}
		})	
	}
		$('.wish-list').delegate('.praise','click',function(){
			$('.wish-list').find('.zhichi').removeClass('praised')
			$(this).addClass('praised')
			ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/createCrowdfundingItem",{
				"orderCrowdfundingId":$(this).attr('id'),
				"message":"",
				"price":"0.1",
				"type":"3"
			},function(data) {
				$('.wish-list').find('.praised').css('background-image','url(./imgs/wish/praise2.png)')
				$('.jianyi span').html(data.price)
				$('.jianyi').fadeIn(1500).fadeOut(1500);
				$('.wish-list').find('.praised span').html(Number($('.wish-list').find('.praised span').html())+1)
				$('.wish-list').find('.praised').removeClass('praise')
				
			})
		})
		ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/queryCurrentActivityId",{
					
		},function(data) {
				$('.wish-bottom img').click(function(){
					window.location.href='crowdfunding-list.html?crowdfundingId='+data.id
				})
				shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),data.wishShareTitle,data.wishShareContent,"http://" + document.domain + "/crowdfunding/wish.html","http://" + document.domain  +api.picUrl+data.wishSharePicture);
		})	
		
		
		
})(goola.api,goola.util,goola.ajax)