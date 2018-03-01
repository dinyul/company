(function(api, util, ajax){
	
	var providerId = util.getUrlParams("providerId");
	
	
	var title,doc,shareImg
	
	ajax.post(api.baseServerUrl + "/inShop/shopHomePage",{
			"providerId":providerId
		},function(data) {
			var obj = {data:data,picUrl:api.picUrl};
			util.render("#shopinfo",obj, ".shopinfo")
			$('.imglist ul').css('width',(2.5+0.3125)*$('.imglist ul').find('li').length-0.3125+'rem')
			$("#code").qrcode({width:400,height:400,correctLevel:0,text:"http://"+ document.domain +"/shop/shop.html?providerId="+providerId});
			
			if($('#createimg').find('canvas').length>0 && $('#createimg').find('img').length>0){
				main.html2Canvas()
			}
			title=data.shopName
			doc=data.introduction
			shareImg=data.shopSign
			shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),title,doc,"http://" + document.domain + "/shop/shop.html?providerId="+providerId,"http://" + document.domain +api.picUrl+shareImg);
		});
			
		
	var main = {
	        init:function(){
	            main.setListener();
	        },
	        //设置监听事件
	        setListener:function(){
	        	/*window.onload=function(){
	        		main.html2Canvas();
	        	}*/
	        	var btnShare = document.getElementById("createimg");
	            btnShare.onclick = function(){
	                main.html2Canvas();
	            }
	           
	        },
	        //获取像素密度
	        getPixelRatio:function(context){
	            var backingStore = context.backingStorePixelRatio ||
	                    context.webkitBackingStorePixelRatio ||
	                    context.mozBackingStorePixelRatio ||
	                    context.msBackingStorePixelRatio ||
	                    context.oBackingStorePixelRatio ||
	                    context.backingStorePixelRatio || 1;
	            return (window.devicePixelRatio || 1) / backingStore;
	        },
	        //绘制dom 元素，生成截图canvas
	        html2Canvas: function () {
	        	var shareContent = document.getElementById('e-code');// 需要绘制的部分的 (原生）dom 对象 ，注意容器的宽度不要使用百分比，使用固定宽度，避免缩放问题
	            var width = shareContent.offsetWidth;  // 获取(原生）dom 宽度
	            var height = shareContent.offsetHeight; // 获取(原生）dom 高
	            var offsetTop = shareContent.offsetTop;  //元素距离顶部的偏移量
				
	            var canvas = document.createElement('canvas');  //创建canvas 对象
	            var context = canvas.getContext('2d');
	            var scaleBy = main.getPixelRatio(context);  //获取像素密度的方法 (也可以采用自定义缩放比例)
	            canvas.width = width * scaleBy;   //这里 由于绘制的dom 为固定宽度，居中，所以没有偏移
	            canvas.height = (height + offsetTop) * scaleBy;  // 注意高度问题，由于顶部有个距离所以要加上顶部的距离，解决图像高度偏移问题
	            context.scale(scaleBy, scaleBy);
	
	            var opts = {
	                allowTaint:true,//允许加载跨域的图片
	                tainttest:true, //检测每张图片都已经加载完成
	                scale:scaleBy, // 添加的scale 参数
	                canvas:canvas, //自定义 canvas
	                logging: true, //日志开关，发布的时候记得改成false
	                width:width, //dom 原始宽度
	                height:height //dom 原始高度
	            };
	            html2canvas(shareContent, opts).then(function (canvas) {
	                var dataURL = canvas.toDataURL();     
	                
	                $('.ercode').html("<p class='title'>店铺二维码</p>\
	                <img src='"+dataURL+"' />\
	                <p style='text-align: center;color: #C7A994;font-family: PingFangsc-Regulat;font-size:0.375rem;padding-bottom:0.5rem'>长按图片保存转发</p>")
	                $('.bgbai').css('display','none')
	            });
	        }
	    };
		//main.init()
		$('.bottom').click(function(){
			if(isWeiXin()){
				$('body').append('<div class="shareinfo-bg">\
					<img src="/distribution/imgs/fenxiang.png" />\
					<a>知道啦</a>\
				</div>')
			}else{
				toShare(title,doc,"http://" + document.domain + "/shop/shop.html?providerId="+providerId,"http://" + document.domain +api.picUrl+shareImg);
			}
			
			
			$('.shareinfo-bg a').click(function(){
				$(this).parent().remove()
			})
		})
		
	})(goola.api, goola.util, goola.ajax)