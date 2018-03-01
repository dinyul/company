(function(api,util,ajax){
					$('body').find('.app-top').hide()
					$('body').css('background','#fff')
					$('.del').click(function(){
						$('.title input').val('')
					})
					function setHeight(element) {
					  $(element).css({'height':'auto','overflow-y':'hidden'}).height(element.scrollHeight);
					}
					
					$('textarea').css('height','10.3125rem')
					$('.add-pic a').click(function(){
						$(this).parent().hide()
						$('.z_photo').show()
						$('textarea').each(function () {
						  setHeight(this);
						}).on('input', function () {
						  setHeight(this);
						});
						addPic()
					})
					$('.z_photo').delegate('input[type="file"]','change',function(){
						var fileList=this.files
			        	 for (var i = 0; i < fileList.length; i++) {
			        	 	if(fileList[i].size>3145728){
			        	 		alert('上传图片不可大于3M，请重新上传')
			        	 		$(this).parent().html('<input type="file" name="file" accept="image/*" />')
			        	 		return false
			        	 	}
			        	 	 var imgUrl = window.URL.createObjectURL(fileList[i]);
			        	 	 $('.photo').append('<div class="z_addImg"><img src='+imgUrl+' /><a></a></div>')
			        	 }
			        	addPic()
					})
					
					$('.photo').delegate('.z_addImg a','click',function(){
						$('.z_file:eq('+$(this).parent().index()+')').html('<input type="file" name="file" accept="image/*" />')
						$(this).parent().remove()
						addPic()
					})
					$('#area').keyup(function(){
						var maxChars = 1000;//最多字符数     
			            var curr = maxChars - getByteLen($(this).val());
			            if (curr > 0) {
			               $('.add-pic p span').html(curr.toFixed(0));
			            } else {
			                $('.add-pic p span').html(0);
			            }
					})
					
					function addPic(){
						$('.z_file').hide()
						if($('.z_addImg').length==0){
			        	 	$('.z_file1').show()
			        	 }else if($('.z_addImg').length==1){
			        	 	$('.z_file2').show()
			        	 }else if($('.z_addImg').length==2){
			        	 	$('.z_file3').show()
			        	 }
					}
					$('.add-bottom input').click(function(){
						if(getByteLen($('.title input').val())==0||getByteLen($('.title input').val())>30){
							alert('标题格式不正确')
							return false;
						}
						if(getByteLen($('#area').val())==0||getByteLen($('#area').val())>1000){
							alert('正文格式不正确')
							return false;
						}
						ajaxSubmitForm()
					})
					function ajaxSubmitForm() {
				   　　　　var option = {
				         　　 url : api.baseServerUrl + "/distributionMaterial/saveOrUpdateMaterial",
				        　　  type : 'POST',
				         　　 headers : {"ClientCallMode" : "ajax"}, //添加请求头部
				        　　  success : function(data) {
				        	data=jQuery.parseJSON(data)
				        	if(data.message=="调用成功"){
				        		 window.location.href="database.html"
				        	}else{
				        		alert(data.message)
				        	}
				          },
				          error:  function(XMLHttpRequest, textStatus, errorThrown) {
	                        
	                    }
				       };
					      $("#form").ajaxSubmit(option);
					      return false; //最好返回false，因为如果按钮类型是submit,则表单自己又会提交一次;返回false阻止表单再次提交
					 }
					
					
					
					
			})(goola.api,goola.util,goola.ajax)