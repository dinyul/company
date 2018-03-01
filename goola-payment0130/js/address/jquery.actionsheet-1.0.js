/*!
 * Collapsible, jQuery Plugin
 * jquery.actionsheet-1.0.js
 *
 * Copyright (c) 2014
 * author: Bian Kaiming (Walle)
 * @ version: 1.0.1
 *
 * Date: 7/28 17:59 2015
 */
 ;(function($){
	$.fn.actionsheet = function(options){
		var defaultVal = {
			title : false, 				//消息头，为空或字符串
			textArr : ["是","否"],		//消息文本
			icon : false,				//图标路径,不填或false为无图标，true为默认图标
			opacity : 0.2,				//屏幕锁层透明度
			cancelText : "取消",		//取消按钮文本
			lockEvent : true,
			cancelImgUrl : "",			//取消按钮图标路径
			callback : function(){},	//正确选择回调函数
			cancel : function(){}		//取消后要执行的函数
		};
		var options = $.extend(defaultVal,options);	
		
		return this.each(function(){
			
			var _self = $(this);
		
			var building = {//构建
				init : function(){
					var actionsheet_html = this.build_alert();
					$(_self).append(actionsheet_html);
					screen_lock("body");
					building.position();
					$("#actionsheet_cancel").on("click",function(){//取消函数
						removeactionsheet();
						options.cancel(options.textArr);
					});
					if(options.lockEvent){
						$("#screen_lock").on("click",function(){//取消函数
							removeactionsheet();
							options.cancel(options.textArr);
						});
					}else{

					}
					$("p","#haodai_actionsheet").on("click",function(){
						options.callback($(this).text(),$(this).attr("id").substr(7),options.textArr);
						removeactionsheet();
					});
				},
				stru : {
					actionsheet_star : "<div id='haodai_actionsheet'>",//最外层
					info_star : "<div id='haodai_info'>",//信息层
					textArr : function(){
							var conTextArr = "";
							for(var i in options.textArr){
								conTextArr = conTextArr + "<p id='choose_" + i + "'>"+ options.textArr[i] +"</p>"
							}
							return conTextArr;
						},//文字层
					icon : "<img src='"+ options.icon +"' />",//图标
					btn_star : "<div id='actionsheet_btn'>",//按钮层
					cancel : function(){
						if(options.cancelImgUrl != ""){
							return "<button type='button' id='actionsheet_cancel'>" + "<img src='"+ options.cancelImgUrl +"' />" + options.cancelText +"</button>";
						}else{ 
							return "<button type='button' id='actionsheet_cancel'>"+ options.cancelText +"</button>";
						}
					},//Cancel按钮
					div_end : "</div>"
				},
				position : function(){
						var h = $("#haodai_actionsheet").height();
						$("#haodai_actionsheet").css("bottom",-h);
						$("#haodai_actionsheet").animate({
							bottom:0
						},150);
				},
				build_alert : function(){
					var layer = this.stru.actionsheet_star + 
								this.stru.info_star;
					if(options.icon){
						layer += this.stru.icon;
					}
					layer += this.stru.textArr();
					layer += this.stru.div_end;
					layer += this.stru.btn_star;
					layer += this.stru.cancel();
					layer += this.stru.div_end;
					layer += this.stru.div_end;
					return layer;
				}
			};

			//从DOM中删除
			var removeactionsheet = function(){
				var h = $("#haodai_actionsheet").height();
				$("#haodai_actionsheet").animate({
					bottom : -h
				},150,function(){
					$(this).remove();
					$("#screen_lock").fadeOut(150,function(){
						$(this).remove()
					});
					//$("body").css("overflow","auto");
				});
			};

			//屏幕锁
			var screen_lock = function(con){
				//var screenH =  window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
				var scrollH = $(document).height();
				var heigh = parseFloat(scrollH);
				//$("body").css("overflow","hidden");
				var lock_div = "<div id='screen_lock' style='position:absolute;background:#000;opacity:"+ options.opacity +";top:0px;left:0px;z-index:9998;width:100%;height:"+heigh+"px;'></div>";
				$(con).append(lock_div);
				$("#screen_lock").on('touchmove', function (event) {
				    event.preventDefault();
				}, false);
			}
			
			building.init();
		});
	}
})(jQuery);