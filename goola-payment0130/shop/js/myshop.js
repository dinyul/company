(function(api, util, ajax){
		var providerId,expandCode;
		ajax.post(api.baseServerUrl + "/inShop/queryAdminUserInShop",{
		},function(data) {
			if(getCookie('shopLocation')!=1){
				window.location.href="/location/location.html"
			}
			if(data.isAdmin==0){
				$('.none').css('display','block')
				$('body').css('background','#fff')
				$('.none').css('display','block')
			}else if(data.isAdmin==1){
				$('.myshop').css('display','block')
				$('.shop-bottom').css('display','block')
				providerId=data.providerId
				shopInfo()
				getList()
			}
		});
		ajax.post(api.baseServerUrl + "/Charge/findActiveList",{
		},function(data) {
			util.render("#recharge", data, ".recharge")	
			var width=''
			$('.recharge').find('li').each(function(){
				width=Number(width)+Number($(this).width())
			
			})
			$('.recharge').find('ul').width(width/$(window).width()*10+'rem')
			$('.recharge .width').width('4.84375rem')
		})
		function goodsList(){
			ajax.post(api.baseServerUrl + "/distribution/getProfitGoodsList",{
				"isIndex":1
			},function(data) {
				var obj={data:data.goodsList,picUrl:api.picUrl}
				util.render("#ly_item1",obj,".fenlei-content-list");
				expandCode=data.expandCode
				$(function() {
					$(".lazy").lazyload({
						effect : "fadeIn",
						threshold : 500
					});
				});
			});
		}
		function shopInfo(){
			ajax.post(api.baseServerUrl + "/inShop/shopHomePage",{
				"providerId":providerId
			},function(data) {
				var obj = {data:data,picUrl:api.picUrl};
				util.render("#shop-top",obj, ".shop-top")
				$('#shopinfo').attr('href',"shopInfo.html?providerId="+providerId)
				var title=data.shopName
				var doc=data.introduction
				shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),title,doc,"http://" + document.domain + "/shop/shop.html?providerId="+providerId,"http://" + document.domain +api.picUrl+data.shopSign);
			});
		}
		$('.fenlei-content').delegate('.shareweixin','click',function(){
			window.location.href="/shangpin/shangpinxiangqing.html?goodsId="+$(this).parent().attr('goodsId')+"&type=dis&expandCode="+expandCode
		})
		$('.fenlei-content').delegate('.shareeweima','click',function(){
			window.location.href="/distribution/goods/shareinfo.html?goodsId="+$(this).parent().attr('goodsId')+"&expandCode="+expandCode
		})
		
		if(isWeiXin()){
			$('.fenlei').find('.leftsidebar_box').css('height',$(window).height()/$(window).width()*10-2.1875-1.375+'rem')
			$('.fenlei').find('.fenlei-content').css('height',$(window).height()/$(window).width()*10-2.1875-1.375+'rem')
		}else{
			$('.fenlei').find('.leftsidebar_box').css('height',$(window).height()/$(window).width()*10-2.1875-1.375-1.25+'rem')
			$('.fenlei').find('.fenlei-content').css('height',$(window).height()/$(window).width()*10-2.1875-1.375-1.25+'rem')
		}
		
		/*$('.fenlei-content ').delegate('.num','click',function(e){
			e.stopPropagation()
			var goodId=$(this).parent().attr('id')
			var price=$(this).parent().find('.preferentialPrice').attr('price')
			var newPrice=$(this).parent().find('.preferentialPrice span').text()
			//var repertoryCount=$(this).parent().find('.repertoryCount').text()
			addProductinCart(goodId,price,newPrice,1,-1)
		})
		$('.fenlei-content ').delegate('.num','click',addCart)*/
		//点击商品列表
		/*$('.fenlei-content-list').delegate('.product','click',function(e){
			e.stopPropagation()
			var goodsId=$(this).parent().attr('id')
			window.location.href='../shangpin/shangpinxiangqing.html?goodsId='+goodsId
		})*/
		
		$('.leftsidebar_box').delegate('li','click',function(){
			$('.leftsidebar_box').find('li').removeClass('menu_chioce')
			$(this).addClass('menu_chioce')
			getgoodList($(this).attr('categoryId'))
			
		})
		
		
		//分类页面左侧导航栏信息获取
		function getList(){
			ajax.post(api.baseServerUrl + "/goodsCategory/findAllGoodsCategory",{
				"shopId":providerId,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
			},function(data) {
				var obj = {data:data}
				util.render("#leftsidebar_box_dl",data,".leftsidebar_box");
				//loadInfo();
				var leftheight=($(window).height())/($(window).width()/10)-1.40625
				$('.leftsidebar_box li').eq(0).addClass("menu_chioce")
				$('.leftsidebar_box').find('li').each(function(){
					$(this).attr('categoryId',$(this).attr('categoryId').substring(0,$(this).attr('categoryId').length-1))
				})
				if(data!='' && data!=undefined && data!=null){
					getgoodList($('.leftsidebar_box').find('.menu_chioce').attr('categoryId'))
				}
				
			});
		}
		//根据导航信息获取商品
		function getgoodList(categoryId){
			ajax.post(api.baseServerUrl + "/goods/queryByCidAndOrgId",{
				"shopId":providerId,"categoryIds":categoryId,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
			},function(data) {
				var obj = {data:data,picUrl:api.picUrl}
				util.render("#ly_item",obj,".fenlei-content-list");
				$(function() {
					$(".lazy").lazyload({
						effect : "fadeIn",
						threshold : 500
					});
				});
			});
		}
		
		
		$('.gouwuche').click(function(){
			window.location.href="../../gouwuche/gouwuche.html"
		})
		
})(goola.api, goola.util, goola.ajax)