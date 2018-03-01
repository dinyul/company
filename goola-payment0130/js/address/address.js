var addressList;
var getAddressList
	(function(api, util, ajax){
		//获得地址列表
		
		getAddressList=function getAddressList(){
			ajax.post(api.baseServerUrl + "/addr/querySelectByUserId",{
			},function(data) {
				addressList = data.rows;
				util.render("#addressList", data.rows, "#addressDiv");
			});
		}
		getAddressList();
	
		$('.arrowGrey').each(function(i) {
		   $(this).click(function(){
				edit(addressList[i]);
			}); 		                   
		});
		//修改默认地址
		function changeDefaultAddress(addressId){
			ajax.post(api.baseServerUrl + "/addr/changeDefaultAddress",{
				addressId:addressId
			},function(data) {
				if(addressId==getCookie('addressId')){
					setCookie('addressId','')
				}
			});
		}
		//保存地址
		function saveAddress(){
			var name = $(".addAddress #name").val();
			var phone = $(".addAddress #phone").val();
			var address = $(".addAddress #address").val();
			var provinceName = $(".addAddress #provinceName").val();
			var cityName = $(".addAddress #cityName").val();
			var addressId = $(".addAddress #addressId").val();
			var card=$('.addAddress .idcode input').val()
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
			if(card!='' && !(/(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(card))){
				alert('身份证号输入错误');
				return false;
			}
			ajax.post(api.baseServerUrl + "/addr/saveAddress",{
				"name":name,
				"phone":phone,
				"address":address,
				"provinceName":provinceName,
				"cityName":cityName,
				"addressId":addressId,
				"isDefault":isDefault,
				"card":card
			},function(data) {
				getAddressList();
				$('.guanlidizhi').show()
				$('.addAddress').hide()
			});
		}

		//删除地址
		function deleteAddress(addressId){
			ajax.post(api.baseServerUrl + "/addr/deleteAddressByAddressIds",{
				"ids":addressId		
			},function(data) {
				if(addressId==getCookie('addressId')){
					setCookie('addressId','')
				}
				getAddressList();
			});
			
		}
		
		//修改默认地址
		$('.address').delegate('.moren','click',function(){
			$('.address .default').removeClass('checked')
			$(this).find('.default').addClass('checked')
			var addressId=$(this).parent().parent().parent().attr('id')
			changeDefaultAddress(addressId)
		})
		//删除地址
		$('.address').delegate('.address-delete','click',function(){
			$('.bg').css('display','block')
			$('.guanlidizhi .address-firm').css('display','block')
			$(this).addClass('remove')
			document.body.ontouchmove=function(){
						return false;
					}
		})
		//返回
		
		$('.addAddress .fanhui-btn').click(function(){
			$('.guanlidizhi').show()
			$('.addAddress').hide()
		})
		
		$('.guanlidizhi .cancelAddress').click(function(){
			$('.bg').css('display','none')
			$('.guanlidizhi .address-firm').css('display','none')
			document.body.ontouchmove=function(){
					return true;
				}
		})
		$('.guanlidizhi .deleteAddress').click(function(){
			$('.bg').css('display','none')
			$('.guanlidizhi .address-firm').css('display','none')
			document.body.ontouchmove=function(){
					return true;
				}
			var addressId=$('.remove').parent().parent().parent().attr('id')
			deleteAddress(addressId)
		})
		//修改地址
		$('.address').delegate('.address-change','click',function(){
			    var addr=$(this).parent().parent().parent()
			    $('.del').hide()
				$('.guanlidizhi').hide()
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
			$('.guanlidizhi').hide()
			$('.addAddress').show()
			$('.del').hide()
		})
		$('.inp').keydown(function(){
			$(this).next().css('display','block')
		})
		$('.del').click(function(){
					$(this).prev().val('')
					$(this).css('display','none')
				})
		$('.address-add .default').click(function(){
			$(this).toggleClass('checked')
		})
		//保存新地址
		$('.addAddress').delegate('.bottom','click',function(){
			saveAddress()
			
		})
		
		$('.img').delegate('input[type="file"]','change',function(){
			var fileList=this.files
        	 for (var i = 0; i < fileList.length; i++) {
        	 	if(fileList[i].size>3145728){
        	 		alert('上传图片不可大于3M，请重新上传')
        	 		return false
        	 	}
        	 	 var imgUrl = window.URL.createObjectURL(fileList[i]);
        	 	 $(this).parent().css('background-image','url('+imgUrl+')')
        	 }
        	addPic()
		})

		var title="更好甄选—更好·不贵"
		var doc="种草全世界的好货"
		shareInfo(ajax, api.baseServerUrl, location.href.split('#')[0].replace(/&/g,"|"),title,doc,"http://" + document.domain + "/index.html","http://" + document.domain +"/imgs/shouye-share.png");
	})(goola.api, goola.util, goola.ajax)

function backNex(){
	$("#pageAddContacts").hide();
	$("#pagedzb").show();
}

