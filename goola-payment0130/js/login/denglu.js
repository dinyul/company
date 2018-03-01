(function(api, util,ajax){
	
	       var crowdfundingId = util.getUrlParams("crowdfundingId");
	       var type=util.getUrlParams("type");
	       
	       if(crowdfundingId==''||crowdfundingId==undefined||crowdfundingId==null){
	       	$('.bottom').show()
	       	$('#fanhui').click(function(){
				window.location.href="../index.html"
			})
	       }else{
	       	$('.crowdfunding-bottom').show()
	       	$('#fanhui').click(function(){
				window.location.href = document.referrer;
			})
	       }
			if(browser.versions.ios || browser.versions.android){
				$('.fanhui').hide()
			}
			var countdown=60; 
			function settime(dom) { 
				if (countdown == 0) { 
					dom.removeAttr("disabled") 
					dom.val("获取验证码");
					dom.css('border-left','1px solid #fa2f3e')
							.css('color','#fa2f3e') 
					countdown = 60; 
					return;
				} else { 
					dom.attr("disabled", true) 
					dom.val(countdown+"s后重新发送"); 
					countdown--; 
					} 
				setTimeout(function() { 
					settime(dom) 
				},1000) 
			} 
			$('.code input:button').bind('click',function(){
					$(this).css('border-left','1px solid #e5e5e5')
							.css('color','#bcbcbc')
							//.html(settime($(this)))
					getCaptcha('1',$('.code input:button'))		
					
			})
			$('.bottom button').click(function(){
				login()
			})
			$('.crowdfunding-bottom .fukuan').click(function(){
				window.location.href="../payment/crowdfunding-choukuan.html?crowdfundingId="+crowdfundingId
			})
			$('.crowdfunding-bottom .denglu').click(function(){
				login()
			})
			
			yzm()
			function yzm(){
				$("#captchaimg").attr("src",api.rootUrl + '/servlet/validateCodeServlet?'+new Date().getTime());
			}

			$("#captchaimg").click(function(){
				yzm();
			})
			
			//获取验证码
			function getCaptcha(type,dom){
				var phone = $(".phone input").val();
				if(!(/^1[3|4|5|7|8]\d{9}$/.test(phone))){
					alert("请输入合法的手机号码");
					$('.code input:button').css('color','#fa2f3e')
					return false;
				}
				var validateCode = $("#captcha").val();
				if (validateCode == "") {
					alert("请先输入验证码");
					return false;
				}
				ajax.post(api.rootUrl + "/sendMobileCaptcha",{
					"mobile":phone,"validateCode":validateCode
				},function(data) {
					settime(dom);
					alert("发送成功");
				},function(returnData){
					yzm();
					alert(returnData.message);
				});
			}
			
			//用户登陆
			function login(openId){
			//	var wxUserId = "HL";
				//防止多次点击
				/*$("#logput").one('click', function (event) {    
			                event.preventDefault();    
			                //do something    
			                $(this).prop('disabled', true);   
			            });*/
			    var url = '';
			    if(url == ''){
			    	url = "../index.html";
			    }
				if(!(/^1[3|4|5|7|8]\d{9}$/.test($('.phone input').val()))){
					alert("请输入合法的手机号码");
					return false;
				}
				if($('.code input:text').val() == ''){
					alert("验证码不能为空");
					return false;
				}
				ajax.post(api.rootUrl + "/login",{
					"mobile":$('.phone input').val(),
					"mobileCaptcha":$('.code input:text').val()
				},function(data) {
					if(crowdfundingId!=''&&crowdfundingId!=undefined&&crowdfundingId!=null){
						window.location.href="../payment/crowdfunding-choukuan.html?crowdfundingId="+crowdfundingId
					}else if(type=="rack"){
						window.location.href ="/index.html"
					}else{
						window.location.href = document.referrer;
						
					}
				})
			}
			
	})(goola.api, goola.util, goola.ajax);