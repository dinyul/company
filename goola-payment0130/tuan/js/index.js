(function(api, util, ajax){

	
	$(".refrensh").fadeOut();
	//我的拼团悬浮功能
	var block = $(".mineGroup")[0]
	var oW,oH;
	var pageSize = 10,timer = null;
	block.addEventListener("touchstart", function(e) {
		var touches = e.touches[0];
		oW = touches.clientX - block.offsetLeft;
		oH = touches.clientY - block.offsetTop;
	},false)
	block.addEventListener("touchmove", function(e) {
		e.preventDefault()
		var touches = e.touches[0];
		var oLeft = touches.clientX - oW;
		var oTop = touches.clientY - oH;
		if(oLeft <= 0) {
			oLeft = 0;
		}else if(oLeft >= document.documentElement.clientWidth - block.offsetWidth) {
			oLeft = (document.documentElement.clientWidth - block.offsetWidth);
		}else if(oTop <= 0){
			oTop = 0
		}else if(oTop >= document.documentElement.clientHeight - block.offsetHeight){
				oTop = (document.documentElement.clientHeight - block.offsetHeight);
		}
		block.style.left = oLeft + "px";
		block.style.top = oTop + "px";
	},false);	
	block.addEventListener("touchend",function(e) {
	},false);




	var s;
	list1('')


	$(window).off("scroll").on("scroll", function(){
		scrollEvent(list1,"")
	});

	
	$('nav').delegate('li','click',function(){
		pageSize = 10;
		$('nav').find('li').removeClass('checked')
		$(this).addClass('checked')
		$('.list').find('.list1').show()
		if($('.checked').html()=="全部"){
			s=''
		}else{
			s=$('.checked').attr('id')
		}
		list1(s)
		$('.t-title div').removeClass('checked')
		$('.a1').parent().addClass('checked')
		$('.list').find('ul').hide()
		$('.list').find('.list1').show()
		$(window).off("scroll").on("scroll", function(){
			scrollEvent(list1,s)
		});
	})

	
	$('.t-title div').click(function(){
		pageSize = 10;
		$('.t-title div').removeClass('checked')
		$(this).addClass('checked')
		$('.list').find('ul').hide()
		var i=$(this).find('a').attr('id')
		$('.list').find('.list'+i).show()
		var cb = null;
		if(i==2){
			if($('.checked').html()=="全部"){
				s=''
			}else{
				s=$('.checked').attr('id')
			}
			cb = list2;
			list2(s)
		}else{
			
			if($('.checked').html()=="全部"){
				s=''
			}else{
				s=$('.checked').attr('id')
			}
			cb = list1
			list1(s)
		}
		$(window).off("scroll").on("scroll", function(){
			scrollEvent(cb,s)
		});
	})

	

	function scrollEvent(cb,pageId) { 
		var p = $(window).scrollTop(); 
		if( $(document).height() - p === $(window).height() ){	
			clearTimeout(timer);
			$(".refrensh").fadeIn(function(){
				timer = setTimeout(function(){
					pageSize += 10;
					cb(pageId,pageSize);	
				},500)
			})
			
		}					
	}




	function list1(pageCategoryId){
		var len = $(".list1 li").length
		$(".refrensh").fadeOut()
		if(pageSize-len > 10){
			pageSize -= 10;	
			return false
		}
		ajax.post(api.baseServerUrl + "/gb/requireLocation/qureyGroupBuyingPage",{
			"pageCategoryId":pageCategoryId,"pageType":2,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1,pageSize: pageSize
		},function(data) {
			var obj = {data:data,picUrl:api.picUrl};
			util.render("#list1",obj, ".list1")
			updateEndTime()
			if(pageSize > 10){
				$(window).scrollTop($(window).scrollTop() + 20)
			}	
		});
	}
	
	function list2(pageCategoryId){
		var len = $(".list2 li").length
		$(".refrensh").fadeOut()
		if(pageSize-len > 10){
			pageSize -= 10;	
			return false
		}
		ajax.post(api.baseServerUrl + "/gb/requireLocation/queryJoinBuyingList",{
			"pageCategoryId":pageCategoryId,"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1,pageSize: pageSize
		},function(data) {
			var obj = {data:data,picUrl:api.picUrl}
			util.render("#list2",obj,".list2")
			updateEndTime()
			if(pageSize > 10){
				$(window).scrollTop($(window).scrollTop() + 20)
			}	
		})
	}
	nav()
	
	function nav(){
		ajax.post(api.baseServerUrl + "/gb/requireLocation/qureyGroupBuyingCategoryPage",{
			"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
		},function(data) {
			util.render("#nav",data, "nav ul")
			$('nav ul').css('width',1.796875*$('nav ul').find('li').length+'rem')
		});
	}
	
	picurl()
	function picurl(){
		ajax.post(api.baseServerUrl + "/gb/requireLocation/qureyGroupBuying",{
			"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
		},function(data) {
			$('.tuan-banner').attr('src',"/image/"+data[0].banner)
			shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),data[0].shareTitle,data[0].shareContent,location.href,"http://"+ document.domain +api.picUrl + data[0].sharePicture);
		});
	}
	
	
	
})(goola.api, goola.util, goola.ajax);