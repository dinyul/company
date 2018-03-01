function scanQRCode(theajax, serverUrl, url,shopId) {
	theajax.post(serverUrl + "/shop/getLocationConfig",{
		url:encodeURI(url)
	},function(data) {
		wx.config({
			debug: false,
			appId: data.appid,
			timestamp: data.timeStamp,
			nonceStr: data.nonceStr,
			signature: data.signature,
			jsApiList: ['scanQRCode']
		});
		wx.ready(function () {
			wx.scanQRCode({ 
			   needResult : 1, 
			   scanType : [ "barCode" ], 
			   success : function(res) { 
			   
			    var result = res.resultStr.split(',')[1]; 
			    if(result!=undefined && result!=null && result!='' ){
			    	if(result.length>6){
				    	theajax.post(serverUrl + "/shop/getBybarcodeAndShopId",{
							"barcode":result,"shopId":shopId
						},function(data) {
							addProductinCart(data.goods.goodsId,0,0,1,-1)
							window.location.href="/payment/rack-shopping.html?shopId="+shopId
						})
			    	}else{
			    		alert('条形码识别失败，请重新扫描')
			    	}
			    }else{
			    	alert('请扫描货架上商品的条形码')
			    }
			   
			   }, 
			   fail : function(res) { 
			    console.log(res) 
			    alert(JSON.stringify(res)+" 1"); 
			    setCookie('jsDebug','scanQRCode error',60/24/60)
			   } 
			  			
			});
		})
	})
}