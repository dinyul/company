(function(api, util, ajax){
	userShopListOutRange()
	var map = new AMap.Map("", {}),geolocation //已知点坐标
	if(getCookie('refresh')!='true' && getCookie('refresh')!='false' && getCookie('orgId')!=''){
		locationPoint()
		setInterval(locationPoint,120000)
	}else if(getCookie('refresh')=='true'){
		setInterval(locationPoint,120000)
	}
	
		function locationPoint() {
			if(isWeiXin()){
				ajax.post(api.baseServerUrl + "/location/openAuthority/getLocationConfig",{
					url:encodeURI(location.href.split('#')[0])
				},function(data) {
					wx.config({
						debug: false,
						appId: data.appid,
						timestamp: data.timeStamp,
						nonceStr: data.nonceStr,
						signature: data.signature,
						jsApiList: ['getLocation']
					});
					
					wx.ready(function () {
					//	7.2 获取当前地理位置
						wx.getLocation({
							type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
							success: function (res) {
							//根据定位信息获取网点
								var lag=new AMap.LngLat(res.longitude, res.latitude);
							    var lng=new AMap.LngLat(getCookie('lng'), getCookie('lat'));
							    var ss=lng.distance(lag);
						        //console.log(ss)
						        if(ss>500){
						        	setCookie('lat',res.latitude)
							        setCookie('lng',res.longitude)
							       // alert('距离'+ss+',将要刷新页面','/index.html')
									window.location.reload()
						        }
						        setCookie('refresh','true',2/24/60)
								setCookie('adr','')
								setCookie('addressId','')
							},
							cancel: function (res) {
								//定位失败 
								
							}
						});
					});
				});
			}
			
		}

	
	if( browser.versions.ios || browser.versions.android){
		if(!isWeiXin()){
			$('.app-top a').hide()
		}
	}
	//获取地址
	if(getCookie('adr')!='' && getCookie('adr')!=null && getCookie('adr')!=undefined){
		$("#orgName").html("送至："+getCookie('adr'));
	}else{
		regeocoder()
		
	}
    function regeocoder() {  //逆地理编码
        var geocoder = new AMap.Geocoder({
            radius: 1000,
            extensions: "all"
        });        
        geocoder.getAddress([getCookie('lng'), getCookie('lat')], function(status, result) {
            if (status === 'complete' && result.info === 'OK') {
                geocoder_CallBack(result);
            }
        });        
        
    }
    function geocoder_CallBack(data) {
        var address = data.regeocode.aois[0].name; //返回地址描述
        $("#orgName").html("送至："+address);
    }
    
    //超出范围店铺
    
    function userShopListOutRange() {
		ajax.post(api.baseServerUrl + "/inShop/justLocation/userShopListOutRange",{
			"lat":getCookie('lat'),"lng":getCookie('lng'),"locationType":1
		},function(data) {
			if(getCookie('shopLocation')!=1){
				window.location.href="/location/location.html"
			}
			if(data!=''&&data!=null&&data!=undefined){
				$('.nolist').show()
				var obj = {data:data,picUrl:api.picUrl};
				util.render("#list",obj, ".list1")
				$('.list1').find('.seckill-list ul').each(function(){
					$(this).css('width',(3.125+0.75)*$(this).find('li').length+0.34375-0.75+0.34375+'rem')
				})
			}
			
			
		},function(returndata){
			
		});
	}
    $('.body').delegate('.shop-li','click',function(){
    	window.location.href="shop.html?providerId="+$(this).attr('id')
    })
    $('.shoplist').delegate('.num','click',function(e){
    	e.stopPropagation()
    	addProductinCart($(this).parent().attr('goodsId'),0,0,1,-1)
    })
   /* $('.shoplist').delegate('.seckill-list li','click',function(e){
    	e.stopPropagation()
    	window.location.href="../../shangpin/shangpinxiangqing.html?goodsId="+$(this).attr('goodsId')
    })*/
    $('.shoplist').delegate('.num','click',addCart)

})(goola.api, goola.util, goola.ajax)