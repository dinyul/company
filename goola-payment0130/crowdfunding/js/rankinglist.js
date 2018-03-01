(function(api,util,ajax){
	var type = util.getUrlParams("type");
	infoList('aixin',3,"次")
	infoList('tuhao',1,"元")
	infoList('renyuan',4,"")
	infoList('renqi',2,"次")
	function infoList(ele,rankType,a){
		ajax.post(api.baseServerUrl + "/crowdfunding/openAuthority/getTopRanks",{
			"rankType":rankType
		},function(data) {
			var message
			for(var j=0;j<3;j++){
				if(data[j].rankType==3){
					message=data[j].supportCount
				}else if(data[j].rankType==1){
					message=data[j].supportPrice
				}else if(data[j].rankType==2){
					message=data[j].receiveCount
				}else if(data[j].rankType==4){
					message=timeStamp(Number(data[j].soonestFinishTime)/1000)
				}
				var contentTop='<li>\
								<img src="'+data[j].photo+'" class="touxiang"/>\
								<p>'+data[j].nickname+'</p>\
							</li>'	
				$('.'+ele).find('.content-top').append(contentTop)
			}
			for(var z=3;z<data.length;z++){
				if(data[z].rankType==3){
					message=data[z].supportCount
				}else if(data[z].rankType==1){
					message=(data[z].supportPrice).toFixed(2)
				}else if(data[z].rankType==2){
					message=data[z].receiveCount
				}else if(data[z].rankType==4){
					message=timeStamp(Number(data[z].soonestFinishTime)/1000)
				}
				var  contentBottom='<li>\
									<span>'+(z+1)+'</span>\
									<img src="'+data[z].photo+'" />\
									<p>'+data[z].nickname+'</p>\
									<a>'+message+a+'</a>\
								</li>'
				$('.'+ele).find('.content-bottom').append(contentBottom)
			}
				
		})
	}
	if(type=="aixin"){
		$('#aixin').addClass('choiced')
		$('.aixin').show()
	}else if(type=="tuhao"){
		$('#tuhao').addClass('choiced')
		$('.tuhao').show()
	}else if(type=="renyuan"){
		$('#renyuan').addClass('choiced')
		$('.renyuan').show()
	}else if(type=="renqi"){
		$('#renqi').addClass('choiced')
		$('.renqi').show()
	}else{
		$('#aixin').addClass('choiced')
		$('.aixin').show()
	}
	$('.rankinglist-top li').click(function(){
		$('.rankinglist-top li').removeClass('choiced')
		$(this).addClass('choiced')
		var name=$(this).attr('id')
		$('.content div').hide()
		$('.rankinglist-info div').hide()
		$('.'+name).show()
		$('.'+name+'-info').show()
	})
	
	function timeStamp( second_time ){  
		var time = parseInt(second_time) + "秒";  
		if( parseInt(second_time )> 60){  
		    var second = parseInt(second_time) % 60;  
		    var min = parseInt(second_time / 60);  
		    time = min + "分";   
		    if( min > 60 ){  
		        min = parseInt(second_time / 60) % 60;  
		        var hour = parseInt( parseInt(second_time / 60) /60 );  
		        time = hour + "小时" + min + "分";  
		        if( hour > 24 ){  
		            hour = parseInt( parseInt(second_time / 60) /60 ) % 24;  
		            var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );  
		            time = day + "天" + hour + "小时" + min + "分";  
		        }  
		    }  
		}   
		return time;          
		}  
})(goola.api,goola.util,goola.ajax)