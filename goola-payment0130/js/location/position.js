(function(api, util, ajax){
		setCookie('orgId',3)
		var city
		var type=util.getUrlParams("type")
		var path=util.getUrlParams("path")
		if(type==1){
			alert('无法获取您的定位信息，请选择收货地址进行定位')
		}
		var map = new AMap.Map("container", {
		        resizeEnable: true
		  	});
		  	//定位到当前位置，根据当前位置获取附近地址
		  	
		    //解析定位结果
		    function onComplete(data) {
		        AMap.service(["AMap.PlaceSearch"], function() {
		        var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
		            type: '商务住宅',
		            pageIndex: 1,
		            city: "", //城市
		            map: map
		        });
		        var cpoint = [data.position.getLng(), data.position.getLat()]; //中心点坐标
		        placeSearch.searchNearBy('', cpoint, 200, function(status, result) {
		        	$('#p-present').show()
					util.render("#panel", result, ".p-list ul");
					if(isWeiXin()){
	        			$('.content').css('position','fixed').css('top','0').css('width','100%')
	        			.css('height','100%').css('overflow','hidden')
	        		}else{
	        			$('.content').css('position','fixed').css('top','1.25rem').css('width','100%')
	        			.css('height','100%').css('overflow','hidden')
	        		}
	        		
	        		
		        });
	        });
		    }
		    //解析定位错误信息
		    function onError(data) {
		    	alert('抱歉！定位失败')
		    }
		    //根据地理位置获取经纬度
		   
		  	
		
		$('.ps-left').delegate('p','click',function(){
			$('.ps-left ul').css('display','block')
		})
		//点击除了class为ps-left标签以外的地方
		$("*").click(function (event) {
			if($('.ps-left ul').css('display')=='block'){
	            if (!$(this).hasClass("ps-left")){
	                $('.ps-left ul').css('display','none')
	            }
	            event.stopPropagation();   
           }
    	});

		$('.ps-left').delegate('li','click',function(){
			$('.ps-left p').html($(this).html())
			city=$('.ps-left p').html()
			$('.ps-left ul').css('display','none')
			$('.ps-right input').val('')
			$('#p-search').hide().find('ul').html('')
		})
		$('.p-present').click(function(){
			map.plugin('AMap.Geolocation', function() {
		        geolocation = new AMap.Geolocation({
		            enableHighAccuracy: true,//是否使用高精度定位，默认:true
		            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
		            buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
		            zoomToAccuracy: true,      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
		            buttonPosition:'RB'
		        });
		        map.addControl(geolocation);
		        geolocation.getCurrentPosition();
		        AMap.event.addListener(geolocation, 'complete', onComplete);//返回定位信息
		        AMap.event.addListener(geolocation, 'error', onError);      //返回定位出错信息
		    });
			
		})
		$('.pl-title a').click(function(){
			$('#p-present').hide()
			$('.content').css('position','').css('top','').css('width','100%')
			        	 .css('height','').css('overflow','')
		})
		
		if(!isWeiXin()){
			if( browser.versions.ios || browser.versions.android){
				$('#p-search').css('top','2.96875rem')
			}
		}
		//输入地址，根据输入地址搜索
		$('.ps-right input').bind('input propertychange',function(){
			AMap.service(["AMap.PlaceSearch"], function() {
			        var placeSearch = new AMap.PlaceSearch({ //构造地点查询类
			            pageIndex: 1,
			            city: $('.ps-left p').html(), //城市
			            map: map
			        });
			        //关键字查询
			       
			        placeSearch.search($('.ps-right input').val(),function(status, result){
			        	if(result.info){
			        		$('#p-search').show()
			        		util.render("#ps-list", result, "#p-search ul");
			        		if(isWeiXin()){
			        			$('.content').css('position','fixed').css('top','0').css('width','100%')
			        			.css('height','100%').css('overflow','hidden')
			        		}else{
			        			$('.content').css('position','fixed').css('top','1.25rem').css('width','100%')
			        			.css('height','100%').css('overflow','hidden')
			        		}
			        		
			        	}
			        	
			        });
			    });
			
		})
		$('.ps-right .delete').click(function(){
			$('.ps-right input').val('')
			$('#p-search').hide()
			$('.content').css('position','').css('top','').css('width','100%')
			        	 .css('height','').css('overflow','')
		})
		
		//获取开通网店城市
		getOpenCityName()
		function getOpenCityName(){
			ajax.post(api.baseServerUrl + "/organization/getOpenCitys",{
			},function(data) {
				util.render("#ps-left", data, ".ps-left");
				city=$('.ps-left p').html()
			    
			});
		}
		//获取收货地址列表
		function getAddressList(){
			ajax.post(api.baseServerUrl + "/addr/querySelectByUserId",{
			},function(data) {
				addressList = data.rows;
				util.render("#pa-content", data.rows, ".pa-content");
			});
		}
		ajax.post(api.baseServerUrl + "/user/openAuthority/isLogin",{
		},function(data) {
				getAddressList();
				$('.p-address').show()
				$('.bottom').show()
			},function(returnData){
				
			});
		
		
		//修改地址
		$('.pa-content').delegate('.address-change','click',function(){
			    var addr=$(this).parent().parent().parent()
			    $('.del').hide()
				$('.content').hide()
				$('.addAddress').show()
				$(".addAddress #name").val(addr.find('.name').html());
				$(".addAddress #phone").val(addr.find('.phone').attr("id"));
				$(".addAddress #address").val(addr.find('.address1').html());
				$(".addAddress #provinceName").val(addr.find('.provinceName').html());
				$(".addAddress #cityName").val(addr.find('.cityName').html());
				$(".addAddress #addressId").val(addr.attr('id'));
				$(".addAddress #provinceName_1").val(addr.find('.provinceName').html()+"-"+addr.find('.cityName').html())
				if (addr.find('.checked').length > 0) {
					$(".addAddress .default").addClass('checked');
				} else {
					$(".addAddress .default").removeClass('checked');
				}
				
		})	
		//添加新地址
		$('.bottom1').click(function(){
			$(".addAddress #name").val('');
			$(".addAddress #phone").val('');
			$(".addAddress #address").val('');
			$(".addAddress #provinceName").val('');
			$(".addAddress #cityName").val('');
			$(".addAddress #addressId").val('');
			$(".addAddress #provinceName_1").val('')
			$('.content').hide()
			$('.addAddress').show()
			$('.del').hide()
		})
		$('.address-add .default').click(function(){
			$(this).toggleClass('checked')
		})
		$('.addAddress .fanhui-btn').click(function(){
			$('.content').show()
			$('.addAddress').hide()
		})
		//保存地址
		$('.addAddress').delegate('.bottom','click',function(){
			saveAddress()
		})
		function saveAddress(){
			var name = $(".addAddress #name").val();
			var phone = $(".addAddress #phone").val();
			var address = $(".addAddress #address").val();
			var provinceName = $(".addAddress #provinceName").val();
			var cityName = $(".addAddress #cityName").val();
			var addressId = $(".addAddress #addressId").val();
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
			var isDefault = 2;
			if ($(".addAddress").find(".checked").length  > 0) {
				isDefault = 1;
			}
			//根据地理位置获取经纬度
		    AMap.service('AMap.Geocoder',function(){//回调函数
			    //实例化Geocoder
			    geocoder = new AMap.Geocoder({
			        //city: "010"//城市，默认：“全国”
			    });
			    //: 使用geocoder 对象完成相关功能
			})
		  	geocoder.getLocation(provinceName+cityName+address, function(status, result) {
			    if (status === 'complete' && result.info === 'OK') {
			    	ajax.post(api.baseServerUrl + "/addr/saveAddress",{
						"name":name,
						"phone":phone,
						"address":address,
						"provinceName":provinceName,
						"cityName":cityName,
						"addressId":addressId,
						"isDefault":isDefault
					},function(data) {
						getAddressList();
						$('.content').show()
						$('.addAddress').hide()
					});
			    }else{
			        //获取经纬度失败
			        
			    }
			}); 
			
			
		}
		
		//点击选择地址
		$('#p-present').delegate('li','click',function(){
			window._hmt && window._hmt.push(['_trackEvent',"定位", '输入地址']);
			setCookie('refresh','true',2/24/60)
		})
		$('#p-search').delegate('li','click',function(){
			window._hmt && window._hmt.push(['_trackEvent',"定位", '输入地址']);
			setCookie('refresh','false')
		})
		$('.body').delegate('.address-btn','click',function(){
			window._hmt && window._hmt.push(['_trackEvent',"定位", '输入地址']);
			setCookie('lat',$(this).attr('lat'))
		    setCookie('lng',$(this).attr('lng'))
		    setCookie('adr',$(this).find('h2').text())
		    setCookie('addressId','')
		    setCookie('shopLocation',1)
		    if(getCookie('firstLat')==null || getCookie('firstLat')==undefined || getCookie('firstLat')==''){
	        	setCookie('firstLat',$(this).attr('lat'))
	        	setCookie('firstLng',$(this).attr('lng'))
	        }
		    if(path=="shoplist"){
		    	window.location.href="../../shop/shoplist.html"
		    }else if(path=="shopinterest"){
		    	window.location.href="../../shop/shopinterest.html"
		    }else if(path=="seckill" ){
		    	window.location.href="../../seckill/seckill.html"
		    }else{
		    	if(getCookie('link')!=''&&getCookie('link')!=undefined && getCookie('link')!=null){
		    		window.location.href=getCookie('link')
		    		setCookie('link','')
		    	}else{
		    		window.location.href="../../index.html"
		    	}
		    }
		    
		})
		
		AMap.service('AMap.Geocoder',function(){//回调函数
			    //实例化Geocoder
			    geocoder = new AMap.Geocoder({
			        //city: "010"//城市，默认：“全国”
			    });
			    //: 使用geocoder 对象完成相关功能
			})
		//点击选择用户收货地址
		$('.pa-content').delegate('.address-info','click',function(){
				var adr1=$(this).find('.address1').text()
				var addressId=$(this).parent().attr('id')
				geocoder.getLocation($(this).find('.pa-address').text(), function(status, result) {
				    if (status === 'complete' && result.info === 'OK') {
				        //:获得了有效经纬度，可以做一些展示工作
				        //比如在获得的经纬度上打上一个Marker
				        setCookie('lat',result.geocodes[0].location.lat)
			   			setCookie('lng',result.geocodes[0].location.lng)
			   			setCookie('refresh','false')
			   			setCookie('adr',adr1)
			   			setCookie('addressId',addressId)
			   			setCookie('shopLocation',1)
			   			if(getCookie('firstLat')==null || getCookie('firstLat')==undefined || getCookie('firstLat')==''){
				        	setCookie('firstLat',result.geocodes[0].location.lat)
				        	setCookie('firstLng',result.geocodes[0].location.lng)
				        }
			   			window._hmt && window._hmt.push(['_trackEvent',"定位", '收货']);
			   			if(path=="shoplist"){
					    	window.location.href="../../shop/shoplist.html"
					    }else if(path=="shopinterest"){
					    	window.location.href="../../shop/shopinterest.html"
					    }else if(path=="seckill" ){
					    	window.location.href="../../seckill/seckill.html"
					    }else{
					    	if(getCookie('link')!=''&&getCookie('link')!=undefined && getCookie('link')!=null){
					    		window.location.href=getCookie('link')
					    		setCookie('link','')
					    	}else{
					    		window.location.href="../../index.html"
					    	}
					    }
				    }else{
				        //获取经纬度失败
				    }
				});
		})
		
	})(goola.api, goola.util, goola.ajax)
