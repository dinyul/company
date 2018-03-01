(function(api, util, ajax){

	var goodsId = util.getUrlParams("goodsId");
	var ids = util.getUrlParams("id");
	var type=util.getUrlParams("type");
	var interval
	//获取时间列表
	ajax.post(api.baseServerUrl + "/fs/requireLocation/queryAllLimitStartTime",{
		"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
	},function(data) {
		if(data.length==0 || data==undefined || data==null || data==''){
			$('#empty').show()
		}else{
			$('.seckill-nav').show()
			$('.seckill-list').show()
			$('.footer-logo').show()
			var obj = {data:data,picUrl:api.picUrl,type:type};
			util.render("#seckill-nav",obj, ".seckill-nav ul")
			//$('.seckill').find('.seckill-nav ul').css('width',2*$('.seckill').find('.seckill-nav li').length+'rem')
			if($('.seckill-nav').find('.checked').length!=0){
				$('.seckill-nav').find('.checked:gt(0)').removeClass('checked')
				if(ids!='' && ids!=undefined && ids!=null){
					navSeckill($('.seckill-nav').find('.checked').attr('limitStartTime'),ids)
				}else{
					navSeckill($('.seckill-nav').find('.checked').attr('limitStartTime'),$('.seckill-nav').find('.checked').attr('id'))
				}
				
				//startCountDown($('.seckill-nav').find('.checked').attr('limitEndTime'))
			}else{
				$('.seckill-nav').find('ul li:first').addClass('checked')
				if(ids!='' && ids!=undefined && ids!=null){
					navSeckill(data[0].limitStartTime,ids)
				}else{
					navSeckill(data[0].limitStartTime,data[0].id)
				}
				/*if(data[0].activityStatus==3){
					$('.sl-title').html('即将开始，先加购物车')
				}else if(data[0].activityStatus==5){
					$('.sl-title').html('活动已结束')
				}*/
			}
			if($('.checked').find('p').html()=='已结束'){
				clearInterval(interval)
				$('.sl-title').html('活动已结束')
			}else if($('.checked').find('p').html()=='进行中'){
				startCountDown($('.seckill-nav').find('.checked').attr('limitendtime'))
			}else if($('.checked').find('p').html()=='未开始'){
				clearInterval(interval)
				$('.sl-title').html('即将开始，先加购物车')
			}
			
			
			var initialSlide=$('.seckill-nav li').index($('.checked'))
			var swiper = new Swiper('.seckill-nav', {
		        pagination: '.seckill-nav1',
		        slidesPerView: 5,
		        paginationClickable: true,
		        spaceBetween: 30,
		        freeMode: true,
		        initialSlide :initialSlide,
		        paginationType : false
		    });
		}
	});
	//显示抢购根据时间获取商品列表
	function navSeckill(limitStartTime,id){
		ajax.post(api.baseServerUrl + "/fs/requireLocation/queryFsActivityDetailByFsActivityId",{
			"id":id,
			"limitStartTime":limitStartTime,
			"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
		},function(data) {
			var obj = {data:data,picUrl:api.picUrl,goodsId:goodsId};
			util.render("#sl-first",obj, ".sl-first")
			util.render("#sl-conent",obj, ".sl-conent")
		});
	}
	//判断时间状态
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
	setInterval(aa,1000);
	
	
	//限时抢购tab切换
	$('.seckill').delegate('.seckill-nav li','click',function(){
		$('.seckill').find('.seckill-nav li').removeClass('checked')
		$(this).addClass('checked')
		navSeckill($('.seckill-nav').find('.checked').attr('limitStartTime'),$('.seckill-nav').find('.checked').attr('id'))
		if($(this).find('p').html()=='已结束'){
			clearInterval(interval)
			$('.sl-title').html('活动已结束')
		}else if($(this).find('p').html()=='进行中'){
			clearInterval(interval)
			startCountDown($('.seckill-nav').find('.checked').attr('limitendtime'))
		}else if($(this).find('p').html()=='未开始'){
			clearInterval(interval)
			$('.sl-title').html('即将开始，先加购物车')
		}
		
	})

	$('.seckill').delegate('.seckill-list .sl-goods','click',function(){
		window.location.href="../../shangpin/shangpinxiangqing.html?goodsId="+$(this).parent().attr('goodsId')
	})
	$('.seckill').delegate('.seckill-list .sl-message','click',function(){
		window.location.href="../../shangpin/shangpinxiangqing.html?goodsId="+$(this).parent().attr('goodsId')
	})
	$('.seckill').delegate('.seckill-list .sl-btn .add-card','click',function(){
		window.location.href="../../shangpin/shangpinxiangqing.html?goodsId="+$(this).parent().parent().attr('goodsId')
	})
	
	//$('.seckill').delegate('.seckill-list .sl-btn .add-card',"click",addCart)
	//var sss=0
	/*$('.seckill').delegate('.seckill-list .sl-btn .add-card','click',function(){
		var aaa=getCookie('3goolaNew').split('$')
		for(var i=0;i<aaa.length;i++){
			if((aaa[i].split('||')[0]).replace('|','')==$(this).parent().parent().attr('goodsId')){
				sss=aaa[i].split('||')[3]
			}
		}
		var quantity=$(this).parent().parent().find('.sl-goods a')
		if(quantity.attr('id')==sss && quantity.attr('id')!=undefined){
			alert('数量达限购上限，已按原价添加到购物车')
		}
		
		addProductinCart($(this).parent().parent().attr('goodsId'),$(this).parent().parent().find('.sl-price span'),$(this).parent().parent().find('.sl-oldprice span'),1,-1)
		//quantity.attr("id",quantity.attr("id")-1)
		
	})*/
	$('.seckill').delegate('.seckill-list .sl-btn .wks',"click",addCart)
	
	$('.seckill').delegate('.seckill-list .sl-btn .wks','click',function(){
		addProductinCart($(this).parent().parent().attr('goodsId'),$(this).parent().parent().find('.sl-price span'),$(this).parent().parent().find('.sl-oldprice span'),1,-1)
		
	})
	
		var EndTime = 0;
		//倒计时
		function GetRTime(){
			var NowTime = new Date();
			var t =EndTime - NowTime.getTime();
			
			if(t <= 0){
				$(".sl-title").html('本场已结束，看看其他场')
				$('.sl-jd-jxz').removeClass('sl-jd-jxz').html('<p>下次再来</p>').addClass('sl-jd-yjs')
				$('.sl-jd-yjs').parent().next().html('<a class="yjs"><img src="../imgs/seckill/icon6.png"/></a>')
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
				$(".sl-title").html("距离结束剩余：<span>"+h+"时"+m+"分"+s+'秒</span>');
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
		//1492669451479
		
		shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),"更好秒杀专场","我正在更好商城整点1元秒杀中，快来帮我一起抢好货！",location.href,"http://"+ document.domain +"/imgs/seckill/share.png");
	
		
})(goola.api, goola.util, goola.ajax);