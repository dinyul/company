(function(api, util, ajax){

	showBanner();
	//getGoolaOrgInfo();
	getPromotionInfo();
	
	//获取首页banner
	function showBanner(){
		ajax.post(api.baseServerUrl + "/banner/getTopBanners",{
			"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
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
	//获取首页信息
	function getPromotionInfo() {
		ajax.post(api.baseServerUrl + "/mod/getModules",{
			"pageType":1,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
		},function(data) {
			var obj = {data:data.rows,picUrl:api.picUrl};
			util.render("#moduleTmpl",obj, "#module")
			seckill()
			rankinglist()
			tuan()
			subject()
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
				window.location.href = "../shangpin/shangpinxiangqing.html?goodsId=" + banner.parent().attr("goodsId");
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
	
	//首页限时抢购模块
	
	//限时抢购首页时间获取
	function seckill(){
		ajax.post(api.baseServerUrl + "/fs/requireLocation/queryAllLimitStartTime",{
		"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
	},function(data) {
			if(data.length==0 || data==undefined || data==null || data==''){
				$('.seckill').hide()
			}else{
				$('.seckill').show()
			
			var obj = {data:data,picUrl:api.picUrl};
			util.render("#seckill-nav",obj, ".seckill-nav ul")
			var initialSlide=$('.seckill-nav li').index($('.checked'))
			var swiper = new Swiper('.seckill-nav', {
		        slidesPerView: "auto",
		        paginationClickable: true,
		        freeMode: true,
		        initialSlide :initialSlide,
		        paginationType : false
		    });
			//$('.seckill').find('.seckill-nav ul').css('width',2*$('.seckill').find('.seckill-nav li').length+'rem')
			aa()
			if($('.seckill-nav').find('.checked').length!=0){
				$('.seckill-nav').find('.checked:gt(0)').removeClass('checked')
				navSeckill($('.seckill-nav').find('.checked').attr('limitStartTime'))
				//startCountDown($('.seckill-nav').find('.checked').attr('limitEndTime'))
			}else{
				$('.seckill-nav').find('ul li:first').addClass('checked')
				navSeckill(data[0].limitStartTime)
				if(data[0].activityStatus==3){
					$('.seckill-list-title').html('即将开始，先加购物车')
				}else if(data[0].activityStatus==5){
					$('.seckill-list-title').html('活动已结束')
				}
			}
			
			}
		});
	}
	
		
	//显示抢购根据时间获取商品列表
	function navSeckill(limitStartTime) {
		ajax.post(api.baseServerUrl + "/fs/requireLocation/queryFsActivityForHomePage",{
			"limitStartTime":limitStartTime,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
		},function(data) {
			var obj = {data:data,picUrl:api.picUrl};
			util.render("#seckill-list",obj, ".seckill-list ul")
			var swiper = new Swiper('.swiper-seckill', {
		        slidesPerView: 'auto',
		        paginationClickable: true,
		        freeMode: true
		    });
		});
	}
	
	//限时抢购tab切换
	$('#module').delegate('.seckill-nav li','click',function(){
		$('.seckill').find('.seckill-nav li').removeClass('checked')
		$(this).addClass('checked')
		navSeckill($('.seckill-nav').find('.checked').attr('limitStartTime'))
		/*if($(this).find('p').html()=='已结束'){
			clearInterval(interval)
			$('.seckill-list').find('.seckill-list-title').html('活动已结束')
		}else if($(this).find('p').html()=='进行中'){
			startCountDown($('.seckill-nav').find('.checked').attr('limitendtime'))
		}else if($(this).find('p').html()=='未开始'){
			clearInterval(interval)
			$('.seckill-list').find('.seckill-list-title').html('活动未开始')
		}*/
	})
	function aa(){
		$('.seckill').find('li').each(function(){
			var nowtime=new Date()
		    var limitStartTime=new Date((nowtime.getMonth()+1)+" "+nowtime.getDate()+", "+nowtime.getFullYear()+" "+$(this).attr('limitStartTime')).getTime()
			var limitEndTime=new Date((nowtime.getMonth()+1)+" "+nowtime.getDate()+", "+nowtime.getFullYear()+" "+$(this).attr('limitEndTime')).getTime()
		    nowtime=nowtime.getTime()
		    if(Number(nowtime)<Number(limitStartTime)){
		    	$(this).find('p').html("未开始")
		    }else if(Number(nowtime)>Number(limitStartTime) && Number(nowtime)<Number(limitEndTime)){
		    	$(this).find('p').html("进行中")
		    }else if(Number(nowtime)>Number(limitEndTime)){
		    	$(this).find('p').html("已结束")
		    }
		})
	}
	//setInterval(aa,1000);
	
	$('#module').delegate('.seckill-title','click',function(){
		window.location.href='../seckill/seckill.html'
	})
	$('#module').delegate('.seckill-list li','click',function(){
		window.location.href='../seckill/seckill.html?goodsId='+$(this).attr('goodsId')+'&id='+$(this).attr('id')+"&type="+$('.seckill-nav').find('.checked').attr('limitStartTime')
	})
	
	
	var EndTime = 0;
		//倒计时
	function GetRTime(){
		var NowTime = new Date();
		var t =EndTime - NowTime.getTime();
		if(t <= 0){
			$('.seckill-list').find('.seckill-list-title').html('活动已结束')
		}else{
			var d=Math.floor(t/1000/60/60/24);
			if(d<10){
				d='0'+d
			}
			var h=Math.floor(t/1000/60/60%24);
			if(h<10){
				h="0"+h
			}
			var m=Math.floor(t/1000/60%60);
			if(m<10){
				m='0'+m
			}
			var s=Math.floor(t/1000%60);
			if(s<10){
				s='0'+s
			}
			$(".seckill-list-title").html('距离结束剩余：'+h+"时"+m+"分"+s+"秒");
		}
	}
	//开始倒计时
	function startCountDown(time){
		var date1=new Date()
		var time11=date1.getFullYear()+'/'+(date1.getMonth()+1)+'/'+date1.getDate()+" "+time
		var endTime = new Date(time11)
		EndTime =endTime.getTime()
		interval=setInterval(GetRTime,0);
	}
	//搜索
	$('.search').click(function(){
		window.location.href='../search/search.html'
	})
	
	//拼团模块
	
	function tuan() {
		ajax.post(api.baseServerUrl + "/gb/requireLocation/qureyGroupBuyingPage",{
			"pageType":1,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1,"pageSize":10
		},function(data) {
			if(data!='' && data!=undefined && data!=null){
				$('.tuan').show()
				var obj = {data:data,picUrl:api.picUrl};
				util.render("#tuan-content",obj, ".tuan-content .swiper-wrapper")
				
				var swiper = new Swiper('.tuan-content', {
			        pagination: '.tuan-pagination',
			        paginationType: 'progress'
			    });
			}
			
		});
	}
	//拼团活动
	
	
	//顶部导航
	
	indexNav()
	function indexNav(){
		ajax.post(api.baseServerUrl + "/navigation/openAuthority/getNavigation",{
		},function(data) {
			util.render("#index-nav",data,".index-nav ul")
			var swiper = new Swiper('.swiper-nav', {
		        slidesPerView: 'auto',
		        paginationClickable: true,
		        freeMode: true
		    });
		})
	}
	
	
	
	
	
	function rankinglist(){
		ajax.post(api.baseServerUrl + "/goodsRank/requireLocation/recommentList",{
			"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
		},function(data) {
			if(data!='' && data!=undefined && data!=null && data.length!=0){
				$('.rankinglist').show()
				var obj = {data:data,picUrl:api.picUrl}
				util.render("#list",obj,".rankinglist .list")
				$('.rankinglist li').click(function(){
					window.location.href="../shangpin/shangpinxiangqing.html?goodsId="+$(this).attr('goodsId')
				})
			}
			
		})
	}
	
	function subject(){
		ajax.post(api.baseServerUrl + "/subject/grass/openAuthority/list",{
			"pageType":1,"isIndex":1,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
		},function(data) {
			if(data.rows!='' && data.rows!=undefined && data.rows!=null && data.rows.length!=0){
				$('.subject').show()
				var obj = {data:data.rows,picUrl:api.picUrl};
				util.render("#subject",obj, ".subject ul")
				var swiper = new Swiper('.swiper-subject', {
			        slidesPerView: 'auto',
			        paginationClickable: true,
			        freeMode: true
			    });
			}
		})
	}
	//更好说
	ajax.post(api.baseServerUrl + "/betterWaysShopping/openAuthority/getBetterWaysShopping",{
		},function(data) {
			if(data.comment){
				$('.index-ad').show()
				$('.index-ad p').html(data.comment)
				$('.index-ad').click(function(){
					window.location.href=data.url
				})
			}
			
		})
	
	var title="更好甄选—更好·不贵"
	var doc="种草全世界的好货"
	shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),title,doc,"http://" + document.domain + "/index.html","http://" + document.domain +"/imgs/shouye-share.png");

})(goola.api, goola.util, goola.ajax);
