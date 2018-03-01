(function(api,util,ajax,address){
	var pageNo=1,pageSize=20;
	var total;
	var pageTotal;
	var id=util.getUrlParams("id")
	var shopId=util.getUrlParams("shopId")
	var carHelper = new CartHelper(shopId,id);
	var goodsName=''
	list(goodsName)
	function list(goodsName){
		ajax.post(api.mobileServerUrl + "/shopWX/shopWXRefillTotalInfo/findRefillById",{
			"id":id,"shopId":shopId,"goodsName":goodsName
		},function(data){
			var GoodsCount,RepertoryCount
			$('.apply-title').html(data.data.rows[0].shopRefillSplitInfoGoodsList[0].shopName)
			for(var i=0; i<data.data.rows[0].shopRefillSplitInfoGoodsList.length; i++){
				GoodsCount=Number(data.data.rows[0].shopRefillSplitInfoGoodsList[i].shopRefillTotalInfoGoods.outGoodsCount)
				//RepertoryCount=GoodsCount+Number(data[i].shopStock)
				carHelper.Add(data.data.rows[0].shopRefillSplitInfoGoodsList[i].goodsId,GoodsCount,-1)
			}
			
			var car = carHelper.Read();
			var items = car.Items;
			var obj={data:data.data.rows,picUrl:api.picUrl,items:items}
			total=data.data.total
			pageTotal=parseInt(total/pageSize)+1
			var doTtmpl = doT.template($('#goods').html());
			var html = doTtmpl(obj);
			$('.goods').append(html)
		})
	}
	
	$('.purchase-search p').click(function(){
		if($('.purchase-search input').val()!=''){
			goodsName=$('.purchase-search input').val()
			pageNo=1
			$('.goods').html('')
			list(goodsName)
			$(window).on('scroll', doSth)
		}
	})
		
	$('.goods').delegate('.buhuo .add','click',function(){
		if(Number($(this).prev().html())>=Number($(this).prev().attr("outGoodsCount"))){
			alert('已超出可补货数量')
			return
		}
		$(this).prev().html(Number($(this).prev().html())+1)
		$(this).parent().parent().parent().parent().parent().find('.yingyoukucun').html(Number($(this).parent().parent().parent().parent().parent().find('.yingyoukucun').html())+1)
		$(this).parent().parent().parent().parent().parent().find('.yingyou .num').html(Number($(this).parent().parent().parent().parent().parent().find('.yingyou .num').html())+1)
		huosun($(this).parent().parent().parent().parent().parent().find('.yingyou .num').html(),$(this).parent().parent().parent().parent().parent().find('.yingyoukucun').html(),$(this).parent().parent().parent().parent().parent().find('.goodslist-bottom'))
		ChangeGoodsCount($(this).parent().attr('goodsId'),$(this).prev().html(),'')
	})
	$('.goods').delegate('.buhuo .minus','click',function(){
		if(Number($(this).next().html())<=0){
			alert('实际补货量不能为负')
			return
		}
		$(this).next().html(Number($(this).next().html())-1)
		
		$(this).parent().parent().parent().parent().parent().find('.yingyoukucun').html(Number($(this).parent().parent().parent().parent().parent().find('.yingyoukucun').html())-1)
		$(this).parent().parent().parent().parent().parent().find('.yingyou .num').html(Number($(this).parent().parent().parent().parent().parent().find('.yingyou .num').html())>0?Number($(this).parent().parent().parent().parent().parent().find('.yingyou .num').html())-1:0)
		huosun($(this).parent().parent().parent().parent().parent().find('.yingyou .num').html(),$(this).parent().parent().parent().parent().parent().find('.yingyoukucun').html(),$(this).parent().parent().parent().parent().parent().find('.goodslist-bottom'))
		ChangeGoodsCount($(this).parent().attr('goodsId'),$(this).next().html(),'')
	})			
	
	$('.goods').delegate('.yingyou .add','click',function(){
		$(this).prev().html(Number($(this).prev().html())+1)
		huosun(Number($(this).prev().html()),Number($(this).parent().parent().parent().find('.yingyoukucun').html()),$(this).parent().parent().parent())
		ChangeGoodsCount($(this).parent().attr('goodsId'),$(this).parent().parent().parent().parent().find('.buhuo .num').html(),$(this).prev().html())
	})
	$('.goods').delegate('.yingyou .minus','click',function(){
		if(Number($(this).next().html())==0){
			alert('补货后库存量不能为负')
			return
		}
		$(this).next().html(Number($(this).next().html())-1)
		huosun(Number($(this).next().html()),Number($(this).parent().parent().parent().find('.yingyoukucun').html()),$(this).parent().parent().parent())
		ChangeGoodsCount($(this).parent().attr('goodsId'),$(this).parent().parent().parent().parent().find('.buhuo .num').html(),$(this).next().html())
	})
	function huosun(a,b,s){
		if(a-b>0){
			s.find('h3').html('本次货损：盈余量 '+(a-b))
		}else if(a-b<0){
			s.find('h3').html('本次货损：货损量 '+(b-a))
		}else if(a-b==0){
			s.find('h3').html('本次货损：无货损')
		}
	}
	
	function ChangeGoodsCount(goodsId,count,count1){
		var carHelper = new CartHelper(shopId,id);
		carHelper.ChangeGoodsCount(goodsId,count,count1);
	}
	
	
	$('.purchase-bottom').click(function(){
		$('.address-firm').show()
		$('.bg').show()
	})
	$('.cancel').click(function(){
		$('.address-firm').hide()
		$('.bg').hide()
	})
	$('.address-firm .confirm').click(function(){
		var shopRefillSplitInfoGoodsList= new Array()
		var goodsIds=""
		$('.goods').find('li').each(function(){
			var obj = new Object();
			obj.id =$(this).attr('id');
			obj.realGoodsCount = $(this).find('.buhuo .num').html();
			obj.realLeftCount = $(this).find('.yingyou .num').html();
			shopRefillSplitInfoGoodsList.push(obj);
			goodsIds = goodsIds + $(this).attr('goodsId')+",";
		})
		goodsIds=goodsIds.substring(0,goodsIds.length-1)
		ajax.post(api.mobileServerUrl + "/shopWX/shopWXRefillTotalInfo/refilling",{
			"id":id,
			"shopRefillSplitInfoGoodsList":JSON.stringify(shopRefillSplitInfoGoodsList)
		},function(data){
			alert('补货成功')
			delCartGods(goodsIds)
			window.location.href="/mobilerack/purchase/replenish/record.html?shopId="+shopId
		})
	})
	function delCartGods(ids){
		var idArr = new Array();
		idArr = ids.split(",");
		var carHelper = new CartHelper(shopId,id);
		for(var i=0;i<idArr.length;i++){
			carHelper.Del(idArr[i]);
		}
	}	
})(goola.api,goola.util,goola.ajax,goola.address);