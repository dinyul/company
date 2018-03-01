(function(api,util,ajax,address){
	var id = util.getUrlParams("id");
	var shopId=util.getUrlParams("shopId")
	var pageNo=1,pageSize=20;
	var total;
	var pageTotal;
	var goodsName=''
	list(goodsName)
	function list(goodsName,pageNo,pageSize){
		ajax.post(api.mobileServerUrl+"/shopWX/shopWXRefillTotalInfo/findRefillById",{
			"id":id,"shopId":shopId,"goodsName":goodsName
		},function(data){
			$('.apply-title').html(data.data.rows[0].shopRefillSplitInfoGoodsList[0].shopName)
			total=data.data.total
			pageTotal=parseInt(total/pageSize)+1
			var obj={data:data.data.rows,picUrl:api.picUrl}
			var doTtmpl = doT.template($('#purchase-list').html());
			var html = doTtmpl(obj);
			$('.goods').append(html)
			if(data.data.rows[0].status==7 && data.isOps==1){
				$('.purchase-bottom').show()
			}else if(data.data.rows[0].status==1 && data.isOps==0){
				$('.bottom').show()
			}
		})
	}
	$('.bottom').click(function(){
		ajax.post(api.mobileServerUrl+"/shopWX/shopWXRefillTotalInfo/outRefillInfo",{
			"id":id
		},function(data){
			window.location.href="/mobilerack/purchase/replenish/record.html?shopId="+shopId
		})
	})
	
	
	$('.purchase-search p').click(function(){
		if($('.purchase-search input').val()!=''){
			goodsName=$('.purchase-search input').val()
			pageNo=1
			$('.goods').html('')
			list(goodsName)
			$(window).on('scroll', doSth)
		}
	})
	
	$('.nopass').click(function(){
		$('.purchase-list-open').show()
	})
	$('.pass').click(function(){
		submit('',1)
	})
	$('.cancel').click(function(){
		$('.purchase-list-open').hide()
	})
	$('.confirm').click(function(){
		if($('textarea').val()==''){
			alert('审核不通过原因不能为空')
			return false;
		}
		submit($('textarea').val(),8)
	})
	
	function submit(remarks,status){
		ajax.post(api.mobileServerUrl+"/shopWX/shopWXRefillTotalInfo/auditRefill",{
			"id":id,"remarks":remarks,"status":status
		},function(data){
			window.location.href="/mobilerack/purchase/replenish/record.html?shopId="+shopId
		})
	}
	
})(goola.api,goola.util,goola.ajax,goola.address);