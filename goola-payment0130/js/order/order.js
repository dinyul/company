$(function(){

	var timer = null;
	$(".refrensh").fadeOut();
	$(".app-top a").attr("href","/gerenzhongxin/gerenzhongxin.html");

	if( $(".app-top").length == 0 ){
		$(".order-top").css("top","0");
		$(".order-list").css("marginTop","1.66rem")
	}

	(function(api,util,ajax){
		var type=util.getUrlParams("type");
		var pageSize = 20;
		
		allKindsCount();
		if(type!=undefined && type!=null && type!=''){
			orderList(type,pageSize)
		}else{
			orderList(1,pageSize);
			type = 1;
		}
			
		var currYear = (new Date()).getFullYear();	
			var currMonth = (new Date()).getMonth()+1
			var currDay = (new Date()).getDate()
			if(currMonth<10){
				var currMonth = "0"+(currMonth); 
			}
			if(currDay<10){
				 currDay = "0"+currDay; 
			}
			time=currYear+'-'+currMonth+'-'+currDay
		//顶部导航
		
		$('.order-top').delegate('a','click',function(){
			$(".refrensh").fadeOut();
			$('#orderInfo').html('')
			$(this).addClass('checked').siblings().removeClass("checked")	
			type = $(this).attr('id')
			pageSize = 20;
			orderList($(this).attr('id'),pageSize)
		})
			
		$(window).on("scroll", scrollEvent);

		function scrollEvent() { 
			var p = $(window).scrollTop(); 
			if( $(document).height() - p === $(window).height() ){	
				clearTimeout(timer);
				$(".refrensh").fadeIn(function(){
					timer = setTimeout(function(){
						pageSize += 20;
						orderList(type,pageSize);	
					},500)
				})
				
			}					
		}

		//修改发货时间
		$('.order-list').delegate('.xiugai','click',function(){
			
			$('.order-list').find('.xiugai').removeClass('selected')
			$(this).addClass('selected')
			$('.bg').show()
			$('.xiugaishijian').show()
			document.body.ontouchmove=function(){
				return false;
			}
			$('.xiugaishijian input').attr('value',$(this).prev().html())
			$('.shijian').html($(this).prev().html())
		})
		$('.xiugaishijian input').change(function(){
				$('.shijian').html($(this).val())
			})
		$('.queding').click(function(){
			$('.bg').hide()
			$('.xiugaishijian').hide()
			if(($('.xiugaishijian input').val()).replace(/-/g,"")<=time.replace(/-/g,"")){
						alert('不能早于'+time)
						return false
			}
			ajax.post(api.baseServerUrl + "/giftOrder/changeSendTime",{
				"orderId":$('.order-list').find('.selected').parent().parent().attr('id'),
				"newSendTime":$('.xiugaishijian input').val()
				},function(data) {
					window.location.reload()
				})
			
		})
		//取消订单
		$('.order-list').delegate('.offOrder','click',function(){
			offOrder($(this).parent().attr("id"));
		})
		//确认收货
		$('.order-list').delegate('.confirm','click',function(){
			confirm($(this).parent().attr("id"));
		})
		//催单
		$('.order-list').delegate('.cuidan','click',function(){
			cuidan($(this).parent().attr("id"));
		})
		$('.order-list').delegate('.xiangqing','click',function(){
			var orderId = $(this).parent().parent().parent().find(".order-payment").attr("id");
			window.location.href="../order/dingdanxiangqing.html?orderId="+orderId;
		})
		
		//顶部导航获取
		function allKindsCount(){
			ajax.post(api.baseServerUrl + "/order/allKindsCount",{
			},function(data) {
				util.render("#allKindsCountTmpl",data,"#allKindsCount")
				if(type!=undefined && type!=null && type!=''){
					$('.order-top a').removeClass('checked')
					$('.order-top #'+type+'').addClass('checked')
				}
			})
		}
		//订单列表获取
		function orderList(type,pageSize){
			var len = $(".order-list .order-content").length
			$(".refrensh").fadeOut()
			if(pageSize-len > 20){
				pageSize -= 20;	
				return false
			}
			ajax.post(api.baseServerUrl + "/order/queryOrderInfo",{
				type: type,
				pageSize:pageSize
			},function(data) {
				var obj = {data:data.rows, picUrl: api.picUrl}
				util.render("#orderInfoTmpl", obj, "#orderInfo")
				if(pageSize > 20){
					$(window).scrollTop($(window).scrollTop() + 20)
				}		
				$('.fahuoshijian').each(function(){
					if($(this).html()<=time){
						$(this).parent().parent().find('.xiugai').hide()
					}
				})
			})	
		}
		/**
		 * 取消订单
		 */
		function offOrder(orderId){
			ajax.post(api.baseServerUrl + "/order/cancelOrder",{
				"orderId":orderId	
			},function(data) {
				window.location.href="../order/wodedingdan.html";
			})
		}
		/**
		 * 确定收货
		 * @param openId
		 * @param orderId
		 */
		function confirm(orderId){
			ajax.post(api.baseServerUrl + "/order/completeOrder",{
				"orderId":orderId	
			},function(data) {
				window.location.href="../order/wodedingdan.html";
			})
		}
		/*催单*/
		function cuidan(orderId){
			$("#cuidan"+orderId).one('click', function (event) {    
				 event.preventDefault();    
				 //do something    
				 $(this).prop('disabled', true);   
		 });
			
			alert("已催单,Please wait...");
		}
		var title="更好甄选—更好·不贵"
		var doc="种草全世界的好货"
		shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),title,doc,"http://" + document.domain + "/index.html","http://" + document.domain +"/imgs/shouye-share.png");
	})(goola.api, goola.util,goola.ajax)
});

