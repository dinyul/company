(function(api,util,ajax,address){
	var pageNo=1;
	var total;
	var pageTotal;
	var id=util.getUrlParams("id")
	var shopId=util.getUrlParams("shopId")
	var carHelper = new CartHelper(id,"backconfirm");
	var goodsName=''
	list(goodsName)
	function list(goodsName,pageNo,pageSize){
		ajax.post(api.mobileServerUrl + "/shopWX/returnVoucher/returnVoucherDetailL",{
			"id":id,"goodsName":goodsName,"pageSize":pageSize,"pageNo":pageNo
		},function(data){
			var GoodsCount,RepertoryCount
			$('.apply-title').html(data.shopName)
			for(var i=0; i<data.dataList.rows.length; i++){
				GoodsCount=Number(data.dataList.rows[i].applyNum)
				carHelper.Add(data.dataList.rows[i].goodsId,GoodsCount,-1)
			}
			
			var car = carHelper.Read();
			var items = car.Items;
			var obj={data:data.dataList.rows,picUrl:api.picUrl,items:items}
			total=data.dataList.total
			pageTotal=parseInt(total/pageSize)+1
			var doTtmpl = doT.template($('#goods').html());
			var html = doTtmpl(obj);
			$('.goods').append(html)
		})
	}
	$(window).on('scroll', doSth)
	
	function doSth() {
		var totalheight=parseFloat($(window).height()+$(window).scrollTop())
		if($(document.body).height()<=totalheight){
			if($('.goods').find('li').length>=total){
				//$('.none').show()
				$(window).off('scroll', doSth);
				return false
			}
			if(pageNo>=pageTotal){
				//$('.none').show()
				$(window).off('scroll', doSth);
				return false
			}
			pageNo=pageNo+1
			list(goodsName,pageNo,20)
			
		}
	};
	$('.purchase-search p').click(function(){
		if($('.purchase-search input').val()!=''){
			goodsName=$('.purchase-search input').val()
			pageNo=1
			$('.goods').html('')
			list(goodsName,1,20)
			$(window).on('scroll', doSth)
		}
	})
		
	$('.goods').delegate('.buhuo .add','click',function(){
		$(this).prev().html(Number($(this).prev().html())+1)
		$(this).parent().parent().parent().parent().parent().find('.yingyoukucun').html(Number($(this).parent().parent().parent().find('.bencibuhuo').html())-Number($(this).prev().html()))
		$(this).parent().parent().parent().parent().parent().find('.yingyou .num').html(Number($(this).parent().parent().parent().parent().parent().find('.yingyou .num').html())<=0?0:Number($(this).parent().parent().parent().parent().parent().find('.yingyou .num').html())-1)
		huosun($(this).parent().parent().parent().parent().parent().find('.yingyou .num').html(),$(this).parent().parent().parent().parent().parent().find('.yingyoukucun').html(),$(this).parent().parent().parent().parent().parent().find('.goodslist-bottom'))
		ChangeGoodsCount($(this).parent().attr('goodsId'),$(this).prev().html(),'')
	})
	$('.goods').delegate('.buhuo .minus','click',function(){
		if(Number($(this).next().html())<=0){
			alert('实际回库量不能为负')
			return
		}
		$(this).next().html(Number($(this).next().html())-1)
		$(this).parent().parent().parent().parent().parent().find('.yingyoukucun').html(Number($(this).parent().parent().parent().find('.bencibuhuo').html())-Number($(this).next().html()))
		$(this).parent().parent().parent().parent().parent().find('.yingyou .num').html(Number($(this).parent().parent().parent().parent().parent().find('.yingyou .num').html())+1)
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
			alert('出库后库存量不能为负')
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
		var carHelper = new CartHelper(id,"backconfirm");
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
			obj.goodsId =$(this).attr('goodsId');
			obj.realBackNum = $(this).find('.buhuo .num').html();
			obj.shopGoodsStock = $(this).find('.yingyou .num').html();
			shopRefillSplitInfoGoodsList.push(obj);
			goodsIds = goodsIds + $(this).attr('goodsId')+",";
		})
		goodsIds=goodsIds.substring(0,goodsIds.length-1)
		ajax.post(api.mobileServerUrl + "/shopWX/returnVoucher/inventoryReturnVoucher",{
			"id":id,
			"shopGoodsStr":JSON.stringify(shopRefillSplitInfoGoodsList)
		},function(data){
			alert('回库成功')
			delCartGods(goodsIds)
			window.location.href="/mobilerack/purchase/backlibrary/record.html?shopId="+shopId
		})
	})
	function delCartGods(ids){
		var idArr = new Array();
		idArr = ids.split(",");
		var carHelper = new CartHelper(id,"backconfirm");
		for(var i=0;i<idArr.length;i++){
			carHelper.Del(idArr[i]);
		}
	}	
})(goola.api,goola.util,goola.ajax,goola.address);