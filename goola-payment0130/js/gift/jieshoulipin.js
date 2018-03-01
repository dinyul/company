(function(api,util,ajax){
		var giftKey = util.getUrlParams("giftKey");
			
		var goodsInfo;
		var isBatchOrder;
		var choosedSendTime;
		var goods1="";
		var orderId;
		lipin(giftKey)
		function lipin(giftKey){
			ajax.post(api.baseServerUrl + "/giftOrder/orderDetail",{
				"key":giftKey	
			},function(data) {
				util.render("#lipin-list", data, ".lipin-list ul");
				orderId=data.orderId
				var goods2={}
				$('.lipin-list ul').find('li').each(function(){  
				   if($(this).attr('id')=="1820"||$(this).attr('id')=="1821"){
				   		$('.tishi').css('display','block')
				   }
				   goods2.goodsId=$(this).attr('id')
				   goods2.buyCount=$(this).find('.goodsCount').html()
				   goods1=JSON.stringify(goods2)+','+goods1
				   
				})	
				goods1=goods1.substring(0,goods1.length-1)
				goodsInfo='['+goods1+']'
				});
				
		}
	
		$('.information').delegate('.address-save','click',function(){
			saveAddress()
		})
		$('.lipin-list').delegate('li','click',function(){
			window.location.href="../shangpin/shangpinxiangqing.html?goodsId="+$(this).attr('id')
		})
		var currYear = (new Date()).getFullYear();	
		var currMonth = (new Date()).getMonth()+1
		var currDay = (new Date()).getDate()
		if(currMonth<10){
			var currMonth = "0"+(currMonth); 
		}
		if(currDay<10){
			 currDay = "0"+currDay; 
		}
		var time=currYear+'-'+currMonth+'-'+currDay
	$('.fahuoshijian').click(function(){
		
		var latestDeliveryDate
		$(".lipin").hide();
		$('#selectTime').load("../../order/choice-time.html",null,function(){
			if(isBatchOrder==2){
				$("#appDate").attr('value',time)
				$('.shijian').html(time)
				gouwuche()
				$('.time').find('#2').addClass('choice-btn')
				$('.time').find('#2').parent().parent().find('.show').show()
				$('.time').find('#1').removeClass('choice-btn')
				$('.time').find('#1').parent().parent().find('.show').hide()
			}else if(isBatchOrder==1){
				util.render("#content-list1", eval('(' + goodsList + ')'), ".choice-cycle");
				$("#appDate").attr('value',time)
				$('.time').find('#1').addClass('choice-btn')
				$('.time').find('#1').parent().parent().find('.show').show()
				$('.time').find('#2').removeClass('choice-btn')
				$('.time').find('#2').parent().parent().find('.show').hide()
				$('.shijian').html(time)
			}else{
				gouwuche()
				$("#appDate").attr('value',time)
				$('.shijian').html(time)
			}
			
			function gouwuche(){
				goodsInfo='['+goods1+']'
					ajax.post(api.baseServerUrl + "/goods/queryGoodsByGoodsJson",{
						"buyGoodsJson":goodsInfo
					},function(data) {
						util.render("#content-list", data, ".choice-cycle");
						
					});
				}
			isBatchOrder=$('.choice-btn').attr('id')
			$('#appDate').change(function(){
				$('.shijian').html($(this).val())
			})
			
			$('.time').delegate('.btn','click',function(){
				$('.time .btn').removeClass('choice-btn').addClass('a')
				$(this).addClass('choice-btn').removeClass('a')
				$('.a').parent().parent().find('.show').slideUp()
				$(this).parent().parent().find('.show').slideDown()
				isBatchOrder=$(this).attr('id')
				
			})
			
  				
			
			$('.time').delegate('.week a','click',function(){
				$(this).parent().next().slideToggle()
			})
			$('.time').delegate('.week-choice li','click',function(){
				$(this).parent().parent().parent().parent().find('.week').attr('planType','')
				$(this).parent().parent().css('display','none')
				$(this).parent().parent().parent().find('.week p').html($(this).html())
				if($(this).html()=="每月"){
					$(this).parent().parent().parent().find('.day').html('<input type="day" value="1"/>日')
					$(this).parent().parent().parent().parent().find('.day').attr('planDay',1)
					
				}else{
					$(this).parent().parent().parent().find('.day').html('<p>星期五</p><a></a>')
				$(this).parent().parent().parent().parent().find('.day').attr('planDay',6)
					
				}
				$(this).parent().parent().parent().parent().find('.week').attr('planType',$(this).attr('planType'))
				
			})
			$('.time').delegate('.day a','click',function(){
				$(this).parent().next().slideToggle()
			})
			$('.time').delegate('.day-choice li','click',function(){
				$(this).parent().parent().parent().parent().find('.day').attr('planDay','')
				$(this).parent().parent().css('display','none')
				$(this).parent().parent().parent().find('.day p').html($(this).html())
				$(this).parent().parent().parent().find('.day').addClass($(this).attr('id'))
				$(this).parent().parent().parent().parent().find('.day').attr('planDay',$(this).attr('planDay'))
			})
			$('.time').delegate('.day input','blur',function(){
				$(this).parent().parent().parent().find('.day').attr('planDay',$(this).val())
				if($(this).val()>31||$(this).val()==''||$(this).val()<=0){
					alert("请重新选择日期")
					$(this).val('1')
				}
				
			})
			$('.time').delegate('.cont-num input','blur',function(){
				if(Number($(this).parent().parent().find('.shuliang').html())/$(this).val()<1){
					alert('单次发货数量不得大于总数量')
					$(this).val('1')
				}
				var a=Number($(this).parent().parent().find('.shuliang').html())/$(this).val()
				if(parseInt(a)==a){	
					a=a
				}else{
					a=parseInt(a)+1
				}
				$(this).next().find('a').html(a)
				$(this).parent().parent().attr('singlesendcount',$(this).val())
			})
			$('.time #fanhui').click(function(){
				$('#selectTime').html('')
				$(".lipin").show();
				isBatchOrder=2
			})
			$('.time-confirm').click(function(){
				var arr=''
				$('.choice-cycle .shop1').each(function(){
					arr=$(this).find('.title p').html()+','+arr
				})
				arr=(arr.substring(0,arr.length-1)).split(',')
				function unique(arr) {
			      var result = [], hash = {};
				    for (var i = 0, elem; (elem = arr[i]) != null; i++) {
				        if (!hash[elem]) {
				            result.push(elem);
				            hash[elem] = true;
				        }
				    }
				    return result;
			 	}
				if((isBatchOrder==1)&&(unique(arr).length>1)){
					alert("多供应商的商品订单不支持发货周期的制定")
					return false
				}
				if(isBatchOrder==2){
					choosedSendTime=$('#appDate').val()
					time=choosedSendTime
					goodsInfo=''
					var arrDay=[]
					$('.content-list').find('.lis').each(function(){
						arrDay.push(($(this).attr('latestDate').split(' ')[0]).replace(/-/g,""))
					})
					latestDeliveryDate=Math.min.apply(null,arrDay)
					if(choosedSendTime.replace(/-/g,"")>latestDeliveryDate){
						alert('商品可支持的最晚发货时间为'+latestDeliveryDate+',请重新设置')
						return false
					}
					$('#time-select').html(choosedSendTime)
					$('#selectTime').html('')
					$(".lipin").show();
				}
				if(isBatchOrder==1){
					$('#time-select').html("去查看")
					choosedSendTime=""
					goodsList=""
					var obj2=""
					var obj1={}
					var itemss=$('.content-list').find('.lis')
					itemss.each(function(){
						obj1.goodsId=$(this).attr('id')
						obj1.buyCount=$(this).attr('buyCount')
						obj1.planType=$(this).find('.week').attr('planType')
						obj1.planDay=$(this).find('.day').attr('planDay')
						obj1.singleSendCount=$(this).attr('singleSendCount')
						obj2=JSON.stringify(obj1)+','+obj2
					})
						obj2=obj2.substring(0,obj2.length-1)
					
					goodsInfo='['+obj2+']'	

					var goodsList1={}
					itemss.each(function(){
						goodsList1.goodsId=$(this).attr('id')
						goodsList1.buyCount=$(this).attr('buyCount')
						goodsList1.planType=$(this).find('.week').attr('planType')
						goodsList1.planDay=$(this).find('.day').attr('planDay')
						goodsList1.singleSendCount=$(this).attr('singleSendCount')
						goodsList1.goodsName=$(this).find('.goodsname').html()
						goodsList1.providerName=$(this).parent().find('.providername').html()
						goodsList1.zhouqishu=$(this).find('.zhouqishu').html()
						goodsList1.cycle=$(this).attr('cycle')
						goodsList1.latestDeliveryDate=$(this).attr('latestDate')
						goodsList1.isDeliveryPlan=$(this).attr('isDeliveryPlan')
						goodsList=JSON.stringify(goodsList1)+','+goodsList
					})
					
					goodsList=goodsList.substring(0,goodsList.length-1)
					goodsList='['+goodsList+']'	
					
					var checkGoods=''
					var checkGoods1={}
					$('.content-list').find('.lis1').each(function(){
						checkGoods1.goodsName=$(this).find('.goodsname').html()
						checkGoods1.buyCount=$(this).attr('buyCount')
						checkGoods1.singleSendCount=$(this).attr('singleSendCount')
						checkGoods1.planType=$(this).find('.week').attr('planType')
						checkGoods1.planDay=$(this).find('.day').attr('planDay')
						checkGoods1.latestDate=$(this).attr('latestDate').split(' ')[0]
						checkGoods=JSON.stringify(checkGoods1)+','+checkGoods
					})
					
					checkGoods=checkGoods.substring(0,checkGoods.length-1)
					checkGoods='['+checkGoods+']'	
					ajax.post(api.baseServerUrl + "/goods/checkGoodsLatestSend",{
						"buyGoodsJson":checkGoods
					},function(data) {
						$('#selectTime').html('')
						$(".lipin").show();
					});

				}

			})
			
		});
	})
		//保存地址
		function saveAddress(){
			var name = $("#name").val();
			var phone = $("#phone").val();
			var address = $("#address").val();
			var provinceName = $("#provinceName").val();
			var cityName = $("#cityName").val();
			var addressId = $("#addressId").val();
			if(name==""){
				alert("请输入联系人姓名！");
				return;
			}
			if(phone == ""){
				 alert("请输入联系方式");
				 return;
			 }else{
				if(!(/^1[3|4|5|7|8]\d{9}$/.test(phone))){
					alert("请输入合法手机号码");
					return false; 
				}  
			 }
			if(address==""){
				alert("请输入详细地址")
				return;
			}
			if(provinceName==""){
				alert("请选择所在地区")
				return;
			}
			$('.bg').show()
			$('.address-firm').show()
			document.body.ontouchmove=function(){
						return false;
				}
			$('.confirm').unbind('click').click(function(){
				$(this).parent().parent().hide()
				$('.bg').hide()
				document.body.ontouchmove=function(){
					return true;
				}
				ajax.post(api.baseServerUrl + "/giftOrder/finishAddress",{
						"orderId":orderId,
						"name":name,
						"phone":phone,
						"provinceName":provinceName,
						"cityName":cityName,
						"address":provinceName+cityName+address,
						"url": window.location.hostname+"/gift/gift-order.html",
						"isBatchOrder":isBatchOrder,
						"choosedSendTime":choosedSendTime,
						"buyGoodsJson":goodsInfo
					},function(data) {
							window.location.href="../payment/tianxiechenggong.html"
					});
			})
		}
		
		$('.cancel').click(function(){
			$('.bg').css('display','none')
			$('.address-firm').css('display','none')
			document.body.ontouchmove=function(){
					return true;
				}
		})

	var title="更好甄选—更好·不贵"
	var doc="种草全世界的好货"
	shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),title,doc,"http://" + document.domain + "/index.html","http://" + document.domain +"/imgs/shouye-share.png");
	})(goola.api,goola.util,goola.ajax)