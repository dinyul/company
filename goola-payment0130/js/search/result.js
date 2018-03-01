(function(api, util, ajax){
	
	var name = decodeURI(util.getUrlParams("name"));
	var sortType=''
	
	$('.search p').html(name)
	$('.search').click(function(){
		window.location.href='search.html'
	})
	getList(1,sortType)
	
	function getList(sortBy,sortType){
		ajax.post(api.baseServerUrl + "/goodsRank/requireLocation/queryGoods",{
			"queryParams":name,"sortBy":sortBy,"sortType":sortType,
			"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
		},function(data) {
			if( data!='' && data!=undefined && data!=null && data.length!=0){
				$('.has').show()
				var obj = {data:data,picUrl:api.picUrl}
				util.render("#list",obj,".has .list")
			}else{
				$('.none').show()
				rankinglist()
			}	
		})
	}
	$('.has nav').find('li').click(function(){
		$('.has nav').find('li').removeClass('checked')
		$(this).addClass('checked')
		if(($(this).text()).replace(/\s/g,'')!='价格'){
			sortType=''
			$(this).parent().find('span').css('background','url(../../imgs/search/icon0.png) no-repeat left center')
										.css('background-size','0.125rem 0.34375rem')
		}else{
			if(sortType!=2){
				$(this).find('span').css('background','url(../../imgs/search/icon2.png) no-repeat left center')
									.css('background-size','0.125rem 0.34375rem')
				sortType=2
			}else{
				$(this).find('span').css('background','url(../../imgs/search/icon1.png) no-repeat left center')
									.css('background-size','0.125rem 0.34375rem')
				sortType=1
			}
		}
		getList($(this).attr('id'),sortType)
	})
	
	$('.result').delegate('.goodslist','click',function(){
		window.location.href="../../shangpin/shangpinxiangqing.html?goodsId="+$(this).parent().attr('goodsId')
	})
	$('.result').delegate('.addcard','click', addCart);
	$('.result').delegate('.addcard','click',function(){
		addProductinCart($(this).parent().attr('goodsId'),0,0,1,-1)	
	})
	function rankinglist(){
		ajax.post(api.baseServerUrl + "/goodsRank/openAuthority/openRecommentList",{
			
		},function(data) {
			if(data!='' && data!=undefined && data!=null && data.length!=0){
				$('.none .list1').show()
				var obj = {data:data,picUrl:api.picUrl}
				util.render("#list",obj,".none .list")
			}
			
		})
	}
})(goola.api, goola.util, goola.ajax);