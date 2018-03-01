(function(api, util, ajax){

	showBanner();
	getPromotionInfo();
	
	
	
	if( browser.versions.ios || browser.versions.android){
		if(!isWeiXin()){
			$('.app-top a').hide()
		}
	}
	
    
	
	
	//获取首页banner
	function showBanner(){
		ajax.post(api.baseServerUrl + "/distributionShop/mod/getIndexBanner",{
		},function(data) {
			
			var obj={data:data,picUrl:api.picUrl};
			util.render("#bannerTmpl",obj,".banner");
			var mySwiper = new Swiper('.swiper-container', {
					loop: true,
					autoplay: 5000,
					pagination: '.swiper-pagination',
					paginationClickable :true,
					autoplayDisableOnInteraction: false
			})
		});
	}
	ajax.post(api.baseServerUrl + "/distributionShop/mod/getIndexLabel",{
	},function(data) {
			var obj={data:data,picUrl:api.picUrl};
			util.render("#com-nav",obj,".com-nav");
		});
	
	//获取首页信息
	function getPromotionInfo() {
		ajax.post(api.baseServerUrl + "/distributionShop/mod/getModules",{
			"pageType":1
		},function(data) {
			console.log(data)
			var obj = {data:data.rows,picUrl:api.picUrl};
			util.render("#moduleTmpl",obj, "#module")
			
			var swiper = new Swiper('.swiper-scroll', {
		        slidesPerView: 'auto',
		        paginationClickable: true,
		        freeMode: true
		    });
			var mySwiper = new Swiper('.swiper-container-content', {
					loop: true,
					autoplay: 5000,
					pagination: '.swiper-pagination',
					paginationClickable :true,
					autoplayDisableOnInteraction: false
			})
			$(function() {
				$(".lazy").lazyload({
					effect : "fadeIn",
					threshold : 1000
				});
			});
		});
	}
	
	$('#module').delegate('.bannerImg','click',function(){
			var banner = $(this);
			if (banner.parent().attr("textType") == 1) {
				if(banner.parent().attr("goodsUrl") !=''){
					window.location.href = banner.parent().attr("goodsUrl");
				}
			} else {
				window.location.href = "/community/shangpin/shangpinxiangqing.html?goodsId=" + banner.parent().attr("goodsId");
			}
	})
	
	$('#module').delegate('.emption','click',function(){
			var emption = $(this);
			if (emption.parent().attr("textType") == 1) {
				window.location.href = emption.parent().attr("goodsUrl");
			} else {
				addProductinCart(emption.parent().attr("goodsId"),0,0,1,-1)
				$('body').delegate('.emption','click', addCart);
			}
	})

		
	function addCart(event) {
		var a=$(this).offset().top-$(document).scrollTop();
		
		var offset = $('#selectedTotal').offset(), flyer = $('<img class="u-flyer" src="./imgs/shouye-gouwuche.png"/>');
		var endTop=$('#selectedTotal').offset().top-$(document).scrollTop()
		flyer.fly({
		    start: {
		        left: event.pageX-10,
		        top: a
		    },
		    end: {
		        left: offset.left,
		        top: endTop,
		        width: 0,
		        height: 0
		    }
		});
		}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

})(goola.api, goola.util, goola.ajax);
