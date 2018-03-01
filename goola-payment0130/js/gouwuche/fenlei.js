
	(function(api, util, ajax){
		getList()
		//点击列表
		ajax.post(api.baseServerUrl + "/goods/openAuthority/queryAllGoodsShelveonCount",{
		},function(data) {
			$(".search p").html("<span>&nbsp;&nbsp;&nbsp;&nbsp;</span>搜全场"+data.goodsSum+"款商品");
		});
		$('.search').click(function(){
			window.location.href="../../search/search.html"
		})
		/*function loadInfo(){
		//分类页面左侧导航栏点击效果
			$(".leftsidebar_box").find('dd').hide();
			$('.leftsidebar_box dl').eq(0).find('dd').css('display','block').addClass("menu_chioce")
			$('.leftsidebar_box dt').eq(0).next().addClass('checked')
			$('.leftsidebar_box dt img').eq(0).attr('src','../imgs/fenlei/fenlei-sanjiao-hong.png')
			$('.leftsidebar_box dt').next().addClass('first_dd')
			$('.fenlei-content-title p').text($('.leftsidebar_box dl').eq(0).find('.first_dd').text())
			//console.log($('.leftsidebar_box dl').eq(0).find('.first_dd').attr('id'))
			getgoodList($('.leftsidebar_box dl').eq(0).find('.first_dd').attr('id'))
			$(".leftsidebar_box").delegate('dt','click',function(){
				$(".leftsidebar_box dt").css({"background-color":"#F8F8F8"})
				$(this).css({"background-color": "#F8F8F8"});
				$(this).parent().find('dd').removeClass("menu_chioce");
				$(".leftsidebar_box dt img").attr("src","../imgs/fenlei/fenlei-sanjiao-hei.png");
				$(this).parent().find('img').attr("src","../imgs/fenlei/fenlei-sanjiao-hong.png");
				$(".menu_chioce").slideUp();
				$(this).parent().find('dd').slideToggle();
				$(this).parent().find('dd').addClass("menu_chioce");
				$('.leftsidebar_box dd').removeClass('checked')
				$(this).next().addClass('checked')
				//console.log($(this).parent().find('dd').height())
				if($(this).parent().find('dd').height()==1){
					$('.fenlei-content-title p').text($(this).parent().find('.first_dd').text())
					getgoodList($(this).parent().find('.first_dd').attr('id'))
				}
			});
		}
		$(".leftsidebar_box").delegate('dd','click',function(){
			$('.leftsidebar_box dd').removeClass('checked')
			$(this).addClass('checked');
			$('.fenlei-content-title p').text($(this).text())
			getgoodList($(this).attr('id'))
		})*/
		//分类页面减号点击
		/*$('.fenlei-content').delegate('.num-left','click',function(){
			if($(this).parent().find('input').val()==1){
				$(this).parent().find('input').val('0').css('display','none')
				$(this).css('display','none')
				minus($(this).parent().parent().attr('id'))
				return;
			}
			$(this).parent().find('input').val(parseInt($(this).parent().find('input').val())-1);	
			minus($(this).parent().parent().attr('id'))
		})*/
		//分类页面加号点击
		/*$('.fenlei-content ').delegate('.num-right','click',function(e){
			e.stopPropagation()
			var goodId=$(this).parent().parent().attr('id')
			var price=$(this).parent().parent().find('.price').text().split('¥')[1]
			var newPrice=$(this).parent().parent().find('.preferentialPrice').text().split('¥')[1]
			var repertoryCount=$(this).parent().parent().find('.repertoryCount').text();
			if (addProductinCart(goodId,price,newPrice,1,repertoryCount)) {
				$(this).parent().find('input').val(parseInt($(this).parent().find('input').val())+1);
			}
			if ($(this).parent().find('input').val() > 0) {
				$(this).parent().find('.num-left').css('display','block')
				$(this).parent().find('input').css('display','block')
			}
	
		})*/
		
		$('.fenlei-content ').delegate('.num','click',function(e){
			e.stopPropagation()
			var goodId=$(this).parent().attr('id')
			var price=$(this).parent().find('.preferentialPrice').attr('price')
			var newPrice=$(this).parent().find('.preferentialPrice span').text()
			var repertoryCount=$(this).parent().find('.repertoryCount').text()
			addProductinCart(goodId,price,newPrice,1,repertoryCount)
		})
		$('.fenlei-content ').delegate('.num','click',addCart)
		//点击商品列表
		$('.fenlei-content-list').delegate('.product','click',function(e){
			e.stopPropagation()
			var goodsId=$(this).parent().attr('id')
			window.location.href='../shangpin/shangpinxiangqing.html?goodsId='+goodsId
		})
		
		$('.leftsidebar_box').delegate('li','click',function(){
			if($(this).attr('categoryId')==''){
				window.location.href="/water/goodslist.html"
			}else{
				$('.leftsidebar_box').find('li').removeClass('menu_chioce')
				$(this).addClass('menu_chioce')
				getgoodList($(this).attr('categoryId'))
			}
			
			
		})
		
		
		//分类页面左侧导航栏信息获取
		function getList(){
			ajax.post(api.baseServerUrl + "/goodsCategory/findParentGoodsCategory",{
				"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
			},function(data) {
				var obj = {data:data}
				util.render("#leftsidebar_box_dl",data,".leftsidebar_box");
				//loadInfo();
				var leftheight=($(window).height())/($(window).width()/10)-1.40625-1.16
				$('.leftsidebar_box li').eq(1).addClass("menu_chioce")
				if(isWeiXin()){
					$('.leftsidebar_box').css('height',leftheight+'rem')
				}else if(browser.versions.ios || browser.versions.android){
					if(!isWeiXin()){
						$('.leftsidebar_box').css('min-height',leftheight-1.25+'rem')
						$('.leftsidebar_box').css('height',leftheight-1.25+'rem')
					}
					
				}
				
				getgoodList($('.leftsidebar_box').find('.menu_chioce').attr('categoryId'))
				ajax.post(api.baseServerUrl + "/user/openAuthority/isLogin",{
				},function(data) {
						ajax.post(api.baseServerUrl + "/user/getUserInfo",{
						},function(data) {
							if(data.isScmUser==1){
								$('.water').show()
							}
							
						});
				},function(returnData){
					
				});
				
				
				
				
				
			});
		}
		//根据导航信息获取商品
		function getgoodList(categoryId){
			ajax.post(api.baseServerUrl + "/goodsCategory/findChildGoodsCategory",{
				"parentCategoryId":categoryId,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
			},function(data) {
				var obj = {data:data,picUrl:api.picUrl}
				util.render("#ly_item",obj,".fenlei-content");
				$(function() {
					$(".lazy").lazyload({
						effect : "fadeIn",
						threshold : 500
					});
				});
			});
		}
		var title="更好甄选—更好·不贵"
	var doc="种草全世界的好货"
	shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),title,doc,"http://" + document.domain + "/index.html","http://" + document.domain +"/imgs/shouye-share.png");
	})(goola.api, goola.util, goola.ajax);


		
