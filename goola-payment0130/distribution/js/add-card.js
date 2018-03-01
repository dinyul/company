(function(api,util,ajax){
				$('body').find('.app-top').hide()
				var id,tel,telphone,wxName,distributionUserCardModularId,version;
				ajax.post(api.baseServerUrl + "/userCard/getUserCard",{
				},function(data) {
					id=data.id
					version=data.version
					tel=data.telphone
					wxName=data.wxName
					var obj = {data:data,picUrl:api.picUrl}
					util.render("#addcard", obj, ".addcard");
					$('.templet div img:first').addClass('choiced')
					telphone=tel
					$(".code-img").qrcode(
						{correctLevel:0,text:data.expandIndexUrl});
					$('.head img').attr('src',(data.photo).replace("http://wx.qlogo.cn","//"+window.location.host))
					$('.head p').html(data.wxName)
				});
				
				
				//电话号隐藏
				$('.addcard').delegate('.tel-hide','click',function(){
					var a=$(this).parent().find('span').html()
					
					if(a==tel){
						var b=a.replace(a,'&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;')
						$(this).find('img').attr("src",'imgs/766047301906886417.png')
						telphone=""
					}else{
						var b=a.replace(a,tel)
						$(this).find('img').attr("src",'imgs/521371215878092645.png')
						telphone=tel
					}
					$(this).parent().find('span').html(b)
				})
				$('.addcard').delegate('.del','click',function(){
					$(this).prev().val('')
				})
				//选择模板
				$('.addcard').delegate('#templet img','click',function(){
					$('#templet img').removeClass('choiced')
					$(this).addClass('choiced')
				})
				$('.addcard').delegate('.preview-card','click',function(){
					var name=$('.addcard').find('.write-name').val()
					var wxName=$('.addcard').find('.write-wxId').val()
					if(name==''){
						alert('姓名不能为空')
						return false
					}
					if(hzlength(name)>15){
			    		alert("姓名不能超过15个字符");
			    		return false
			   	 	}
					if(wxName==''){
						alert('微信号不能为空')
						return false
					}
					if(hzlength(wxName)>15){
			    		alert("微信号不能超过15个字符");
			    		return false
			   	 	}
					$('.addcard').hide()
					$('.preview').show()
					previewImg()
					
				})
				$('.preview').delegate('.revise-card','click',function(){
					$('.preview').hide()
					$('.addcard').show()
				})
				
			$(document).ready( function(){ 
				$(".preview").delegate('.create-card',"click", function(event) {   
			            event.preventDefault();    
			            alert("名片生成中，请稍候...")
               			$('.goola-alert').css('height',"2.265625rem").css('overflow','hidden')
			    });
			    $(".addcard").delegate('.create-card',"click", function(event) {   
			            event.preventDefault();   
		            	var name=$('.addcard').find('.write-name').val()
						var wxName=$('.addcard').find('.write-wxId').val()
						if(name==''){
							alert('姓名不能为空')
							return false
						}
						if(hzlength(name)>15){
				    		alert("姓名不能超过15个字符");
				    		return false
				   	 	}
						if(wxName==''){
							alert('微信号不能为空')
							return false
						}
						if(hzlength(wxName)>15){
				    		alert("微信号不能超过15个字符");
				    		return false
				   	 	}
						$('.addcard').css('position','relative').css('z-index',5).css('background','#F1EDEE')
						$('.preview').show().css('position','fixed').css('top','0').css('z-index',1).css('width','100%')
						previewImg()
						alert("名片生成中，请稍候...")
                		$('.goola-alert').css('height',"2.265625rem").css('overflow','hidden')
						setTimeout(main.html2Canvas(),2000)
					
						
						
			    });
			}); 
			
			function previewImg(){
				var creatBg=$('.addcard').find('.choiced')
				$('.preview').find('.createBg').attr('src',creatBg.attr('src'))
				distributionUserCardModularId=creatBg.attr('id')
				$('.preview').find('.name').html($('.addcard').find('.write-name').val())
				$('.preview').find('.wx-Id').html($('.addcard').find('.write-wxId').val())
				if($('.addcard').find('.tel').html()==tel){
					$('.preview').find('.telphone').html($('.addcard').find('.tel').html())
				}else{
					$('.preview').find('.telphone').html('保密')
				}
			}
			/*function creatImg(){
				var w = $('#createimg').width() ; //这是我们准备画的div
				var h =  $('#createimg').height() ;
				var canvas = document.createElement("canvas");
				canvas.width = w * 2;
				canvas.height = h * 2;
				canvas.style.width = w+ "px";
				canvas.style.height = h + "px";
				console.log('w='+w+'h='+h)
				var context = canvas.getContext("2d");
				//然后将画布缩放，将图像放大两倍画到画布上
				context.scale(2,2);
				html2canvas(document.getElementById("createimg"), {    
				            allowTaint: true,    
				            taintTest: false,
				            canvas:canvas,
				            onrendered: function(canvas) {    
				                canvas.id = "mycanvas";    
				                //document.body.appendChild(canvas);    
				                //生成base64图片数据    
				               var dataURL = canvas.toDataURL();
				               ajax.post(api.baseServerUrl + "/userCard/saveOrUpdateUserCard",{
				            	"id":id,
				            	"version":version,
				            	"distributionUserCardModularId":distributionUserCardModularId,
				            	"realName":$('.addcard').find('.write-name').val(),
				            	"telphone":telphone,
				            	"wxNumber":$('.addcard').find('.write-wxId').val(),
				            	"wxName":wxName,
				            	"userCardImg":encodeURI(dataURL)
							},function(data) {

								window.location.href="business-card.html"
							},function(data){
							});
				            } 
				        });
			        
			}*/
			var main = {
        init:function(){
            main.setListener();
        },
        //设置监听事件
        setListener:function(){
            var btnShare = document.getElementById("create-card");
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
            var shareContent = document.getElementById('createimg');// 需要绘制的部分的 (原生）dom 对象 ，注意容器的宽度不要使用百分比，使用固定宽度，避免缩放问题
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
                console.log(dataURL)
                window.location.href=dataURL
                if(dataURL!=''&&dataURL!=undefined&&dataURL!=null){
		            ajax.post(api.baseServerUrl + "/userCard/saveOrUpdateUserCard",{
			            	"id":id,
			            	"version":version,
			            	"distributionUserCardModularId":distributionUserCardModularId,
			            	"realName":$('.addcard').find('.write-name').val(),
			            	"telphone":telphone,
			            	"wxNumber":$('.addcard').find('.write-wxId').val(),
			            	"wxName":wxName,
			            	"userCardImg":encodeURI(dataURL)
						},function(data) {
							window.location.href="business-card.html"
						},function(data){
					});
				}
            });
        }
    };

    //最后运行代码
    main.init();

			})(goola.api,goola.util,goola.ajax)